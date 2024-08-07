import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useInstance } from "../../helpers/util"
import toast from "react-hot-toast";

const base = "/admin-quiz";

export const GetQuizes = (page = 0, pageSize = 10) => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getQuizes", page, pageSize],
        queryFn: () => {
            return instance.get(base, {
                params: {
                    page: page,
                    pageSize: pageSize
                }
            });
        }
    });
}

export const GetCreateQuiz = () => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getCreateQuiz"],
        queryFn: () => {
            return instance.get(`${base}/create`);
        }
    });
}

export const PostCreateQuiz = () => {
    const instance = useInstance();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(base, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["getQuizes"]
            });
        }
    });
}

export const GetQuizById = (quiz_id = '') => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getQuizById", quiz_id],
        queryFn: () => {
            return instance.get(`${base}/${quiz_id}`);
        }
    })
}

export const UpdateQuizById = (quiz_id = '') => {
    const instance = useInstance();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/${quiz_id}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["getQuizes"]
            });
        }
    })
}

export const DeleteQuizById = () => {
    const instance = useInstance();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (quiz_id = '') => {
            return instance.delete(`${base}/${quiz_id}`, {
                headers: {
                    'X-WP-Nonce': acadlixOptions?.nonce,
                }
            });
        },
        onSuccess: (data) => {
            toast.success('Quiz successfully deleted.');
            queryClient.invalidateQueries({
                queryKey: ["getQuizes"]
            });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
        }
    })
}

export const DeleteBulkQuiz = () => {
    const instance = useInstance();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => {
            return instance.delete(`${base}/delete-bulk-quiz`, {
                headers: {
                    'X-WP-Nonce': acadlixOptions?.nonce,
                },
                data: data
            });
        },
        onSuccess: () => {
            toast.success('Quizzes deleted successfully');
            queryClient.invalidateQueries({
                queryKey: ["getQuizes"]
            });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
        }
    });
}

export const PostSetCategory = () => {
    const instance = useInstance();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/set-category`, data);
        },
        onSuccess: () => {
            toast.success('Category updated successfully.');
            queryClient.invalidateQueries({
                queryKey: ["getQuizes"]
            });
        },
    })
}

export const GetSubjectByQuizId = (quiz_id) => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getSubjectByQuizId", quiz_id],
        queryFn: () => {
            return instance.get(`${base}/${quiz_id}/get-subject-by-quiz-id`);
        }
    });
}

export const PostSetSubjectWiseTime = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/update-quiz-subject`, data);
        }
    })
}