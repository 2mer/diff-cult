import { performance } from "perf_hooks";

export default class Timer {
	private last = 0;

	start() {
		this.last = performance.now();
	}

	end() {
		const now = performance.now();
		const delta = now - this.last;

		return delta;
	}
}