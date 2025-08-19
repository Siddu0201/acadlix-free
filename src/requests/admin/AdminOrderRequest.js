import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useInstance } from "@acadlix/helpers/util";
import toast from "react-hot-toast";

const base = "/admin-order";

export const GetOrders = (
    page = 0,
    pageSize = 10,
    search = '',
    status = '',
    payment_method = ''
) => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getOrders", page, pageSize, search, status, payment_method],
        queryFn: () => {
            return instance.get(`${base}`, {
                params: {
                    page: page,
                    pageSize: pageSize,
                    search: search,
                    status: status,
                    payment_method: payment_method,
                    _t: Date.now(),
                },
                headers: {
                    "X-WP-Nonce": acadlixOptions?.nonce,
                }
            });
        }
    });
}

export const GetOrderCourses = (search = '') => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getOrderCourses", search],
        queryFn: () => {
            if (search.length < 3) return [];
            return instance.get(`${base}/courses`, {
                params: {
                    search: search,
                    _t: Date.now(),
                },
                headers: {
                    "X-WP-Nonce": acadlixOptions?.nonce,
                }
            });
        },
        enabled: search.length >= 3
    });
}

export const GetOrderUsers = (search = '') => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getOrderUsers", search],
        queryFn: () => {
            if (search.length < 3) return [];
            return instance.get(`${base}/users`, {
                params: {
                    search: search,
                    _t: Date.now(),
                },
                headers: {
                    "X-WP-Nonce": acadlixOptions?.nonce,
                }
            });
        },
        enabled: search.length >= 3
    });
}

export const GetCreateOrder = () => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getCreateOrder"],
        queryFn: () => {
            return instance.get(`${base}/create`,
                {
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

export const PostCreateOrder = () => {
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
        }
    });
}


export const GetOrderById = (order_id = '') => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getOrderById", order_id],
        queryFn: () => {
            return instance.get(`${base}/${order_id}`, {
                headers: {
                    "X-WP-Nonce": acadlixOptions?.nonce,
                }
            });
        }
    });
}

export const UpdateOrderById = (order_id = '') => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.put(`${base}/${order_id}`, data, {
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

export const DeleteOrderById = () => {
    const instance = useInstance();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (order_id = '') => {
            return instance.delete(`${base}/${order_id}`, {
                headers: {
                    'X-WP-Nonce': acadlixOptions?.nonce,
                }
            });
        },
        onSuccess: (data) => {
            toast.success(data?.data?.message);
            queryClient.invalidateQueries({
                queryKey: ["getOrders"]
            });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
        }
    });
}