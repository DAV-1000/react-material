// config.ts
import * as dotenv from "dotenv";

dotenv.config({ path: `.env` });
dotenv.config({ path: `.env.${process.env.ENVIRONMENT}` });

export const APP_ENV = process.env.APP_ENV;
export const COSMOS_DB_CONNECTION_STRING = process.env.COSMOS_DB_CONNECTION_STRING;