import Header from "@/components/header";
import Head from "next/head";
import { useEffect, useState } from "react";

import { Car, StatusMessage } from "@/types";
import carService from "@/service/carService";
import AddCarForm from "@/components/addCar/addCarForm";
import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Footer from "@/components/footer";
import ComplaintForm from "@/components/complaints/complaintForm";
import AdminNotificationsTable from "@/components/complaints/adminNotificationsTable";

const AdminNotifications: React.FC = () => {


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

  return (
    <>
      <Head>
        <title>User complaints</title>
      </Head>
      <Header />
      <AdminNotificationsTable></AdminNotificationsTable>
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

export default AdminNotifications;
