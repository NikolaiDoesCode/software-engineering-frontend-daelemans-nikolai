import { useState } from "react";
import CarService from "@/service/carService";
import { Rental } from "@/types";
import { mutate } from "swr";
import RentalService from "@/service/rentalService";
import { useTranslation } from "next-i18next";

type Props = {
  rental: Rental;
  onClose: () => void;
};

const CancelRentalWindow: React.FC<Props> = ({ rental, onClose }: Props) => {
  const { t } = useTranslation();
  const cancelRental = async (rentalId: number) => {
    try {
      const response = await RentalService.cancelRental(rentalId);
      onClose();
      mutate("rentals");
    } catch (error) {
      return;
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <p className="text-center text-lg font-semibold mb-4">{`${t(
        "rentals.cancel"
      )} ${rental.car?.brand} ${rental.car?.model} ${
        rental.car?.licensePlate
      } ${t("from")} ${rental.startDate} ${t("until")} ${rental.endDate}`}</p>
      <div className="flex justify-center space-x-4">
        <button
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 focus:outline-none focus:bg-red-600 transition duration-300"
          onClick={() => cancelRental(rental.id!)}
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

export default CancelRentalWindow;
