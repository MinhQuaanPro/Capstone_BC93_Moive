import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";

const HomeTemplate = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet /> {/* render các trang user */}
      </main>
      <Footer />
    </div>
  );
};

export default HomeTemplate;
