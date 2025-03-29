import dotenv from "dotenv";

dotenv.config();

const getEnvVariable = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
};

const config = {
  database: {
    host: getEnvVariable("DB_HOST"),
    port: getEnvVariable("DB_PORT"),
    user: getEnvVariable("DB_USER"),
    password: getEnvVariable("DB_PASSWORD"),
    name: getEnvVariable("DB_NAME"),
  },
  jwt: {
    expiresIn: getEnvVariable("JWT_EXPIRES_IN"),
    secret: getEnvVariable("JWT_SECRET"),
  },
  adjutor: {
    apiKey: getEnvVariable("ADJUTOR_API_KEY"),
    baseUrl: getEnvVariable("ADJUTOR_BASE_URL"),
  },
};

export default config;
