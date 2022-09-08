import { useState } from "react";
import { useRouter } from "next/router";
import dashify from "dashify";
import { useSelector } from "react-redux";
import { format, parseISO } from "date-fns";
import SyntaxHighlighter from "react-syntax-highlighter";

import { Grid } from "@mui/material";
import { AiOutlineLock } from "react-icons/ai";

import Heading from "@theme/Heading";
import Text from "@theme/Text";
import Chip from "@theme/Chip";
import Tooltip from "@theme/Tooltip";
import syntaxThemes from "@config/syntaxThemes";

import { selectSyntaxTheme } from "@redux/slices/appSlice";

import SnippetCardActions from "./SnippetCardActions";

const SnippetCard = ({ snippet }) => {
  const syntaxTheme = useSelector(selectSyntaxTheme);
  let [snippetFiles, setSnippetFiles] = useState(() => snippet.files);
  const [activeFile, setActiveFile] = useState(() => snippet.files[0]);

  const router = useRouter();

  const handleSnippetOpen = () => {
    console.log(snippet);
    router.push({
      pathname: `/dashboard/snippet/${
        snippet?.slug || dashify(snippet?.snippetName)
      }`,
      query: {
        snippet: snippet?.snippetName,
        _id: snippet?._id,
      },
    });
  };

  return (
    <Grid
      item
      xs={12}
      sm={10}
      md={6}
      xl={4}
      className="snippet__card w-full min-h-[500px] z-0"
    >
      <div className="flex flex-col px-4 pt-4 pb-2 bg-backgroundContrast dark:bg-backgroundContrastDark rounded-lg shadow-md">
        <div className="snippetCard__header">
          <div className="flex items-center">
            <Heading
              type="tertiary"
              className="cursor-pointer hover:underline underline-offset-2"
              onClick={handleSnippetOpen}
            >
              {snippet?.snippetName}
            </Heading>

            {snippet?.snippetInfo?.isPrivate ? (
              <Tooltip content="Private">
                <AiOutlineLock className="text-primaryText dark:text-primaryTextDark ml-2" />
              </Tooltip>
            ) : (
              <></>
            )}
          </div>
          <div className="flex-between-center">
            <Text type="info" className="mt-2">
              {format(
                parseISO(snippet?.createdAt),
                "yyyy/MM/dd hh:mm aaaaa'm'"
              )}
            </Text>
            <SnippetCardActions snippet={snippet} />
          </div>
        </div>

        <div className="snippetCard__body pt-2">
          <SyntaxHighlighter
            language={activeFile?.language?.name?.toLowerCase() || "javascript"}
            style={syntaxThemes[syntaxTheme]}
            lineNumberStyle={{ fontSize: "10px" }}
            className="max-h-[375px] min-h-[375px] max-w-[100%]"
            // wrapLongLines
          >
            {activeFile?.code}
          </SyntaxHighlighter>
        </div>

        <div className="snippetCard__footer mt-auto">
          <div>
            <div className="files mt-2 w-full flex items-center flex-wrap">
              {snippetFiles?.map(({ fileName, key }) => (
                <Chip
                  key={key}
                  color={activeFile.key == key ? "primaryContained" : "light"}
                  size="small"
                  className="mb-2 mr-2"
                  onClick={() => {
                    setActiveFile(snippetFiles[key]);
                  }}
                >
                  {fileName}
                </Chip>
              ))}
            </div>
            <div className="flex flex-col space-y-2 mt-1">
              <div className="tags flex items-center flex-wrap">
                {snippet?.tags?.map((tag) => (
                  <span className="mt-1 mr-2 text-sm text-secondaryText dark:text-secondaryTextDark">
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Grid>
  );
};

export default SnippetCard;
