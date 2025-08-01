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
  CircularProgress,
  IconButton,
  List,
  ListItem,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { FaEdit, FaTrash, MdDragIndicator } from "@acadlix/helpers/icons";
import {
  PostSortContent,
  RemoveContentFromSection,
} from "@acadlix/requests/admin/AdminCourseRequest";
import EditLesson from "./EditLesson";
import { __, sprintf } from "@wordpress/i18n";
import { hasCapability } from "@acadlix/helpers/util";

const Preview = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true' ?
    import("@acadlix/pro/admin/course/Preview") :
    import("@acadlix/free/admin/course/Preview")
);

const ViewProContentSection = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true' ?
    import("@acadlix/pro/admin/views/course/sections/ViewProContentSection") :
    Promise.resolve({ default: () => null })
);

const ViewContentSection = (props) => {
  const [activeId, setActiveId] = React.useState(null);
  const sortMutation = PostSortContent(props?.s?.id);
  const handleDragEnd = (e) => {
    const { active, over } = e;
    if (active?.id !== over?.id) {
      const oldIndex = props?.s?.contents?.findIndex(
        (curr) => curr.sort === active?.id
      );
      const newIndex = props?.s?.contents?.findIndex(
        (curr) => curr.sort === over?.id
      );
      // console.log(
      //   arrayMove(
      //     props?.watch(`sections.${props?.id}.contents`),
      //     oldIndex,
      //     newIndex
      //   )
      // );
      props?.setValue(
        `sections.${props?.id}.contents`,
        arrayMove(
          props?.watch(`sections.${props?.id}.contents`),
          oldIndex,
          newIndex
        )
      );
      sortMutation?.mutate(
        {
          active_menu_order: active?.id,
          over_menu_order: over?.id,
        },
        {
          onSuccess: (data) => {
            props?.setValue(
              `sections.${props?.id}.contents`,
              data?.data?.contents?.map((c) => {
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
            );
          },
          onError: (error) => {
            props?.setValue(
              `sections.${props?.id}.contents`,
              arrayMove(
                props?.watch(`sections.${props?.id}.contents`),
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
    setActiveId(active?.id);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <Box
      sx={{
        paddingX: 4,
        paddingY: 2,
      }}
    >
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
            items={props?.watch(`sections.${props?.id}.contents`)}
            strategy={verticalListSortingStrategy}
          >
            {props?.watch(`sections.${props?.id}.contents`)?.length > 0 &&
              props
                ?.watch(`sections.${props?.id}.contents`)
                ?.map((c, index) => (
                  <SortableSections
                    key={index}
                    content_id={index}
                    c={c}
                    content_activeId={activeId}
                    {...props}
                  />
                ))}
          </SortableContext>
          <DragOverlay>
            {activeId ? (
              <ActiveItem
                activeId={activeId}
                s={props?.s}
                colorCode={props?.colorCode}
              />
            ) : null}
          </DragOverlay>
        </List>
      </DndContext>
    </Box>
  );
};

const ActiveItem = React.forwardRef(({ activeId, ...props }, ref) => {
  const c = props?.s?.contents?.find((c) => c?.sort === activeId);
  return (
    <ListItem
      ref={ref}
      {...props}
      sx={{
        padding: 0,
        display: "block",
        border: `1px solid ${props?.colorCode?.view_content_border}`,
        borderRadius: "6px",
        opacity: 1,
        cursor: "grab",
        opacity: 0.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: props?.colorCode?.view_content_background,
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
          <MdDragIndicator
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
  );
});

const SortableSections = (props) => {
  const { attributes, listeners, setNodeRef, transition, isOver } = useSortable(
    {
      id: props?.c?.sort,
      disabled: !hasCapability("acadlix_sort_course_section_content"),
    }
  );

  const removeContentMutation = RemoveContentFromSection(
    props?.s?.id,
    props?.c?.id
  );
  const handleRemoveContent = () => {
    /* translators: %s is the type of item being removed */
    const message = sprintf(
      __('Are you sure you want to remove this %s from this section?', 'acadlix'),
      props?.c?.type
    );
    if (confirm(message)) {
      removeContentMutation?.mutate(
        {},
        {
          onSuccess: (data) => {
            props?.setValue(
              `sections.${props?.id}.contents`,
              data?.data?.section?.contents?.map((c) => {
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
            );
          },
        }
      );
    }
  };

  // const tooglePreviewMutation = PostTooglePreviewContent(props?.s?.id, props?.c?.id);

  // const handleTooglePreview = () => {
  //   tooglePreviewMutation?.mutate(
  //     {
  //       preview: !props?.c?.preview,
  //     },
  //     {
  //       onSuccess: (data) => {
  //         props?.setValue(
  //           `sections.${props?.id}.contents`,
  //           data?.data?.section?.contents?.map((c) => {
  //             return {
  //               id: c?.ID,
  //               sort: c?.menu_order,
  //               preview: Boolean(Number(c?.rendered_metas?.preview)),
  //               type: c?.contentable?.type,
  //               title: c?.contentable?.title,
  //               contentable_id: c?.contentable?.id,
  //               course_section_id: c?.post_parent,
  //             };
  //           })
  //         );
  //       },
  //     }
  //   );
  // }

  return (
    <ListItem
      ref={setNodeRef}
      sx={{
        transition: transition,
        padding: 0,
        display: "block",
        border: `1px ${isOver ? "dotted" : "solid"} ${props?.colorCode?.view_content_border
          }`,
        borderRadius: "6px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: props?.colorCode?.view_content_background,
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
          <MdDragIndicator
            style={{
              fontSize: 28,
              cursor: hasCapability("acadlix_sort_course_section_content") ? "move" : "default",
              opacity: hasCapability("acadlix_sort_course_section_content") ? 1 : 0.5,
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
            {props?.c?.title}
          </Typography>
        </Box>
        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open={removeContentMutation?.isPending}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {props?.c?.type === "quiz" && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {
              hasCapability("acadlix_edit_course_section_quiz") &&
              <Tooltip title="Edit Quiz">
                <IconButton
                  component="a"
                  target="_blank"
                  href={`${acadlixOptions?.acadlix_quiz_url}#/edit/${props?.c?.contentable_id}`}
                >
                  <FaEdit style={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
            }
            {
              hasCapability("acadlix_delete_course_section_content") &&
              <Tooltip title={__('Delete Quiz', 'acadlix')}>
                <IconButton onClick={handleRemoveContent}>
                  <FaTrash
                    style={{
                      fontSize: 14,
                    }}
                  />
                </IconButton>
              </Tooltip>
            }
          </Box>
        )}
        {props?.c?.type === "lesson" && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <React.Suspense fallback={null}>
              <Preview {...props} />
            </React.Suspense>
            {
              hasCapability("acadlix_edit_course_section_lesson") && hasCapability("acadlix_edit_lesson") &&
              <EditLesson {...props} />
            }
            {
              hasCapability("acadlix_delete_course_section_content") &&
              <Tooltip title={__("Delete Lesson", "acadlix")}>
                <IconButton onClick={handleRemoveContent}>
                  <FaTrash
                    style={{
                      fontSize: 14,
                    }}
                  />
                </IconButton>
              </Tooltip>
            }
          </Box>
        )}
        <React.Suspense fallback={null}>
          <ViewProContentSection 
          {...props}
          handleRemoveContent={handleRemoveContent}
          />
        </React.Suspense>
      </Box>
    </ListItem>
  );
};

export default ViewContentSection;
