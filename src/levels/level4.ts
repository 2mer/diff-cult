import { Task, Random, Level } from "../logic";

class Impl extends Level {
	constructor() {
		super('oo');
	}

	public generateTask(): Task {
		const r = String(Random.nextCharsBetween(3, 8));

		const task = new Task(r, r + r)

		return task;
	}

}

export default new Impl();