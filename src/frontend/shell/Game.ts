import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { GameState, HeadlessGame } from "../../HeadlessGame";
import { Level } from "../../Level";
import { Task } from "../../Task";
import path from "path";
import { FSWatcher, readFile, watch } from "fs";
import { writeFile } from "fs/promises";

export type ShellGameOptions = {
	command: string,
	outDir: string
}

export class ShellGame extends HeadlessGame {

	protected watcher: FSWatcher;
	protected cmdProc?: ChildProcessWithoutNullStreams;

	constructor(tasksPerLevel: number, protected options: ShellGameOptions, initialState?: GameState) {
		super(tasksPerLevel, initialState);

		this.watcher = watch(this.originPath, { persistent: true })
		this.watcher.addListener('change', this.handleOriginChanged.bind(this));

		this.writeLevel();
	}

	protected onAdvance(): void {

	}

	protected onLevelComplete(e: { level: Level; time: number; index: number; }): void {

	}

	protected onTaskComplete(e: { task: Task; time: number; index: number; }): void {

	}

	protected onVictory(): void {

	}

	get originPath() {
		return path.join(this.options.outDir, "DC_origin")
	}

	get targetPath() {
		return path.join(this.options.outDir, "DC_target")
	}

	protected handleOriginChanged() {
		console.log('Target changed! checking match');

		readFile(this.originPath, 'utf8', (error, data) => {
			if (error) {
				console.error("Failed to read origin file...")
				return;
			}

			// same data, this can happen manually on save or when the level changes
			if (data === this.currentTask.origin) {
				return;
			}

			// try submitting the data
			this.origin = data;
		})
	}

	protected async writeLevel() {
		await Promise.all([
			writeFile(this.originPath, this.currentTask.origin),
			writeFile(this.targetPath, this.currentTask.target),
		]);
	}

	protected async setupShellEnvForLevel() {
		await this.writeLevel();

		this.cmdProc = spawn(this.options.command, {
			env: {
				...process.env,

				"DC_level": this.levelIndex,
				"DC_task": this.taskIndex,
				"DC_originFile": this.originPath,
				"DC_targetFile": this.targetPath,
			}
		})
	}
}