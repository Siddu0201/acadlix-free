import { Dialog } from "@mui/material";
import React, { useEffect, useState } from "react";

const BootstrapDialog = ({
  xs = "100%",
  sm = "70%",
  md = "60%",
  xl = "100%",
  height = {
    xs: "auto", // 70% height on small screens
    sm: "auto", // 60% height on medium screens
    md: "auto",
    xl: "auto", // 50% height on larger screens
  },
  contentMaxHeight = {
    xs: "450px",
    sm: "350px",
    md: "350px",
    xl: "450px",
  },
  ...props
}) => {

  const [container, setContainer] = useState(undefined);

  useEffect(() => {
    const editor = window?.tinymce?.activeEditor;
    if(!editor) return;
    if(!props?.open) return;
    const originalFocus = editor.focus;
    editor.focus = () => {};

    return () => {
      editor.focus = originalFocus;
    };
    
  }, [props?.open]);

  return (
    <Dialog
      {...props}
      open={props?.open}
      onClose={props?.onClose}
      {...(container ? { container } : {})}
      maxWidth="md"
      disableAutoFocus
      disableEnforceFocus
      disableRestoreFocus
      slotProps={{
        paper: {
          sx: {
            width: {
              xs: xs,
              sm: sm,
              md: md,
              xl: xl,
            },
              height: {
                xs: height.xs,
                sm: height.sm,
                md: height.md,
                xl: height.xl,
              },
            margin: 4,
          },
        },
      }}
      sx={{
        "& .MuiDialogContent-root": {
          padding: 2,
          maxHeight: {
            xs: contentMaxHeight.xs,
            sm: contentMaxHeight.sm,
            md: contentMaxHeight.md,
            xl: contentMaxHeight.xl,
          },
        },
        "& .MuiIconButton-root": {
          padding: 0,
        },
      }}
    >
      {props?.children}
    </Dialog>
  );
};

export default BootstrapDialog;
