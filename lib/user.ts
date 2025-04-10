"use server";

import { prisma } from "@/lib/db";
import { getSession } from "next-auth/react";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  } catch {
    return null;
  }
};

export const getUserInstrument = async (email: string) => {
  const instrument = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      instrument: true,
    },
  });
  return instrument;
};
