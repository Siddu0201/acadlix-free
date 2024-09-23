import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import EditSection from "./EditSection";
import AddLesson from "./AddLesson";
import AddQuiz from "./AddQuiz";
import {
  DeleteSectionById,
  PostSortSection,
} from "../../../../requests/admin/AdminCourseRequest";
import toast from "react-hot-toast";
import ViewContentSection from "./ViewContentSection";

const ViewSection = (props) => {
  const [activeId, setActiveId] = React.useState(null);

  const sortMutation = PostSortSection(props?.watch("id"));
  const handleDragEnd = (e) => {
    const { active, over } = e;
    if (active?.id !== over?.id) {
      const oldIndex = props
        ?.watch("sections")
        .findIndex((curr) => curr.sort === active?.id);
      const newIndex = props
        ?.watch("sections")
        .findIndex((curr) => curr.sort === over?.id);

      props?.setValue(
        "sections",
        arrayMove(props?.watch("sections"), oldIndex, newIndex)
      );
      sortMutation?.mutate(
        {
          active_sort: active?.id,
          over_sort: over?.id,
        },
        {
          onSuccess: (data) => {
            props?.setValue(
              "sections",
              data?.data?.sections?.map((s) => {
                return {
                  id: s?.id,
                  title: s?.title,
                  description: s?.description,
                  show: false,
                  open:
                    props?.watch(`sections`)?.find((sec) => sec?.id === s?.id)
                      ?.open ?? false,
                  sort: s?.sort,
                  contents:
                    s?.contents?.length > 0
                      ? s?.contents?.map((c) => {
                          return {
                            id: c?.id,
                            sort: c?.sort,
                            type:
                              c?.contentable_type ===
                              `Yuvayana\\Acadlix\\Models\\Quiz`
                                ? "quiz"
                                : "lesson",
                            title: c?.contentable?.title,
                            contentable_id: c?.contentable_id,
                            course_section_id: c?.course_section_id,
                          };
                        })
                      : [],
                };
              })
            );
          },
        }
      );
    }
    setActiveId(null);
  };

  const handleDragStart = (e) => {
    const { active } = e;
    setActiveId(active?.id);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <Box>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={sortMutation?.isPending}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <List
          sx={{
            display: "grid",
            gap: 2,
            padding: 0,
          }}
        >
          <SortableContext
            items={props?.watch("sections")}
            strategy={verticalListSortingStrategy}
          >
            {props?.watch("sections")?.map((s, index) => (
              <SortableSections
                key={index}
                id={index}
                s={s}
                activeId={activeId}
                {...props}
              />
            ))}
          </SortableContext>
          <DragOverlay>
            {activeId ? <ActiveItem id={activeId} {...props} /> : null}
          </DragOverlay>
        </List>
      </DndContext>
    </Box>
  );
};

const ActiveItem = React.forwardRef(({ id, ...props }, ref) => {
  const s = props?.watch("sections")?.find((s) => id === s?.sort);
  return (
    <ListItem
      ref={ref}
      {...props}
      sx={{
        padding: 0,
        display: "block",
        border: `1px solid ${props?.colorCode?.view_section_border}`,
        borderRadius: "6px",
        opacity: 1,
        cursor: "grab",
        opacity: 0.5
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: props?.colorCode?.view_section_background,
          paddingX: 3,
          paddingY: 2,
          borderRadius: "6px",
          borderBottomLeftRadius: s?.open ? 0 : "6px",
          borderBottomRightRadius: s?.open ? 0 : "6px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <IoMenu
            style={{
              fontSize: 28,
              cursor: "move",
            }}
          />
          <Typography
            variant="h6"
            sx={{
              cursor: "default",
            }}
          >
            {s?.title}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <EditSection {...props} />
          <IconButton>
            <FaTrash
              style={{
                fontSize: 14,
              }}
            />
          </IconButton>
          <IconButton>
            {s?.open ? (
              <IoIosArrowUp
                style={{
                  fontSize: 18,
                }}
              />
            ) : (
              <IoIosArrowDown
                style={{
                  fontSize: 18,
                }}
              />
            )}
          </IconButton>
        </Box>
      </Box>
      <Collapse in={s?.open} timeout="auto" unmountOnExit>
        <Box>
          <Box
            sx={{
              paddingX: 4,
              paddingY: 2,
            }}
          >
            <List
              sx={{
                display: "grid",
                gap: 2,
                padding: 0,
              }}
            >
              {s?.contents?.length > 0 &&
                s?.contents?.map((c, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      padding: 0,
                      display: "block",
                      border: `1px solid ${props?.colorCode?.view_section_border}`,
                      borderRadius: "6px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        backgroundColor:
                          props?.colorCode?.view_section_background,
                        paddingX: 3,
                        paddingY: 2,
                        borderRadius: "6px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <IoMenu
                          style={{
                            fontSize: 28,
                            cursor: "move",
                          }}
                        />
                        <Typography
                          variant="h6"
                          sx={{
                            cursor: "default",
                          }}
                        >
                          {c?.title}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <IconButton component="a" target="_blank">
                          <FaEdit style={{ fontSize: 14 }} />
                        </IconButton>
                        <IconButton>
                          <FaTrash
                            style={{
                              fontSize: 14,
                            }}
                          />
                        </IconButton>
                      </Box>
                    </Box>
                  </ListItem>
                ))}
            </List>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              paddingX: 4,
              paddingY: 2,
              gap: 2,
            }}
          >
            <AddLesson {...props} />
            <AddQuiz {...props} />
          </Box>
        </Box>
      </Collapse>
    </ListItem>
  );
});

