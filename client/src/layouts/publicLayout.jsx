// layouts/PublicLayout.js
import React from 'react';
import Navbar from '../components/navbar/navbar';
import { Outlet } from 'react-router-dom';

const PublicLayout = () => (
    <>
        <Navbar />
        <Outlet /> {/* Child route components will render here */}
    </>
);

export default PublicLayout;
