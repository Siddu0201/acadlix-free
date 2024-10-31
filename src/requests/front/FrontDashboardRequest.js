import { useMutation, useQuery } from "@tanstack/react-query";
import { useInstance } from "../../helpers/util";


const base = "/front-dashboard";

export const GetUserCourses = (user_id = 0, page = 1, pageSize = 10 ) => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getUserCourses", user_id, page, pageSize],
        queryFn: () => {
            return instance.get(`${base}/get-user-courses`, {
                params: {
                    user_id: user_id,
                    page: page,
                    pageSize: pageSize,
                }
            });
        }
    })
}

export const GetUserPurchases = (user_id = 0, page = 1, pageSize = 10 ) => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getUserPurchases", user_id, page, pageSize],
        queryFn: () => {
            return instance.get(`${base}/get-user-purchases`, {
                params: {
                    user_id: user_id,
                    page: page,
                    pageSize: pageSize,
                }
            });
        }
    })
}

export const GetUserProfile = (user_id = 0 ) => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getUserProfile", user_id],
        queryFn: () => {
            return instance.get(`${base}/get-user-profile`, {
                params: {
                    user_id: user_id,
                }
            });
        }
    })
}

export const PostUpdateUserProfile = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/post-update-user-profile`, data);
        }
    })
}