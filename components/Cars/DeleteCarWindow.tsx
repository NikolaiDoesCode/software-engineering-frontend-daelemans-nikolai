import { useState } from "react";
import CarService from "@/service/carService";
import { Car } from "@/types";
import { mutate } from "swr";
import { useTranslation } from "react-i18next";

type Props = {
  car: Car;
  onClose: () => void;
};

const DeleteCarWindow: React.FC<Props> = ({ car, onClose }: Props) => {
  const { t } = useTranslation();
  const deleteCar = async (carId: number) => {
    try {
      const response = await CarService.deleteCar(carId);
      onClose();
      mutate("cars");
    } catch (error) {
      return;
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <p className="text-center text-lg font-semibold mb-4">{`Do you want to delete ${car.brand} ${car.model} ${car.licensePlate}?`}</p>
      <div className="flex justify-center space-x-4">
        <button
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 focus:outline-none focus:bg-red-600 transition duration-300"
          onClick={() => deleteCar(car.id!)}
        >
          {t("yes")}
        </button>
        <button
          className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded hover:bg-gray-400 focus:outline-none focus:bg-gray-400 transition duration-300"
          onClick={onClose}
        >
          {t("no")}
        </button>
      </div>
    </div>
  );
};

export default DeleteCarWindow;
