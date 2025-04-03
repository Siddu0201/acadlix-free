import { useMutation } from "@tanstack/react-query";
import { useInstance } from "../../helpers/util"

const base = "/ai-common";

export const PostGenerateDescription = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/generate-description`, data);
        }
    });
}

export const PostImproveDescription = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/improve-description`, data);
        }
    });
}

export const PostResultFeedback = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/result-feedback`, data);
        }
    });
}