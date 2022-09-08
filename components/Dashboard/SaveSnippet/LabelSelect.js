import { Fragment, useState } from "react";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { Combobox, Transition } from "@headlessui/react";
import dashify from "dashify";
import { SelectorIcon } from "@heroicons/react/solid";
import { useSnackbar } from "notistack";
import { Add, Label } from "@mui/icons-material";
import {
  selectSnippets,
  selectUser,
  SET_USER,
} from "../../../redux/slices/userSlice";
import useAxiosPrivate from "../../../hooks/auth/useAxiosPrivate";
import useAuth from "../../../hooks/auth/useAuth";
import { selectSnippet, SET_SNIPPET } from "../../../redux/slices/appSlice";
import Button from "../../Generic/Button";
import Loader from "../../Generic/Loader";

const LabelSelect = () => {
  const labels = useSelector(selectUser)?.labels || [];
  const snippet = useSelector(selectSnippet);
  const [labelsData, setLabelsData] = useState([]);
  const snippets = useSelector(selectSnippets);
  const [targetSnippet, setTargetSnippet] = useState(
    () => snippets?.filter((snip) => snip._id === snippet._id)[0]
  );
  const [selectedLabel, setSelectedLabel] = useState(
    () => targetSnippet?.labels[0]
  );
  const [query, setQuery] = useState("");
  const [labelFound, setLabelFound] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const currentUser = useAuth();

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  // react-query fetch labels by ids
  const { isLoading: fetchingLabels, mutate: fetchLabels } = useMutation(
    async (labelIDs) => {
      return await axiosPrivate.post("/api/v1/labels/many", labelIDs);
    },
    {
      enabled: false,
      onSuccess: (res) => {
        console.log("Multiple labels fetch response", res);
        setLabelsData([
          { name: "None", slug: "none", id: 0 },
          ...res.data.result,
        ]);
      },
      onError: (err) => {
        const statusText = err.response.statusText;
        enqueueSnackbar(statusText, {
          variant: "error",
        });
      },
    }
  );

  const filteredLabels =
    query === ""
      ? labelsData
      : labelsData.filter((item) =>
          item.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  const handleQueryChange = (e) => {
    setQuery(String(e.target.value).trim());
    if (labelsData.find((label) => label.name === e.target.value)) {
      setLabelFound(true);
    } else {
      setLabelFound(false);
    }
  };

  const { isLoading: postingLabel, mutate: postLabel } = useMutation(
    async (labelsData) => {
      return await axiosPrivate.post(`/api/v1/labels`, labelsData);
    },
    {
      onSuccess: (res) => {
        console.log("Label post response", res);

        if (res.status === 201 && res.data.updatedUser) {
          fetchLabels({ ids: res.data.updatedUser.labels });
          dispatch(SET_USER(res.data.updatedUser));
        }
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

  const handleLabelAddition = () => {
    postLabel({
      userID: currentUser?._id,
      label: {
        name: query,
        slug: dashify(query),
        userID: currentUser?._id,
        snippets: [],
      },
    });
  };

  const handleSelectedLabelChange = (label) => {
    const { _id, name, slug, userID } = label;
    setSelectedLabel(label);
    dispatch(
      SET_SNIPPET({
        ...snippet,
        labels: [{ _id, name, slug, userID }],
      })
    );
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <Combobox value={selectedLabel} onChange={handleSelectedLabelChange}>
          <div className="relative mt-1">
            <div className="relative w-full text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-teal-300 focus-visible:ring-offset-2 sm:text-sm overflow-hidden">
              <Combobox.Input
                className="w-full dark:bg-backgroundContrastDark text-primaryTextDark border border-borderColor dark:border-borderColorDark focus:ring-0 py-2 pl-3 pr-10 text-sm leading-5"
                displayValue={(person) => (person?.name ? person?.name : "")}
                placeholder="Search or add new label"
                onChange={handleQueryChange}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <SelectorIcon
                  className="w-5 h-5 text-gray-400"
                  aria-hidden="true"
                />
              </Combobox.Button>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              beforeEnter={() =>
                labelsData.length < 1 && fetchLabels({ ids: labels })
              }
              afterLeave={() => setQuery("")}
            >
              <Combobox.Options className="absolute w-full z-50 py-1 mt-1 overflow-auto text-base bg-backgroundContrast dark:bg-backgroundContrastDark rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {filteredLabels.length === 0 && query !== "" ? (
                  <div className="cursor-default select-none relative py-2 px-4 text-primaryText dark:text-primaryTextDark">
                    Nothing found.
                  </div>
                ) : (
                  filteredLabels.map((item) => (
                    <Combobox.Option
                      key={item.slug}
                      className={({ active }) =>
                        `cursor-default select-none relative py-2 pl-10 pr-4 ${
                          active
                            ? "text-primaryTextDark bg-primary"
                            : "text-primaryText dark:text-primaryTextDark"
                        }`
                      }
                      value={item}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {item.name}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? "text-white" : "text-primary"
                              }`}
                            >
                              <Label fontSize="small" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
                {!labelFound && query ? (
                  <div className="py-1 px-2">
                    <Button
                      loading={postingLabel}
                      type="text-icon"
                      startIcon={<Add fontSize="small" />}
                      className="w-full flex justify-center"
                      onClick={handleLabelAddition}
                    >
                      Add{postingLabel && "ing"} {query ? query : "Label"}
                    </Button>
                  </div>
                ) : (
                  <></>
                )}
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>
      </div>

      {fetchingLabels && (
        <div className="desktop-labels-loading-indicator hidden md:block">
          <Loader type={2} size="small" />
        </div>
      )}
    </div>
  );
};

export default LabelSelect;
