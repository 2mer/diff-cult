export function humanReadableTime(ms: number) {
	const units = [
		{ unit: 'd', factor: 24 * 60 * 60 * 1000 }, // days
		{ unit: 'h', factor: 60 * 60 * 1000 },      // hours
		{ unit: 'm', factor: 60 * 1000 },           // minutes
		{ unit: 's', factor: 1000 },                // seconds
		{ unit: 'ms', factor: 1 }                   // milliseconds
	];

	for (const { unit, factor } of units) {
		const value = ms / factor;
		if (value >= 1) {
			return `${parseFloat(value.toFixed(2))} ${unit}`;
		}
	}

	return '0 ms';
}
