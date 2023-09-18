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

interface UserSchema {
  id: number;
  identificationToken: string;
  name: string;
  created_at: Date;
  meals: {
    id: number;
    name: string;
    description: string;
    dateTime: string;
    isThisMealOnDiet: boolean;
    userId?: string | null;
  }[];
}
