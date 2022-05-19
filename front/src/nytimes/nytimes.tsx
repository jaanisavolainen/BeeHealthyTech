import React from "react";
import Book from "./book";

function Nytimes() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("");
  const [categories, setCategories] = React.useState<ICategory[]>([]);
  const [books, setBooks] = React.useState<IBook[]>([]);

  React.useEffect(() => {
    getCategories();
  }, []);

  React.useEffect(() => {
    getBooksInCategory();
  }, [selectedCategory]);

  async function getCategories() {
    await fetch("nytimes/categories")
      .then((response) => response.json())
      .then((response) => {
        if (response.status === "OK") setCategories(response.results);
      })
      .catch((error) => console.log("error", error));
  }
  async function getBooksInCategory() {
    if (selectedCategory === "") return;
    await fetch("nytimes/books/" + selectedCategory)
      .then((response) => response.json())
      .then((response: any) => {
        if (response.status === "OK") setBooks(response.results.books);
      })
      .catch((error) => console.log("error", error));
  }

  return (
    <div>
      <div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option></option>
          {categories.map((book: ICategory, index: number) => (
            <option key={book.list_name_encoded} value={book.list_name_encoded}>
              {book.display_name}
            </option>
          ))}
        </select>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "30px" }}>
          {books.map((book: IBook, index: number) => (
            <Book key={index} data={book}></Book>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Nytimes;


interface ICategory {
  list_name_encoded: string;
  display_name: string;
}
interface IBook {
  title: string;
  author: string;
  isbn: string;
}
