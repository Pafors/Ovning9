// Get reference on where to place the result
const display = document.querySelector('#displayResult');

// Get reference to the form
const form = document.querySelector('#inputForm');

// Get reference to the submit button
const submitButton = document.querySelector('#useValues');

// Add event listener for the nodes in the form
form.addEventListener('change', (e) => respondToChange(e));
form.addEventListener('submit', (e) => respondToChange(e));
//form.addEventListener('input', (e) => respondToChange(e));

function respondToChange(e) {
    e.preventDefault();
    console.log(e.target.id + " " + e.target.value);
    console.log(`${form['firstValue'].value} ${form['secondValue'].value} ${form['amountValue'].value}`)
    switch (e.target.id) {
        case "inputForm":
            console.log("SUBMIT");
            //
            const firstValue = Number(form['firstValue'].value);
            const secondValue = Number(form['secondValue'].value);
            const amountValue = Number(form['amountValue'].value);
            if(isIntegers(firstValue, secondValue, amountValue)) {
                console.log("ALL INTEGERS");
                displayResult(bishBosh(firstValue, secondValue, amountValue));
            } else {
                console.log("Nope");
            }
            break;
    
        default:
            break;
    }
}

// Validation that all the arguments are integers
function isIntegers(...argsToCheck) {
    for (const arg of argsToCheck) {
        if(!Number.isInteger(arg))
        { return false; }
    }
    return true;
}

// Display the received array in the display area
function displayResult(resultArray) {
    // Clear previous result
    display.innerHTML = '';

    // Make a holder DIV to prevent redrawing of DOM for each new node added
    let resultHolder = document.createElement('div');
    resultArray.forEach(r => {
        let resultRow = document.createElement('div');
        resultRow.classList.add('row');
        let resultCol = document.createElement('div');
        resultCol.classList.add('col');
        resultCol.classList.add('result');
        resultCol.innerHTML=r;
        resultRow.appendChild(resultCol);
        resultHolder.appendChild(resultRow);
    });

    // And add it to the node
    display.appendChild(resultHolder);
}

// Bish-bosh function
function bishBosh(first, second, nn)
{
    // Holder of the result
    let resultArray = [];
    
    // Check that it's a number
    if(!Number.isInteger(first) || !Number.isInteger(second) || !Number.isInteger(nn)) {
        return resultArray;
    }

    // Iterate and push each result into an result array
    for (let i = 1; i <= nn; i++)
    {
        if (i % first == 0 && i % second == 0)
        {
            resultArray.push("Bish-Bosh");
        }
        else if (i % first == 0)
        {
            resultArray.push("Bish");
        }
        else if (i % second == 0)
        {
            resultArray.push("Bosh");
        }
        else
        {
            resultArray.push(i);
        }
    }

    return resultArray;
}
