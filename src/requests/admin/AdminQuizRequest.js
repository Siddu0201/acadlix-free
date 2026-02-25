import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useInstance } from "@acadlix/helpers/util"
import toast from "react-hot-toast";
import { __ } from "@wordpress/i18n";

const base = "/admin-quiz";

export const GetQuizes = (page = 0, pageSize = 10, search = '') => {
  const instance = useInstance();
  return useQuery({
    queryKey: ["getQuizes", page, pageSize, search],
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

export const GetCreateQuiz = () => {
  const instance = useInstance();
  return useQuery({
    queryKey: ["getCreateQuiz"],
    queryFn: () => {
      return instance.get(`${base}/create`, {
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

export const PostCreateQuiz = () => {
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
      toast.success(__('Quiz successfully created.', 'acadlix'));
      queryClient.invalidateQueries({
        queryKey: ["getQuizes"]
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  });
}

export const GetQuizById = (quiz_id = '') => {
  const instance = useInstance();
  return useQuery({
    queryKey: ["getQuizById", quiz_id],
    queryFn: () => {
      return instance.get(`${base}/${quiz_id}`, {
        params: {
          _t: Date.now(),
        },
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    }
  })
}

export const UpdateQuizById = (quiz_id = '') => {
  const instance = useInstance();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/${quiz_id}`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    },
    onSuccess: () => {
      toast.success(__('Quiz successfully updated.', 'acadlix'));
      queryClient.invalidateQueries({
        queryKey: ["getQuizes"]
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  })
}

export const DeleteQuizById = () => {
  const instance = useInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quiz_id = '') => {
      return instance.delete(`${base}/${quiz_id}`, {
        headers: {
          'X-WP-Nonce': acadlixOptions?.nonce,
        }
      });
    },
    onSuccess: (data) => {
      toast.success(__('Quiz successfully deleted.', 'acadlix'));
      queryClient.invalidateQueries({
        queryKey: ["getQuizes"]
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    }
  })
}

export const DeleteBulkQuiz = () => {
  const instance = useInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => {
      return instance.delete(`${base}/delete-bulk-quiz`, {
        headers: {
          'X-WP-Nonce': acadlixOptions?.nonce,
        },
        data: data
      });
    },
    onSuccess: () => {
      toast.success(__('Quizzes deleted successfully', 'acadlix'));
      queryClient.invalidateQueries({
        queryKey: ["getQuizes"]
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    }
  });
}

export const PostSetCategory = () => {
  const instance = useInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/set-category`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    },
    onSuccess: () => {
      toast.success(__('Category updated successfully.', 'acadlix'));
      queryClient.invalidateQueries({
        queryKey: ["getQuizes"]
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  })
}

export const PostExportQuiz = () => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/export`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        },
      });
    }
  });
}

export const PostImportQuiz = () => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/import`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        },
      });
    },
  });
}

export const GetSubjectByQuizId = (quiz_id) => {
  const instance = useInstance();
  return useQuery({
    queryKey: ["getSubjectByQuizId", quiz_id],
    queryFn: () => {
      return instance.get(`${base}/${quiz_id}/get-subject-by-quiz-id`, {
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

export const PostSetSubjectWiseTime = () => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/update-quiz-subject`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  })
}

export const UpdateAddLanguageToQuiz = (quiz_id) => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/${quiz_id}/update-add-language-to-quiz`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    }
  })
}

export const UpdateSetDefaultLanguageToQuiz = (quiz_id) => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/${quiz_id}/update-set-default-language-to-quiz`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  })
}

export const DeleteLanguageFromQuiz = (quiz_id) => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/${quiz_id}/delete-language-from-quiz`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  })
}