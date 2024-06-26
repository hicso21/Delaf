export default function averageStats(stats, totalMonths) {
    const monthsStats = {};
    stats.map((item) => {
        const month = item.date.split('/')[0];
        if (!monthsStats[month]) monthsStats[month] = [];
        monthsStats[month].push(item);
    });

    const res = Object.keys(monthsStats)
        .map((key) => {
            const monthStatsLength = monthsStats[key].length;
            let averageData = {
                _id: key,
                user_id: '',
                title: '',
                date: '',
                timestamp: '',
                distance: 0,
                total_time: 0,
                average_heart_rate: 0,
                max_heart_rate: 0,
                resting_heart_rate: 0,
                average_pace: 0,
                calories: 0,
                training_load: 0,
                positive_slope: 0,
                negative_slope: 0,
                average_speed: 0,
                average_cadence: 0,
                max_cadence: 0,
                min_height: 0,
                max_height: 0,
                estimated_liquid_loss: 0,
                average_temperature: 0,
                paces: [],
                triathlonData: [],
                description: '',
            };
            monthsStats[key].map((item) => {
                if (parseInt(item.distance))
                    averageData.distance += parseInt(item.distance);
                if (parseInt(item.total_time))
                    averageData.total_time += parseInt(item.total_time);
                if (parseInt(item.average_heart_rate))
                    averageData.average_heart_rate += parseInt(
                        item.average_heart_rate
                    );
                if (parseInt(item.max_heart_rate))
                    averageData.max_heart_rate += parseInt(item.max_heart_rate);
                if (parseInt(item.resting_heart_rate))
                    averageData.resting_heart_rate += parseInt(
                        item.resting_heart_rate
                    );
                if (parseInt(item.average_pace))
                    averageData.average_pace += parseInt(item.average_pace);
                if (parseInt(item.calories))
                    averageData.calories += parseInt(item.calories);
                if (parseInt(item.training_load))
                    averageData.training_load += parseInt(item.training_load);
                if (parseInt(item.positive_slope))
                    averageData.positive_slope += parseInt(item.positive_slope);
                if (parseInt(item.negative_slope))
                    averageData.negative_slope += parseInt(item.negative_slope);
                if (parseInt(item.average_speed))
                    averageData.average_speed += parseInt(item.average_speed);
                if (parseInt(item.average_cadence))
                    averageData.average_cadence += parseInt(
                        item.average_cadence
                    );
                if (parseInt(item.max_cadence))
                    averageData.max_cadence += parseInt(item.max_cadence);
                if (parseInt(item.min_height))
                    averageData.min_height += parseInt(item.min_height);
                if (parseInt(item.max_height))
                    averageData.max_height += parseInt(item.max_height);
                if (parseInt(item.estimated_liquid_loss))
                    averageData.estimated_liquid_loss += parseInt(
                        item.estimated_liquid_loss
                    );
                if (parseInt(item.average_temperature))
                    averageData.average_temperature += parseInt(
                        item.average_temperature
                    );
            });
            averageData = {
                ...averageData,
                distance: averageData.distance / monthStatsLength,
                total_time: averageData.total_time / monthStatsLength,
                average_heart_rate:
                    averageData.average_heart_rate / monthStatsLength,
                max_heart_rate: averageData.max_heart_rate / monthStatsLength,
                resting_heart_rate:
                    averageData.resting_heart_rate / monthStatsLength,
                average_pace: averageData.average_pace / monthStatsLength,
                calories: averageData.calories / monthStatsLength,
                training_load: averageData.training_load / monthStatsLength,
                positive_slope: averageData.positive_slope / monthStatsLength,
                negative_slope: averageData.negative_slope / monthStatsLength,
                average_speed: averageData.average_speed / monthStatsLength,
                average_cadence: averageData.average_cadence / monthStatsLength,
                max_cadence: averageData.max_cadence / monthStatsLength,
                min_height: averageData.min_height / monthStatsLength,
                max_height: averageData.max_height / monthStatsLength,
                estimated_liquid_loss:
                    averageData.estimated_liquid_loss / monthStatsLength,
                average_temperature:
                    averageData.average_temperature / monthStatsLength,
            };
            return averageData;
        })
        .reverse();

    const actualMonth = new Date().getMonth() + 1;

    const indexOfThisMonth = res.findIndex((item) => item._id == actualMonth);

    const orderedItems = res
        .slice(indexOfThisMonth)
        .concat(res.slice(0, indexOfThisMonth));

    return orderedItems.slice(0, totalMonths).reverse();
}
