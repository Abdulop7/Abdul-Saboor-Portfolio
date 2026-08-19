import { getExperience, getProjects, getSite, getTechStack } from "@/lib/data";
import Preloader from "@/components/Preloader";
import Header from "@/components/Header";
import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import TechStack from "@/components/sections/TechStack";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Metrics from "@/components/sections/Metrics";
import Process from "@/components/sections/Process";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  const site = getSite();
  const techStack = getTechStack();
  const { projects } = getProjects();
  const { entries } = getExperience();

  return (
    <>
      <Preloader />
      <Header
        logotype={site.logotype}
        email={site.email}
        nav={site.nav}
        socials={site.socials}
        projects={projects}
      />

      {/* body paints the page background; the footer reveals via its own clipped wrapper */}
      <main id="main" className="relative">
        <Hero site={site} />
        <Manifesto text={site.manifesto} />
        <TechStack data={techStack} />
        <Projects projects={projects} />
        <Experience entries={entries} />
        <Metrics metrics={site.metrics} />
        <Process steps={site.process} />
        <Testimonials testimonials={site.testimonials} />
        <Contact site={site} />
      </main>

      <Footer site={site} />
    </>
  );
}
