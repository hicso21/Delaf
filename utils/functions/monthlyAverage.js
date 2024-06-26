import months from '../constants/months';

const calculateMonthlyAverages = (activities, monthsToInclude) => {
    if (!activities || !activities.length) return {};

    const monthlyData = {};

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const lastMonths = [];
    for (let i = 0; i < monthsToInclude; i++) {
        const month = (currentMonth - i) % 12;
        const year = currentYear - Math.floor((currentMonth - i) / 12);
        lastMonths.push(`${year}-${months[month]}`);
    }

    activities.forEach((activity) => {
        const activityDate = new Date(activity.date);
        const month = activityDate.getMonth();
        const year = activityDate.getFullYear();
        const monthKey = `${year}-${months[month]}`;

        if (!lastMonths.includes(monthKey)) return;

        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
                count: 0,
                distance: 0,
                total_time: 0,
                average_heart_rate: 0,
                max_heart_rate: 0,
                average_pace: 0,
                calories: 0,
                average_speed: 0,
                average_cadence: 0,
                max_cadence: 0,
                min_height: Infinity,
                max_height: -Infinity,
                average_temperature: 0,
            };
        }

        monthlyData[monthKey].count++;
        monthlyData[monthKey].distance += parseFloat(activity.distance);
        monthlyData[monthKey].total_time += parseFloat(activity.total_time);
        monthlyData[monthKey].average_heart_rate += parseFloat(
            activity.average_heart_rate
        );
        monthlyData[monthKey].max_heart_rate += parseFloat(
            activity.max_heart_rate
        );
        monthlyData[monthKey].average_pace += parseFloat(activity.average_pace);
        monthlyData[monthKey].calories += parseFloat(activity.calories);
        monthlyData[monthKey].average_speed += parseFloat(
            activity.average_speed
        );
        monthlyData[monthKey].average_cadence += parseFloat(
            activity.average_cadence
        );
        monthlyData[monthKey].max_cadence += parseFloat(activity.max_cadence);
        monthlyData[monthKey].min_height = Math.min(
            monthlyData[monthKey].min_height,
            parseFloat(activity.min_height)
        );
        monthlyData[monthKey].max_height = Math.max(
            monthlyData[monthKey].max_height,
            parseFloat(activity.max_height)
        );
        monthlyData[monthKey].average_temperature += parseFloat(
            activity.average_temperature
        );
    });

    for (const monthKey in monthlyData) {
        const monthData = monthlyData[monthKey];
        for (const property in monthData) {
            if (property !== 'count') {
                monthData[property] = monthData[property] / monthData.count;
            }
        }
    }

    return Object.values(monthlyData);
};

export default calculateMonthlyAverages;
