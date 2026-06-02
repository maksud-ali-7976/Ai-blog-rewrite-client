"use client"


import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useModal } from './use-modal';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface ModalButtonProps {
    label?: string;
    view: ReactNode;
    icon?: ReactNode;
    onClickCustom?: () => void;
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
}

export default function ModalButton({
    label = '',
    view,
    icon = <Plus className="h-4 w-4" />,
    onClickCustom,
    variant = 'outline',
    size = 'sm',
    className,
}: ModalButtonProps) {
    const { openModal } = useModal();

    return (
        <Button
            variant={variant}
            size={size}
            className={cn(className)}
            onClick={() => {
                onClickCustom?.();
                openModal({ view, title: label });
            }}
        >
            {icon}
            {label && <span className="ml-1">{label}</span>}
        </Button>
    );
}
