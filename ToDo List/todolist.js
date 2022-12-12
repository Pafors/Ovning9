// This will handle storage of items
let storage;

// Name of database in storage
let databaseName = 'ToDo-list';

// Get reference on where to place the result
const display = document.querySelector('#displayItems');

// Get reference to the form
const form = document.querySelector('#inputForm');

// Get reference for the display of number of items tag
const numberOfItems = document.querySelector('#amount');

// Get reference for the display of storage type
const storageType = document.querySelector('#storagetype');

// Check if localStorage is available
if (storageAvailable('localStorage')) {
    // localStorage available, use it
    storage = longTermStorage(databaseName);
    storageType.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-database" viewBox="0 0 16 16" data-bs-toggle="tooltip" data-bs-placement="left" title="Persistent storage"><path d="M4.318 2.687C5.234 2.271 6.536 2 8 2s2.766.27 3.682.687C12.644 3.125 13 3.627 13 4c0 .374-.356.875-1.318 1.313C10.766 5.729 9.464 6 8 6s-2.766-.27-3.682-.687C3.356 4.875 3 4.373 3 4c0-.374.356-.875 1.318-1.313ZM13 5.698V7c0 .374-.356.875-1.318 1.313C10.766 8.729 9.464 9 8 9s-2.766-.27-3.682-.687C3.356 7.875 3 7.373 3 7V5.698c.271.202.58.378.904.525C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777A4.92 4.92 0 0 0 13 5.698ZM14 4c0-1.007-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1s-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4v9c0 1.007.875 1.755 1.904 2.223C4.978 15.71 6.427 16 8 16s3.022-.289 4.096-.777C13.125 14.755 14 14.007 14 13V4Zm-1 4.698V10c0 .374-.356.875-1.318 1.313C10.766 11.729 9.464 12 8 12s-2.766-.27-3.682-.687C3.356 10.875 3 10.373 3 10V8.698c.271.202.58.378.904.525C4.978 9.71 6.427 10 8 10s3.022-.289 4.096-.777A4.92 4.92 0 0 0 13 8.698Zm0 3V13c0 .374-.356.875-1.318 1.313C10.766 14.729 9.464 15 8 15s-2.766-.27-3.682-.687C3.356 13.875 3 13.373 3 13v-1.302c.271.202.58.378.904.525C4.978 12.71 6.427 13 8 13s3.022-.289 4.096-.777c.324-.147.633-.323.904-.525Z"/></svg>';
}
else {
    // localStorage isn't available, use temporary storage
    storage = shortTermStorage();
    storageType.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-circle" viewBox="0 0 16 16" data-bs-toggle="tooltip" data-bs-placement="left" title="Temporary storage"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/></svg>';
}

// Initialize tooltips (JavaScript code from Bootstrap)
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})

// Add event listener for the nodes in the form
form.addEventListener('submit', (e) => addNewItem(e));

// Add event listener for the nodes in the items list
display.addEventListener('click', (e) => handleItem(e));

// Show the items from start
displayItems(storage.getItems());

// Event handler for the input form
function addNewItem(e) {
    // Stop event bubbling up, mostly for "submit" button
    e.preventDefault();

    // Get the new item from the form, remove empty spaces
    const newItem = form['newItem'].value.trim();
    // Filter out any HTML-tags
    const strippedItem = newItem.replace(/<[^>]+>/g, '');

    switch (e.target.id) {
        // Submit button is pressed
        case 'inputForm':
            // Skip empty entries
            if (strippedItem === '') { e.target.reset(); return; }
            storage.addItem(
                {
                    itemName: strippedItem,
                    purchased: false
                }
            );
            // Clear the input form
            e.target.reset();
            break;
        default:
            // Inform that something that is unhandled was received
            console.log(`*** UNHANDLED TARGET: ${e.target}`);
            break;
    }
    // After any change, display the todo-list
    displayItems(storage.getItems());
}

// Event handler for the items list
function handleItem(e) {
    // Stop event bubbling up, mostly for "submit" button
    e.preventDefault();

    switch (e.target.tagName) {
        case 'BUTTON':
            // Check that it's the "remove" button that was pressed
            if (e.target.dataset.action === 'remove') {
                // Find the datafield with the ID of the item
                const itemID = e.target.parentNode.parentNode.parentNode.dataset.itemid;
                // Remove the item from storage
                storage.removeItem(itemID);
                // After any change, display the todo-list
                displayItems(storage.getItems());
            }
        case 'P':
            // Check that it was the text of the item that was clicked
            if (e.target.dataset.action === 'greytag') {
                // Find the datafield with the ID of the item
                const clickedCardBody = e.target.parentNode.parentNode.parentNode;
                //const itemID = e.target.parentNode.parentNode.parentNode.dataset.itemid;
                const itemID = clickedCardBody.dataset.itemid;
                // Toggle the visual appearence of the item card, and the data of purchased or not
                // (this could be done a little shorter with a class "toggle",
                //  and a simple boolean "item=!item", but that can get out of sync)
                let item = storage.getItem(itemID);
                if (item.purchased) {
                    clickedCardBody.parentNode.classList.remove('bg-secondary');
                    e.target.classList.remove('strikeThrough');
                    item.purchased = false;
                } else {
                    clickedCardBody.parentNode.classList.add('bg-secondary');
                    e.target.classList.add('strikeThrough');
                    item.purchased = true;
                }
                // Update the item in storage
                storage.setItem(itemID, item);
            }
        default:
            break;
    }


}

