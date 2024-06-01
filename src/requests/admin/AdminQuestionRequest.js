import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useInstance } from "../../helpers/util"
import toast from "react-hot-toast";

const base = "/admin-quiz";

export const GetQuizQuestion = (quiz_id = '', page = 0, pageSize = 10) => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getQuizQuestion", quiz_id, page, pageSize],
        queryFn: () => {
            return instance.get(`${base}/${quiz_id}/question`, {
                params: {
                    page: page,
                    pageSize: pageSize
                }
            });
        }
    });
}

export const GetCreateQuizQuestion = (quiz_id = '') => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getCreateQuizQuestion", quiz_id],
        queryFn: () => {
            return instance.get(`${base}/${quiz_id}/question/create`);
        }
    });
}

export const PostCreateQuizQuestion = (quiz_id = '') => {
    const instance = useInstance();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/${quiz_id}/question`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["getQuizQuestion"]
            });
        }
    });
}

export const GetQuizQuestionById = (quiz_id = '', question_id = '') => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getQuizQuestionById", quiz_id, question_id],
        queryFn: () => {
            return instance.get(`${base}/${quiz_id}/question/${question_id}`);
        }
    })
}

export const UpdateQuizQuestionById = (quiz_id = '', question_id = '') => {
    const instance = useInstance();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/${quiz_id}/question/${question_id}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["getQuizQuestion"]
            });
        }
    })
}

export const DeleteQuizQuestionById = (quiz_id = '') => {
    const instance = useInstance();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (question_id = '') => {
            return instance.delete(`${base}/${quiz_id}/question/${question_id}`, {
                headers: {
                    'X-WP-Nonce': acadlixOptions?.nonce,
                }
            });
        },
        onSuccess: (data) => {
            toast.success('Question successfully deleted.');
            queryClient.invalidateQueries({
                queryKey: ["getQuizQuestion"]
            });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
        }
    })
}