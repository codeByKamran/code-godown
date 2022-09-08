import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";

import store from "@redux/store";

import PersistLogin from "../Auth/PersistLogin";
import MuiThemeWrapper from "../../theming/MuiThemeWrapper";

const queryClient = new QueryClient();

const Wrappers = ({ children }) => {
  return (
    <NextThemeProvider attribute="class">
      <Provider store={store}>
        <MuiThemeWrapper>
          <QueryClientProvider client={queryClient}>
            <SnackbarProvider maxSnack={3}>
              <PersistLogin>{children}</PersistLogin>
              <ReactQueryDevtools initialIsOpen={false} />
            </SnackbarProvider>
          </QueryClientProvider>
        </MuiThemeWrapper>
      </Provider>
    </NextThemeProvider>
  );
};

export default Wrappers;
