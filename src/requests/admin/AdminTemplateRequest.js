import { useMutation, useQuery } from "@tanstack/react-query";
import { useInstance } from "@acadlix/helpers/util";
import toast from "react-hot-toast";

const base = "/admin-template";

export const GetTemplates = (type) => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getTemplates", type],
        queryFn: () => {
            return instance.get(base, {
                params: {
                    type: type,
                    _t: Date.now(),
                },
                headers: {
                    "X-WP-Nonce": acadlixOptions?.nonce,
                }
            });
        }
    });
}

export const PostSaveTemplate = () => {
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

export const GetTemplateById = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (id) => {
            return instance.get(`${base}/${id}`, {
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