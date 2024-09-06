import { Task } from "./Task";


export abstract class Level {

	constructor(public description: string) {
	}

	public abstract generateTask(): Task;

}
