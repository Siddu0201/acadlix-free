import { Avatar, Box, Button, Grid, Typography } from "@mui/material";
import React from "react";
import First from "../../../../../images/medal-1.svg";
import Second from "../../../../../images/medal-2.svg";
import Third from "../../../../../images/medal-3.svg";
import { PostLoadMoreLeaderboard } from "../../../../../requests/front/FrontQuizRequest";

const LeaderboardSection = (props) => {
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
      width: "100%",
      marginBottom: "20px",
    },
    navContainer: {
      display: "flex",
      width: "70%",
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
        md: "70%",
        xs: "100%",
      },
      marginX: {
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
      width: "100%",
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
      width: "100%",
    },
    topItemWrapper: {
      flex: "1",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  };

  const topThree = props?.watch("toplist")?.slice(0, 3);
  const rest = props?.watch("toplist")?.slice(3);

  const loadMoreMutation = PostLoadMoreLeaderboard(props?.watch("id"));
  const handleLoadMoreLeaderboard = () => {
    loadMoreMutation.mutate({
      toplist_view_count : props?.watch("toplist")?.length,
      leaderboard_total_number_of_entries: props?.watch('leaderboard_total_number_of_entries'),
    }, {
      onSuccess: (data) => {
        console.log(data?.data);
        props?.setValue("toplist", [...props?.watch("toplist"),... data?.data?.toplist], {shouldDirty: true});
      }
    })
  }

  return (
    <Grid
      container
      sx={{ 
        backgroundColor: "#37afca", 
        marginY: 2,
        justifyContent: "center"
       }}
    >
      <Box sx={styles.header}>
        <Typography variant="h5" sx={{ fontWeight: "600" }}>
          Leaderboard
        </Typography>
      </Box>

      <Box
        sx={{
          width: {
            md: "70%",
            xs: "100%",
          },
          marginX: {
            md: "auto",
            xs: "10px",
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
                {topThree[2]?.name}
              </Typography>
              <Typography variant="body1">
                {topThree[2]?.result?.toFixed(2)}%
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
                {topThree[0]?.name}
              </Typography>
              <Typography variant="body1">
                {topThree[0]?.result?.toFixed(2)}%
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
                {topThree[1]?.name}
              </Typography>
              <Typography variant="body1">
                {topThree[1]?.result?.toFixed(2)}%
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={styles.leaderboardContainer}>
        {rest.map((item, index) => (
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
      {
        props?.watch("leaderboard_total_number_of_entries") > props?.watch("toplist").length && props?.watch("toplist_count") > props?.watch("toplist").length &&
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginY: 2
          }}
        >
          <Button variant="contained" onClick={handleLoadMoreLeaderboard}>
            Load More
          </Button>
        </Box>
      }
    </Grid>
  );
};

export default LeaderboardSection;
