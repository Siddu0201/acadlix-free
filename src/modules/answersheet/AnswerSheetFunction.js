import { __ } from "@wordpress/i18n";

export const AnswerSheetFunction = (methods) => {
    const isQuestionEvaluated = (subjectId = 0, questionId = 0) => {
        const subject = methods?.watch("subject_times")?.find((d) => d?.subject_id === subjectId);
        if (
            methods?.watch("mode") === "advance_mode" &&
            methods?.watch("enable_selectable_questions_rule") &&
            subject &&
            subject?.selectable_rule_number_of_questions > 0
        ) {
            const subject_questions = methods?.watch("questions")?.filter((d) => d?.subject_id === subjectId);

            let evaluate_number_of_question = subject_questions?.length;
            if (evaluate_number_of_question > subject?.selectable_rule_number_of_questions) {
                evaluate_number_of_question = subject?.selectable_rule_number_of_questions;
            }
            const attempted_questions = subject_questions
                ?.filter((d) => d?.result?.attempted_at)
                ?.sort((a, b) => new Date(a.result.attempted_at) - new Date(b.result.attempted_at));
            const evaluated_questions = attempted_questions?.slice(0, evaluate_number_of_question);

            return evaluated_questions?.some((d) => d?.question_id === questionId);
        }
        return false;
    }

    const getPoints = () => {
        let points = methods?.watch("questions")?.reduce((total, d) => {
            if (d?.result?.solved_count && d?.result?.correct_count) {
                return total + Number(d?.points);
            } else if (d?.result?.solved_count && d?.result?.incorrect_count) {
                return total - Number(d?.negative_points);
            } else {
                return total;
            }
        }, 0);

        if (
            methods?.watch("mode") === "advance_mode" &&
            methods?.watch("enable_selectable_questions_rule") &&
            methods?.watch("subjects")?.length > 0
        ) {
            points = 0;
            methods?.watch("subjects")?.forEach((subject) => {
                points += getPointsBySubjectId(subject?.subject_id);
            });
        }
        return points;
    }

    const getNegativePoints = () => {
        let negative_points = methods?.watch("questions")?.reduce((total, d) => {
            if (d?.result?.solved_count && d?.result?.incorrect_count) {
                return total + Number(d?.negative_points);
            } else {
                return total;
            }
        }, 0);

        if (
            methods?.watch("mode") === "advance_mode" &&
            methods?.watch("enable_selectable_questions_rule") &&
            methods?.watch("subjects")?.length > 0
        ) {
            negative_points = 0;
            methods?.watch("subjects")?.forEach((subject) => {
                negative_points += getNegativePointsBySubjectId(subject?.subject_id);
            });
        }
        return negative_points;
    }

    const getTotalPoints = () => {
        let total = methods
            ?.watch("questions")
            ?.reduce((total, d) => total + Number(d?.points), 0);
        if (
            methods?.watch("mode") === "advance_mode" &&
            methods?.watch("enable_selectable_questions_rule") &&
            methods?.watch("subjects")?.length > 0
        ) {
            total = 0;
            methods?.watch("subjects")?.forEach((subject) => {
                total += getTotalPointsBySubjectId(subject?.subject_id);
            });
        }
        return total;
    }

    const getResult = () => {
        const total = getTotalPoints();
        const points = getPoints();
        return total > 0 ? (points / total) * 100 : 0;
    }

    const getCorrectCount = () => {
        let correct_count = methods
            ?.watch("questions")
            ?.filter((d) => d?.result?.correct_count)?.length;
        if (
            methods?.watch("mode") === "advance_mode" &&
            methods?.watch("enable_selectable_questions_rule") &&
            methods?.watch("subjects")?.length > 0
        ) {
            correct_count = 0;
            methods?.watch("subjects")?.forEach((subject) => {
                correct_count += getCorrectCountBySubjectId(subject?.subject_id);
            });
        }
        return correct_count;
    }

    const getIncorrectCount = () => {
        let incorrect_count = methods
            ?.watch("questions")
            ?.filter((d) => d?.result?.incorrect_count)?.length;
        if (
            methods?.watch("mode") === "advance_mode" &&
            methods?.watch("enable_selectable_questions_rule") &&
            methods?.watch("subjects")?.length > 0
        ) {
            incorrect_count = 0;
            methods?.watch("subjects")?.forEach((subject) => {
                incorrect_count += getIncorrectCountBySubjectId(subject?.subject_id);
            });
        }
        return incorrect_count;
    }

    const getSkippedCount = () => {
        let skipped_count = methods
            ?.watch("questions")
            ?.filter(d => !d?.result?.solved_count)?.length;
        if (
            methods?.watch("mode") === "advance_mode" &&
            methods?.watch("enable_selectable_questions_rule") &&
            methods?.watch("subjects")?.length > 0
        ) {
            skipped_count = 0;
            methods?.watch("subjects")?.forEach((subject) => {
                skipped_count += getSkippedCountBySubjectId(subject?.subject_id);
            });
        }
        return skipped_count;
    }

    const getSolvedCount = () => {
        let solved_count = methods
            ?.watch("questions")
            ?.filter((d) => d?.result?.solved_count)?.length;
        if (
            methods?.watch("mode") === "advance_mode" &&
            methods?.watch("enable_selectable_questions_rule") &&
            methods?.watch("subjects")?.length > 0
        ) {
            solved_count = 0;
            methods?.watch("subjects")?.forEach((subject) => {
                solved_count += getSolvedCountBySubjectId(subject?.subject_id);
            });
        }
        return solved_count;
    }

    const getAccuracy = () => {
        const solved_count = getSolvedCount();
        const correct_count = getCorrectCount();
        return solved_count > 0 ? ((correct_count / solved_count) * 100) : 0;
    }

    const getStatus = () => {
        const points = getPoints();
        const total = getTotalPoints();
        if(!methods?.watch("show_status_based_on_min_percent")){
            return null;
        }
        return (points / total) * 100 >= methods?.watch("minimum_percent_to_pass") ? __("Pass", "acadlix") : __("Fail", "acadlix");
    }

    const getTimeTaken = () => {
        const time_taken = methods
            ?.watch("questions")
            ?.reduce((total, d) => total + d?.result?.time, 0);
        return time_taken;
    }

    const getPointsBySubjectId = (subjectId = 0) => {
        let points = methods?.watch("questions")
            ?.filter((d) => d?.subject_id === subjectId)
            ?.reduce((total, d) => {
                if (d?.result?.solved_count && d?.result?.correct_count) {
                    return total + Number(d?.points);
                } else if (d?.result?.solved_count && d?.result?.incorrect_count) {
                    return total - Number(d?.negative_points);
                } else {
                    return total;
                }
            }, 0);

        const subject = methods?.watch("subjects")?.find((d) => d?.subject_id === subjectId);

        if (
            methods?.watch("mode") === "advance_mode" &&
            methods?.watch("enable_selectable_questions_rule") &&
            subject &&
            subject?.selectable_rule_number_of_questions > 0
        ) {
            const subject_questions = methods?.watch("questions")?.filter((d) => d?.subject_id === subjectId);

            let evaluate_number_of_question = subject_questions?.length;
            if (evaluate_number_of_question > subject?.selectable_rule_number_of_questions) {
                evaluate_number_of_question = subject?.selectable_rule_number_of_questions;
            }
            const attempted_questions = subject_questions
                ?.filter((d) => d?.result?.attempted_at)
                ?.sort((a, b) => new Date(a.result.attempted_at) - new Date(b.result.attempted_at));

            const evaluated_questions = attempted_questions?.slice(0, evaluate_number_of_question);
            points = evaluated_questions?.reduce((total, d) => {
                if (d?.result?.solved_count && d?.result?.correct_count) {
                    return total + Number(d?.points);
                } else if (d?.result?.solved_count && d?.result?.incorrect_count) {
                    return total - Number(d?.negative_points);
                } else {
                    return total;
                }
            }, 0);

        }
        return points;
    }

    const getNegativePointsBySubjectId = (subjectId = 0) => {
        let negative_points = methods?.watch("questions")
            ?.filter((d) => d?.subject_id === subjectId)
            ?.map((d) => d?.negative_points)
            ?.reduce((a, b) => a + b, 0);
        const subject = methods?.watch("subjects")?.find((d) => d?.subject_id === subjectId);
        if (
            methods?.watch("mode") === "advance_mode" &&
            methods?.watch("enable_selectable_questions_rule") &&
            subject &&
            subject?.selectable_rule_number_of_questions > 0
        ) {
            const subject_questions = methods?.watch("questions")?.filter((d) => d?.subject_id === subjectId);

            let evaluate_number_of_question = subject_questions?.length;
            if (evaluate_number_of_question > subject?.selectable_rule_number_of_questions) {
                evaluate_number_of_question = subject?.selectable_rule_number_of_questions;
            }

            const attempted_questions = subject_questions
                ?.filter((d) => d?.result?.attempted_at)
                ?.sort((a, b) => new Date(a.result.attempted_at) - new Date(b.result.attempted_at));
            const evaluated_questions = attempted_questions?.slice(0, evaluate_number_of_question);

            negative_points = evaluated_questions?.map((d) => d?.negative_points)?.reduce((a, b) => a + b, 0);
        }
        return negative_points;
    }

    const getTotalPointsBySubjectId = (subjectId = 0) => {
        let total = methods?.watch("questions")?.filter((d) => d?.subject_id === subjectId)?.map((d) => d?.points)?.reduce((a, b) => a + b, 0);
        const subject = methods?.watch("subjects")?.find((d) => d?.subject_id === subjectId);
        if (
            methods?.watch("mode") === "advance_mode" &&
            methods?.watch("enable_selectable_questions_rule") &&
            subject &&
            subject?.selectable_rule_number_of_questions > 0
        ) {
            const subject_questions = methods?.watch("questions")?.filter((d) => d?.subject_id === subjectId);

            let evaluate_number_of_question = subject_questions?.length;
            if (evaluate_number_of_question > subject?.selectable_rule_number_of_questions) {
                evaluate_number_of_question = subject?.selectable_rule_number_of_questions;
            }
            const evaluated_questions = subject_questions?.slice(0, evaluate_number_of_question);

            total = evaluated_questions?.map((d) => d?.points)?.reduce((a, b) => a + b, 0);
        }
        return total;
    }

    const getSolvedCountBySubjectId = (subjectId = 0) => {
        let solved_count = methods?.watch("questions")?.filter((d) => d?.subject_id === subjectId)?.map((d) => d?.result?.solved_count)?.reduce((a, b) => a + b, 0);
        const subject = methods?.watch("subjects")?.find((d) => d?.subject_id === subjectId);
        if (
            methods?.watch("mode") === "advance_mode" &&
            methods?.watch("enable_selectable_questions_rule") &&
            subject &&
            subject?.selectable_rule_number_of_questions > 0
        ) {
            const subject_questions = methods?.watch("questions")?.filter((d) => d?.subject_id === subjectId);

            let evaluate_number_of_question = subject_questions?.length;
            if (evaluate_number_of_question > subject?.selectable_rule_number_of_questions) {
                evaluate_number_of_question = subject?.selectable_rule_number_of_questions;
            }
            const attempted_questions = subject_questions
                ?.filter((d) => d?.result?.attempted_at)
                ?.sort((a, b) => new Date(a.result.attempted_at) - new Date(b.result.attempted_at));
            const evaluated_questions = attempted_questions?.slice(0, evaluate_number_of_question);

            solved_count = evaluated_questions?.map((d) => d?.result?.solved_count)?.reduce((a, b) => a + b, 0);
        }
        return solved_count;
    }

    const getCorrectCountBySubjectId = (subjectId = 0) => {
        let correct_count = methods?.watch("questions")?.filter((d) => d?.subject_id === subjectId)?.map((d) => d?.result?.correct_count)?.reduce((a, b) => a + b, 0);
        const subject = methods?.watch("subjects")?.find((d) => d?.subject_id === subjectId);
        if (
            methods?.watch("mode") === "advance_mode" &&
            methods?.watch("enable_selectable_questions_rule") &&
            subject &&
            subject?.selectable_rule_number_of_questions > 0
        ) {
            const subject_questions = methods?.watch("questions")?.filter((d) => d?.subject_id === subjectId);

            let evaluate_number_of_question = subject_questions?.length;
            if (evaluate_number_of_question > subject?.selectable_rule_number_of_questions) {
                evaluate_number_of_question = subject?.selectable_rule_number_of_questions;
            }
            const attempted_questions = subject_questions
                ?.filter((d) => d?.result?.attempted_at)
                ?.sort((a, b) => new Date(a.result.attempted_at) - new Date(b.result.attempted_at));
            const evaluated_questions = attempted_questions?.slice(0, evaluate_number_of_question);

            correct_count = evaluated_questions?.map((d) => d?.result?.correct_count)?.reduce((a, b) => a + b, 0);
        }
        return correct_count;
    }

    const getIncorrectCountBySubjectId = (subjectId = 0) => {
        let incorrect_count = methods?.watch("questions")?.filter((d) => d?.subject_id === subjectId)?.map((d) => d?.result?.incorrect_count)?.reduce((a, b) => a + b, 0);
        const subject = methods?.watch("subjects")?.find((d) => d?.subject_id === subjectId);
        if (
            methods?.watch("mode") === "advance_mode" &&
            methods?.watch("enable_selectable_questions_rule") &&
            subject &&
            subject?.selectable_rule_number_of_questions > 0
        ) {
            const subject_questions = methods?.watch("questions")?.filter((d) => d?.subject_id === subjectId);

            let evaluate_number_of_question = subject_questions?.length;
            if (evaluate_number_of_question > subject?.selectable_rule_number_of_questions) {
                evaluate_number_of_question = subject?.selectable_rule_number_of_questions;
            }
            const attempted_questions = subject_questions
                ?.filter((d) => d?.result?.attempted_at)
                ?.sort((a, b) => new Date(a.result.attempted_at) - new Date(b.result.attempted_at));
            const evaluated_questions = attempted_questions?.slice(0, evaluate_number_of_question);

            incorrect_count = evaluated_questions?.map((d) => d?.result?.incorrect_count)?.reduce((a, b) => a + b, 0);
        }
        return incorrect_count;
    }

    const getSkippedCountBySubjectId = (subjectId = 0) => {
        let skipped_count = methods?.watch("questions")?.filter((d) => d?.subject_id === subjectId)?.map((d) => !d?.result?.solved_count)?.reduce((a, b) => a + b, 0);
        const subject = methods?.watch("subjects")?.find((d) => d?.subject_id === subjectId);
        if (
            methods?.watch("mode") === "advance_mode" &&
            methods?.watch("enable_selectable_questions_rule") &&
            subject &&
            subject?.selectable_rule_number_of_questions > 0
        ) {
            const solved_count = getSolvedCountBySubjectId(subjectId);
            const subject_questions = methods?.watch("questions")?.filter((d) => d?.subject_id === subjectId);

            let evaluate_number_of_question = subject_questions?.length;
            if (evaluate_number_of_question > subject?.selectable_rule_number_of_questions) {
                evaluate_number_of_question = subject?.selectable_rule_number_of_questions;
            }
            skipped_count = evaluate_number_of_question - solved_count;
        }
        return skipped_count;
    }

    const getTimeBySubjectId = (subjectId = 0) => {
        let time_taken = methods?.watch("questions")
            ?.filter((d) => d?.subject_id === subjectId)
            ?.map((d) => d?.result?.time)
            ?.reduce((a, b) => a + b, 0);
        return time_taken;
    }

    const isSolved = (index = 0) => {
        return methods?.watch(`questions.${index}.result.solved_count`) > 0;
    }

    const isCorrect = (index = 0) => {
        return methods?.watch(`questions.${index}.result.correct_count`) > 0;
    }

    const isIncorrect = (index = 0) => {
        return methods?.watch(`questions.${index}.result.incorrect_count`) > 0;
    }

    return {
        isQuestionEvaluated,
        getPoints,
        getNegativePoints,
        getTotalPoints,
        getResult,
        getCorrectCount,
        getIncorrectCount,
        getSkippedCount,
        getSolvedCount,
        getAccuracy,
        getStatus,
        getTimeTaken,
        getPointsBySubjectId,
        getNegativePointsBySubjectId,
        getTotalPointsBySubjectId,
        getSolvedCountBySubjectId,
        getCorrectCountBySubjectId,
        getIncorrectCountBySubjectId,
        getSkippedCountBySubjectId,
        getTimeBySubjectId,
        isSolved,
        isCorrect,
        isIncorrect,
    }
}