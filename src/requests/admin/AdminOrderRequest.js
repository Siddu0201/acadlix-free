import { useQuery } from "@tanstack/react-query";
import { useInstance } from "../../helpers/util";

const base = "/admin-order";

export const GetOrders = (page = 0, pageSize = 10) => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getOrders", page, pageSize],
        queryFn: () => {
            return instance.get(`${base}`, {
                params: {
                    page: page,
                    pageSize: pageSize
                }
            });
        }
    });
}