import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/entity/users.entity';
import { Subject } from 'src/subjects/entity/subject.entity';


@Entity({ name: 'enrollments' })
export class Enrollment {
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

}