import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useInstance } from "../../helpers/util";

const base = "/admin-course";

export const PostCreateUpdateCourse = () => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}`, data);
    },
  });
};

export const PostCreateSection = () => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/section`, data);
    },
  });
};

export const UpdateSectionById = (section_id = 0) => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/section/${section_id}`, data);
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
  });
};

export const PostSortSection = (course_id = 0) => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/${course_id}/sort-section`, data);
    }
  });
}

export const PostSortContent = (section_id = 0) => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/${section_id}/sort-content`, data);
    }
  });
}

export const PostTooglePreviewContent = (section_id = 0, content_id = 0) => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/section/${section_id}/content/${content_id}/preview`, data);
    },
  });
}

export const GetLessonsForCourse = () => {
  const instance = useInstance();
  return useQuery({
    queryKey: ["getLessonsForCourse"],
    queryFn: () => {
      return instance.get(`${base}/get-lessons-for-course`);
    },
  });
};


export const PostAddLesson = (section_id = 0) => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/section/${section_id}/lesson`, data);
    },
  });
}

export const PostUpdateLessonById = (section_id = 0, lesson_id = 0 ) => {
  const instance = useInstance();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/section/${section_id}/lesson/${lesson_id}`, data);
    },
    onSuccess: () => {
      queryClient?.invalidateQueries({
        queryKey: ["getLessonById"]
      })
    }
  });
}

export const GetQuizzesForCourse = () => {
  const instance = useInstance();
  return useQuery({
    queryKey: ["getQuizzesForCourse"],
    queryFn: () => {
      return instance.get(`${base}/get-quizzes-for-course`);
    },
  });
};

export const PostAddQuiz = (section_id = 0) => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/section/${section_id}/quiz`, data);
    },
  });
}

export const RemoveContentFromSection = (section_id = 0, section_content_id = 0) => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.delete(`${base}/section/${section_id}/content/${section_content_id}`, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        },
        data: data,
      });
    },
  });
}
