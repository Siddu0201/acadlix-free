import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useInstance } from "../../helpers/util"

const base = "/admin-subject";

export const GetSubjects = () => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getSubjects"],
        queryFn: () => {
            return instance.get(base);
        }
    })
}

export const PostCreateSubject = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(base, data);
        }
    });
}