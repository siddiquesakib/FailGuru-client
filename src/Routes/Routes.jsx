import { createBrowserRouter } from "react-router";
import HomeLayouts from "../Layouts/HomeLayouts";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayouts></HomeLayouts>,
    children: [
      {
        index: true,
        Component: {},
      },
    ],
  },
]);
