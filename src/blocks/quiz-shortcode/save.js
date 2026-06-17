import { RawHTML } from "@wordpress/element";

export default function Save({ attributes }) {
    const { shortcodeId, template, fields } = attributes;
    
    if (!shortcodeId || shortcodeId === 0) {
        return null;
    }
    
    const shortcodeParts = ["[Acadlix_Quiz"];
    shortcodeParts.push(String(shortcodeId));
    
    if (template) {
        shortcodeParts.push(`template="${template}"`);
    }
    if (fields) {
        shortcodeParts.push(`fields="${fields}"`);
    }
    shortcodeParts.push("]");
    
    const shortcode = shortcodeParts.join(" ");
    
    return <RawHTML>{shortcode}</RawHTML>;
}