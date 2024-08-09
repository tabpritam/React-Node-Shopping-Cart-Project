import "./ResetPassword.scss";
import { useState, useEffect } from "react";
import usePut from "../../hooks/usePut";
import swal from "sweetalert";

const ResetPassword = () => {
  const queryParameters = new URLSearchParams(window.location.search);
  console.log(queryParameters);
  const urlToken = queryParameters.get("token");
  console.log(urlToken);
  const [resetPasswordInput, setRestPasswordInput] = useState({
    email: "",
    password: "",
  });
  const resetPasswordEndpoint = `user/reset-password/${urlToken}`;

  const {
    data: restPasswordData,
    error: restPassworError,
    loading: restPasswordLoading,
    makeApiCall: resetPassword,
  } = usePut(resetPasswordEndpoint, resetPasswordInput);

  useEffect(() => {
    if (restPasswordData && !restPassworError) {
      swal({
        title: "Password Reset",
        text: "Password reset successfully",
        icon: "success",
      });
    }
    if (restPassworError) {
      swal({
        title: "Password Reset",
        text: "Password reset failed",
        icon: "error",
      });
    }
  }, [restPasswordData, restPassworError]);

  const handleResetPassword = () => {
    resetPassword();
  };

  return (
    <div className="forgotpassword-wrapper">
      <div className="container">
        <h1>Reset Your Password</h1>
        <div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              onChange={(e) =>
                setRestPasswordInput({
                  ...resetPasswordInput,
                  [e.target.name]: e.target.value,
                })
              }
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              onChange={(e) =>
                setRestPasswordInput({
                  ...resetPasswordInput,
                  [e.target.name]: e.target.value,
                })
              }
            />
          </div>
          <button
            type="submit"
            onClick={handleResetPassword}
            disabled={restPasswordLoading}
          >
            {restPasswordLoading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
