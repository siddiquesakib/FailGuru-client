import { createBrowserRouter, Navigate } from "react-router";
import HomeLayouts from "../Layouts/HomeLayouts";
import Home from "../Pages/Home/Home";
import Pricing from "../Pages/Payment/Pricing";
import Login from "../Pages/Auth/Login";
import Register from "../Pages/Auth/Register";
import AuthLayout from "../Layouts/AuthLayout";
import PublicLessons from "../Pages/Lessons/PublicLessons";
import PublicLessonDetails from "../Pages/Lessons/PublicLessonDetails";
import PrivateRoute from "./PrivateRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayouts />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "pricing",
        element: <Pricing />,
      },
      {
        path: "/publiclessons",
        Component: PublicLessons,
      },
      {
        path: "/publiclessonsdetails/:id",
        element: (
          <PrivateRoute>
            <PublicLessonDetails />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="login" replace />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
]);
