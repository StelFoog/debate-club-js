const assert = require('assert');
const dc = require('../debateClub');
let res;
const execArgs = ['node', 'test'];

function setArgs(str) {
	process.argv.push(...str.split(' '));
}

function init() {
	res = dc({
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
		},
	});
}

describe('do–init tests without errors', () => {
	beforeEach(() => {
		process.argv = JSON.parse(JSON.stringify(execArgs));
		process.execPath = execArgs[0];
		require.main.filename = execArgs[1];
	});

	afterEach(() => {
		dc.reset();
	});

	it('node test --land', () => {
		setArgs('--land');
		init();
		assert.strictEqual(dc('land'), true);
		assert.strictEqual(res.error.length, 0);
		assert.deepStrictEqual(res.args, execArgs);
	});

	it('node test -a', () => {
		setArgs('-a');
		init();
		assert.strictEqual(dc('all'), true);
		assert.strictEqual(res.error.length, 0);
		assert.deepStrictEqual(res.args, execArgs);
	});

	it('node test --in 10', () => {
		setArgs('--in 10');
		init();
		assert.strictEqual(dc('in'), '10');
		assert.strictEqual(res.error.length, 0);
		assert.deepStrictEqual(res.args, execArgs);
	});

	it('node test --in=10', () => {
		setArgs('--in=10');
		init();
		assert.strictEqual(dc('in'), '10');
		assert.strictEqual(res.error.length, 0);
		assert.deepStrictEqual(res.args, execArgs);
	});

	it('node test --stone --in common', () => {
		setArgs('--stone --in common');
		init();
		assert.strictEqual(dc('in'), 'common');
		assert.strictEqual(dc('stone'), 'common');
		assert.strictEqual(res.error.length, 0);
		assert.deepStrictEqual(res.args, execArgs);
	});

	it('node test -las round', () => {
		setArgs('-las round');
		init();
		assert.strictEqual(dc('list'), true);
		assert.strictEqual(dc('all'), true);
		assert.strictEqual(dc('stone'), 'round');
		assert.strictEqual(res.error.length, 0);
		assert.deepStrictEqual(res.args, execArgs);
	});

	it('node test mask', () => {
		setArgs('mask');
		init();
		assert.strictEqual(res.error.length, 0);
		assert.deepStrictEqual(res.args, [...execArgs, 'mask']);
	});

	it('node test --in -sal=strict out mind', () => {
		setArgs('--in -sal=strict out mind');
		init();
		assert.strictEqual(dc('list'), true);
		assert.strictEqual(dc('all'), true);
		assert.strictEqual(dc('in'), 'out');
		assert.strictEqual(dc('stone'), 'strict');
		assert.strictEqual(res.error.length, 0);
		assert.deepStrictEqual(res.args, [...execArgs, 'mind']);
	});

	it('node test -s --land ball --in round stealth -la close', () => {
		setArgs('-s --land ball --in round stealth -la close');
		init();
		assert.strictEqual(dc('list'), true);
		assert.strictEqual(dc('all'), true);
		assert.strictEqual(dc('in'), 'round');
		assert.strictEqual(dc('land'), true);
		assert.strictEqual(dc('stone'), 'ball');
		assert.strictEqual(res.error.length, 0);
		assert.deepStrictEqual(res.args, [...execArgs, 'stealth', 'close']);
	});
});

describe('do-init tests with errors', () => {
	beforeEach(() => {
		process.argv = JSON.parse(JSON.stringify(execArgs));
		process.execPath = execArgs[0];
		require.main.filename = execArgs[1];
	});

	afterEach(() => {
		dc.reset();
	});

	it('node test --nop pop', () => {
		setArgs('--nop pop');
		init();
		assert.strictEqual(dc('nop'), true);
		assert.deepStrictEqual(res.error, ['Longflag "nop" undefined']);
		assert.deepStrictEqual(res.args, [...execArgs, 'pop']);
	});

	it('node test -ys rock', () => {
		setArgs('-ys rock');
		init();
		assert.strictEqual(dc('stone'), 'rock');
		assert.deepStrictEqual(res.error, ['Miniflag "y" undefined']);
		assert.deepStrictEqual(res.args, execArgs);
	});

	it('node test --nop=pop -i mode', () => {
		setArgs('--nop=pop -i mode');
		init();
		assert.strictEqual(dc('nop'), 'pop');
		assert.deepStrictEqual(res.error, ['Longflag "nop" undefined', 'Miniflag "i" undefined']);
		assert.deepStrictEqual(res.args, [...execArgs, 'mode']);
	});

	it('node test -la=pop', () => {
		setArgs('-la=pop');
		init();
		assert.strictEqual(dc('list'), true);
		assert.strictEqual(dc('all'), true);
		assert.deepStrictEqual(res.error, ['Strange equals-sign with miniflag collection la']);
		assert.deepStrictEqual(res.args, execArgs);
	});
});

describe('no-init tests', () => {
	beforeEach(() => {
		process.argv = JSON.parse(JSON.stringify(execArgs));
		process.execPath = execArgs[0];
		require.main.filename = execArgs[1];
	});

	afterEach(() => {
		dc.reset();
	});

	it('node test', () => {
		setArgs('');
		assert.strictEqual(dc('all'), null);
	});

	it('node test --all', () => {
		setArgs('--all');
		assert.strictEqual(dc('all'), true);
	});

	it('node test --all=objects', () => {
		setArgs('--all=objects');
		assert.strictEqual(dc('all'), 'objects');
	});
});
