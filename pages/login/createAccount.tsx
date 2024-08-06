import Footer from "@/components/footer";
import Header from "@/components/header";
import SigninForm from "@/components/login/SigninForm";
import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useEffect, useState } from "react";

const Signin: React.FC = () => {
  return (
    <>
      <Head>
        <title>Create account</title>
      </Head>
      <Header></Header>
      <main>
        <SigninForm></SigninForm>
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

export default Signin;
