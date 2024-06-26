const types = [
	{ name: 'Carrera', value: 'running' },
	{ name: 'Técnica de carrera', value: 'running_technique' },
	{ name: 'Bici', value: 'bike' },
	{ name: 'Funcional', value: 'functional' },
	{ name: 'Elíptica', value: 'elliptical' },
	{ name: 'Calentamiento', value: 'heating' },
	{ name: 'Enfriamiento', value: 'cooling' },
	{ name: 'Descanso', value: 'rest' },
];

export const typesDefinitions = {
	race: 'Carrera',
	bike: 'Bici',
	functional: 'Funcional',
	elliptical: 'Elíptica',
	heating: 'Calentamiento',
	cooling: 'Enfriamiento',
	rest: 'Descanso',
}

export default types;
