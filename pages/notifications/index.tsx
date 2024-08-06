// import notifi from "@/components/Cars/CarsOverviewTable";
import Header from "@/components/header";
import Head from "next/head";
import NotificationOverview from "@/components/Notifications/notificationsOverview";
import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Footer from "@/components/footer";
import { useTranslation } from "next-i18next";

const Notifications: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>Overview Notifications</title>
      </Head>
      <Header />
      <main className="container mx-auto py-8">
        <h1 className="text-3xl lg:text-4xl font-semibold text-center mb-6">
          {t("notifications.overview")}
        </h1>

        <NotificationOverview isHistory={true} />
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

export default Notifications;
