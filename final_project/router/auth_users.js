const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
     const user = users.filter((user)=> user.username === username);
     if(user.length > 0 )
     {
        return true;
     }
     else{
        return false;
     }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
const user = users.filter((user)=> user.username === username && user.password === password );
     if(user.length > 0 )
     {
        return true;
     }
     else{
        return false;
     }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username,password} = req.body;
  if (!username || !password) {
        return res.status(404).json({ message: "Username or password required" });
    }
    if(!authenticatedUser(username,password))
    {
        return res.status(404).json({ message: "Username or password not found" });
    }
    // Generate JWT access token
    const user = {'username':username,'password':password};
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
  let filter_users = Object.values(filtered_reviews).filter((review)=>review.username === req.user.username);
  if(filter_users.length > 0){
    let filter_review = filter_users[0];
    
    let review = req.query.review;
    if(review){
        filter_review.comment = review;
    }
    filtered_reviews = Object.values(filtered_reviews).filter((review)=> review.username != req.user.username);

    filtered_reviews.push(filter_review);

    res.status(200).json({message:`Review update`})
  }
  else{
    filtered_reviews.push({
        'comment' : req.query.review,
        'username' : req.user.username,
    })
    res.status(200).json({message:`Review add`})
  }
});

// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
  
    books[isbn].reviews = Object.values(filtered_reviews).filter((review)=>review.username != req.user.username);
    res.status(200).json({message:`Review for ${req.user} delete`})
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
