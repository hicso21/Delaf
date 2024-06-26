const months = [
	'En',
	'Feb',
	'Mar',
	'Abr',
	'May',
	'Jun',
	'Jul',
	'Ago',
	'Sep',
	'Oct',
	'Nov',
	'Dic',
];

export function getLastSixMonths() {
	const today = new Date();
	const lastSixMonths = [];
	for (let i = 0; i < 6; i++) {
		const previousMonth = new Date(
			today.getFullYear(),
			today.getMonth() - i,
			1
		);
		lastSixMonths.push(months[previousMonth.getMonth()]);
	}
	return lastSixMonths.reverse();
}

export function getLastTwelveMonths() {
	const today = new Date();
	const lastTwelveMonths = [];
	for (let i = 0; i < 12; i++) {
		const previousMonth = new Date(
			today.getFullYear(),
			today.getMonth() - i,
			1
		);
		lastTwelveMonths.push(months[previousMonth.getMonth()]);
	}
	return lastTwelveMonths.reverse();
}
