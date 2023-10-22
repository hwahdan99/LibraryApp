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
   - GET /books/:isbn : Get details of a specific book by its ISBN.
   - PUT /books/:isbn : Update the details of a specific book.
   - DELETE /books/:isbn : Delete a specific book by its ISBN.
   - Request Body: ```{
  "title": "Book Title",
  "author": "Author Name",
  "isbn": "ISBN Number"
}```

2. Borrowers
   - GET /borrowers: Get a list of all registered borrowers.
   - POST /borrowers: Register a new borrower.
   - GET /borrowers/:borrowerId : Get details of a specific borrower by their ID.
   - PUT /borrowers/:borrowerId : Update the details of a specific borrower.
   - DELETE /borrowers/:borrowerId : Delete a specific borrower by their ID.
   - - Request Body: ```{
  "firstName": "Borrower first name",
  "lastName": "Borrower last name",
  "email": "Borrower Email"
}```
