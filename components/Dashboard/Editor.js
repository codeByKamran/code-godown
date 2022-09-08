import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { useTheme } from "next-themes";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import Editor from "@monaco-editor/react";

import { AiOutlinePlus } from "react-icons/ai";

import axios from "@api/axios";
import Button from "@theme/Button";
import Loader from "@theme/Loader";
import Modal from "@theme/Modal";
import IconButton from "@theme/IconButton";
import Tooltip from "@theme/Tooltip";

import useAuth from "@hooks/auth/useAuth";
import { extractExtentionAndLanguage, isValidFileName } from "@utils/index";

import {
  selectActiveTabIndex,
  selectSnippet,
  SET_EDITOR_ACTIVE_TAB_INDEX,
  SET_SNIPPET,
} from "@redux/slices/appSlice";

const MonacoEditor = () => {
  const currentUser = useAuth();
  let snippetObj = useSelector(selectSnippet);
  const activeTabIndex = useSelector(selectActiveTabIndex);
  const [activeTab, setActiveTab] = useState(
    snippetObj?.files?.find((tab) => tab.key == activeTabIndex)
  );
  const [addingNewFile, setAddingNewFile] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();
  const { theme: themePreference, setTheme } = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    let mounted = true;

    mounted &&
      setActiveTab(snippetObj?.files?.find((tab) => tab.key == activeTabIndex));

    return () => {
      mounted = false;
    };
  }, [snippetObj, activeTabIndex]);

  // fetch programming langs
  const { data: languages, refetch: fetchLangs } = useQuery(
    "fetch-programming-langs",
    async () => {
      return await axios.get("/api/v1/public/programming-langs");
    },
    {
      enabled: false,
      onSuccess: (res) => {
        console.log("Programming langs fetch response", res);
      },
      onError: (error) => {
        console.log("Programming langs fetch error", error.message);
      },
    }
  );

  // Preparing Editor

  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    console.log("onMount: the editor instance:", editor);
    console.log("onMount: the monaco instance:", monaco);
  }

  // will change a tab in snippet
  const handleEditorChange = (value, e) => {
    const restOfFiles = snippetObj?.files?.filter(
      (tab) => tab.key !== activeTabIndex
    );
    let snippetToSet = {
      ...snippetObj,
      files: [...restOfFiles, { ...activeTab, code: value }]?.sort(
        (a, b) => a.key - b.key
      ),
    };
    dispatch(SET_SNIPPET(snippetToSet));
  };

  // Add New File Handler
  const handleAddNewFile = (e) => {
    e.preventDefault();
    if (isValidFileName(newFileName)) {
      const [fileExtention, language] = extractExtentionAndLanguage(
        newFileName,
        languages.data.data
      );

      let fileKey = snippetObj?.files?.at(-1).key + 1;

      let snippetToSet = {
        ...snippetObj,
        files: [
          ...snippetObj?.files,
          {
            key: snippetObj?.files?.at(-1).key + 1,
            fileName: newFileName,
            snippetName: snippetObj?.snippetName,
            snippetUID: snippetObj?.files[0].snippetUID,
            ownerID: currentUser?._id,
            extention: fileExtention,

            code: `// start coding here`,
            language: {
              ...language,
              extensions: language?.extensions?.slice(0, 7),
            },
          },
        ],
      };

      dispatch(SET_SNIPPET(snippetToSet));
      dispatch(SET_EDITOR_ACTIVE_TAB_INDEX(fileKey));
      setAddingNewFile(false);
      setNewFileName("");
    } else {
      enqueueSnackbar(
        `Enter valid file name including extention, (e.g. index.html)`,
        {
          variant: "info",
        }
      );
    }
  };

  const handleFileDelete = () => {
    const tabToDeleteKey = activeTabIndex;
    const tabToDeleteIndex = snippetObj?.files?.findIndex(
      (file) => file.key == activeTabIndex
    );
    const restOfFiles = snippetObj?.files?.filter(
      (tab) => tab.key !== tabToDeleteKey
    );

    const nextActiveTabIndex =
      restOfFiles[tabToDeleteIndex - 1]?.key || restOfFiles[0]?.key;

    dispatch(
      SET_SNIPPET({
        ...snippetObj,
        files: restOfFiles?.sort((a, b) => a.key - b.key),
      })
    );

    dispatch(SET_EDITOR_ACTIVE_TAB_INDEX(nextActiveTabIndex));
    setDialogOpen(false);
  };

  return (
    <div className="editor-container w-full">
      <div className="editor-navigation text-white flex items-center select-none overflow-x-scroll">
        {snippetObj &&
          snippetObj?.files?.map(({ fileName, key }) => (
            <Button
              key={key}
              type="tab"
              size="large"
              active={key == activeTabIndex}
              tabCloseButton
              onClick={() => {
                dispatch(SET_EDITOR_ACTIVE_TAB_INDEX(key));
              }}
              closeButtonOnClick={() => {
                setDialogOpen(true);
              }}
            >
              {fileName}
            </Button>
          ))}
        {addingNewFile && (
          <form onSubmit={handleAddNewFile}>
            <input
              autoFocus
              value={newFileName}
              onChange={(e) => {
                setNewFileName(e.target.value);
              }}
              type="text"
              className="w-32 outline-none bg-transparent pl-2"
            />
            <input type="submit" name="Add" className="hidden" />
          </form>
        )}
        <Tooltip content="Add file" placement="right">
          <IconButton
            onClick={
              addingNewFile
                ? handleAddNewFile
                : async () => {
                    await fetchLangs();
                    setAddingNewFile(true);
                  }
            }
          >
            <AiOutlinePlus className="h-6 w-6 p-1 text-gray-200" />
          </IconButton>
        </Tooltip>
      </div>

      <div>
        {snippetObj?.files?.length > 0 && (
          <Editor
            height="70vh"
            defaultLanguage={
              activeTab?.language?.name?.toLowerCase() || "javascript"
            }
            defaultValue={activeTab?.code}
            defaultPath={activeTab?.fileName}
            path={activeTab?.fileName}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            theme={themePreference === "dark" ? "vs-dark" : "light"}
            loading={<Loader type={2} size="large" />}
          />
        )}
      </div>
      {/* File delete confirmation dialog */}
      <Modal
        warning
        title={`Delete file`}
        desc={`Are you sure you want to delete this file. This action cannot be undone.`}
        open={dialogOpen}
        setOpen={setDialogOpen}
        confirmAction={handleFileDelete}
      />
    </div>
  );
};

export default MonacoEditor;
