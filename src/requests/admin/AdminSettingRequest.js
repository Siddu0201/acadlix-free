import { useMutation } from "@tanstack/react-query";
import { useInstance } from "../../helpers/util";

const base = "/admin-setting";

export const PostCreatePage = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/create-page`, data);
        }        
    });
}

export const PostUpdateSetting = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}`, data);
        }        
    });
}

