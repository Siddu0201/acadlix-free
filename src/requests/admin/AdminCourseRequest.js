import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useInstance } from "@acadlix/helpers/util";
import toast from "react-hot-toast";

const base = "/admin-course";

export const PostCreateUpdateCourse = () => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    },
  });
};

export const PostCreateSection = () => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/section`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.log(error);
    },
  });
};

export const UpdateSectionById = (section_id = 0) => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/section/${section_id}`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.log(error);
    },
  });
};

export const DeleteSectionById = (section_id = 0) => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.delete(`${base}/section/${section_id}`, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        },
        data: data,
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.log(error);
    },
  });
};

export const PostSortSection = (course_id = 0) => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/${course_id}/sort-section`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.log(error);
    },
  });
}

export const PostSortContent = (section_id = 0) => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/${section_id}/sort-content`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.log(error);
    },
  });
}

export const PostTooglePreviewContent = (section_id = 0, content_id = 0) => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/section/${section_id}/content/${content_id}/preview`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.log(error);
    },
  });
}

export const GetLessonsForCourse = () => {
  const instance = useInstance();
  return useQuery({
    queryKey: ["getLessonsForCourse"],
    queryFn: () => {
      return instance.get(`${base}/get-lessons-for-course`, {
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


export const PostAddLesson = (section_id = 0) => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/section/${section_id}/lesson`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.log(error);
    },
  });
}

export const PostUpdateLessonById = (section_id = 0, lesson_id = 0) => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/section/${section_id}/lesson/${lesson_id}`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.log(error);
    },
  });
}

export const GetQuizzesForCourse = () => {
  const instance = useInstance();
  return useQuery({
    queryKey: ["getQuizzesForCourse"],
    queryFn: () => {
      return instance.get(`${base}/get-quizzes-for-course`, {
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

export const PostAddQuiz = (section_id = 0) => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/section/${section_id}/quiz`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.log(error);
    },
  });
}

export const GetAssignmentsForCourse = () => {
  const instance = useInstance();
  return useQuery({
    queryKey: ["getAssignmentsForCourse"],
    queryFn: () => {
      return instance.get(`${base}/get-assignments-for-course`, {
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


export const PostAddAssignment = (section_id = 0) => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/section/${section_id}/assignment`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.log(error);
    },
  });
}

export const PostUpdateAssignmentById = (section_id = 0, assignment_id = 0) => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/section/${section_id}/assignment/${assignment_id}`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.log(error);
    },
  });
}

export const RemoveContentFromSection = (section_id = 0, content_id = 0) => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.delete(`${base}/section/${section_id}/content/${content_id}`, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        },
        data: data,
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.log(error);
    },
  });
}
