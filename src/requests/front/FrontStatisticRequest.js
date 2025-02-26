import { useQuery } from "@tanstack/react-query";
import { useInstance } from "../../helpers/util";

const base = "/front-statistic";

export const GetStatisticByUserId = (user_id = '', page = 0, pageSize = 10) => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getStatisticByUserId", user_id, page, pageSize],
        queryFn: () => {
            return instance.get(`${base}/${user_id}`, {
                params: {
                    page: page,
                    pageSize: pageSize
                }
            });
        }
    });
}

export const GetStatisticByStatisticId = (statistic_id = '') => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getStatisticByStatisticId", statistic_id],
        queryFn: () => {
            return instance.get(`${base}/${statistic_id}/statistic`);
        }
    });
}