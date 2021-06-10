let myLibrary = [];
const bookList = document.querySelector("#bookList");

const newBookFormDiv = document.querySelector('#newBookFormDiv');
const newBookButton = document.querySelector('#newBookButton');


const newBookForm = document.createElement('form');
const newTitleField = document.createElement('input');
newTitleField.setAttribute('type','text');
newTitleField.setAttribute('placeholder','Title');
newTitleField.setAttribute('id', 'newTitle');
const newAuthorField = document.createElement('input');
newAuthorField.setAttribute('type','text');
newAuthorField.setAttribute('placeholder','Author');
newAuthorField.setAttribute('id', 'newAuthor');
const newNumPagesField = document.createElement('input');
newNumPagesField.setAttribute('type','text');
newNumPagesField.setAttribute('placeholder','# of pages');
newNumPagesField.setAttribute('id', 'newNumPages');
const newHaveReadLabel = document.createElement('label');
newHaveReadLabel.textContent = "Have you read it?";
const newHaveReadBox = document.createElement('input');
newHaveReadBox.setAttribute('type','checkbox');
newHaveReadBox.setAttribute('id', 'newHaveRead');
const submitButton = document.createElement('button');
// submitButton.setAttribute('type','submit');

newBookButton.addEventListener('click', function() {
    generateNewBookForm()
});



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

Book.prototype.toggleRead = function() {
    if (this.haveRead) {
        this.haveRead = false;
    } else {
        this.haveRead = true;
    }
}


function addBookToLibrary(title, author, numPages, haveRead) {
    const newBook = new Book(title, author, numPages, haveRead);
    myLibrary.push(newBook);
}


function displayLibrary() {
    myLibrary.forEach(function(element, i) {
        const bookCardDiv = document.createElement('div');
        bookCardDiv.setAttribute('class', 'bookCard');
        bookCardDiv.setAttribute('id', `book${i}`)
        bookList.appendChild(bookCardDiv);

        const bookInfoDiv = document.createElement('div');
        bookInfoDiv.setAttribute('class', 'bookInfoDiv');
        bookCardDiv.appendChild(bookInfoDiv);
        bookInfoDiv.textContent = element.info();
        
        const buttonDiv = document.createElement('div');
        buttonDiv.setAttribute('class', 'buttonDiv');
        bookCardDiv.appendChild(buttonDiv);

        const readButton = document.createElement('button');
        readButton.setAttribute('class', 'readButton');
        readButton.setAttribute('id', `readBook${i}`)
        buttonDiv.appendChild(readButton);
        readButton.textContent = 'Toggle read status';
        readButton.onclick = function() {
            element.toggleRead();
            bookInfoDiv.textContent = element.info();            
        }

        const delButton = document.createElement('button');
        delButton.setAttribute('class', 'delButton');
        buttonDiv.appendChild(delButton);
        delButton.textContent = 'Remove book';
        delButton.onclick = function() {
            bookList.removeChild(bookCardDiv);
        }
        
    });
}

function generateNewBookForm() {
    newBookFormDiv.appendChild(newBookForm);
    newBookForm.appendChild(newTitleField);
    newBookForm.appendChild(newAuthorField);
    newBookForm.appendChild(newNumPagesField);
    newBookForm.appendChild(newHaveReadLabel);
    newBookForm.appendChild(newHaveReadBox);
    newBookForm.appendChild(submitButton);

    submitButton.addEventListener('click', function() {
        let newTitle = document.getElementById('newTitle').value;
        console.log(newTitle);
        let newAuthor = document.getElementById('newAuthor').value;
        let newNumPages = document.getElementById('newNumPages').value;
        let newHaveRead = false;
        if (document.getElementById('newHaveRead').checked) {
            newHaveRead = true;
        } else {
            newHaveRead = false;
        }
        addBookToLibrary(newTitle, newAuthor, newNumPages, newHaveRead);
        console.table(myLibrary);
        displayLibrary();
    });
}


addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 295, true);
addBookToLibrary("The Hobbit 2", "J.R.R. Tolkien", 295, true);
addBookToLibrary("The Hobbit 4", "J.R.R. Tolkien", 295, true);

console.table(myLibrary);

// displayLibrary();
