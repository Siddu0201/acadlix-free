import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useInstance } from "@acadlix/helpers/util";
import toast from "react-hot-toast";
import { __ } from "@wordpress/i18n";

const base = "/admin-lesson";

export const GetLessons = (page = 0, pageSize = 10, search = '') => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getLessons", page, pageSize, search],
        queryFn: () => {
            return instance.get(base, {
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

export const PostCreateLesson = () => {
    const instance = useInstance();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(base, data, {
                headers: {
                    "X-WP-Nonce": acadlixOptions?.nonce,
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["getLessons"]
            });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
            console.error(error);
        }
    });
}

export const GetLessonById = (lesson_id = '') => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getLessonById", lesson_id],
        queryFn: () => {
            if (!lesson_id) return {};
            return instance.get(`${base}/${lesson_id}`, {
                params: {
                    _t: Date.now(),
                },
                headers: {
                    "X-WP-Nonce": acadlixOptions?.nonce,
                }
            });
        }
    })
}

export const UpdateLessonById = (lesson_id = '') => {
    const instance = useInstance();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/${lesson_id}`, data, {
                headers: {
                    "X-WP-Nonce": acadlixOptions?.nonce,
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["getLessons"]
            });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
            console.error(error);
        }
    })
}

export const DeleteLessonById = () => {
    const instance = useInstance();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (lesson_id = '') => {
            return instance.delete(`${base}/${lesson_id}`, {
                headers: {
                    'X-WP-Nonce': acadlixOptions?.nonce,
                }
            });
        },
        onSuccess: (data) => {
            toast.success(__('Lesson successfully deleted.', 'acadlix'));
            queryClient.invalidateQueries({
                queryKey: ["getLessons"]
            });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
            console.error(error);
        }
    })
}

export const DeleteBulkLesson = () => {
    const instance = useInstance();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => {
            return instance.delete(`${base}/delete-bulk-lesson`, {
                headers: {
                    'X-WP-Nonce': acadlixOptions?.nonce,
                },
                data: data
            });
        },
        onSuccess: () => {
            toast.success(__('Lessons deleted successfully', 'acadlix'));
            queryClient.invalidateQueries({
                queryKey: ["getLessons"]
            });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
            console.error(error);
        }
    });
}
