import useAuth from "./useAuth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useRole = () => {
  const { user, loading } = useAuth();

  const { data: role = "user", isLoading: isRoleLoading } = useQuery({
    enabled: !loading && !!user?.email,
    queryKey: ["role", user?.email],
    queryFn: async () => {
      const result = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/role/${user.email}`
      );
      console.log("User Role:", result.data);
      return result.data.role;
    },
  });

  return [role, isRoleLoading];
};

export default useRole;