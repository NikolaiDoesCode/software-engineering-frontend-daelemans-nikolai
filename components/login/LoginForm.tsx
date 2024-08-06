import { StatusMessage } from "@/types";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import userService from "@/service/userService";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import Script from "next/script";
import { FormEvent } from "react";
import captchaService from "@/service/captchaService";

declare const grecaptcha: {
  getResponse: () => string;
};
const Login: React.FC = () => {
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<String | null>(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<String | null>(null);
  const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
  const router = useRouter();
  const [isClient, setIsClient] = useState<boolean>(false);
  // this is here to make sure it works when the browser autofills the email and password
  useEffect(() => {
    setIsClient(true);
    if (
      document.querySelector("#email") &&
      document.querySelector("#password")
    ) {
      setEmail((document.querySelector("#email") as HTMLInputElement).value);
      setPassword(
        (document.querySelector("#password") as HTMLInputElement).value
      );
    }
  }, []);
  const { t } = useTranslation();
  const handleEmailFocus = () => {
    setIsEmailFocused(true);
  };

  const handleEmailBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.value === "") {
      setIsEmailFocused(false);
    }
  };

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };

  const handlePasswordBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.value === "") {
      setIsPasswordFocused(false);
    }
  };

  const clearErrors = () => {
    setEmailError(null);
    setPasswordError(null);
    setStatusMessages([]);
  };

  const validate = (): boolean => {
    let result = false;
    if (!email && email.trim() === "") {
      setEmailError("Email is required");
      result = false;
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(email)) {
      setEmailError(
        "Email value is invalid, it has to be of the following format xxx@yyy.zzz"
      );
      result = false;
    }

    if (!password && password.trim() === "") {
      setPasswordError("Password is required");
      result = false;
    } else {
      result = true;
    }
    return result;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const captchaResponse = grecaptcha.getResponse();
    if (captchaResponse.length === 0) {
      setStatusMessages([{ message: "Captcha not completed", type: "error" }]);
      return;
    }
    const form = event.currentTarget;
    const fd = new FormData(form);
    try {
      const response = await fetch("https://httpbin.org/post", {
        method: "POST",
        body: fd,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log("hey");
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }

    clearErrors();
    if (!validate()) return;
  
    try {
      const loginUser = { email, password };
      const response = await userService.login(loginUser);
  
      if (response.status === 200) {
        setStatusMessages([{ message: "Login successful", type: "success" }]);
        const user = await response.json();
        sessionStorage.setItem("user", JSON.stringify(user.user));
        sessionStorage.setItem("token", user.token);
        toHomepage();
      } else if (response.status === 401) {
        const { errorMessage } = await response.json();
        setStatusMessages([{ message: errorMessage, type: "error" }]);
      } else {
        setStatusMessages([{ message: "Incorrect email or password", type: "error" }]);
      }
    } catch (error) {
      console.error("Error:", error);
      setStatusMessages([{ message: "Captcha verification error", type: "error" }]);
    }
  };

  

  const toHomepage =() => {
    setTimeout(() => router.push("./"), 2000)
    // router.push("./")
  }

  return (
    <>
      {isClient && (
        <>
          <Head>
            <script src="https://www.google.com/recaptcha/api.js"></script>
            <script
              src="https://www.google.com/recaptcha/api.js"
              async
              defer
            ></script>
          </Head>
          <h1 className="text-center text-2xl font-semibold mt-12">Login</h1>
          <div className="container mx-auto mt-4 mb-12">
            {statusMessages && (
              <div className="text-center text-red-600">
                <ul>
                  {statusMessages.map(({ message, type }, index) => (
                    <li key={index}>{message}</li>
                  ))}
                </ul>
              </div>
            )}
            <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
              {emailError && (
                <p className="text-red-600 font-semibold">{emailError}</p>
              )}
              <div className="mb-4 relative">
                <label
                  className={`absolute transition-all duration-300 leading-8 cursor-text ${
                    isEmailFocused ? "text-xs" : "text-base top-2 text-black"
                  } left-4 text-gray-500`}
                  htmlFor="email"
                >
                  {t("rentals.email")}
                </label>
                <input
                  className="border border-black rounded w-full pt-5 pb-1 px-3 focus:outline-none"
                  id="email"
                  type="text"
                  onFocus={handleEmailFocus}
                  onBlur={handleEmailBlur}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              {passwordError && (
                <p className="text-red-600 font-semibold">{passwordError}</p>
              )}
              <div className="mb-4 relative">
                <label
                  className={`absolute transition-all duration-300 leading-8 cursor-text ${
                    isPasswordFocused ? "text-xs" : "text-base top-2 text-black"
                  } left-4 text-gray-500`}
                  htmlFor="password"
                >
                  {t("login.password")}
                </label>
                <input
                  className="border border-black rounded w-full pt-5 pb-1 px-3 focus:outline-none"
                  id="password"
                  type="password"
                  onFocus={handlePasswordFocus}
                  onBlur={handlePasswordBlur}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <div className="flex justify-center mt-4">
                  <div
                    className="g-recaptcha"
                    data-sitekey="6LclyfEpAAAAAFcq3ElN5A0YSfKwYagI9Q93VlVd"
                  ></div>
                </div>
              </div>
              <Link href={"/login/createAccount"} className="underline">
                {t("login.create")}
              </Link>
              <div className="flex items-center justify-center">
                <button
                  className="bg-gray-800 text-white font-bold py-2 px-4 z-10 rounded hover:scale-105"
                  type="submit"
                >
                  {t("login.signIn")}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default Login;
