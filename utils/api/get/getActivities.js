import fetchApi from "../../constants/fetchApi";
import activities from "../../fakeData/activities";

export default async function getActivities(user_id) {
    try {
        const { data } = await fetchApi.get(`/activities/getAllWithoutArray/${user_id}`);
        return data;
    } catch (error) {
        return {
            error: true,
            data: error,
        };
    }
}
