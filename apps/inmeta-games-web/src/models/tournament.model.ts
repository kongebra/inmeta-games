import { Game } from "./game.model";

export interface Tournament {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  _type: "tournament";
  _ref: string;

  name: string;

  games?: Game[];
}
