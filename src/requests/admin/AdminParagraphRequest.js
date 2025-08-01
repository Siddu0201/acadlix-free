import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useInstance } from "@acadlix/helpers/util";
import toast from "react-hot-toast";
import { __ } from "@wordpress/i18n";

const base = "/admin-paragraph";

export const GetQuizParagraphs = (quiz_id = '', page = 0, pageSize = 10, search = '') => {
  const instance = useInstance();
  return useQuery({
    queryKey: ["getQuizParagraphs", quiz_id, page, pageSize, search],
    queryFn: () => {
      return instance.get(`${base}/${quiz_id}/paragraph`, {
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
    },
  });
};

export const GetCreateQuizParagraph = (quiz_id = '') => {
  const instance = useInstance();
  return useQuery({
      queryKey: ["getCreateQuizParagraph", quiz_id],
      queryFn: () => {
          return instance.get(`${base}/${quiz_id}/paragraph/create`,{
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

export const PostCreateQuizParagraph = (quiz_id = '') => {
  const instance = useInstance();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/${quiz_id}/paragraph`, data, {
        headers: {
            "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getQuizParagraphs"],
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  });
};

export const GetQuizParagraphById = (quiz_id = '', paragraph_id = "") => {
  const instance = useInstance();
  return useQuery({
    queryKey: ["getParagraphById", quiz_id, paragraph_id],
    queryFn: () => {
      return instance.get(`${base}/${quiz_id}/paragraph/${paragraph_id}`, {
        params: {
          _t: Date.now(),
        },
        headers: {
            "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    },
  });
};

export const UpdateQuizParagraphById = (quiz_id = '' ,paragraph_id = '') => {
  const instance = useInstance();
  const queryClient = useQueryClient();
  return useMutation({
      mutationFn: (data) => {
          return instance.post(`${base}/${quiz_id}/paragraph/${paragraph_id}`, data, {
            headers: {
                "X-WP-Nonce": acadlixOptions?.nonce,
            }
          });
      },
      onSuccess: () => {
          queryClient.invalidateQueries({
              queryKey: ["getQuizParagraphs"]
          });
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message);
        console.error(error);
      }
  })
}


export const DeleteQuizParagraphById = (quiz_id = '') => {
  const instance = useInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paragraph_id = "") => {
      return instance.delete(`${base}/${quiz_id}/paragraph/${paragraph_id}`, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        },
      });
    },
    onSuccess: (data) => {
      toast.success(__("Paragraph successfully deleted.", "acadlix"));
      queryClient.invalidateQueries({
        queryKey: ["getQuizParagraphs"],
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.error(error);
    },
  });
};

export const DeleteBulkParagraph = (quiz_id = '') => {
  const instance = useInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => {
      return instance.delete(
        `${base}/${quiz_id}/paragraph/delete-bulk-paragraph`,
        {
          headers: {
            "X-WP-Nonce": acadlixOptions?.nonce,
          },
          data: data,
        }
      );
    },
    onSuccess: () => {
      toast.success(__("Paragraphs deleted successfully", "acadlix"));
      queryClient.invalidateQueries({
        queryKey: ["getQuizParagraphs"],
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.error(error);
    },
  });
};
