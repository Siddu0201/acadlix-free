import { useMutation, useQuery } from "@tanstack/react-query";
import { useInstance } from "@acadlix/helpers/util"

const base = "/admin-category";

export const GetCategories = () => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getCategories"],
        queryFn: () => {
            return instance.get(base, {
                params: {
                    _t: Date.now(),
                }
            });
        }
    });
}

export const PostCreateCategory = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(base, data);
        }
    });
}

export const UpdateCategoryById = (id) => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/${id}`, data);
        }
    });
}

export const DeleteCategoryById = (id) => {
    const instance = useInstance();
    return useMutation({
        mutationFn: () => {
            return instance.delete(`${base}/${id}`, {
                headers: {
                    "X-WP-Nonce": acadlixOptions?.nonce,
                },
            });
        }
    });
}