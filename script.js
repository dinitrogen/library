let myLibrary = [];

/*
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('mySavedLibrary')) {
        loadLibrary();
        displayLibrary();  
    } 
});
*/

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
const submitButton = document.createElement('input');
submitButton.setAttribute('type','button');
submitButton.setAttribute('value', 'Submit');



newBookButton.addEventListener('click', function() {
    generateNewBookForm();
});

submitButton.addEventListener('click', function() {
    if (checkDuplicates()) {
        alert("Already in your library!");
        return;
    } else {
        addNewBook();
        displayLibrary();
        while (newBookFormDiv.firstChild) {
            newBookFormDiv.removeChild(newBookFormDiv.firstChild);
        }
    }
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
    saveLibrary();
}


function displayLibrary() {
    while (bookList.firstChild) {
        bookList.removeChild(bookList.firstChild);
    }

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
            myLibrary.splice(myLibrary.indexOf(element), 1);
            saveLibrary();
            // myLibrary.splice(i, 1); causes unintended duplicate
            console.table(myLibrary); // Remove later
        }
    });
}


function generateNewBookForm() {
    newBookForm.reset();
    newBookFormDiv.appendChild(newBookForm);
    newBookForm.appendChild(newTitleField);
    newBookForm.appendChild(newAuthorField);
    newBookForm.appendChild(newNumPagesField);
    newBookForm.appendChild(newHaveReadLabel);
    newBookForm.appendChild(newHaveReadBox);
    newBookForm.appendChild(submitButton);
}


function checkDuplicates() {
    let newTitle = document.getElementById('newTitle').value;
    let isDuplicate = false;
    myLibrary.forEach(function(element) {
        console.log(newTitle);
        console.log(element.title);
        if (newTitle.toLowerCase() === element.title.toLowerCase()) {
            isDuplicate = true;
        }
    });
    if (isDuplicate) {
        return true;
    } else {
        return false;
    }
}


function addNewBook() {
    let newTitle = document.getElementById('newTitle').value;
    let newAuthor = document.getElementById('newAuthor').value;
    let newNumPages = document.getElementById('newNumPages').value;
    let newHaveRead = false;
    if (document.getElementById('newHaveRead').checked) {
        newHaveRead = true;
    } else {
        newHaveRead = false;
    }
    const newBook = new Book(newTitle, newAuthor, newNumPages, newHaveRead);
    myLibrary.push(newBook);
    saveLibrary();
    console.table(myLibrary); // Remove later
}


function loadLibrary() {
    myLibrary = JSON.parse(localStorage.getItem("mySavedLibrary"));
}

function saveLibrary() {
    localStorage.setItem("mySavedLibrary", JSON.stringify(myLibrary));
}

// Example
addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 295, true);
displayLibrary();