import { useState } from "react";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import dashify from "dashify";
import { useMutation, useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import { Add, ArrowBack, Close, Save, Send } from "@mui/icons-material";
import { SearchIcon } from "@heroicons/react/solid";
import { PlusIcon } from "@heroicons/react/outline";

import Button from "@theme/Button";
import Heading from "@theme/Heading";
import Modal from "@theme/Modal";

import axios from "@api/axios";
import useAuth from "@hooks/auth/useAuth";
import useAxiosPrivate from "@hooks/auth/useAxiosPrivate";
import { syntaxThemesList } from "@config/syntaxThemes";
import {
  CompareObjects,
  extractExtentionAndLanguage,
  isValidFileName,
} from "@utils/index";
import {
  RESET_SNIPPET,
  selectFileName,
  selectSnippet,
  SET_SNIPPET,
} from "@redux/slices/appSlice";
import {
  selectSnippets,
  SET_SNIPPETS,
  SET_USER,
} from "@redux/slices/userSlice";

import ThemeSwitch from "../ThemeSwitch";
import PreEditor from "../PreEditor";

const DashboardHeader = () => {
  const [saving, setSaving] = useState(false);
  const currentUser = useAuth();
  const snippetObj = useSelector(selectSnippet);
  const fileName = useSelector(selectFileName);
  const snippets = useSelector(selectSnippets);

  const [addSnippetDialogOpen, setAddSnippetDialogOpen] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const axiosPrivate = useAxiosPrivate();
  const { enqueueSnackbar } = useSnackbar();

  // fetch programming langs
  const { data: langs, refetch: fetchLangs } = useQuery(
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

  // display snippet
  const displaySnippets = router.pathname === "/dashboard";

  // initiating snippet
  const addingSnippetInfo =
    router.pathname === "/dashboard" && addSnippetDialogOpen;

  // adding code to new snippet
  const addingCodeToNewSnippet =
    router.pathname === "/dashboard/editor" &&
    router.query.mode === "adding-snippet";

  // editing snippet
  const editingSnippet =
    router.pathname === "/dashboard/editor" &&
    router.query.mode === "edit-snippet";

  // saving new snippet
  const savingSnippet =
    router.pathname === "/dashboard/save-snippet" &&
    router.query.mode === "new-snippet";

  // saving edited snippet
  const savingEditedSnippet =
    router.pathname === "/dashboard/save-snippet" &&
    router.query.mode === "edit-snippet";

  // displaying indiv snippet
  const viewingSnippet = router.pathname === "/dashboard/snippet/[snippetID]";

  const handleDiscard = () => {
    dispatch(RESET_SNIPPET());
    router.push({ pathname: "/dashboard" });
  };

  const handleBackDirect = () => {
    if (savingEditedSnippet) {
      router.push({
        pathname: "/dashboard/editor",
        query: {
          mode: "edit-snippet",
          snippet: snippetObj?.snippetName,
        },
      });
    } else {
      dispatch(SET_SNIPPET({ ...snippetObj, labels: [], tags: [] }));
      router.push({
        pathname: "/dashboard/editor",
        query: {
          mode: "adding-snippet",
          snippet: snippetObj?.snippetName,
        },
      });
    }
  };

  const pushToEditor = () => {
    // will add basic snippet structure and push to editor
    if (isValidFileName(fileName)) {
      setAddSnippetDialogOpen(false);
      const [fileExtention, language] = extractExtentionAndLanguage(
        fileName,
        langs.data.data
      );
      const snippetUID = `snippet_${uuidv4()}`;
      const snippetTemplate = {
        snippetName: snippetObj?.snippetName,
        slug: dashify(snippetObj?.snippetName),
        uid: snippetUID || `snippet_${uuidv4()}`,
        description: "",
        snippetInfo: {
          isPrivate: true,
        },
        files: [
          {
            key: 0,
            fileName: fileName,
            snippetName: snippetObj?.snippetName,
            snippetUID: snippetUID || `snippet_${uuidv4()}`,
            ownerID: currentUser?._id,
            code: `// start coding here`,
            extention: fileExtention,
            language: {
              ...language,
              extensions: language?.extensions?.slice(0, 3),
            },
          },
        ],
        labels: [],
        tags: [],
      };
      dispatch(SET_SNIPPET(snippetTemplate));
      router.push({
        pathname: "/dashboard/editor",
        query: {
          mode: "adding-snippet",
          snippet: snippetObj?.snippetName,
        },
      });
    } else {
      enqueueSnackbar(`File name must contain extention, please recheck`, {
        variant: "info",
      });
    }
  };

  // add snippet to db react-query
  const { mutate: postSnippet } = useMutation(
    async (snippetData) => {
      return await axiosPrivate.post("/api/v1/snippets", snippetData);
    },
    {
      onSuccess: (res) => {
        console.log("Snippet Post Response", res);

        if (res.status === 201 || res.status === 200) {
          router.replace("/dashboard");
          dispatch(RESET_SNIPPET());
          dispatch(SET_USER(res.data.updatedUser));
          enqueueSnackbar(`Snippet added successfully`, {
            variant: "success",
          });
          setSaving(false);
        }
      },
      onError: (err) => {
        const statusCode = err.response.status;
        const statusText = err.response.statusText;
        enqueueSnackbar(statusText, {
          variant: "error",
        });
        setSaving(false);
      },
    }
  );

  const saveSnippetHandler = async () => {
    setSaving(true);
    const snippetToSave = {
      userID: currentUser._id,
      snippet: {
        ...snippetObj,
        // ADDING INFO
        owner: {
          email: currentUser?.email,
          userID: currentUser?._id,
          fullName: currentUser?.fullName,
          username: currentUser?.username,
        },
      },
    };
    postSnippet(snippetToSave);
  };

  // update snippet react-query
  const { mutate: updateSnippet } = useMutation(
    async (snippetData) => {
      return await axiosPrivate.put(
        `/api/v1/snippets/${snippetObj?._id}`,
        snippetData
      );
    },
    {
      onSuccess: (res) => {
        console.log("Snippet Update Response", res);

        if (res.status === 201 || res.status === 200) {
          // updating snippet in the global(redux) state
          const restOfSnippets = snippets?.filter(
            (snippet) => snippet._id !== res.data.updated._id
          );
          dispatch(SET_SNIPPETS([res.data.updated, ...restOfSnippets]));
          router.replace("/dashboard");
          dispatch(RESET_SNIPPET());
          enqueueSnackbar(`Snippet updated successfully`, {
            variant: "success",
          });
          setSaving(false);
        }
      },
      onError: (err) => {
        const statusCode = err.response.status;
        const statusText = err.response.statusText;
        enqueueSnackbar(statusText, {
          variant: "error",
        });
        setSaving(false);
      },
    }
  );

  const updateSnippetHandler = () => {
    setSaving(true);

    let targetSnippet = {
      ...snippets?.filter((snippet) => snippet._id === snippetObj?._id)[0],
    };

    const tagsAreSame = CompareObjects(targetSnippet?.tags, snippetObj?.tags);

    const labelsAreSame =
      targetSnippet?.labels[0]?.name === snippetObj?.labels[0]?.name;

    let updatedFiles = [];

    snippetObj?.files?.forEach((file) => {
      updatedFiles.push({ ...file, snippetName: snippetObj?.snippetName });
    });

    updateSnippet({
      snippet: {
        snippetName: snippetObj?.snippetName,
        description: snippetObj?.description,
        slug: snippetObj?.slug,
        snippetInfo: snippetObj?.snippetInfo,
        files: updatedFiles,
        tags: tagsAreSame ? null : snippetObj?.tags,
        labels: labelsAreSame ? null : snippetObj?.labels,
        snapshots: [],
      },
    });
  };

  const redirectToSaveSnippetPhase = () => {
    if (snippetObj?.files?.length > 0) {
      router.push({
        pathname: "/dashboard/save-snippet",
        query: {
          mode: "new-snippet",
        },
      });
    } else {
      enqueueSnackbar(`You must add atleast one file!`, {
        variant: "info",
      });
    }
  };

  const redirectToUpdateSnippetPhase = () => {
    router.push({
      pathname: "/dashboard/save-snippet",
      query: {
        mode: "edit-snippet",
      },
    });
  };

  const unknownActionHandler = () => {
    enqueueSnackbar(`Unknown action`, {
      variant: "info",
    });
  };

  // <Dynamic Content>

  const mainButtonAction = addingCodeToNewSnippet
    ? redirectToSaveSnippetPhase
    : editingSnippet
    ? redirectToUpdateSnippetPhase
    : savingSnippet
    ? saveSnippetHandler
    : savingEditedSnippet
    ? updateSnippetHandler
    : unknownActionHandler;

  const mainButtonTitle =
    addingSnippetInfo || addingCodeToNewSnippet || editingSnippet
      ? "Continue"
      : "Save Snippet";

  const dashboardHeaderTagline = displaySnippets
    ? currentUser?.firstName
      ? `${currentUser?.firstName}'s Snippets`
      : "Your Snippets"
    : addingSnippetInfo || addingCodeToNewSnippet
    ? "Adding new snippet"
    : savingSnippet
    ? `Saving ${snippetObj?.snippetName}`
    : viewingSnippet
    ? "[SNIPPET NAME]"
    : "Code Godown";

  // </Dynamic Content>

  return (
    <div className="dashboard__contentHeader bg-backgroundV1 dark:bg-backgroundContrastDark rounded">
      <div className="dashboardContentHeader__content w-full flex justify-between items-center py-2 px-3 sm:space-x-2 md:space-x-3">
        <div className="dashboardContentHeader__leftContainer hidden sm:block">
          <div className="dashboardContentHeader__leftContent">
            <div className="dashboardContentHeader__leftTagline">
              <Heading type="tertiary">{dashboardHeaderTagline}</Heading>
            </div>
          </div>
        </div>

        <div className="dashboardContentHeader__rightContainer flex-1">
          <div className="dashboardContentHeader__rightContent flex items-center justify-between sm:justify-end sm:space-x-2">
            {!viewingSnippet && (
              <div className="dashboardContentHeader__rightSearchContainer">
                <div className="dashboardContentHeader__rightSearchIcon">
                  <SearchIcon className="cursor-pointer h-6 mr-2 text-primaryText dark:text-primaryTextDark" />
                </div>
              </div>
            )}

            <div className="dashboardContentHeader__rightSyntaxThemeSwitch">
              {displaySnippets && <ThemeSwitch themes={syntaxThemesList} />}
            </div>

            {/* Header Dynamic Buttons */}
            {savingSnippet || savingEditedSnippet ? (
              <Button
                type="text-icon"
                startIcon={<ArrowBack />}
                onClick={handleBackDirect}
              >
                Back
              </Button>
            ) : (
              <></>
            )}
            {!displaySnippets && !viewingSnippet ? (
              <Button
                type="text-icon"
                startIcon={<Close />}
                onClick={handleDiscard}
              >
                Discard
              </Button>
            ) : (
              <></>
            )}

            {displaySnippets && (
              <Button
                id="add-new-snippet-btn"
                type="icon"
                endIcon={<Add />}
                onClick={async () => {
                  await fetchLangs();
                  setAddSnippetDialogOpen(true);
                  dispatch(RESET_SNIPPET());
                }}
                className="hidden sm:block"
              >
                Add Snippet
              </Button>
            )}

            {displaySnippets && (
              <button
                onClick={() => {
                  setAddSnippetDialogOpen(true);
                  dispatch(RESET_SNIPPET());
                }}
                className="icon-button sm:hidden bg-primary hover:bg-opacity-95 rounded-md p-2 inline-flex items-center justify-center text-primaryTextDark focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary active:scale-95 transition-all duration-150"
              >
                <span className="sr-only">Close menu</span>
                <PlusIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            )}

            {!viewingSnippet && !displaySnippets ? (
              <Button
                type="icon"
                loading={saving}
                startIcon={
                  savingSnippet || savingEditedSnippet ? <Save /> : null
                }
                endIcon={
                  !savingSnippet && !savingEditedSnippet ? <Send /> : null
                }
                onClick={mainButtonAction}
              >
                {mainButtonTitle}
              </Button>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={addSnippetDialogOpen}
        modalContent={<PreEditor />}
        setOpen={setAddSnippetDialogOpen}
        confirmLabel="Add Snippet"
        confirmAction={pushToEditor}
      />

      {/* <LoaderModal loading={saving} label="Saving, Please wait..." /> */}
    </div>
  );
};

export default DashboardHeader;
