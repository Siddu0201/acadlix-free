import { useMutation } from "@tanstack/react-query";
import { useInstance } from "@acadlix/helpers/util";
import toast from "react-hot-toast";

const base = "/admin-leaderboard";

export const PostQuizLoadMoreLeaderderboard = (quiz_id = '') => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/quiz-load-more-leaderboard/${quiz_id}`, data, {
                headers: {
                    "X-WP-Nonce": acadlixOptions?.nonce,
                }
            });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
            console.error(error);
        }
    })
}

export const PostResetLeaderboardByQuizId = (quiz_id) => {
    const instance = useInstance();
    return useMutation({
        mutationFn: () => {
            return instance.post(`${base}/${quiz_id}/reset-leaderboard`, {}, {
                headers: {
                    "X-WP-Nonce": acadlixOptions?.nonce,
                }
            });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
            console.error(error);
        }
    })
}