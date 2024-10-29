import { useQuery } from "@tanstack/react-query";
import { useInstance } from "../../helpers/util";


const base = "/front-dashboard";

export const GetUserCourses = (user_id = 0, page = 1, ) => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getUserCourses", user_id, page],
        queryFn: () => {
            return instance.get(`${base}/get-user-courses`, {
                params: {
                    user_id: user_id,
                    page: page,
                }
            });
        }
    })
}