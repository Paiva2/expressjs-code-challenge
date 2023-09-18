import { UserSchema } from "../../@types";
import prisma from "../../lib/prisma";

class UserModels {
  async checkIfUserExists(field: string, data: string) {
    const user: UserSchema | null = await prisma.user.findFirst({
      where: {
        [field]: data,
      },
      include: {
        meals: true,
      },
    });

    if (!user) throw new Error("User not found.");

    for (const id of user?.meals) {
      if (id.userId) {
        delete id.userId;
      }
    }

    const omitUserId = {
      data: {
        id: user?.id,
        name: user?.name,
        created_at: user?.created_at,
        meals: user?.meals,
      },
    };

    return omitUserId.data;
  }

  async registerNewUser(name: string) {
    const newUser = await prisma.user.create({
      data: {
        name,
      },
    });

    return {
      name: newUser.name,
      token: newUser.identificationToken,
    };
  }
}

export default UserModels;
