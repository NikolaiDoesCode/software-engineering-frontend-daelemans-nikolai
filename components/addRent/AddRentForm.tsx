import { Rent, Rental, StatusMessage } from "@/types";
import React, { useEffect, useState } from "react";
import StatusMessageList from "../errors/statusMessageList";
import { useRouter } from "next/router";
import RentService from "@/service/rentService";
import { useTranslation } from "next-i18next";

interface Props {
  rental: Rental;
  // addRent: (rentData: Rent) => Promise<void>;
  addRentMessages: StatusMessage[] | null;
  setAddRentMessages: Function;
  addRentError: string | null;
  setAddRentError: Function;
}

const AddRentForm: React.FC<Props> = ({
  rental,
  // addRent,
  addRentMessages,
  setAddRentMessages,
  addRentError,
  setAddRentError,
}: Props) => {
  const [phoneNumberRenter, setPhoneNumberRenter] = useState("");
  const [emailRenter, setEmailRenter] = useState("");
  const [nationalRegisterId, setNationalRegisterId] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState("");

  const [userEmail, setUserEmail] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    // Check if sessionStorage is available
    if (typeof window !== "undefined" && window.sessionStorage) {
      const user = sessionStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        setUserEmail(userData.email); // Set user email
      }
    }
  }, []);

  const router = useRouter();

  const addingRent = async () => {
    setAddRentMessages(null);

    if (!phoneNumberRenter) {
      setAddRentMessages([
        { type: "error", message: "Phone number is required" },
      ]);
      return;
    }

    let cleanedPhoneNumber = phoneNumberRenter.replace(/\s/g, "");

    const numberRegex: RegExp = /^[0-9]+$/; // Matches only numbers

    if (!numberRegex.test(cleanedPhoneNumber)) {
      setAddRentMessages([
        { type: "error", message: "Phone number should contain only numbers" },
      ]);
      return;
    }

    if (cleanedPhoneNumber.length < 8 || cleanedPhoneNumber.length > 15) {
      setAddRentMessages([
        { type: "error", message: "Phone number is too long" },
      ]);
      return;
    }

    // if (!emailRenter) {
    //     setAddRentMessages([
    //         { type: "error", message: "Email is required" },
    //     ]);
    //     return;
    // }

    // const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    // if (!emailRegex.test(emailRenter)) {
    //     setAddRentMessages([
    //         { type: "error", message: "Email value is invalid, it has to be of the following format xxx@yyy.zzz" },
    //     ]);
    //     return;
    // }

    if (!nationalRegisterId) {
      setAddRentMessages([
        {
          type: "error",
          message: "Identification number of national register is required",
        },
      ]);
      return;
    }

    const nationalRegisterRegex = /^\d{2}\.\d{2}\.\d{2}-\d{3}\.\d{2}$/;

    if (!nationalRegisterRegex.test(nationalRegisterId)) {
      setAddRentMessages([
        {
          type: "error",
          message:
            "Identification number of national register is invalid, it has to be of the following format yy.mm.dd-xxx.zz",
        },
      ]);
      return;
    }

    if (!birthDate) {
      setAddRentMessages([{ type: "error", message: "BirthDate is required" }]);
      return;
    }

    if (!drivingLicenseNumber) {
      setAddRentMessages([
        { type: "error", message: "Driving licence number is required" },
      ]);
      return;
    }

    const drivingLicenseNumberRegex = /^\d{10}$/;

    if (!drivingLicenseNumberRegex.test(drivingLicenseNumber)) {
      setAddRentMessages([
        {
          type: "error",
          message:
            "Driving licence number is invalid, it has to be of the following format 0000000000 (where each 0 is a number between 0 and 9)",
        },
      ]);
      return;
    }

    const rentData: Rent = {
      phoneNumberRenter: phoneNumberRenter,
      emailRenter: userEmail,
      nationalRegisterId: nationalRegisterId,
      birthDate: birthDate,
      drivingLicenseNumber: drivingLicenseNumber,
      rental: rental,
    };

    const response = await RentService.addRent(rentData, userEmail);

    if (response.ok) {
      const data = await response.json();
      setAddRentMessages([
        { type: "success", message: "Added rent successfully" },
      ]);
      setTimeout(() => {
        router.push("/rental");
      }, 2000);
    } else {
      const error = await response.json();
      setAddRentMessages([{ type: "error", message: error.message }]);
    }
  };

  return (
    <>
      <div className="flex justify-normal rounded-lg">
        <div className="bg-gray-200 w-fit p-8 border-r border-black m-8 rounded-lg">
          <h2 className="text-3xl">Make Rent</h2>
          <StatusMessageList
            nameError={addRentError}
            statusMessages={addRentMessages}
          />

          <form className="flex flex-col mt-3 p-2">
            <h2 className="font-bold text-lg">Information renter</h2>
            <div>
              <label htmlFor="phoneNumberRenter" className="block text-l m-1">
                Phone number *
              </label>
              <input
                required
                id="phoneNumberRenter"
                type="tel"
                value={phoneNumberRenter}
                onChange={(event) => setPhoneNumberRenter(event.target.value)}
                className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
              />
              {/* <label htmlFor="emailRenter" className="block text-l m-1">
                            Email *
                        </label>
                        <input
                            id="emailRenter"
                            type="email"
                            value={emailRenter}
                            onChange={(event) => setEmailRenter(event.target.value)}
                            className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
                        /> */}
              <label htmlFor="nationalRegister" className="block text-l m-1">
                Id nr of national register *
              </label>
              <input
                required
                id="nationalRegister"
                type="text"
                min={0}
                value={nationalRegisterId}
                onChange={(event) => setNationalRegisterId(event.target.value)}
                className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
              />
              <label htmlFor="Birthdate" className="block text-l m-1">
                Birthdate
              </label>
              <input
                id="Birthdate"
                type="date"
                value={birthDate}
                onChange={(event) => setBirthDate(event.target.value)}
                className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
              />
            </div>
            <div>
              <label
                htmlFor="drivingLicenseNumber"
                className="block text-l m-1"
              >
                Driving license number *
              </label>
              <input
                required
                id="drivingLicenseNumber"
                type="number"
                min={0}
                value={drivingLicenseNumber}
                onChange={(event) =>
                  setDrivingLicenseNumber(event.target.value)
                }
                className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
              />
            </div>
          </form>

          <button
            className="text-white w-[10em] mt-1 bg-blue-800 hover:bg-blue-900 border rounded-xl p-1 m-1"
            type="button"
            onClick={addingRent}
          >
            Make
          </button>
        </div>
        {rental && (
          <div className="rounded-lg bg-gray-200 w-fit p-8 border-r border-black m-8 flex flex-col justify-center items-center">
            <div className="text-left mb-8">
              <h1 className="font-bold text-xl">Car</h1>
              {rental.car && (
                <div>
                  {rental.car.model && <p>Model: {rental.car.model}</p>}
                  {rental.car.licensePlate && (
                    <p>License plate: {rental.car.licensePlate}</p>
                  )}
                </div>
              )}
            </div>

            <hr className="border-b border-gray-400 my-8" />

            <div className="text-left">
              <h1 className="font-bold text-xl">Period</h1>
              <p>Start date: {rental.startDate}</p>
              <p>End date: {rental.endDate}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AddRentForm;
