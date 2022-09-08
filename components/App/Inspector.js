import SyntaxHighlighter from "react-syntax-highlighter";
import a11yDark from "react-syntax-highlighter/dist/cjs/styles/hljs/a11y-dark";

const Inspector = ({ code, className }) => {
  return (
    <div className={`${className}`}>
      <SyntaxHighlighter
        language={"javascript"}
        style={a11yDark}
        showLineNumbers
        lineNumberStyle={{ fontSize: "10px" }}
      >
        {JSON.stringify(code, null, 4)}
      </SyntaxHighlighter>
    </div>
  );
};

export default Inspector;
