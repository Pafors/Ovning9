// Placeholders for storage
let longTermStorage;

// Name of database in storage
let databaseName = "ToDo-list";

// XXX TEST SIMPLE STORAGE
// Simple storage solution for temp storage if localStorage isn't available
const simpleStorage = function () {
    let storageSpace = new Map();
    let nextID = 0;
    return {
        addItem(value) {
            return storageSpace.set(nextID++, value);
        },
        setItem(key, value) {
            storageSpace.set(this.getNextID(), value);
        },
        getItem(key) {
            return storageSpace.get(key);
        },
        removeItem(key) {
            return storageSpace.delete(key);
        },
        clearDb() {
            return storageSpace.clear();
        }
    }
}

const complexStorage = function (databaseName) {
    let storageSpace;

    // XXX
    dataArray = JSON.parse(localStorage.getItem(databaseName));


    if (dataArray == null) {
        console.log("NULL MAKE NEW MAP");
        storageSpace = new Map();
    } else {
        // storageSpace = new Map(dataArray.map(a => [a.key, a.value]));
        storageSpace = new Map(dataArray);
    }
    return {
        getItems() { return storageSpace; },
        addItem(value) {
            // Store in the Map and in local storage
            storageSpace.set(this.getNextID(), value);
            return this.save();
        },
        setItem(key, value) {
            storageSpace.set(this.getNextID(), value);
            return this.save();
        },
        getItem(key) {
            // Get value from Map 
            return storageSpace.get(key)
        },
        removeItem(key) {
            // Remove from Map and save in local storage
            storageSpace.delete(key)
            return this.save();
        },
        clearDb() {
            // Init new local storage
            storageSpace = new Map();
            return this.save();
        },
        save() {
            // Handles the conversion from Map to Array to JSON, since Map:s can't be JSON:ified
            localStorage.setItem(databaseName, JSON.stringify(Array.from(storageSpace)));
        },
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

// Check if localStorage is available
if (storageAvailable('localStorage')) {
    // localStorage available, use it
    longTermStorage = complexStorage(databaseName);
    // longTermStorage = localStorage;
}
else {
    // localStorage isn't available, use simple storage
    longTermStorage = simpleStorage();
}


// XXX TEMP XXX
longTermStorage.addItem({ itemName: "newItem1", purchased: false });
longTermStorage.addItem({ itemName: "newItem2", purchased: false });
longTermStorage.addItem({ itemName: "newItem3", purchased: false });
console.debug("localStorage loaded with temps");




// Get reference on where to place the result
const display = document.querySelector('#displayItems');

// Get reference to the form
const form = document.querySelector('#inputForm');

// Add event listener for the nodes in the form
form.addEventListener('submit', (e) => addNewItem(e));

// Add event listener for the nodes in the items list
display.addEventListener('click', (e) => handleItem(e));

// Show the items from start
displayItems(longTermStorage.getItems());



function addNewItem(e) {
    // Stop event bubbling up, mostly for "submit" button
    e.preventDefault();

    // Get the new item from the form
    const newItem = form['newItem'].value;
    console.log(newItem);

    switch (e.target.id) {
        // Submit button is pressed
        case "inputForm":
            longTermStorage.addItem(
                {
                    itemName: newItem,
                    purchased: false
                }
            );
            break;
         default:
            console.log("---");
            console.log(e.target);
            console.log(e.target.id);
            console.log("---");
            break;
    }
    // After any change, display the todo-list
    displayItems(longTermStorage.getItems());
}

function handleItem(e) {
    // Stop event bubbling up, mostly for "submit" button
    e.preventDefault();

    switch (e.target.tagName) {

        case "BUTTON":
            if(e.target.dataset.action === "remove") {
                // XXX REMOVE
                console.log("WOOOO");
                // After any change, display the todo-list
                // XXX Needed? Remove from DOM directly?
                displayItems(longTermStorage.getItems());
            }

        case "P":
            if(e.target.dataset.action === "greytag") {
                // TOGGLE CLASS
                // XXX KEEP IN DATABASE AND SHOW BELOW
                const itemID = e.target.parentNode.parentNode.parentNode.dataset.itemid;
                let item = longTermStorage.getItem(itemID);
                console.log(itemID);
                console.log(item);
                if(item.purchased) {
                    e.target.classList.remove("strikeThrough");
                    item.purchased = false;
                } else {
                    e.target.classList.add("strikeThrough");
                    item.purchased = true;
                }
                
                longTermStorage.setItem(itemID, item);
                console.log("WIIIIIIIIIIIIIIII");
            }
        default:
            break;
    }
    
    
}


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
    console.log(items);

    // Clear previous result
    display.innerHTML = '';

    // If empty, inform user
    if (items.size == 0) {
        displayError("inget resultat, kontrollera talen");
        return;
    }

    // 3. När varan har lagts till ska man ha möjlighet att markera varan som inköpt genom
    // att klicka på varan.
    // Texten blir då överstruken samt elementet ändrar bakgrundsfärg.
    // 4. Det ska gå att ångra att varan blev tillagd.
    // Texten återgår då från överstruken till normal samt elementet återfår sin
    // ursprungliga färg.
    // 5. Det ska även finnas en möjlighet att ta bort varan helt från listan.

    // Make a holder DIV to prevent redrawing of DOM for each new node added
    let resultHolder = document.createElement('div');
    // Make a row
    let resultRow = document.createElement('div');
    resultRow.classList.add('row');
    // Iterate through all items and add them
    items.forEach((item, key, map) => {
        // Make a column 
        let resultCol = document.createElement('div');
        resultCol.classList.add('col-4');
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
