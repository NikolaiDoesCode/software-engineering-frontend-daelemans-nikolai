import carService from "@/service/carService";
import StatusMessageList from "@/components/errors/statusMessageList";
import { useState } from "react";
import { Car, CarType, StatusMessage } from "@/types";

import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

type Props = {
  // addCar: (carData: Car) => Promise<void>;
  addCarMessages: StatusMessage[] | null;
  setAddCarMessages: Function;
  addCarError: string | null;
  setAddCarError: Function;
};

export const AddCarForm: React.FC<Props> = ({
  addCarMessages,
  setAddCarMessages,
  addCarError,
  setAddCarError,
}: Props) => {
  const [brand, setBrand] = useState("");
  const [type, setType] = useState<CarType>(CarType.SUV);
  const [licensePlate, setLicensePlate] = useState("");
  const [model, setModel] = useState("");
  const [numberOfSeats, setNumberOfSeats] = useState<number | "">(1);
  const [numberOfChildSeats, setNumberOfChildSeats] = useState<
    number | undefined
  >(0);
  const [towbar, setTowbar] = useState<boolean>(false);
  const [foldingRearSeat, setFoldingRearSeat] = useState<boolean>(false);

  const { t } = useTranslation();
  const router = useRouter();
  const { coachId } = router.query;

  const user = sessionStorage.getItem("user");
  let userEmail: string;

  if (user) {
    const userData = JSON.parse(user);
    userEmail = userData.email;
  }

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setType(event.target.value as CarType);
  };

  const addingCar = async () => {
    setAddCarMessages(null);

    let messages = [];
    if (!brand) {
      messages.push("Brand is required");
    }
    if (!type) {
      messages.push("Type is required");
    }
    if (!licensePlate) {
      messages.push("License plate is required");
    }

    if (!numberOfSeats) {
      messages.push("Number of seats is required");
      setAddCarMessages(
        messages.map((message) => ({ type: "error", message }))
      );
      return;
    }

    const parsedNumberOfSeats =
      typeof numberOfSeats === "number"
        ? numberOfSeats
        : parseInt(numberOfSeats, 10);

    if (isNaN(parsedNumberOfSeats) || parsedNumberOfSeats < 0) {
      messages.push("Number of seats must be a non-negative number");
      setAddCarMessages(
        messages.map((message) => ({ type: "error", message }))
      );
      return;
    }

    if (messages.length != 0) {
      setAddCarMessages(
        messages.map((message) => ({ type: "error", message }))
      );
      return;
    }

    const response = await carService.addCar(
      {
        brand,
        type,
        model,
        licensePlate,
        numberOfSeats,
        numberOfChildSeats,
        towBar : towbar,
        foldingRearSeat,
      },
      userEmail
    );

    if (response.ok) {
      setAddCarMessages([{ type: "success", message: "Added car sucesfully" }]);
      setTimeout(() => {
        router.push("/car");
      }, 2000);
    } else {
      const error = await response.json();
      setAddCarMessages([{ type: "error", message: error.message }]);
    }
  };

  return (
    <>
      <div className="bg-gray-200 w-fit p-8 border-r border-black">
        <h2 className="text-3xl">{t("header.cAdd")}</h2>
        <StatusMessageList
          nameError={addCarError}
          statusMessages={addCarMessages}
        />
        <form className="flex flex-col mt-3 p-2">
          <label htmlFor="brand" className="block text-l m-1">
            {t("cars.brand")} *
          </label>
          <input
            id="brand"
            type="text"
            value={brand}
            onChange={(event) => setBrand(event.target.value)}
            className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
          />
          <label htmlFor="type" className="block text-l m-1">
            {t("cars.type")} *
          </label>
          <select
            id="type"
            value={type}
            onChange={handleTypeChange}
            className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue-500 p-1 m-1"
          >
            {Object.values(CarType).map((carType) => (
              <option key={carType} value={carType}>
                {carType}
              </option>
            ))}
          </select>
          <label htmlFor="model" className="block text-l m-1">
            {t("cars.model")}
          </label>
          <input
            id="model"
            type="text"
            value={model}
            onChange={(event) => setModel(event.target.value)}
            className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
          />
          <label htmlFor="licensePlate" className="block text-l m-1">
            {t("cars.plate")} *
          </label>
          <input
            id="licensePlate"
            type="text"
            value={licensePlate}
            onChange={(event) => setLicensePlate(event.target.value)}
            className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
          />
          <label htmlFor="numberOfSeats" className="block text-l m-1">
            {t("cars.seats")} *
          </label>
          <input
            id="numberOfSeats"
            type="number"
            value={numberOfSeats}
            onChange={(event) =>
              setNumberOfSeats(parseInt(event.target.value) || "")
            }
            className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
            min={1} // Set the minimum value here
          />
          <label htmlFor="numberOfChildSeats" className="block text-l m-1">
            {t("cars.child")}{" "}
          </label>
          <input
            id="numberOfChildSeats"
            type="numberOfChildSeats"
            value={numberOfChildSeats}
            onChange={(event) =>
              setNumberOfChildSeats(parseInt(event.target.value) || 0)
            }
            className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
          />
          <div className="flex items-center">
            <label htmlFor="towbar" className="block text-l m-1">
              {t("cars.towbar")}
            </label>
            <input
              id="towbar"
              type="checkbox"
              checked={towbar}
              onChange={(event) => setTowbar(event.target.checked)}
              className="border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-1 m-1"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="foldingRearSeat" className="block text-l m-1">
              {t("cars.folding")}
            </label>
            <input
              id="foldingRearSeat"
              type="checkbox"
              checked={foldingRearSeat}
              onChange={(event) => setFoldingRearSeat(event.target.checked)}
              className="border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-1 m-1"
            />
          </div>
          <button
            className="w-[10em] mt-1 bg-blue-800 hover:bg-blue-900 border rounded-xl p-1 m-1"
            type="button"
            onClick={addingCar}
          >
            {t("header.cAdd")}
          </button>{" "}
          {/* Corrected function name */}
        </form>
      </div>
    </>
  );
};

export default AddCarForm;
