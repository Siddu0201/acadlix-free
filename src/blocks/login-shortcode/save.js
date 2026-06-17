import { RawHTML } from "@wordpress/element";

export default function Save({ attributes }) {
  const { redirectUrl, redirectId } = attributes;
  
  const shortcodeParts = ["[acadlix_login"];
  if (redirectUrl) {
    shortcodeParts.push(`redirect_url="${redirectUrl}"`);
  }
  if (redirectId) {
    shortcodeParts.push(`redirect_page_id="${redirectId}"`);
  }
  shortcodeParts.push("]");
  
  const shortcode = shortcodeParts.join(" ");
  
  return <RawHTML>{shortcode}</RawHTML>;
}