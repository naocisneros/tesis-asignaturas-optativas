export interface Student {
    id: string;
    nombre: string;
    apellidos: string;
    facultad: string;
    año_academico: number;
    grupo_docente: string;
    estado: string;
    avales?: string | null;
}