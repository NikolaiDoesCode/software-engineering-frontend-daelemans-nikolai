import RentalOverviewTable from "@/components/Rentals/RentalsOverviewTable";
import Footer from "@/components/footer";
import Header from "@/components/header";
import RentalService from "@/service/rentalService";
import userService from "@/service/userService";
import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";

const Rentals: React.FC = () => {
  const [userRole, setUserRole] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const { t } = useTranslation();

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

  const getRentals = async () => {
    try {
      let response;
      if (userRole == "RENTER") {
        response = await RentalService.getAllRentals();
      } else {
        response = await userService.getRentalsUser(userEmail);
      }
      const rentals = await response.json();
      return {
        rentals,
      };
    } catch (error) {
      return;
    }
  };
  const { data, isLoading, error } = useSWR("rentals", getRentals);

  useInterval(() => {
    mutate("rentals", getRentals());
  }, 10000);

  return (
    <>
      <Head>
        <title>Overview Rentals</title>
      </Head>
      <Header />
      <main className="container mx-auto py-8">
        <h1 className="text-3xl lg:text-4xl font-semibold text-center mb-6">
          {t("rentals.overview")}
        </h1>

        {data?.rentals && <RentalOverviewTable rentals={data.rentals} />}
        {!data?.rentals && <p>{t("rentals.no")}</p>}
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

export default Rentals;
