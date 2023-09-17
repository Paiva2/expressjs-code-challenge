import { NewMealSchema, UpdateMealSchema } from "../../@types";
import prisma from "../../lib/prisma";

class MealModels {
  async checkIfUserExists(field: string, data: string) {
    const user = await prisma.user.findFirst({
      where: {
        [field]: data,
      },
      include: {
        meals: true,
      },
    });

    return user;
  }

  async createNewMeal(newMeal: NewMealSchema) {
    const { name, description, dateTime, isThisMealOnDiet } = newMeal.meal;

    await prisma.meals.create({
      data: {
        name,
        description,
        dateTime,
        isThisMealOnDiet: Boolean(isThisMealOnDiet),
        userId: newMeal.user,
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

  async deleteUserMeal(id: number) {
    await prisma.meals.delete({
      where: {
        id,
      },
    });
  }

  async updateUserMeal(data: UpdateMealSchema) {
    const { updatedMeal } = data;
    const { id } = data;
    const { sessionId } = data;

    await prisma.meals.update({
      where: {
        id,
        userId: sessionId,
      },
      data: {
        ...updatedMeal,
        isThisMealOnDiet: Boolean(updatedMeal.isThisMealOnDiet),
      },
    });
  }
}

export default MealModels;
