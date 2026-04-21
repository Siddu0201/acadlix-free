import { useMutation, useQuery } from "@tanstack/react-query";
import { useInstance } from "@acadlix/helpers/util"
import toast from "react-hot-toast";

const base = "/admin-category";

export const GetCategories = () => {
  const instance = useInstance();
  return useQuery({
    queryKey: ["getCategories"],
    queryFn: () => {
      return instance.get(base, {
        params: {
          _t: Date.now(),
        },
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    }
  });
}

export const PostCreateCategory = () => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(base, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  });
}

export const UpdateCategoryById = (id) => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/${id}`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  });
}

export const DeleteCategoryById = (id) => {
  const instance = useInstance();
  return useMutation({
    mutationFn: () => {
      return instance.delete(`${base}/${id}`, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        },
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  });
}