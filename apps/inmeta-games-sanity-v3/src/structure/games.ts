import { ConfigContext } from "sanity";
import { StructureBuilder } from "sanity/desk";

import {
  FaDiceD20,
  FaGamepad,
  FaList,
  FaMedal,
  FaUser,
  FaUserTag,
} from "react-icons/fa";

export default (S: StructureBuilder, context: ConfigContext) =>
  S.listItem()
    .title("Leker")
    .icon(FaDiceD20)
    .child(
      S.list()
        .title("Leker")
        .items([
          S.documentTypeListItem("game").title("Alle leker").icon(FaList),

          S.listItem()
            .title("Leker etter turnering")
            .icon(FaMedal)
            .child(async () => {
              const docs = await context
                .getClient({ apiVersion: "v2022-03-13" })
                .fetch(`*[_type == "tournament"][]`);

              console.log({ docs });

              return S.list()
                .title("Turneringer")
                .id("tournament")
                .items(
                  docs.map((doc: any) => {
                    return S.listItem()
                      .id(doc._id)
                      .title(doc.name)
                      .icon(FaMedal)
                      .child(
                        S.documentList()
                          .id("game")
                          .title(`Leker fra ${doc.name}`)
                          .filter(`_id in $ids`)
                          .params({
                            ids: doc.games.map((game: any) => game._ref),
                          })
                      );
                  })
                );
            }),
        ])
    );
