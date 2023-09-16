import express, { Express, Request, Response } from "express";
import "dotenv/config";
import routes from "./routes";

const server: Express = express();
const port = process.env.PORT;

routes.forEach((route) => {
  server[route.method as keyof typeof server](
    route.path,
    (req: Request, res: Response) => {
      route.handler(req, res);
    }
  );
});

server.listen(port, () => {
  console.log(`[server]: Server is running ⚡️`);
});

export default server;
