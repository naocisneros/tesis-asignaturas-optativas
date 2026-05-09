"use client"

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules'
import { motion } from "framer-motion"
import { 
  Brain, 
  Code2, 
  Database, 
  Cloud, 
  Shield, 
  BarChart,
  Smartphone,
  Network,
  Cpu
} from "lucide-react"

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'

const tematicas = [
  {
    icon: Brain,
    title: "Inteligencia Artificial",
    description: "Machine Learning, Deep Learning y Redes Neuronales",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Code2,
    title: "Programación Avanzada",
    description: "Arquitectura de software, Patrones de diseño",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Database,
    title: "Big Data",
    description: "Análisis de datos, Data Science, Hadoop",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Cloud,
    title: "Cloud Computing",
    description: "AWS, Azure, Docker, Kubernetes",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Shield,
    title: "Ciberseguridad",
    description: "Seguridad informática, Ethical Hacking",
    color: "from-red-500 to-pink-500"
  },
  {
    icon: BarChart,
    title: "Business Intelligence",
    description: "Análisis empresarial, Dashboards, Power BI",
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: Smartphone,
    title: "Desarrollo Móvil",
    description: "React Native, Flutter, iOS, Android",
    color: "from-teal-500 to-cyan-500"
  },
  {
    icon: Network,
    title: "Redes y Comunicaciones",
    description: "Redes avanzadas, IoT, 5G",
    color: "from-indigo-500 to-purple-500"
  },
  {
    icon: Cpu,
    title: "IoT y Sistemas Embebidos",
    description: "Arduino, Raspberry Pi, Sensores",
    color: "from-cyan-500 to-blue-500"
  }
]

export function FeaturesCarousel() {
  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-cyan-900 mb-2">
            Áreas de Especialización
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Explora nuestras temáticas y encuentra la asignatura que mejor se adapte a tus intereses
          </p>
        </motion.div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={1}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 80,
            modifier: 2,
          }}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 1.5,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="py-8"
        >
          {tematicas.map((tema, index) => (
            <SwiperSlide key={index}>
              <motion.div
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
              >
                <div className={`bg-gradient-to-br ${tema.color} p-4 text-white`}>
                  <tema.icon className="h-8 w-8 mb-2" />
                  <h3 className="text-base font-bold">{tema.title}</h3>
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-600">{tema.description}</p>
                  <button className="mt-3 text-cyan-600 text-xs font-semibold hover:text-cyan-700 transition-colors">
                    Ver asignaturas →
                  </button>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}