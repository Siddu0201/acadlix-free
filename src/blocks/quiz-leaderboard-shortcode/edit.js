import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import {
  PanelBody,
  Notice,
  Spinner,
  ComboboxControl,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import apiFetch from "@wordpress/api-fetch";
import { useEffect, useState } from "@wordpress/element";

export default function Edit({ attributes, setAttributes }) {
  const blockProps = useBlockProps();
  const { shortcodeId } = attributes;
  
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

  const shortcodeParts = ["[Acadlix_Leaderboard"];
  if (shortcodeId > 0) {
    shortcodeParts.push(String(shortcodeId));
  }

  const handleQuizChange = (value) => {
    const nextId = parseInt(value, 10);
    setAttributes({
      shortcodeId: Number.isNaN(nextId) ? 0 : Math.max(0, nextId),
    });
  };


  const renderQuizLeaderboardSettingsPanel = () => (
    <PanelBody title={__("Quiz Leaderboard Settings", "acadlix")} initialOpen={true}>
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
      </PanelBody>
  );

  return (
    <div {...blockProps}>
      <InspectorControls>{renderQuizLeaderboardSettingsPanel()}</InspectorControls>

      {renderQuizLeaderboardSettingsPanel()}

      {shortcodeId > 0 ? (
        <Notice status="info" isDismissible={false}>
          {__("Shortcode to render:", "acadlix")} {`${shortcodeParts.join(" ")}]`}
        </Notice>
      ) : (
        <Notice status="warning" isDismissible={false}>
          {__("Set a valid Shortcode ID to render the leaderboard.", "acadlix")}
        </Notice>
      )}
    </div>
  );
}
