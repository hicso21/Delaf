export default function calendarItemsFormating(array1, array2) {
	const result1 = array1?.reduce((acc, item) => {
		const date = item.start.split('T')[0]; // Obtener la fecha de start del item
		if (!acc[date]) {
			acc[date] = []; // Crear un array vacío si no existe la fecha en el objeto acumulador
		}
		acc[date].push({ name: item.resource.name, date }); // Agregar el objeto al array correspondiente a la fecha
		return acc;
	}, {});

	const result2 = array2?.reduce((acc, item) => {
		const date = item.start.split('T')[0]; // Obtener la fecha de start del item
		if (!acc[date]) {
			acc[date] = []; // Crear un array vacío si no existe la fecha en el objeto acumulador
		}
		acc[date].push({ name: item.resource.name, date }); // Agregar el objeto al array correspondiente a la fecha
		return acc;
	}, {});

	for (const date in result2) {
		if (result1.hasOwnProperty(date)) {
			result1[date] = result1[date].concat(result2[date]);
		} else {
			result1[date] = result2[date];
		}
	}

	return result1;
}
