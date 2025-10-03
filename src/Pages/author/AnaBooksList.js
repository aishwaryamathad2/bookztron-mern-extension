//Anabookslist 
import React, { useState } from "react"; 
 import "./AuthorDashboard.css";
  const initialBooks = [ { id: 1, title: "Twisted Love", price: 499, cover: "/books/twistedlove.jpeg" }, { id: 2, title: "Twisted Hate", price: 529, cover: "/books/twistedhate.jpeg" }, { id: 3, title: "Twisted Lies", price: 549, cover: "/books/twistedlies.jpeg" }, { id: 4, title: "King of Wrath", price: 599, cover: "/books/kingofwrath.jpeg" }, { id: 5, title: "King of Envy", price: 579, cover: "/books/kingofenvy.jpeg" }, { id: 6, title: "King of Sloth", price: 569, cover: "/books/kingofsloth.jpeg" }, ]; 
 function AnaBooksList() { const [books, setBooks] = useState(initialBooks); 
 const [editingBook, setEditingBook] = useState(null); 
 const [newTitle, setNewTitle] = useState(""); 
 const [newPrice, setNewPrice] = useState(""); 
 const handleDelete = (id) => { setBooks(books.filter((book) => book.id !== id)); 
 }; 
 const handleEdit = (book) => { setEditingBook(book); 
 setNewTitle(book.title); 
 setNewPrice(book.price); 
 };
  const handleSave = () => { setBooks( books.map((book) => book.id === editingBook.id ? { ...book, title: newTitle, price: newPrice } : book ) ); 
 setEditingBook(null);
  }; 
 return ( <div className="section-container"> 
 <h2>My Books</h2> 
 <div className="books-grid"> 
 {books.map((book) => ( <div key={book.id} className="book-card">
  <img src={book.cover} alt={book.title} />
 
 <h3>{book.title}</h3> <p>₹{book.price}</p> 
 <div className="book-actions">
    <button className="edit-btn" onClick={() => handleEdit(book)}> Edit </button> 
    <button onClick={() => handleDelete(book.id)}>Delete</button> 
    </div> </div> ))} </div> {/* 🔹 Modal for Editing */} {editingBook && ( <div className="modal-overlay">
         <div className="modal"> 
            <h3>Edit Book</h3> 
            <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Book Title" /> 
         <input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="Price" />
      <div className="modal-actions"> <button onClick={handleSave}>Save</button>
    <button onClick={() => setEditingBook(null)}>Cancel</button> </div> </div> </div> )} </div> );
  } 
export default AnaBooksList;