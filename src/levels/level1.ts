import { Task, Random, Level } from "../logic";

class Impl extends Level {
	constructor() {
		super('!');
	}

	public generateTask(): Task {
		const r = String(Random.nextInt(100));

		const task = new Task(r, r + "!")

		return task;
	}

}

export default new Impl();