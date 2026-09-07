import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from 'react-redux';
import { fetchAuthSession } from "../../redux/slices/authSlice";
import { toast } from "sonner";
import { axiosInstance } from "../../api/axiosConfig";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { getPendingReturnTo, clearPendingReturnTo } from "../navigation/returnTo";

const GoogleAuthButton = ({ onSuccessRedirect, role, isDarkMode }) => {
    const navigate = useNavigate(); // For redirection
    const dispatch = useDispatch();

    const handleGoogleSuccess = async (response) => {
        try {
            const res = await axiosInstance.post("/auth/google", {
                token: response.credential,
                role,
            });

            console.log(
                "Google credential length:",
                response.credential?.length
            );

            if (res.status === 200) {
                const { message } = res.data;


                toast.success(message);

                await dispatch(fetchAuthSession()).unwrap();

                if (role === "user") {
                    const pendingReturnTo = getPendingReturnTo();
                    if (pendingReturnTo) {
                        navigate(pendingReturnTo);
                        clearPendingReturnTo();
                    } else {
                        navigate("/");
                    }
                } else if (role === "admin") {
                    navigate("/admin/dashboard");
                }
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Google sign-in was unsuccessful.";
            toast.error(errorMessage);
            console.error("Google Auth Button error:", errorMessage);
        }
    };

    const handleGoogleFailure = () => {
        toast.error("Google sign-in was unsuccessful.");
    };

    return (
        <div className="w-full">
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                useOneTap
                theme={isDarkMode ? "filled_black" : "outline"}
                size="large"
                shape="rectangular"
                text="continue_with"
            />
        </div>
    );
};

export default GoogleAuthButton;
