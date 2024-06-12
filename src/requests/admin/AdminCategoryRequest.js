import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useInstance } from "../../helpers/util"

const base = "/admin-category";

export const GetCategories = () => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getCategories"],
        queryFn: () => {
            return instance.get(base);
        }
    });
}

export const PostCreateCategory = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(base, data);
        }        
    });
}