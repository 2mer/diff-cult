const MIN_CHAR_CODE = 'a'.charCodeAt(0);
const MAX_CHAR_CODE = 'z'.charCodeAt(0);

export const Random = {
	nextInt(max: number) {
		return Math.round(Math.random() * max);
	},

	between(min: number, max: number) {
		return min + Math.round(Math.random() * (max - min));
	},

	nextChar() {
		return String.fromCharCode(this.between(MIN_CHAR_CODE, MAX_CHAR_CODE));
	},

	nextChars(length: number) {
		return Array.from({ length }, () => this.nextChar()).join('');
	},

	nextCharsBetween(min: number, max: number) {
		const length = this.between(min, max);
		return this.nextChars(length);
	}
};
