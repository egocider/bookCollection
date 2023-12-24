document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event){
        event.preventDefault();
        addBook();
    });

    if (storageExist()) {
        loadDataStorage();
    }
});

function addBook() {
    const textBook = document.getElementById('title').value;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, textBook, false);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
}

function generateBookObject (id, judul, isCompleted) {
    return {
        id,
        judul,
        isCompleted
    }
}

const books = [];
const RENDER_EVENT = 'render-books';

document.addEventListener(RENDER_EVENT, function () {
    const xBookList = document.getElementById('books');
    xBookList.innerHTML = '';

    const completedBook = document.getElementById('completed-books');
    completedBook.innerHTML = '';

    for (const booksItem of books) {
        const booksElement = makeBooks(booksItem);
        if (!booksItem.isCompleted) 
        xBookList.append(booksElement);
        else 
        completedBook.append(booksElement);
        
        
    }
});

function makeBooks(booksObject) {
    const textTitle = document.createElement('h2');
    textTitle.innerHTML = booksObject.judul;


    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `book-${booksObject.id}`);

    if (booksObject.isCompleted) {
        
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');
        

        undoButton.addEventListener('click',function (){
            undoTaskCompleted(booksObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function () {
            removeTaskCompleted(booksObject.id);
        });

        container.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');
        
        checkButton.addEventListener('click', function () {
            addTaskCompleted(booksObject.id);
        });
        
        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function () {
            removeTaskCompleted(booksObject.id);
        });

        container.append(checkButton, trashButton);

    }

    return container;
}

function addTaskCompleted(bookId) {
    const bookTarget = findBooks(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBooks(bookId) {
    for (const  bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function removeTaskCompleted (bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1 ) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoTaskCompleted(bookId) {
    const bookTarget = findBooks(bookId);

    if (bookTarget === null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId){
            return index;
        }
    }

    return -1;
}

function saveData(){
    if(storageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent (new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKS_APPS';

function storageExist() {
    if (typeof (Storage) === undefined) {
        alert("Browser tidak mendukung njirs");
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
})

function loadDataStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}
