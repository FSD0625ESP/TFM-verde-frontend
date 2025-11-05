import React from "react";
import { Hero, HeroContent, HeroTitle, HeroSubtitle, HeroFooter, HeroFooterCTA } from "@heroui/react";

export default function QuienesSomos() {
  return (
    <Hero className="bg-primary-500">
      <HeroContent>
        <HeroTitle>¿Quiénes somos?</HeroTitle>
        <HeroSubtitle>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec quam mauris, condimentum velit cursus nunc.
        </HeroSubtitle>
      </HeroContent>
      <HeroFooter>
        <HeroFooterCTA as={Link} to="/contact">
          Contacto
        </HeroFooterCTA>
      </HeroFooter>
    </Hero>
  );
}
