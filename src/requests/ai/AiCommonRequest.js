import { useMutation } from "@tanstack/react-query";
import { useInstance } from "@acadlix/helpers/util"
import toast from "react-hot-toast";

const base = "/ai-common";

export const PostGenerateDescription = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/generate-description`, data);
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
            console.error(error);
        }
    });
}

export const PostImproveDescription = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/improve-description`, data);
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
            console.error(error);
        }
    });
}

export const PostResultFeedback = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/result-feedback`, data);
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
            console.error(error);
        }
    });
}