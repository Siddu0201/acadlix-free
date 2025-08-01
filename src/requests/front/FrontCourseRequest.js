import { handleMutationError, useInstance } from "@acadlix/helpers/util";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const base = "/front-course";

export const PostRemoveWishlist = () => {
    const instance = useInstance();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => {
            return instance.delete(`${base}/remove-wishlist`, {
                data: data,
                headers: { 
                    'X-WP-Nonce': acadlixOptions.nonce 
                },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["getUserWishlist"]
            });
        },
        onError: (error) => {
            handleMutationError(error);
        }
    });
}