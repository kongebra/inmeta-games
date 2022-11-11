import { ConfigContext } from "sanity";
import { StructureBuilder } from "sanity/desk";

import { FaDiceD20, FaList, FaMedal, FaUser, FaUserTag } from "react-icons/fa";

export default (S: StructureBuilder, context: ConfigContext) =>
  S.listItem()
    .title("Spillere")
    .icon(FaUser)
    .child(
      S.list()
        .title("Spillere")
        .items([
          S.documentTypeListItem("player").title("Alle spillere").icon(FaList),

          S.listItem()
            .title("Spillere etter avdeling")
            .icon(FaUserTag)
            .child(
              S.documentTypeList("department")
                .title("Spillere etter avdeling")
                .child((depId: string) =>
                  S.documentList()
                    .schemaType("department")
                    .title("Spillere")
                    .filter('_type == "player" && department._ref == $depId')
                    .params({ depId })
                )
            ),

          S.listItem()
            .title("Spillere etter turneringer")
            .icon(FaMedal)
            .child(async () => {
              const docs = await context
                .getClient({ apiVersion: "v2022-03-13" })
                .fetch(
                  `*[_type == "tournament"][] { ..., "gameDetails": games[]-> }`
                );

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
                          .id("player")
                          .title(`Spillere i ${doc.name}`)
                          .filter(`_id in $ids`)
                          .params({
                            ids: doc.gameDetails
                              .map((game: any) =>
                                game.players.map((player: any) => player._ref)
                              )
                              .flat(),
                          })
                      );
                  })
                );
            }),

          S.listItem()
            .title("Spillere etter leker")
            .icon(FaDiceD20)
            .child(async () => {
              const docs = await context
                .getClient({ apiVersion: "v2022-03-13" })
                .fetch(
                  `*[_type == "tournament"][] { ..., "gameDetails": games[]-> }`
                );

              const games = docs
                .map((doc: any) => [
                  ...doc.gameDetails.map((game: any) => ({
                    ...game,
                    tournamentName: doc.name,
                  })),
                ])
                .flat();

              return S.list()
                .title("Leker")
                .id("games")
                .items(
                  games.map((game: any) => {
                    return S.listItem()
                      .id(game._id)
                      .title(`${game.name} (${game?.tournamentName})`)
                      .icon(FaDiceD20)
                      .child(
                        S.documentList()
                          .id("player")
                          .title(
                            `Spillere i ${game.name} (${game?.tournamentName})`
                          )
                          .filter(`_id in $ids`)
                          .params({
                            ids: game.players.map((player: any) => player._ref),
                          })
                      );
                  })
                );
            }),
        ])
    );
