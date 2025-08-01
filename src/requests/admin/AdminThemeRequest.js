import { useInstance } from "@acadlix/helpers/util";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const base = "/admin-theme";

export const PostUpdateTheme = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}`, data, {
                headers: {
                    "X-WP-Nonce": acadlixOptions?.nonce,
                }
            });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
            console.error(error);
        },
    });
}
