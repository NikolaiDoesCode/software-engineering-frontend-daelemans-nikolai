import Header from "@/components/header";
import Head from "next/head";
import { useEffect, useState } from "react";

import { Car, StatusMessage } from "@/types";
import carService from "@/service/carService";
import AddCarForm from "@/components/addCar/addCarForm";
import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Footer from "@/components/footer";

const AddCarPage: React.FC = () => {
  const [addCarMessages, setAddCarMessages] = useState<StatusMessage[] | null>(
    null
  );
  const [addCarError, setAddCarError] = useState<string | null>(null);

  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.sessionStorage) {
      const user = sessionStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        if (userData.role == "OWNER") {
          setIsOwner(true);
        }
      }
    }
  }, []);

  // const addCar = async (carData: Car) => {
  //     try {
  //         setAddCarMessages(null);
  //         const response = await carService.addCar(carData);
  //         if (response.status === 200) {
  //             setAddCarMessages([{ message: "adding car succesfull", type: "success" }]);
  //         } else {
  //             setAddCarError("failed to addcar");
  //         }
  //     } catch (error) {
  //         console.error('Error adding car:', error);
  //         setAddCarError("error");
  //     }
  // };

  return (
    <>
      <Head>
        <title>Adding car page</title>
      </Head>
      <Header />
      {isOwner && (
        <main>
          <section className="grid grid-cols-1 gap-8 bg-gray-600 border border-black p-10 m-20">
            <AddCarForm
              addCarMessages={addCarMessages}
              setAddCarMessages={setAddCarMessages}
              addCarError={addCarError}
              setAddCarError={setAddCarError}
            />
          </section>
        </main>
      )}
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

export default AddCarPage;
