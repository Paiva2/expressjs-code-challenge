import { Request, Response } from "express";
import UserModels from "../models/UserModels";

const userModels = new UserModels();

class UserControllers {
  async submitNewUserToDatabase(req: Request, res: Response) {
    const { name } = req.body.data ?? false;

    if (!name) {
      return res.status(404).send({ message: "Username is required." });
    }

    const isUserRegistered = await userModels.checkIfUserExists(name);

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
}

export default UserControllers;
