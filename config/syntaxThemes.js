// syntax themes
import atomOneDark from "react-syntax-highlighter/dist/cjs/styles/hljs/atom-one-dark";
import atomOneLight from "react-syntax-highlighter/dist/cjs/styles/hljs/atom-one-light";
import a11yDark from "react-syntax-highlighter/dist/cjs/styles/hljs/a11y-dark";
import a11yLight from "react-syntax-highlighter/dist/cjs/styles/hljs/a11y-light";
import far from "react-syntax-highlighter/dist/cjs/styles/hljs/far";
import github from "react-syntax-highlighter/dist/cjs/styles/hljs/github";
import githubGist from "react-syntax-highlighter/dist/cjs/styles/hljs/github-gist";
import gradientDark from "react-syntax-highlighter/dist/cjs/styles/hljs/gradient-dark";
import tomorrowNightBlue from "react-syntax-highlighter/dist/cjs/styles/hljs/tomorrow-night-blue";
import schoolBook from "react-syntax-highlighter/dist/cjs/styles/hljs/school-book";

export const syntaxThemesList = [
  { label: "Atom One Dark", value: "atomOneDark" },
  { label: "Atom One Light", value: "atomOneLight" },
  { label: "A11y Dark", value: "a11yDark" },
  { label: "A11y Light", value: "a11yLight" },
  { label: "Far Dark", value: "far" },
  { label: "Github", value: "github" },
  { label: "Github Gist", value: "githubGist" },
  { label: "Gradient Dark", value: "gradientDark" },
  { label: "Tomorrow Night Blue", value: "tomorrowNightBlue" },
  { label: "School Book", value: "schoolBook" },
];

const syntaxThemes = {
  atomOneDark: atomOneDark,
  atomOneLight: atomOneLight,
  a11yDark: a11yDark,
  a11yLight: a11yLight,
  far: far,
  github: github,
  githubGist: githubGist,
  gradientDark: gradientDark,
  tomorrowNightBlue: tomorrowNightBlue,
  schoolBook: schoolBook,
};

export default syntaxThemes;
