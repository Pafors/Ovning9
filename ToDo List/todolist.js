// This will handle storage of items
let storage;

// Name of database in storage
let databaseName = "ToDo-list";

// Check if localStorage is available
if (storageAvailable('localStorage')) {
    // localStorage available, use it
    storage = longTermStorage(databaseName);
    // longTermStorage = localStorage;
}
else {
    // localStorage isn't available, use simple storage
    storage = shortTermStorage();
}

// Get reference on where to place the result
const display = document.querySelector('#displayItems');

// Get reference to the form
const form = document.querySelector('#inputForm');

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
        case "inputForm":
            // Skip empty entries
            if (strippedItem === "") { e.target.reset(); return; }
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
        case "BUTTON":
            // Check that it's the "remove" button that was pressed
            if (e.target.dataset.action === "remove") {
                // Find the datafield with the ID of the item
                const itemID = e.target.parentNode.parentNode.parentNode.dataset.itemid;
                // Remove the item from storage
                storage.removeItem(itemID);
                // After any change, display the todo-list
                displayItems(storage.getItems());
            }
        case "P":
            // Check that it was the text of the item that was clicked
            if (e.target.dataset.action === "greytag") {
                // Find the datafield with the ID of the item
                const clickedCard = e.target.parentNode.parentNode.parentNode;
                //const itemID = e.target.parentNode.parentNode.parentNode.dataset.itemid;
                const itemID = clickedCard.dataset.itemid;
                // Toggle the visual appearence of the item, and the data of purchased or not
                // (this could be done a little shorter with a class "toggle",
                //  and a simple boolean "item=!item", but that can get out of sync)
                let item = storage.getItem(itemID);
                if (item.purchased) {
                    clickedCard.classList.remove('bg-secondary');
                    e.target.classList.remove("strikeThrough");
                    item.purchased = false;
                } else {
                    clickedCard.classList.add('bg-secondary');
                    e.target.classList.add("strikeThrough");
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
    emptyResultInfo = document.createElement("div");
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
        displayError("(tomt)");
        return;
    }

    // Make a holder DIV to prevent redrawing of DOM for each new node added
    let resultHolder = document.createElement('div');
    // Make a row
    let resultRow = document.createElement('div');
    resultRow.classList.add('row');
    // Iterate through all items and add them
    items.forEach((item, key, map) => {
        // Make a column 
        let resultCol = document.createElement('div');
        resultCol.classList.add('col-sm-4');
        resultCol.classList.add('col-lg-3');
        resultCol.classList.add('p-2');

        // Make a bootstrap card
        let itemCard = document.createElement('div');
        itemCard.classList.add('card');
        const strikeThrough = item.purchased ? "strikeThrough" : "";
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

        // Add column to row
        resultRow.appendChild(resultCol);

    });
    // Add row to holder
    resultHolder.appendChild(resultRow);
    // And add it to the node
    display.appendChild(resultHolder);
}

// Long term storage using localStorage, a persistant storage
function longTermStorage(databaseName) {
    // The "storageSpace" is stored in the local storage under the key of "databaseName" (set above).
    let storageSpace;

    // Get data from localstorage, since it's stored as JSON, parse it
    dataArray = JSON.parse(localStorage.getItem(databaseName));

    // If nothing is stored, initialize new Map
    if (dataArray == null) {
        console.log("NULL MAKE NEW MAP");
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

// **********************************
// *** Below code is from Mozilla ***

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
