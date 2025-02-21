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
  arrayMove,
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
      handleReorderBottom(active_id, over_id);
      handleResult(); // 🔥 Additional operations for bottom
    } else if (active_type === "top" && over_type === "bottom") {
      // 🟠 Case 3: Moving from "top" to "bottom"
      handleMoveTopToBottom(active_id, over_id);
      handleResult(); // 🔥 Additional operations for bottom
    } else if (active_type === "bottom" && over_type === "top") {
      // 🔴 Case 4: Moving from "bottom" to "top"
      handleMoveBottomToTop(active_id, over_id);
      handleResult(); // 🔥 Additional operations for bottom
    }

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
    console.log("bottom");
    props?.setValue(
      `questions.${props?.index}.language`,
      props?.watch(`questions.${props?.index}.language`).map((lang) => {
        lang.answer_data[props?.type] = lang.answer_data[props?.type]?.map((d) => {
          if (d.correctPosition === over_id) {
            return { ...d, yourPosition: active_id };
          }
          if(d?.yourPosition === active_id){
            return { ...d, yourPosition: null};
          }
          return d;
        });
        return lang;
      }),
    )
  }

  const handleMoveTopToBottom = (active_id, over_id) => {
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
    )
  }

  const handleMoveBottomToTop = (active_id, over_id) => {
    console.log("bottom to top");
  }

  const handleResult = () => {

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
                activeId={activeId}
                element={item?.element}
                yourPosition={item?.yourPosition}
                yourElement={props?.answer_data?.[props?.type]?.find((opt) => opt?.correctPosition == item?.yourPosition)?.element}
                activeElement={props?.answer_data?.[props?.type]?.find((opt) => opt?.correctPosition == activeId)?.element}
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
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: props?.id,
    data: {
      type: props?.type ?? "top"
    }
  });

  const style = {
    transform: `translate(${transform?.x ?? 0}px , ${transform?.y ?? 0}px)`,
  };

  console.log(props?.activeId);

  return (
    <ListItem
      ref={setNodeRef}
      sx={{
        ...style,
        border: "1px dotted black",
        borderRadius: 1,
        backgroundColor: "white",
        cursor: "move",
        opacity: props?.id === props?.activeId ? 0.4 : 1,
        margin: `0 !important`,
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
    },
    disabled: props?.yourPosition !== null
  });

  if (props?.yourPosition) {
    return (
      <List sx={{
        paddingX: 1,
      }}>
        <SortableItem
          id={props?.yourPosition}
          element={props?.yourElement}
          activeId={props?.activeId}
          type="bottom"
        />
      </List>
    )
  }

  if (isOver && props?.activeId !== null) {
    return (
      <List sx={{
        paddingX: 1,
      }}>
        <Item
          id={props?.activeId}
          element={props?.activeElement}
        />
      </List>
    )
  }

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
