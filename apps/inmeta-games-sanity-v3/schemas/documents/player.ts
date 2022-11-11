import { defineType, defineField } from "sanity";

export default defineType({
  type: "document",
  name: "player",
  title: "Spiller",
  fields: [
    defineField({
      name: "firstName",
      type: "string",
      title: "Fornavn",
    }),
    defineField({
      name: "lastName",
      type: "string",
      title: "Etternavn",
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Bilde",
      options: {
        hotspot: true,
        metadata: ["lqip"],
      },
    }),
    defineField({
      name: "department",
      type: "reference",
      title: "Avdeling",
      to: [{ type: "department" }],
    }),
  ],
  preview: {
    select: {
      firstName: "firstName",
      lastName: "lastName",
      department: "department.name",
      media: "image",
    },
    prepare(value, viewOptions) {
      const { firstName, lastName, department, media } = value;

      return {
        title: `${firstName} ${lastName}`,
        subtitle: `${department}`,
        media,
      };
    },
  },
});
