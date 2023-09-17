import { Request, Response } from "express";
import MealModels from "../models/MealModels";
import moment from "moment";
import formatDate from "../../utils/formatDate";
import { Meal } from "../../@types";

const mealModels = new MealModels();

class MealController {
  async getAllUserMeals(req: Request, res: Response) {
    const { sessionId } = req.cookies ?? "";

    if (!sessionId) {
      return res.status(404).send({ message: "User not found." });
    }

    const isUserRegistered = await mealModels.checkIfUserExists(
      "identificationToken",
      sessionId
    );

    if (!isUserRegistered) {
      return res.status(404).send("User not found.");
    }

    return res.status(200).send({ data: isUserRegistered.meals });
  }

  async getMealByParam(req: Request, res: Response) {
    const { sessionId } = req.cookies ?? "";

    if (!sessionId) {
      return res.status(404).send({ message: "User not found." });
    }

    const getUserMeals = await mealModels.checkIfUserExists(
      "identificationToken",
      sessionId
    );

    if (!getUserMeals) {
      return res.status(404).send("User not found.");
    } else if (!req.params?.mealId) {
      return res.status(409).send({ message: "Meal Id not found." });
    }

    const { mealId } = req.params;

    const getMealById = getUserMeals.meals.filter(
      (meal) => meal.id === Number(mealId)
    );

    if (getMealById.length < 1) {
      return res.status(404).send({ message: "Meal with this Id not found." });
    }

    return res.status(200).send({ data: getMealById });
  }

  async submitNewMealToDatabase(req: Request, res: Response) {
    const { meal } = req.body.data ?? {};
    const { sessionId } = req.cookies ?? "";

    if (!sessionId) {
      return res.status(404).send({ message: "User not found." });
    } else if (!meal) {
      return res.status(409).send({ message: "Meal not found." });
    }

    const isUserRegistered = await mealModels.checkIfUserExists(
      "identificationToken",
      sessionId
    );

    if (!isUserRegistered) {
      return res.status(404).send("User not found.");
    }

    const isDateValid = moment(new Date(meal.dateTime)).isValid();

    if (!isDateValid) {
      return res.status(409).send({
        message:
          "Invalid date format. Valid format example: 11/26/1999 18:00:00",
      });
    }

    const newMeal: Meal = {
      name: meal.name,
      description: meal.description,
      dateTime: formatDate(new Date(meal.dateTime)),
      isThisMealOnDiet: JSON.parse(meal.isThisMealOnDiet),
    };

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

  async removeMealFromDatabase(req: Request, res: Response) {
    const { sessionId } = req.cookies ?? "";

    if (!sessionId) {
      return res.status(404).send({ message: "User not found." });
    }

    const isUserRegistered = await mealModels.checkIfUserExists(
      "identificationToken",
      sessionId
    );

    if (!isUserRegistered) {
      return res.status(404).send("User not found.");
    } else if (!req.params?.mealId) {
      return res.status(409).send({ message: "Meal Id not found." });
    }

    const { mealId } = req.params;

    const userHasThisMeal = isUserRegistered.meals.some(
      (meal) => meal.id === +mealId
    );

    if (!userHasThisMeal) {
      return res.status(404).send({ message: "Meal not found." });
    }

    try {
      await mealModels.deleteUserMeal(+mealId);

      return res.status(200).send();
    } catch {
      return res
        .status(500)
        .send({ message: "Server error. Try again later." });
    }
  }

  async submitUpdatedMealToDatabase(req: Request, res: Response) {
    const { meal } = req.body.data ?? {};
    const { sessionId } = req.cookies ?? "";

    if (!sessionId) {
      return res.status(404).send({ message: "Identification Id not found." });
    } else if (!req.params?.mealId) {
      return res.status(404).send({ message: "Meal Id not found." });
    } else if (!meal) {
      return res.status(409).send({ message: "Invalid meal schema." });
    }

    const isUserRegistered = await mealModels.checkIfUserExists(
      "identificationToken",
      sessionId
    );

    if (!isUserRegistered) {
      return res.status(404).send("User not found.");
    }

    const { mealId } = req.params;

    const getCurrentMealState = isUserRegistered.meals.find(
      (meal) => meal.id === +mealId
    );

    if (!getCurrentMealState) {
      return res.status(404).send({ message: "Meal not found." });
    }

    const isDateValid =
      meal.dateTime && moment(new Date(meal.dateTime)).isValid();

    if (!isDateValid && meal.dateTime) {
      return res.status(409).send({
        message:
          "Invalid date format. Valid format example: 11/26/1999 18:00:00",
      });
    }

    let newMeal: Meal = {} as Meal;

    const mealEdittedKeys = Object.keys(meal);

    for (const key of mealEdittedKeys) {
      if (key === "dateTime") {
        meal.dateTime = formatDate(new Date(meal.dateTime));
      }

      if (key === "isThisMealOnDiet") {
        meal.isThisMealOnDiet = JSON.parse(meal.isThisMealOnDiet);
      }

      newMeal = {
        ...getCurrentMealState,
        ...newMeal,
        [key]: meal[key],
      };
    }

    try {
      await mealModels.updateUserMeal({
        id: +mealId,
        sessionId,
        updatedMeal: newMeal,
      });

      return res.status(200).send();
    } catch (e) {
      console.log(e);
      return res.status(500).send();
    }
  }
}

export default MealController;
