import { chownSync } from "fs";
import React from "react";

function Book(props: any) {
  const { title, author, primary_isbn13, rank, reviews } = props.data;

  function Review(props: any) {
    // console.log("Arvostelu", data);
    // console.log(props);
    return (
      <li>
        <a href={props.data.url}>
          {props.data.byline ? props.data.byline : "Unknown"}
        </a>
      </li>
    );
  }

  return (
    <div
      style={{
        padding: "10px",
        width: "15%",
        textAlign: "left",

        border: "1px solid gray",
        borderColor: "lightgray",
      }}
    >
      <h3>
        {rank}. {title}
      </h3>
      <p>
        <b>Author:</b> {author}
      </p>
      <p>
        <b>isbn:</b> {primary_isbn13}
      </p>
      {reviews && (
        <div>
          <h4>Reviews</h4>
          <ul>
            {reviews.map((arv: any, index: number) => (
              <Review key={index} data={arv}></Review>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Book;
