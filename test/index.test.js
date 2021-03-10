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
		_miniflags: {
			als: {
				boolean: false,
			},
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
		assert.strictEqual(dc('list'), null);
		assert.strictEqual(res.error.length, 0);
		assert.strictEqual(res.args.length, 0);
	});

	it('node test -a', () => {
		setArgs('-a');
		init();
		assert.strictEqual(dc('all'), true);
		assert.strictEqual(dc('list'), null);
		assert.strictEqual(res.error.length, 0);
		assert.strictEqual(res.args.length, 0);
	});

	it('node test --in 10', () => {
		setArgs('--in 10');
		init();
		assert.strictEqual(dc('in'), '10');
		assert.strictEqual(dc('list'), null);
		assert.strictEqual(res.error.length, 0);
		assert.strictEqual(res.args.length, 0);
	});

	it('node test --in=10', () => {
		setArgs('--in=10');
		init();
		assert.strictEqual(dc('in'), '10');
		assert.strictEqual(dc('list'), null);
		assert.strictEqual(res.error.length, 0);
		assert.strictEqual(res.args.length, 0);
	});

	it('node test --stone --in common', () => {
		setArgs('--stone --in common');
		init();
		assert.strictEqual(dc('in'), 'common');
		assert.strictEqual(dc('stone'), 'common');
		assert.strictEqual(dc('list'), null);
		assert.strictEqual(res.error.length, 0);
		assert.strictEqual(res.args.length, 0);
	});

	it('node test -las round', () => {
		setArgs('-las round');
		init();
		assert.strictEqual(dc('list'), true);
		assert.strictEqual(dc('all'), true);
		assert.strictEqual(dc('stone'), 'round');
		assert.strictEqual(dc('land'), null);
		assert.strictEqual(res.error.length, 0);
		assert.strictEqual(res.args.length, 0);
	});

	it('node test mask', () => {
		setArgs('mask');
		init();
		assert.strictEqual(res.error.length, 0);
		assert.deepStrictEqual(res.args, ['mask']);
	});

	it('node test --in -sal=strict out mind', () => {
		setArgs('--in -sal=strict out mind');
		init();
		assert.strictEqual(dc('list'), true);
		assert.strictEqual(dc('all'), true);
		assert.strictEqual(dc('in'), 'out');
		assert.strictEqual(dc('stone'), 'strict');
		assert.strictEqual(dc('land'), null);
		assert.strictEqual(res.error.length, 0);
		assert.deepStrictEqual(res.args, ['mind']);
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
		assert.deepStrictEqual(res.args, ['stealth', 'close']);
	});

	it('node test -als toy barn', () => {
		setArgs('-als toy barn');
		init();
		assert.strictEqual(dc('-als'), 'toy');
		assert.strictEqual(res.error.length, 0);
		assert.deepStrictEqual(res.args, ['barn']);
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
		assert.deepStrictEqual(res.args, ['pop']);
	});

	it('node test -ys rock', () => {
		setArgs('-ys rock');
		init();
		assert.strictEqual(dc('stone'), 'rock');
		assert.strictEqual(dc('list'), null);
		assert.deepStrictEqual(res.error, ['Miniflag "y" undefined']);
		assert.strictEqual(res.args.length, 0);
	});

	it('node test --nop=pop -i mode', () => {
		setArgs('--nop=pop -i mode');
		init();
		assert.strictEqual(dc('nop'), 'pop');
		assert.strictEqual(dc('list'), null);
		assert.deepStrictEqual(res.error, ['Longflag "nop" undefined', 'Miniflag "i" undefined']);
		assert.deepStrictEqual(res.args, ['mode']);
	});

	it('node test -la=pop', () => {
		setArgs('-la=pop');
		init();
		assert.strictEqual(dc('list'), true);
		assert.strictEqual(dc('all'), true);
		assert.strictEqual(dc('land'), null);
		assert.deepStrictEqual(res.error, ['Strange equals-sign with miniflag collection la']);
		assert.strictEqual(res.args.length, 0);
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
		assert.strictEqual(dc('list'), null);
	});

	it('node test --all=objects', () => {
		setArgs('--all=objects');
		assert.strictEqual(dc('all'), 'objects');
		assert.strictEqual(dc('list'), null);
	});
});
