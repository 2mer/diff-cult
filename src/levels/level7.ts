import { Task, Random, Level } from "../logic";

class Impl extends Level {
	constructor() {
		super('(1o1)x3');
	}

	public generateTask(): Task {
		const r = String(Random.nextInt(100));

		const task = new Task(r, String(Number("1" + r + "1") * 3))

		return task;
	}

}

export default new Impl();