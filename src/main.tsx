/* main.tsx — entry point and page composition. */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider, marqueeItems } from "@/lib";
import {
  Navbar,
  Hero,
  Marquee,
  About,
  Clusters,
  Flagship,
  Leaderboard,
  Schedule,
  Gallery,
  Sponsors,
  FAQ,
  Footer,
  ConceptPicker,
} from "@/components";

function App() {
  return (
    <ThemeProvider>
      <div className="relative min-h-screen bg-bg font-body text-ink">
        <Navbar />
        <main>
          <Hero />
          <Marquee items={marqueeItems} />
          <About />
          <Clusters />
          <Marquee
            items={["Dance", "Music", "Dramatics", "Lits", "Quiz", "Fine Arts", "Fashion", "Gaming", "Film"]}
            reverse
            variant="ghost"
          />
          <Flagship />
          <Leaderboard />
          <Schedule />
          <Gallery />
          <Sponsors />
          <FAQ />
        </main>
        <Footer />
        <ConceptPicker />
      </div>
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
