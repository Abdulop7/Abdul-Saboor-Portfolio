import Navbar from "@/components/header";
import Hero from "@/components/heroSection";
import Skills from "@/components/skills";
import Projects from "../components/projects";
import Contact from "@/components/contact";


export default function Home() {
  return (
    <div className="w-full h-full">
      <Navbar />
      <Hero />
      <Skills/>
      <Projects />
      <Contact />
    </div>
  );
}
