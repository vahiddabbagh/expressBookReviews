const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {
        "username": "vahid",
        "password": "password123"
    }
];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  
    const username = req.body.username
    const password = req.body.password

    if(!username || !password){
        return res.status(404).json({message: "Username and password are required!"});
    }

    const user = users.find(user => user.username == username)

    if(!user){
        return res.status(404).json({message: "Username or password is incorrect!"});
    }
    
    if(user.password != password){
        return res.status(404).json({message: "Username or password is incorrect!"});
    }

    // Generate JWT access token
    let accessToken = jwt.sign({
        username: username
    }, 'access', { expiresIn: 600 * 60 });

    // Store access token and username in session
    req.session.authorization = {
        accessToken, username
    }

    return res.json({accessToken: accessToken});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const username = req.user.username

    if(!req.query.review){
        return res.status(300).json({message: "Review in query is required!"});
    }

    const book = books.find(book => book.isbn
== req.params.isbn)

    if(!book){
        return res.status(404).json({message: "Book not found for the provided ISBN!"});
    }

    books = books.map(book => {
        if(book.isbn == req.params.isbn){
            const prevReview = book.reviews.find(review => review.username == username)

            if (prevReview) {
                book.reviews = book.reviews.map(review => {
                    if (review.username == username) {
                        review.message = req.query.review
                    }review

                    return review
                })
            }else{
                book.reviews = [...book.reviews, {
                    username: username,
                    message: req.query.review 
                }]
            }

        }

        return book;
    })

    return res.json({message: "Review is added!"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
