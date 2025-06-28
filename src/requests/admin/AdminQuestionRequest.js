import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useInstance } from "@acadlix/helpers/util"
import toast from "react-hot-toast";
import { __ } from "@wordpress/i18n";

const base = "/admin-quiz";

export const GetQuizQuestion = (quiz_id = '', page = 0, pageSize = 10, search = '') => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getQuizQuestion", quiz_id, page, pageSize, search],
        queryFn: () => {
            return instance.get(`${base}/${quiz_id}/question`, {
                params: {
                    page: page,
                    pageSize: pageSize,
                    search: search,
                    _t: Date.now(),
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
            return instance.get(`${base}/${quiz_id}/question/create`, {
                params: {
                    _t: Date.now(),
                }
            });
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
            return instance.get(`${base}/${quiz_id}/question/${question_id}`, {
                params: {
                    _t: Date.now(),
                }
            });
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
            toast.success(__('Question successfully deleted.', 'acadlix'));
            queryClient.invalidateQueries({
                queryKey: ["getQuizQuestion"]
            });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
        }
    });
}

export const PostSetSubjectAndPoint = (quiz_id = '') => {
    const instance = useInstance();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/${quiz_id}/question/set-subject-and-point`, data);
        },
        onSuccess: () => {
            toast.success(__('Subject and points updated successfully.', 'acadlix'));
            queryClient.invalidateQueries({
                queryKey: ["getQuizQuestion"]
            });
        },
    })
}

export const PostSetParagraph = (quiz_id = '') => {
    const instance = useInstance();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/${quiz_id}/question/set-paragraph`, data);
        },
        onSuccess: () => {
            toast.success(__('Paragraph updated successfully.', 'acadlix'));
            queryClient.invalidateQueries({
                queryKey: ["getQuizQuestion"]
            });
        },
    })
}


export const DeleteBulkQuestion= (quiz_id = '') => {
    const instance = useInstance();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => {
            return instance.delete(`${base}/${quiz_id}/question/delete-bulk-question`, {
                headers: {
                    'X-WP-Nonce': acadlixOptions?.nonce,
                },
                data: data
            });
        },
        onSuccess: () => {
            toast.success(__('Questions deleted successfully', 'acadlix'));
            queryClient.invalidateQueries({
                queryKey: ["getQuizQuestion"]
            });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
        }
    });
}