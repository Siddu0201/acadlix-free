import { useMutation, useQuery } from "@tanstack/react-query";
import { useInstance } from "../../helpers/util";


const base = "/front-dashboard";

export const GetUserOrders = (user_id = 0, page = 1, pageSize = 10 ) => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getUserOrders", user_id, page, pageSize],
        queryFn: () => {
            return instance.get(`${base}/get-user-orders`, {
                params: {
                    user_id: user_id,
                    page: page,
                    pageSize: pageSize,
                }
            });
        }
    })
}

export const GetUserOrderById = (order_item_id = 0, user_id = 0) => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getUserOrderById", order_item_id, user_id],
        queryFn: () => {
            return instance.get(`${base}/get-user-order-by-id`, {
                params: {
                    order_item_id: order_item_id,
                    user_id: user_id
                }
            });
        }
    });
}

export const PostUpdateLessonTime = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/post-update-lesson-time`, data);
        }
    })
}

export const PostSetActive = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/post-set-active`, data);
        }
    })
}

export const PostMarkAsComplete = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/post-mark-as-complete`, data);
        }
    });
}

export const PostMarkAsIncomplete = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/post-mark-as-incomplete`, data);
        }
    });
}


export const GetUserPurchases = (user_id = 0, page = 1, pageSize = 10 ) => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getUserPurchases", user_id, page, pageSize],
        queryFn: () => {
            return instance.get(`${base}/get-user-purchases`, {
                params: {
                    user_id: user_id,
                    page: page,
                    pageSize: pageSize,
                }
            });
        }
    })
}

export const GetUserProfile = (user_id = 0 ) => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getUserProfile", user_id],
        queryFn: () => {
            return instance.get(`${base}/get-user-profile`, {
                params: {
                    user_id: user_id,
                }
            });
        }
    })
}

export const PostUpdateUserProfile = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/post-update-user-profile`, data);
        }
    })
}

export const PostUpdateUserPhoto = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/post-update-user-photo`, data);
        }
    })
}