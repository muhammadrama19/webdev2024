import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Book = () => {
  const [book, setBook] = useState([]);

useEffect(() => {
    // Fetch book from the Express API
    fetch('http://localhost:8001/books/book')
        .then((response) => response.json())
        .then((data) => {
            setBook(data);
        })
        .catch((error) => {
            console.error('There was an error fetching the book!', error);
        });
}, []);

console.log(book);

  return (
    <div>
      <h1>book</h1>
      <ul>
        {book.map((book) => (
          <li key={book.id}>{book.isbn} {book.title}</li>
          
        ))}
      </ul>
    </div>
  );
};

export default Book;
