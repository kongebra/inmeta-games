import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";

import { useQuery } from "react-query";
import { allTournamentsQuery } from "lib/queries";
import { getClient } from "lib/sanity.server";
import { Tournament } from "models";

interface Props {
  data: Tournament[];
}

const getTournaments = () =>
  getClient().fetch<Tournament[]>(allTournamentsQuery);

const TournamentsPage: NextPage<Props> = (props) => {
  const { data } = useQuery("tournaments", getTournaments, {
    initialData: props.data,
  });

  return (
    <>
      <Head>
        <title>Tournaments</title>
      </Head>

      <div className="container mx-auto">
        <h1 className="text-4xl font-black mb-4">Tournaments</h1>

        <div className="flex gap-4">
          {data?.map((item) => (
            <Link key={item._id} href={`/tournaments/${item._id}`}>
              <a>
                <div className="bg-slate-200 shadow p-4 hover:bg-slate-400 cursor-pointer">
                  <h2>{item.name}</h2>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const data = await getClient().fetch<Tournament[]>(allTournamentsQuery);

  return {
    props: {
      data,
    },
  };
};

export default TournamentsPage;
