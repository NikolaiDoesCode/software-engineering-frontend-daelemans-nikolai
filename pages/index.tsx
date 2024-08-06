import Head from "next/head";
import { useEffect, useState } from "react";
import getHelloWorld from "@/service/helloService";
import { StatusMessage } from "@/types";
import Header from "@/components/header";
import Link from "next/link";
import NotificationOverview from "@/components/Notifications/notificationsOverview";
import LoginForm from "@/components/login/LoginForm";
import Footer from "@/components/footer";
import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import HelpBot from "@/components/helpBot/HelpBot";

const Home: React.FC = () => {
  const { t } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if sessionStorage is available
    if (typeof window !== "undefined" && window.sessionStorage) {
      const user = sessionStorage.getItem("user");
      setIsLoggedIn(!!user);
    }
  }, [isLoggedIn]); // Update isLoggedIn whenever it changes

  return (
    <>
      <Head>
        <title>Car4Rent</title>
        <meta name="description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      {isLoggedIn && (
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-8">
            {t("welcome.title")}
          </h1>
          <p className="text-lg text-center mb-12">{t("welcome.message")}</p>
          <div className="flex justify-center gap-8">
            <section className="max-w-md bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">
                {t("welcome.carsTitle")}
              </h2>
              <p className="text-base mb-6">{t("welcome.carsMessage")}</p>
              <Link href={"/car"}>
                <button className="font-semibold py-2 px-6 rounded bg-blue-500 text-white hover:bg-blue-600 transition duration-300">
                  {t("welcome.carsButton")}
                </button>
              </Link>
            </section>

            <section className="max-w-md bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">
                {t("welcome.rentTitle")}
              </h2>
              <p className="text-base mb-6">{t("welcome.rentMessage")}</p>
              <Link href={"/addCar"}>
                <button className="font-semibold py-2 px-6 rounded bg-blue-500 text-white hover:bg-blue-600 transition duration-300">
                  {t("rentButton")}
                </button>
              </Link>
            </section>
          </div>

          <div className="flex justify-center gap-8 mt-5">
            <section className="min-w-7/12 bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">
                {t("welcome.notifications")}
              </h2>
              <NotificationOverview isHistory={false} />
            </section>
          </div>
        </main>
      )}
      <div className="fixed bottom-20 right-4">
        <HelpBot />
      </div>
      {!isLoggedIn && <LoginForm />}
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

export default Home;
