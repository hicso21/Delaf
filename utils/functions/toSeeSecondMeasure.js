export default function toSeeSecondMeasure(exercise) {
	const type = exercise?.second_measure;
	const unitType = exercise?.second_measurement_unit;
	if (type === 'duration') {
		const moreThanAMinute = exercise?.second_duration > 60;
		const fromSecondsToMinutes = exercise?.second_duration / 60;
		const seconds = exercise?.second_duration % 60;
		if (moreThanAMinute)
			return `${fromSecondsToMinutes}m ${
				seconds > 0 ? seconds + 's' : ''
			}`;
		else if (exercise?.second_duration === 60) return `1m`;
		else return `${exercise?.second_duration}s`;
	}
	if (type === 'distance') return `${exercise?.second_duration}${unitType}`;
	if (type === 'lap') return `${unitType}`;
	if (type === 'frequency') return `${unitType} ${exercise?.second_duration}`;
	if (type === 'rythm') return `${unitType} ${exercise?.second_duration}`;
}