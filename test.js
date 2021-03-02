const dc = require("./debateClub");

const res = dc({
    list: {
        alias: 'l',
    },
    all: {
        alias: 'a',
        boolean: true,
    },
    in: {
        boolean: false,
    },
    land: {},
    stone: {
        alias: 's',
        boolean: false
    }
});

console.log(res);
console.log(dc('list'));
console.log(dc('all'));
console.log(dc('in'));
console.log(dc('land'));
console.log(dc('stone'));
console.log(dc('nop'));
