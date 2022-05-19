import express, { Application, Request, Response } from "express";
import * as dotenv from "dotenv";
const app: Application = express();

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


import { NYTimes } from "./routes/index";
app.use("/nytimes", NYTimes);

try {
  app.listen(process.env.PORT, (): void => {
    console.log(`Connected successfully on port ${process.env.PORT}`);
  });
} catch (error) {
  console.error(`Error occured: ${error.message}`);
}
