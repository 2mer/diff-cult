import { Task, Random, Level } from "../logic";

class Impl extends Level {
	constructor() {
		super('o+1');
	}

	public generateTask(): Task {
		const r = String(Random.nextInt(100));

		const task = new Task(r, String(Number(r) + 1))

		return task;
	}

}

export default new Impl();