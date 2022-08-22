import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { groq } from "next-sanity";
import React, { useState } from "react";
import { getClient } from "lib/sanity.server";
import { Game, Player } from "models";

import { useNextSanityImage } from "next-sanity-image";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import { tournamentGamesQuery } from "lib/queries";
import Head from "next/head";
import clsx from "clsx";

interface Props {
  game: Game;
}

const PlayerItem = ({
  player,
  className,
}: {
  player: Player;
  className?: string;
}) => {
  const [client] = useState(getClient());
  const imageProps = useNextSanityImage(client, player.image, {
    imageBuilder: (builder) =>
      builder.crop("focalpoint").fit("crop").width(512).height(512),
  }) as any;

  return (
    <div
      className={clsx(
        "flex flex-col bg-slate-200 rounded-lg overflow-hidden",
        className
      )}
    >
      <figure className="w-full h-auto overflow-hidden relative">
        <Image
          {...imageProps}
          alt={player.firstName}
          layout="responsive"
          className="object-fit"
        />
      </figure>

      <div className="p-4">
        <h3 className="font-xl font-semibold">
          {player.lastName}, {player.firstName}
        </h3>
      </div>
    </div>
  );
};

const TournamentGamesDetailPage: NextPage<Props> = ({ game }) => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Head>
        <title>{game.name}</title>
      </Head>

      <div className="container mx-auto mb-4">
        <h1 className="text-4xl font-black mb-4">{game.name}</h1>

        <Link href={`/tournaments/${id}`}>
          <a className="text-sky-500 underline mb-4">Go back to tournament</a>
        </Link>

        {!game.teamBased &&
          (game.firstPlace || game.secondPlace || game.thirdPlace) && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Result:</h2>
              <div className="grid grid-cols-3 gap-5">
                {game.secondPlace && (
                  <PlayerItem
                    className="bg-slate-400 text-white scale-75"
                    player={game.secondPlace}
                  />
                )}
                {game.firstPlace && (
                  <PlayerItem
                    className="bg-amber-500 text-white"
                    player={game.firstPlace}
                  />
                )}
                {game.thirdPlace && (
                  <PlayerItem
                    className="bg-orange-700 text-white scale-50"
                    player={game.thirdPlace}
                  />
                )}
              </div>
            </div>
          )}

        {game.teamBased && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Result:</h2>
            <div className="grid grid-cols-4 gap-5 mb-5">
              {game?.firstPlaceTeam?.map((player) => (
                <PlayerItem
                  key={player._id}
                  className="bg-amber-500 text-white"
                  player={player}
                />
              ))}
              {game?.secondPlaceTeam?.map((player) => (
                <PlayerItem
                  key={player._id}
                  className="bg-slate-500 text-white"
                  player={player}
                />
              ))}
              {game?.thirdPlaceTeam?.map((player) => (
                <PlayerItem
                  key={player._id}
                  className="bg-orange-700 text-white"
                  player={player}
                />
              ))}
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-4">Players:</h2>

        <div className="grid grid-cols-5 gap-4">
          {game?.players?.map((player) => {
            return <PlayerItem key={player._id} player={player} />;
          })}
        </div>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const query = groq`*[_type == "tournament"][] {
  _id,
  "gameKeys": games[]._key
}`;
  const result = await getClient().fetch<
    {
      _id: string;
      gameKeys: string[];
    }[]
  >(query);

  const paths: { params: any }[] = [];

  result.forEach((tournament) => {
    tournament.gameKeys.forEach((key) => {
      paths.push({
        params: {
          id: tournament._id,
          key: key,
        },
      });
    });
  });

  return {
    paths: paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const { id, key } = context.params as { id: string; key: string };

  const result = await getClient().fetch<Game[]>(tournamentGamesQuery, { id });

  if (!result) {
    return {
      notFound: true,
    };
  }

  const game = result.find((game) => game._key === key);
  if (!game) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      game,
    },
  };
};

export default TournamentGamesDetailPage;
