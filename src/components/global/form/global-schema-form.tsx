'use client';

import { useState } from 'react';
import { Controller, SubmitHandler } from 'react-hook-form';
import { AnyObject, ObjectSchema, SchemaDescription } from 'yup';
import moment from 'moment';
import { Calendar as CalendarIcon, Check, ChevronDown, ChevronsUpDown, Clock, Loader2Icon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useModal } from '@/components/modal-view/use-modal';
import { YupForm } from './yup-form';

export const SelectItem = (label: string, value: any) => ({ label, value });

type Option = { label: string; value: any };

const normalizeOptions = (options: any[]): Option[] =>
    (options || []).map((option) => {
        if (typeof option === 'object' && option !== null && 'label' in option && 'value' in option) {
            return option as Option;
        }
        if (typeof option === 'object' && option !== null) {
            const opt = option as Record<string, any>;
            return { label: String(opt.label ?? opt.value ?? JSON.stringify(opt)), value: opt.value ?? opt };
        }
        return { label: String(option), value: option };
    });

const valuesAreEqual = (a: any, b: any) => {
    if (a === b) return true;
    if (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null) {
        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);
        if (aKeys.length !== bKeys.length) return false;
        return aKeys.every((key) => (a as any)[key] === (b as any)[key]);
    }
    return false;
};

const getOptionKey = (option: Option, index: number) => {
    const type = typeof option.value;
    return type === 'string' || type === 'number' || type === 'boolean'
        ? String(option.value)
        : `${index}-${option.label}`;
};

