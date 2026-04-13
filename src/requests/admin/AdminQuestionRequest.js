import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useInstance } from "@acadlix/helpers/util"
import toast from "react-hot-toast";
import { __ } from "@wordpress/i18n";

const base = "/admin-quiz";

export const GetQuizQuestion = (quiz_id = '', page = 0, pageSize = 10, search = '') => {
  const instance = useInstance();
  return useQuery({
    queryKey: ["getQuizQuestion", quiz_id, page, pageSize, search],
    queryFn: () => {
      return instance.get(`${base}/${quiz_id}/question`, {
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

export const GetCreateQuizQuestion = (quiz_id = '') => {
  const instance = useInstance();
  return useQuery({
    queryKey: ["getCreateQuizQuestion", quiz_id],
    queryFn: () => {
      return instance.get(`${base}/${quiz_id}/question/create`, {
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

export const PostCreateQuizQuestion = (quiz_id = '') => {
  const instance = useInstance();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/${quiz_id}/question`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getQuizQuestion"]
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  });
}

export const GetQuizQuestionById = (quiz_id = '', question_id = '') => {
  const instance = useInstance();
  return useQuery({
    queryKey: ["getQuizQuestionById", quiz_id, question_id],
    queryFn: () => {
      return instance.get(`${base}/${quiz_id}/question/${question_id}`, {
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

export const UpdateQuizQuestionById = (quiz_id = '', question_id = '') => {
  const instance = useInstance();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/${quiz_id}/question/${question_id}`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getQuizQuestion"]
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  })
}

export const DeleteQuizQuestionById = (quiz_id = '') => {
  const instance = useInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (question_id = '') => {
      return instance.delete(`${base}/${quiz_id}/question/${question_id}`, {
        headers: {
          'X-WP-Nonce': acadlixOptions?.nonce,
        }
      });
    },
    onSuccess: (data) => {
      toast.success(__('Question successfully deleted.', 'acadlix'));
      queryClient.invalidateQueries({
        queryKey: ["getQuizQuestion"]
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  });
}

export const PostSetSubjectAndPoint = (quiz_id = '') => {
  const instance = useInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/${quiz_id}/question/set-subject-and-point`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    },
    onSuccess: () => {
      toast.success(__('Subject and points updated successfully.', 'acadlix'));
      queryClient.invalidateQueries({
        queryKey: ["getQuizQuestion"]
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  })
}

export const PostSetParagraph = (quiz_id = '') => {
  const instance = useInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/${quiz_id}/question/set-paragraph`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    },
    onSuccess: () => {
      toast.success(__('Paragraph updated successfully.', 'acadlix'));
      queryClient.invalidateQueries({
        queryKey: ["getQuizQuestion"]
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  })
}


export const DeleteBulkQuestion = (quiz_id = '') => {
  const instance = useInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => {
      return instance.delete(`${base}/${quiz_id}/question/delete-bulk-question`, {
        headers: {
          'X-WP-Nonce': acadlixOptions?.nonce,
        },
        data: data
      });
    },
    onSuccess: () => {
      toast.success(__('Questions deleted successfully', 'acadlix'));
      queryClient.invalidateQueries({
        queryKey: ["getQuizQuestion"]
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  });
}

export const GetQuestionByIds = (quiz_id = '', question_ids = []) => {
  const instance = useInstance();
  return useQuery({
    queryKey: ["getQuestionByIds", question_ids],
    queryFn: () => {
      return instance.get(`${base}/${quiz_id}/question/by-ids`, {
        params: {
          question_ids: question_ids,
          _t: Date.now(),
        },
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    }
  })
}

export const PostBulkUpdateQuestionsAI = (quiz_id = '') => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/${quiz_id}/question/ai/bulk-update`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    },
  })
}

export const PostUploadAiQuestions = (quiz_id = '') => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/${quiz_id}/question/ai/upload-questions`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    }
  })
}