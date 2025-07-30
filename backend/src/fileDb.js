// backend/src/fileDb.js

const fs   = require('fs').promises;
const path = require('path');

// Given a “table” name (e.g. 'products'), return the path to data/products.json
function jsonPath(name) {
  return path.join(__dirname, '..', 'data', `${name}.json`);
}

// Read and parse the JSON file for that “table”
async function read(name) {
  const file = jsonPath(name);
  const txt  = await fs.readFile(file, 'utf8');
  return JSON.parse(txt);
}

// Serialize and overwrite the JSON file for that “table”
async function write(name, data) {
  const file = jsonPath(name);
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = { read, write };

