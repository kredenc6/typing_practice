const MIN_PARAGRAPH_TEXT_LENGTH = 25;

export default function transformWikiHtmlToText(html: string) {
  const rawHtmlParagraphArr = filterInParagraphs(html);
  const paragraphArr = rawHtmlParagraphArr
    .map(rawHtmlParagraph => {
      const tempParagraphNode = new DOMParser()
        .parseFromString(rawHtmlParagraph, "text/html")
        .querySelector("p");

      return tempParagraphNode?.textContent;
    })
    .filter(paragraph => paragraph && (paragraph.length >= MIN_PARAGRAPH_TEXT_LENGTH));
  return paragraphArr as string[];
};

function filterInParagraphs(html: string) {
  const paragraphRegExp = /<p>[\s\S]*?<\/p>/g;
  const paragraphArr = html.match(paragraphRegExp);

  return paragraphArr ? paragraphArr : [];
}
