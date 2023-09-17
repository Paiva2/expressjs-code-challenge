import { Request, Response } from "express";
import MealModels from "../models/MealModels";

const mealModels = new MealModels();

class MealController {
  async submitNewMealToDatabase(req: Request, res: Response) {
    const { meal } = req.body.data ?? {};
    const { sessionId } = req.cookies ?? "";

    if (!sessionId) {
      return res.status(404).send({ message: "User not found." });
    }

    if (!meal) {
      return res.status(409).send({ message: "Meal not found." });
    }

    const isUserRegistered = await mealModels.checkIfUserExists(
      "identificationToken",
      sessionId
    );

    if (!isUserRegistered) {
      return res.status(404).send("User not found.");
    }

    const newMeal = {
      name: meal.name,
      description: meal.description,
      datetime: new Date(),
      isOnDiet: JSON.parse(meal.isOnDiet),
    };

    Array(newMeal).forEach((info) =>
      !info ? res.status(407).send("Invalid meal format.") : null
    );

    try {
      await mealModels.createNewMeal({
        user: isUserRegistered.identificationToken,
        meal: newMeal,
      });

      return res.status(201).send();
    } catch (e) {
      console.log(e);
      return res.status(500).send();
    }
  }
}

export default MealController;
