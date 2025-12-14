import React from "react";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { imageUpload } from "../../Utils";

const Register = () => {
  const { signInWithGoogle, createUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const f = location.state || "/";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { mutateAsync } = useMutation({
    mutationFn: async (dataregister) =>
      await axios.post(`${import.meta.env.VITE_API_URL}/users`, dataregister),
  });

  const onsubmit = async (data) => {
    const { name, email, password, image } = data;
    const imgFile = image[0];

    try {
      const imgURL = await imageUpload(imgFile);
      const result = await createUser(email, password);
      console.log(result);

      // await saveOrUpdateUser({ name, email, image: imgURL });

      await updateUser(name, imgURL);

      //Save user data to MongoDB
      const usersdata = {
        name,
        email,
        photoURL: imgURL,
      };
      await mutateAsync(usersdata);

      // 5. Reset form and navigate
      reset();
      navigate(f, { replace: true });
      toast.success("Register Successful");
    } catch (err) {
      console.log(err);
      toast.error(err?.message);
    }
  };

  // Handle Google Signin
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();

      const userData = {
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
      };
      await mutateAsync(userData);

      navigate(f, { replace: true });
      toast.success("Register Successful");
    } catch (err) {
      console.log(err);
      toast.error(err?.message);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full p-8 relative">
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <h2 className="text-3xl font-bold text-gray-900 mb-3">Create account</h2>
      <p className="text-gray-600 mb-8">
        Start building your next lesson in minutes.
      </p>

      <form onSubmit={handleSubmit(onsubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Full name
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            {...register("name", {
              required: "name lagbe",
              maxLength: {
                message: "must be 20 word",
              },
            })}
          />
          {errors.name && (
            <p className="text-red-600 text-xs">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="name@example.com"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            {...register("email", {
              required: "email lagbe",
              pattern: {
                value: /@/,
                message: "email hoi nai",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-600 text-xs">{errors.email.message}</p>
          )}
        </div>

        {/* Image */}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Profile Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            className="block w-full text-sm text-gray-500 bg-gray-50 border border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-300 file:text-gray-700 hover:file:bg-gray-400 rounded-md cursor-pointer focus:outline-none py-2"
            {...register("image")}
          />
          <p className="mt-1 text-xs text-gray-400">
            PNG, JPG or JPEG (max 2MB)
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="Create a password"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            {...register("password", {
              required: "password lagbe",
              minLength: {
                value: 6,
                message: "need 6 word",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-600 text-xs">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-start gap-2 text-sm text-gray-600">
          <input type="checkbox" required className="mt-1" />
          <span>
            I agree to the{" "}
            <Link
              to="#"
              className="text-purple-600 font-semibold hover:text-purple-700"
            >
              Terms
            </Link>
            {" and "}
            <Link
              to="#"
              className="text-purple-600 font-semibold hover:text-purple-700"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Create free account
        </button>

        {/* Social Login Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-gray-700 font-medium">
              Sign in with Google
            </span>
          </button>
        </div>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{" "}
        <Link
          to="/auth/login"
          className="text-purple-600 font-semibold hover:text-purple-700"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;
