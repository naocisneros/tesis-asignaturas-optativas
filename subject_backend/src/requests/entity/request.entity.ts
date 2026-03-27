import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/entity/users.entity';
import { Subject } from 'src/subjects/entity/subject.entity';


@Entity({ name: 'requests' })
export class Request {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  
  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

 
  @ManyToOne(() => Subject, (subject) => subject.id, {
    onDelete: 'CASCADE', 
    nullable: false,
  })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @Column({type: 'int'})
  option: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

}