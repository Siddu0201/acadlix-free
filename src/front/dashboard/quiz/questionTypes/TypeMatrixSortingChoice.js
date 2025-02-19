import {
  closestCenter,
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  rectIntersection,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { Box, List, ListItem, Typography } from "@mui/material";
import React from "react";
import { __ } from "@wordpress/i18n";

const TypeMatrixSortingChoice = (props) => {
  const [activeId, setActiveId] = React.useState(null);

  const handleDragEnd = (e) => {
    const { active, over } = e;
    console.log(active, over);
    // if (active?.id !== over?.id) {
    //   const oldIndex = props?.answer_data?.[props?.type].findIndex(
    //     (curr) => curr.option === active.id
    //   );
    //   const newIndex = props?.answer_data?.[props?.type].findIndex(
    //     (curr) => curr.option === over.id
    //   );
    //   props?.setValue(
    //     `questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}`,
    //     arrayMove(props?.answer_data?.[props?.type], oldIndex, newIndex),
    //     { shouldDirty: true }
    //   );
    // }
    setActiveId(null);
  };

  const handleDragStart = (e) => {
    const { active } = e;
    // console.log(active);
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
        // backgroundColor:
        //   props?.watch("mode") !== "advance_mode"
        //     ? props?.colorCode?.option_background
        //     : "",
        // border:
        //   props?.watch("mode") !== "advance_mode"
        //     ? `1px solid ${props?.colorCode?.option_border}`
        //     : "",
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
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <List
          sx={{
            display: "grid",
            gap: "8px",
            gridTemplateColumns: "repeat(5, 1fr)",
            backgroundColor: "#fff",
            borderRadius: 1,
            border: (theme) => `1px solid ${theme.palette.grey[300]}`,
            boxShadow: (theme) => theme?.shadows[2],
            paddingY: "10px !important",
            marginY: "8px !important",
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
                <Typography>{item?.criteria}</Typography>
              </Box>
              <DroppableItem
                key={index}
                id={item?.correctPosition}
                item={item}
              />
            </ListItem>
          ))}
        </List>
      </DndContext>
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
      {props?.element}
    </ListItem>
  );
});

const SortableItem = (props) => {
  // const { attributes, listeners, setNodeRef, transition } = useDraggable({
  //   id: props.id,
  // });
  const { attributes, listeners, setNodeRef, transition, transform } = useSortable({
    id: props?.id,
    data: {
      type: props?.type ?? "top"
    }
  });


  const style = {
    transform: `translate(${transform?.x ?? 0}px , 0)`,
    transition,
  };

  return (
    <ListItem
      ref={setNodeRef}
      sx={{
        border: "1px dotted black",
        borderRadius: 1,
        backgroundColor: "white",
        cursor: "move",
        opacity: props?.id === props?.activeId ? 0.4 : 1,
        margin: `0 !important`,
        ...style
      }}
      {...attributes}
      {...listeners}
    >
      {props?.element}
    </ListItem>
  );
};

const DroppableItem = (props) => {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
    data: {
      type: "bottom"
    }
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        backgroundColor: isOver ? "yellow" : "transparent",
        height: "30px",
        minWidth: "70%",
        marginX: "10px",
      }}
    ></Box>
  );
};

export default TypeMatrixSortingChoice;
