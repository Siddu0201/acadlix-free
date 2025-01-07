import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import React from "react";
import AcadlixLogo from "../../../images/acadlix_logo.png";
import {
  IoCheckmarkDoneSharp,
  AiOutlineFileSearch,
  RiUserHeartFill,
  BiSolidCommentDetail,
  FaCog,
  MdOutlineSupportAgent
} from "../../../helpers/icons";

const Home = () => {
  return (
    <Grid
      container
      spacing={4}
      rowSpacing={3}
      sx={{
        padding: 4,
      }}
    >
      <Grid item xs={12} md={12}>
        <Card>
          <CardContent
            sx={{
              padding: 6,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    paddingY: 3,
                  }}
                >
                  Welcome to <b>Acadlix</b>
                </Typography>
                <Typography>The Smart Solution for Modern Educator.</Typography>
              </Box>
              <Box
                component="img"
                sx={{
                  height: {
                    md: 50,
                    xs: 40,
                  },
                }}
                alt="Acadlix logo."
                src={AcadlixLogo}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={7 / 2}>
        <Card sx={{ height: "100%" }}>
          <CardHeader title="A demo text here" />
          <CardContent>
            <Box>
              <Typography>Demo text</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid container spacing={4} rowSpacing={3} sx={{ height: "100%" }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardHeader title="Quizes" />
              <CardContent>
                <Box>
                  <Typography>2500</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardHeader title="Questions" />
              <CardContent>
                <Box>
                  <Typography>25000</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardHeader title="Quizes" />
              <CardContent>
                <Box>
                  <Typography>2500</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardHeader title="Upcoming" />
              <CardContent>
                <Box>
                  <Typography>10</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardHeader title="Past" />
              <CardContent>
                <Box>
                  <Typography>200</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardHeader title="On Going" />
              <CardContent>
                <Box>
                  <Typography>2340</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={5 / 2}>
        <Card sx={{ height: "100%" }}>
          <CardHeader
            title="Get Pro!"
            sx={{
              "& .MuiCardHeader-content": {
                display: "flex",
                justifyContent: "center",
              },
            }}
            titleTypographyProps={{
              sx: {
                fontWeight: 700,
                fontSize: 20,
              },
            }}
          />
          <CardContent
            sx={{
              paddingX: 3,
              paddingY: 2,
            }}
          >
            <Box>
              <List
                sx={{
                  padding: 0,
                }}
              >
                <ListItem
                  sx={{
                    padding: 0,
                    gap: 2,
                  }}
                >
                  <IoCheckmarkDoneSharp
                    style={{
                      height: 16,
                      width: 16,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    Advance Panel
                  </Typography>
                </ListItem>
                <ListItem
                  sx={{
                    padding: 0,
                    gap: 2,
                  }}
                >
                  <IoCheckmarkDoneSharp
                    style={{
                      height: 16,
                      width: 16,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    Bulk Question Upload
                  </Typography>
                </ListItem>
                <ListItem
                  sx={{
                    padding: 0,
                    gap: 2,
                  }}
                >
                  <IoCheckmarkDoneSharp
                    style={{
                      height: 16,
                      width: 16,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    Student Dashboard
                  </Typography>
                </ListItem>
                <ListItem
                  sx={{
                    padding: 0,
                    gap: 2,
                  }}
                >
                  <IoCheckmarkDoneSharp
                    style={{
                      height: 16,
                      width: 16,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    Advance Quizzes
                  </Typography>
                </ListItem>
                <ListItem
                  sx={{
                    padding: 0,
                    gap: 2,
                  }}
                >
                  <IoCheckmarkDoneSharp
                    style={{
                      height: 16,
                      width: 16,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    Per Question time
                  </Typography>
                </ListItem>
                <ListItem
                  sx={{
                    padding: 0,
                    gap: 2,
                  }}
                >
                  <IoCheckmarkDoneSharp
                    style={{
                      height: 16,
                      width: 16,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    Quick Support
                  </Typography>
                </ListItem>
              </List>
            </Box>
          </CardContent>
          <CardActions>
            <Button color="error" variant="contained" size="small">
              Upgrade Now
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={12} md={9 / 2}>
        <Card sx={{ height: "100%" }}>
          <CardHeader
            title={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <BiSolidCommentDetail />
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  Feedback and suggestions
                </Typography>
              </Box>
            }
          />
          <CardContent
            sx={{
              padding: 2,
              "&:last-child": {
                paddingBottom: 4,
              },
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                We are always open for your feedback and suggestions. You can
                directly write to feedback@acadlix.com.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={5}>
        <Card sx={{ height: "100%" }}>
          <CardHeader
            title={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <RiUserHeartFill />
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  Show your love
                </Typography>
              </Box>
            }
          />
          <CardContent
            sx={{
              padding: 2,
              "&:last-child": {
                paddingBottom: 4,
              },
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                Take a moment to review and rate our work--your feedback helps
                keep us motivated and energized!
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={5 / 2}>
        <Card sx={{ height: "100%" }}>
          <CardHeader
            title={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <MdOutlineSupportAgent />
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  Need Help?
                </Typography>
              </Box>
            }
          />
          <CardContent
            sx={{
              padding: 2,
              "&:last-child": {
                paddingBottom: 4,
              },
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                Stuck with something? Get help from live chat or open a support
                ticket.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={19 / 2}>
        <Card
          sx={{
            height: "100%",
            display: {
              md: "flex",
              xs: "block",
            },
            alignItems: "center",
          }}
        >
          <CardHeader
            sx={{
              minWidth: "30%",
            }}
            title={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <FaCog />
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  Need any custom feature?
                </Typography>
              </Box>
            }
          />
          <CardContent
            sx={{
              padding: 2,
              "&:last-child": {
                paddingBottom: 4,
              },
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                Share your detialed requirements by filling our this form, and
                we'll provide you with a personalized quote.
              </Typography>
            </Box>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="success"
              sx={{
                minWidth: "110px",
              }}
            >
              Contact Us
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={12} md={5 / 2}>
        <Card sx={{ height: "100%" }}>
          <CardHeader
            title={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <AiOutlineFileSearch />
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  Documentation
                </Typography>
              </Box>
            }
          />
          <CardContent
            sx={{
              padding: 2,
              "&:last-child": {
                paddingBottom: 4,
              },
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                Step-by-step tutorials and expert tips to help you master
                Acadlix and elevate your educational offerings.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Home;
