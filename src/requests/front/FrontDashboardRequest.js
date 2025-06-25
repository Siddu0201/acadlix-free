import { useMutation, useQuery } from "@tanstack/react-query";
import { handleMutationError, handleQueryError, useInstance } from "../../helpers/util";


const base = "/front-dashboard";

export const GetUserOrders = (user_id = 0, page = 1, pageSize = 10, search = '' ) => {
    const instance = useInstance();
    const result = useQuery({
        queryKey: ["getUserOrders", user_id, page, pageSize, search],
        queryFn: () => {
            return instance.get(`${base}/get-user-orders`, {
                params: {
                    user_id: user_id,
                    page: page,
                    pageSize: pageSize,
                    search: search,
                    _t: Date.now(),
                },
                headers: { 
                    'X-WP-Nonce': acadlixOptions.nonce 
                },
            });
        }
    });
    handleQueryError(result);
    return result;
}

export const GetUserOrderById = (order_item_id = 0, user_id = 0) => {
    const instance = useInstance();
    const result = useQuery({
        queryKey: ["getUserOrderById", order_item_id, user_id],
        queryFn: () => {
            return instance.get(`${base}/get-user-order-by-id`, {
                params: {
                    order_item_id: order_item_id,
                    user_id: user_id,
                    _t: Date.now(),
                },
                headers: { 
                    'X-WP-Nonce': acadlixOptions.nonce 
                },
            });
        }
    });
    handleQueryError(result);
    return result;
}

export const PostUpdateLessonTime = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/post-update-lesson-time`, data, {
                headers: { 
                    'X-WP-Nonce': acadlixOptions.nonce 
                },
            });
        },
        onError: (error) => {
            handleMutationError(error);
        }
    })
}

export const PostSetActive = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/post-set-active`, data, {
                headers: { 
                    'X-WP-Nonce': acadlixOptions.nonce 
                },
            });
        },
        onError: (error) => {
            handleMutationError(error);
        }
    })
}

export const PostMarkAsComplete = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/post-mark-as-complete`, data, {
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

export const PostMarkAsIncomplete = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/post-mark-as-incomplete`, data, {
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

export const PostUploadAssignmentFile = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(
                `${base}/post-upload-assignment-file`,
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-WP-Nonce': acadlixOptions.nonce 
                    }
                }
            );
        },
        onError: (error) => {
            handleMutationError(error);
        }
    });
}

export const PostDeleteAssignmentFile = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/post-delete-assignment-file`, data, {
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

export const PostSubmitAssignment = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/post-submit-assignment`, data, {
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


export const GetUserPurchases = (user_id = 0, page = 1, pageSize = 10 ) => {
    const instance = useInstance();
    const result = useQuery({
        queryKey: ["getUserPurchases", user_id, page, pageSize],
        queryFn: () => {
            return instance.get(`${base}/get-user-purchases`, {
                params: {
                    user_id: user_id,
                    page: page,
                    pageSize: pageSize,
                    _t: Date.now(),
                },
                headers: { 
                    'X-WP-Nonce': acadlixOptions.nonce 
                },
            });
        }
    });
    handleQueryError(result);
    return result;
}

export const GetUserProfile = (user_id = 0 ) => {
    const instance = useInstance();
    const result = useQuery({
        queryKey: ["getUserProfile", user_id],
        queryFn: () => {
            return instance.get(`${base}/get-user-profile`, {
                params: {
                    user_id: user_id,
                    _t: Date.now(),
                },
                headers: { 
                    'X-WP-Nonce': acadlixOptions.nonce 
                },
            });
        }
    });
    handleQueryError(result);
    return result;
}

export const PostUpdateUserProfile = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/post-update-user-profile`, data, {
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

export const PostUpdateUserPhoto = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/post-update-user-photo`, data, {
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