import { Rent } from "@/types";
import RentService from "@/service/rentService";
import RedButton from "@/components/buttons/RedButton";
import { useState } from "react";
import CheckInRentWindow from "./checkInRentWIndow";
import CheckOutRentWindow from "./unCheckRentWInow";
import { useTranslation } from "next-i18next";

type Props = {
  rents: Rent | Array<Rent>;
};

const RentOverviewTable: React.FC<Props> = ({ rents }: Props) => {
  const [selectedRent, setSelectedRent] = useState<Rent | null>(null);
  const [showCheckedInWindow, setShowCheckedInWindow] = useState(false);
  const [showCheckedOutWindow, setShowCheckedOutWindow] = useState(false);
  const [refresh, setRefresh] = useState(false); // State to trigger refresh
  const { t } = useTranslation();

  const handleCancel = (id: number) => {
    RentService.deleteRent(id);
    setRefresh(!refresh); // Trigger refresh after cancellation
  };

  const handleCheckIn = (rent: Rent) => {
    setSelectedRent(rent);
    setShowCheckedInWindow(true);
  };

  const handleCheckOut = (rent: Rent) => {
    setSelectedRent(rent);
    setShowCheckedOutWindow(true);
  };

  const handleCloseDeleteWindow = () => {
    setSelectedRent(null);
    setShowCheckedInWindow(false);
    setShowCheckedOutWindow(false);
  };

  const rentArray = Array.isArray(rents) ? rents : [rents];

  return (
    <>
      {rentArray.length > 0 && (
        <div className="max-w-screen-lg mx-auto">
          <table className="w-full table-fixed border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 w-1/5 text-center">{t("rents.car")}</th>
                <th className="p-3 w-1/5 text-center">{t("rents.start")}</th>
                <th className="p-3 w-1/5 text-center">{t("rents.end")}</th>
                <th className="p-3 w-1/5 text-center">{t("rents.owner")}</th>
                <th className="p-3 w-1/5 text-center">{t("rents.renter")}</th>
                <th className="p-3 w-1/5 text-center">{t("cancel")}</th>
                <th className="p-3 w-1/5 text-center">{t("checkIn")}</th>
              </tr>
            </thead>
            <tbody>
              {rentArray.map((rent, index) => (
                <tr key={index} className="bg-white border-b border-gray-300">
                  <td className="p-3 text-center">{`${
                    rent.rental!.car!.brand
                  } ${rent.rental!.car!.model} ${
                    rent.rental!.car!.licensePlate
                  }`}</td>
                  <td className="p-3 text-center">{rent.rental?.startDate}</td>
                  <td className="p-3 text-center">{rent.rental?.endDate}</td>
                  <td className="p-3 text-center">
                    {rent.rental ? rent.rental.email : ""}
                  </td>
                  <td className="p-3 text-center">{rent.emailRenter}</td>
                  <td className="p-3 text-center">
                    <RedButton
                      text="Cancel"
                      handleClick={() => handleCancel(rent.id ? rent.id : 0)}
                    />
                  </td>
                  {rent.checkedIn == false &&
                    new Date(rent.rental!.startDate)!.getDate() <
                      Date.now() && <p>You can't check in yet</p>}
                  {rent.checkedIn == false &&
                    new Date(rent.rental!.startDate)!.getDate() >=
                      Date.now() && (
                      <td className="p-3 text-center">
                        <RedButton
                          text={t("checkIn")}
                          handleClick={() => handleCheckIn(rent)}
                        />
                      </td>
                    )}
                  {rent.checkedIn == true &&
                    !rent.dateCheckOut &&
                    new Date(rent.rental!.endDate)!.getDate() <= Date.now() && (
                      <td className="p-3 text-center">
                        <RedButton
                          text={t("checkOut")}
                          handleClick={() => handleCheckOut(rent)}
                        />
                      </td>
                    )}
                  {rent.checkedIn == true && rent.dateCheckOut && (
                    <p>Your rent ended</p>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {showCheckedInWindow && (
            <CheckInRentWindow
              rent={selectedRent!}
              onClose={handleCloseDeleteWindow}
            />
          )}
          {showCheckedOutWindow && (
            <CheckOutRentWindow
              rent={selectedRent!}
              onClose={handleCloseDeleteWindow}
            />
          )}
        </div>
      )}
      {!rentArray.length && <p className="text-center mt-4">{t("rents.no")}</p>}
    </>
  );
};

export default RentOverviewTable;
