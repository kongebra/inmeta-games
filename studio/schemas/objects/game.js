export default {
  name: "game",
  title: "Game",
  type: "object",
  fieldsets: [
    {
      name: "result",
      title: "Results",
    },
    {
      name: "team",
      title: "Team",
    },
  ],
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "startsAt",
      title: "Starts at",
      type: "date",
    },
    {
      name: "teamBased",
      title: "Team based",
      type: "boolean",
      fieldset: "team",
      description: "Will the game be team based?",
      initialValue: false,
    },
    {
      name: "teamSize",
      title: "Team Size",
      type: "number",
      fieldset: "team",
      hidden: ({ parent }) => !parent.teamBased,
      initialValue: 2,
      validation: (Rule) => Rule.integer().positive(),
    },
    {
      name: "organizer",
      title: "Organizer",
      type: "reference",
      to: [{ type: "player" }],
    },
    {
      name: "organizerParticipated",
      title: "Did organizer participate?",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "players",
      title: "Players",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "player" }],
          options: {
            disableNew: false,
          },
        },
      ],
      validation: (Rule) => Rule.unique(),
    },
    {
      name: "firstPlace",
      title: "1st place",
      fieldset: "result",
      type: "reference",
      to: [{ type: "player" }],
      hidden: ({ parent }) => parent.teamBased,
      options: {
        disableNew: true,
      },
      readOnly: ({ parent }) => {
        const { players } = parent;

        if (!players?.length) {
          return true;
        }

        return false;
      },
      validation: (Rule) =>
        Rule.custom((selectedPlayer, context) => {
          if (selectedPlayer) {
            const { parent } = context;
            const { players, secondPlace, thirdPlace } = parent;

            if (
              players &&
              !players.some((player) => player._ref === selectedPlayer._ref)
            ) {
              return 'Player must be inside the "Players" array.';
            }

            if (
              (secondPlace && selectedPlayer._ref === secondPlace._ref) ||
              (thirdPlace && selectedPlayer._ref === thirdPlace._ref)
            ) {
              return "Player cannot be in two places.";
            }
          }

          return true;
        }),
    },
    {
      name: "secondPlace",
      title: "2st place",
      fieldset: "result",
      type: "reference",
      to: [{ type: "player" }],
      hidden: ({ parent }) => parent.teamBased,
      options: {
        disableNew: true,
      },
      readOnly: ({ parent }) => {
        const { players } = parent;

        if (!players?.length) {
          return true;
        }

        return false;
      },
      validation: (Rule) =>
        Rule.custom((selectedPlayer, context) => {
          const { parent } = context;
          const { players, firstPlace, thirdPlace } = parent;

          if (selectedPlayer) {
            if (
              players &&
              !players.some((player) => player._ref === selectedPlayer._ref)
            ) {
              return 'Player must be inside the "Players" array.';
            }

            if (
              (firstPlace && selectedPlayer._ref === firstPlace._ref) ||
              (thirdPlace && selectedPlayer._ref === thirdPlace._ref)
            ) {
              return "Player cannot be in two places.";
            }

            if (!firstPlace) {
              return "A first place must be sat before second place";
            }
          }

          return true;
        }),
    },
    {
      name: "thirdPlace",
      title: "3rd place",
      fieldset: "result",
      type: "reference",
      to: [{ type: "player" }],
      hidden: ({ parent }) => parent.teamBased,
      options: {
        disableNew: true,
      },
      readOnly: ({ parent }) => {
        const { players } = parent;

        if (!players?.length) {
          return true;
        }

        return false;
      },
      validation: (Rule) =>
        Rule.custom((selectedPlayer, context) => {
          const { parent } = context;
          const { players, firstPlace, secondPlace } = parent;

          if (selectedPlayer) {
            if (
              players &&
              !players.some((player) => player._ref === selectedPlayer._ref)
            ) {
              return 'Player must be inside the "Players" array.';
            }

            if (
              (firstPlace && selectedPlayer._ref === firstPlace._ref) ||
              (secondPlace && selectedPlayer._ref === secondPlace._ref)
            ) {
              return "Player cannot be in two places.";
            }

            if (!firstPlace) {
              return "A first place must be sat before third place";
            }

            if (!secondPlace) {
              return "A second place must be sat before third place";
            }
          }

          return true;
        }),
    },
    {
      name: "firstPlaceTeam",
      title: "1st place team",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "player" }],
          options: { disableNew: true },
        },
      ],
      fieldset: "result",
      hidden: ({ parent }) => !parent.teamBased,
      validation: (Rule) => [
        Rule.unique(),
        Rule.custom((currentTeam, context) => {
          const { parent } = context;

          if (currentTeam?.length > parent.teamSize) {
            return "Winner team cannot be larger than the games team size.";
          }

          return true;
        }),
      ],
    },
    {
      name: "secondPlaceTeam",
      title: "2nd place team",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "player" }],
          options: { disableNew: true },
        },
      ],
      fieldset: "result",
      hidden: ({ parent }) => !parent.teamBased,
      validation: (Rule) => [
        Rule.unique(),
        Rule.custom((currentTeam, context) => {
          const { parent } = context;

          if (currentTeam?.length > parent.teamSize) {
            return "Winner team cannot be larger than the games team size.";
          }

          return true;
        }),
      ],
    },
    {
      name: "thirdPlaceTeam",
      title: "3rd place team",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "player" }],
          options: { disableNew: true },
        },
      ],
      fieldset: "result",
      hidden: ({ parent }) => !parent.teamBased,
      validation: (Rule) => [
        Rule.unique(),
        Rule.custom((currentTeam, context) => {
          const { parent } = context;

          if (currentTeam?.length > parent.teamSize) {
            return "Winner team cannot be larger than the games team size.";
          }

          return true;
        }),
      ],
    },
  ],
  preview: {
    select: {
      players: "players",
      firstPlace: "firstPlace.firstName",
      secondPlace: "secondPlace.firstName",
      thirdPlace: "thirdPlace.firstName",
      name: "name",
    },
    prepare(selection) {
      const { name, firstPlace, secondPlace, thirdPlace, players } = selection;

      let result = [];
      if (firstPlace) {
        result.push(`1st ${firstPlace}`);
      }

      if (secondPlace) {
        result.push(`2nd ${secondPlace}`);
      }

      if (thirdPlace) {
        result.push(`3rd ${thirdPlace}`);
      }

      return {
        title: `${name || "Unnamed Game"} (${players?.length || 0} players)`,
        subtitle: result.join(", "),
      };
    },
  },
};
