import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('students')
export class Student {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false
    })
    nombre: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false
    })
    apellidos: string;

    @Column({
        type: 'varchar',
        length: 150,
        nullable: false
    })
    facultad: string;

    @Column({
        type: 'int',
        nullable: false
    })
    año_academico: number; 

    @Column({
        type: 'varchar',
        length: 50,
        nullable: false
    })
    grupo_docente: string;   

    @Column({
        type: 'varchar',
        length: 20,
        default: 'activo',
        nullable: false
    })
    estado: string;         

    @Column({
        type: 'text',
        nullable: true
    })
    avales: string;          
}