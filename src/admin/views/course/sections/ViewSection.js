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
  Typography,
} from "@mui/material";
import React from "react";
import { FaEdit, FaPlus, FaTrash, IoIosArrowDown, IoIosArrowUp, IoMenu } from "@acadlix/helpers/icons";
import EditSection from "./EditSection";
import AddLesson from "./AddLesson";
import AddQuiz from "./AddQuiz";
import {
  DeleteSectionById,
  PostSortSection,
} from "@acadlix/requests/admin/AdminCourseRequest";
import toast from "react-hot-toast";
import ViewContentSection from "./ViewContentSection";
import { __ } from "@wordpress/i18n";
import { hasCapability } from "@acadlix/helpers/util";

const ViewProSection = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true' ?
    import("@acadlix/pro/admin/views/course/sections/ViewProSection") :
    Promise.resolve({ default: () => null })
);

const ViewSection = (props) => {
  const [activeId, setActiveId] = React.useState(null);

  const sortMutation = PostSortSection(props?.watch("courseId"));
  const handleDragEnd = (e) => {
    const { active, over } = e;
    if (active?.id !== over?.id) {
      const oldIndex = props
        ?.watch("sections")
        .findIndex((curr) => curr.menu_order === active?.id);
      const newIndex = props
        ?.watch("sections")
        .findIndex((curr) => curr.menu_order === over?.id);

      // console.log(arrayMove(props?.watch("sections"), oldIndex, newIndex));  
      props?.setValue(
        "sections",
        arrayMove(props?.watch("sections"), oldIndex, newIndex)
      );
      sortMutation?.mutate(
        {
          active_menu_order: active?.id,
          over_menu_order: over?.id,
        },
        {
          onSuccess: (data) => {
            props?.setValue(
              "sections",
              data?.data?.sections?.map((s) => {
                return {
                  id: s?.id,
                  post_title: s?.post_title,
                  post_content: s?.post_content,
                  show: false,
                  open:
                    props?.watch(`sections`)?.find((sec) => sec?.id === s?.id)
                      ?.open ?? false,
                  menu_order: s?.menu_order,
                  contents:
                    s?.contents?.length > 0
                      ? s?.contents?.map((c) => {
                        return {
                          id: c?.ID,
                          sort: c?.menu_order,
                          preview: Boolean(Number(c?.rendered_metas?.preview)),
                          type: c?.contentable?.type,
                          title: c?.contentable?.title,
                          contentable_id: c?.contentable?.id,
                          course_section_id: c?.post_parent,
                        };
                      })
                      : [],
                };
              })
            );
          },
          onError: (error) => {
            props?.setValue(
              "sections",
              arrayMove(props?.watch("sections"), newIndex, oldIndex)
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
  const s = props?.watch("sections")?.find((s) => id === s?.menu_order);
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
            {s?.post_title}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {
            hasCapability("acadlix_edit_course_section") && (
              <EditSection {...props} />
            )
          }
          {
            hasCapability("acadlix_delete_course_section") && (
              <IconButton>
                <FaTrash
                  style={{
                    fontSize: 14,
                  }}
                />
              </IconButton>
            )
          }
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
            {
              hasCapability("acadlix_add_course_section_lesson") &&
              <AddLesson {...props} />
            }
            {
              hasCapability("acadlix_add_course_section_quiz") &&
              <AddQuiz {...props} />
            }
            {
              !acadlixOptions?.isPro &&
              <Box>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  disabled
                >
                  <FaPlus
                    style={{
                      paddingRight: 4,
                    }}
                  />
                  {__("Add Assignment", "acadlix")}
                </Button>
              </Box>
            }
          </Box>
        </Box>
      </Collapse>
    </ListItem>
  );
});

const SortableSections = (props) => {
  const { attributes, listeners, setNodeRef, transition, isOver } =
    useSortable({
      id: props?.s?.menu_order,
      disabled: !hasCapability("acadlix_sort_course_section"),
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
        __("Are you sure you want to delete this section, this will also remove related quizzes and lessons.", "acadlix")
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
              cursor: hasCapability("acadlix_sort_course_section") ? "move" : "default",
              opacity: hasCapability("acadlix_sort_course_section") ? 1 : 0.5,
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
            {props?.s?.post_title}
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
          {
            hasCapability("acadlix_edit_course_section") &&
            <EditSection {...props} />
          }
          <Backdrop
            sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
            open={deleteMutation?.isPending}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          {
            hasCapability("acadlix_delete_course_section") &&
            <IconButton onClick={handleRemoveSection}>
              <FaTrash
                style={{
                  fontSize: 14,
                }}
              />
            </IconButton>
          }
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
            {
              hasCapability("acadlix_add_course_section_lesson") &&
              <AddLesson {...props} />
            }
            {
              hasCapability("acadlix_add_course_section_quiz") &&
              <AddQuiz {...props} />
            }
            {
              !acadlixOptions?.isPro &&
              <Box>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  disabled
                >
                  <FaPlus
                    style={{
                      paddingRight: 4,
                    }}
                  />
                  {__("Add Assignment", "acadlix")}
                </Button>
              </Box>
            }
            <React.Suspense fallback={null}>
              <ViewProSection {...props} />
            </React.Suspense>
          </Box>
        </Box>
      </Collapse>
    </ListItem>
  );
};

export default ViewSection;
