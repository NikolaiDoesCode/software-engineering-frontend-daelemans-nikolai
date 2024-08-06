import Header from "@/components/header";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { Rental, Car, Rent, StatusMessage } from "@/types";
import AddRentalForm from "@/components/addRental/addRentalForm";
import rentalService from "@/service/rentalService";
import RentService from "@/service/rentService";
import CarService from "@/service/carService";
import AddRentForm from "@/components/addRent/AddRentForm";
import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Footer from "@/components/footer";

const AddRentPage: React.FC = () => {
  const [addRentMessages, setAddRentMessages] = useState<
    StatusMessage[] | null
  >(null);
  const [addRentError, setAddRentError] = useState<string | null>(null);
  const [car, setCar] = useState<Car | null>(null);
  const [rental, setRental] = useState<Rental | null>(null);
  const [rent, setRent] = useState<Rent | null>(null);

  const router = useRouter();
  const { rentalId } = router.query;

  const getRental = async (id: number) => {
    try {
      const response = await rentalService.getRentalById(id);
      const rental = await response.json();
      setRental(rental);
    } catch (error) {
      console.error("Error getting rental:", error);
    }
  };

  useEffect(() => {
    const fetchRental = async () => {
      if (rentalId) {
        await getRental(Number(rentalId));
      }
    };

    fetchRental();
  }, [rentalId]);

  useEffect(() => {
    if (rental) {
      setCar(rental.car!);
    }
  }, [rental]);

  // const addRent = async (rentData: Rent) => {
  //     try {
  //         setAddRentMessages(null);
  //         const response = await RentService.addRent(rental!, rentData);
  //         if (response.status === 200) {
  //             setAddRentMessages([
  //                 { message: "adding rent succesfull", type: "success" },
  //             ]);
  //         } else {
  //             setAddRentError("failed to add rent");
  //         }
  //     } catch (error) {
  //         console.error("Error adding rent:", error);
  //         setAddRentError("error");
  //     }
  // };

  return (
    <>
      <Head>
        <title>Make rent</title>
      </Head>
      <Header />
      <main>
        <section className="grid grid-cols-1 gap-8 bg-gray-600 border border-black p-10 m-20 rounded-lg">
          <AddRentForm
            rental={rental!}
            // addRent={addRent}
            addRentMessages={addRentMessages}
            setAddRentMessages={setAddRentMessages}
            addRentError={addRentError}
            setAddRentError={setAddRentError}
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

export default AddRentPage;
