import { useQuery } from "@tanstack/react-query";
import { useInstance } from "../../helpers/util"

const base = "/admin-home";

export const GetHomeData = () => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getHomeData"],
        queryFn: () => {
            return instance.get(`${base}`, {
                params: {
                    _t: Date.now(),
                }
            });
        }
    });
}