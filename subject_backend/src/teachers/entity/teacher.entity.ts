import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('teachers')
export class Teacher {
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
    apellido: string;

    @Column({
        type: 'varchar',
        length: 150,
        unique: true,
        nullable: false
    })
    email: string;

    @Column({
        type: 'varchar',
        length: 20,
        unique: true,
        nullable: true
    })
    telefono: string;

    @Column({
        type: 'varchar',
        length: 20,
        nullable: true
    })
    documento_identidad: string;

    @Column({
        type: 'date',
        nullable: false
    })
    fecha_contratacion: Date;

    @Column({
        type: 'date',
        nullable: true
    })
    fecha_terminacion: Date;

    @Column({
        type: 'text',
        nullable: true
    })
    titulos_academicos: string; 
    @Column({
        type: 'int',
        default: 0,
        nullable: false
    })
    años_experiencia: number;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true
    })
    direccion: string;

    @Column({
        type: 'date',
        nullable: true
    })
    fecha_nacimiento: Date;

    @Column({
        type: 'varchar',
        length: 50,
        nullable: true
    })
    nacionalidad: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true
    })
    foto_url: string;

}