import {
  Avatar,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import First from "@acadlix/images/medal-1.svg";
import Second from "@acadlix/images/medal-2.svg";
import Third from "@acadlix/images/medal-3.svg";
import { PostQuizLoadMoreLeaderderboard, PostResetLeaderboardByQuizId } from "@acadlix/requests/admin/AdminLeaderboardRequest";
import { TiArrowLeftThick } from "@acadlix/helpers/icons";
import { __ } from "@wordpress/i18n";
import { hasCapability } from "@acadlix/helpers/util";

const QuizLeaderboard = () => {
  const styles = {
    header: {
      display: "flex",
      justifyContent: "center",
      paddingY: "20px",
      paddingX: "10px",
      alignItems: "center",
      marginBottom: "20px",
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
    avatarContainer: {
      position: "relative",
      display: "flex",
      justifyContent: "center",
      marginBottom: "10px",
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
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { quiz_id } = useParams();

  const methods = useForm({
    defaultValues: {
      toplist: [],
      toplist_count: 0,
    },
  });
  const resetLeaderboardMutation = PostResetLeaderboardByQuizId(quiz_id);
  const handleResetLeaderboard = () => {
    if (confirm(__("Do you really want to reset this leaderboard?", "acadlix"))) {
      resetLeaderboardMutation.mutate({},
        {
          onSuccess: (data) => {
            methods.setValue(
              "toplist",
              [],
              { shouldDirty: true }
            );
            methods.setValue("toplist_count", 0, {
              shouldDirty: true,
            });
          },
        }
      );
    }
  };

  const loadMoreMutation = PostQuizLoadMoreLeaderderboard(quiz_id);
  const handleLoadMoreLeaderboard = () => {
    loadMoreMutation.mutate(
      {
        toplist_view_count: methods?.watch("toplist")?.length,
      },
      {
        onSuccess: (data) => {
          methods.setValue(
            "toplist",
            [...methods?.watch("toplist"), ...data?.data?.toplist],
            { shouldDirty: true }
          );
          methods.setValue("toplist_count", data?.data?.toplist_count, {
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
        <Grid size={{ xs: 12, lg: 12 }} sx={{
          display: "flex",
          gap: 2
        }}>
          <Button
            variant="contained"
            startIcon={<TiArrowLeftThick />}
            size="medium"
            sx={{
              width: "fit-content",
            }}
            LinkComponent={Link}
            to={`/`}
          >
            {__("Back", "acadlix")}
          </Button>
          {
            hasCapability("acadlix_reset_leaderboard") &&
            <Button
              variant="contained"
              size="medium"
              sx={{
                width: "fit-content",
              }}
              onClick={handleResetLeaderboard}
            >
              {__("Reset Leaderboard", "acadlix")}
            </Button>
          }
        </Grid>
      </Grid>
      <Grid
        container
        sx={{
          backgroundColor: "primary.main",
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
          sx={{ color: "primary.contrastText", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loadMoreMutation?.isPending}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Box sx={styles.header}>
          <Typography variant="h3" sx={{ color: "primary.contrastText" }}>
            {__("Leaderboard", "acadlix")}
          </Typography>
        </Box>

        <Box sx={styles.leaderboardContainer}>
          {methods?.watch("toplist")?.map((item, index) => (
            <Box key={index} sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "primary.contrastText",
              borderRadius: "8px",
              padding: "10px",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}>
              <Box sx={styles.rankNameContainer}>
                <Typography variant="body1" sx={styles.rank}>
                  {item?.rank}
                </Typography>
                <Typography variant="body1" sx={styles.name}>
                  {item?.name ?? "Anonymous"}
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", color: "primary.main" }}
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
              {__("Load More", "acadlix")}
            </Button>
          </Box>
        )}
      </Grid>
    </Box>
  );
};

export default QuizLeaderboard;
