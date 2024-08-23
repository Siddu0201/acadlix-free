import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
  Typography,
} from "@mui/material";
import React from "react";
import { IoClose } from "react-icons/io5";
import InstructionLanguage from "../../advance-instruction-section/InstructionLanguage";

const InstructionModel = (props) => {
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));
  return (
    <BootstrapDialog
      maxWidth={props?.isDesktop ? "lg" : "xs"}
      open={props?.open}
      onClose={props?.handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: (theme) => theme?.palette?.primary?.main,
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ m: 0, p: 2, fontSize: "14px", color: "white" }}
        >
          Instruction
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={props?.handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 4,
            padding: 1,
            color: "white",
          }}
        >
          <IoClose />
        </IconButton>
      </Box>
      <DialogContent>
        <Box
          sx={{
            borderRadius: "4px",
            border: "2px solid black",
          }}
        >
          <Typography
            sx={{
              color: "red",
              fontSize: "24px",
            }}
          >
            Note that timer is ticking while you read the instruction. Close
            this page to return to answering the question.
          </Typography>
          <Box sx={{
            paddingX: 4
          }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  color: "#2F72B7",
                  fontWeight: "bold",
                }}
              >
                Instructions
              </Typography>
            </Box>
            <Box>
              <InstructionLanguage {...props} />
            </Box>
            {props?.watch("languages")?.length > 0 &&
              props?.watch("languages")?.map((l, index) => (
                <Box
                  key={index}
                  sx={{
                    display: l?.selected ? "" : "none",
                  }}
                >
                  {l?.instruction1}
                </Box>
              ))}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                paddingY: 4,
              }}
            >
              <Typography
                sx={{
                  color: "#2F72B7",
                  fontWeight: "bold",
                }}
              >
                Other important instructions
              </Typography>
            </Box>
            {props?.watch("languages")?.length > 0 &&
              props?.watch("languages")?.map((l, index) => (
                <Box
                  key={index}
                  sx={{
                    display: l?.selected ? "" : "none",
                  }}
                >
                  {l?.instruction2}
                </Box>
              ))}
          </Box>
        </Box>
      </DialogContent>
    </BootstrapDialog>
  );
};

export default InstructionModel;
