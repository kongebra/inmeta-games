import groq from "groq";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import useTournament from "hooks/use-tournament";
import { tournamentIdsQuery, tournamentQuery } from "lib/queries";
import { getClient } from "lib/sanity.server";
import { Player, Tournament } from "models";
import { string } from "prop-types";
import clsx from "clsx";
import Head from "next/head";

interface Props {
  tournament: Tournament;
}

interface PlayerScore extends Player {
  score: number;
  participations: number;
  firstPlaceCount: number;
  secondPlaceCount: number;
  thidPlaceCount: number;
  organizerWithParticipation: number;
  organizerWithoutParticipation: number;

  placement: number;
}

const TournamentDetailPage: NextPage<Props> = ({ tournament }) => {
  const { addPlayerMutation } = useTournament(tournament._id);

  const score = useMemo(() => {
    const playerScore = new Array<PlayerScore>();

    tournament.games?.forEach((game) => {
      game.players?.forEach((player) => {
        const index = playerScore.findIndex((p) => p._id === player._id);

        // Spiller ikke lagt til i listen allerede
        if (index === -1) {
          playerScore.push({
            ...player,
            score: 3,
            participations: 1,
            firstPlaceCount: 0,
            secondPlaceCount: 0,
            thidPlaceCount: 0,
            organizerWithParticipation: 0,
            organizerWithoutParticipation: 0,
            placement: -1,
          });
        } else {
          playerScore[index].score += 3;
          playerScore[index].participations++;
        }
      });

      if (game.organizer) {
        const index = playerScore.findIndex(
          (p) => p._id === game.organizer?._ref
        );

        if (index !== -1) {
          const points = game.organizerParticipated ? 1 : 3;
          // 3 poeng til arragnør hvis de ikke kunne delta, 1 poeng hvis ikke
          playerScore[index].score += points;

          if (points === 3) {
            playerScore[index].organizerWithoutParticipation++;
          } else {
            playerScore[index].organizerWithParticipation++;
          }
        }
      }

      // Lag-basert konkurranse, hent spiller fra lag
      if (game.teamBased) {
        game.firstPlaceTeam?.forEach((player) => {
          const index = playerScore.findIndex((p) => p._id === player._id);

          if (index !== -1) {
            playerScore[index].score += 3;
            playerScore[index].firstPlaceCount++;
          }
        });
        game.secondPlaceTeam?.forEach((player) => {
          const index = playerScore.findIndex((p) => p._id === player._id);

          if (index !== -1) {
            playerScore[index].score += 2;
            playerScore[index].secondPlaceCount++;
          }
        });
        game.thirdPlaceTeam?.forEach((player) => {
          const index = playerScore.findIndex((p) => p._id === player._id);

          if (index !== -1) {
            playerScore[index].score += 1;
            playerScore[index].thidPlaceCount++;
          }
        });
      } else {
        // Ikke lag-basert konkurranse

        // Sjekk om noen har fått førsteplass
        if (game.firstPlace) {
          const index = playerScore.findIndex(
            (p) => p._id === game.firstPlace?._id
          );

          if (index !== -1) {
            playerScore[index].score += 3;
            playerScore[index].firstPlaceCount++;
          }
        }

        // Sjekk om noen har fått andreplass
        if (game.secondPlace) {
          const index = playerScore.findIndex(
            (p) => p._id === game.secondPlace?._id
          );

          if (index !== -1) {
            playerScore[index].score += 3;
            playerScore[index].secondPlaceCount++;
          }
        }

        // Sjekk om noen har fått tredjeplass
        if (game.thirdPlace) {
          const index = playerScore.findIndex(
            (p) => p._id === game.thirdPlace?._id
          );

          if (index !== -1) {
            playerScore[index].score += 3;
            playerScore[index].thidPlaceCount++;
          }
        }
      }
    });

    const result = playerScore
      .sort((a, b) => {
        if (a.score < b.score) {
          return 1;
        }
        if (a.score > b.score) {
          return -1;
        }

        return 0;
      })
      .map((player, index) => {
        return {
          ...player,
          placement: index + 1,
        };
      });

    result.forEach((player, index) => {
      const currentPlayerPlacement = player.placement;
      const currentPlayerScore = player.score;

      for (let i = index; i < result.length; i++) {
        if (result[i].score === currentPlayerScore) {
          result[i].placement = currentPlayerPlacement;
        }
      }
    });

    return result;
  }, [tournament.games]);

  return (
    <>
      <Head>
        <title>{tournament.name}</title>
      </Head>

      <div className="container mx-auto">
        <h1 className="text-4xl font-black mb-4">{tournament.name}</h1>
        <Link href={`/tournaments`}>
          <a className="text-sky-500 underline">
            Go back to tournament overview
          </a>
        </Link>
        <h2 className="text-2xl font-semibold mb-4">Games:</h2>
        <div className="flex gap-4 mb-4">
          {tournament.games?.map((item) => (
            <Link
              key={item._key}
              href={`/tournaments/${tournament._id}/games/${item._key}`}
            >
              <a>
                <div className="bg-slate-200 shadow p-4 hover:bg-slate-400 cursor-pointer">
                  <h2>{item.name}</h2>
                </div>
              </a>
            </Link>
          ))}
        </div>
        <h2 className="text-2xl font-semibold mb-4">Result:</h2>

        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-4">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Placement
              </th>
              <th scope="col" className="px-6 py-3">
                First name
              </th>
              <th scope="col" className="px-6 py-3">
                Last name
              </th>
              <th scope="col" className="px-6 py-3">
                Participations
              </th>
              <th scope="col" className="px-6 py-3">
                First / Second / Third
              </th>
              <th scope="col" className="px-6 py-3">
                Organizer (Participated / No participation)
              </th>
              <th scope="col" className="px-6 py-3">
                Score
              </th>
            </tr>
          </thead>
          <tbody>
            {score
              .sort((a, b) => b.score - a.score)
              .map((player, index) => (
                <tr
                  key={player._id}
                  className={clsx(" dark:border-gray-700", {
                    "bg-amber-500 text-white font-bold": player.placement === 1,
                    "bg-slate-400 text-white font-bold": player.placement === 2,
                    "bg-orange-700 text-white font-bold":
                      player.placement === 3,
                    "bg-white dark:bg-gray-800": ![1, 2, 3].includes(
                      player.placement
                    ),
                  })}
                >
                  <td className="px-6 py-4">{player.placement}</td>
                  <td className="px-6 py-4">{player.firstName}</td>
                  <td className="px-6 py-4">{player.lastName}</td>
                  <td className="px-6 py-4">{player.participations}</td>
                  <td className="px-6 py-4 font-bold">
                    <span className="p-2 rounded bg-white dark:bg-gray-800">
                      <span className="text-amber-500">
                        {player.firstPlaceCount}
                      </span>
                      {" / "}
                      <span className="slate-400">
                        {player.secondPlaceCount}
                      </span>
                      {" / "}
                      <span className="text-orange-700">
                        {player.thidPlaceCount}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {player.organizerWithParticipation}
                    {" / "}
                    {player.organizerWithoutParticipation}
                  </td>
                  <td className="px-6 py-4">{player.score}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const result = await getClient().fetch<string[]>(tournamentIdsQuery);

  return {
    paths: result.map((id: string) => `/tournaments/${id}`),
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

  return {
    props: {
      tournament,
    },
    revalidate: 60,
  };
};

export default TournamentDetailPage;
