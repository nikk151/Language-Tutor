/**
 * FuriganaText - Renders Japanese text with furigana (reading) annotations.
 * 
 * Parses the format: 漢字[かんじ]
 * Renders using <ruby><rt> HTML elements.
 */
export default function FuriganaText({ text, showFurigana = true, className = '' }) {
  if (!text) return null;

  if (!showFurigana) {
    // Strip furigana annotations and render plain text
    const plainText = text.replace(/\[.*?\]/g, '');
    return <span className={className}>{plainText}</span>;
  }

  // Parse 漢字[かんじ] format into ruby elements
  const parts = [];
  const regex = /([\u4e00-\u9faf\u3400-\u4dbf]+)\[([\u3040-\u309f\u30a0-\u30ff]+)\]/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before this match
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {text.slice(lastIndex, match.index)}
        </span>
      );
    }

    // Add ruby element
    parts.push(
      <ruby key={`ruby-${match.index}`}>
        {match[1]}
        <rt>{match[2]}</rt>
      </ruby>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(
      <span key={`text-${lastIndex}`}>
        {text.slice(lastIndex)}
      </span>
    );
  }

  return <span className={className}>{parts}</span>;
}
