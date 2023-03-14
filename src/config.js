import { config } from "dotenv";
config();

export default {
  PORT: process.env.PORT || 5001,
  APPID: process.env.APPID || "",
};
