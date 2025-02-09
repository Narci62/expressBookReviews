const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const user = req.body.user;
  if (!user) {
        return res.status(404).json({ message: "Body Empty" });
    }
    // Generate JWT access token
    let accessToken = jwt.sign({
        data: user
    }, 'access', { expiresIn: 60 * 60 });

    // Store access token in session
    req.session.authorization = {
        accessToken
    }
    return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;

  let filtered_reviews = books[isbn].reviews;
  let filter_users = Object.values(filtered_reviews).filter((review)=>review.user === req.user);
  if(filter_users.length > 0){
    let filter_review = filter_users[0];
    
    let review = req.query.review;
    if(review){
        filter_review.comment = review;
    }
    filtered_reviews = Object.values(filtered_reviews).filter((review)=> review.user != req.user);

    filtered_reviews.push(filter_review);

    res.status(200).json({message:`Review update`})
  }
  else{
    filtered_reviews.push({
        'comment' : req.query.review,
        'user' : req.user,
    })
    res.status(200).json({message:`Review add`})
  }
});

// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
  
    books[isbn].reviews = Object.values(filtered_reviews).filter((review)=>review.user != req.user);
    res.status(200).json({message:`Review for ${req.user} delete`})
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
