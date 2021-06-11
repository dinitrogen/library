let myLibrary = [];

// Assign the DOM elements
const bookList = document.querySelector("#bookList");
const newBookFormDiv = document.querySelector('#newBookFormDiv');
const newBookButton = document.querySelector('#newBookButton');
const clearLibrary = document.querySelector('#clearLibrary');

// Create the form elements
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


// Assign the button events
newBookButton.addEventListener('click', function() {
    generateNewBookForm();
});

clearLibrary.addEventListener('click', function() {
    if (prompt("Are you sure? (type 'yes')") === 'yes') {
        localStorage.clear();
        myLibrary = [];
        displayLibrary();
    } else {
        return;
    }
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

// Constructor for creating a new book
function Book(title, author, numPages, haveRead) {
    this.title = title;
    this.author = author;
    this.numPages = numPages;
    this.haveRead = haveRead;
}

// Adding localStorage broke these prototype methods
/*
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
*/

// Update the display every time a new book added/deleted/modified
function displayLibrary() {
    // Delete the current list of book cards
    while (bookList.firstChild) {
        bookList.removeChild(bookList.firstChild);
    }

    // Creat and display a card for each book in the library
    for (let element of myLibrary) {
        const bookCardDiv = document.createElement('div');
        bookCardDiv.setAttribute('class', 'bookCardDiv');
        bookCardDiv.setAttribute('id', `book${myLibrary.indexOf(element)}`)
        bookList.appendChild(bookCardDiv);

        const bookTitleDiv = document.createElement('div');
        bookTitleDiv.setAttribute('class', 'bookTitleDiv');
        bookCardDiv.appendChild(bookTitleDiv);
        bookTitleDiv.textContent = `${element.title}`;

        const bookAuthorDiv = document.createElement('div');
        bookAuthorDiv.setAttribute('class', 'bookAuthorDiv');
        bookCardDiv.appendChild(bookAuthorDiv);
        bookAuthorDiv.textContent = `${element.author}`;
        
        const bookPagesDiv = document.createElement('div');
        bookPagesDiv.setAttribute('class', 'bookPagesDiv');
        bookCardDiv.appendChild(bookPagesDiv);
        bookPagesDiv.textContent = `${element.numPages} pages`

        const buttonDiv = document.createElement('div');
        buttonDiv.setAttribute('class', 'buttonDiv');
        bookCardDiv.appendChild(buttonDiv);
        buttonDiv.textContent = 'Read it?';

        // Read slider
        const readSwitch = document.createElement('label');
        readSwitch.setAttribute('class','switch');
        const readCheckbox = document.createElement('input');
        readCheckbox.setAttribute('type','checkbox');
        const readSlider = document.createElement('span');
        readSlider.setAttribute('class','slider round');
        buttonDiv.appendChild(readSwitch);
        readSwitch.appendChild(readCheckbox);
        readSwitch.appendChild(readSlider);

        if (element.haveRead) {
            readCheckbox.checked = true;
        } else {
            readCheckbox.checked = false;
        }

        readCheckbox.addEventListener('change', function() {
            if (readCheckbox.checked) {
                element.haveRead = true;
            } else {
                element.haveRead = false;
            }
            saveLibrary();
        });
            
        

        /*
        const readButton = document.createElement('button');
        readButton.setAttribute('class', 'readButton');
        readButton.setAttribute('id', `readBook${myLibrary.indexOf(element)}`)
        buttonDiv.appendChild(readButton);
        readButton.textContent = 'Toggle read status';
        readButton.onclick = function() {
            if (element.haveRead) {
                element.haveRead = false;
            } else {
                element.haveRead = true;
            }
            bookInfoDiv.textContent = `${element.title}, ${element.haveRead}`;
            saveLibrary();
        }
        */

        const delButton = document.createElement('button');
        delButton.setAttribute('class', 'delButton');
        buttonDiv.appendChild(delButton);
        delButton.textContent = 'x';
        delButton.onclick = function() {
            bookList.removeChild(bookCardDiv);
            myLibrary.splice(myLibrary.indexOf(element), 1);
            saveLibrary();
            console.table(myLibrary); // Remove later
        }
    }
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
}

// Local storage functions to load and save the library when changes are made
function loadLibrary() {
    myLibrary = JSON.parse(localStorage.getItem("mySavedLibrary"));
}

function saveLibrary() {
    localStorage.setItem("mySavedLibrary", JSON.stringify(myLibrary));
}

// Check if a saved library exists when loading the page.
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('mySavedLibrary')) {
        alert("Found saved library.");
        loadLibrary();
        displayLibrary();  
    } 
});

