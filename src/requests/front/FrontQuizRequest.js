import { useMutation, useQuery } from "@tanstack/react-query";
import { useInstance } from "@acadlix/helpers/util";

const base = "/front-quiz";

export const GetFrontQuizById = (quiz_id = '') => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getFrontQuizById", quiz_id],
        queryFn: () => {
            return instance.get(`${base}/${quiz_id}`, {
                params: {
                    _t: Date.now(),
                }
            });
        },
    })
}

export const PostSaveQuizAttemptById = (quiz_id = '') => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(
                `${base}/${quiz_id}/save-quiz-attempt`,
                data
            );
        },
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

export const PostLoadMoreLeaderboard = (quiz_id = '') => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/load-more-leaderboard/${quiz_id}`, data);
        },
    })
}

export const PostCheckQuizById = (quiz_id = 0) => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/${quiz_id}/check-quiz`, data);
        }
    })
}