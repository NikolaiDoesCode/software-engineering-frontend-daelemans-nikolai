import { useEffect, useState } from "react";
import RedCancelButton from "@/components/buttons/RedButton";
import RentalService from "@/service/rentalService";
import { Rental } from "@/types";
import { useRouter } from "next/router";
import CancelRentalWindow from "./CancelRentalWindow";
import { useTranslation } from "next-i18next";

type Props = {
  rentals: Rental[];
  costColumn?: Boolean;
  days?: number;
  fuel? : number;
  mileAge? : number;
};

const RentalOverviewTable: React.FC<Props> = ({
  rentals,
  costColumn,
  days,
  fuel,
  mileAge
}: Props) => {
  const router = useRouter();
  const { t } = useTranslation();

  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [showCancelRentalWindow, setShowCancelRentalWindow] = useState(false);

  const [userRole, setUserRole] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const AddRent = (id: number) => {
    router.push(`/addRent/${id}`);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.sessionStorage) {
      const user = sessionStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        setUserRole(userData.role);
        setUserEmail(userData.email);
      }
    }
  }, []);

  const handleCancelRental = (rental: Rental) => {
    setSelectedRental(rental);
    setShowCancelRentalWindow(true);
  };

  const handleCloseDeleteWindow = () => {
    setSelectedRental(null);
    setShowCancelRentalWindow(false);
  };

  return (
    <>
      {rentals.length == 0 && (
        <p className="text-center mt-4">{t("rentals.noRentals")}</p>
      )}
      {rentals.length > 0 && (
        <div className="max-w-screen-xl mx-auto">
          <table className="w-full table-fixed border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 w-1/12 text-center">
                  {t("rentals.rentalNum")}
                </th>
                <th className="p-3 w-1/5 text-center">{t("rentals.car")}</th>
                <th className="p-3 w-1/5 text-center">{t("rentals.start")}</th>
                <th className="p-3 w-1/5 text-center">{t("rentals.end")}</th>
                <th className="p-3 w-1/5 text-center">{t("rentals.city")}</th>
                <th className="p-3 w-1/5 text-center">{t("rentals.email")}</th>
                <th className="p-3 w-1/5 text-center">{t("rentals.action")}</th>

                {costColumn && <th className="p-3 w-1/5 text-center">cost</th>}
              </tr>
            </thead>
            <tbody>
              {rentals.map((rental, index) => (
                <tr key={index} className="bg-white border-b border-gray-300">
                  <td className="p-3 text-center">{index + 1}</td>
                  <td className="p-3 text-center">{`${rental.car!.brand} ${
                    rental.car!.model
                  } ${rental.car!.licensePlate}`}</td>
                  <td className="p-3 text-center">{rental.startDate}</td>
                  <td className="p-3 text-center">{rental.endDate}</td>
                  <td className="p-3 text-center">{rental.city}</td>
                  <td className="p-3 text-center">{rental.email}</td>

                  {userRole === "RENTER" && (
                    <td className="p-3 text-center">
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                        onClick={() => AddRent(rental.id!)}
                      >
                        {t("rentals.button")}
                      </button>
                    </td>
                  )}
                  {userRole == "OWNER" && userEmail === rental.email && (
                    <td className="p-3 text-center">
                      <RedCancelButton
                        text="Cancel"
                        handleClick={() => handleCancelRental(rental)}
                      />
                    </td>
                  )}

                  {costColumn && (
                    <td className="p-3 text-center">
                      { days && fuel && mileAge &&
                        days*rental.price + fuel * 0.5 + mileAge * 0.3
                      }
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {showCancelRentalWindow && (
            <CancelRentalWindow
              rental={selectedRental!}
              onClose={handleCloseDeleteWindow}
            />
          )}
        </div>
      )}
    </>
  );
};

export default RentalOverviewTable;
