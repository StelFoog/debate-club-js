let flags = {}
let args = [];


// define is an object where each key represents an accepted flag
// 
function dc(define) {
  const work = process.argv;
  if (!define || typeof define !== "object") return work;
	const keys = Object.keys(define);

  let flagNeedsVal = [];
  work.forEach(e => {
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
				for (let i = 0; i < keys.length; i++) {
					if (define[keys[i]].alias === miniflag.charAt(0)) {
						if (define[keys[i]].boolean === false) {
							if (miniflag.charAt(1) === "=") flags[keys[i]] = miniflag.substr(2);
							else flagNeedsVal = [keys[i]];
						} else flags[keys[i]] = true;
						break;
					}
				}
			} else {
				// Handle multiple miniflags
				// Go though all miniflags
				for(let i = 0; i < miniflag.length; i++) {
					if(miniflag.charAt(i) === "=" && flagNeedsVal.length) {
						const val = miniflag.substr(i + 1);
						flagNeedsVal.forEach(f => {
							flags[f] = val;
						});
						break;
					}
					for(let j = 0; j < keys.length; j++) {
						if (define[keys[j]].alias == miniflag.charAt(i)) {
							if (define[keys[j]].boolean === false) flagNeedsVal.push(keys[j]);
							else flags[keys[j]] = true;
							break;
						}
					}
				}
			}
    } else {
				// Handle normal flag
				const longflag = e.substr(2).split("=");
				console.log(longflag);
				if(define[longflag[0]].boolean === false) {
					if(longflag[1]) flags[longflag[0]] = longflag[1];
					else flagNeedsVal = [longflag[0]];
				} else {
					flags[longflag[0]] = true;
				}
    }
  });
	return args;
}

dc.get = function (flag) {
	if(!flag) return null;
  if(flags[flag]) return flags[flag];
  else return null;
}

dc.flags = function () {
	return flags;
}

dc.args = function () {
	return args;
}

module.exports = dc;