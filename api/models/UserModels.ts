import prisma from "../../lib/prisma";

class UserModels {
  async checkIfUserExists(name: string) {
    const user = await prisma.user.findFirst({
      where: {
        name,
      },
    });

    return user;
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
