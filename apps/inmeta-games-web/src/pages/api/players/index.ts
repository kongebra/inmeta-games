import RouteHandler from "helpers/route-handler";
import { getClient } from "lib/sanity.server";

export const config = {
  api: {
    bodyParse: false,
  },
};

export default RouteHandler({
  async GET(req, res) {
    const client = getClient();

    const data = await client.fetch(`*[_type == "player"][]`);

    res.status(200).json(data);
  },

  async POST(req, res) {
    // TODO: Upload file (via Formidable)

    const record = req.body as { firstName: string; lastName: string };

    const client = getClient();

    const data = await client.create({
      _type: "player",

      firstName: record.firstName,
      lastName: record.lastName,
    });

    res.status(201).json(data);
  },
});
