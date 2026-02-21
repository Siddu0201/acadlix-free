import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useInstance } from "@acadlix/helpers/util";
import toast from "react-hot-toast";
import { __ } from "@wordpress/i18n";

const base = "/admin-coupon";

export const GetCoupons = (page = 0, pageSize = 10, search = '') => {
  const instance = useInstance();
  return useQuery({
    queryKey: ["getCoupons", page, pageSize, search],
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
};

export const PostCreateCoupon = () => {
  const instance = useInstance();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(base, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getCoupons"]
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  });
}

export const GetCouponById = (coupon_id = '') => {
  const instance = useInstance();
  return useQuery({
    queryKey: ["getCouponById", coupon_id],
    queryFn: () => {
      return instance.get(`${base}/${coupon_id}`, {
        params: {
          _t: Date.now(),
        },
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    }
  });
};

export const UpdateCouponById = (coupon_id = '') => {
  const instance = useInstance();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/${coupon_id}`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getCoupons"]
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  });
}

export const DeleteCouponById = () => {
  const instance = useInstance();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (coupon_id) => {
      return instance.delete(`${base}/${coupon_id}`, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    },
    onSuccess: () => {
      toast.success(__("Coupon deleted successfully", "acadlix"));
      queryClient.invalidateQueries({
        queryKey: ["getCoupons"]
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  });
}

export const DeleteBulkCoupon = () => {
  const instance = useInstance();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => {
      return instance.delete(`${base}/bulk-delete-coupon`, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        },
        data: data
      });
    },
    onSuccess: () => {
      toast.success(__("Selected coupons deleted successfully", "acadlix"));
      queryClient.invalidateQueries({
        queryKey: ["getCoupons"]
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  });
} 