// Simple error informer
function displayError(errorText) {
    // Clear previous result
    display.innerHTML = '';
    emptyResultInfo = document.createElement('div');
    emptyResultInfo.classList.add('text-danger');
    emptyResultInfo.innerHTML = errorText;
    display.appendChild(emptyResultInfo);
}

// Display the received array in the display area
function displayItems(items) {
    // Clear previous result
    display.innerHTML = '';

    // If empty, inform user
    if (items.size == 0) {
        displayError('(tomt)');
        // Clear the number of items display
        numberOfItems.innerHTML = '';
        return;
    }

    // Update the number of items in the list
    numberOfItems.innerHTML = `(${items.size.toString()} st)`;

    // Make a holder DIV to prevent redrawing of DOM for each new node added
    let resultHolder = document.createElement('div');
    // Make a row
    let resultRow = document.createElement('div');
    resultRow.classList.add('row');
    // Iterate through all items and add them
    items.forEach((item, key, map) => {
        // Add item card to row
        resultRow.appendChild(createCard(key, item));
    });
    // Add row to holder
    resultHolder.appendChild(resultRow);
    // And add it to the node
    display.appendChild(resultHolder);
}

// Item bootstrap card factory function
function createCard(key, item) {
    // Make a column 
    let resultCol = document.createElement('div');
    resultCol.classList.add('col-sm-4');
    resultCol.classList.add('col-lg-3');
    resultCol.classList.add('p-2');

    // Make a bootstrap card
    let itemCard = document.createElement('div');
    itemCard.classList.add('card');
    const strikeThrough = item.purchased ? 'strikeThrough' : '';
    if (item.purchased) { itemCard.classList.add('bg-secondary') };
    itemCard.innerHTML =
    `
        <div class="card-body" data-itemid="${key}">
            <div class="row">
                <div class="col">
                    <p class="card-text ${strikeThrough}" data-action="greytag">${item.itemName}</p>
                </div>
                <div class="col-auto">
                    <button type="submit" data-action="remove" class="btn btn-warning btn-sm">TABORT</button>
                </div>
            </div>
        </div>
    `
    // Add card to column
    resultCol.appendChild(itemCard);
    console.log(resultCol);
    return resultCol;
}

// Long term storage using localStorage, a persistant storage
function longTermStorage(databaseName) {
    // The "storageSpace" is stored in the local storage under the key of "databaseName" (set above).
    let storageSpace;

    // Get data from localstorage, since it's stored as JSON, parse it
    dataArray = JSON.parse(localStorage.getItem(databaseName));

    // If nothing is stored, initialize new Map
    if (dataArray == null) {
        storageSpace = new Map();
    } else {
        storageSpace = new Map(dataArray);
    }
    // Return a closure with the methods needed, and a place to store the data until stored in the local storage
    return {
        // Returns all items, as a Map
        getItems() { return storageSpace; },
        // Add one new item to the database, and save all in local storage
        addItem(value) {
            // Store in the Map and in local storage
            storageSpace.set(this.getNextID(), value);
            return this.save();
        },
        // Update item, and save all in local storage
        setItem(key, value) {
            storageSpace.set(key, value);
            return this.save();
        },
        // Return an item
        getItem(key) {
            return storageSpace.get(key)
        },
        // Remove an item
        removeItem(key) {
            // Remove from Map and save in local storage, and save all in local storage
            storageSpace.delete(key)
            return this.save();
        },
        // Clear the complete set of items, and save all in local storage
        clearDb() {
            // Init new local storage
            storageSpace = new Map();
            return this.save();
        },
        // Saves the "storageSpace" Map in local storage
        save() {
            // Handles the conversion from Map to Array to JSON, since Map:s can't be JSON:ified
            localStorage.setItem(databaseName, JSON.stringify(Array.from(storageSpace)));
        },
        // Finds the next ID to use for an item
        getNextID() {
            let keys = [];
            for (const key of storageSpace.keys()) {
                keys.push(Number(key));
            }
            // Return max stringified number found in stored key array, or 1 (0+1) if "keys" are empty
            return (Math.max(...keys, 0) + 1).toString();
        }
    }
}

// Simple short tem storage solution if localStorage isn't available
function shortTermStorage() {
    let storageSpace = new Map();
    let nextID = 0;
    return {
        // Returns all items, as a Map
        getItems() { return storageSpace; },
        // Add one new item to the database
        addItem(value) {
            return storageSpace.set((nextID++).toString(), value);
        },
        // Update item
        setItem(key, value) {
            storageSpace.set(key, value);
        },
        // Return an item
        getItem(key) {
            return storageSpace.get(key);
        },
        // Remove an item
        removeItem(key) {
            console.log(storageSpace);
            //return storageSpace.delete(key);
            storageSpace.delete(key);
            console.log(storageSpace); return;
        },
        // Clear the complete set of items,
        clearDb() {
            return storageSpace.clear();
        }
    }
}

// *****************************************
// *** Below code is copied from Mozilla ***

// This code snippet is from Mozilla as a way to check if browser can store data locally
function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}
