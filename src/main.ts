// import { Game } from "./HeadlessGame";

// const game = new Game(3);

// // enter alternate buffer mode
// process.stdout.write('\u001b[?1049h');

// console.clear();


// console.log('🎮 welcome to the game 🎮')
// console.log();

// game.help();
// game.level();

// declare global {
// 	type MyGlobalType = {
// 		id: number;
// 		name: string;
// 	};

// 	var game: Game;

// 	var origin: string;

// 	function help(): void;
// 	function level(): void;

// 	function submit(fn: () => void): void;
// }

// globalThis.game = game;
// Object.defineProperty(globalThis, 'origin', {
// 	get() {
// 		return game.origin;
// 	},

// 	set(v: string) {
// 		game.origin = v;
// 	},
// })
// globalThis.help = game.help.bind(game);
// globalThis.level = game.level.bind(game);
// globalThis.submit = game.submit.bind(game);

// [
// 	'exit',
// 	'SIGINT',

// 	// catches "kill pid" (for example: nodemon restart)
// 	'SIGUSR1',
// 	'SIGUSR2',

// 	// catches uncaught exceptions
// 	'uncaughtException',
// ].forEach(e => {
// 	process.on(e, () => {
// 		// exit alternate buffer mode
// 		process.stdout.write('\u001b[?1049l');
// 	})
// })