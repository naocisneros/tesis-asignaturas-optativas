"use client"

import { HeroSection } from "@/components/home-components/hero-section"
import { FeaturesCarousel } from "@/components/home-components/features-carrousel"
import { InfoSections } from "@/components/home-components/info-sections"
import { StatsSection } from "@/components/home-components/stats-section"
import { TestimonialsSection } from "@/components/home-components/testimonials-section"
import { CTASection } from "@/components/home-components/cta-section"
import { CustomFooter } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesCarousel />
      <StatsSection />
      <InfoSections />
      <TestimonialsSection />
      <CTASection />
      <CustomFooter color="cyan" />
    </main>
  )
}