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
        onSuccess: () => {
            toast.success(__('Assignment successfully deleted.', 'acadlix'));
            queryClient.invalidateQueries({
                queryKey: ["getAssignments"]
            });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
        }
    })
}