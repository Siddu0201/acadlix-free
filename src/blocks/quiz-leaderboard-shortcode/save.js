import { RawHTML } from "@wordpress/element";

export default function Save({ attributes }) {
    const { shortcodeId } = attributes;
    
    if (!shortcodeId || shortcodeId === 0) {
        return null;
    }
    
    const shortcodeParts = ["[Acadlix_Leaderboard"];
    shortcodeParts.push(String(shortcodeId));
    shortcodeParts.push("]");
    
    const shortcode = shortcodeParts.join(" ");
    
    return <RawHTML>{shortcode}</RawHTML>;
}