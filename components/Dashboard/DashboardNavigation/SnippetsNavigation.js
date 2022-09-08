import { Tab } from "@headlessui/react";
import { useState } from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import useAxiosPrivate from "../../../hooks/auth/useAxiosPrivate";

import { selectAllTags, selectUser } from "../../../redux/slices/userSlice";
import { classNames } from "../../../utils";
import Loader from "../../Generic/Loader";

import Tag from "../../Generic/Tag";
import Text from "../../Generic/Text";

const SnippetsNavigation = () => {
  const tags = useSelector(selectAllTags);
  const labelIDs = useSelector(selectUser)?.labels;

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const router = useRouter();
  const axiosPrivate = useAxiosPrivate();

  // react-query - fetch many labels by ids
  const {
    data: labelsData,
    isLoading: fetchingLabels,
    mutate: fetchLabels,
  } = useMutation(
    async (ids) => {
      return await axiosPrivate.post("/api/v1/labels/many", { ids });
    },
    {
      onSuccess: (res) => {
        console.log("Labels fetch response", res);

        let mappings = new Map();
        res.data.result.forEach((label, i) => {
          mappings.set(label.slug, i + 1);
        });

        setSelectedTabIndex(mappings.get(router.query.label));
      },
      onError: (err) => {
        const statusText = err.response.statusText;
        enqueueSnackbar(statusText, {
          variant: "error",
        });
        setSaving(false);
      },
    }
  );

  const tabChangeHandler = (tabIndex) => {
    setSelectedTabIndex(tabIndex);

    if (tabIndex === 0) {
      // first tab
      router.push({
        pathname: "/dashboard",
      });
    } else if (tabIndex > 0) {
      // one of our labels
      const targetLabel = labelsData.data.result[tabIndex - 1];
      router.push({
        pathname: "/dashboard",
        query: {
          label: targetLabel?.slug,
          _id: targetLabel?._id,
        },
      });
    }
  };

  useEffect(() => {
    fetchLabels(labelIDs);
  }, [labelIDs]);

  return (
    <div className="flex flex-col">
      <div className="labels mt-4">
        {fetchingLabels ? (
          <Loader type={2} />
        ) : (
          <Tab.Group
            vertical
            selectedIndex={selectedTabIndex}
            onChange={tabChangeHandler}
          >
            <Tab.List className="flex flex-col space-y-2 rounded-xl">
              <Tab
                className={({ selected }) =>
                  classNames(
                    "w-full rounded-full py-2.5 px-8 text-sm text-center md:text-left font-medium leading-5 text-primaryTextDark",
                    "ring-primary ring-opacity-60 focus:outline-none focus:ring-2",
                    selected
                      ? "bg-backgroundV1Dark/[0.5] shadow"
                      : "text-primaryTextDark hover:bg-white/[0.12]"
                  )
                }
              >
                Your Snippets
              </Tab>

              {labelsData?.data?.result?.length > 0 &&
                labelsData?.data?.result?.map((label) => (
                  <Tab
                    key={label._id}
                    className={({ selected }) =>
                      classNames(
                        "w-full rounded-full py-2.5 px-8 text-sm text-center md:text-left font-medium leading-5 text-primaryTextDark",
                        "ring-primary ring-opacity-60 focus:outline-none focus:ring-2",
                        selected
                          ? "bg-backgroundV1Dark/[0.5] shadow"
                          : "text-primaryTextDark hover:bg-white/[0.12]"
                      )
                    }
                  >
                    {label.name}
                  </Tab>
                ))}
            </Tab.List>
          </Tab.Group>
        )}
      </div>
      <div className="tags mt-8 mb-2">
        {tags?.length > 0 && (
          <div className="">
            <Text className="underline underline-offset-2">
              Recently used tags:
            </Text>
            <div className="navigation-by-tags mt-2 flex items-center flex-wrap">
              {tags.slice(0, 10).map((tag) => (
                <Tag clickable className="mt-1 mr-2">
                  {tag}
                </Tag>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnippetsNavigation;
