import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../errorHelper/AppError";
dotenv.config();

interface ENVCONFIG {
  PORT: string;
  DATABASE_URL: string;
  NODE_ENV: "development" | "production";
  JWT: {
    JWT_ACCESS_SECRET: string;
    JWT_ACCESS_EXPIRATION_TIME: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRATION_TIME: string;
  };

  CLOUDINARY: {
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
  };

  OPEN_ROUTER_API_KEY: string;

  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  FRONTEND_URL: string;
  // BCRYPT_SALT_ROUND: string;
  // ADMIN_EMAIL: string;
  // ADMIN_PASSWORD: string;
}

const loadEnvVariable = (): ENVCONFIG => {
  const requiredEnvVariables: string[] = [
    "PORT",
    "DATABASE_URL",
    "NODE_ENV",

    "JWT_ACCESS_SECRET",
    "JWT_ACCESS_EXPIRATION_TIME",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRATION_TIME",

    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "CLOUDINARY_URL",

    "OPEN_ROUTER_API_KEY",

    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "FRONTEND_URL",

    // "BCRYPT_SALT_ROUND",
    // "ADMIN_EMAIL",
    // "ADMIN_PASSWORD",
  ];

  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        `Missing require environment variable ${key}`
      );
    }
  });

  return {
    PORT: process.env.PORT as string,
    DATABASE_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    JWT: {
      JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
      JWT_ACCESS_EXPIRATION_TIME: process.env
        .JWT_ACCESS_EXPIRATION_TIME as string,
      JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
      JWT_REFRESH_EXPIRATION_TIME: process.env
        .JWT_REFRESH_EXPIRATION_TIME as string,
    },
    CLOUDINARY: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
    },

    OPEN_ROUTER_API_KEY: process.env.OPEN_ROUTER_API_KEY as string,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    // BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    // ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
    // ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string,
  };
};

export const envVars = loadEnvVariable();
