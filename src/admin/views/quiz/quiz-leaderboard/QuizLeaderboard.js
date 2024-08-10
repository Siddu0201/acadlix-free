import {
  Avatar,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import First from "../../../../images/medal-1.svg";
import Second from "../../../../images/medal-2.svg";
import Third from "../../../../images/medal-3.svg";
import { PostQuizLoadMoreLeaderderboard } from "../../../../requests/admin/AdminLeaderboardRequest";
import { TiArrowLeftThick } from "react-icons/ti";

const QuizLeaderboard = () => {
  const styles = {
    activeItem: {
      backgroundColor: "#37afca",
      alignItems: "center",
      display: "flex",
      justifyContent: "center",
      color: "white",
      textAlign: "center",
      borderRadius: "16px",
      flex: 1,
      padding: "10px 0",
    },
    inactiveItem: {
      backgroundColor: "white",
      color: "black",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      borderRadius: "16px",
      flex: 1,
      padding: "10px 0",
    },
    header: {
      color: "white",
      display: "flex",
      justifyContent: "center",
      paddingY: "20px",
      paddingX: "10px",
      alignItems: "center",
      marginBottom: "20px",
    },
    navContainer: {
      display: "flex",
      justifyContent: "space-between",
      backgroundColor: "white",
      padding: "4px",
      borderRadius: "16px",
      marginX: "auto",
      marginBottom: "20px",
    },
    leaderboardItem: {
      display: "flex",
      alignItems: "center",
      backgroundColor: "white",
      borderRadius: "8px",
      padding: "10px",
      justifyContent: "space-between",
      marginBottom: "10px",
    },
    leaderboardContainer: {
      width: {
        md: "inherit",
        xs: "auto",
      },
      marginX: {
        md: "auto",
        xs: "0px",
      },
      paddingX: {
        md: "auto",
        xs: "10px",
      },
    },
    rankNameContainer: {
      display: "flex",
      alignItems: "center",
      flex: 1,
    },
    rank: {
      marginRight: "10px",
    },
    name: {
      marginLeft: "10px",
    },
    topItem: {
      display: "flex",
      alignItems: "center",
      backgroundColor: "#37afca",
      color: "white",
      borderRadius: "8px",
      padding: "10px",
      justifyContent: "center",
      flexDirection: "column",
      textAlign: "center",
    },
    avatarContainer: {
      position: "relative",
      display: "flex",
      justifyContent: "center",
      marginBottom: "10px",
    },
    rankLabel: {
      position: "absolute",
      bottom: "-10px",
      backgroundColor: "#fff",
      color: "#37afca",
      borderRadius: "50%",
      padding: "1px 6px",
      fontSize: "12px",
      fontWeight: "bold",
    },
    crownLabel: {
      position: "absolute",
      top: "-15px",
      width: "24px",
      height: "24px",
    },
    topThreeContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
    },
    topItemWrapper: {
      flex: "1",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { quiz_id } = useParams();

  const methods = useForm({
    defaultValues: {
      toplist: [],
      topThree: [],
      rest: [],
      toplist_count: 0,
    },
  });
  const loadMoreMutation = PostQuizLoadMoreLeaderderboard(quiz_id);
  const handleLoadMoreLeaderboard = () => {
    loadMoreMutation.mutate(
      {
        toplist_view_count: methods?.watch("toplist")?.length,
      },
      {
        onSuccess: (data) => {
          console.log(data);
          methods.setValue(
            "toplist",
            [...methods?.watch("toplist"), ...data?.data?.toplist],
            { shouldDirty: true }
          );
          methods.setValue("toplist_count", data?.data?.toplist_count, {
            shouldDirty: true,
          });
          methods.setValue("topThree", methods?.watch("toplist")?.slice(0, 3), {
            shouldDirty: true,
          });
          methods.setValue("rest", methods?.watch("toplist")?.slice(3), {
            shouldDirty: true,
          });
        },
      }
    );
  };

  React.useEffect(() => {
    handleLoadMoreLeaderboard();
  }, []);

  return (
    <Box>
      <Grid
        container
        rowSpacing={4}
        spacing={4}
        sx={{
          padding: 4,
        }}
      >
        <Grid item xs={12} lg={12}>
          <Button
            variant="contained"
            startIcon={<TiArrowLeftThick />}
            size="medium"
            sx={{
              width: "fit-content",
            }}
            LinkComponent={Link}
            to={`/quiz`}
          >
            Back
          </Button>
        </Grid>
      </Grid>
      <Grid
        container
        sx={{
          backgroundColor: "#37afca",
          marginY: 2,
          marginX: {
            md: "auto",
            xs: "auto",
          },
          width: {
            md: "70%",
            xs: "90%",
          },
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loadMoreMutation?.isPending}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Box sx={styles.header}>
          <Typography variant="h5" sx={{ fontWeight: "600" }}>
            Leaderboard
          </Typography>
        </Box>

        <Box
          sx={{
            width: {
              md: "inherit",
              xs: "auto",
            },
            marginX: {
              md: "auto",
              xs: "0",
            },
            marginBottom: "20px",
          }}
        >
          <Box sx={styles.topThreeContainer}>
            {/* Third topper */}
            <Box sx={styles.topItemWrapper}>
              <Box sx={styles.topItem}>
                <Box sx={styles.avatarContainer}>
                  <Avatar
                    src={Third}
                    sx={{
                      width: "60px",
                      height: "60px",
                      borderColor: "#54cba1",
                      borderWidth: "3px",
                    }}
                  />
                </Box>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {methods.watch("topThree")?.[2]?.name}
                </Typography>
                <Typography variant="body1">
                  {methods.watch("topThree")?.[2]?.result?.toFixed(2)}%
                </Typography>
              </Box>
            </Box>
            {/* First topper */}
            <Box sx={styles.topItemWrapper}>
              <Box sx={styles.topItem}>
                <Box sx={styles.avatarContainer}>
                  <Avatar
                    src={First}
                    sx={{
                      width: "100px",
                      height: "100px",
                      borderColor: "#e8df6a",
                      borderWidth: "3px",
                    }}
                  />
                </Box>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {methods.watch("topThree")?.[0]?.name}
                </Typography>
                <Typography variant="body1">
                  {methods.watch("topThree")?.[0]?.result?.toFixed(2)}%
                </Typography>
              </Box>
            </Box>
            {/* Second topper  */}
            <Box sx={styles.topItemWrapper}>
              <Box sx={styles.topItem}>
                <Box sx={styles.avatarContainer}>
                  <Avatar
                    src={Second}
                    sx={{
                      width: "60px",
                      height: "60px",
                      borderColor: "#edbe86",
                      borderWidth: "3px",
                    }}
                  />
                </Box>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {methods.watch("topThree")?.[1]?.name}
                </Typography>
                <Typography variant="body1">
                  {methods.watch("topThree")?.[1]?.result?.toFixed(2)}%
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={styles.leaderboardContainer}>
          {methods?.watch("rest")?.map((item, index) => (
            <Box key={index} sx={styles.leaderboardItem}>
              <Box sx={styles.rankNameContainer}>
                <Typography variant="body1" sx={styles.rank}>
                  {`${index + 4}. `}
                </Typography>
                <Typography variant="body1" sx={styles.name}>
                  {item?.name}
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", color: "#37afca" }}
              >
                {item?.result?.toFixed(2)}%
              </Typography>
            </Box>
          ))}
        </Box>
        {methods?.watch("toplist_count") > methods?.watch("toplist").length && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginY: 2,
            }}
          >
            <Button variant="contained" onClick={handleLoadMoreLeaderboard}>
              Load More
            </Button>
          </Box>
        )}
      </Grid>
    </Box>
  );
};

export default QuizLeaderboard;
