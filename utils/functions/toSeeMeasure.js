export default function toSeeMeasure(exercise) {
	const type = exercise?.measure;
	const unitType = exercise?.measurement_unit;
	if (type === 'duration') {
		const moreThanAMinute = exercise?.duration > 60;
		const fromSecondsToMinutes = exercise?.duration / 60;
		const seconds = exercise?.duration % 60;
		if (moreThanAMinute)
			return `${fromSecondsToMinutes}m ${
				seconds > 0 ? seconds + 's' : ''
			}`;
		else if (exercise?.duration === 60) return `1m`;
		else return `${exercise?.duration}s`;
	}
	if (type === 'distance') return `${exercise?.duration}${unitType}`;
	if (type === 'lap') return `${unitType}`;
	if (type === 'frequency') return `${unitType} ${exercise?.duration}`;
	if (type === 'rythm') return `${unitType} ${exercise?.duration}`;
}