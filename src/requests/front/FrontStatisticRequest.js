import { useQuery } from "@tanstack/react-query";
import { useInstance } from "@acadlix/helpers/util";

const base = "/front-statistic";

export const GetStatisticByUserId = (user_id = '', page = 0, pageSize = 10, search = '', categoryIds = []) => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getStatisticByUserId", user_id, page, pageSize, search, categoryIds],
        queryFn: () => {
            return instance.get(`${base}`, {
                params: {
                    user_id: user_id,
                    page: page,
                    pageSize: pageSize,
                    search: search,
                    category_ids: categoryIds,
                    _t: Date.now(),
                },
                headers: {
                    "X-WP-Nonce": acadlixOptions?.nonce,
                },
            });
        }
    });
}

export const GetStatisticByStatisticId = (statistic_id = '') => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getStatisticByStatisticId", statistic_id],
        queryFn: () => {
            return instance.get(`${base}/${statistic_id}/statistic`, {
                params: {
                    user_id: acadlixOptions?.user?.ID,
                    _t: Date.now(),
                },
                headers: {
                    "X-WP-Nonce": acadlixOptions?.nonce,
                },
            });
        }
    });
}