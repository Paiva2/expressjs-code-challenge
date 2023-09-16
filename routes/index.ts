import { Request, Response } from "express";
import { RoutesSchema } from "../@types";

const routes: RoutesSchema[] = [
  {
    path: "/new-user",
    method: "get",
    handler: (req: Request, res: Response) => {
      return res.status(200).send("Hello World!");
    },
  },
];

export default routes;
