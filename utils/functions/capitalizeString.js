export default function capitalizeString(string) {
	return string?.toLowerCase().replace(/\b\w/g, function (text) {
		return text.toUpperCase();
	});
}
