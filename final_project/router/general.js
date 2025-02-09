const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "username or password required" });
    }

    // Vérifier si le nom d'utilisateur existe déjà
    if (!isValid(username)) {
        return res.status(400).json({ message: "Username exist" });
    }
    // Ajouter l'utilisateur dans notre "base de données"
    users.push({
        'username': username,
        'password': password
    });
    // Répondre avec un message de succès
    return res.status(201).json({ message: "User save!" });
    
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    //Write your code here
    const book = await books;
    return res.status(200).json({ book }, null, 4);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    // Utilisation de Promise pour simuler une opération asynchrone
    new Promise((resolve, reject) => {
        const book = books[isbn];
        resolve(book);
    })
        .then(book => {
            return res.status(200).json({ book }, null, 4);
        })
        .catch(error => {
            return res.status(500).json({ message: "Error serveur", error });
        });
});


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    const author = req.params.author;

    new Promise((resolve, reject) => {
        const book = Object.values(books).filter((book) => book.author === author);
        resolve(book);
    })
        .then(book => {
            return res.status(200).json({ book }, null, 4);
        })
        .catch(error => {
            return res.status(500).json({ message: "Error serveur", error });
        });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    const title = req.params.title;
    new Promise((resolve, reject) => {
        const book = Object.values(books).filter((book) => book.title === title);
        resolve(book);
    })
        .then(book => {
            return res.status(200).json({ book }, null, 4);
        })
        .catch(error => {
            return res.status(500).json({ message: "Error serveur", error });
        });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;

    // Utilisation de Promise pour simuler une opération asynchrone
    new Promise((resolve, reject) => {
        const book = books[isbn].reviews;

        resolve(book);
    })
        .then(book => {
            return res.status(200).json({ book }, null, 4);
        })
        .catch(error => {
            return res.status(500).json({ message: "Error serveur", error });
        });
});

module.exports.general = public_users;
