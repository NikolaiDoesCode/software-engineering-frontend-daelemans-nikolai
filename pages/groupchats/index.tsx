import CarOverviewTable from "@/components/Cars/CarsOverviewTable";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import ChatsOverview from "@/components/groupchats/ChatsOverview";
import { useEffect, useState } from "react";
import { Groupchat, Role } from "@/types";
import CreateChat from "@/components/groupchats/groupChatComp";

const Groupchats: React.FC = () => {
  const { t } = useTranslation();

  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Check if sessionStorage is available
    if (typeof window !== "undefined" && window.sessionStorage) {
      const user = sessionStorage.getItem("user");
      console.log(user)
      if (user) {
        const userData = JSON.parse(user);
        setUserEmail(userData.email); // Set user email
      }
    }
  }, []);

  return (
    <>
      <Head>
        <title>My chats</title>
      </Head>
      <Header />
      <main className="container mx-auto py-8">
          <CreateChat></CreateChat>
          <ChatsOverview></ChatsOverview>
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

export default Groupchats;
