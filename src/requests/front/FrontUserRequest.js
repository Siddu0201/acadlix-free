import { useMutation } from "@tanstack/react-query";
import { useInstance } from "../../helpers/util"

const base = "/front-user";

export const PostUserLogin = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/login`, data);
        }
    });
}

export const PostUserRegister = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(`${base}/register`, data);
        }
    });
}