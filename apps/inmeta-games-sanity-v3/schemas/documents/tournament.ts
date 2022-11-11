import { defineType, defineField } from "sanity";

export default defineType({
  type: "document",
  name: "tournament",
  title: "Turnering",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Navn",
    }),

    defineField({
      name: "year",
      type: "year",
      title: "År",
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: "games",
      type: "array",
      title: "Leker",
      of: [{ type: "reference", to: [{ type: "game" }] }],
    }),
  ],
});
