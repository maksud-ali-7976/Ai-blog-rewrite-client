import { number, object, string } from "yup";

export const CategorySchema = object().shape({
    name: string().label("Catgory Name").required(),
    icon: string().label("Catgory Icon").required()
})