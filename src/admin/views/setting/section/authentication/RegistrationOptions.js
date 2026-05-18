import {
  Box,
  Chip,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  Tooltip,
  Typography
} from '@mui/material'
import React from 'react'
import { __ } from '@wordpress/i18n'
import { FaEdit, FaTrash, MdDragIndicator } from '@acadlix/helpers/icons'
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import CustomSwitch from '@acadlix/components/CustomSwitch'
import BootstrapDialog from '@acadlix/components/BootstrapDialog'
import EditRegistrationOptions from './modals/EditRegistrationOptions'

const RegistrationOptions = (props) => {
  const [activeId, setActiveId] = React.useState(null);
  const [openId, setOpenId] = React.useState(null);
  const handleClose = () => {
    setOpenId(null);
  };

  const handleDragEnd = (e) => {
    const { active, over } = e;
    if (active?.id !== over?.id) {
      props?.setValue(
        `acadlix_registration_fields`,
        arrayMove(
          props?.watch(`acadlix_registration_fields`),
          active?.id,
          over?.id
        )
      );
      setActiveId(null);
    }
  }

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
    <Grid
      container
      spacing={{
        xs: 2,
        sm: 4
      }}
      sx={{
        alignItems: "center"
      }}>
      <Grid
        size={{ xs: 12, sm: 12, md: 12, lg: 12 }}
      >
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
              overflow: "auto"
            }}
          >
            <SortableContext
              items={props?.watch("acadlix_registration_fields")}
              strategy={verticalListSortingStrategy}
            >
              {props
                ?.watch("acadlix_registration_fields")
                ?.map((item, index) => {
                  return (
                    <SortableItem
                      key={index}
                      item={item}
                      index={index}
                      openId={openId}
                      handleClose={handleClose}
                      setOpenId={setOpenId}
                      {...props}
                    />
                  )
                })}
            </SortableContext>
            <DragOverlay>
              {activeId !== null ? (
                <ActiveItem
                  activeId={activeId}
                  item={props?.watch("acadlix_registration_fields")?.find((_, index) => index === activeId)}
                />
              ) : null}
            </DragOverlay>
          </List>
        </DndContext>
      </Grid>
    </Grid>
  )
}

const ActiveItem = React.forwardRef(({ activeId, ...props }, ref) => {
  return (
    <ListItem
      ref={ref}
      {...props}
      sx={{
        padding: 0,
        display: "block",
        border: `1px solid grey`,
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
          backgroundColor: "white",
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
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props?.item?.enabled}
                // onChange={(e) => {
                //     props?.setValue(
                //         `acadlix_dashboard_menu.${props?.index}.enabled`,
                //         e?.target?.checked,
                //         { shouldDirty: true }
                //     );
                // }}
                disabled={!props?.item?.controls?.can_disable}
              />}
            label=""
            sx={{
              marginRight: 0,
            }}
          />
          <Chip
            label={props?.item?.default ? __('Default', 'acadlix') : __('Custom', 'acadlix')}
            size="small"
            color={props?.item?.default ? 'success' : 'warning'}
            variant='filled'
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                cursor: "default",
                gap: 1,
              }}
            >
              {props?.item?.name}
              {
                props?.item?.required && (
                  <span style={{ color: 'red' }}>*</span>
                )
              }
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Tooltip title="Edit Item">
            <IconButton
            // onClick={() => props?.setOpenId(props?.index)}
            >
              <FaEdit style={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>
          {
            props?.item?.controls?.can_delete && (
              <Tooltip title={__("Delete Item", "acadlix")}>
                <IconButton
                // onClick={handleRemoveContent}
                >
                  <FaTrash
                    style={{
                      fontSize: 14,
                    }}
                  />
                </IconButton>
              </Tooltip>
            )
          }
        </Box>
      </Box>
    </ListItem>
  );
});

const SortableItem = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    isOver,
  } = useSortable(
    {
      id: props?.index,
    }
  );
  const handleRemoveContent = () => {
    if (confirm(__("Do you really want to delete this item?", "acadlix"))) {
      props?.setValue(
        "acadlix_registration_fields",
        props?.watch("acadlix_registration_fields").filter(
          (_, index) => index !== props?.index
        ),
        { shouldDirty: true }
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
        border: `1px ${isOver ? "dotted" : "solid"} grey`,
        borderRadius: "6px",
        boxShadow: (theme) => theme.shadows[3],
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: 'white',
          paddingX: 1,
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
              opacity: 1,
            }}
            {...listeners}
            {...attributes}
          />
          <FormControlLabel
            control={<CustomSwitch
              checked={props?.item?.enabled}
              onChange={(e) => {
                props?.setValue(
                  `acadlix_registration_fields.${props?.index}.enabled`,
                  e?.target?.checked,
                  { shouldDirty: true }
                );
              }}
              disabled={!props?.item?.controls?.can_disable}
            />}
            label=""
            sx={{
              marginRight: 0,
            }}
          />
          <Chip
            label={props?.item?.default ? __('Default', 'acadlix') : __('Custom', 'acadlix')}
            size="small"
            color={props?.item?.default ? 'success' : 'warning'}
            variant='filled'
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                cursor: "default",
                gap: 1,
              }}
            >
              {props?.item?.name}
              {
                props?.item?.required && (
                  <span style={{ color: 'red' }}> *</span>
                )
              }
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BootstrapDialog
            open={props?.openId === props?.index}
            onClose={props?.handleClose}
            aria-labelledby="quiz-dialog-title"
            aria-describedby="quiz-dialog-description"
          >
            <EditRegistrationOptions
              handleClose={props?.handleClose}
              create={false}
              index={props?.index}
              item={props?.item}
              {...props}
            />
          </BootstrapDialog>
          <Tooltip title="Edit Item">
            <IconButton
              onClick={() => props?.setOpenId(props?.index)}
            >
              <FaEdit style={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>
          {
            props?.item?.controls?.can_delete && (
              <Tooltip title={__("Delete Item", "acadlix")}>
                <IconButton
                  onClick={handleRemoveContent}
                >
                  <FaTrash
                    style={{
                      fontSize: 14,
                    }}
                  />
                </IconButton>
              </Tooltip>
            )
          }
        </Box>
      </Box>
    </ListItem>
  );
};

export default RegistrationOptions;