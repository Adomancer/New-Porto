import { Fragment } from "react";
import { parseRich } from "@/lib/rich";

/** Renders **highlighted**, *accent* and line breaks from content strings. */
export function RichText({
  text,
  boldClassName = "marker",
  italicClassName = "not-italic text-violet",
}: {
  text: string;
  boldClassName?: string;
  italicClassName?: string;
}) {
  return parseRich(text).map((token, i) => {
    const content = token.text.split("\n").map((line, j) => (
      <Fragment key={j}>
        {j > 0 && <br />}
        {line}
      </Fragment>
    ));
    if (token.italic)
      return (
        <em key={i} className={italicClassName}>
          {content}
        </em>
      );
    if (token.bold)
      return (
        <strong key={i} className={boldClassName}>
          {content}
        </strong>
      );
    return <Fragment key={i}>{content}</Fragment>;
  });
}
