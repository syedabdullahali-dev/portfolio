import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Skills from '@/components/Skills';
import Clients from '@/components/Clients';
import Work from '@/components/Work';
import Reviews from '@/components/Reviews';
import Working from '@/components/Working';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Skills />
        <Clients />
        <Work />
        <Reviews />
        <Working />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
