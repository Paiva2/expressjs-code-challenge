import { Request, Response } from "express";
import { RoutesSchema } from "../@types";
import UserControllers from "../api/controllers/UserControllers";
import MealController from "../api/controllers/MealController";

const userControllers = new UserControllers();
const mealController = new MealController();

const routes: RoutesSchema[] = [
  {
    path: "/new-user",
    method: "post",
    handler: (req: Request, res: Response) => {
      userControllers.submitNewUserToDatabase(req, res);
    },
  },

  {
    path: "/user",
    method: "get",
    handler: (req: Request, res: Response) => {
      userControllers.getUser(req, res);
    },
  },

  {
    path: "/meals",
    method: "post",
    handler: (req: Request, res: Response) => {
      mealController.submitNewMealToDatabase(req, res);
    },
  },
];

export default routes;
