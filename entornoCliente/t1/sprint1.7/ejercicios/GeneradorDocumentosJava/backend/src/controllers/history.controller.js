const path = require('path');
const fs = require('fs');
const dataFile = path.join(__dirname, '..', 'data', 'history.json');

function list(req, res) {
  try {
    const raw = fs.readFileSync(dataFile, 'utf8');
    const items = JSON.parse(raw || '[]');
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not read history' });
  }
}

module.exports = { list };
