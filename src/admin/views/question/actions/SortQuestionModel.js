import { Box, Button, Chip, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, Typography } from '@mui/material';
import React from 'react'
import { __ } from "@wordpress/i18n";
import { IoClose, MdDragIndicator } from '@acadlix/helpers/icons';
import { useForm } from 'react-hook-form';
import { GetQuizQuestion, PostSortQuestions } from '@acadlix/requests/admin/AdminQuestionRequest';
import Loader from '@acadlix/components/Loader';
import { getStripHtml } from '@acadlix/helpers/util';
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import QuestionDifficultyLevel from '@acadlix/components/QuestionDifficultyLevel';

const SortQuestionModel = (props) => {
  const methods = useForm({
    defaultValues: {
      questions: [],
    }
  });
  const [activeId, setActiveId] = React.useState(null);
  const sortMutation = PostSortQuestions(props.quiz_id);
  const handleDragEnd = (e) => {
    const { active, over } = e;
    if (active?.id !== over?.id) {
      const oldIndex = methods?.watch(`questions`)?.findIndex(
        (curr) => curr.id === active?.id
      );
      const newIndex = methods?.watch(`questions`)?.findIndex(
        (curr) => curr.id === over?.id
      );

      methods?.setValue(
        `questions`,
        arrayMove(
          methods?.watch(`questions`),
          oldIndex,
          newIndex
        )
      );
      sortMutation?.mutate(
        {
          questions: methods?.watch(`questions`)
        },
        {
          onSuccess: (data) => {
            methods?.setValue(
              `questions`,
              data?.data?.questions?.map((q) => {
                return renderQuestionData(q);
              })
            );
          },
          onError: (error) => {
            methods?.setValue(
              `questions`,
              arrayMove(
                methods?.watch(`questions`),
                newIndex,
                oldIndex
              )
            );
          },
        }
      );
    }
    setActiveId(null);
  };

  const handleDragStart = (e) => {
    const { active } = e;
    console.log("active", active);
    setActiveId(active?.id);
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { isFetching, data } = GetQuizQuestion(
    props.quiz_id,
    0,
    0
  );

  const renderQuestionData = (question) => {
    return {
      id: question?.id,
      title: question?.title
        ? question?.title
        : (() => {
          const fullText = getStripHtml(
            question?.question_languages
              ?.filter((d) => d?.default)?.[0]
              ?.question
          );
          return fullText?.length > 70 ? fullText.substring(0, 70) + '...' : fullText;
        })(),
      type: props?.getType(question?.answer_type),
      subject: question?.subject?.subject_name ?? "Uncategorized",
      difficulty_level: question?.difficulty_level ?? '',
      points: question?.points,
      negative_points: question?.negative_points,
      sort: question?.sort,
    }
  };

  React.useLayoutEffect(() => {
    if (Array.isArray(data?.data?.questions)) {
      const newRows = data?.data?.questions?.map((question) => {
        return window?.acadlixHooks?.applyFilters(
          'acadlix.admin.question.sort_question_model.question_data',
          renderQuestionData(question),
          {
            question: question,
            quiz_id: props.quiz_id,
          }
        );
      });
      methods.setValue("questions", newRows, {
        shouldDirty: true,
      });
    }
  }, [data]);

  if (process.env.REACT_APP_MODE === "development") {
    console.log("questions", methods.watch("questions"));
  }

  return (
    <>
      <DialogTitle id="alert-dialog-title" sx={{ m: 0, p: 2 }}>
        {__("Sort Questions", "acadlix")}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={props?.handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <IoClose />
      </IconButton>
      <DialogContent>
        {
          isFetching ? (
            <Loader />
          ) : (
            <Box>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <List
                  sx={{
                    display: "grid",
                    gap: 1,
                    padding: 0,
                  }}
                >
                  <SortableContext
                    items={methods.watch("questions") ?? []}
                    strategy={verticalListSortingStrategy}
                  >
                    {
                      methods.watch("questions")?.map((question) => {
                        return (
                          <SortableQuestionItem
                            key={question.id}
                            question={question}
                            activeId={activeId}
                          />
                        );
                      })
                    }
                  </SortableContext>
                  <DragOverlay>
                    {
                      activeId ? (
                        <ActiveItem
                          activeId={activeId}
                          questions={methods.watch("questions")}
                        />
                      ) : null
                    }
                  </DragOverlay>
                </List>
              </DndContext>
            </Box>
          )
        }
      </DialogContent>
      <DialogActions sx={{
        display: 'flex',
        padding: 2,
      }}>
        <Button
          variant="contained"
          color="error"
          onClick={props?.handleClose}
        >
          {__("Close", "acadlix")}
        </Button>
      </DialogActions>
    </>
  )
}

const ActiveItem = React.forwardRef(({ activeId, questions}, ref) => {
  const activeQuestion = questions?.find((q) => q.id == activeId);

  if (!activeQuestion) return null;
  return (
    <ListItem
      ref={ref}
      sx={{
        padding: 0,
        display: "block",
        border: `1px solid black`,
        borderRadius: "6px",
        cursor: "grab",
        opacity: 0.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: (theme) => theme.palette.primary.contrastText,
          paddingX: 2,
          paddingY: 1,
          borderRadius: "6px",
        }}
      >
        <Box sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}>
          <MdDragIndicator
            style={{
              fontSize: 32,
              cursor: "move",
            }}
          />
          <Box>
            <Box sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              marginBottom: 1,
            }}>
              <Chip
                label={activeQuestion?.type}
                size="small"
              />
              <Chip
                label={activeQuestion?.subject}
                size="small"
                color="info"
              />
              <QuestionDifficultyLevel
                value={activeQuestion?.difficulty_level}
                size="small"
              />
            </Box>
            <Typography variant="body2" sx={{
              cursor: "default",
            }}>
              {activeQuestion?.title}
            </Typography>
          </Box>
        </Box>
      </Box>
    </ListItem>
  );
});

const SortableQuestionItem = (props) => {
  const { attributes, listeners, setNodeRef, transition, isOver } = useSortable({
    id: props?.question?.id,
  });

  return (
    <ListItem
      ref={setNodeRef}
      sx={{
        transition: transition,
        padding: 0,
        display: "block",
        border: `1px ${isOver ? "dotted" : "solid"} black`,
        borderRadius: "6px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: (theme) => theme.palette.primary.contrastText,
          paddingX: 2,
          paddingY: 1,
          borderRadius: "6px",
        }}
      >
        <Box sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}>
          <MdDragIndicator
            style={{
              fontSize: 32,
              cursor: "move",
              opacity: 1,
            }}
            {...listeners}
            {...attributes}
          />
          <Box>
            <Box sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              marginBottom: 1,
            }}>
              <Chip
                label={props?.question?.type}
                size="small"
              />
              <Chip
                label={props?.question?.subject}
                size="small"
                color="info"
              />
              <QuestionDifficultyLevel
                value={props?.question?.difficulty_level}
                size="small"
              />
            </Box>
            <Typography variant="body2">
              {props?.question?.title}
            </Typography>
          </Box>
        </Box>
      </Box>
    </ListItem>
  );
}

export default SortQuestionModel