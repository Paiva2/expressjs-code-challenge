import prisma from "../../lib/prisma";

class UserModels {
  async checkIfUserExists(field: string, data: string) {
    const user = await prisma.user.findFirst({
      where: {
        [field]: data,
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
