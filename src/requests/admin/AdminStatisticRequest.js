import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useInstance } from "@acadlix/helpers/util";
import toast from "react-hot-toast";
import { __ } from "@wordpress/i18n";

const base = "/admin-statistic";

export const GetStatisticByQuizId = (quiz_id = '', page = 0, pageSize = 10, search = '') => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getStatisticByQuizId", quiz_id, page, pageSize, search],
        queryFn: () => {
            return instance.get(`${base}/${quiz_id}`, {
                params: {
                    page: page,
                    pageSize: pageSize,
                    search: search,
                    _t: Date.now(),
                },
                headers: {
                    "X-WP-Nonce": acadlixOptions?.nonce,
                }
            });
        }
    });
}

export const PostResetStatisticByQuizId = (quiz_id = 0) => {
    const instance = useInstance();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => {
            return instance.post(`${base}/${quiz_id}/reset-statistic`, {
                headers: {
                    "X-WP-Nonce": acadlixOptions?.nonce,
                }
            });
        },
        onSuccess: () => {
            toast.success(__('Statistic successfully reset.', 'acadlix'));
            queryClient.invalidateQueries({
                queryKey: ["getStatisticByQuizId"]
            });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
            console.error(error);
        }
    });
}

export const DeleteStatisticById = () => {
    const instance = useInstance();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (statistic_ref_id = '') => {
            return instance.delete(`${base}/${statistic_ref_id}`, {
                headers: {
                    'X-WP-Nonce': acadlixOptions?.nonce,
                }
            });
        },
        onSuccess: () => {
            toast.success(__('Result successfully deleted.', 'acadlix'));
            queryClient.invalidateQueries({
                queryKey: ["getStatisticByQuizId"]
            });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
            console.error(error);
        }
    });
}

export const GetStatisticById = (quiz_id = '', statistic_ref_id = '') => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getStatisticById", quiz_id, statistic_ref_id],
        queryFn: () => {
            return instance.get(`${base}/${quiz_id}/answersheet/${statistic_ref_id}`, {
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
