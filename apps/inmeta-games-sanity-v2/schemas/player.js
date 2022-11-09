export default {
  name: "player",
  title: "Player",
  type: "document",
  fields: [
    {
      name: "firstName",
      title: "First Name",
      type: "string",
    },
    {
      name: "lastName",
      title: "Last Name",
      type: "string",
    },
    {
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "department",
      title: "Department",
      type: "reference",
      to: { type: "department" },
    },
  ],
  preview: {
    select: {
      title: "firstName",
      subtitle: "lastName",
      media: "image",
    },
  },
};
