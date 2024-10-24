import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/login";
import SuggestionPage from "./pages/suggestion/index";
import ResetPassword from "./pages/resetPass/resetPassword";
import QueryHistoryAll from "./pages/queryHistory";
import IndividualQuery from "./pages/individualQuery";
import AuthenticatedLayout from "./pages/layout";
import ChatPage from "./pages/chat";
import ProfilePage from "./pages/profile";


const Router = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage/>
    },
    {
        path: "/suggestions",
        element: <SuggestionPage />,
    },
    {
        path: "/reset-password/:token",
        element: <ResetPassword />,
    },
    {
        element: <AuthenticatedLayout />,
        children: [
          {
            path: "/chat",
            element: <ChatPage />
          },
          {
            path: "/queries",
            element: <QueryHistoryAll />
          },
          {
            path: "/querie/:id",
            element: <IndividualQuery />
          },{
            path: "/Profile",
            element: <ProfilePage />
          }
        ]
    }
]);

export default Router;