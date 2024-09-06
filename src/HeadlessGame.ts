import { levels } from "./levels";
import { Task } from "./Task";
import { Level } from "./Level";
import Timer from "./Timer";

export class IncorrectSubmissionError extends Error {
	constructor(public submission: string, public target: string) {
		super('IncorrectSubmissionError')
	}
}

export type GameState = { level?: number, task?: number };

export class HeadlessGame {

	protected currentLevel: Level;
	protected currentTask: Task;
	protected taskIndex: number;
	protected levelIndex: number;

	private taskTimer = new Timer();
	private levelTime = 0;
	protected won = false;

	constructor(protected tasksPerLevel: number, initialState?: GameState) {
		this.taskIndex = initialState?.task ?? 0;
		this.levelIndex = initialState?.level ?? 0;

		this.currentLevel = levels[this.levelIndex]

		this.currentTask = this.currentLevel.generateTask();
		this.taskTimer.start();
	};


	// hooks
	protected onVictory() { };
	protected onAdvance() { };
	protected onTaskComplete(e: { task: Task, time: number; index: number }) { };
	protected onLevelComplete(e: { level: Level, time: number; index: number }) { };

	private victory() {
		this.onVictory();
		this.won = true;
	}

	private advance() {
		const time = this.taskTimer.end();
		this.levelTime += time;

		this.onTaskComplete({ task: this.currentTask, time, index: this.taskIndex });

		this.taskIndex++;
		if (this.taskIndex >= this.tasksPerLevel) {
			this.taskIndex = 0;
			this.levelIndex++;

			if (this.levelIndex >= levels.length) {
				this.victory();
				return;
			}


			this.onLevelComplete({ level: this.currentLevel, time: this.levelTime, index: this.levelIndex });
			this.levelTime = 0;

			this.currentLevel = levels[this.levelIndex];
		}

		this.currentTask = this.currentLevel!.generateTask();
		this.taskTimer.start();

		this.onAdvance();
	}

	/**
	 * get current task origin
	 * */
	get origin() {
		return this.currentTask.origin;
	}

	/**
	 * submit a value to the current task
	 */
	set origin(_value: string) {
		const value = String(_value);
		const isSame = this.currentTask.target === value;
		if (!isSame) {
			throw new IncorrectSubmissionError(value, this.currentTask.target)
		}

		this.advance();
	}

}