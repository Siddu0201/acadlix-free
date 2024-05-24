import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
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
import { Box, List, ListItem, Typography } from "@mui/material";
import React from "react";

const TypeSortingChoice = (props) => {
  const [activeId, setActiveId] = React.useState(null);
  const handleDragEnd = (e) => {
    // console.log(e);
    const { active, over } = e;

    if (active?.id !== over?.id) {
      const oldIndex = props?.answer_data?.[props?.type].findIndex(
        (curr) => curr.option === active.id
      );
      const newIndex = props?.answer_data?.[props?.type].findIndex(
        (curr) => curr.option === over.id
      );
      props?.setValue(
        `questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}`,
        arrayMove(props?.answer_data?.[props?.type], oldIndex, newIndex),
        { shouldDirty: true }
      );

      let data = props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}`);
      props?.setValue(
        `questions.${props?.index}.result`,
        {
          ...props?.watch(`questions.${props?.index}.result`),
          correct_count: data?.filter((d,index) => d.position === index).length === data.length ? 1 : 0,
          incorrect_count: data?.filter((d,index) => d.position === index).length === data.length ? 0 : 1,
          solved_count: 1,
          answer_data: data,
        }
        ,
        {shouldDirty: true}
      );
    }
    setActiveId(null);
  };

  const handleDragStart = (e) => {
    const { active } = e;

    setActiveId(active.id);
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
        display: props?.selected ? "block" : "none",
      }}
    >
      <Typography>
        {props?.question}
        <br />
      </Typography>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <List
          sx={{
            display: "grid",
            gap: "10px",
          }}
        >
          <SortableContext
            items={props?.answer_data?.[props?.type]}
            strategy={verticalListSortingStrategy}
          >
            {props?.answer_data?.[props?.type].map((item, index) => (
              <SortableItem
                key={index}
                id={index}
                item={item}
                activeId={activeId}
              />
            ))}
          </SortableContext>
          <DragOverlay>{activeId ? <Item id={activeId} /> : null}</DragOverlay>
        </List>
      </DndContext>
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

const SortableItem = (props) => {
  const { attributes, listeners, setNodeRef, transition } =
    useSortable({ id: props.item?.option });

  return (
    <ListItem
      ref={setNodeRef}
      sx={{
        transition: transition,
        border: "1px dotted black",
        borderRadius: 1,
        backgroundColor: "white",
        cursor: "move",
        opacity: props?.item?.option === props?.activeId ? 0.4 : 1,
        touchAction: "none",
      }}
      {...attributes}
      {...listeners}
    >
      {props?.item?.option}
    </ListItem>
  );
};

export default TypeSortingChoice;
