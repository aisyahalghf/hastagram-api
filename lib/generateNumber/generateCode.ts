import { PrismaClient } from "@prisma/client";

export const generateNumber = async (input: string) => {
  const prisma = new PrismaClient();
  const random = () => {
    let random = (Math.random() + 1).toString(36).substring(2);
    let code = input + "_" + random;
    return code;
  };
  const randomCode = random();

  const checkingDatabase = await prisma.history.findUnique({
    where: {
      code: randomCode,
    },
  });

  if (checkingDatabase) {
    return random();
  }

  return randomCode;
};
