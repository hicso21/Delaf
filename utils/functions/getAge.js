export default function getAge(timestamp) {
	let dateOfBirth = new Date(timestamp);
	let today = new Date();
	let age = today.getFullYear() - dateOfBirth.getFullYear();
	let monthsDifference = today.getMonth() - dateOfBirth.getMonth();
	if (
		monthsDifference < 0 ||
		(monthsDifference === 0 && today.getDate() < dateOfBirth.getDate())
	) {
		age--;
	}
	return age;
}
