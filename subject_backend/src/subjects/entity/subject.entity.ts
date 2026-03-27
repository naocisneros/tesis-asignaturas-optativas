import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { EstadoEnum } from '../enum/state.enum';
import { CategoriaEnum } from '../enum/category.enum';
import { SeccionEnum } from '../enum/section.enum';

@Entity('subject')
export class Subject {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 255,
        unique: true,
        nullable: false
    })
    nombre: string;

    @Column({
        type: 'varchar'
    })
    descripción: string;

    @Column({
        type: 'int',
        default: 0,
        nullable: false
    })
    matrícula: number;


    @Column({
        type: 'date',
        nullable: false
    })
    inicio_de_matrícula: Date;

    @Column({
        type: 'date',
        nullable: false
    })
    fin_de_matrícula: Date;

    @Column({
        type: 'date',
        nullable: false
    })
    fecha_de_inicio: Date;

    @Column({
        type: 'date',
        nullable: false
    })
    fecha_de_fin: Date;

    @Column({
        type: 'enum',
        enum: EstadoEnum,
        default: EstadoEnum.DISPONIBLE,
        nullable: false
    })
    estado: EstadoEnum;


    @Column({
        type: 'enum',
        enum: CategoriaEnum,
        default: CategoriaEnum.MATEMATICA,
        nullable: false
    })
    categoría: CategoriaEnum;

    @Column({
        type: 'enum',
        enum: SeccionEnum,
        default: SeccionEnum.MATUTINA,
        nullable: false
    })
    sección: SeccionEnum;
}