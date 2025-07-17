import { useInstance } from "@acadlix/helpers/util";
import { useMutation, useQuery } from "@tanstack/react-query";

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

export const PostUpdateInternalAddon = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(base, data)
        },
        onSuccess: (data) => {
            toast.success(data?.data?.message);
            window?.location?.reload();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
        }
    })
}