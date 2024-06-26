export default function getBackDate(days) {
	const actualDate = new Date();

	const previousDate = new Date(
		actualDate.getFullYear(),
		actualDate.getMonth(),
		actualDate.getDate() - days
	);

	const formattedDate = previousDate.toLocaleDateString('es-ES', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	});

	return formattedDate;
}
