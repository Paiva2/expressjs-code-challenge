import { Request, Response } from "express";

export type RoutesSchema = {
  path: string;
  method: string;
  handler: (req: Request, res: Response) => void;
};

interface Meal {
  name: string;
  description: string;
  dateTime: string;
  isThisMealOnDiet: Boolean;
}

interface NewMealSchema {
  user: string;
  meal: Meal;
}

type UpdateMealSchema = {
  id: number;
  updatedMeal: Meal;
  sessionId: string;
};
