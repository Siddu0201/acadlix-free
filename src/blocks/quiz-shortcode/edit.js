import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import {
  PanelBody,
  Notice,
  Spinner,
  ComboboxControl,
  BaseControl,
  CheckboxControl,
  SelectControl,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import apiFetch from "@wordpress/api-fetch";
import { useEffect, useState } from "@wordpress/element";

export default function Edit({ attributes, setAttributes }) {
  const blockProps = useBlockProps();
  const { shortcodeId, template, fields } = attributes;
  const templateOptions = [
    { label: __("Default template", "acadlix"), value: "" },
    { label: __("Template 1", "acadlix"), value: "template-1" },
    { label: __("Template 2", "acadlix"), value: "template-2" },
  ];
  const fieldOptions = [
    { label: __("Category", "acadlix"), value: "category" },
    { label: __("Time", "acadlix"), value: "time" },
    { label: __("Questions", "acadlix"), value: "questions" },
    { label: __("Points", "acadlix"), value: "points" },
    { label: __("Attempts", "acadlix"), value: "attempts" },
    { label: __("Start Date", "acadlix"), value: "start_date" },
    { label: __("End Date", "acadlix"), value: "end_date" },
    { label: __("Description", "acadlix"), value: "description" },
  ];
  const selectedFields = fields
    ? fields
      .split(",")
      .map((field) => field.trim())
      .filter(Boolean)
    : [];
  const [quizOptions, setQuizOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    let isMounted = true;

    apiFetch({ path: "/acadlix/v1/block-quiz-shortcodes" })
      .then((response) => {
        if (!isMounted) {
          return;
        }

        const items = Array.isArray(response?.items) ? response.items : [];
        const options = [
          {
            label: __("Select a quiz", "acadlix"),
            value: "0",
          },
          ...items.map((item) => ({
            label: item?.label || __("Untitled Quiz", "acadlix"),
            value: String(item?.value || 0),
          })),
        ];

        setQuizOptions(options);
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }
        setFetchError(
          error?.message ||
          __("Unable to load quiz list from server.", "acadlix")
        );
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const shortcodeParts = ["[Acadlix_Quiz"];
  if (shortcodeId > 0) {
    shortcodeParts.push(String(shortcodeId));
  }
  if (template) {
    shortcodeParts.push(`template=\"${template}\"`);
  }
  if (fields) {
    shortcodeParts.push(`fields=\"${fields}\"`);
  }

  const handleQuizChange = (value) => {
    const nextId = parseInt(value, 10);
    setAttributes({
      shortcodeId: Number.isNaN(nextId) ? 0 : Math.max(0, nextId),
    });
  };

  const handleTemplateChange = (value) => {
    setAttributes({
      template: value,
      fields: value ? fields : "",
    });
  };

  const handleFieldChange = (fieldValue, checked) => {
    const nextFields = checked
      ? [...selectedFields, fieldValue]
      : selectedFields.filter((field) => field !== fieldValue);

    setAttributes({
      fields: nextFields.join(","),
    });
  };

  const renderQuizSettingsPanel = () => (
    <PanelBody title={__("Quiz Settings", "acadlix")} initialOpen={true}>
      {isLoading ? <Spinner /> : null}

      <ComboboxControl
        label={__("Quiz", "acadlix")}
        value={String(shortcodeId || 0)}
        options={quizOptions}
        onChange={handleQuizChange}
        help={__("Select a quiz shortcode from server list.", "acadlix")}
        disabled={isLoading || !!fetchError}
      />

      {fetchError ? (
        <Notice status="error" isDismissible={false}>
          {fetchError}
        </Notice>
      ) : null}

      <SelectControl
        label={__("Template (optional)", "acadlix")}
        value={template || ""}
        options={templateOptions}
        onChange={handleTemplateChange}
        help={__("Choose a template for quiz rendering.", "acadlix")}
      />

      <BaseControl
        label={__("Fields (optional)", "acadlix")}
        help={
          !template
            ? __("Select a template first to enable field options.", "acadlix")
            : __("Select one or more fields.", "acadlix")
        }
      >
        <div style={{ display: "grid", gap: "10px" }}>
          {fieldOptions.map((option) => (
            <CheckboxControl
              key={option.value}
              label={option.label}
              checked={selectedFields.includes(option.value)}
              disabled={!template}
              onChange={(checked) => {
                handleFieldChange(option.value, checked);
              }}
            />
          ))}
        </div>
      </BaseControl>
    </PanelBody>
  );

  return (
    <div {...blockProps}>
      <InspectorControls>{renderQuizSettingsPanel()}</InspectorControls>

      {renderQuizSettingsPanel()}

      {shortcodeId > 0 ? (
        <Notice status="info" isDismissible={false}>
          {__("Shortcode to render:", "acadlix")} {`${shortcodeParts.join(" ")}]`}
        </Notice>
      ) : (
        <Notice status="warning" isDismissible={false}>
          {__("Set a valid Shortcode ID to render the quiz.", "acadlix")}
        </Notice>
      )}
    </div>
  );
}
