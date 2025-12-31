import { useInstance } from "@acadlix/helpers/util";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const base = "admin-review";

export const GetReviews = (page = 0, pageSize = 10, search = '') => {
  const instance = useInstance();
  return useQuery({
    queryKey: ["getReviews", page, pageSize, search],
    queryFn: () => {
      return instance.get(base, {
        params: {
          page: page,
          pageSize: pageSize,
          search: search,
          _t: Date.now(),
        },
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    }
  });
}

export const UpdateReviewById = (review_id = '') => {
  const instance = useInstance();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => {
      return instance.put(`${base}/${review_id}`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getReviews"]
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  });
}


export const DeleteReviewById = () => {
  const instance = useInstance();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (review_id = '') => {
      return instance.delete(`${base}/${review_id}`, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["getReviews"]
      });
      toast.success(data?.data?.message);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  });
}