import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { groq } from "next-sanity";

import { getClient } from "../lib/sanity.server";

import { Tournament } from "../models";
import { tournamentQuery } from "../lib/queries";

export default function useTournament(id: string) {
  const [client] = useState(getClient());
  const queryClient = useQueryClient();

  const { data, ...rest } = useQuery(
    ["tournament", id],
    () => client.fetch<Tournament>(tournamentQuery, { id }),
    {
      enabled: !!!id,
    }
  );

  const addPlayerMutation = useMutation(
    (playerId: string) => {
      return client
        .patch(id)
        .setIfMissing({ players: [] })
        .append("players", [{ _type: "reference", _ref: playerId }])
        .commit({ autoGenerateArrayKeys: true });
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(["tournament", id]);
      },
    }
  );

  return { tournament: data, addPlayerMutation, ...rest };
}
