import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useInstance } from "@acadlix/helpers/util"
import toast from "react-hot-toast";

const base = "/admin-subject";

export const GetSubjects = () => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getSubjects"],
        queryFn: () => {
            return instance.get(base, {
                params: {
                    _t: Date.now(),
                },
                headers: {
                    "X-WP-Nonce": acadlixOptions?.nonce,
                }
            });
        }
    })
}

export const PostCreateSubject = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(base, data, {
                headers: {
                    "X-WP-Nonce": acadlixOptions?.nonce,
                }
            });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
            console.error(error);
        }
    });
}