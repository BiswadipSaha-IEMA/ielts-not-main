import React from "react";
import AppRouter from "../routes/AppRouter";
import AuthRouter from "../routes/AuthRouter";
import { useLogin } from "../context/LoginProvider";
import ExamProvider from "../context/ExamProvider";
// import { QueryClient, QueryClientProvider } from "react-query";
import { SafeAreaView } from "react-native";

// const queryClient = new QueryClient();

const MainNavigator = () => {
  const { isLoggedIn } = useLogin();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <QueryClientProvider client={queryClient}> */}
      {isLoggedIn ? (
        <ExamProvider>
          <AppRouter />
        </ExamProvider>
      ) : (
        <AuthRouter />
      )}
      {/* </QueryClientProvider> */}
    </SafeAreaView>
  );
};

export default MainNavigator;
