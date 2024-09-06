import { Task } from "../Task";
import { Level } from "../Level";

class Impl extends Level {
	constructor() {
		super("Hello World");
	}

	public generateTask(): Task {
		const task = new Task("Hello", "World")

		return task;
	}
}

export default new Impl();