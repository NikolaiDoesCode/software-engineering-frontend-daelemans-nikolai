import Header from "@/components/header";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { Rental, StatusMessage } from "@/types";
import AddRentalForm from "@/components/addRental/addRentalForm";
import rentalService from "@/service/rentalService";
import CarService from "@/service/carService";
import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Footer from "@/components/footer";

const AddRentalPage: React.FC = () => {
  const [addRentalMessages, setAddRentalMessages] = useState<
    StatusMessage[] | null
  >(null);
  const [addRentalError, setAddRentalError] = useState<string | null>(null);
  const [car, setCar] = useState(null);

  const router = useRouter();
  const { carId } = router.query;

  const getCar = async (id: number) => {
    try {
      const response = await CarService.getCarById(id);
      const car = await response.json();
      setCar(car);
    } catch (error) {
      console.error("Error getting car:", error);
    }
  };

  useEffect(() => {
    if (carId) {
      getCar(Number(carId));
    }
  }, [carId]);

  const addRental = async (rentalData: Rental) => {
    try {
      setAddRentalMessages(null);
      const response = await rentalService.addRental(Number(carId), rentalData);
      if (response.status === 200) {
        setAddRentalMessages([
          { message: "adding rental succesfull", type: "success" },
        ]);
      } else {
        setAddRentalError("failed to add rental");
      }
    } catch (error) {
      console.error("Error adding rental:", error);
      setAddRentalError("error");
    }
  };

  return (
    <>
      <Head>
        <title>Add Rental Page</title>
      </Head>
      <Header />
      <main>
        <section className="grid grid-cols-1 gap-8 bg-gray-600 border border-black p-10 m-20">
          <AddRentalForm
            carId={Number(carId)}
            addRental={addRental}
            addRentalMessages={addRentalMessages}
            setAddRentalMessages={setAddRentalMessages}
            addRentalError={addRentalError}
            setAddRentalError={setAddRentalError}
          />
        </section>
      </main>
      <Footer></Footer>
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

export default AddRentalPage;
