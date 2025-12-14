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
import Profile from "../Pages/UserDashboard/Profile";
import AddLesson from "../Pages/UserDashboard/AddLesson";
import EditLesson from "../Pages/UserDashboard/EditLesson";
import MyLessons from "../Pages/UserDashboard/MyLessons";
import PaymentSuccess from "../Pages/Payment/PaymentSuccess";
import LessonDetails from "../Pages/Lessons/LessonDetails";
import PaymentCancle from "../Pages/Payment/PaymentCancle";
import Error from "../Pages/Error/Error";
import UserDashboard from "../Pages/UserDashboard/UserDashboard";
import MyFavorites from "../Pages/UserDashboard/MyFavorites";
import ReportedLessons from "../Pages/Admin/ReportedLessons";
import ManageLessons from "../Pages/Admin/ManageLessons";
import ManageUsers from "../Pages/Admin/ManageUsers";
import AdminDashboard from "../Pages/Admin/AdminDashboard";
import AdminRoute from "./AdminRoute";

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
        element: <LessonDetails />,
      },
      {
        path: "/lessons/:id",
        element: <LessonDetails />,
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
        index: true,
        element: (
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        ),
      },
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
        element: (
          <PrivateRoute>
            <AddLesson />
          </PrivateRoute>
        ),
      },
      {
        path: "edit-lesson/:id",
        element: (
          <PrivateRoute>
            <EditLesson />
          </PrivateRoute>
        ),
      },
      {
        path: "my-lesson",
        element: (
          <PrivateRoute>
            <MyLessons />
          </PrivateRoute>
        ),
      },
      {
        path: "my-favorite",
        element: (
          <PrivateRoute>
            <MyFavorites />
          </PrivateRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
      },
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: "manage-lessons",
        element: (
          <AdminRoute>
            <ManageLessons />
          </AdminRoute>
        ),
      },
      {
        path: "reported-lessons",
        element: (
          <AdminRoute>
            <ReportedLessons />
          </AdminRoute>
        ),
      },
    ],
  },
]);
