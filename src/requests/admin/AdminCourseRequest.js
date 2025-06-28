import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useInstance } from "@acadlix/helpers/util";

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
      return instance.get(`${base}/get-lessons-for-course`, {
        params: {
          _t: Date.now(),
        }
      });
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
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/section/${section_id}/lesson/${lesson_id}`, data);
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
        }
      });
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

export const GetAssignmentsForCourse = () => {
  const instance = useInstance();
  return useQuery({
    queryKey: ["getAssignmentsForCourse"],
    queryFn: () => {
      return instance.get(`${base}/get-assignments-for-course`, {
        params: {
          _t: Date.now(),
        }
      });
    },
  });
};


export const PostAddAssignment = (section_id = 0) => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/section/${section_id}/assignment`, data);
    },
  });
}

export const PostUpdateAssignmentById = (section_id = 0, assignment_id = 0 ) => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/section/${section_id}/assignment/${assignment_id}`, data);
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
  });
}
