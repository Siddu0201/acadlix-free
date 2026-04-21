import { useMutation } from "@tanstack/react-query";
import { useInstance } from "@acadlix/helpers/util"
import toast from "react-hot-toast";

const base = "/ai-common";

export const PostGenerateDescription = () => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/generate-description`, data, {
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

export const PostImproveDescription = () => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/improve-description`, data, {
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

export const PostResultFeedback = () => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/result-feedback`, data, {
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

export const PostValidateQuestions = () => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/validate-questions`, data, {
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

export const PostGenerateQuestions = () => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/generate-questions`, data, {
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