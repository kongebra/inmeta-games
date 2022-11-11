import { ConfigContext } from "sanity";
import { StructureBuilder } from "sanity/desk";

import { FaCalendarAlt, FaCalendarWeek, FaList, FaMedal } from "react-icons/fa";

export default (S: StructureBuilder, context: ConfigContext) =>
  S.listItem()
    .title("Turneringer")
    .icon(FaMedal)
    .child(
      S.list()
        .title("Turneringer")
        .items([
          S.documentTypeListItem("tournament")
            .title("Alle turneringer")
            .icon(FaList),

          S.listItem()
            .title("Turneringer etter publiseringsår")
            .icon(FaCalendarAlt)
            .child(async () => {
              const type = "tournament";
              const docs = await context
                .getClient({ apiVersion: "v2022-03-13" })
                .fetch(`*[_type == $type && defined(year)]`, { type });

              const years: Map<string, string[]> = new Map();

              docs.forEach((doc: any) => {
                const year = `${doc.year}`;

                if (!years.get(year)) {
                  years.set(year, []);
                }

                years.get(year)!.push(doc._id);
              });

              return S.list()
                .title("Turneringer etter publiseringsår")
                .id("year")
                .items(
                  Array.from(years.entries()).map(entry => {
                    const [key] = entry;

                    return S.listItem()
                      .id(key)
                      .title(key)
                      .icon(FaCalendarWeek)
                      .child(
                        S.documentList()
                          .id(type)
                          .title(`Turneringer fra ${key}`)
                          .filter(`_id in $ids`)
                          .params({ ids: years.get(key) })
                      );
                  })
                );
            }),
        ])
    );
