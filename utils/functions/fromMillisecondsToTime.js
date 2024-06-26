export default function (timestamp) {
	let seconds = Math.floor(timestamp / 1000);
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	seconds = seconds % 60;

	const time =
		hours.toString().padStart(2, '0') +
		':' +
		minutes.toString().padStart(2, '0') +
		':' +
		seconds.toString().padStart(2, '0');
	return time;
}
