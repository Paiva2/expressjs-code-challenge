import { Request, Response } from "express";
import { RoutesSchema } from "../@types";
import UserControllers from "../api/controllers/UserControllers";

const userControllers = new UserControllers();

const routes: RoutesSchema[] = [
  {
    path: "/new-user",
    method: "post",
    handler: (req: Request, res: Response) => {
      userControllers.submitNewUserToDatabase(req, res);
    },
  },
];

export default routes;
