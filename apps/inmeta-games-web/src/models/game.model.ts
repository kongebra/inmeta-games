import { Player } from "./player.model";

export interface Game {
  _key: string;
  _type: "game";

  name: string;

  teamBased: boolean;
  teamSize?: number;

  players?: Player[];

  firstPlace?: Player;
  secondPlace?: Player;
  thirdPlace?: Player;

  firstPlaceTeam?: Player[];
  secondPlaceTeam?: Player[];
  thirdPlaceTeam?: Player[];

  organizer?: { _type: "reference"; _ref: string };
  organizerParticipated: boolean;
}
