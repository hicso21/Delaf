const colorRandomizer = () => {
	const luminosidadMinima = 0.6; // Luminosidad mínima para considerar un color claro
	let color;
	do {
		color = '#' + Math.floor(Math.random() * 16777215).toString(16);
		// Convertir a RGB para calcular la luminosidad
		const r = parseInt(color.substr(1, 2), 16);
		const g = parseInt(color.substr(3, 2), 16);
		const b = parseInt(color.substr(5, 2), 16);
		// Calcular la luminosidad
		const luminosidad = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
		if (luminosidad >= luminosidadMinima) {
			return color;
		}
	} while (true);
};

export default colorRandomizer;
