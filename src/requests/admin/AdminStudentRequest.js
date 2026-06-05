import { useInstance } from "@acadlix/helpers/util";
import { useQuery } from "@tanstack/react-query";


const base = "/admin-student";

export const GetStudents = (page = 0, pageSize = 10, search = '') => {
  const instance = useInstance();
  return useQuery({
    queryKey: ["getStudents", page, pageSize, search],
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

export const GetStudentQuizResult = (student_id, quiz_id, course_section_content_id) => {
  const instance = useInstance();
  return useQuery({
    queryKey: ["getStudentQuizResult", student_id, quiz_id, course_section_content_id],
    queryFn: () => {
      return instance.get(`${base}/get-student-quiz-result`, {
        params: {
          student_id: student_id,
          quiz_id: quiz_id,
          course_section_content_id: course_section_content_id,
          _t: Date.now(),
        },
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        }
      });
    }
  });
}