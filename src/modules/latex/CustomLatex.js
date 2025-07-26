import React from 'react'
import Latex from 'react-latex-next'
import 'katex/dist/katex.min.css';
import { Box } from '@mui/material';

const fixLatexString = (input) => {
  // console.log("Original LaTeX:", input);


  input = input
    .replace(/\n\n/g, '<br/>')
    .replace(/\u2013/g, '-') // en-dash (–)
    .replace(/&#8211;/g, "-")
    .replace(/&amp;/g, '&')
    .replace(/\u2014/g, '-') // em-dash (—)
    .replace(/\u2212/g, '-') // unicode minus (−)
    .replace(/\u201C/g, '"') // Replace left curly quote
    .replace(/\u201D/g, '"') // Replace right curly quote
    .replace(/\u2018/g, "'") // Replace left single quote
    .replace(/\u2019/g, "'") // Replace right single quote
    .replace(/\u00A0/g, " "); // Replace non-breaking space

  const patterns = [
    { start: '\\[', end: '\\]' },
    { start: '\\(', end: '\\)' },
    { start: '\\$\\$', end: '\\$\\$' },
    { start: '(?<!\\\\)\\$', end: '(?<!\\\\)\\$' } // $...$ without escaping
  ];

  // Function to strip HTML tags
  const stripTags = (str) => str.replace(/<[^>]+>/g, '');

  // Loop through and sanitize only LaTeX blocks
  patterns.forEach(({ start, end }) => {
    const regex = new RegExp(`${start}([\\s\\S]*?)${end}`, 'g');
    input = input.replace(regex, (match, content) => {
      const cleaned = stripTags(content);
      return match.replace(content, cleaned);
    });
  });

  return input;
};

const CustomLatex = ({
  children
}) => {
  const processedLatex = fixLatexString(String(children));

  // console.log("Processed LaTeX:", processedLatex);
  return (
    <Box className="acadlix-latex">
      <Latex options={{
        displayMode: true,
        throwOnError: false,
        strict: false,
      }}
      >
        {processedLatex}
      </Latex>
    </Box>
  );
}

export default CustomLatex
