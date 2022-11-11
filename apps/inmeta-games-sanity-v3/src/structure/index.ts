import { ConfigContext } from "sanity";
import {
  ListItemBuilder,
  StructureBuilder,
  StructureResolver,
} from "sanity/desk";
import games from "./games";

import players from "./players";
import tournaments from "./tournaments";

const hiddenDocTypes = (listItem: ListItemBuilder) =>
  !["player", "tournament", "department", "game"].includes(
    listItem.getId() ?? ""
  );

export const structure: StructureResolver = (
  S: StructureBuilder,
  context: ConfigContext
) => {
  return S.list()
    .title("Innhold")
    .items(
      [players(S, context), tournaments(S, context), games(S, context)].concat(
        S.documentTypeListItems().filter(hiddenDocTypes)
      )
    );
};
