import { groq } from "next-sanity";

export const allTournamentsQuery = groq`*[_type == "tournament"][] {
      ...,

      games[] {
        ...,

        players[]->,

        firstPlace->,
        secondPlace->,
        thirdPlace->,

        firstPlaceTeam[]->,
        secondPlaceTeam[]->,
        thirdPlaceTeam[]->,
      }
  }`;

export const tournamentQuery = groq`*[_type == "tournament" && _id == $id][0] {
      ...,

      games[] {
        ...,

        players[]->,

        firstPlace->,
        secondPlace->,
        thirdPlace->,

        firstPlaceTeam[]->,
        secondPlaceTeam[]->,
        thirdPlaceTeam[]->,
      }
  }`;

export const tournamentIdsQuery = groq`*[_type == "tournament"][]._id`;

export const tournamentGamesQuery = groq`*[_type == "tournament" && _id == $id][].games[] {
  ...,
  players[]->,
  
  firstPlace->,
  secondPlace->,
  thirdPlace->,
  
  firstPlaceTeam[]->,
  secondPlaceTeam[]->,
  thirdPlaceTeam[]->,
}`;
