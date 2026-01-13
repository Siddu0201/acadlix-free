import { Box, Chip, Typography } from '@mui/material';
import React, { useEffect } from 'react'
import { __ } from '@wordpress/i18n';
import { getCurrentDateString } from '@acadlix/helpers/util';
import CustomLatex from '@acadlix/modules/latex/CustomLatex';

const TypeAssessment = (props) => {
  const [characterPercentage, setCharacterPercentage] = React.useState(0);
  const [characterCount, setCharacterCount] = React.useState(0);
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
          const allowedKeys = [8, 46, 37, 38, 39, 40];

          const getCleanText = () => {
            const text = editor.getBody()?.innerText || "";

            // Remove zero-width chars + trim whitespace/newlines
            return text
              .replace(/\u200B/g, "") // zero-width space
              .replace(/\s+/g, " ")   // normalize whitespace
              .trim();
          };

          const getTextLength = () => getCleanText().length;

          editor.on("keydown", function (e) {
            const limit = getCharacterLimit();
            if (!limit) return;

            const length = getTextLength();

            if (length >= limit && !allowedKeys.includes(e.keyCode)) {
              e.preventDefault();
              return false;
            }
          });

          /* ------------------ PASTE (CORRECT WAY) ------------------ */
          editor.on("PastePreProcess", function (e) {
            const limit = getCharacterLimit();
            if (!limit) return; // ♾ infinite

            const currentLength = getTextLength();
            const remaining = limit - currentLength;

            if (remaining <= 0) {
              e.content = "";
              return;
            }

            const container = document.createElement("div");
            container.innerHTML = e.content;

            let charCount = 0;

            const trimNode = (node) => {
              if (charCount >= remaining) {
                node.remove();
                return;
              }

              // TEXT NODE — DO NOT MOVE SPACES
              if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent || "";

                if (charCount + text.length > remaining) {
                  node.textContent = text.substring(0, remaining - charCount);
                  charCount = remaining;
                } else {
                  charCount += text.length;
                }
                return;
              }

              // ELEMENT NODE
              if (node.nodeType === Node.ELEMENT_NODE) {
                [...node.childNodes].forEach(trimNode);

                // remove empty tags
                if (!node.textContent?.trim()) {
                  node.remove();
                }
              }
            };

            [...container.childNodes].forEach(trimNode);

            /* -------- INLINE SPACE NORMALIZATION (CRITICAL FIX) -------- */

            const normalizeInlineSpaces = (html) => {
              return html
                // ensure space AFTER closing inline tags
                .replace(/(<\/(strong|em|span|b|i|u)>)(\S)/gi, "$1 $3")
                // ensure space BEFORE opening inline tags
                .replace(/(\S)(<(strong|em|span|b|i|u)>)/gi, "$1 $2")
                // collapse accidental doubles
                .replace(/\s{2,}/g, " ");
            };

            e.content = normalizeInlineSpaces(container.innerHTML);
          });
          /* ------------------ END PASTE (CORRECT WAY) ------------------ */

          editor.on("input change", function () {
            handleChange(
              editor.getContent(),
              getCleanText()
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

  const handleChange = (content, textContent) => {
    let value = content;
    let percentage =
      value && getCharacterLimit() > 0
        ? Math.min(
          Math.floor((textContent.length / getCharacterLimit()) * 100),
          100
        )
        : 0;

    if (percentage >= 100 && getCharacterLimit() > 0) {
      value = value?.substring(0, getCharacterLimit());
      percentage = 100;
    }
    setCharacterCount(textContent?.length || 0);
    setCharacterPercentage(percentage);
    props?.setValue(
      `questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.yourAnswer`,
      value ?? ""
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
              // value={props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.yourAnswer`) || ""}
              />
              {
                getCharacterLimit() > 0 && (
                  <Box sx={{
                    textAlign: "end",
                  }}>
                    <Chip
                      label={`${__("Character Count", "acadlix")}: ${characterCount} / ${getCharacterLimit()}`}
                      size="small"
                      color={characterPercentage >= 100 ? "error" : "default"}
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