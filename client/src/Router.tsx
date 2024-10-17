import { createBrowserRouter } from "react-router-dom";
import SuggestionPage from "./pages/suggestion/index";
import ChatPage from "./pages/chat/index";
import ForYouPage from "./pages/forYou";

const Router = createBrowserRouter([
    {
        path: "/user/suggestions",
        element: <SuggestionPage />,
    },
    {
        path: "/chat",
        element: <ChatPage />,
    },
    {
        path: "/foryou",
        element: <ForYouPage />,
    }
]);

export default Router;