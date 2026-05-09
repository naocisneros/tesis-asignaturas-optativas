"use client"

import { motion } from "framer-motion"
import { 
  FileText, 
  CalendarCheck, 
  BookMarked, 
  TrendingUp,
  Clock,
  Award
} from "lucide-react"
import Link from "next/link"

const sections = [
  {
    icon: FileText,
    title: "Proceso de Solicitud",
    description: "Solicita tus asignaturas optativas en simples pasos.",
    details: [
      "Explora el catálogo de asignaturas",
      "Completa el formulario de solicitud",
      "Confirma tu matrícula"
    ],
    link: "/requests",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: CalendarCheck,
    title: "Calendario Académico",
    description: "Organiza tu tiempo con las fechas importantes.",
    details: [
      "Inscripción: 15-30 enero",
      "Inicio clases: 1 febrero",
      "Exámenes finales: Junio"
    ],
    link: "/subjects",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: BookMarked,
    title: "Plan de Aprendizaje",
    description: "Estructura tu formación con nuestro plan flexible.",
    details: [
      "Créditos obligatorios: 180",
      "Créditos optativos: 30",
      "Tesis de grado: 30 créditos"
    ],
    link: "/study-plan",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: TrendingUp,
    title: "Beneficios",
    description: "Ventajas de cursar asignaturas optativas.",
    details: [
      "Flexibilidad horaria",
      "Profesores expertos",
      "Certificaciones reconocidas"
    ],
    link: "/subjects",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Clock,
    title: "Modalidades",
    description: "Diferentes formatos para tus necesidades.",
    details: [
      "Presencial",
      "Semipresencial",
      "Virtual"
    ],
    link: "/subjects",
    color: "from-teal-500 to-cyan-500"
  },
  {
    icon: Award,
    title: "Reconocimientos",
    description: "Valor agregado a tu formación.",
    details: [
      "Créditos para tu título",
      "Certificados de participación",
      "Proyectos para portafolio"
    ],
    link: "/subjects",
    color: "from-yellow-500 to-orange-500"
  }
]

export function InfoSections() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-cyan-900 mb-2">
            Información Importante
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Todo lo que necesitas saber para aprovechar tu experiencia académica
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <div className={`bg-gradient-to-r ${section.color} p-3 text-white`}>
                <section.icon className="h-5 w-5 mb-1" />
                <h3 className="text-base font-bold">{section.title}</h3>
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-600 mb-3">{section.description}</p>
                <ul className="space-y-1 mb-4">
                  {section.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-500">
                      <span className="text-cyan-500 mt-0.5">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
                <Link href={section.link}>
                  <button className="w-full px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-md hover:bg-cyan-100 transition-colors text-xs font-semibold">
                    Más información →
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}