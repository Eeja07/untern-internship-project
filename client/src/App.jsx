import React from 'react';
import Navbar from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/components/navbar.jsx';
import Hero from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/components/hero.jsx';
import CompanyLogos from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/components/companyLogos.jsx';
import WhyChooseUs from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/components/whyChooseUs.jsx';
import WhatIntern from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/components/whatIntern.jsx';
// import Testimonials from './components/Testimonials';
import FeaturedInternships from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/components/featuredInternhip.jsx';
// import CompanyReviews from './components/CompanyReviews';
// import JoinSection from './components/JoinSection';
// import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <CompanyLogos />
      <WhyChooseUs />
      <WhatIntern />
      <FeaturedInternships />
      {/* <CompanyReviews />
      <JoinSection />
      <Footer /> */}
    </div>
  );
}

export default App;