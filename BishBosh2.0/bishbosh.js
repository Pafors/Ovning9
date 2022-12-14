// Get reference on where to place the result
const display = document.querySelector('#displayResult');

// Get reference to the form
const form = document.querySelector('#inputForm');

// Get reference to the submit button
const submitButton = document.querySelector('#useValues');

// Add event listener for the nodes in the form
form.addEventListener('submit', (e) => respondToChange(e));

// If you want to have it update without pressing the "Submit"
//form.addEventListener('input', (e) => respondToChange(e));

function respondToChange(e) {
    // Stop event bubbling up, mostly for "submit" button
    e.preventDefault();
    // Make it a number from a string
    const firstValue = Number(form['firstValue'].value);
    const secondValue = Number(form['secondValue'].value);
    const amountValue = Number(form['amountValue'].value);

    switch (e.target.id) {
        case "inputForm":
            // Submit button is pressed
            if (isPositiveIntegers(firstValue, secondValue, amountValue)) {
                displayResult(bishBosh(firstValue, secondValue, amountValue));
            } else {
                displayError("Felaktiva invärden, kontrollera dem");
            };
            break;

        default:
            // If any other field in the forms are changed, update the result
            // if(isPositiveIntegers(firstValue, secondValue, amountValue)) {
            //     displayResult(bishBosh(firstValue, secondValue, amountValue));
            // };
            break;
    }
}

// Validation that all the arguments are integers
function isPositiveIntegers(...argsToCheck) {
    for (const arg of argsToCheck) {
        console.log(arg);
        if (!Number.isInteger(arg)) { return false; }
        if (arg < 0) { return false; }
    }
    return true;
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
function displayResult(resultArray) {
    // Clear previous result
    display.innerHTML = '';
    // If empty, inform user
    if (resultArray.length == 0) {
        displayError("inget resultat, kontrollera talen");
        return;
    }
    // Make a holder DIV to prevent redrawing of DOM for each new node added
    let resultHolder = document.createElement('div');
    resultArray.forEach(r => {
        // Make a row
        let resultRow = document.createElement('div');
        resultRow.classList.add('row');
        // Make a column 
        let resultCol = document.createElement('div');
        resultCol.classList.add('col');
        resultCol.classList.add('result');
        resultCol.innerHTML = r;
        // Add column to row
        resultRow.appendChild(resultCol);
        // Add row to holder
        resultHolder.appendChild(resultRow);
    });
    // And add it to the node
    display.appendChild(resultHolder);
}

// Bish-bosh function
function bishBosh(first, second, nn) {
    // Holder of the result
    let resultArray = [];

    // Check that it's a number
    if (!Number.isInteger(first) || !Number.isInteger(second) || !Number.isInteger(nn)) {
        return resultArray;
    }

    // Iterate and push each result into an result array
    for (let i = 1; i <= nn; i++) {
        if (i % first == 0 && i % second == 0) {
            resultArray.push("Bish-Bosh");
        }
        else if (i % first == 0) {
            resultArray.push("Bish");
        }
        else if (i % second == 0) {
            resultArray.push("Bosh");
        }
        else {
            resultArray.push(i);
        }
    }

    return resultArray;
}
