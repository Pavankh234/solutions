// // Import the 'fs' module to work with the file system
// const fs = require('fs');

// // Read the JSON file
// fs.readFile('sample.json', 'utf8', (err, data) => {
//     if (err) {
//         console.error('Error reading the file:', err);
//         return;
//     }

//     try {
//         // Parse the JSON data
//         const jsonData = JSON.parse(data);

//         // Access 'n' and 'k'
//         const n = jsonData.keys.n;
//         const k = jsonData.keys.k;

//         // Output 'n' and 'k'
//         console.log(`n: ${n}`);
//         console.log(`k: ${k}`);

//         // Loop through the keys of the JSON object
//         for (const key in jsonData) {
//             // Skip the "keys" object itself
//             if (key !== "keys" && jsonData[key].base && jsonData[key].value) {
//                 const base = parseInt(jsonData[key].base); // Extract the base
//                 const value = jsonData[key].value;         // Extract the encoded value

//                 // Decode the value based on the base
//                 const decodedValue = parseInt(value, base);

//                 // Output the decoded pair (x, y)
//                 console.log(`x: ${key}, y: ${decodedValue} (decoded from base ${base})`);
//             }
//         }

//     } catch (err) {
//         console.error('Error parsing JSON:', err);
//     }
// });


// Import the 'fs' module to work with the file system
const fs = require('fs');

// Function to compute the Lagrange Interpolation at a specific x (x = 0 for the constant term)
function lagrangeInterpolation(points, x) {
    let result = 0;

    for (let i = 0; i < points.length; i++) {
        let xi = points[i].x;
        let yi = points[i].y;

        // Compute the Lagrange basis polynomial li(x)
        let li = 1;
        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                let xj = points[j].x;
                li *= (x - xj) / (xi - xj);
            }
        }

        // Add the term to the result
        result += yi * li;
    }

    return result;
}

// Function to decode y values based on their bases
function decodeYValues(jsonData) {
    let points = [];

    for (const key in jsonData) {
        if (key !== "keys" && jsonData[key].base && jsonData[key].value) {
            const base = parseInt(jsonData[key].base);
            const value = jsonData[key].value;
            const decodedValue = parseInt(value, base);  // Decode the value based on the base
            
            // Add the pair (x, y) to the points array
            points.push({ x: parseInt(key), y: decodedValue });
        }
    }

    return points;
}

// Read the JSON file
fs.readFile('sample.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    try {
        // Parse the JSON data
        const jsonData = JSON.parse(data);

        // Decode the Y values and extract key-value pairs (x, y)
        const points = decodeYValues(jsonData);

        // Find the constant term (P(0)) using Lagrange interpolation
        const constantTerm = lagrangeInterpolation(points, 0);

        // Output the constant term
        console.log(`The secret constant (C) is: ${constantTerm}`);

    } catch (err) {
        console.error('Error parsing JSON:', err);
    }
});
