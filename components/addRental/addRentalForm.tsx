import StatusMessageList from "@/components/errors/statusMessageList";
import { useEffect, useState } from "react";
import { Rental, StatusMessage } from "@/types";

import { useRouter } from "next/router";
import rentalService from "@/service/rentalService";
import { useTranslation } from "next-i18next";

type Props = {
  carId: number;
  addRental: (rentalData: Rental) => Promise<void>;
  addRentalMessages: StatusMessage[] | null;
  setAddRentalMessages: Function;
  addRentalError: string | null;
  setAddRentalError: Function;
};

export const AddRentalForm: React.FC<Props> = ({
  carId,
  addRentalMessages,
  setAddRentalMessages,
  addRentalError,
  setAddRentalError,
}: Props) => {
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [postal, setPostal] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [price, setPrice] = useState("");

  const [userEmail, setUserEmail] = useState("");

  const { t } = useTranslation();

  useEffect(() => {
    if (typeof window !== "undefined" && window.sessionStorage) {
      const user = sessionStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        setUserEmail(userData.email); // Set user email
      }
    }
  }, []);

  const router = useRouter();

  const addingRental = async () => {
    setAddRentalMessages(null);

    if (!startDate) {
      setAddRentalMessages([
        { type: "error", message: "Start date is required" },
      ]);
    }
    if (!endDate) {
      setAddRentalMessages([
        { type: "error", message: "End date is required" },
      ]);
    }
    if (!city) {
      setAddRentalMessages([{ type: "error", message: "City is required" }]);
      return;
    }

    if (!phoneNumber) {
      setAddRentalMessages([
        { type: "error", message: "Phone number is required" },
      ]);
      return;
    }

    if (!price) {
      setAddRentalMessages([{ type: "error", message: "Price is required" }]);
      return;
    }

    if (parseFloat(price) < 0) {
      setAddRentalMessages([
        { type: "error", message: "Price can't be less than zero" },
      ]);
      return;
    }

    let cleanedPhoneNumber = phoneNumber.replace(/\s/g, "");

    const numberRegex: RegExp = /^[0-9]+$/; // Matches only numbers

    if (!numberRegex.test(cleanedPhoneNumber)) {
      setAddRentalMessages([
        { type: "error", message: "Phone number should contain only numbers" },
      ]);
      return;
    }

    if (cleanedPhoneNumber.length < 8 || cleanedPhoneNumber.length > 15) {
      setAddRentalMessages([
        { type: "error", message: "Phone number is too long" },
      ]);
      return;
    }

    let finalStartTime = startTime;
    let finalEndTime = endTime;

    if (!startTime) {
      const defaultStartTime = new Date();
      defaultStartTime.setHours(0, 0, 1, 0);
      finalStartTime = defaultStartTime.toLocaleTimeString("en-US", {
        timeZone: "Europe/Brussels",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }

    if (!endTime) {
      const defaultEndTime = new Date();
      defaultEndTime.setHours(23, 59, 59, 0);

      finalEndTime = defaultEndTime.toLocaleTimeString("en-US", {
        timeZone: "Europe/Brussels",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }

    const response = await rentalService.addRental(carId, {
      startDate,
      startTime: finalStartTime,
      endDate,
      endTime: finalEndTime,
      street,
      number,
      postal,
      city,
      phoneNumber: cleanedPhoneNumber,
      email: userEmail,
      price: parseFloat(price),
    });
    if (response.ok) {
      const data = await response.json();
      setAddRentalMessages([
        { type: "success", message: "Added rental successfully" },
      ]);
      setTimeout(() => {
        router.push("/rental");
      }, 2000);
    } else {
      const error = await response.json();
      setAddRentalMessages([{ type: "error", message: error.email }]);
    }
  };

  return (
    <>
      <div className="bg-gray-200 w-fit p-8 border-r border-black">
        <h2 className="text-3xl">Add Rental</h2>
        <StatusMessageList
          nameError={addRentalError}
          statusMessages={addRentalMessages}
        />
        <form className="flex flex-col mt-3 p-2">
          <div>
            <p>{t("rentals.start")}</p>
            <div>
              <label htmlFor="startDate" className="block text-l m-1">
                {t("rentals.date")} *
              </label>
              <input
                required
                id="startDate"
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
              />
              <label htmlFor="startTime" className="block text-l m-1">
                {t("rentals.time")}
              </label>
              <input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
                className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
              />
            </div>
          </div>
          <div>
            <p>{t("rentals.end")}</p>
            <label htmlFor="endDate" className="block text-l m-1">
              {t("rentals.date")} *
            </label>
            <input
              required
              id="endDate"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
            />
            <label htmlFor="endTime" className="block text-l m-1">
              {t("rentals.time")}
            </label>
            <input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
              className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
            />
          </div>
          <div>
            <p>{t("rentals.pickup")}</p>
            <label htmlFor="street" className="block text-l m-1">
              {t("rentals.street")}
            </label>
            <input
              id="street"
              type="text"
              value={street}
              onChange={(event) => setStreet(event.target.value)}
              className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
            />
            <label htmlFor="number" className="block text-l m-1">
              {t("rentals.number")}
            </label>
            <input
              id="number"
              type="number"
              min={0}
              value={number}
              onChange={(event) => setNumber(event.target.value)}
              className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
            />
            <label htmlFor="postal" className="block text-l m-1">
              {t("rentals.postal")}
            </label>
            <input
              id="postal"
              type="number"
              min={0}
              value={postal}
              onChange={(event) => setPostal(event.target.value)}
              className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
            />
            <label htmlFor="city" className="block text-l m-1">
              {t("rentals.city")} *
            </label>
            <input
              required
              id="city"
              type="text"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
            />
          </div>
          <div>
            <p>{t("rentals.contact")}</p>
            <label htmlFor="phoneNumber" className="block text-l m-1">
              {t("rentals.phone")} *
            </label>
            <input
              required
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
            />

            <label htmlFor="price" className="block text-l m-1">
              Price per day *
            </label>
            <input
              required
              id="price"
              type="number"
              value={price}
              min={0}
              onChange={(event) => setPrice(event.target.value)}
              className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
            />

            {/* <label htmlFor="email" className="block text-l m-1">
              Email *
            </label>
            <input
              required
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
            /> */}
          </div>
          <div></div>
          <button
            className="w-[10em] mt-1 bg-blue-800 hover:bg-blue-900 border rounded-xl p-1 m-1"
            type="button"
            onClick={addingRental}
          >
            {t("rentals.add")}
          </button>{" "}
          {/* Corrected function name */}
        </form>
      </div>
    </>
  );
};

export default AddRentalForm;
