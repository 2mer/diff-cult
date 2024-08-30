import { levels } from "./levels";
import { Level, Task } from "./logic";
import Timer from "./Timer";

export class IncorrectSubmissionError extends Error {
	constructor(public submission: string, public target: string) {
		super('IncorrectSubmissionError')
	}
}

export class HeadlessGame {

	protected currentLevel: Level = levels[0];
	protected currentTask: Task;
	protected taskIndex: number = 0;
	protected levelIndex: number = 0;

	private taskTimer = new Timer();
	private levelTime = 0;
	protected won = false;

	constructor(protected tasksPerLevel: number) {
		this.currentTask = this.currentLevel.generateTask();
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
	set origin(value: string) {
		const isSame = this.currentTask.target === value;
		if (!isSame) {
			throw new IncorrectSubmissionError(value, this.currentTask.target)
		}

		this.advance();
	}

}