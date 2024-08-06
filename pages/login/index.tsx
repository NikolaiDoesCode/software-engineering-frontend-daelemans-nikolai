import Footer from "@/components/footer";
import Header from "@/components/header";
import LoginForm from "@/components/login/LoginForm";
import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

const Login: React.FC = () => {
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Header></Header>
      <LoginForm></LoginForm>
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

export default Login;
