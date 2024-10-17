import { createBrowserRouter } from "react-router-dom";
import SuggestionPage from "./pages/suggestion";
import LoginPage from "./pages/login";

const Router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage/>
    },
    {
        path: "/user/suggestions",
        element: <SuggestionPage />,
    },
]);

export default Router;