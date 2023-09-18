import { Request, Response } from "express";
import UserModels from "../models/UserModels";

const userModels = new UserModels();

class UserControllers {
  async submitNewUserToDatabase(req: Request, res: Response) {
    const { name } = req.body.data ?? false;

    if (!name) {
      return res.status(404).send({ message: "Username is required." });
    }

    const isUserRegistered = await userModels.checkIfUserExists("name", name);

    if (isUserRegistered) {
      return res.status(409).send({ message: "User is already registered." });
    }

    try {
      const newUser = await userModels.registerNewUser(name);

      res.cookie("sessionId", newUser.token, {
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days,
      });

      return res.status(201).send({ user: newUser });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(409).send({ message: error.message });
      }
    }
  }

  async getUser(req: Request, res: Response) {
    const { sessionId } = req.cookies ?? "";

    if (!sessionId) {
      return res.status(404).send({ message: "User not found." });
    }

    const isUserRegistered = await userModels.checkIfUserExists(
      "identificationToken",
      sessionId
    );

    if (isUserRegistered) {
      return res.status(200).send({ data: isUserRegistered });
    } else {
      return res.status(404).send({ message: "User not found." });
    }
  }

  async userDashboard(req: Request, res: Response) {
    const { sessionId } = req.cookies ?? "";

    if (!req.params.username) {
      return res.status(404).send({ message: "Username not found." });
    }

    const { username } = req.params;

    if (!sessionId) {
      return res.status(404).send({ message: "User not found." });
    }

    const userInformations = await userModels.checkIfUserExists(
      "name",
      username
    );

    if (!userInformations) {
      return res.status(404).send({ message: "User not found." });
    }

    const totalMeals = userInformations?.meals.length;
    let totalMealsOnDiet = 0;
    let totalMealsOutOfDiet = 0;
    let bestUserMealOnDietStrike = 0;
    let userMealOnDietStrike = 0;

    if (totalMeals < 1) {
      return res.status(200).send({ message: "No meals found." });
    }

    for (const meal of userInformations?.meals) {
      if (meal.isThisMealOnDiet) {
        totalMealsOnDiet++;
      } else {
        totalMealsOutOfDiet++;
      }
    }

    for (let i = 0; i < userInformations.meals.length; i++) {
      if (userInformations.meals[i].isThisMealOnDiet) {
        userMealOnDietStrike++;
      } else {
        if (userMealOnDietStrike > bestUserMealOnDietStrike) {
          bestUserMealOnDietStrike = userMealOnDietStrike;
        }

        userMealOnDietStrike = 0;
      }
    }

    if (userMealOnDietStrike > bestUserMealOnDietStrike) {
      bestUserMealOnDietStrike = userMealOnDietStrike;
    }

    const userMetrics = {
      name: userInformations.name,
      totalMeals,
      totalMealsOnDiet,
      totalMealsOutOfDiet,
      bestUserMealOnDietStrike,
    };

    if (userInformations) {
      return res.status(200).send({ data: userMetrics });
    } else {
      return res.status(404).send({ message: "User not found." });
    }
  }
}

export default UserControllers;
