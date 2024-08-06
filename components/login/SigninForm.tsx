import { StatusMessage, Role } from "@/types";
import userService from "@/service/userService";
import { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const SigninForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState<Role>(Role.OWNER);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [dateOfBirthError, setDateOfBirthError] = useState<string | null>(null);
  const [phonenumberError, setPhonenumberError] = useState<string | null>(null);
  const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
  const router = useRouter();
  const { t } = useTranslation();
  const clearErrors = () => {
    setPasswordError(null);
    setFirstNameError(null);
    setLastNameError(null);
    setEmailError(null);
    setDateOfBirthError(null);
    setPasswordError(null);
    setStatusMessages([]);
  };

  const validate = (): boolean => {
    let result = true;
    if (!password || password.trim() === "") {
      setPasswordError("Password is required");
      result = false;
    }
    if (!firstName || firstName.trim() === "") {
      setFirstNameError("First name is required");
      result = false;
    }
    if (!lastName || lastName.trim() === "") {
      setLastNameError("Last name is required");
      result = false;
    }
    if (!email || email.trim() === "") {
      setEmailError("Email is required");
      result = false;
    }
    if (!dateOfBirth || dateOfBirth.trim() === "") {
      setDateOfBirthError("Date of birth is required");
      result = false;
    }
    if (!phoneNumber || phoneNumber.trim() === "") {
      setPhonenumberError("Phone number is required");
      result = false;
    }
    return result;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearErrors();
    if (!validate()) {
      return;
    }

    const user = {
      password,
      firstName,
      lastName,
      email,
      dateOfBirth,
      phoneNumber,
      role,
    };
    const response = await userService.createUser(user);
    try {
      if (response.status === 200) {
        setStatusMessages([
          {
            message: `Sign-In Successful, redirecting to Login...`,
            type: "success",
          },
        ]);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const dataUser = await response.json();
        if (dataUser.field == "password") {
          setPasswordError(dataUser.password);
        }
        if (dataUser.field == "firstName") {
          setFirstNameError(dataUser.firstName);
        }
        if (dataUser.field == "lastName") {
          setLastNameError(dataUser.lastName);
        }
        if (dataUser.field == "email") {
          setEmailError(dataUser.message);
        }
        if (dataUser.field == "dateOfBirth") {
          setDateOfBirthError(dataUser.dateOfBirth);
        }
        if (dataUser.field == "phoneNumber") {
          setPhonenumberError(dataUser.phoneNumber);
        }

        return;
      }
    } catch (error) {
      console.error("Error creating account:", error);
      setStatusMessages([
        { type: "error", message: "Failed to create account" },
      ]);
      return null;
    }
  };

  return (
    <>
      <h1 className="text-center text-2xl font-semibold mt-12">
        {t("login.create")}
      </h1>
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
            <label htmlFor="email">{t("rentals.email")}</label>
            <input
              className="border border-black rounded w-full pt-3 pb-3 px-3 focus:outline-none"
              id="email"
              type="text"
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          {passwordError && (
            <p className="text-red-600 font-semibold">{passwordError}</p>
          )}
          <div className="mb-4 relative">
            <label htmlFor="password">{t("login.password")}</label>
            <input
              className="border border-black rounded w-full pt-3 pb-3 px-3 focus:outline-none"
              id="password"
              type="password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {firstNameError && (
            <p className="text-red-600 font-semibold">{firstNameError}</p>
          )}
          <div className="mb-4 relative">
            <label htmlFor="firstName">{t("login.first")}</label>
            <input
              className="border border-black rounded w-full pt-3 pb-3 px-3 focus:outline-none"
              id="firstName"
              type="text"
              onChange={(event) => setFirstName(event.target.value)}
            />
          </div>
          {lastNameError && (
            <p className="text-red-600 font-semibold">{lastNameError}</p>
          )}
          <div className="mb-4 relative">
            <label htmlFor="lastName">{t("login.last")}</label>
            <input
              className="border border-black rounded w-full pt-3 pb-3 px-3 focus:outline-none"
              id="lastName"
              type="text"
              onChange={(event) => setLastName(event.target.value)}
            />
          </div>
          {phonenumberError && (
            <p className="text-red-600 font-semibold">{phonenumberError}</p>
          )}
          <div className="mb-4 relative">
            <label htmlFor="phoneNumber">{t("users.number")}</label>
            <input
              className="border border-black rounded w-full pt-3 pb-3 px-3 focus:outline-none"
              id="phoneNumber"
              type="text"
              onChange={(event) => setPhoneNumber(event.target.value)}
            />
          </div>
          {dateOfBirthError && (
            <p className="text-red-600 font-semibold">{dateOfBirthError}</p>
          )}
          <div className="mb-4 relative">
            <label htmlFor="dateOfBirth">{t("login.birth")}</label>
            <input
              className="border border-black rounded w-full pt-3 pb-3 px-3 focus:outline-none"
              id="dateOfBirth"
              type="date"
              onChange={(event) => setDateOfBirth(event.target.value)}
            />
          </div>
          <div className="mb-4 relative">
            <label htmlFor="role">{t("login.role")}</label>
            <select
              className="border border-black rounded w-full pt-3 pb-3 px-3 focus:outline-none"
              id="role"
              onChange={(event) => setRole(event.target.value as Role)}
            >
              <option value={Role.OWNER}>{t("users.owner")}</option>
              <option value={Role.RENTER}>{t("users.renter")}</option>
            </select>
          </div>
          <div className="flex items-center justify-center ">
            <button
              className="bg-gray-800 text-white font-bold py-2 px-4 z-10 rounded hover:scale-105"
              type="submit"
            >
              {t("submit")}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SigninForm;
