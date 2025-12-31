import { handleMutationError, useInstance } from "@acadlix/helpers/util";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const base = "/front-course";

export const PostBuyNow = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/buy-now`, data, {
                headers: {
                    'X-WP-Nonce': acadlixOptions.nonce
                },
            });
        },
        onError: (error) => {
            handleMutationError(error);
        }
    });
}

export const PostStartNow = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/start-now`, data, {
                headers: {
                    'X-WP-Nonce': acadlixOptions.nonce
                },
            });
        },
        onError: (error) => {
            handleMutationError(error);
        }
    });
}

export const PostAddWishlist = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/add-wishlist`, data, {
                headers: {
                    'X-WP-Nonce': acadlixOptions.nonce
                },
            });
        },
        onError: (error) => {
            handleMutationError(error);
        }
    });
}

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

export const PostSubmitReview = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/submit-review`, data, {
                headers: {
                    'X-WP-Nonce': acadlixOptions.nonce
                },
            });
        },
        onError: (error) => {
            handleMutationError(error);
        }
    });
}

export const PostLoadMoreReviews = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/load-more-reviews`, data, {
                headers: {
                    'X-WP-Nonce': acadlixOptions.nonce
                },
            });
        },
        onError: (error) => {
            handleMutationError(error);
        }
    });
}