const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

let readBooks = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(books)
    },1000)})

function readBooksbyISBN(isbn){
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            const book = books.find(book => book.isbn == isbn)
            resolve(book)
        },1000)})
}


function readBooksbyAuthor(author){
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            const book = books.find(book => book.author == author)
            resolve(book)
        },1000)})
}


function readBooksbyTitle(title){
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            const book = books.find(book => book.title == title)
            resolve(book)
        },1000)})
}

public_users.post("/register", (req,res) => {

  const username = req.body.username
  const password = req.body.password
  
  if(!username || !password) {
      return res.status(300).json({message: "Please provide username and password!"});
  }

  const user = users.find(user => user.username == username)
  if (user) {
      return res.status(404).json({message: "User already exist"});
    }

    users.push({
    "username": username,
    "password": password
    })

    return res.json({ message: "User successfully registered!"});

});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    const books = await readBooks
    return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {

    const book = await readBooksbyISBN(req.params.isbn)
//   let book = books.find(book => book.isbn === req.params.isbn)

  if(!book){
    return res.status(404).json({message: "No book found!"});
  }

  return res.json(book);
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {

    const book = await readBooksbyAuthor(req.params.author)

    // let book = books.find(book => book.author === req.params.author)

    if(!book){
        return res.status(404).json({message: "No book found!"});
    }

    return res.json(book);
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const book = await readBooksbyTitle(req.params.title) 

    // let book = books.find(book => book.title === req.params.title)

    if(!book){
        return res.status(404).json({message: "No book found!"});
    }

    return res.json(book);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let book = books.find(book => book.isbn === req.params.isbn)
    let reviews = book.reviews

    if(!reviews){
        return res.status(404).json({message: "No review found!"});
    }

    return res.json(reviews);
});

module.exports.general = public_users;
