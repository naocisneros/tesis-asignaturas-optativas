"use client";
import Link from 'next/link';
import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa';

export const CustomFooter = () => {
    return (
      <footer className="w-full bg-cyan-900 border-t border-gray-50 py-6 hover:text-cyan-900 hover:bg-cyan-500">
        <div className="container mx-auto px-4">
          {/* Iconos de redes sociales - Centrados */}
          <ul className="flex justify-center space-x-6 mb-4">
            <li>
              <Link 
                href="/" 
                target='_blank'
                className="text-white hover:text-blue-700 transition-colors duration-200"
              >
                <FaFacebook size={24} />
              </Link>
            </li>
            <li>
              <Link 
                href="/" 
                target='_blank'
                className="text-white hover:text-blue-700 transition-colors duration-200"
              >
                <FaTwitter size={24} />
              </Link>
            </li>
            <li>
              <Link 
                href="/" 
                target='_blank'
                className="text-white hover:text-blue-700 transition-colors duration-200"
              >
                <FaLinkedin size={24} />
              </Link>
            </li>
            <li>
              <Link 
                href="/" 
                target='_blank'
                className="text-white hover:text-blue-700 transition-colors duration-200"
              >
                <FaInstagram size={24} />
              </Link>
            </li>
            <li>
              <Link 
                href="/" 
                target='_blank'
                className="text-white hover:text-blue-700 transition-colors duration-200"
              >
                <FaYoutube size={24} />
              </Link>
            </li>
          </ul>

          {/* Enlaces del menú - Centrados */}
          <ul className="flex flex-wrap justify-center gap-4 md:gap-6 mb-4">
            <li>
              <Link 
                href="https://www.uci.cu/universidad/noticias/portal-uci" 
                className="text-white hover:text-blue-600 transition-colors duration-200 text-sm md:text-base"
              >
                Portal UCI
              </Link>
            </li>
            <li>
              <Link 
                href="https://intranet.uci.cu/" 
                className="text-white hover:text-blue-600 transition-colors duration-200 text-sm md:text-base"
              >
                Intranet
              </Link>
            </li>
            <li>
              <Link 
                href="https://chat.deepseek.com/" 
                className="text-white hover:text-blue-600 transition-colors duration-200 text-sm md:text-base"
              >
                Deepseek
              </Link>
            </li>
            <li>
              <Link 
                href="https://www.3ce.cu/" 
                className="text-white hover:text-blue-600 transition-colors duration-200 text-sm md:text-base"
              >
                Parque Tecnológico
              </Link>
            </li>
            <li>
              <Link 
                href="/" 
                className="text-white hover:text-blue-600 transition-colors duration-200 text-sm md:text-base"
              >
                Blog
              </Link>
            </li>
            <li>
            </li>
          </ul>

          {/* Texto de copyright */}
          <div className="text-center text-white text-sm mt-4">
            <p>&copy; {new Date().getFullYear()} Universidad de las Ciencias Informáticas.</p>
          </div>
        </div>
      </footer>
    );
}