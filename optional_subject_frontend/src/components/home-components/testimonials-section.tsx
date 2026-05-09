"use client"

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { motion } from "framer-motion"
import { Quote, Star } from "lucide-react"

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const testimonials = [
  {
    name: "María González",
    role: "Estudiante de 4to año",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    text: "Las asignaturas optativas me permitieron especializarme en Inteligencia Artificial. Ahora estoy trabajando en un proyecto de investigación muy interesante.",
    rating: 5
  },
  {
    name: "Carlos Pérez",
    role: "Egresado",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    text: "Gracias a las optativas pude complementar mi formación y obtener un trabajo en una empresa de tecnología. Totalmente recomendado.",
    rating: 5
  },
  {
    name: "Ana Martínez",
    role: "Estudiante de 3er año",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    text: "La flexibilidad horaria y la calidad de los profesores hacen que estas asignaturas sean únicas. Aprendí muchísimo sobre desarrollo móvil.",
    rating: 5
  },
  {
    name: "Luis Fernández",
    role: "Estudiante de 5to año",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    text: "El sistema de gestión es muy intuitivo y facilita todo el proceso de solicitud. Recomiendo explorar todas las opciones disponibles.",
    rating: 5
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-cyan-900 mb-4">
            Lo que dicen nuestros estudiantes
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experiencias reales de estudiantes que han enriquecido su formación con nuestras asignaturas optativas
          </p>
        </motion.div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="py-8"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg p-6 h-full"
              >
                <Quote className="h-8 w-8 text-cyan-400 mb-4" />
                <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center">
                    <span className="text-cyan-800 font-bold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                    <div className="flex gap-1 mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}