import { createBrowserRouter } from "react-router-dom";
import SuggestionPage from "./pages/suggestion";

const Router = createBrowserRouter([
    {
        path: "/user/suggestions",
        element: <SuggestionPage />,
    },
]);

export default Router;