import { Random } from "../Random";
import { Task } from "../Task";
import { Level } from "../Level";

class Impl extends Level {
	constructor() {
		super('ox2');
	}

	public generateTask(): Task {
		const r = String(Random.nextInt(100));

		const task = new Task(r, String(Number(r) * 2))

		return task;
	}

}

export default new Impl();