const formatTimeValue = (minutes: number | null | undefined) => {
    if (minutes === null || minutes === undefined || Number.isNaN(minutes)) {
        return '';
    }
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

const parseTimeToMinutes = (value: string) => {
    if (!value) return null;
    const [hours, minutes] = value.split(':').map((part) => Number(part));
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
    return hours * 60 + minutes;
};

const renderError = (message?: string) =>
    message ? <p className="text-sm text-destructive">{message}</p> : null;

export default function GlobalSchemaForm<T>({
    schema,
    onSubmitCb,
    children,
    closeOnSubmit = true,
    defaultValues: propsDefaultValues,
}: {
    schema: ObjectSchema<AnyObject>;
    onSubmitCb: (data: T, closeModal: () => void) => Promise<void>;
    children?: React.ReactNode;
    closeOnSubmit?: boolean;
    defaultValues?: any;
}) {
    const describeSchema = schema.describe();
    const fields = Object.keys(describeSchema.fields);
    const rawDefaults = (schema.getDefault() as any) || {};

    const defaultValues = {
        ...rawDefaults,
        ...(propsDefaultValues || {}),
    };

    Object.keys(describeSchema.fields).forEach((key) => {
        const field = describeSchema.fields[key] as any;

        if (field?.meta?.type === "file") {
            defaultValues[key] = field?.meta?.multiple_files ? [] : null;
        }
    });
    const { closeModal } = useModal();
    const [isLoading, setLoading] = useState(false);
    const [openSelects, setOpenSelects] = useState<Record<string, boolean>>({});

    const onSubmit: SubmitHandler<any> = async (data) => {
        setLoading(true);
        await onSubmitCb(data, closeModal);
        setLoading(false);
        if (closeOnSubmit) {
            closeModal();
        }
    };

    describeSchema.meta?.InitState?.();

    return (
        <YupForm
            onSubmit={onSubmit}
            validationSchema={schema}
            className="grid max-h-[70vh] grid-cols-1 gap-6 overflow-y-auto p-6 @container md:grid-cols-2"
            useFormProps={{
                defaultValues: defaultValues,
            }}
        >

            {({ register, control, watch, formState: { errors }, getFieldState, getValues }) => {
                return (
                    <>
                        {children ? children : null}
                        {fields.map((fieldName) => {
                            const field = describeSchema.fields[fieldName] as SchemaDescription & { meta: any };
                            field?.meta?.cb?.(field);
                            const label = field.label;
                            const type = field?.meta?.type || inputType[field.type];
                            const oneOf = normalizeOptions(field?.meta?.options || field?.meta?.oneOf || field?.oneOf || []);
                            const fieldError = (errors as any)?.[fieldName]?.message as string | undefined;
                            const wrapperClass = field?.meta?.className || 'col-span-full';

                            if (type === 'text' || type === 'number') {
                                return (
                                    <div key={fieldName} className={cn('flex flex-col gap-2', wrapperClass)}>
                                        <Label htmlFor={fieldName}>{label}</Label>
                                        <Input
                                            id={fieldName}
                                            type={type === 'number' ? 'number' : 'text'}
                                            aria-invalid={!!fieldError}
                                            {...register(fieldName as any)}
                                        />
                                        {renderError(fieldError)}
                                    </div>
                                );
                            }

                            if (type === 'textarea') {
                                return (
                                    <div key={fieldName} className={cn('flex flex-col gap-2', wrapperClass)}>
                                        <Label htmlFor={fieldName}>{label}</Label>
                                        <Textarea
                                            id={fieldName}
                                            aria-invalid={!!fieldError}
                                            {...register(fieldName as any)}
                                        />
                                        {renderError(fieldError)}
                                    </div>
                                );
                            }

                            if (type === 'select') {
                                const isMulti = field?.meta?.isMulti;

                                if (isMulti) {
                                    return (
                                        <Controller
                                            key={fieldName}
                                            name={fieldName as any}
                                            control={control}
                                            disabled={!oneOf.length}
                                            render={({ field: { onChange, value } }) => {
                                                const selectedValues = Array.isArray(value) ? value : [];
                                                const selectedOptions = selectedValues
                                                    .map((val: any) => oneOf.find((opt) => valuesAreEqual(opt.value, val)))
                                                    .filter(Boolean) as Option[];

                                                const handleSelectChange = (optionValue: any) => {
                                                    const exists = selectedValues.some((val) => valuesAreEqual(val, optionValue));
                                                    const nextValue = exists
                                                        ? selectedValues.filter((val) => !valuesAreEqual(val, optionValue))
                                                        : [...selectedValues, optionValue];

                                                    field?.meta?.onChange?.(nextValue, getValues());
                                                    onChange(nextValue);
                                                };

                                                return (
                                                    <div className={cn('flex flex-col gap-2', wrapperClass)}>
                                                        <Label>{label}</Label>
                                                        <Popover
                                                            open={openSelects[fieldName]}
                                                            onOpenChange={(open) =>
                                                                setOpenSelects((prev) => ({ ...prev, [fieldName]: open }))
                                                            }
                                                        >
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    role="combobox"
                                                                    className="w-full justify-between"
                                                                    disabled={!oneOf.length}
                                                                >
                                                                    <div className="flex flex-wrap items-center gap-2">
                                                                        {selectedOptions.length ? (
                                                                            selectedOptions.map((option, index) => (
                                                                                <Badge
                                                                                    key={getOptionKey(option, index)}
                                                                                    variant="secondary"
                                                                                >
                                                                                    {option.label}
                                                                                </Badge>
                                                                            ))
                                                                        ) : (
                                                                            <span className="text-muted-foreground">
                                                                                {oneOf.length ? `Select ${label}` : 'No options'}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <ChevronDown className="size-4 shrink-0 opacity-60" />
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-[320px] p-0" align="start">
                                                                <Command
                                                                    filter={
                                                                        field?.meta?.selectProps?.disableDefaultFilter
                                                                            ? (_value, _search) => 1
                                                                            : undefined
                                                                    }
                                                                >
                                                                    <CommandInput
                                                                        placeholder={`Search ${label}`}
                                                                        onValueChange={(search) =>
                                                                            field?.meta?.selectProps?.onSearchChange?.(
                                                                                search,
                                                                                field,
                                                                                getValues()
                                                                            )
                                                                        }
                                                                    />
                                                                    <CommandList
                                                                        className="overscroll-contain"
                                                                        style={{ WebkitOverflowScrolling: 'touch' }}
                                                                        onWheelCapture={(event) => event.stopPropagation()}
                                                                        onTouchMove={(event) => event.stopPropagation()}
                                                                    >
                                                                        <CommandEmpty>No results found.</CommandEmpty>
                                                                        <CommandGroup>
                                                                            {oneOf.map((option, index) => {
                                                                                const isSelected = selectedValues.some((val) =>
                                                                                    valuesAreEqual(val, option.value)
                                                                                );
                                                                                return (
                                                                                    <CommandItem
                                                                                        key={getOptionKey(option, index)}
                                                                                        value={String(option.label)}
                                                                                        onSelect={() => handleSelectChange(option.value)}
                                                                                    >
                                                                                        <Checkbox
                                                                                            checked={isSelected}
                                                                                            className="mr-2"
                                                                                            aria-hidden="true"
                                                                                        />
                                                                                        {option.label}
                                                                                    </CommandItem>
                                                                                );
                                                                            })}
                                                                        </CommandGroup>
                                                                    </CommandList>
                                                                </Command>
                                                            </PopoverContent>
                                                        </Popover>
                                                        {renderError(fieldError)}
                                                    </div>
                                                );
                                            }}
                                        />
                                    );
                                }
                                return (
                                    <Controller
                                        key={fieldName}
                                        name={fieldName as any}
                                        control={control}
                                        disabled={!oneOf.length}
                                        render={({ field: { onChange, value } }) => {
                                            const selectedOption = oneOf.find((option) => valuesAreEqual(option.value, value));

                                            return (
                                                <div className={cn('flex flex-col gap-2', wrapperClass)}>
                                                    <Label>{label}</Label>
                                                    <Popover
                                                        open={openSelects[fieldName]}
                                                        onOpenChange={(open) =>
                                                            setOpenSelects((prev) => ({ ...prev, [fieldName]: open }))
                                                        }
                                                    >
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className="w-full justify-between"
                                                                disabled={!oneOf.length}
                                                            >
                                                                <span className="truncate">
                                                                    {selectedOption
                                                                        ? selectedOption.label
                                                                        : oneOf.length
                                                                            ? `Select ${label}`
                                                                            : 'No options'}
                                                                </span>
                                                                <ChevronsUpDown className="size-4 shrink-0 opacity-60" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                                                            <Command
                                                                filter={
                                                                    field?.meta?.selectProps?.disableDefaultFilter
                                                                        ? (_value, _search) => 1
                                                                        : undefined
                                                                }
                                                            >
                                                                <CommandInput
                                                                    placeholder={`Search ${label}`}
                                                                    onValueChange={(search) =>
                                                                        field?.meta?.selectProps?.onSearchChange?.(
                                                                            search,
                                                                            field,
                                                                            getValues()
                                                                        )
                                                                    }
                                                                    autoFocus={false}
                                                                    autoComplete={"off"}
                                                                />
                                                                <CommandList
                                                                    className="max-h-60 overflow-auto overscroll-contain"
                                                                    style={{ WebkitOverflowScrolling: 'touch' }}
                                                                    onWheelCapture={(event) => event.stopPropagation()}
                                                                    onTouchMove={(event) => event.stopPropagation()}
                                                                >
                                                                    <CommandEmpty>No results found.</CommandEmpty>
                                                                    <CommandGroup suppressContentEditableWarning >
                                                                        {oneOf.map((option, index) => (
                                                                            <CommandItem
                                                                                key={getOptionKey(option, index)}
                                                                                value={String(option.label)}
                                                                                onSelect={() => {
                                                                                    field?.meta?.onChange?.(option.value, getValues());
                                                                                    onChange(option.value);
                                                                                    setOpenSelects((prev) => ({ ...prev, [fieldName]: false }));
                                                                                }}
                                                                            >
                                                                                <Check
                                                                                    className={cn(
                                                                                        'mr-2 size-4',
                                                                                        valuesAreEqual(option.value, value)
                                                                                            ? 'opacity-100'
                                                                                            : 'opacity-0'
                                                                                    )}
                                                                                />
                                                                                {option.label}
                                                                            </CommandItem>
                                                                        ))}
                                                                    </CommandGroup>
                                                                </CommandList>
                                                            </Command>
                                                        </PopoverContent>
                                                    </Popover>
                                                    {renderError(fieldError)}
                                                </div>
                                            );
                                        }}
                                    />
                                );
                            }

                            if (type === 'date') {
                                return (
                                    <Controller
                                        key={fieldName}
                                        name={fieldName as any}
                                        control={control}
                                        render={({ field: { onChange, value } }) => {
                                            const selectedDate = value ? moment(value).toDate() : undefined;

                                            return (
                                                <div className={cn('flex flex-col gap-2', wrapperClass)}>
                                                    <Label>{label}</Label>
                                                    <Popover
                                                        open={openSelects[fieldName]}
                                                        onOpenChange={(open) =>
                                                            setOpenSelects((prev) => ({ ...prev, [fieldName]: open }))
                                                        }
                                                    >
                                                        <PopoverTrigger asChild>
                                                            <Button variant="outline" className="w-full justify-between text-left">
                                                                {selectedDate ? (
                                                                    moment(selectedDate).format('DD-MM-YYYY')
                                                                ) : (
                                                                    <span className="text-muted-foreground">Pick a date</span>
                                                                )}
                                                                <CalendarIcon className="size-4 opacity-60" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={selectedDate}
                                                                onSelect={(date) => {
                                                                    const nextDate = date ? moment(date).startOf('day').toDate() : null;
                                                                    onChange(nextDate);
                                                                }}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    {renderError(fieldError)}
                                                </div>
                                            );
                                        }}
                                    />
                                );
                            }

                            if (type === 'time') {
                                return (
                                    <Controller
                                        key={fieldName}
                                        name={fieldName as any}
                                        control={control}
                                        render={({ field: { onChange, value } }) => {
                                            const timeValue = formatTimeValue(typeof value === 'number' ? value : null);

                                            return (
                                                <div className={cn('flex flex-col gap-2', wrapperClass)}>
                                                    <Label htmlFor={`${fieldName}-time`}>{label}</Label>
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            id={`${fieldName}-time`}
                                                            type="time"
                                                            value={timeValue}
                                                            onChange={(event) => {
                                                                const minutes = parseTimeToMinutes(event.target.value);
                                                                onChange(minutes);
                                                            }}
                                                            aria-invalid={!!fieldError}
                                                        />
                                                        <Clock className="size-4 text-muted-foreground" />
                                                    </div>
                                                    {renderError(fieldError)}
                                                </div>
                                            );
                                        }}
                                    />
                                );
                            }

                            if (type === 'date-time') {
                                return (
                                    <Controller
                                        key={fieldName}
                                        name={fieldName as any}
                                        control={control}
                                        render={({ field: { onChange, value } }) => {
                                            const dateTimeValue = value ? moment(value).format('YYYY-MM-DDTHH:mm') : '';

                                            return (
                                                <div className={cn('flex flex-col gap-2', wrapperClass)}>
                                                    <Label htmlFor={`${fieldName}-datetime`}>{label}</Label>
                                                    <Input
                                                        id={`${fieldName}-datetime`}
                                                        type="datetime-local"
                                                        value={dateTimeValue}
                                                        onChange={(event) => {
                                                            const nextValue = event.target.value
                                                                ? moment(event.target.value).seconds(0).milliseconds(0).toDate()
                                                                : null;
                                                            onChange(nextValue);
                                                        }}
                                                        aria-invalid={!!fieldError}
                                                        {...(field?.meta?.datePickerProps || {})}
                                                    />
                                                    {renderError(fieldError)}
                                                </div>
                                            );
                                        }}
                                    />
                                );
                            }

                            if (type === 'file') {
                                return (
                                    <Controller
                                        key={fieldName}
                                        name={fieldName as any}
                                        control={control}
                                        render={({ field: { onChange } }) => (
                                            <div className={cn('flex flex-col gap-2', wrapperClass)}>
                                                <Label htmlFor={`${fieldName}-file`}>{label}</Label>
                                                <Input
                                                    id={`${fieldName}-file`}
                                                    type="file"
                                                    accept={field?.meta?.file_type}
                                                    multiple={!!field?.meta?.multiple_files}
                                                    onChange={(event) => {
                                                        const files = event.target.files;
                                                        if (!files?.length) return;

                                                        if (field?.meta?.multiple_files) {
                                                            onChange(files);
                                                        } else {
                                                            onChange(files[0]);
                                                        }
                                                    }}
                                                />
                                                {renderError(fieldError)}
                                            </div>
                                        )}
                                    />
                                );
                            }

                            if (type === 'boolean') {
                                return (
                                    <Controller
                                        key={fieldName}
                                        name={fieldName as any}
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <div className={cn('flex flex-col gap-2', wrapperClass)}>
                                                <div className="flex items-center gap-3">
                                                    <Switch
                                                        checked={!!value}
                                                        onCheckedChange={(checked) => {
                                                            field?.meta?.onChange?.(checked, getValues());
                                                            onChange(checked);
                                                        }}
                                                        aria-invalid={!!fieldError}
                                                    />
                                                    <Label className="leading-none">{label}</Label>
                                                </div>
                                                {renderError(fieldError)}
                                            </div>
                                        )}
                                    />
                                );
                            }

                            return null;
                        })}
                        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
                            <Button variant="outline" onClick={closeModal} className="w-full @xl:w-auto">
                                Cancel
                            </Button>
                            <Button type="submit" className="w-full @xl:w-auto" disabled={isLoading}>
                                {isLoading && <Loader2Icon className="mr-2 size-4 animate-spin" />}
                                {describeSchema?.meta?.button || 'Create'}
                            </Button>
                        </div>
                    </>
                );
            }}
        </YupForm>
    );
}

export const inputType: Record<string, string> = {
    string: 'text',
    email: 'text',
    number: 'number',
    date: 'date',
    'datetime-local': 'datetime-local',
    boolean: 'boolean',
};
