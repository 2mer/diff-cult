export class Task {
	constructor(public origin: string, public target: string) { }
}

export abstract class Level {

	constructor(public description: string) {
	}

	public abstract generateTask(): Task;

}

export const Random = {
	nextInt(max: number) {
		return Math.round(Math.random() * max)
	}
}