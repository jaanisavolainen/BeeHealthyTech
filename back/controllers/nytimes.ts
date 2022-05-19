"use strict";

import { Response, Request, NextFunction } from "express";
import fetch from "node-fetch";
import * as dotenv from "dotenv";
dotenv.config();

export const getCategories = async (req: Request, res: Response) => {
  let response: any = await fetch(
    "https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=" +
      process.env.APIKEY
  );
  response = await response.json();
  return res.json(response);
};

export const getBooksInCategory = async (req: Request, res: Response) => {
  try {
    let { id } = req.params;
    let response: any = await fetch(
      "https://api.nytimes.com/svc/books/v3/lists/" +
        id +
        ".json?api-key=" +
        process.env.APIKEY
    );

    response = await response.json();
    if (response.status !== "OK") return res.json(response);
    response.results.books = response.results.books.slice(0, 10);

    await getReviewsForBooks(response.results.books);
    return res.json(response);
  } catch (e) {
    return res.json({ status: "error", error: e });
  }
};

async function getReviewsForBooks(books: any[]) {
  let fetches: any = [];

  //Jotta aplimitit ei pauku niin pahasti niin voidaan ottaa toinen loopin sisällä oleva isbn haku pois.
  books.forEach((book, index: number) => {
    fetches.push(fetchByISBN(book.primary_isbn13, book));
    fetches.push(fetchByISBN(book.primary_isbn10, book));
  });
  await Promise.all(fetches);
  //Mikäli aikaisemmassa forloopissa oli haku molemmilla isbn, niin nämä saattoi palauttaa monta kertaa saman arvostelun. Tällä filtteröidään vain yksi arvostelu urlin perusteella.
  books.forEach((element: any) => {
    if (element.reviews) {
      element.reviews = getUniqueListBy(element.reviews, "url");
    }
  });
}

async function fetchByISBN(isbn: any, book: any) {
  return new Promise((resolve) => {
    let response = fetch(
      "https://api.nytimes.com/svc/books/v3/reviews.json?isbn=" +
        isbn +
        "&api-key=" +
        process.env.APIKEY
    )
      .then((response) => response.json())
      .then((response: any) => {
        if (response.num_results > 0) {
          if (!book.reviews) book.reviews = [];

          let mergedReviewArray: any[] = [...book.reviews, ...response.results];
          book.reviews = mergedReviewArray;
        }

        resolve(true);
      })
      .catch((e) => {
        resolve(false);
      });
  });
}

function getUniqueListBy(arr: any[], key: any) {
  return [...new Map(arr.map((item: any) => [item[key], item])).values()];
}
