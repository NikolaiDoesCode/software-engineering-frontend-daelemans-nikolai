// import notifi from "@/components/Cars/CarsOverviewTable";
import Header from "@/components/header";
import Head from "next/head";
import MapComponent from "@/components/searchRental/map";

import dynamic from "next/dynamic";
import SearchRentalsForm from "@/components/searchRental/searchRentalForm";
import RentalOverviewTable from "@/components/Rentals/RentalsOverviewTable";
import { useState } from "react";
import { Rental, StatusMessage } from "@/types";
import Footer from "@/components/footer";
import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import CostSimulation from "@/components/searchRental/CostSimulation";

const MapTest: React.FC = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [baseAdres, setBaseAdres] = useState<string>("city=Leuven&");

  const [daysForm, setDaysForm] = useState(0);
  const [fuelForm, setFuelForm] = useState(0);
  const [mileAgeForm, setMileAgeForm] = useState(0);

  const [searchRentalsMessages, setSearchRentalsMessages] = useState<
    StatusMessage[] | null
  >(null);
  const [searchRentalsError, setSearchRentalsError] = useState<string | null>(
    null
  );

  const MyAwesomeMap = dynamic(() => import("@/components/searchRental/map"), {
    ssr: false,
  });

  const handleRentalsFetched = async (rentals: Rental[], baseAdres: string) => {
    setRentals(rentals);
    setBaseAdres(baseAdres);
  };

  const handleCostSimulationForm = async (daysParam : number, fuelParam : number, mileAgeParam : number) => {
    setDaysForm(daysParam);
    setFuelForm(fuelParam);
    setMileAgeForm(mileAgeParam);
    console.log(daysParam, fuelParam, mileAgeParam)
  }

  return (
    <>
      <Head>
        <title>Map test</title>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />

        <script
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossOrigin=""
        ></script>
      </Head>
      <Header />
      <main className="container mx-auto py-8">
            <SearchRentalsForm
              onRentalsFetched={handleRentalsFetched}
              searchRentalsMessages={searchRentalsMessages}
              setSearchRentalsMessages={setSearchRentalsMessages}
              searchRentalsError={searchRentalsError}
              setSearchRentalsError={setSearchRentalsError}
            />
            <div className="flex-col flex-grow ml-10">
              <MyAwesomeMap rentals={rentals} baseAdress={baseAdres} />
            </div>
              {/* <div className="flex justify-evenly mt-5">
                <input
                  type="number"
                  value={kilometers}
                  min={0}
                  onChange={(event) => setKilometers(event.target.value)}
                  className="border rounded p-2 min-w-full"
                  placeholder="Enter a number of kilometers to simulate your costs !"
                />
              </div> */}
              <CostSimulation onValuesReturned={handleCostSimulationForm}></CostSimulation>
              <div className="mt-5 w-auto flex">
                {rentals && <RentalOverviewTable rentals={rentals} costColumn={true} days={daysForm} fuel={fuelForm} mileAge={mileAgeForm}/>}
              </div>
           
      </main>
    </>
  );
};


export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { locale } = context;
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};

export default MapTest;
