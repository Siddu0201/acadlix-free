import { useInstance } from "@acadlix/helpers/util";
import { useQuery } from "@tanstack/react-query";


const base = "/admin-student";

export const GetStudents = (page = 0, pageSize = 10, search = '') => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getStudents", page, pageSize, search],
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