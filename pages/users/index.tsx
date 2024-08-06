import UserOverviewTable from "@/components/Users/UsersOverviewTable";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { GetServerSidePropsContext } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

const Users: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>Overview Users</title>
      </Head>
      <Header />
      <main className="container mx-auto py-8">
        <h1 className="text-3xl lg:text-4xl font-semibold text-center mb-6">
          {t("users.overview")}
        </h1>

        <UserOverviewTable />
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

export default Users;
