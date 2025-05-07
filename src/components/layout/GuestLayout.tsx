
import React from 'react';
import { Outlet } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import Header from './Header';
import Footer from './Footer';

const GuestLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default GuestLayout;
