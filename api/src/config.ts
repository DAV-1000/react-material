// config.ts
import * as dotenv from "dotenv";

dotenv.config({ path: `.env` });
dotenv.config({ path: `.env.${process.env.ENVIRONMENT}` });

export const API_BASE_URL = process.env.API_BASE_URL;
export const COSMOS_DB_CONNECTION_STRING = process.env.COSMOS_DB_CONNECTION_STRING;