let flags = {};
let args = [];
let fullArgs = [];
let success = true;
let error = [];

// define is an object where each key represents an accepted flag
function dc(define) {
	if (typeof define === 'string') return get(define);
	// if (typeof define === 'string') {
	// 	if (args.length || get(define)) return get(define);
	// 	for (let i = 0; i < process.argv.length; i++) {
	// 		const e = process.argv[i];
	// 		if (e.charAt(0) === '-' && e.charAt(1) === '-') {
	// 			const f = e.substr(2).split('=');
	// 			if (f[0] === define) {
	// 				if (f[1]) flags[f[0]] = f[1];
	// 				else flags[f[0]] = true;
	// 				break;
	// 			}
	// 		}
	// 	}
	// 	return get(define);
	// }
	if (!define || typeof define !== 'object') return fullArgs;
	const fullArgs = process.argv;
	const keys = Object.keys(define);

	let i, j;
	let flagNeedsVal = [];
	fullArgs.forEach((e) => {
		if (e.charAt(0) !== '-') {
			if (flagNeedsVal.length) {
				flagNeedsVal.forEach((f) => {
					flags[f] = e;
				});
				flagNeedsVal = [];
			} else args.push(e);
		} else if (e.charAt(1) !== '-') {
			// Handle miniflag(s)
			const miniflag = e.substr(1);
			if (miniflag.length === 1 || miniflag.charAt(1) === '=') {
				// Handle single miniflag
				for (i = 0; i < keys.length; i++) {
					if (define[keys[i]].alias === miniflag.charAt(0)) {
						if (define[keys[i]].boolean === false) {
							if (miniflag.charAt(1) === '=') flags[keys[i]] = miniflag.substr(2);
							else flagNeedsVal.push(keys[i]);
						} else flags[keys[i]] = true;
						break;
					}
				}
				if (i >= keys.length) {
					success = false;
					error.push(`Miniflag "${miniflag.charAt(0)}" undefined`);
				}
			} else {
				// Handle multiple miniflags
				// Go though all miniflags
				let localFlagNeedsVal = [];
				for (i = 0; i < miniflag.length; i++) {
					if (miniflag.charAt(i) === '=' && localFlagNeedsVal.length) {
						// only flags part of the miniflag collection should get this value
						const val = miniflag.substr(i + 1);
						localFlagNeedsVal.forEach((f) => {
							flags[f] = val;
						});
						localFlagNeedsVal = [];
						break;
					} else if (miniflag.charAt(i) === '=' && !localFlagNeedsVal.length) {
						// if miniflag collection contains no non-boolean flags there shouldn't be an equals-sign
						success = false;
						error.push('Strange equals-sign with miniflag collection ' + miniflag.substr(0, i));
						break;
					}
					for (j = 0; j < keys.length; j++) {
						if (define[keys[j]].alias == miniflag.charAt(i)) {
							if (define[keys[j]].boolean === false) localFlagNeedsVal.push(keys[j]);
							else flags[keys[j]] = true;
							break;
						}
					}
					if (j >= keys.length) {
						success = false;
						error.push(`Miniflag "${miniflag.charAt(i)}" undefined`);
					}
				}
				if (i >= miniflag.length && localFlagNeedsVal.length)
					flagNeedsVal.push(...localFlagNeedsVal);
			}
		} else {
			// Handle normal flag
			const longflag = e.substr(2).split('=');
			if (!define[longflag[0]]) {
				success = false;
				error.push(`Longflag "${longflag[0]}" undefined`);
				if (longflag[1]) flags[longflag[0]] = longflag[1];
				else flags[longflag[0]] = true;
			} else if (define[longflag[0]].boolean === false) {
				if (longflag[1]) flags[longflag[0]] = longflag[1];
				else flagNeedsVal.push(longflag[0]);
			} else {
				flags[longflag[0]] = true;
			}
		}
	});
	return { success, error, args };
}

function get(flag) {
	// if (!flag) return null;
	// if (flags[flag]) return flags[flag];
	// else return null;

	if (!flag) return null;
	if (args.length && !flags[flag]) return null;
	if (flags[flag]) return flags[flag];
	for (let i = 0; i < process.argv.length; i++) {
		const e = process.argv[i];
		if (e.charAt(0) === '-' && e.charAt(1) === '-') {
			const f = e.substr(2).split('=');
			if (f[0] === flag) {
				if (f[1]) flags[f[0]] = f[1];
				else flags[f[0]] = true;
				break;
			}
		}
	}
	if (flags[flag]) return flags[flag];
	return null;
}

function reset() {
	flags = {};
	args = [];
	fullArgs = [];
	success = true;
	error = [];
}

dc.get = get;

dc.flags = function () {
	return flags;
};

dc.args = function (str) {
	if (str === 'full') return fullArgs;
	else return args;
};

dc.reset = reset;

module.exports = dc;
