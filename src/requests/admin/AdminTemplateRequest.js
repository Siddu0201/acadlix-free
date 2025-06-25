import { useMutation, useQuery } from "@tanstack/react-query";
import { useInstance } from "../../helpers/util";

const base = "/admin-template";

export const GetTemplates = (type) => {
    const instance = useInstance();
    return useQuery({
        queryKey: ["getTemplates", type],
        queryFn: () => {
            return instance.get(base, {
                params: {
                    type: type,
                    _t: Date.now(),
                }
            });
        }
    });
}

export const PostSaveTemplate = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (data) => {
            return instance.post(base, data);
        }
    });
}

export const GetTemplateById = () => {
    const instance = useInstance();
    return useMutation({
        mutationFn: (id) => {
            return instance.get(`${base}/${id}`, {
                params: {
                    _t: Date.now(),
                }
            });
        }
    })
}