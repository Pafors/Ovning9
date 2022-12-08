// Get reference on where to place the result
const display = document.querySelector('#displayResult');

// Generate the bish-bosh result
const result = bishBosh(3, 4, 100);

// Display the bish-bosh result
result.forEach(r => display.innerHTML += `${r}\n`);

// Bish-bosh function
function bishBosh(first, second, nn)
{
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
