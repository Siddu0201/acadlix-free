import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import {
  PanelBody,
  Notice,
  Spinner,
  ComboboxControl,
  TextControl,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import apiFetch from "@wordpress/api-fetch";
import { useEffect, useState } from "@wordpress/element";

export default function Edit({ attributes, setAttributes }) {
  const blockProps = useBlockProps();
  const { redirectUrl, redirectId } = attributes;
  const [redirectOptions, setRedirectOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    let isMounted = true;

    apiFetch({ path: "/acadlix/v1/block-login-shortcodes" })
      .then((response) => {
        if (!isMounted) {
          return;
        }

        const pages = Array.isArray(response?.pages) ? response.pages : [];
        const options = [
          {
            label: __("None", "acadlix"),
            value: "0",
          },
          ...pages?.map((item) => ({
            label: item?.label || __("Untitled Page", "acadlix"),
            value: String(item?.id || 0),
          })) || [],
        ];

        setRedirectOptions(options);
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }
        setFetchError(
          error?.message ||
          __("Unable to load redirect list from server.", "acadlix")
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

  const shortcodeParts = ["[acadlix_login"];
  if (redirectUrl) {
    shortcodeParts.push(`redirect_url=\"${redirectUrl}\"`);
  }
  if (redirectId) {
    shortcodeParts.push(`redirect_page_id=\"${redirectId}\"`);
  }

  const handleRedirectUrlChange = (value) => {
    setAttributes({
      redirectUrl: value || "",
    });
  };

  const handleRedirectChange = (value) => {
    const nextId = parseInt(value, 10);
    setAttributes({
      redirectId: Number.isNaN(nextId) ? 0 : Math.max(0, nextId),
    });
  };

  const renderRedirectSettingsPanel = () => (
    <PanelBody title={__("Redirect Settings", "acadlix")} initialOpen={true}>
      <TextControl
        label={__("Redirect URL (optional)", "acadlix")}
        value={redirectUrl || ""}
        onChange={handleRedirectUrlChange}
        help={__("Enter a full URL for redirect after login.", "acadlix")}
      />

      {isLoading ? <Spinner /> : null}

      <ComboboxControl
        label={__("Redirect Page ID (optional)", "acadlix")}
        value={String(redirectId || 0)}
        options={redirectOptions}
        onChange={handleRedirectChange}
        help={__("Choose a page ID from the available list.", "acadlix")}
        disabled={isLoading || !!fetchError}
      />

      <Notice status="info" isDismissible={false}>
        {__(
          "If both Redirect URL and Redirect Page ID are set, Redirect Page ID takes priority.",
          "acadlix"
        )}
      </Notice>

      {fetchError ? (
        <Notice status="error" isDismissible={false}>
          {fetchError}
        </Notice>
      ) : null}
    </PanelBody>
  );

  return (
    <div {...blockProps}>
      <InspectorControls>{renderRedirectSettingsPanel()}</InspectorControls>

      {renderRedirectSettingsPanel()}
      <Notice status="info" isDismissible={false}>
        {__("Shortcode to render:", "acadlix")} {`${shortcodeParts.join(" ")}]`}
      </Notice>

    </div>
  );
}
