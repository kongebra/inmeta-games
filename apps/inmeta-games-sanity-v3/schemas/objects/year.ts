import { defineType } from "sanity";

import YearInput from "../../src/components/input/YearInput";

export default defineType({
  type: "number",
  name: "year",
  title: "År",

  components: {
    input: YearInput,
  },
});
