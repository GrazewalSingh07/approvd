import React, { useEffect, useState } from "react";
import { Navigate, Link, useNavigate } from "react-router";
import {
  doCreateUserWithEmailAndPassword,
  doCreateUserWithNumberAndPassword,
} from "../../firebase/auth";
import {
  RecaptchaVerifier,
  sendEmailVerification,
  signInWithPhoneNumber,
} from "firebase/auth";
import toast from "react-hot-toast";
import { Segmented, Input, Space } from "antd";
import { auth } from "../../firebase/firebase";

const Register = () => {
  const navigate = useNavigate();

  const [loginType, setLoginType] = useState("email");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false);

  let appVerifier;
  useEffect(() => {
    appVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: () => {
        setIsRecaptchaVerified(true);
      },
    });
  }, []);

  const signupWithPhoneNumber = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    try {
      // const appVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      //   size: "invisible",
      //   callback: (response) => {
      //     signInWithPhoneNumber(auth, phoneNumber, appVerifier).then(
      //       (result) => {
      //         console.log(result, "result");
      //         setConfirmationResult(result);
      //       },
      //     );
      //   },
      // });
      if (!isRecaptchaVerified) {
        toast.error("Recaptcha verification failed");
        return;
      }
      signInWithPhoneNumber(auth, phoneNumber, appVerifier).then((result) => {
        console.log(result, "result");
        setConfirmationResult(result);
      });
      setOtpSent(true);
      toast.success("OTP sent successfully!");
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
      toast.error(error.message);
    } finally {
      setIsRegistering(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsRegistering(true);
    try {
      console.log(confirmationResult, "cnf");
      await confirmationResult.confirm(otp);
      toast.success("Phone number verified successfully!");
      navigate("/dashboard"); // or wherever you want to redirect after successful verification
    } catch (error) {
      console.error(error);
      setErrorMessage("Invalid OTP. Please try again.");
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isRegistering) {
      if (password == confirmPassword) {
        setIsRegistering(true);
        const currentUser = await doCreateUserWithEmailAndPassword(
          email,
          password,
        );
        await sendEmailVerification(currentUser);
        setIsRegistering(false);
        toast.success("Email verification sent");
      } else {
        setIsRegistering(false);
        toast.error("passwords must be same");
        setErrorMessage("passwords must be same");
      }
    }
  };

  return (
    <>
      <div id="recaptcha-container"></div>
      <main className="w-full  md:h-screen flex self-center place-content-center place-items-center">
        <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
          <div className="text-center mb-6">
            <div className="mt-2">
              <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">
                Create a New Account
              </h3>
            </div>
          </div>
          <Segmented
            value={loginType}
            className="mb-2 w-full"
            block={true} // Makes the component take full width
            onChange={setLoginType}
            options={["email", "phone"]}
            style={{ marginBottom: "1rem" }} // Add some bottom margin
          />
          {loginType === "email" ? (
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 font-bold">Email</label>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 font-bold">
                  Password
                </label>
                <input
                  disabled={isRegistering}
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 font-bold">
                  Confirm Password
                </label>
                <input
                  disabled={isRegistering}
                  type="password"
                  autoComplete="off"
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setconfirmPassword(e.target.value);
                  }}
                  className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                />
              </div>

              {errorMessage && (
                <span className="text-red-600 font-bold">{errorMessage}</span>
              )}

              <button
                type="submit"
                disabled={isRegistering}
                className={`w-full px-4 py-2 text-white font-medium rounded-lg ${isRegistering ? "bg-gray-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300"}`}
              >
                {isRegistering ? "Signing Up..." : "Sign Up"}
              </button>
            </form>
          ) : (
            <form
              onSubmit={otpSent ? verifyOtp : signupWithPhoneNumber}
              className="space-y-4"
            >
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 font-bold">
                  Phone Number
                </label>
                <input
                  disabled={isRegistering || otpSent}
                  type="tel"
                  autoComplete="tel"
                  required
                  placeholder="+1234567890"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                  }}
                  className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                />
              </div>

              {otpSent && (
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 font-bold">
                    Enter OTP
                  </label>
                  <input
                    disabled={isRegistering}
                    type="text"
                    maxLength={6}
                    required
                    placeholder="6-digit OTP"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/[^0-9]/g, ""));
                    }}
                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We've sent a 6-digit code to your phone
                  </p>
                </div>
              )}

              {errorMessage && (
                <span className="text-red-600 font-bold">{errorMessage}</span>
              )}

              <button
                type="submit"
                disabled={isRegistering}
                className={`w-full px-4 py-2 text-white font-medium rounded-lg ${isRegistering ? "bg-gray-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300"}`}
              >
                {isRegistering
                  ? "Loading..."
                  : otpSent
                    ? "Verify OTP"
                    : "Send OTP"}
              </button>

              {otpSent && (
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                  }}
                  className="w-full px-4 py-2 text-indigo-600 font-medium rounded-lg border border-indigo-600 hover:bg-indigo-50 transition duration-300"
                >
                  Change Phone Number
                </button>
              )}
            </form>
          )}
          <div className="text-sm text-center">
            Already have an account? {"   "}
            <Link
              to={"/login"}
              className="text-center text-blue-500 text-sm hover:text-blue-500 hover:underline font-bold"
            >
              Continue
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default Register;
