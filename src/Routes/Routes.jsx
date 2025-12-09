import { createBrowserRouter, Navigate } from "react-router";
import HomeLayouts from "../Layouts/HomeLayouts";
import Home from "../Pages/Home/Home";
import Pricing from "../Pages/Payment/Pricing";
import Login from "../Pages/Auth/Login";
import Register from "../Pages/Auth/Register";
import AuthLayout from "../Layouts/AuthLayout";
import PublicLessons from "../Pages/Lessons/PublicLessons";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../Layouts/DashboardLayout";
import Profile from "../Pages/Dashboard/Profile";
import AddLesson from "../Pages/Dashboard/AddLesson";
import MyLessons from "../Pages/Dashboard/MyLessons";
import PaymentSuccess from "../Pages/Payment/PaymentSuccess";
import MyFavorites from "../Pages/Lessons/MyFavorites";
import LessonDetails from "../Pages/Lessons/LessonDetails";
import PaymentCancle from "../Pages/Payment/PaymentCancle";
import Error from "../Pages/Error/Error";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayouts />,
    errorElement: <Error />,
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
        path: "payment-success",
        element: <PaymentSuccess />,
      },
      {
        path: "payment-cancle",
        element: <PaymentCancle />,
      },
      {
        path: "/publiclessons",
        Component: PublicLessons,
      },
      {
        path: "/publiclessons/:id",
        element: (
          <PrivateRoute>
            <LessonDetails />
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
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    path: "dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "add-lesson",
        Component: AddLesson,
      },
      {
        path: "my-lesson",
        Component: MyLessons,
      },
      {
        path: "my-favorite",
        Component: MyFavorites,
      },
    ],
  },
]);
