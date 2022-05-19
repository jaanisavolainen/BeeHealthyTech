import express from "express";
import { getBooksInCategory, getCategories } from "../controllers/index";
export const NYTimes = express.Router();

NYTimes.get("/categories", getCategories);
NYTimes.get("/books/:id", getBooksInCategory);

