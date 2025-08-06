import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  rectIntersection,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { Avatar, Box, List, ListItem, Typography } from "@mui/material";
import React from "react";
import { __ } from "@wordpress/i18n";
import { RxCross2, TiTick } from "@acadlix/helpers/icons";

import CustomLatex from "@acadlix/modules/latex/CustomLatex";
import { getCurrentDateString } from "@acadlix/helpers/util";

const TypeMatrixSortingChoice = (props) => {
  const [activeId, setActiveId] = React.useState(null);

  const handleDragEnd = (e) => {
    const { active, over } = e;
    if (!active || !over) {
      setActiveId(null);
      return;
    }

    const active_id = active.id;
    const over_id = over.id;
    const active_type = active.data.current?.type; // "top" or "bottom"
    const over_type = over.data.current?.type; // "top" or "bottom"

    if (active_id === over_id) {
      setActiveId(null);
      return; // No movement
    }

    if (active_type === "top" && over_type === "top") {
      // 🟢 Case 1: Shuffling within "top"
      handleReorderTop(active_id, over_id);
    } else if (active_type === "bottom" && over_type === "bottom") {
      // 🔵 Case 2: Shuffling within "bottom"
      const result = handleReorderBottom(active_id, over_id);
      if (result) {
        handleResult(); // 🔥 Additional operations for bottom
      }
    } else if (active_type === "top" && over_type === "bottom") {
      // 🟠 Case 3: Moving from "top" to "bottom"
      const result = handleMoveTopToBottom(active_id, over_id);
      if (result) {
        handleResult(); // 🔥 Additional operations for bottom
      }
    } else if (active_type === "bottom" && over_type === "top") {
      // 🔴 Case 4: Moving from "bottom" to "top"
      handleMoveBottomToTop(active_id, over_id);
      handleResult(); // 🔥 Additional operations for bottom
    }

    setActiveId(null);
  };

  const handleReorderTop = (active_id, over_id) => {
    const oldIndex = props?.watch(`questions.${props?.index}.shuffle_order`).findIndex(
      (curr) => curr === active_id
    );
    const newIndex = props?.watch(`questions.${props?.index}.shuffle_order`).findIndex(
      (curr) => curr === over_id
    );
    props?.setValue(
      `questions.${props?.index}.shuffle_order`,
      arrayMove(props?.watch(`questions.${props?.index}.shuffle_order`), oldIndex, newIndex),
      { shouldDirty: true }
    );
  }

  const handleReorderBottom = (active_id, over_id) => {
    // check if over is not null
    const isOverNull = props?.watch(`questions.${props?.index}.language`)
      ?.find((l) => l?.default)
      ?.answer_data[props?.type]
      ?.find((d) => d?.correctPosition === over_id)
      ?.yourPosition === null;

    props?.setValue(
      `questions.${props?.index}.language`,
      props?.watch(`questions.${props?.index}.language`).map((lang) => {
        lang.answer_data[props?.type] = lang.answer_data[props?.type]?.map((d) => {
          if (isOverNull) {
            if (d.correctPosition === over_id) {
              return { ...d, yourPosition: active_id };
            }
            if (d?.yourPosition === active_id) {
              return { ...d, yourPosition: null };
            }
          } else {
            if (d?.yourPosition === active_id) {
              return { ...d, yourPosition: over_id };
            }
            if (d?.yourPosition === over_id) {
              return { ...d, yourPosition: active_id };
            }
          }
          return d;
        });
        return lang;
      }),
    );
    return true;
  }

  const handleMoveTopToBottom = (active_id, over_id) => {
    // check if over is not null
    const over = props?.watch(`questions.${props?.index}.language`)
      ?.find((l) => l?.default)
      ?.answer_data[props?.type]
      ?.find((d) => d?.correctPosition === over_id);

    if (over?.yourPosition !== null) {
      return false;
    }
    props?.setValue(
      `questions.${props?.index}.shuffle_order`,
      props?.watch(`questions.${props?.index}.shuffle_order`)?.filter((d) => d !== active_id),
      { shouldDirty: true }
    );
    props?.setValue(
      `questions.${props?.index}.language`,
      props?.watch(`questions.${props?.index}.language`).map((lang) => {
        lang.answer_data[props?.type] = lang.answer_data[props?.type]?.map((d) => {
          if (d.correctPosition === over_id) {
            return { ...d, yourPosition: active_id };
          }
          return d;
        });
        return lang;
      }),
    );
    return true;
  }

  const handleMoveBottomToTop = (active_id, over_id) => {
  }

  const handleResult = () => {
    let data = props?.watch(`questions.${props?.index}.language`)
      ?.find((l) => l?.default)
      ?.answer_data[props?.type];
    props?.setValue(
      `questions.${props?.index}.result`,
      {
        ...props?.watch(`questions.${props?.index}.result`),
        correct_count:
          data?.filter((d, index) => d.yourPosition == d.correctPosition).length ===
            data.length
            ? 1
            : 0,
        incorrect_count:
          data?.filter((d, index) => d.yourPosition == d.correctPosition).length ===
            data.length
            ? 0
            : 1,
        solved_count: 1,
        answer_data: data?.map((d) => d.yourPosition),
        attempted_at: getCurrentDateString(),
      },
      { shouldDirty: true }
    );
  }

  const handleDragStart = (e) => {
    const { active } = e;
    setActiveId(active?.id);
  };

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 8,
      },
    }),
    useSensor(MouseSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <Box
      sx={{
        width: props?.watch("mode") !== "advance_mode" || props?.watch("view_answer") ? "100%" : "auto",
        padding: props?.watch("mode") !== "advance_mode" || props?.watch("view_answer") ? 0 : 2,
        marginY: props?.watch("mode") !== "advance_mode" || props?.watch("view_answer") ? "5px" : 0,
        overflow: "auto",
      }}
    >
      {(props?.watch("view_answer") ||
        props?.watch(`questions.${props?.index}.check`)) && (
          <Typography
            sx={{
              paddingY: 2,
            }}
          >
            <b>{__("Your answer", "acadlix")}</b>
          </Typography>
        )}
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        {!(props?.watch("view_answer") ||
          props?.watch(`questions.${props?.index}.check`)) && (
            <Box sx={{
              backgroundColor: "#fff",
              borderRadius: 1,
              border: (theme) => `1px solid ${theme.palette.grey[300]}`,
              boxShadow: (theme) => theme?.shadows[2],
              padding: "10px !important",
              marginY: "8px !important",
            }}>
              <Typography variant="body2" sx={{
                fontWeight: "bold"
              }}>
                {__("Pick Elements", "acadlix")}
              </Typography>
              <List
                sx={{
                  padding: `0px !important`,
                  display: "grid",
                  gap: "8px",
                  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                }}
              >
                <SortableContext
                  items={props?.watch(`questions.${props?.index}.shuffle_order`)}
                >
                  {props?.watch(`questions.${props?.index}.shuffle_order`)?.map((item, index) => (
                    <SortableItem
                      key={index}
                      id={item}
                      element={props?.answer_data?.[props?.type]?.find((opt) => opt?.correctPosition == item)?.element}
                      activeId={activeId}
                      isDisabled={props?.isDisabled ?? false}
                    />
                  ))}
                </SortableContext>
                <DragOverlay>
                  {activeId !== null && activeId !== undefined
                    ? <Item
                      id={activeId}
                      element={props?.answer_data?.[props?.type]?.find((opt) => opt?.correctPosition == activeId)?.element}
                    />
                    : null}
                </DragOverlay>
              </List>
            </Box>
          )
        }
        <List
          sx={{
            display: "grid",
            gap: "8px",
            padding: "0px !important",
          }}
        >
          {props?.answer_data?.[props?.type]?.map((item, index) => (
            <ListItem
              key={index}
              sx={{
                borderRadius: 1,
                border: props?.watch(`questions.${props?.index}.check`)
                  ? item?.correctPosition == item?.yourPosition
                    ? (theme) => `1px solid ${theme.palette.success.dark}`
                    : (theme) => `1px solid ${theme.palette.error.dark}`
                  : (theme) => `1px solid ${theme.palette.grey[300]}`,
                backgroundColor: props?.watch(`questions.${props?.index}.check`)
                  ? item?.correctPosition == item?.yourPosition
                    ? (theme) => theme.palette.success.light
                    : (theme) => theme.palette.error.light
                  : "transparent",
                paddingX: {
                  xs: 2,
                  sm: 4,
                },
              }}
            >
              <Box
                sx={{
                  borderRight: "1px dotted black",
                  paddingRight: 1,
                }}
              >
                <Typography component="span">
                  <CustomLatex>
                    {item?.criteria}
                  </CustomLatex>
                </Typography>
              </Box>
              <DroppableItem
                key={index}
                id={item?.correctPosition}
                item={item}
                activeId={activeId}
                element={item?.element}
                yourPosition={item?.yourPosition}
                yourElement={props?.answer_data?.[props?.type]?.find((opt) => opt?.correctPosition == item?.yourPosition)?.element}
                activeElement={props?.answer_data?.[props?.type]?.find((opt) => opt?.correctPosition == activeId)?.element}
                isDisabled={props?.isDisabled ?? false }
              />
              {(props?.watch("view_answer") ||
                props?.watch(`questions.${props?.index}.check`)) && (
                  <Box
                    sx={{
                      position: "absolute",
                      right: "8px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {item?.correctPosition == item?.yourPosition ? (
                      <Avatar
                        sx={{
                          height: {
                            xs: 24,
                          },
                          width: {
                            xs: 24,
                          },
                          bgcolor: (theme) => theme?.palette?.success?.main,
                        }}
                      >
                        <TiTick />
                      </Avatar>
                    ) : (
                      <Avatar
                        sx={{
                          height: {
                            xs: 24,
                          },
                          width: {
                            xs: 24,
                          },
                          bgcolor: (theme) => theme.palette.error?.main,
                        }}
                      >
                        <RxCross2 />
                      </Avatar>
                    )}
                  </Box>
                )}
            </ListItem>
          ))}
        </List>
      </DndContext>
      {(props?.watch("view_answer") ||
        props?.watch(`questions.${props?.index}.check`)) && (
          <>
            <Typography
              sx={{
                paddingY: 2,
              }}
            >
              <b>{__("Correct answer", "acadlix")}</b>
            </Typography>
            <List
              sx={{
                display: "grid",
                gap: "8px",
                padding: "0px !important",
              }}
            >
              {props?.answer_data?.[props?.type]?.map((item, index) => (
                <ListItem
                  key={index}
                  sx={{
                    border: "1px dotted black",
                    borderRadius: 1,
                  }}
                >
                  <Box
                    sx={{
                      borderRight: "1px dotted black",
                      minWidth: "20%",
                    }}
                  >
                    <Typography component="span">
                      <CustomLatex>
                        {item?.criteria}
                      </CustomLatex>
                    </Typography>
                  </Box>
                  <List sx={{
                    paddingY: 0,
                    paddingX: 1,
                  }}>
                    <ListItem
                      sx={{
                        border: "1px dotted black",
                        borderRadius: 1,
                        backgroundColor: "white",
                        cursor: "pointer",
                        opacity: 1,
                        margin: `0 !important`,
                      }}
                    >
                      <CustomLatex>
                        {item?.element}
                      </CustomLatex>
                    </ListItem>
                  </List>
                </ListItem>
              ))}
            </List>
          </>
        )}
    </Box>
  );
};

