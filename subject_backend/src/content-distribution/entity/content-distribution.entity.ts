
import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  ManyToOne, 
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index 
} from 'typeorm';
import { Subject } from 'src/subjects/entity/subject.entity';
import { ActivityType } from '../enum/activity-type.enum';

@Entity('content_distributions')
@Index(['subjectId', 'weekNumber', 'academicPeriod']) 
export class ContentDistribution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  
  @ManyToOne(() => Subject, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @Column({ name: 'subject_id', type: 'uuid' })
  subjectId: string;

  @Column({ name: 'week_number', type: 'int' })
  weekNumber: number; 

  @Column({ 
    name: 'activity_type', 
    type: 'enum', 
    enum: ActivityType,
    default: ActivityType.CONFERENCE
  })
  activityType: ActivityType;

  @Column({ name: 'topic_title', length: 255 })
  topicTitle: string; 

  @Column({ name: 'content_description', type: 'text' })
  contentDescription: string; 

  @Column({ name: 'duration_hours', type: 'decimal', precision: 4, scale: 1, default: 2.0 })
  durationHours: number; 

  @Column({ name: 'learning_objectives', type: 'text', nullable: true })
  learningObjectives: string; 

  @Column({ name: 'required_materials', type: 'text', nullable: true })
  requiredMaterials: string; 

  @Column({ name: 'prerequisites', type: 'text', nullable: true })
  prerequisites: string; 

  @Column({ name: 'evaluation_method', type: 'varchar', length: 100, nullable: true })
  evaluationMethod: string; 

  @Column({ name: 'academic_period', length: 20 })
  academicPeriod: string; 

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date; 

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date; 

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}