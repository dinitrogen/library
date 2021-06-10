let myLibrary = [];

function Book(title, author, numPages, haveRead) {
    this.title = title;
    this.author = author;
    this.numPages = numPages;
    this.haveRead = haveRead;
}

Book.prototype.info = function() {
    if (this.haveRead) {
        return `"${this.title}" by ${this.author}, ${this.numPages} pages, have read already.`;
    } else {
        return `"${this.title}" by ${this.author}, ${this.numPages} pages, have not read yet.`;
    }
}



function addBookToLibrary(title, author, numPages, haveRead) {
    const newBook = new Book(title, author, numPages, haveRead);
    myLibrary.push(newBook);
}

addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 295, true);

console.table(myLibrary);
console.log(myLibrary[0].info());