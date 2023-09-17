import prisma from "../../lib/prisma";

interface NewMealSchema {
  user: string;
  meal: {
    name: string;
    description: string;
    datetime: Date;
    isOnDiet: Boolean;
  };
}

class MealModels {
  async checkIfUserExists(field: string, data: string) {
    const user = await prisma.user.findFirst({
      where: {
        [field]: data,
      },
    });

    return user;
  }

  async createNewMeal(newMeal: NewMealSchema) {
    const { name, description, datetime, isOnDiet } = newMeal.meal;

    await prisma.meals.create({
      data: {
        name: name,
        description: description,
        dateTime: datetime,
        isThisMealOnDiet: Boolean(isOnDiet),
      },
      select: {
        User: {
          where: {
            identificationToken: newMeal.user,
          },
        },
      },
    });
  }
}

export default MealModels;