const Item = React.forwardRef(({ id, ...props }, ref) => {
  return (
    <ListItem
      ref={ref}
      sx={{
        border: "1px dotted black",
        borderRadius: 1,
        backgroundColor: "white",
        opacity: 0.8,
        cursor: "move",
        margin: `0 !important`,
      }}
    >
      <CustomLatex>
        {props?.element}
      </CustomLatex>
    </ListItem>
  );
});

const SortableItem = (props) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: props?.id,
    data: {
      type: props?.type ?? "top"
    },
    disabled: props?.isDisabled
  });

  const style = {
    transform: `translate(${transform?.x ?? 0}px , ${transform?.y ?? 0}px)`,
  };

  return (
    <ListItem
      ref={setNodeRef}
      sx={{
        ...style,
        border: "1px dotted black",
        borderRadius: 1,
        backgroundColor: "white",
        cursor: props?.view_answer || props?.check ? "pointer" : "move",
        opacity: props?.id === props?.activeId ? 0.4 : 1,
        margin: `0 !important`,
      }}
      {...attributes}
      {...listeners}
    >
      <CustomLatex>
        {props?.element}
      </CustomLatex>
    </ListItem>
  );
};

const DroppableItem = (props) => {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
    data: {
      type: "bottom"
    },
  });

  if (isOver && props?.activeId !== null) {
    return (
      <List sx={{
        paddingY: 0,
        paddingX: 1,
      }}>
        <Item
          id={props?.activeId}
          element={props?.activeElement}
        />
      </List>
    )
  }

  if (props?.yourPosition) {
    return (
      <List sx={{
        paddingY: 0,
        paddingX: 1,
      }}>
        <SortableItem
          id={props?.yourPosition}
          element={props?.yourElement}
          activeId={props?.activeId}
          type="bottom"
          isDisabled={props?.isDisabled}
        />
      </List>
    )
  }

  return (
    <Box
      ref={setNodeRef}
      sx={{
        height: "30px",
        minWidth: "70%",
        marginX: "10px",
      }}
    ></Box>
  );
};

export default TypeMatrixSortingChoice;
