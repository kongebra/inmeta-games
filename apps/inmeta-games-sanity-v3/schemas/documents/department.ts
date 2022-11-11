import { defineType, defineField } from "sanity";

export default defineType({
  type: "document",
  name: "department",
  title: "Avdeling",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Navn",
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      options: {
        source: "name",
        maxLength: 96,
      },
    }),
  ],
});
