"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, GraduationCap, Calendar, Users, BookOpen } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-cyan-900 via-cyan-800 to-blue-900 text-white">
      {/* Patrón de fondo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      <div className="relative container mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-4">
              <GraduationCap className="h-3 w-3" />
              <span className="text-xs font-medium">Universidad de las Ciencias Informáticas</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Sistema de Gestión de
              <span className="block text-cyan-300">Asignaturas Optativas</span>
            </h1>
            <p className="text-sm text-white/80 mb-6">
              Explora, solicita y gestiona tus asignaturas optativas de manera sencilla y eficiente. 
              Personaliza tu formación académica según tus intereses.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/subjects">
                <Button size="default" className="bg-white text-cyan-900 hover:bg-cyan-50 text-sm">
                  Explorar Asignaturas
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </Link>
              <Link href="/study-plan">
                <Button size="default" variant="outline" className="border-white text-white hover:bg-white/10 text-sm">
                  Ver Plan de Estudio
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="absolute -top-3 -right-3 w-16 h-16 bg-cyan-400 rounded-full blur-xl opacity-50" />
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-2 bg-white/10 rounded-lg">
                  <BookOpen className="h-4 w-4 text-cyan-300" />
                  <div>
                    <p className="text-sm font-semibold">+50 Asignaturas</p>
                    <p className="text-xs text-white/70">Disponibles para tu formación</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-white/10 rounded-lg">
                  <Users className="h-4 w-4 text-cyan-300" />
                  <div>
                    <p className="text-sm font-semibold">+100 Profesores</p>
                    <p className="text-xs text-white/70">Expertos en diversas áreas</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-white/10 rounded-lg">
                  <Calendar className="h-4 w-4 text-cyan-300" />
                  <div>
                    <p className="text-sm font-semibold">Flexibilidad Horaria</p>
                    <p className="text-xs text-white/70">Horarios matutino y vespertino</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}