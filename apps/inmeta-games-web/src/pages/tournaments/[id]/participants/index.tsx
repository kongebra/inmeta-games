import { tournamentIdsQuery, tournamentQuery } from "lib/queries";
import { getClient } from "lib/sanity.server";
import { Player, Tournament } from "models";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import React from "react";

type Props = {
  players: Player[];
};

const TournamentParticipantsPage: NextPage<Props> = ({ players }) => {
  return (
    <div>
      <h1>Participants (Count: {players.length})</h1>

      <div className="flex">
        
      </div>

      <ul>
        {players.map((player) => (
          <li key={player._id}>
            {player.firstName} {player.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const result = await getClient().fetch<string[]>(tournamentIdsQuery);

  return {
    paths: result.map((id: string) => `/tournaments/${id}/participants`),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const id = context.params?.id as string;
  const tournament = await getClient().fetch<Tournament>(tournamentQuery, {
    id,
  });

  if (!tournament) {
    return {
      notFound: true,
    };
  }

  const allPlayers =
    tournament.games?.map((game) => game.players || []).flat() || [];
  const players = new Array<Player>();
  allPlayers.forEach((player) => {
    if (!players.some((x) => x._id === player._id)) {
      players.push(player);
    }
  });

  return {
    props: {
      players,
    },
    revalidate: 60,
  };
};

export default TournamentParticipantsPage;
