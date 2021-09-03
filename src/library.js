import { getFirestore } from "firebase/firestore";
import { collection, addDoc, doc, deleteDoc, setDoc } from "firebase/firestore"; 

const library = function() {
    
    const db = getFirestore();
    
    async function addToFirestore(Book) {
        try {
            const docRef =  await addDoc(collection(db, "books"), {
            title: Book.title,
            author: Book.author,
            numPages: Book.numPages,
            haveRead: Book.haveRead
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }


    async function setLibrary(library) {
        // Firestore would not accept myLibrary as is (called it a custom object). 
        // Found solution here (transform array of Books into an array of pure JS objects. https://stackoverflow.com/questions/48156234/function-documentreference-set-called-with-invalid-data-unsupported-field-val)
        const firebaseLibrary = library.map((book) => {return Object.assign({}, book)});
        const docData = {
            array: firebaseLibrary
        }
        await setDoc(doc(db, "libraries", "myLibrary"), docData);
    }
    


    let myLibrary = [];

    // Assign the DOM elements
    const bookList = document.querySelector("#bookList");
    const newBookFormDiv = document.querySelector('#newBookFormDiv');

    const newBookButton = document.querySelector('#newBookButton');
    newBookButton.addEventListener('click', function() {
        generateNewBookForm();
    });

    const clearLibrary = document.querySelector('#clearLibrary');
    clearLibrary.addEventListener('click', function() {
        if (prompt("Are you sure? (type 'yes')") === 'yes') {
            localStorage.clear();
            myLibrary = [];
            displayLibrary();
        } else {
            return;
        }
    });


    // Create the form elements
    const newBookForm = document.createElement('form');

    const newTitleField = document.createElement('input');
    newTitleField.setAttribute('type','text');
    newTitleField.setAttribute('placeholder','Title');
    newTitleField.setAttribute('id', 'newTitle');
    newTitleField.setAttribute('required', 'true');

    const newAuthorField = document.createElement('input');
    newAuthorField.setAttribute('type','text');
    newAuthorField.setAttribute('placeholder','Author');
    newAuthorField.setAttribute('id', 'newAuthor');
    newAuthorField.setAttribute('required', 'true');


    const newNumPagesField = document.createElement('input');
    newNumPagesField.setAttribute('type','number');
    newNumPagesField.setAttribute('placeholder','# of pages');
    newNumPagesField.setAttribute('id', 'newNumPages');
    newNumPagesField.setAttribute('required', 'true');

    const newHaveReadLabel = document.createElement('label');
    newHaveReadLabel.textContent = "Have you read it?";
    const newHaveReadBox = document.createElement('input');
    newHaveReadBox.setAttribute('type','checkbox');
    newHaveReadBox.setAttribute('id', 'newHaveRead');

    // Submit button with form validation
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.addEventListener('click', function() {
        if (newTitleField.validity.valueMissing) {
            newTitleField.setCustomValidity('Please enter a title.');
        } else if (checkDuplicates()) {
            newTitleField.setCustomValidity('Already in your library!');
        } else {
            newTitleField.setCustomValidity('');
        }
        
        if (newAuthorField.validity.valueMissing) {
            newAuthorField.setCustomValidity('Please enter an author.');
        } else {
            newAuthorField.setCustomValidity('');
        }

        if (newNumPagesField.validity.valueMissing) {
            newNumPagesField.setCustomValidity('Please enter # of pages.');
        } else {
            newNumPagesField.setCustomValidity('');
        }

        if (!newTitleField.validity.valid || !newAuthorField.validity.valid || !newNumPagesField.validity.valid) {
            return;
        }

        addNewBook();
        displayLibrary();
        while (newBookFormDiv.firstChild) {
            newBookFormDiv.removeChild(newBookFormDiv.firstChild);
        }
    });


    // Original constructor for creating a new book
    // function Book(title, author, numPages, haveRead) {
    //     this.title = title;
    //     this.author = author;
    //     this.numPages = numPages;
    //     this.haveRead = haveRead;
    // }

    // Refactored to class syntax
    class Book {
        
        constructor(title, author, numPages, haveRead) {
            this.title = title;
            this.author = author;
            this.numPages = numPages;
            this.haveRead = haveRead;
        }   
    }


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
                // saveLibrary();
            });
                

            const delButton = document.createElement('button');
            delButton.setAttribute('class', 'delButton');
            buttonDiv.appendChild(delButton);
            delButton.textContent = 'x';
            delButton.onclick = function() {
                bookList.removeChild(bookCardDiv);
                myLibrary.splice(myLibrary.indexOf(element), 1);
                // saveLibrary();
                // console.table(myLibrary); // Remove later
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
        addToFirestore(newBook);
        console.log(myLibrary);
        // saveLibrary();
        setLibrary(myLibrary);
    }

    // Local storage functions to load and save the library when changes are made
    // function loadLibrary() {
    //     myLibrary = JSON.parse(localStorage.getItem("mySavedLibrary"));
    // }

    // function saveLibrary() {
    //     localStorage.setItem("mySavedLibrary", JSON.stringify(myLibrary));
    // }

    // Check if a saved library exists when loading the page.
    // document.addEventListener('DOMContentLoaded', function() {
    //     if (localStorage.getItem('mySavedLibrary')) {
    //         alert("Found saved library.");
    //         loadLibrary();
    //         displayLibrary();  
    //     } 
    // });
}

export { library }
