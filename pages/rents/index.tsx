import RentOverviewTable from "@/components/Rents/RentOverviewTable";
import Footer from "@/components/footer";
import Header from "@/components/header";
import SearchRentsForm from "@/components/searchRent";
import RentService from "@/service/rentService";
import { Rent } from "@/types";
import { GetServerSidePropsContext } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";

const Rents: React.FC = () => {
  const getRents = async () => {
    try {
      const response = await RentService.getAllRents();
      const rents = await response.json();
      return {
        rents,
      };
    } catch (error) {
      return;
    }
  };
  const { data, isLoading, error } = useSWR("rents", getRents);
  const { t } = useTranslation();

  useInterval(() => {
    mutate("rents", getRents());
  }, 30000);

  const handleRentsFetched = (rents: Rent[]) => {
    mutate("rents", { rents }, false);
  };

  return (
    <>
      <Head>
        <title>Overview Rents</title>
      </Head>
      <Header />
      <main className="container mx-auto py-8 rounded-lg">
        <section className="rounded-lg grid grid-cols-1 gap-8 bg-gray-600 border border-black p-10 m-20">
          <div className="flex rounded-lg">
            <SearchRentsForm onRentsFetched={handleRentsFetched} />
            <div className="m-auto ml-5">
              {data?.rents && <RentOverviewTable rents={data.rents} />}
              {!data?.rents && <p>{t("rents.no")}</p>}
            </div>
          </div>
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

export default Rents;
