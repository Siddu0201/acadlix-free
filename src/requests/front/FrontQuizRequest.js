import { useMutation, useQuery } from "@tanstack/react-query";
import { useInstance } from "@acadlix/helpers/util";

const base = "/front-quiz";

export const GetFrontQuizById = (quiz_id = '') => {
  const instance = useInstance();
  return useQuery({
    queryKey: ["getFrontQuizById", quiz_id],
    queryFn: () => {
      return instance.get(`${base}/${quiz_id}`, {
        params: {
          _t: Date.now(),
        },
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        },
      });
    },
  })
}

export const PostUploadAssessmentFile = (quiz_id = '') => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(
        `${base}/${quiz_id}/post-upload-assessment-file`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            "X-WP-Nonce": acadlixOptions?.nonce,
          },
        });
    },
  })
}

export const PostDeleteAssessmentFile = (quiz_id = '') => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(
        `${base}/${quiz_id}/post-delete-assessment-file`,
        data,
        {
          headers: {
            'X-WP-Nonce': acadlixOptions.nonce
          },
        });
    }
  });
}

export const PostSaveQuizAttemptById = (quiz_id = '') => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(
        `${base}/${quiz_id}/save-quiz-attempt`,
        data,
        {
          headers: {
            "X-WP-Nonce": acadlixOptions?.nonce,
          },
        }
      );
    },
  })
}

export const PostSaveResultById = (quiz_id = '') => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/${quiz_id}`, data,
        {
          headers: {
            "X-WP-Nonce": acadlixOptions?.nonce,
          },
        }
      );
    },
  })
}

export const GetFrontQuizLeaderboardById = (quiz_id = '', params = {}) => {
  const instance = useInstance();
  return useQuery({
    queryKey: ["getFrontQuizLeaderboardById", quiz_id],
    queryFn: () => {
      return instance.get(`${base}/${quiz_id}/leaderboard`, {
        params: {
          _t: Date.now(),
        },
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        },
      });
    },
  })
}

export const PostLoadMoreLeaderboard = (quiz_id = '') => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/load-more-leaderboard/${quiz_id}`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        },
      });
    },
  })
}

export const PostCheckQuizById = (quiz_id = 0) => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/${quiz_id}/check-quiz`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        },
      });
    }
  })
}