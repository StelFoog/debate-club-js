const dc = require('../debateClub');

const res = dc({ list: { alias: 'l' } });

console.log(res);
console.log(process.execPath);
console.log(require.main.filename);
