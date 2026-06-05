export const CourseStudentFunction = (methods) => {
  const getTotalCompletedCourse = () => {
    return methods?.watch("students")?.reduce((total, student) => {
      return total + Number(student?.is_completed);
    }, 0);
  }

  const getTotalInProgressCourse = () => {
    return methods?.watch("students")?.reduce((total, student) => {
      return total + Number(!student?.is_completed);
    }, 0);
  }

  return {
    getTotalCompletedCourse,
    getTotalInProgressCourse,
  }

}