import { 
    Box, 
    Typography 
} from "@mui/material";
import PropTypes from "prop-types";

const PointsBar = ({
    user1 = 0,
    user2 = 0,
    minWidth = {
        xs: 250,    
        md: 250,
        lg: 250,
    },
    height = 25,
    user1Color = "#f44336",
    user2Color = "#4caf50"
}) => {
    const total = user1 + user2;
    let user1Percent = 0;
    let user2Percent = 0;
    if (total > 0) {
        user1Percent = (user1 / total) * 100;
        user2Percent = (user2 / total) * 100;
    }

    return (
        <Box sx={{ 
            position: "relative",
            width: "100%",
            minWidth: minWidth,
            height: height,
            borderRadius: 10,
            backgroundColor: user2Color, 
            boxShadow: (theme) => theme.shadows[2],
        }}>
            <Box
                sx={{
                    position: "absolute",
                    height: height,
                    borderRadius: 10,
                    width: `${user1Percent}%`,
                    backgroundColor: user1Color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    boxShadow: (theme) => theme.shadows[4],
                }}
            >
                <Typography 
                    sx={{ 
                        color: "white",
                        marginRight: 2,
                    }}
                >
                    {user1}
                </Typography>
            </Box>
            <Box sx={{ 
                position: "absolute",
                height: height,
                display: "flex",
                alignItems: "center",
                right: 0,
            }}>
                <Typography 
                    sx={{ 
                        color: "white", 
                        marginRight: 2 
                    }}
                >
                    {user2}
                </Typography>
            </Box>
        </Box>
    );
};

export default PointsBar;

PointsBar.propTypes = {
    user1: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]).isRequired,
    user2: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]).isRequired,
    minWidth: PropTypes.object,
    height: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    user1Color: PropTypes.string,
    user2Color: PropTypes.string,
};