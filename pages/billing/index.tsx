import BillingOverview from "@/components/billing/BillingOverview";
import Footer from "@/components/footer";
import Header from "@/components/header";
import billingService from "@/service/billingService";
import userService from "@/service/userService";
import { GetServerSidePropsContext } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";

const Billing: React.FC = () => {
  const [isRenter, setIsRenter] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const { t } = useTranslation();

  const fetchBills = async () => {
    try {
      const userJson = JSON.parse(sessionStorage.getItem("user")!);
      if (userJson.isAccountant) {
        const response = await billingService.getBills();
        const bills = await response.json();
        return bills;
      } else if (userJson.role == "OWNER") {
        const response = await billingService.getBillsByOwnerEmail(
          userJson.email
        );
        const bills = await response.json();
        return bills;
      } else {
        const response = await billingService.getBillsByRenterEmail(
          userJson.email
        );
        const bills = await response.json();
        return bills;
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
      return null;
    }
  };

  const { data: bills, isLoading, error } = useSWR("bills", fetchBills);

  useInterval(() => {
    mutate("bills", fetchBills);
  }, 10000);

  useEffect(() => {
    if (typeof window !== "undefined" && window.sessionStorage) {
      const user = sessionStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        if (userData.role == "OWNER") {
          setIsOwner(true);
        }
        if (userData.role == "RENTER") {
          setIsRenter(true);
        }
      }
    }
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user data</div>;

  return (
    <>
      <Head>
        <title>Car4Rent</title>
      </Head>
      <Header />
      <main>
        <BillingOverview bills={bills}></BillingOverview>
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

export default Billing;
