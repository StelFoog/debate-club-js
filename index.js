let flags = {}
let args = [];
let fullArgs = [];


// define is an object where each key represents an accepted flag
// 
function dc(define) {
	let success = true;
  const fullArgs = process.argv;
	if(typeof define === string) return get(define);
  if (!define || typeof define !== "object") return fullArgs;
	const keys = Object.keys(define);

	let i, j;
  let flagNeedsVal = [];
  fullArgs.forEach(e => {
    if (e.charAt(0) !== "-") {
      if (flagNeedsVal.length) {
				flagNeedsVal.forEach(f => {
					flags[f] = e;
				});
				flagNeedsVal = [];
			} else args.push(e);
    } else if(e.charAt(1) !== "-") {
			// Handle miniflag(s)
      const miniflag = e.substr(1);
			if (miniflag.length === 1 || miniflag.charAt(1) === "=") {
				// Handle single miniflag
				for (i = 0; i < keys.length; i++) {
					if (define[keys[i]].alias === miniflag.charAt(0)) {
						if (define[keys[i]].boolean === false) {
							if (miniflag.charAt(1) === "=") flags[keys[i]] = miniflag.substr(2);
							else flagNeedsVal = [keys[i]];
						} else flags[keys[i]] = true;
						break;
					}
				}
				if(i >= keys.length) success = false;
			} else {
				// Handle multiple miniflags
				// Go though all miniflags
				for(i = 0; i < miniflag.length; i++) {
					if(miniflag.charAt(i) === "=" && flagNeedsVal.length) {
						const val = miniflag.substr(i + 1);
						flagNeedsVal.forEach(f => {
							flags[f] = val;
						});
						break;
					}
					for(j = 0; j < keys.length; j++) {
						if (define[keys[j]].alias == miniflag.charAt(i)) {
							if (define[keys[j]].boolean === false) flagNeedsVal.push(keys[j]);
							else flags[keys[j]] = true;
							break;
						}
					}
					if(j >= keys.length) success = false;
				}
			}
    } else {
				// Handle normal flag
				const longflag = e.substr(2).split("=");
				console.log(longflag);
				if (!define[longflag[0]]) {
					success = false;
					flags[longflag[0]] = true;
				} else if (define[longflag[0]].boolean === false) {
					if(longflag[1]) flags[longflag[0]] = longflag[1];
					else flagNeedsVal = [longflag[0]];
				} else {
					flags[longflag[0]] = true;
				}
    }
  });
	return {success, args};
}

function get (flag) {
	if(!flag) return null;
  if(flags[flag]) return flags[flag];
  else return null;
}

dc.get = get;

dc.flags = function () {
	return flags;
}

dc.args = function (str) {
	if(str === "full") return fullArgs;
	else return args;
}

module.exports = dc;