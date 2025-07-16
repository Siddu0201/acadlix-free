import { useInstance } from "@acadlix/helpers/util";
import { useQuery } from "@tanstack/react-query";

const base = "/admin-addon";

export const GetAddons = () => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getAddons"],
        queryFn: () => {
            return instance.get(base, {
                params: {
                    _t: Date.now(),
                }
            })
        }
    })
}