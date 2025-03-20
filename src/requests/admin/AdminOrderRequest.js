import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useInstance } from "../../helpers/util";
import toast from "react-hot-toast";

const base = "/admin-order";

export const GetOrders = (page = 0, pageSize = 10, search = '') => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getOrders", page, pageSize, search],
        queryFn: () => {
            return instance.get(`${base}`, {
                params: {
                    page: page,
                    pageSize: pageSize,
                    search: search
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
                    search: search
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
                    search: search
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
            return instance.get(`${base}/create`);
        }
    });
}

export const PostCreateOrder = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}`, data);
        }
    });
}


export const GetOrderById = (order_id = '') => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getOrderById", order_id],
        queryFn: () => {
            return instance.get(`${base}/${order_id}`);
        }
    });
}

export const UpdateOrderById = (order_id = '') => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.put(`${base}/${order_id}`, data);
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