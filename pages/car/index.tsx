import CarOverviewTable from "@/components/Cars/CarsOverviewTable";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useTranslation } from "react-i18next";

const Cars: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t("cars.overview")}</title>
      </Head>
      <Header />
      <main className="container mx-auto py-8">
        <h1 className="text-3xl lg:text-4xl font-semibold text-center mb-6">
          {t("cars.overview")}
        </h1>
        <CarOverviewTable />
      </main>
      <Footer />
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

export default Cars;
