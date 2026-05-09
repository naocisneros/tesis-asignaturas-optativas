"use client"

import { motion } from "framer-motion"
import { Users, BookOpen, Trophy, Clock } from "lucide-react"
import CountUp from 'react-countup'

const stats = [
  {
    icon: Users,
    value: 500,
    suffix: "+",
    label: "Estudiantes Activos",
    color: "from-cyan-500 to-blue-500"
  },
  {
    icon: BookOpen,
    value: 50,
    suffix: "+",
    label: "Asignaturas",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Trophy,
    value: 95,
    suffix: "%",
    label: "Satisfacción",
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: Clock,
    value: 1000,
    suffix: "+",
    label: "Horas de Contenido",
    color: "from-purple-500 to-pink-500"
  }
]

export function StatsSection() {
  return (
    <section className="py-12 bg-gradient-to-br from-cyan-900 to-blue-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className={`inline-flex p-2 bg-gradient-to-br ${stat.color} rounded-xl mb-2`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="text-2xl md:text-3xl font-bold mb-1">
                <CountUp end={stat.value} duration={2.5} />{stat.suffix}
              </div>
              <p className="text-xs text-white/80">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}