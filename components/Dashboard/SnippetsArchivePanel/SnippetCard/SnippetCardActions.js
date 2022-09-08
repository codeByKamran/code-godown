import { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { useMutation } from "react-query";

import { MdDownload, MdEdit, MdShare, MdDelete } from "react-icons/md";

import Modal from "@theme/Modal";
import Tooltip from "@theme/Tooltip";
import IconButton from "@theme/IconButton";
import useAuth from "@hooks/auth/useAuth";
import useAxiosPrivate from "@hooks/auth/useAxiosPrivate";
import { SET_SNIPPET } from "@redux/slices/appSlice";
import { SET_USER } from "@redux/slices/userSlice";

import SharePanel from "../../SharePanel";

const SnippetCardActions = ({ snippet }) => {
  const currentUser = useAuth();
  const [sharePanelOpen, setSharePanelOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [action, setAction] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const router = useRouter();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  // react-query snippet Delete
  const { mutate: deleteSnippet } = useMutation(
    async (snippetData) => {
      return await axiosPrivate.delete(
        `/api/v1/snippets/${snippet?._id}_${snippet?.owner?.userID}`, // both will be splited server-side
        snippetData
      );
    },
    {
      onSuccess: (res) => {
        console.log("Snippet delete response", res);
        dispatch(SET_USER({ ...currentUser, snippets: res.data.snippets }));
        enqueueSnackbar(`Snippet was deleted successfully!`, {
          variant: "success",
        });
        console.log("first", router);
        if (router.pathname.includes("/dashboard/snippet/")) {
          router.replace("/dashboard");
        }
        setDialogOpen(false);
        setDeleting(false);
      },
      onError: (err) => {
        const statusCode = err.response.status;
        const statusText = err.response.statusText;
        enqueueSnackbar(statusText, {
          variant: "error",
        });
        setDeleting(false);
      },
    }
  );

  const handleSnippetDelete = async () => {
    setDeleting(true);
    deleteSnippet({
      userID: currentUser?._id,
    });
  };

  const actions = {
    delete: {
      title: `Delete "${snippet?.snippetName?.trim()}" snippet`,
      desc: `Are you sure you want to delete this snippet. This action cannot be undone.`,
      confirmAction: handleSnippetDelete,
    },
  };

  const handleSnippetEdit = () => {
    dispatch(SET_SNIPPET(snippet));
    router.push({
      pathname: "/dashboard/editor",
      query: {
        mode: "edit-snippet",
        snippet: snippet?.snippetName,
      },
    });
  };

  return (
    <>
      <div className="snippetCard__actions flex space-x-1">
        <Tooltip content="Comming Soon!">
          <IconButton onClick={() => {}}>
            <MdDownload className="text-primary" />
          </IconButton>
        </Tooltip>
        {currentUser?._id === snippet?.owner.userID && (
          <>
            <Tooltip content="Edit snippet">
              <IconButton onClick={handleSnippetEdit}>
                <MdEdit className="text-primary" />
              </IconButton>
            </Tooltip>
            <Tooltip content="Delete snippet">
              <IconButton
                onClick={() => {
                  setAction("delete");
                  setDialogOpen(true);
                }}
              >
                <MdDelete className="text-primary" />
              </IconButton>
            </Tooltip>
            <Tooltip content="Share snippet">
              <IconButton
                onClick={() => {
                  setSharePanelOpen(true);
                }}
              >
                <MdShare className="text-primary" />
              </IconButton>
            </Tooltip>
          </>
        )}
      </div>
      {currentUser?._id === snippet?.owner.userID && (
        <>
          <Modal
            warning
            title={actions[action]?.title}
            desc={actions[action]?.desc}
            open={dialogOpen}
            setOpen={setDialogOpen}
            loading={deleting}
            confirmAction={actions[action]?.confirmAction}
          />

          {/* <SlideOver open={sharePanelOpen} setOpen={setSharePanelOpen} /> */}
          <SharePanel
            open={sharePanelOpen}
            setOpen={setSharePanelOpen}
            snippet={snippet}
          />
        </>
      )}
    </>
  );
};

export default SnippetCardActions;
