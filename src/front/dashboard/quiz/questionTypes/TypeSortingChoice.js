import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Avatar, Box, Chip, List, ListItem, Typography } from "@mui/material";
import React from "react";
import { TiTick, RxCross2 } from "@acadlix/helpers/icons";
import { __ } from "@wordpress/i18n";

import CustomLatex from "@acadlix/modules/latex/CustomLatex";

const TypeSortingChoice = (props) => {
  const [activeId, setActiveId] = React.useState(null);
  const handleDragEnd = (e) => {
    const { active, over } = e;

    if (active?.id !== over?.id) {
      const oldIndex = props?.answer_data?.[props?.type].findIndex(
        (curr) => curr.option === active.id
      );
      const newIndex = props?.answer_data?.[props?.type].findIndex(
        (curr) => curr.option === over.id
      );
      props?.setValue(
        `questions.${props?.index}.language`,
        props?.watch(`questions.${props?.index}.language`).map((lang) => {
          lang.answer_data[props?.type] = arrayMove(
            lang?.answer_data?.[props?.type],
            oldIndex,
            newIndex
          );
          return lang;
        })
      );
    setActiveId(null);

      let data = props?.watch(
        `questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}`
      );
      props?.setValue(
        `questions.${props?.index}.result`,
        {
          ...props?.watch(`questions.${props?.index}.result`),
          correct_count:
            data?.filter((d, index) => d.position === index).length ===
              data.length
              ? 1
              : 0,
          incorrect_count:
            data?.filter((d, index) => d.position === index).length ===
              data.length
              ? 0
              : 1,
          solved_count: 1,
          answer_data: data?.map((d) => d.position),
        },
        { shouldDirty: true }
      );
    }
  };

  const handleDragStart = (e) => {
    const { active } = e;
    setActiveId(active.id);
  };

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 8,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  return (
    <Box
      sx={{
        width: props?.watch("mode") !== "advance_mode" ? "100%" : "auto",
        padding: props?.watch("mode") !== "advance_mode" ? 0 : 2,
        marginY: props?.watch("mode") !== "advance_mode" ? "5px" : 0,
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
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <List
          sx={{
            display: "grid",
            gap: "8px",
            padding: `0 !important`,
            marginY: `0 !important`,
          }}
        >
          <SortableContext
            items={props?.answer_data?.[props?.type]?.map((item, index) => item?.option)}
            strategy={verticalListSortingStrategy}
          >
            {props?.answer_data?.[props?.type]?.map((item, index) => (
              <SortableItem
                key={index}
                id={index}
                item={item}
                activeId={activeId}
                {...props}
              />
            ))}
          </SortableContext>
          <DragOverlay>{activeId ? <Item id={activeId} /> : null}</DragOverlay>
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
              <b>Correct answer</b>
            </Typography>
            <List
              sx={{
                display: "grid",
                gap: "8px",
                padding: `0 !important`,
                marginY: `0 !important`,
              }}
            >
              {props?.answer_data?.[props?.type]
                ?.slice()
                ?.sort((a, b) => a.position - b.position)
                ?.map((item, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      border: "1px dotted black",
                      borderRadius: 1,
                      backgroundColor: "white",
                      cursor: "pointer",
                      margin: `0 !important`,
                    }}
                  >
                    <CustomLatex>
                      {item?.option}
                    </CustomLatex>
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
      {...props}
      sx={{
        border: "1px dotted black",
        borderRadius: 1,
        backgroundColor: "white",
        opacity: 0.8,
        cursor: "move",
      }}
    >
      <CustomLatex>
        {id}
      </CustomLatex>
    </ListItem>
  );
});

const SortableItem = (props) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: props.item?.option,
    disabled:
      props?.watch("view_answer") ||
      props?.watch(`questions.${props?.index}.check`),
  });
 
  const style = {
    transform: transform ? `translate(0, ${transform?.y}px)` : undefined,
  };

  return (
    <ListItem
      ref={setNodeRef}
      sx={{
        ...style,
        borderRadius: 1,
        border: props?.watch(`questions.${props?.index}.check`)
          ? props?.id === props?.item?.position
            ? (theme) => `1px solid ${theme.palette.success.dark}`
            : (theme) => `1px solid ${theme.palette.error.dark}`
          : (theme) => `1px solid ${theme.palette.grey[300]}`,
        backgroundColor: props?.watch(`questions.${props?.index}.check`)
          ? props?.id === props?.item?.position
            ? (theme) => theme.palette.success.light
            : (theme) => theme.palette.error.light
          : "transparent",
        cursor:
          props?.watch("view_answer") ||
            props?.watch(`questions.${props?.index}.check`)
            ? "pointer"
            : "move",
        opacity: props?.item?.option === props?.activeId ? 0.4 : 1,
        // touchAction: "none",
        justifyContent: "space-between",
        margin: `0 !important`,
      }}
      {...attributes}
      {...listeners}
    >
      <CustomLatex>
        {props?.item?.option}
      </CustomLatex>
      {(props?.watch("view_answer") ||
        props?.watch(`questions.${props?.index}.check`)) && (
          <Box
            sx={{
              position: "relative",
              marginLeft: "5px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {props?.id === props?.item?.position ? (
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
  );
};

export default TypeSortingChoice;
