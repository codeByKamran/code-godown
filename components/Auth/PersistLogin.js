import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocalStorage } from "react-use";
import useAuth from "../../hooks/auth/useAuth";
import useRefreshToken from "../../hooks/auth/useRefreshToken";
import { SET_AUTH_LOADING } from "../../redux/slices/appSlice";
import { persistBlacklistedRoutes } from "../../config/persistBlocklistedRoutes";
import LoaderModal from "../Generic/Loader/LoaderModal";

const PersistLogin = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const currentUser = useAuth();
  const [remember, setRemember, removeRemeber] = useLocalStorage(
    "cg-remember-device",
    false
  );

  useEffect(() => {
    let mounted = true;

    const verifyRefreshToken = async () => {
      console.log("Verifying Refresh token");
      try {
        await refresh();
      } catch (err) {
        console.log(err);
      } finally {
        mounted && dispatch(SET_AUTH_LOADING(false));
        mounted && setIsLoading(false);
      }
    };

    let doVerifyRefreshToken = true;

    persistBlacklistedRoutes.forEach((blacklistedRoute) => {
      let routeIsBlacklisted = router.route.includes(blacklistedRoute);

      if (routeIsBlacklisted) {
        doVerifyRefreshToken = false;
      }
    });

    if (!currentUser?.accessToken && remember && doVerifyRefreshToken) {
      // verify refresh token to persist login
      verifyRefreshToken();
    } else {
      // just get going - no need to presist login
      // untrusted device || public route
      setIsLoading(false);
      dispatch(SET_AUTH_LOADING(false));
    }

    return () => {
      mounted = false;
    };
  }, [
    currentUser,
    remember,
    router.route,
    persistBlacklistedRoutes,
    refresh,
    dispatch,
  ]);

  // if (!remember) {
  //   return children;
  // }

  if (isLoading) {
    // some sort of loading jesture
    return (
      <>
        {children}
        <div className="auth-loader">
          <LoaderModal loading />
        </div>
      </>
    );
  }

  return children;
};

export default PersistLogin;