const SortableSections = (props) => {
  const { attributes, listeners, setNodeRef, transition, isOver } =
    useSortable({
      id: props?.s?.sort,
    });

  const handleToggle = () => {
    props?.setValue(
      `sections.${props?.id}.open`,
      !props?.watch(`sections.${props?.id}.open`),
      { shouldDirty: true }
    );
  };

  const deleteMutation = DeleteSectionById(props?.s?.id);
  const handleRemoveSection = (e) => {
    if (
      confirm(
        "Are you sure you want to delete this section, this will also remove related quizzes and lessons."
      )
    ) {
      deleteMutation?.mutate(
        {},
        {
          onSuccess: (data) => {
            props?.setValue(
              "sections",
              props
                ?.watch("sections")
                ?.filter((_, index) => props?.id !== index),
              { shouldDirty: true }
            );
            toast.success(data?.data?.message);
          },
        }
      );
    }
  };
  return (
    <ListItem
      ref={setNodeRef}
      sx={{
        transition: transition,
        padding: 0,
        display: "block",
        border: `1px ${isOver ? "dotted" : "solid"} ${props?.colorCode?.view_section_border}`,
        borderRadius: "6px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: props?.colorCode?.view_section_background,
          paddingX: 3,
          paddingY: 2,
          borderRadius: "6px",
          borderBottomLeftRadius: props?.watch(`sections.${props?.id}.open`)
            ? 0
            : "6px",
          borderBottomRightRadius: props?.watch(`sections.${props?.id}.open`)
            ? 0
            : "6px",
        }}
        onClick={handleToggle}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <IoMenu
            style={{
              fontSize: 28,
              cursor: "move",
            }}
            {...listeners}
            {...attributes}
          />
          <Typography
            variant="h6"
            sx={{
              cursor: "default",
            }}
          >
            {props?.s?.title}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={(e) => e?.stopPropagation()}
        >
          <EditSection {...props} />
          <Backdrop
            sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
            open={deleteMutation?.isPending}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <IconButton onClick={handleRemoveSection}>
            <FaTrash
              style={{
                fontSize: 14,
              }}
            />
          </IconButton>
          <IconButton onClick={handleToggle}>
            {props?.watch(`sections.${props?.id}.open`) ? (
              <IoIosArrowUp
                style={{
                  fontSize: 18,
                }}
              />
            ) : (
              <IoIosArrowDown
                style={{
                  fontSize: 18,
                }}
              />
            )}
          </IconButton>
        </Box>
      </Box>
      <Collapse
        in={props?.watch(`sections.${props?.id}.open`)}
        timeout="auto"
        unmountOnExit
      >
        <Box>
          <ViewContentSection {...props} />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              paddingX: 4,
              paddingY: 2,
              gap: 2,
            }}
          >
            <AddLesson {...props} />
            <AddQuiz {...props} />
          </Box>
        </Box>
      </Collapse>
    </ListItem>
  );
};

export default ViewSection;
