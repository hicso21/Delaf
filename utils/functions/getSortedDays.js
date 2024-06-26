export default function getSortedWeekdays() {
	const weekdays = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
	const today = new Date().getDay();

	return weekdays.slice(today).concat(weekdays.slice(0, today));
}
