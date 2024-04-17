import React from 'react'
import { Box, Typography, Grid } from "@mui/material"
import NotVisited from '../answer-type-buttons/NotVisited';
import NotAnswered from '../answer-type-buttons/NotAnswered';
import Answered from '../answer-type-buttons/Answered';
import Marked from '../answer-type-buttons/Marked';
import MarkedAndAnswered from '../answer-type-buttons/MarkedAndAnswered';

const QuizSidebarQuestionOverview = (props) => {
  const arr = [...Array(20).keys().map(i => i+1)];
  const idList = [
    "acadlix_quiz_sidebar_status_types",
    "acadlix_quiz_sidebar_section",
    "acadlix_quiz_choose_question",
  ];

  const [height, setHeight] = React.useState(0);

  React.useLayoutEffect(() => {
    let total = 11;
    idList.forEach((a, i) => {
      total += document.getElementById(a)?.clientHeight ?? 0;
    });
    setHeight(() => total);
  });
  return (
    <Box sx={{
      backgroundColor: props?.colorCode?.sidebar_overview_background,
    }}
    id="acadlix_quiz_sidebar_question_overview"
    >
      <Box>
        <Typography sx={{
          fontSize: "12px",
          padding: "0px 8px 0px 10px",
          height: "26px",
          lineHeight: "26px",
        }}
        id="acadlix_quiz_choose_question"
        >
          <b>Choose a Question</b>
        </Typography>
      </Box>
      <Box sx={{
        position: "relative",
        overflowY: "scroll",
        overflowX: "hidden",
        right: "-17px",
        left: "0",
        padding: "5px",
        display: "grid",
        gridTemplateColumns: "auto auto auto auto",
        gridTemplateRows: "53px",
        height: `calc(100% - ${height}px)`,
      }}>
        {arr.map((a, i)=> (
          <Box key={i} sx={{
            margin: "0px 5px 10px 0px",
          }}>
            <NotVisited {...props} large={true}>{a}</NotVisited>
          </Box>
        ))}
        {/* <Box sx={{
          margin: "0px 5px 10px 0px",
        }}>
          <NotVisited {...props} large={true}>1</NotVisited>
        </Box> */}
        {/* <Box sx={{
          margin: "0px 5px 10px 0px",
        }}>
          <NotAnswered {...props} large={true}>2</NotAnswered>
        </Box>
        <Box sx={{
          margin: "0px 5px 10px 0px",
        }}>
          <Answered {...props} large={true}>3</Answered>
        </Box>
        <Box sx={{
          margin: "0px 5px 10px 0px",
        }}>
          <Marked {...props} large={true}>4</Marked>
        </Box>
        <Box sx={{
          margin: "0px 5px 10px 0px",
        }}>
          <MarkedAndAnswered {...props} large={true}>5</MarkedAndAnswered>
        </Box> */}
      </Box>
    </Box>
  )
}

export default QuizSidebarQuestionOverview
