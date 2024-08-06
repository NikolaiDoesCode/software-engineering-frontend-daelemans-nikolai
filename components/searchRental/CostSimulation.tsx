import StatusMessageList from "@/components/errors/statusMessageList";
import { useState } from "react";
import { Rental, StatusMessage } from "@/types";

import { useRouter } from "next/router";
import rentalService from "@/service/rentalService";
import { useTranslation } from "next-i18next";

type Props = {
    onValuesReturned: (days : number, fuel : number, mileAge : number) => void;
};

export const CostSimulation: React.FC<Props> = ({
    onValuesReturned
}: Props) => {
  const [daysForm, setDaysForm] = useState("");
  const [fuelForm, setFuelForm] = useState("");
  const [mileAgeForm, setMileAgeForm] = useState("");

  const router = useRouter();
  const { t } = useTranslation();

  const calculateCost = async () => {
    let days = daysForm ? parseFloat(daysForm) : 0
    let fuel = fuelForm ? parseFloat(fuelForm) : 0
    let mileAge = mileAgeForm ? parseFloat(mileAgeForm) : 0

    onValuesReturned(days, fuel, mileAge);
  };

  return (
    <>
      <div className="border-l-4 border-width-4 border-black p-8 mt-4 ">
        <h2 className="text-3xl">{t("rentals.cost")}</h2>
        <div className="flex">
            <form className="flex mt-3 p-2 justify-around">
            <label htmlFor="days" className="block text-l m-1">
                Days : 
            </label>
            <input
                type="number"
                value={daysForm}
                min={0}
                onChange={(event) => setDaysForm(event.target.value)}
                className="border rounded p-2 mr-4"
                placeholder="Number of days"
                />
            <label htmlFor="fuel" className="block text-l m-1 ml-4">
                    Fuel : 
            </label>
            <input
                id="fuel"
                type="number"
                min={0}
                value={fuelForm}
                onChange={(event) => setFuelForm(event.target.value)}
                className="border rounded p-2 mr-4"
                placeholder="Amount of fuel"
            />
            <label htmlFor="mileAge" className="block text-l m-1 ml-4">
                    Mile age :
            </label>
            <input
                id="mileAge"
                min={0}
                type="number"
                value={mileAgeForm}
                onChange={(event) => setMileAgeForm(event.target.value)}
                className="border rounded p-2"
                placeholder="Amount of KM"
            />
            </form>
            <button
            className="w-[10em] mt-1 bg-blue-800 text-white hover:bg-blue-900 border rounded-xl p-1 m-1 ml-5"
            type="button"
            onClick={calculateCost}
          >
            Simulate costs !
        </button>
        </div>
      </div>
    </>
  );
};

export default CostSimulation;
