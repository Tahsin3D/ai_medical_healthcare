// All database interaction will happen in this file

import "server-only";

import { cache } from "react";
import { getAuthenticateUser } from "../session";
import { prisma } from "../db/prisma";
import {
  UserCredentialDTO,
  UserIDandRoleForSessionDTO,
  UserProfileDTO,
} from "../dto/user.dto";
import bcrypt from "bcryptjs";

export const getUser = cache(async (): Promise<UserProfileDTO | null> => {
  const session = await getAuthenticateUser();
  if (!session) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        name: true,
        dob: true,
        email: true,
        phone: true,
        gender: true,
        role: true,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
});

export const getUserCredentialsByEmail = cache(
  async (email: string): Promise<UserCredentialDTO | null> => {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
      },
    });
    return user;
  }
);

export const insertUserToDB = async (
  name: string,
  email: string,
  hashedPassword: string
): Promise<number | null> => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) return null;
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        token: Math.floor(1000 + Math.random() * 900000),
      },
    });
    return user.token;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const verifyEmailTokenfromDB = async ({
  email,
  verifyToken,
}: {
  email: string | undefined;
  verifyToken: number | undefined;
}): Promise<UserIDandRoleForSessionDTO | undefined> => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user || user.token != verifyToken) return undefined;

  await prisma.user.update({
    where: { email },
    data: {
      token: 0,
      is_verified: true,
    },
  });
  return { id: user.id, role: user.role };
};

export const isUserVerified = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  const is_verified = user?.is_verified;

  return is_verified;
};

export const verifyUserCredentials = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) return;

  if (user.is_verified) return "alreadyVerified";

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) return;

  return user.email;
};

export const setUserToken = async ({
  code,
  email,
}: {
  code: number;
  email: string;
}) => {
  const user = await prisma.user.update({
    where: { email },
    data: {
      token: code,
    },
  });
};

export const resetPasswordInDB = async ({
  code,
  newPassword
}: {
  code: number;
  newPassword: string;
}) => {
  const user = await prisma.user.findFirst({
    where: {token: code}
  })

  if(!user || !user.token) return;

  const updatedUser = await prisma.user.update({
    where: {token: user.token},
    data: {
      password: newPassword,
      token: null
    }
  })

  return updatedUser.email
  
};
