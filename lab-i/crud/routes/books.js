var express = require("express");
var router = express.Router();
const { DatabaseSync } = require("node:sqlite");
const path = require("node:path");

const dbPath = path.resolve(__dirname, "..", "data.db");
const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS book (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    pages INTEGER NOT NULL,
    description TEXT
  )
`);

router.get("/", function (req, res, next) {
  const books = db.prepare("SELECT * FROM book").all();
  res.render("books/index", { books: books, title: "Lista Książek" });
});

router.get("/create", function (req, res, next) {
  res.render("books/create", { title: "Dodaj Książkę" });
});

router.post("/create", function (req, res, next) {
  try {
    const { title, pages, description } = req.body;
    const result = db
      .prepare("INSERT INTO book (title, pages, description) VALUES (?, ?, ?)")
      .run(title, pages, description);
    res.redirect("/books/" + result.lastInsertRowid);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", function (req, res, next) {
  const book = db.prepare("SELECT * FROM book WHERE id = ?").get(req.params.id);
  if (!book) return next();
  res.render("books/show", { book: book, title: "Szczegóły: " + book.title });
});

router.get("/:id/edit", function (req, res, next) {
  const book = db.prepare("SELECT * FROM book WHERE id = ?").get(req.params.id);
  res.render("books/edit", { book: book, title: "Edycja: " + book.title });
});

router.post("/:id/edit", function (req, res, next) {
  try {
    const { title, pages, description } = req.body;
    db.prepare(
      "UPDATE book SET title = ?, pages = ?, description = ? WHERE id = ?",
    ).run(title, pages, description, req.params.id);
    res.redirect("/books/" + req.params.id);
  } catch (err) {
    next(err);
  }
});

router.post("/:id/delete", function (req, res, next) {
  try {
    db.prepare("DELETE FROM book WHERE id = ?").run(req.params.id);
    res.redirect("/books");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
