import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { schemas } from "./schemas";
import { structure } from "./src/structure";

export default defineConfig({
  name: "default",

  projectId: "jhhsx3kh",
  dataset: "testing",

  plugins: [deskTool({ structure })],

  schema: {
    types: schemas,
  },
});
