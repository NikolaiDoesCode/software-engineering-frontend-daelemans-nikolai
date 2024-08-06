import StatusMessageList from "@/components/errors/statusMessageList";
import { useState } from "react";
import { Rental, StatusMessage } from "@/types";

import { useRouter } from "next/router";
import rentalService from "@/service/rentalService";
import { useTranslation } from "next-i18next";

type Props = {
  onRentalsFetched: (rentals: Rental[], adress: string) => void;
  // searchRental: (email:string, startDate:string, endDate:string, brand:string, city:string) => Promise<void>;
  searchRentalsMessages: StatusMessage[] | null;
  setSearchRentalsMessages: Function;
  searchRentalsError: string | null;
  setSearchRentalsError: Function;
};

export const SearchRentalsForm: React.FC<Props> = ({
  onRentalsFetched,
  searchRentalsMessages,
  setSearchRentalsMessages,
  searchRentalsError,
  setSearchRentalsError,
}: Props) => {
  const [email, setEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [brand, setBrand] = useState("");

  const [numberOfSeats, setNumberOfSeats] = useState("");
  const [numberOfChildSeats, setNumberOfChildSeats] = useState("");
  const [towbar, setTowbar] = useState(false);
  const [foldingRearSeat, setFoldingRearSeat] = useState(false);

  const [showAddressSection, setShowAddressSection] = useState(false);
  const [showOtherSection, setShowOtherSection] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");

  const router = useRouter();
  const { t } = useTranslation();

  const searchingRentals = async () => {
    setSearchRentalsMessages(null);
    let response;
    let finalData;
    let modifyAdress = false;
    let baseAdress = "city=Leuven&country=Belgium&postalcode=3000&";

    if (!(email || startDate || endDate || brand)) {
      console.log("BONJOUR")
      modifyAdress = true;

      if (!(city || postal || country)) {
        setSearchRentalsMessages([
          {
            type: "error",
            message:
              "Please provide either a country, a city name or a postal code when searching rentals by address.",
          },
        ]);
        return null;
      }

      if (number && !street) {
        setSearchRentalsMessages([
          {
            type: "error",
            message:
              "If you provide a house or building number, please also specify the street name.",
          },
        ]);
        return null;
      }

      response = await rentalService.getAllRentals();

      const responseData = await response.json();

      const numSeats = numberOfSeats ? parseInt(numberOfSeats, 10) : undefined;
      const numChildSeats = numberOfChildSeats ? parseInt(numberOfChildSeats, 10) : undefined;
      console.log("ALL")
      console.log(responseData)
      const filteredData = responseData.filter((rental : Rental) => {
        const car = rental.car;

        if (!car) return false;

        if (numberOfSeats && numberOfChildSeats) {
            return car.numberOfSeats === numSeats && car.numberOfChildSeats === numChildSeats;
        } else if (numberOfSeats) {
            return car.numberOfSeats === numSeats;
        } else if (numberOfChildSeats) {
            return car.numberOfChildSeats === numChildSeats;
        } else {
            return true;
            }
      });

      const filteredDataV2 = filteredData.filter((rental : Rental) => {
        const car = rental.car;

        if (!car) return false;
            return car.towBar === towbar && car.foldingRearSeat === foldingRearSeat;
    }); 


    finalData = filteredDataV2

    } else {
      response = await rentalService.searchRentals(
        email,
        startDate,
        endDate,
        brand
      );

      const responseData = await response.json();
      console.log('------------------------')
      console.log(responseData)

      const numSeats = numberOfSeats ? parseInt(numberOfSeats, 10) : undefined;
      const numChildSeats = numberOfChildSeats ? parseInt(numberOfChildSeats, 10) : undefined;
      const filteredData = responseData.filter((rental : Rental) => {
        const car = rental.car;

        if (!car) return false;

        if (numberOfSeats && numberOfChildSeats) {
            return car.numberOfSeats === numSeats && car.numberOfChildSeats === numChildSeats;
        } else if (numberOfSeats) {
            return car.numberOfSeats === numSeats;
        } else if (numberOfChildSeats) {
            return car.numberOfChildSeats === numChildSeats;
        } else {
            return true;
            }
      });

      console.log(filteredData)
      
    

      if (city || postal || country) {
        modifyAdress = true;
      }
    }

    if (modifyAdress == true) {
      baseAdress = "";
      // https://nominatim.openstreetmap.org/search.php?street=Diestsestraat+206&city=Leuven&country=Belgium&postalcode=3000&format=jsonv2
      if (street && number) {
        baseAdress += `street=${street}+${number}&`;
      } else if (street) {
        baseAdress += `street=${street}&`;
      }

      if (city) baseAdress += `city=${city}&`;
      if (country) baseAdress += `country=${country}&`;
      if (postal) baseAdress += `postalcode=${postal}&`;
    }

    try {
      if (response.status === 200) {
        onRentalsFetched(finalData, baseAdress);
        return response;
      } else {
        const errorData = await response.json();
        setSearchRentalsMessages([
          { type: "error", message: errorData.message },
        ]);
      }
    } catch (error) {
      console.error("Error searching rental:", error);
      setSearchRentalsMessages([
        { type: "error", message: "Failed to search rental" },
      ]);
      return null;
    }
  };
  const handleAddressSectionToggle = () => {
    setShowAddressSection(!showAddressSection);
  };

  const handleOtherSectionToggle = () => {
    setShowOtherSection(!showOtherSection);
  };

  return (
    <>
      <div className="p-8 border-l-4 border-width-4 border-black">
        <h2 className="text-3xl">{t("rentals.search")}</h2>
        <StatusMessageList
          nameError={searchRentalsError}
          statusMessages={searchRentalsMessages}
        />
        <form className="flex flex-wrap mt-3 p-2">
          <div className="flex flex-wrap w-full">
            <div className="w-full">
              <button
                className="bg-white border rounded-xl p-2 flex items-center"
                type="button"
                onClick={handleAddressSectionToggle}
              >
                Rental locations
                <svg
                  className={`ml-2 w-4 h-4 transition-transform ${showAddressSection ? 'rotate-0' : 'rotate-90'}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className={`transition-max-height overflow-hidden ${showAddressSection ? "max-h-screen" : "max-h-0"}`}>
              {showAddressSection && (
                
                  <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-1">
                      <label htmlFor="country" className="block text-l m-1">
                        {t("rentals.country")}
                      </label>
                      <input
                        id="country"
                        type="text"
                        value={country}
                        onChange={(event) => setCountry(event.target.value)}
                        className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
                      />
                    </div>
                    <div className="col-span-2 ">
                      <label htmlFor="city" className="block text-l m-1">
                        {t("rentals.city")}
                      </label>
                      <input
                        id="city"
                        type="text"
                        value={city}
                        onChange={(event) => setCity(event.target.value)}
                        className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
                      />
                    </div>
                    <div className="col-spa">
                      <label htmlFor="postal" className="block text-l m-1">
                        {t("rentals.postal")}
                      </label>
                      <input
                        id="postal"
                        type="number"
                        value={postal}
                        onChange={(event) => setPostal(event.target.value)}
                        className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
                      />
                    </div>
                    <div>
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
                    </div>
                    <div>
                      <label htmlFor="number" className="block text-l m-1">
                        {t("rentals.number")}
                      </label>
                      <input
                        id="number"
                        type="number"
                        value={number}
                        onChange={(event) => setNumber(event.target.value)}
                        className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
                      />
                    </div>
                  </div>
  
              )}
              </div>
            </div>
            <div className="flex flex-wrap w-full mt-2">
              <div className="w-full">
              <button
                className="bg-white border rounded-xl p-2 flex items-center"
                type="button"
                onClick={handleOtherSectionToggle}
              >
                Extra details
                <svg
                  className={`ml-2 w-4 h-4 transition-transform ${showOtherSection ? 'rotate-0' : 'rotate-90'}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className={`transition-max-height2 overflow-hidden ${showOtherSection ? "max-h-screen" : "max-h-0"}`}>
                {showOtherSection && (
                  <div className="grid grid-cols-3 gap-8">
                  <div className="col-span-1">
                    <label htmlFor="email" className="block text-l m-1">
                      {t("rents.owner")}
                    </label>
                    <input
                      id="email"
                      type="text"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
                    />
                    </div>
                    <div className="col-span-1">
                    <label htmlFor="startDate" className="block text-l m-1">
                      {t("rents.start")}
                    </label>
                    <input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(event) => setStartDate(event.target.value)}
                      className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
                    />
                    </div>
                    <div className="col-span-1">
                    <label htmlFor="endDate" className="block text-l m-1">
                      {t("rents.end")}
                    </label>
                    <input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(event) => setEndDate(event.target.value)}
                      className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
                    />
                    </div>
                    <div className="col-span-1">
                    <label htmlFor="brand" className="block text-l m-1">
                      {t("cars.brand")}
                    </label>
                    <input
                      id="brand"
                      type="text"
                      value={brand}
                      onChange={(event) => setBrand(event.target.value)}
                      className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
                    />
                    </div>
                    <div className="col-span-1">
                    <label htmlFor="numberOfSeats" className="block text-l m-1">
                      Number of seats
                    </label>
                    <input
                      id="numberOfSeats"
                      type="number"
                      min="0"
                      value={numberOfSeats}
                      onChange={(event) => setNumberOfSeats(event.target.value)}
                      className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
                    />
                     </div>
                     <div className="col-span-1">
                    <label htmlFor="numberOfChildSeats" className="block text-l m-1">
                      Number of child seats
                    </label>
                    <input
                      id="numberOfChildSeats"
                      type="number"
                      min="0"
                      value={numberOfChildSeats}
                      onChange={(event) => setNumberOfChildSeats(event.target.value)}
                      className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
                    />
                    </div>
                    <div className="col-span-1 flex">
                    <label htmlFor="towbar" className="block text-l m-1">
                      Towbar
                    </label>
                    <input
                      id="towbar"
                      type="checkbox"
                      checked={towbar}
                      onChange={(event) => setTowbar(event.target.checked)}
                      className="border w-4 border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
                    />
                    </div>
                    <div className="col-span-1 flex">
                    <label htmlFor="foldingRearSeat" className="block text-l m-1">
                      Folding Rear Seat
                    </label>
                    <input
                      id="foldingRearSeat"
                      type="checkbox"
                      checked={foldingRearSeat}
                      onChange={(event) => setFoldingRearSeat(event.target.checked)}
                      className="border w-4 border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
                    />
                    </div>
                  </div>
                )}
                </div>
                <button
                  className="w-[10em] mt-6 bg-blue-800 text-white hover:bg-blue-900 border rounded-xl p-4 m-1"
                  type="button"
                  onClick={searchingRentals}
                >
                  {t("rentals.searchButton")}
                </button>{" "}
                {/* Corrected function name */}
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default SearchRentalsForm;
