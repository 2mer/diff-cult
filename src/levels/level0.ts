import { Task, Level } from "../logic";

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