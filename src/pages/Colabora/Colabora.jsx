import React from "react";
import {
  Hero,
  HeroContent,
  HeroTitle,
  HeroSubtitle,
  HeroFooter,
  HeroFooterCTA,
} from "@heroui/react";
import { Link } from "react-router-dom";

export default function Colabora() {
  return (
    <Hero className="bg-primary-500">
      <HeroContent>
        <HeroTitle>Colabora con nosotros</HeroTitle>
        <HeroSubtitle>
          Únete a nuestra misión: puedes ayudar a través de donaciones, empleo o
          voluntariado. Tu apoyo hace la diferencia.
        </HeroSubtitle>
      </HeroContent>
      <HeroFooter>
        <HeroFooterCTA as={Link} to="/donaciones">
          Donaciones
        </HeroFooterCTA>
        <HeroFooterCTA as={Link} to="/empleo">
          Empleo
        </HeroFooterCTA>
        <HeroFooterCTA as={Link} to="/voluntariado">
          Hazte voluntario
        </HeroFooterCTA>
      </HeroFooter>
    </Hero>
  );
}
