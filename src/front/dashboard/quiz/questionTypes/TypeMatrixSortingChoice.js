import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { Box, List, ListItem, Typography } from "@mui/material";
import React from "react";

const TypeMatrixSortingChoice = (props) => {
  console.log(props?.answer_data?.[props?.type]);
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
    const { active, over } = e;
    console.log(over);
    setActiveId(active.id);
  };

  return (
    <Box
      sx={{
        display: props?.selected ? "block" : "none",
      }}
    >
      <Typography>
        {props?.question}
        <br />
      </Typography>
      <Box
        sx={{
          width: "100%",
          backgroundColor:
            props?.watch("mode") !== "advance_mode"
              ? props?.colorCode?.option_background
              : "",
          border:
            props?.watch("mode") !== "advance_mode"
              ? `1px solid ${props?.colorCode?.option_border}`
              : "",
          padding: props?.watch("mode") !== "advance_mode" ? "5px" : 0,
          marginTop: props?.watch("mode") !== "advance_mode" ? "5px" : 0,
          marginBottom: props?.watch("mode") !== "advance_mode" ? "10px" : 0,
        }}
      >
        <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
          <List
            sx={{
              display: "grid",
              gap: "10px",
              gridTemplateColumns: "repeat(5, 1fr)",
              backgroundColor: "lightgrey",
              padding: "10px",
              marginBottom: 2,
            }}
          >
            {props?.answer_data?.[props?.type]?.map((item, index) => (
              <DraggableItem
                key={index}
                id={index}
                item={item}
                activeId={activeId}
              />
            ))}
            <DragOverlay>
              {activeId ? <Item id={activeId} /> : null}
            </DragOverlay>
          </List>
          <List
            sx={{
              display: "grid",
              gap: "10px",
              backgroundColor: "lightgrey",
              padding: "10px",
            }}
          >
            {props?.answer_data?.[props?.type]?.map((item, index) => (
              <ListItem
                sx={{
                  border: "1px dotted black",
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
                <DroppableItem key={index} id={index} item={item} />
              </ListItem>
            ))}
          </List>
        </DndContext>
      </Box>
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
      {id}
    </ListItem>
  );
});

const DraggableItem = (props) => {
  const { attributes, listeners, setNodeRef, transition } = useDraggable({
    id: props.id,
  });

  return (
    <ListItem
      ref={setNodeRef}
      sx={{
        transition: transition,
        border: "1px dotted black",
        borderRadius: 1,
        backgroundColor: "white",
        cursor: "move",
        opacity: props?.id === props?.activeId ? 0.4 : 1,
        touchAction: "none",
      }}
      {...attributes}
      {...listeners}
    >
      {props?.item?.element}
    </ListItem>
  );
};

const DroppableItem = (props) => {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
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
