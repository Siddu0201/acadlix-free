import { useMutation } from "@tanstack/react-query";
import { useInstance } from "@acadlix/helpers/util";

const base = "/admin-leaderboard";

export const PostQuizLoadMoreLeaderderboard = (quiz_id = '') => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/quiz-load-more-leaderboard/${quiz_id}`, data);
        }
    })
}

export const PostResetLeaderboardByQuizId = (quiz_id) => {
    const instance = useInstance();
    return useMutation({
        mutationFn: () => {
            return instance.post(`${base}/${quiz_id}/reset-leaderboard`);
        }
    })
}