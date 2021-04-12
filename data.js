
const fs = require('fs');
const csv = require('csv-parser');
const csvName = './src/assets/data.csv'

const learningItems = []
const tools = []


const data = []

function readCSV() {
    fs.createReadStream(csvName)
        .pipe(csv())
        .on('data', (row) => {
			// console.log(row)
			data.push(row)
        })
        .on('end', () => {
            
const json = JSON.stringify(data);
fs.writeFile('./src/assets/data.json', json, 'utf8', () => { console.log("done") });
        });
}

readCSV();


