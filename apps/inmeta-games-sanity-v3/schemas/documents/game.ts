import { defineType, defineField } from "sanity";

export default defineType({
  type: "document",
  name: "game",
  title: "Lek",

  fieldsets: [
    {
      name: "team",
      title: "Lag",
    },
    {
      name: "organizer",
      title: "Arrangør",
    },
  ],

  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Navn",
    }),

    defineField({
      name: "teamBased",
      type: "boolean",
      title: "Lagbasert",
      fieldset: "team",
      initialValue: false,
    }),
    defineField({
      name: "teamSize",
      type: "number",
      title: "Lagstørrelse",
      fieldset: "team",
      hidden: ({ parent }) => !parent.teamBased,
      initialValue: 2,
      validation: Rule => Rule.integer().positive(),
    }),

    defineField({
      name: "organizer",
      title: "Arrangør",
      type: "reference",
      fieldset: "organizer",
      to: [{ type: "player" }],
    }),
    defineField({
      name: "organizerParticipated",
      title: "Arrangør deltok",
      type: "boolean",
      fieldset: "organizer",
      initialValue: false,
    }),

    defineField({
      name: "players",
      type: "array",
      title: "Spillere",
      of: [{ type: "reference", to: [{ type: "player" }] }],
      validation: Rule => Rule.unique(),
    }),
  ],
});
