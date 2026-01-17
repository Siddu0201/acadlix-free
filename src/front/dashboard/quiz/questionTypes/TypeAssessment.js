import { Box, Chip, Typography } from '@mui/material';
import React, { useEffect } from 'react'
import { __ } from '@wordpress/i18n';
import { getCurrentDateString, getStripHtml } from '@acadlix/helpers/util';
import CustomLatex from '@acadlix/modules/latex/CustomLatex';

const TypeAssessment = (props) => {
  const getTextLength = () => {
    const answer = props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.yourAnswer`) || "";
    return getStripHtml(answer)?.trim().length;
  }

  const getCharacterLimit = () => {
    const limit = props?.watch(
      `questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.characterLimit`
    );
    return Number(limit) > 0 ? Number(limit) : 0; // 0 = infinite
  }

  const loadEditor = (key, name = "") => {
    window.wp.editor.initialize(key, {
      tinymce: {
        wpautop: true,
        toolbar1:
          "bold,italic,bullist,numlist,alignleft,aligncenter,alignright",
        textarea_rows: 20,
        setup: function (editor) {
          editor.on("input change", function (e) {
            handleChange(
              editor.getContent(),
            );
          });
        },
      },
      quicktags: false,
      mediaButtons: false,
    });
  };

  const removeEditor = (key) => {
    window.wp.editor.remove(key);
  };

  const handleChange = (content) => {
    let value = content;
    props?.setValue(
      `questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.yourAnswer`,
      value ?? "",
      { shouldDirty: true }
    );

    props?.setValue(
      `questions.${props?.index}.result`,
      {
        ...props?.watch(`questions.${props?.index}.result`),
        solved_count: value ? 1 : 0,
        answer_data: value ?? null,
        attempted_at: getCurrentDateString(),
      },
    );

  };

  const loadPage = () => {
    loadEditor(
      `your_answer_${props?.index}`,
      `questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.yourAnswer`
    );
  };

  useEffect(() => {
    loadPage();
    window.addEventListener("load", loadPage);

    return () => {
      removeEditor(`your_answer_${props?.index}`);
      window.removeEventListener("load", loadPage);
    };
  }, []);

  return (
    <Box
      sx={{
        width: "auto",
        // backgroundColor:
        //   props?.watch(`questions.${props?.index}.check`)
        //     ? props?.watch(`questions.${props?.index}.result.correct_count`)
        //       ? (theme) => theme.palette.success.light
        //       : (theme) => theme.palette.error.light
        //     : "",
        border:
          props?.watch("mode") !== "advance_mode" || props?.watch("view_answer") || props?.watch(`questions.${props?.index}.check`)
            ? (theme) => `1px solid ${theme.palette.grey[300]}`
            : "none",
        borderRadius: 1,
        padding: props?.watch("mode") !== "advance_mode" || props?.watch("view_answer") ? "5px" : 2,
        marginY: props?.watch("mode") !== "advance_mode" || props?.watch("view_answer") ? "5px" : 0,
        overflow: "auto",
      }}
    >
      {(props?.watch("view_answer") ||
        props?.watch(`questions.${props?.index}.check`)) && (
          <Typography>
            <b>{__("Your answer", "acadlix")}</b>
          </Typography>
        )}
      <Box
        sx={{
          display: "flex",
        }}
      >
        {
          props?.watch("view_answer") ||
            props?.watch(`questions.${props?.index}.check`) ? (
            <CustomLatex>
              {props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.yourAnswer`) || ""}
            </CustomLatex>
          ) : (
            <Box sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}>
              <textarea
                {
                ...props?.register(
                  `questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.yourAnswer`
                )
                }
                id={`your_answer_${props?.index}`}
                style={{
                  width: "100%",
                }}
                rows={6}
              />
              {
                getCharacterLimit() > 0 && (
                  <Box sx={{
                    textAlign: "end",
                  }}>
                    <Chip
                      label={`${__("Character Count", "acadlix")}: ${getTextLength()} / ${getCharacterLimit()}`}
                      size="small"
                      color={getTextLength() > getCharacterLimit()   ? "error" : "default"}
                    />
                  </Box>
                )
              }
            </Box>
          )
        }
      </Box>
      {
        Boolean(props?.watch(`questions.${props?.index}.result.is_evaluated`)) &&
        props?.watch(`questions.${props?.index}.result.evaluation_remark`) &&
        (
          <>
            <Typography>
              <b>{__("Evaluation remarks", "acadlix")}</b>
            </Typography>
            <Box>
              <CustomLatex>
                {props?.watch(`questions.${props?.index}.result.evaluation_remark`) || ""}
              </CustomLatex>
            </Box>
          </>
        )
      }
    </Box>
  )
}

export default TypeAssessment