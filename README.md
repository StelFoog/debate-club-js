# Debate Club JS

Created to be a simple, light-weight argument handler.

## How to use

To start we send in what flags we wish to accept in an object where every acceptable flag is listed as an object. These objects can accept an alias letter and and if the flag is boolean (defaults to `true`).

The aliases define what "miniflags" which are accepted.

test.js
```js
const dc = require("debate-club");

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
		boolean: false,
	}
});
```
In this case we accept the flags `--list`, `-l`, `--all`, `-a`, `--in`, `--land`, `--stone` and `-s`. The flags `-las` can also be taken which would mark both `list` and `all` as true.

Any combination of miniflags can be given together in any order, so in addition to the above flags we also accept `-la`, `-ls`, `-as`, `-al`, `-sl`, `-sa`, `-las`, `-lsa`, `-als`, `-asl`, `-sla` and `-sal`.

When taking non-boolean flags they will save the next non-flag as their value or written with an `=`-sign after the flag, i.e. `--in=hello`. This also works with miniflags (`-s=rock`). In the case of miniflag combinations all flags will be given the same value and boolean flags will be marked.

Any undefined (long form) flags will be saved and assumed to be boolean, unless they are written with an `=`-sign after the flag, i.e. `--nop=pop`.

Methods:

| Method               | Description                                                            | Return value                                                                                                                                                                                                                                                                                        |
| -------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dc(`*object*`)`     | Initialises the program taking a definition of what flags are expected | Returns an object where the key `success` is a boolean that returns `false` if any undefined input is recived and `true` otherwise. The `error` key is an array that contains all unexpected arguments. And key `args` returns an in-order array of all args that are not flags or values of flags. |
| `dc(`*string*`)`     | Same as `dc.get(`*string*`)`                                           | Returns value of the flag *string* or `true` if it has been set or `null` if not                                                                                                                                                                                                                    |
| `dc.get(`*string*`)` | Method to get value of flag *string*                                   | Returns value of the flag *string* or `true` if it has been set or `null` if not                                                                                                                                                                                                                    |
| `dc.args()`          | Gives all arguments that aren't flags or values thereof                | Returns an in-order array of all args that are not flags or values of flags                                                                                                                                                                                                                         |
| `dc.args('full')`    | Gives all arguments                                                    | Returns an in-order list of all arguments given                                                                                                                                                                                                                                                     |
| `dc.flags()`         | Gives the entire internal object made to track flags                   | Returns an object where the keys are the flags found in the arguments along with their values                                                                                                                                                                                                       |
|                      |

**Note:** The `success` key is depricated and will be phased out, to check for issues with given arguments use the `error` key instead.

Instead of: 
```js
if(!res.success) console.log("Invalid argument");
```

Use:
```js
if(res.error[0]) console.log("Invalid argument");
```

## Examples:

test.js (continuation)
```js
console.log(res);
console.log(dc('list'));
console.log(dc('all'));
console.log(dc('in'));
console.log(dc('land'));
console.log(dc('stone'));
console.log(dc('nop'));
```

CLI:
```bash
 $ node test -ls=hello mask
 > { success: true, error: [], args: [node, test, mask]}
 > true
 > null
 > null
 > null
 > hello
 > null
```

```bash
 $ node test --in --stone common -la
 > { success: true, error: [], args: [node, test]}
 > true
 > true
 > common
 > null
 > common
 > null
```

```bash
 $ node test end --land open
 > { success: true, error: [], args: [node, test, end, open]}
 > null
 > null
 > null
 > true
 > null
 > null
```

```bash
 $ node test -s --land ball --in round stealth -la close
 > { success: true, error: [], args: [node, test, stealth, close]}
 > true
 > true
 > round
 > true
 > ball
 > null
```

```bash
 $ node test --nop pop
 > { success: false, error: [ 'Longflag "nop" undefined' ], args: [node, test, pop]}
 > null
 > null
 > null
 > null
 > null
 > true
```

```bash
 $ node test -ys rock
 > { success: false, error: [ 'Miniflag "y" undefined' ], args: [node, test]}
 > null
 > null
 > null
 > null
 > rock
 > null
```

```bash
 $ node test --nop=pop -i mode
 > { success: false, error: [ 'Longflag "nop" undefined', 'Miniflag "i" undefined' ], args: [node, test, mode]}
 > null
 > null
 > null
 > null
 > null
 > pop
```
