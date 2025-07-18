import { useInstance } from "@acadlix/helpers/util";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

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
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(base, data)
        },
        onSuccess: (data) => {
            toast.success(data?.data?.message);
            queryClient.invalidateQueries({
                queryKey: ["getAddons"]
            });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
        }
    })
}