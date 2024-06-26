export default function standarizeCalendarData(data) {
    console.log('data => ', data)
    // Initialize an empty object to store the result
    const result = {};

    // Loop through each item in the data array
    for (const item of data) {
        // Extract the date in YYYY-MM-DD format from the "start" field
        const dateString = item.start.split('T')[0];

        // Check if there's already an entry for the date
        if (!result[dateString]) {
            // If not, create a new array for that date
            // result[dateString] = [];
            result[dateString] = [{
                routines: 0,
                nutrition: 0,
                races: 0,
                date: dateString,
            }];
        }

        // Create an object with "date" and "name" properties
        // const eventObject = {
        // 	date: dateString,
        // 	name: item.title,
        // 	_id: item._id,
        // };

        if (item.type && item.type == 'routine' && result[dateString])
            result[dateString][0].routines += 1;
        if (item.type && item.type == 'race' && result[dateString])
            result[dateString][0].races += 1;
        if (item.type && item.type == 'nutrition' && result[dateString])
            result[dateString][0].nutrition += 1;

        // Add the event object to the array for the corresponding date
        // result[dateString].push(eventObject);
    }

    return result;
}
