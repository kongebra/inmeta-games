import type { NextApiRequest, NextApiResponse } from "next";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type HttpHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void> | void;

type RouteHandlerParams = {
  GET?: HttpHandler;
  POST?: HttpHandler;
  PUT?: HttpHandler;
  PATCH?: HttpHandler;
  DELETE?: HttpHandler;
};

const RouteHandler = (handlers: RouteHandlerParams) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method as HttpMethod;
    const handler = handlers[method];

    if (!handler) {
      return res.status(405).json({ message: "method not allowed" });
    }

    return await handler(req, res);
  };
};

export default RouteHandler;
