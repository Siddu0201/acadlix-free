import { useMutation, useQuery } from "@tanstack/react-query";
import { useInstance } from "../../helpers/util";

const base = "/front-quiz";

export const GetFrontQuizById = (quiz_id = '') => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getFrontQuizById", quiz_id],
        queryFn: () => {
            return instance.get(`${base}/${quiz_id}`);
        }
    })
}

export const PostSaveResultById = (quiz_id = '') => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/${quiz_id}`, data);
        },
    })
}