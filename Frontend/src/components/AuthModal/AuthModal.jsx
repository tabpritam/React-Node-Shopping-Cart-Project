import "./AuthModal.scss";
import { useState, useEffect } from "react";
import usePost from "../../hooks/usePost";
import swal from "sweetalert";
import { IoClose } from "react-icons/io5";

const AuthModal = ({ showModalStatus, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [registerInput, setRegisterInput] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    mobile: "",
  });
  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });
  const [forgotpasswordInput, setForgotPasswordInput] = useState({
    email: "",
  });

  const loginEndpoint = "user/login";
  const registerEndpoint = "user/register";
  const forgotPasswordTokenEndpoint = "user/forgot-password-token";

  const {
    data: loginData,
    error: loginError,
    loading: loginLoading,
    makeApiCall: login,
  } = usePost(loginEndpoint, loginInput);
  const {
    data: registerData,
    error: registerError,
    loading: registerLoading,
    makeApiCall: register,
  } = usePost(registerEndpoint, registerInput);

  const {
    data: forgotPasswordTokenData,
    error: forgotPasswordTokenError,
    loading: forgotPasswordTokenLoading,
    makeApiCall: forgotPasswordToken,
  } = usePost(forgotPasswordTokenEndpoint, forgotpasswordInput);

  useEffect(() => {
    if (loginData && !loginError) {
      localStorage.setItem("token", loginData.token);
      swal({
        title: "Welcome",
        text: "Logged in successfully",
        icon: "success",
      }).then(() => {
        onLogin(loginData.firstname);
      });
    }
    if (loginError) {
      swal({
        title: "Error",
        text: loginError.message,
        icon: "error",
      });
    }
  }, [loginData, loginError, onLogin]);
  useEffect(() => {
    if (registerData && !registerError) {
      swal({
        title: "Welcome",
        text: "Registered successfully",
        icon: "success",
      }).then(() => {
        showModalStatus(false);
      });
    }
    if (registerError) {
      swal({
        title: "Error",
        text: registerError.message,
        icon: "error",
      });
    }
  }, [registerData, registerError, showModalStatus]);

  useEffect(() => {
    if (forgotPasswordTokenData && !forgotPasswordTokenError) {
      console.log(forgotPasswordTokenData);

      swal({
        title: "Success",
        text: forgotPasswordTokenData.message,
        icon: "success",
      }).then(() => {
        setIsForgotPassword(false);
      });
    }
    if (forgotPasswordTokenError) {
      swal({
        title: "Error",
        text: forgotPasswordTokenError.message,
        icon: "error",
      });
    }
  }, [forgotPasswordTokenData, forgotPasswordTokenError, showModalStatus]);

  const handleLogin = () => {
    login();
  };
  const handleSignup = () => {
    register();
  };
  const handleSendResetUrl = () => {
    forgotPasswordToken();
  };

  return (
    <div className="overlay">
      <div className="form-wrapper">
        <div className="close-btn">
          <IoClose onClick={() => showModalStatus(false)} />
        </div>
        <div className="form-container">
          {isForgotPassword ? (
            <>
              <div className="forgot-password-container">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="authl"
                  required
                  name="email"
                  value={forgotpasswordInput.email}
                  onChange={(e) =>
                    setForgotPasswordInput({
                      ...forgotpasswordInput,
                      [e.target.name]: e.target.value,
                    })
                  }
                />

                <button
                  onClick={handleSendResetUrl}
                  disabled={forgotPasswordTokenLoading}
                >
                  {forgotPasswordTokenLoading
                    ? "Sending..."
                    : "Send Reset Password URL"}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="form-toggle">
                <button
                  className={`login-btn ${isLogin ? "active" : ""} `}
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </button>
                <button
                  className={`signup-btn ${!isLogin ? "active" : ""} `}
                  onClick={() => setIsLogin(false)}
                >
                  Sign Up
                </button>
              </div>
              {isLogin ? (
                <>
                  <div className="login-form">
                    <div>Login</div>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="authl"
                      required
                      name="email"
                      value={loginInput.email}
                      onChange={(e) =>
                        setLoginInput({
                          ...loginInput,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                    <input
                      type="password"
                      placeholder="Enter your password"
                      name="password"
                      className="authl"
                      value={loginInput.password}
                      onChange={(e) =>
                        setLoginInput({
                          ...loginInput,
                          [e.target.name]: e.target.value,
                        })
                      }
                      required
                    />
                    <button onClick={handleLogin} disabled={loginLoading}>
                      {loginLoading ? "Logging in..." : "Login"}
                    </button>
                    <div className="forgot-password-row">
                      <a onClick={() => setIsForgotPassword(true)}>
                        Forgot Password?
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="signup-form">
                    <div>Sign up</div>
                    <input
                      type="text"
                      placeholder="First Name"
                      required
                      name="firstname"
                      value={registerInput.firstname}
                      onChange={(e) =>
                        setRegisterInput({
                          ...registerInput,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      required
                      name="lastname"
                      value={registerInput.lastname}
                      onChange={(e) =>
                        setRegisterInput({
                          ...registerInput,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      required
                      name="email"
                      value={registerInput.email}
                      onChange={(e) =>
                        setRegisterInput({
                          ...registerInput,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Enter your mobile"
                      required
                      name="mobile"
                      value={registerInput.mobile}
                      onChange={(e) =>
                        setRegisterInput({
                          ...registerInput,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                    <input
                      type="password"
                      placeholder="ENter your password"
                      required
                      name="password"
                      value={registerInput.password}
                      onChange={(e) =>
                        setRegisterInput({
                          ...registerInput,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                    <button onClick={handleSignup} disabled={registerLoading}>
                      {registerLoading ? "Signing Up.." : "Signup"}
                    </button>
                    {registerData && (
                      <div className="success">Signup successful!</div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
