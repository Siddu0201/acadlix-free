import React from 'react'
import Latex from 'react-latex-next'

const fixLatexString = (input) => {
    // console.log("Original LaTeX:", input);

    return input
        .replace(/\u2013/g, '-') // en-dash (–)
        .replace(/&#8211;/g, "-")
        .replace(/\u2014/g, '-') // em-dash (—)
        .replace(/\u2212/g, '-') // unicode minus (−)
        .replace(/\u201C/g, '"') // Replace left curly quote
        .replace(/\u201D/g, '"') // Replace right curly quote
        .replace(/\u2018/g, "'") // Replace left single quote
        .replace(/\u2019/g, "'") // Replace right single quote
        .replace(/\u00A0/g, " "); // Replace non-breaking space
};

const CustomLatex = ({
    children
}) => {
    const processedLatex = fixLatexString(String(children));

    // console.log("Processed LaTeX:", processedLatex);
    return (
        <Latex options={{ throwOnError: false, strict: false }}>
            {processedLatex}
        </Latex>
    );
}

export default CustomLatex
