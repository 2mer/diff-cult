import { Random } from "../Random";
import { Task } from "../Task";
import { Level } from "../Level";

class Impl extends Level {
	constructor() {
		super('length');
	}

	public generateTask(): Task {
		const r = String(Random.nextCharsBetween(1, 16));

		const task = new Task(r, String(r.length))

		return task;
	}

}

export default new Impl();