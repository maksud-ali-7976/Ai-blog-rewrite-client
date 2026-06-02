import { array, mixed, number, object, SchemaDescription, string } from "yup";
import useAuditStore from "../audit-logs/audit-log.service";
import { useEffect } from "react";
import useRoleStore from "./role.service";


export const AdminSchema = object().shape({
    name: string().label("Name").required(),
    email: string().label("Email").required(),
    password: string().label("Password").required(),
    role: string().label("Role").meta({
        type: "select",
        cb: (field: SchemaDescription & { meta: any }) => {
            const store = useRoleStore();
            field.meta.oneOf = store.list.map((item) => ({ value: item._id, label: item.name }))
        }
    }).required()
}).label("Add").meta({
    button: "Create",
    InitState: () => {

        const RoleStore = useRoleStore();
        useEffect(() => {
            RoleStore.actions.paginate({})
        }, [])

    },
})

