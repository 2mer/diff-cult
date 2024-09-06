import { ChildProcess, ChildProcessWithoutNullStreams, spawn } from "child_process";
import { GameState, HeadlessGame, IncorrectSubmissionError } from "../../HeadlessGame";
import { Level } from "../../Level";
import { Task } from "../../Task";
import path from "path";
import { createWriteStream, readFile, WriteStream } from "fs";
import { writeFile } from "fs/promises";
import chalk from "chalk";
import { humanReadableTime } from "../../util";
import chokidar from 'chokidar';

export type ShellGameOptions = {
	command?: string,
	outDir: string,
	bulkMode: boolean,
}

export class ShellGame extends HeadlessGame {

	protected watcher?: chokidar.FSWatcher;
	protected cmdProc?: ChildProcess;
	protected logStream?: WriteStream;

	constructor(tasksPerLevel: number, protected options: ShellGameOptions, initialState?: GameState) {
		super(tasksPerLevel, initialState);

		this.init();
	}

	protected async init() {
		this.logStream = createWriteStream(this.logPath)

		await this.writeLevel();

		this.watcher = chokidar.watch(this.originPath, { persistent: true })
		this.watcher.on('change', this.handleOriginChanged.bind(this));

		this.printLevel();
	}

	protected log(msg: string = '') {
		if (this.logStream) {
			this.logStream!.write(msg + '\n');
		} else {
			console.log(msg);
		}
	}

	protected printLevel() {
		// console.clear();
		// console.log("DIFF-CULT fs")
		this.log(this.makePrompt());
		this.log(this.currentTask.target)
	}

	protected onAdvance(): void {
		this.log('advance!')
		this.writeLevel().then(() => {
			this.printLevel();
		})
	}

	protected onLevelComplete({ time }: { level: Level; time: number; index: number; }): void {
		this.log();
		this.log(`${chalk.green`┃`} ✅ Level ${this.levelIndex} complete!`)
		this.log(`${chalk.green`┃`}  ${chalk.gray`submitted in`} ${chalk.white(humanReadableTime(time))}`)
		this.log();
	}

	protected onTaskComplete({ index, time }: { task: Task; time: number; index: number; }): void {
		if (this.options.bulkMode) {
			this.log(`${chalk.blue`┃`} ${index + 1}/${this.tasksPerLevel} ${chalk.bgGreen.white` PASS `}`);
		} else {
			this.log();
			this.log(`${chalk.green`┃`} ✅ Task ${this.levelIndex} complete!`)
			this.log(`${chalk.green`┃`}  ${chalk.gray`submitted in`} ${chalk.white(humanReadableTime(time))}`)
			this.log();
		}
	}

	protected onVictory(): void {
		this.log('')
		this.log(`${chalk.magenta`┃`} 🎉 You have completed the game!`)
		this.log(`${chalk.magenta`┃`}`)
		this.log(`${chalk.magenta`┃`}  created by Tomer Atar 2024`)
		this.log('')

		process.exit(0);
	}

	get originPath() {
		return path.join(this.options.outDir, "DC_origin")
	}

	get targetPath() {
		return path.join(this.options.outDir, "DC_target")
	}

	get logPath() {
		return path.join(this.options.outDir, "DC_log")
	}

	protected handleOriginChanged() {
		readFile(this.originPath, 'utf8', (error, data) => {
			if (error) {
				this.log("Failed to read origin file...")
				return;
			}

			// same data, this can happen manually on save or when the level changes
			if (data === this.currentTask.origin) {
				return;
			}

			// try submitting the data
			try {
				this.origin = data.trim();
			} catch (error) {
				if (error instanceof IncorrectSubmissionError) {
					this.log(
						'\n' +
						`${chalk.red`┃`} ❌ The submitted value does not match the target\n` +
						`${chalk.red`┃`} \n` +
						`${chalk.red`┃`}  ${chalk.red("\"" + error.submission + "\"")} ≠ "${error.target}" \t ${chalk.gray`(submission) ≠ (target)`}\n`
					)
				}
			}
		})
	}

	protected async writeLevel() {
		await this.closeEditor();

		await Promise.all([
			writeFile(this.originPath, this.currentTask.origin),
			writeFile(this.targetPath, this.currentTask.target),
		]);

		console.log('write to file!!', this.originPath, this.currentTask.origin)

		this.openEditor();
	}

	protected makePrompt() {
		const taskText = ` 🎯 ${this.taskIndex + 1}/${this.tasksPerLevel} `;
		const levelText = ` 🔷 ${this.levelIndex + 1} - ${this.currentLevel.description} `
		const columns = process.stdout.columns;
		const remainder = columns - taskText.length - levelText.length - 4;

		return (
			`  ${`▂`.repeat(taskText.length)}  ${`▂`.repeat(levelText.length)}\n` +
			`${chalk.gray`──`}${chalk.inverse(taskText)}${chalk.gray`──`}${chalk.inverse(levelText)}${chalk.gray`─`.repeat(remainder)}\n` +
			`  ${`🮂`.repeat(taskText.length)}  ${`🮂`.repeat(levelText.length)}`
		);
	}

	protected async closeEditor() {
		if (!this.options.command) return Promise.resolve();
		if (!this.cmdProc) return Promise.resolve();

		return new Promise<void>((resolve, reject) => {
			this.cmdProc!.kill('SIGTERM');

			this.cmdProc!.on('close', () => {
				const resetProcess = spawn('reset', {
					stdio: 'inherit' // Ensure reset command affects the terminal
				});

				resetProcess.on('exit', () => {
					process.stdin.resume();
					resolve();
				});
			})
		})
	}

	protected openEditor() {
		if (!this.options.command) return;

		this.cmdProc = spawn(this.options.command!, {
			shell: true,
			stdio: 'inherit',
			env: {
				...process.env,

				DC_originFile: this.originPath,
				DC_targetFile: this.originPath,
				DC_logFile: this.logPath,
				DC_level: this.levelIndex,
				DC_task: this.taskIndex,
			} as any
		})
	}
}