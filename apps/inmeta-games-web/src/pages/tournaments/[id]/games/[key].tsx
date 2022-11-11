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

import { FaMedal } from "react-icons/fa";

interface Props {
  game: Game;
}

type PlayerItemProps = {
  player: Player;
  className?: string;
  placement?: "first" | "second" | "third";
};

const PlayerItem = ({ player, className, placement }: PlayerItemProps) => {
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
        {placement && (
          <div className="bg-black bg-opacity-50 p-2.5 rounded-bl-3xl absolute top-0 right-0">
            <FaMedal
              className={clsx("text-5xl", {
                "text-amber-300": placement === "first",
                "text-slate-300": placement === "second",
                "text-orange-300": placement === "third",
              })}
            />
          </div>
        )}
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
              <div className="grid grid-cols-3 grid gap-5">
                {game.secondPlace && (
                  <PlayerItem
                    className="bg-slate-400 text-white scale-75"
                    player={game.secondPlace}
                    placement="second"
                  />
                )}
                {game.firstPlace && (
                  <PlayerItem
                    className="bg-amber-500 text-white"
                    player={game.firstPlace}
                    placement="first"
                  />
                )}
                {game.thirdPlace && (
                  <PlayerItem
                    className="bg-orange-700 text-white scale-75"
                    player={game.thirdPlace}
                    placement="third"
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
                  placement="first"
                />
              ))}
              {game?.secondPlaceTeam?.map((player) => (
                <PlayerItem
                  key={player._id}
                  className="bg-slate-500 text-white"
                  player={player}
                  placement="second"
                />
              ))}
              {game?.thirdPlaceTeam?.map((player) => (
                <PlayerItem
                  key={player._id}
                  className="bg-orange-700 text-white"
                  player={player}
                  placement="third"
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
    revalidate: 60,
  };
};

export default TournamentGamesDetailPage;
