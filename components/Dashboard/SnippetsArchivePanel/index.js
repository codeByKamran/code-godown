import { useEffect } from "react";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";

import { Grid, useMediaQuery, useTheme } from "@mui/material";
import { IoAddOutline } from "react-icons/io5";
import { TbMoodEmpty } from "react-icons/tb";

import Button from "@theme/Button";
import useAuth from "@hooks/auth/useAuth";
import useAxiosPrivate from "@hooks/auth/useAxiosPrivate";
import { selectSnippets, SET_SNIPPETS } from "@redux/slices/userSlice";

import SnippetCard from "./SnippetCard";
import SnippetCardSkeleton from "./SnippetCard/SnippetCardSkeleton";

const SnippetsArchivePanel = () => {
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();
  const currentUser = useAuth();
  const userSnippets = useSelector(selectSnippets);

  const router = useRouter();
  const theme = useTheme();
  const isAboveMDBreakpoint = useMediaQuery(theme.breakpoints.up("md"));

  const { isLoading: fetchingSnippets, mutate: fetchSnippets } = useMutation(
    async (snippetIDs) => {
      return await axiosPrivate.post(
        router.query.label
          ? `/api/v1/snippets/f/label/${router.query._id}`
          : `/api/v1/snippets/many`,
        snippetIDs
      );
    },
    {
      enabled: false,
      onSuccess: (res) => {
        console.log("Snippets fetch response", res);
        dispatch(SET_SNIPPETS(res.data.result));
      },
      onError: (err) => {
        const statusCode = err.response.status;
        const statusText = err.response.statusText;
        enqueueSnackbar(statusText, {
          variant: "error",
        });
      },
    }
  );

  useEffect(() => {
    fetchSnippets({ ids: currentUser?.snippets });
  }, [currentUser?.snippets, router.query._id, fetchSnippets]);

  const handleAddNewSnippet = () => {
    document.getElementById("add-new-snippet-btn")?.click();
  };

  return (
    <div className="dashboard__snippetsArchiveCont w-full">
      {currentUser?.snippets?.length > 0 ? (
        <Grid
          container
          spacing={{ xs: 1, md: 2 }}
          justifyContent={isAboveMDBreakpoint ? "flex-start" : "center"}
          className="max-w-[100%] overflow-hidden pb-2"
        >
          {/* Display snippets itself if, snippets are present in currentUser obj, and */}
          {/* Individual snippets are fetched from db */}
          {userSnippets?.length > 0 ? (
            userSnippets?.map((snippet) => (
              <SnippetCard key={snippet._id} snippet={snippet} />
            ))
          ) : (
            // display skeleton in case individiual snippets are being fetched
            // from ids present in currentUser object
            <>
              {fetchingSnippets &&
                currentUser?.snippets.map((skeleton) => (
                  <SnippetCardSkeleton />
                ))}
            </>
          )}
        </Grid>
      ) : (
        // display empty snippets screen, if no snippets were present in db
        <div className="flex flex-col items-center justify-center space-y-5 my-7">
          <TbMoodEmpty className="w-20 h-20 text-primaryText dark:text-primaryTextDark" />
          <Button
            type="icon"
            endIcon={
              <IoAddOutline className="w-6 h-6 text-primaryText dark:text-primaryTextDark" />
            }
            onClick={handleAddNewSnippet}
          >
            Create Your First Snippet
          </Button>
        </div>
      )}
    </div>
  );
};

export default SnippetsArchivePanel;
