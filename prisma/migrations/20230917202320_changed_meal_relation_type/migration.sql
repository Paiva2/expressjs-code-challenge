-- DropForeignKey
ALTER TABLE "Meals" DROP CONSTRAINT "Meals_userId_fkey";

-- AlterTable
ALTER TABLE "Meals" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Meals" ADD CONSTRAINT "Meals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("identificationToken") ON DELETE SET NULL ON UPDATE CASCADE;
