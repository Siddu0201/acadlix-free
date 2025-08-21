import { useMutation, useQuery } from "@tanstack/react-query";
import { useInstance } from "@acadlix/helpers/util"
import toast from "react-hot-toast";

const base = "/admin-language";

export const GetLanguages = () => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getLanguages"],
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
    });
}

export const PostCreateLanguage = () => {
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

export const UpdateLanguageById = (id) => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/${id}`, data, {
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

export const DefaultLanguageById = (id) => {
    const instance = useInstance();
    return useMutation({
        mutationFn: () => {
            return instance.post(`${base}/default-language/${id}`, {}, {
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

export const DeleteLanguageById = (id) => {
    const instance = useInstance();
    return useMutation({
        mutationFn: () => {
            return instance.delete(`${base}/${id}`, {
                headers: {
                    "X-WP-Nonce": acadlixOptions?.nonce,
                },
            });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
            console.error(error);
        }
    });
}