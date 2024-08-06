import { useState } from "react";
import CarService from "@/service/carService";
import { Rent, Rental } from "@/types";
import { mutate } from "swr";
import RentalService from "@/service/rentalService";
import RentService from "@/service/rentService";
import { useTranslation } from "next-i18next";

type Props = {
  rent: Rent;
  onClose: () => void;
};

const CheckOutRentWindow: React.FC<Props> = ({ rent, onClose }: Props) => {
  const [mileage, setMileage] = useState<string | "">();
  const [fuel, setFuel] = useState<string | "">();
  const [pay, setPay] = useState(false);

  const { t } = useTranslation();
  const checkOutRent = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    try {
      const response = await RentService.checkOut(rent.id!, fuel!, mileage!);
      onClose();
      mutate("rents");
    } catch (error) {
      return;
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      {!pay && (
        <form onSubmit={checkOutRent} className="flex flex-col">
          <label htmlFor="mileage" className="block text-l m-1">
            {t("rents.mileage")}
          </label>
          <input
            id="mileage"
            type="number"
            onChange={(event) => setMileage(event.target.value)}
            className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
          />
          <label htmlFor="mileage" className="block text-l m-1">
            {t("rents.fuel")}
          </label>
          <input
            id="Fuel quantity"
            type="number"
            onChange={(event) => setFuel(event.target.value)}
            className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
          />
          <div>
            <button
              className="px-4 py-2 mr-3 bg-gray-300 text-gray-800 font-semibold rounded hover:bg-gray-400 focus:outline-none focus:bg-gray-400 transition duration-300"
              onClick={() => setPay(true)}
            >
              {t("rents.checkOut")}
            </button>
            <button
              className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded hover:bg-gray-400 focus:outline-none focus:bg-gray-400 transition duration-300"
              onClick={onClose}
            >
              {t("cancel")}
            </button>
          </div>
        </form>
      )}
      {pay && (
        <div>
          <p className="text-center">Click on pay to complete your check out</p>
          <div className="flex justify-evenly">
            <button
              className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded hover:bg-gray-400 focus:outline-none focus:bg-gray-400 transition duration-300"
              onClick={checkOutRent}
            >
              pay
            </button>
            <button
              className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded hover:bg-gray-400 focus:outline-none focus:bg-gray-400 transition duration-300"
              onClick={onClose}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckOutRentWindow;
