import chalk from "chalk";
import { ReplGame } from "./Game";

// process.stdout.write('\u001b[?1049h');
console.clear();

const asciiArt = `$$$$$$$\\  $$\\  $$$$$$\\   $$$$$$\\  
$$  __$$\\ \\__|$$  __$$\\ $$  __$$\\ 
$$ |  $$ |$$\\ $$ /  \\__|$$ /  \\__|
$$ |  $$ |$$ |$$$$\\     $$$$\\     
$$ |  $$ |$$ |$$  _|    $$  _|    
$$ |  $$ |$$ |$$ |      $$ |      
$$$$$$$  |$$ |$$ |      $$ |      
\\_______/ \\__|\\__|      \\__| CULT `

console.log(
	`${asciiArt}\n` +
	'\n' +
	`│ 🎮 Welcome to Diff-cult ${chalk.blue`REPL edition`}\n` +
	`│ \n` +
	`│ type ${chalk.bgBlackBright.yellow`.tutorial`} to show the tutorial\n`
)

const game = new ReplGame(3);


[
	'exit',
	'SIGINT',

	// catches "kill pid" (for example: nodemon restart)
	'SIGUSR1',
	'SIGUSR2',

	// catches uncaught exceptions
	'uncaughtException',
].forEach(e => {
	process.on(e, () => {
		// exit alternate buffer mode
		// process.stdout.write('\u001b[?1049l');
	})
})