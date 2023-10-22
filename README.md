# LibraryApp
Hello and welcome to my vesion of the Library App (back-end edition)

Here is the link to the database schema:

https://drawsql.app/teams/hwahdan/diagrams/libraryapp

In order to run the application, you need the following:
1. Have node installed
2. Install dependencies using ```npm install```
3. Run the application using ```node app.js```

## API Endpoint Documentation:
1. Books
   - Endpoint: \books
   - GET /books: Get a list of all books in the library.
   - POST /books: Add a new book.
   - GET /books/:bookId : Get details of a specific book by its ID.
   - PUT /books/:bookId : Update the details of a specific book.
   - DELETE /books/:bookId: Delete a specific book by its ID.
   - Request Body: ```{
  "title": "Book Title",
  "author": "Author Name",
  "isbn": "ISBN Number"
}```
