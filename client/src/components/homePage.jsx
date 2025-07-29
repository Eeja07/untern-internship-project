import React from 'react';
import Navbar from '../components/navbar.jsx';
import Hero from '../components/hero.jsx';
import CompanyLogos from '../components/companyLogos.jsx';
import WhyChooseUs from '../components/whyChooseUs.jsx';
import WhatIntern from '../components/whatIntern.jsx';
import FeaturedInternships from '../components/featuredInternhip.jsx';
import WhatCompany from '../components/whatCompany.jsx';
import RealExperience from '../components/realExp.jsx';
import FooterHome from '../components/footerHome.jsx';

const HomePage = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <CompanyLogos />
      <WhyChooseUs />
      <WhatIntern />
      <FeaturedInternships />
      <WhatCompany />
      <RealExperience />
      <FooterHome />
    </>
  );
};

export default HomePage;