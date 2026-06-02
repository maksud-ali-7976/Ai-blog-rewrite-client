import { array, mixed, number, object, SchemaDescription, string } from "yup";
import useAuditStore from "../audit-logs/audit-log.service";
import { useEffect } from "react";

export let BlogSource = [
  {
    lable: "Ibm Blogs",
    value: "IBM",
  },
  {
    lable: "LangChain Blogs",
    value: "LangChain",
  },
];

export const BlogSchema = object()
  .shape({
    url: string().label("Url").required(),
    source: string()
      .label("Source")
      .meta({
        type: "select",
        cb: (field: SchemaDescription & { meta: any }) => {
          field.meta.oneOf = BlogSource.map((item) => ({
            value: item.value,
            label: item.lable,
          }));
        },
      })
      .required(),
  })
  .label("Add")
  .meta({
    button: "Create",
    InitState: () => {
     
    },
  });
