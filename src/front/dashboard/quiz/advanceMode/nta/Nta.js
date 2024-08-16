import { Box } from "@mui/material";
import React from "react";
import NtaTopHome from "./section/NtaTopHome";
import NtaLogo from "./section/NtaLogo";
import NtaUser from "./section/NtaUser";
import NtaSidebar from "./section/NtaSidebar";
import NtaSubsection from "./section/NtaSubsection";
import NtaQuestionPanel from "./section/NtaQuestionPanel";
import NtaFinish from "./section/NtaFinish";

const Nta = (props) => {
  React.useEffect(() => {
    document.body.style.backgroundColor = props?.colorCode?.background;
  }, []);

  let i = 0;
  return (
    <Box>
      <NtaTopHome {...props} />
      <NtaLogo {...props} />
      <NtaUser {...props} />
      {
        !props?.watch("finish") &&
        <>
          <NtaSidebar {...props} />
          <Box
            sx={{
              width: {
                xs: "100%",
                md: props?.isOpen
                  ? `calc(100% - calc(33.33% + 60px))`
                  : `calc(100% - 60px)`,
              },
              background: props?.colorCode?.background,
              paddingLeft: "40px"
            }}
          >
            <NtaSubsection {...props} />
            {props?.watch("subjects")?.length > 0 &&
              props?.watch("subjects")?.map((s, s_index) => (
                <Box
                  key={s_index}
                  sx={{
                    display: s?.selected ? "" : "none",
                  }}
                >
                  {props
                    ?.watch("questions")
                    ?.filter((q) => q?.subject_id === s?.subject_id)?.length > 0 &&
                    props
                      ?.watch("questions")
                      ?.filter((q) => q?.subject_id === s?.subject_id)
                      ?.map((question, index, arr) => (
                        <NtaQuestionPanel
                          {...props}
                          subject={s}
                          key={index}
                          index={i++}
                          s_index={s_index}
                          num={index + 1}
                          question={question}
                          first={index === 0}
                          last={arr?.length - 1 === index}
                          first_subject={s_index === 0}
                          last_subject={
                            props?.watch("subjects")?.length - 1 === s_index
                          }
                        />
                      ))}
                </Box>
              ))}
          </Box>
        </>
      }
      {
        props?.watch("finish") &&
        <NtaFinish {...props} />
      }
    </Box>
  );
};

export default Nta;
