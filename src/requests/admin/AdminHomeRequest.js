import { useQuery } from "@tanstack/react-query";
import { useInstance } from "@acadlix/helpers/util"

const base = "/admin-home";

export const GetHomeData = () => {
  const instance = useInstance();
  return useQuery({
    queryKey: ["getHomeData"],
    queryFn: () => {
      return instance.get(`${base}`, {
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

export const GetQuickPerformanceData = () => {
  const instance = useInstance();
  return useQuery({
    queryKey: ["getQuickPerformanceData"],
    queryFn: () => {
      return instance.get(`${base}/quick-performance`, {
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

export const GetCourseOverviewData = () => {
  const instance = useInstance();
  return useQuery({
    queryKey: ["getCourseOverviewData"],
    queryFn: () => {
      return instance.get(`${base}/course-overview`, {
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