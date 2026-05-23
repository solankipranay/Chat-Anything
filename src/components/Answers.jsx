
import ReactMarkdown from "react-markdown";
import { checkHeading, replaceHeadingStarts } from "../helper";
import SyntaxHighlighter from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

const Answers = ({ ans, totalResult, index, type }) => {
  const isHeading = ans && checkHeading(ans);
  const answerText = isHeading ? replaceHeadingStarts(ans) : ans || "";

  const renderer = {
    code({ inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");

      return !inline && match ? (
        <SyntaxHighlighter
          style={dark}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div>
      {index === 0 && totalResult > 1 ? (
        <span className="pt-2 text-xl block text-white font-bold">
          {answerText}
        </span>
      ) : isHeading ? (
        <span className="pt-2 text-lg block text-white font-semibold">
          {answerText}
        </span>
      ) : (
        <span className={type === "q" ? "pl-1" : "pl-5"}>
          <ReactMarkdown components={renderer}>
            {answerText}
          </ReactMarkdown>
        </span>
      )}
    </div>
  );
};

export default Answers;