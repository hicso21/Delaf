export default function zoneGraphData(graphData, userAge) {
    const MHR = 208 - 0.7 * userAge;
    const zoneTime = [0, 0, 0, 0, 0];
    graphData.map((data) => {
        const maxHeartRateOfRoutine = data.max_heart_rate;
        const totalTime = data.total_time;
        const percentaje = Math.floor((maxHeartRateOfRoutine / MHR) * 100);
        if (percentaje < 60) zoneTime[0] += totalTime; // zona 1
        else if (percentaje < 70) zoneTime[1] += totalTime; // zona 2
        else if (percentaje < 80) zoneTime[2] += totalTime; // zona 3
        else if (percentaje < 90) zoneTime[3] += totalTime; // zona 4
        else zoneTime[4] += totalTime; // zona 5
    });
    return zoneTime;
}
