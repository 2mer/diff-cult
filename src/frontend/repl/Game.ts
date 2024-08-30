import chalk from "chalk";
import { HeadlessGame, IncorrectSubmissionError } from "../../HeadlessGame";
import { Level, Task } from "../../logic";
import { humanReadableTime } from "../../util";
import * as REPL from "repl";
import vm from 'vm';

const hanndleError = (error: Error) => {
	if (error instanceof IncorrectSubmissionError) {
		console.log(
			'\n' +
			`${chalk.red`┃`} ❌ The submitted value does not match the target\n` +
			`${chalk.red`┃`} \n` +
			`${chalk.red`┃`}  ${chalk.red("\"" + error.submission + "\"")} ≠ "${error.target}" \t ${chalk.gray`(submission) ≠ (target)`}\n`
		)
	}
}

const code = (str: string) => {
	return chalk.blue(str);
}

function isRecoverableError(error: Error) {
	if (error.name === 'SyntaxError') {
		return /^(Unexpected end of input|Unexpected token)/.test(error.message);
	}
	return false;
}

export class ReplGame extends HeadlessGame {

	private repl: REPL.REPLServer;

	private renderReplEvalOutput = true;

	constructor(tasksPerLevel: number) {
		super(tasksPerLevel);

		this.repl = REPL.start({
			prompt: this.makePrompt(),
			eval: this.replEval.bind(this),
		});

		const _this = this;

		Object.defineProperty(this.repl.context, 'origin', {
			get() {
				return _this.origin;
			},

			set(v: string) {
				_this.origin = v;
			},
		})

		this.repl.context.submit = this.submit.bind(this);

		this.repl.defineCommand('tutorial', {
			help: 'displays the tutorial',
			action() {
				_this.tutorial()
				this.displayPrompt();
			},
		})

		this.repl.defineCommand('task', {
			help: 'displays the current task',
			action() {
				_this.printTask()
				this.displayPrompt();
			},
		})

		this.repl.defineCommand('level', {
			help: 'displays the current level',
			action() {
				_this.printTask();
				this.displayPrompt();
			},
		})
	}

	private inBulkSubmit = false;

	private processMacros(cmd: string): string {

		const ffRegex = />>?\n$/;

		if (ffRegex.test(cmd)) {
			return `submit(() => { ${cmd.replace(ffRegex, '')} })`;
		}

		return cmd;
	}

	private replEval(cmd: any, context: any, filename: any, callback: any) {
		try {
			const res = vm.runInContext(this.processMacros(cmd), context);


			if (this.renderReplEvalOutput) {
				callback(null, res)
			} else {
				this.renderReplEvalOutput = true;
				callback(null)
			}
		} catch (err) {
			if (isRecoverableError(err as any)) {
				return callback(new REPL.Recoverable(err as any));
			}

			if (err instanceof IncorrectSubmissionError) {
				hanndleError(err);
				callback(null);
				return;
			}

			callback(err);
		}
	}

	protected makePrompt() {
		const taskText = ` 🎯 ${this.taskIndex + 1}/${this.tasksPerLevel} `;
		const levelText = ` 🔷 ${this.levelIndex + 1} - ${this.currentLevel.description} `
		const columns = process.stdout.columns;
		const remainder = columns - taskText.length - levelText.length - 4;

		return (
			`  ${`▂`.repeat(taskText.length)}  ${`▂`.repeat(levelText.length)}\n` +
			`${chalk.gray`──`}${chalk.inverse(taskText)}${chalk.gray`──`}${chalk.inverse(levelText)}${chalk.gray`─`.repeat(remainder)}\n` +
			`  ${`🮂`.repeat(taskText.length)}  ${`🮂`.repeat(levelText.length)}\n` +
			`${chalk.blue`❯`} `
		);
	}

	protected onAdvance(): void {
		this.repl.setPrompt(
			this.makePrompt()
		);

		this.printTask();
	}

	protected onLevelComplete({ time }: { level: Level; time: number; index: number }): void {
		console.log();
		console.log(`${chalk.green`┃`} ✅ Level ${this.levelIndex} complete!`)
		console.log(`${chalk.green`┃`}  ${chalk.gray`submitted in`} ${chalk.white(humanReadableTime(time))}`)
		console.log();

		this.renderReplEvalOutput = false;
	}

	protected onTaskComplete({ time, index }: { task: Task; time: number; index: number }): void {
		if (this.inBulkSubmit) {
			console.log(`${chalk.blue`┃`} ${index + 1}/${this.tasksPerLevel} ${chalk.bgGreen.white` PASS `}`);
		} else {
			console.log();
			console.log('╭─ ✅ task complete!')
			console.log('│')
			console.log(`╰─────── ${chalk.gray`submitted in`} ${chalk.white(humanReadableTime(time))}`)
			console.log();
		}

		this.renderReplEvalOutput = false;
	}

	protected onVictory(): void {
		console.log('')
		console.log(`${chalk.magenta`┃`} 🎉 You have completed the game!`)
		console.log(`${chalk.magenta`┃`}`)
		console.log(`${chalk.magenta`┃`}  created by Tomer Atar 2024`)
		console.log('')

		this.repl.close();
		this.renderReplEvalOutput = false;

	}


	private printHeader() {
		console.log(`┃ 🎯 Level ${this.levelIndex + 1} \t [task ${this.taskIndex + 1}/${this.tasksPerLevel}]`)
	}

	private printTask() {
		if (this.inBulkSubmit) return;

		console.log('')
		this.printHeader();
		console.log('┃')
		console.log('┃  - origin ' + this.currentTask.origin)
		console.log('┃  - target ' + this.currentTask.target)
		console.log('')
	}

	tutorial() {
		console.log('')
		console.log(`│ ❔ ${chalk.underline`how to play`}`)
		console.log('│')
		console.log(`│  Your goal is to get ${chalk.inverse` origin `} to look like ${chalk.inverse` target `}`)
		console.log(`│  Each ${chalk.inverse` 🔷 Level `} is made up from ${chalk.inverse` 🎯 Task `}s`)
		console.log(`│  Complete all tasks to finish the level`)
		console.log(`│  Complete all levels to finish the game`)
		console.log('│')
		console.log(`│  ${chalk.underline.gray`gameplay`}`)
		console.log(`│  - ${code('origin')} to get the origin value`)
		console.log(`│  - ${code('origin = <value>')} to submit a value for the current task`)
		console.log(`│  - ${code('submit(() => game.origin = <value>)')} to try your solution on all remaining level tasks`)
		console.log(`│  - ${code('game.origin = <value> >>')} to try your solution on all remaining level tasks`)
		console.log(`│ `)
		console.log(`│  ${chalk.underline.gray`info`}`)
		console.log(`│  - ${code('.task')} to show level information`)
		console.log(`│  - ${code('.level')} to show level information`)
		console.log(`│  - ${code('.tutorial')} to show this message`)
		console.log(`│  - ${code('.help')} to show REPL commands`)
		console.log('')
	}

	level() {
		this.printTask()
	}

	submit(fn: () => void) {
		this.inBulkSubmit = true;
		console.log('')
		console.log(`${chalk.blue`┃`} 📩 Submitting solution...`)
		console.log(`${chalk.blue`┃`} `)
		for (let i = this.taskIndex; i < this.tasksPerLevel; i++) {
			try {
				fn();
			} catch (err) {
				console.log(`${chalk.blue`┃`} ${i + 1}/${this.tasksPerLevel} ${chalk.bgRed.white` FAIL `}`);
				throw (err);
			}
		}
		this.inBulkSubmit = false;

		if (!this.won) {
			this.printTask();
		}
	}

}