export default function toYYYYMMDD(date = null) {
	const newFormatDate = new Date(date == null ? Date.now() : date);
	return newFormatDate.toISOString().split('T')[0];
}
