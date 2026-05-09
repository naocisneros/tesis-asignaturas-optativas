"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-cyan-900 to-blue-900 text-white">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para comenzar tu camino?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Únete a cientos de estudiantes que ya están personalizando su formación académica
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/subjects">
              <Button size="lg" className="bg-white text-cyan-900 hover:bg-cyan-50">
                Explorar Asignaturas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/requests">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Solicitar Información
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/20 flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <span>info@uci.cu</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              <span>+53 7 1234567</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>La Habana, Cuba</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}