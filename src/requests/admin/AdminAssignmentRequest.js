import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useInstance } from "../../helpers/util";
import toast from "react-hot-toast";
import { __ } from "@wordpress/i18n";

const base = "/admin-assignment";

export const GetAssignments = (page = 0, pageSize = 10, search = '') => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getAssignments", page, pageSize, search],
        queryFn: () => {
            return instance.get(base, {
                params: {
                    page: page,
                    pageSize: pageSize,
                    search: search
                }
            });
        }
    });
}

export const PostCreateAssignment = () => {
    const instance = useInstance();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(base, data);
        },
        onSuccess: () => {
            toast.success(__('Assignment successfully created.', 'acadlix'));
            queryClient.invalidateQueries({
                queryKey: ["getAssignments"]
            });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
        }
    })
}

export const GetAssignmentById = (assignment_id = '') => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getAssignmentById", assignment_id],
        queryFn: () => {
            if (!assignment_id) return {};
            return instance.get(`${base}/${assignment_id}`);
        }
    });
}

export const UpdateAssignmentById = (assignment_id = '') => {
    const instance = useInstance();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => {
            return instance.put(`${base}/${assignment_id}`, data);
        },
        onSuccess: () => {
            toast.success(__('Assignment successfully updated.', 'acadlix'));
            queryClient.invalidateQueries({
                queryKey: ["getAssignments"]
            });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
        }
    })
}

export const GetAssignmentSubmissionsById = (assignment_id = '') => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getAssignmentSubmissionsById", assignment_id],
        queryFn: () => {
            if (!assignment_id) return {};
            return instance.get(`${base}/${assignment_id}/submissions`);
        }
    });
}

export const GetEvaluationAssignment = (assignment_id = '', course_statistic_id = '') => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getEvaluationAssignment", assignment_id, course_statistic_id],
        queryFn: () => {
            if (!assignment_id || !course_statistic_id) return {};
            return instance.get(`${base}/${assignment_id}/evaluation/${course_statistic_id}`);
        }
    });
}

export const PostEvaluateAssignment = (assignment_id = '', course_statistics_id = '') => {
    const instance = useInstance();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/${assignment_id}/evaluation/${course_statistics_id}`, data);
        },
        onSuccess: (data) => {
            toast.success(data?.data?.message);
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
        }
    })
}

export const DeleteAssignmentById = () => {
    const instance = useInstance();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (assignment_id = '') => {
            return instance.delete(`${base}/${assignment_id}`, {
                headers: {
                    'X-WP-Nonce': acadlixOptions?.nonce,
                }
            });
        },
        onSuccess: (data) => {
            toast.success(data?.data?.message);
            queryClient.invalidateQueries({
                queryKey: ["getAssignments"]
            });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
        }
    })
}

export const DeleteBulkAssignment = () => {
    const instance = useInstance();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => {
            return instance.delete(`${base}/delete-bulk-assignment`, {
                headers: {
                    'X-WP-Nonce': acadlixOptions?.nonce,
                },
                data: data
            });
        },
        onSuccess: (data) => {
            toast.success(data?.data?.message);
            queryClient.invalidateQueries({
                queryKey: ["getAssignments"]
            });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
        }
    });
}