
export interface Teacher {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string | null;
    documento_identidad?: string | null;
    fecha_contratacion?: Date | string | null;
    fecha_terminacion?: Date | string | null;
    titulos_academicos?: string | null;
    años_experiencia: number;
    direccion?: string | null;
    fecha_nacimiento?: Date | string | null;
    nacionalidad?: string | null;
    foto_url?: string | null;
}
