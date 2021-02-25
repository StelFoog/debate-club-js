const dc = require("./index");

const l = dc({
    test: {
        alias: "t"
    },
    sten: {
        alias: "s",
        boolean: false
    },
    all: {
        alias: "a"
    },
    blad: {
        alias: "b",
        boolean: false
    }
});
console.log(l);
console.log(dc.flags())
// console.log("Let's see", dc.get("Hej"));