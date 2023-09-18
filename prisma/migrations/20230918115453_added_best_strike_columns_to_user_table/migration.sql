-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bestMealOnDietStrike" INTEGER,
ADD COLUMN     "mealOnDietStrike" INTEGER NOT NULL DEFAULT 0;
