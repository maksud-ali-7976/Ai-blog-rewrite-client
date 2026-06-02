import { object } from "yup";

export function injectDefaults(schema: any, defaults: any): any {
    const describeSchema = schema.describe();
    if (schema.fields) {
        const obj = object(
            Object.fromEntries(
                Object.entries(schema.fields).map(([key, field]: any) => {
                    let value = defaults[key];
                    // if (field.type === 'object' && typeof value === 'object') {
                    //     console.log("🚀 ~ Object.entries ~ field:", field)
                    //     return [key, injectDefaults(field, value)];
                    // }
                    if (typeof value === "object" && !Array.isArray(value) && value?._id) {
                        value = value?._id;
                    }
                    return [key, field.default(value)];
                })
            )
        );

        if (describeSchema.meta) {
            return obj.meta({ ...describeSchema.meta })
        }
        return obj;
    }
    return schema;
}

export function injectMeta(schema: any, meta: any): any {
    const describeSchema = schema.describe();
    if (describeSchema.meta) {
        return schema.meta({ ...describeSchema.meta, ...meta })
    }
    return schema;
}

