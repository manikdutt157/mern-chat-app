import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogout";

const LogoutButton = () => {
  const { loading, logout } = useLogout();

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-10">
      {!loading ? (
        <BiLogOut
          className="
            w-8 h-8 sm:w-10 sm:h-10
            cursor-pointer
            text-white hover:text-purple-700
            transition-colors duration-200
          "
          onClick={logout}
        />
      ) : (
        <span
          className="
            loading loading-spinner
            w-8 h-8 sm:w-10 sm:h-10
            text-white
          "
        ></span>
      )}
    </div>
  );
};

export default LogoutButton;