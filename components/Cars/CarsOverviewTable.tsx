import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CarService from "@/service/carService";
import DeleteCarWindow from "./DeleteCarWindow";
import { Car } from "@/types";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";
import RedButton from "../buttons/RedButton";
import userService from "@/service/userService";
import { useTranslation } from "react-i18next";

const CarOverviewTable: React.FC = () => {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showDeleteCarWindow, setShowDeleteCarWindow] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();

  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && window.sessionStorage) {
      const user = sessionStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        setUserEmail(userData.email); // Set user email
      }
    }
  }, []);

  const addCarForRental = (carId: number) => {
    router.push("/addRental/" + carId);
  };

  const handleDeleteCar = (car: Car) => {
    setSelectedCar(car);
    setShowDeleteCarWindow(true);
  };

  const handleCloseDeleteWindow = () => {
    setSelectedCar(null);
    setShowDeleteCarWindow(false);
  };

  const fetchCars = async () => {
    try {
      const response = await userService.getCarsUser(
        JSON.parse(sessionStorage.getItem("user")!).email
      );
      console.log(userEmail);
      const cars = await response.json();
      return cars;
    } catch (error) {
      console.error("Error fetching cars:", error);
      return null;
    }
  };

  const { data: cars, isLoading, error } = useSWR("cars", fetchCars);

  useInterval(() => {
    mutate("cars", fetchCars());
  }, 10000);

  return (
    <div className="max-w-screen-lg mx-auto">
      {isLoading && <p className="text-center mt-4">Loading...</p>}
      {error && <p className="text-center mt-4">Error: {error}</p>}
      {cars && cars.length > 0 ? (
        <table className="w-full table-fixed border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 w-1/4 text-center">{t("cars.brand")}</th>
              <th className="p-3 w-1/4 text-center">{t("cars.model")}</th>
              <th className="p-3 w-1/4 text-center">{t("cars.plate")}</th>
              <th className="p-3 w-1/4 text-center">{t("cars.actions")}</th>
              <th className="p-3 w-1/4 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car: Car) => (
              <tr key={car.id} className="bg-white border-b border-gray-300">
                <td className="p-3 text-center">{car.brand}</td>
                <td className="p-3 text-center">{car.model}</td>
                <td className="p-3 text-center">{car.licensePlate}</td>
                <td className="p-3 text-center">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                    onClick={() => addCarForRental(car.id!)}
                  >
                    {t("rentButton")}
                  </button>
                </td>
                <td className="p-3 text-center">
                  <RedButton
                    text={t("delete")}
                    handleClick={() => handleDeleteCar(car)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center mt-4">{t("cars.no")}</p>
      )}
      {showDeleteCarWindow && (
        <DeleteCarWindow car={selectedCar!} onClose={handleCloseDeleteWindow} />
      )}
    </div>
  );
};

export default CarOverviewTable;
