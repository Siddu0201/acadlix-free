import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import NtaLanguage from "./NtaLanguage";
import { FaUser } from "react-icons/fa";
import NtaTimer from "./NtaTimer";
import NtaTexture from "../../../../../../images/nta-texture.jpg";
const NtaUser = (props) => {
  return (
    <Box
      id="acadlix_nta_user"
      sx={{
        background: `url(${NtaTexture}) center center`,
        width: "100%",
        display: {
          md: "block",
          xs: "none",
        }
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: {
            lg: "1170px",
            md: "900px",
            sm: "750px",
            xs: "100%",
          },
          marginX: "auto",
          paddingX: 6,
          paddingY: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              border: `2px solid ${props?.colorCode?.user_icon_color}`,
              padding: 1,
            }}
          >
            <FaUser
              style={{
                color: props?.colorCode?.user_icon_color,
                height: "80px",
                width: "80px",
              }}
            />
          </Box>
          <Box>
            <Table
              sx={{
                border: "none",
                margin: 0,
              }}
            >
              <TableBody>
                <TableRow>
                  <TableCell
                    sx={{
                      border: "none",
                      padding: 0,
                    }}
                  >
                    Candidate Name
                  </TableCell>
                  <TableCell
                    sx={{
                      display: "flex",
                      gap: 1,
                      border: "none",
                      padding: 0,
                    }}
                  >
                    :{" "}
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: props?.colorCode?.user_data_color,
                      }}
                    >
                      {props?.watch("name")}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      border: "none",
                      padding: 0,
                    }}
                  >
                    Exam Name
                  </TableCell>
                  <TableCell
                    sx={{
                      display: "flex",
                      gap: 1,
                      border: "none",
                      padding: 0,
                    }}
                  >
                    :{" "}
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: props?.colorCode?.user_data_color,
                      }}
                    >
                      {props?.watch("title")}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      border: "none",
                      padding: 0,
                    }}
                  >
                    Subject Name
                  </TableCell>
                  <TableCell
                    sx={{
                      display: "flex",
                      gap: 1,
                      border: "none",
                      padding: 0,
                    }}
                  >
                    :{" "}
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: props?.colorCode?.user_data_color,
                      }}
                    >
                      {
                        props?.watch("subjects")?.find((s) => s?.selected)
                          ?.subject_name
                      }
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      border: "none",
                      padding: 0,
                    }}
                  >
                    Remaining Time
                  </TableCell>
                  <TableCell
                    sx={{
                      display: "flex",
                      gap: 1,
                      border: "none",
                      padding: 0,
                    }}
                  >
                    : <NtaTimer {...props} />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Box>
        {
          !props?.watch("finish") &&
          <Box>
            <NtaLanguage {...props} />
          </Box>
        }
      </Box>
    </Box>
  );
};

export default NtaUser;
