
export enum ActivityType {
  CONFERENCE = 'conference',
  PRACTICAL_CLASS = 'practical_class',
  LABORATORY = 'laboratory',
  WORKSHOP = 'workshop',
  SEMINAR = 'seminar',
  TUTORIAL = 'tutorial',
  FIELD_TRIP = 'field_trip',
  ASSESSMENT = 'assessment',
  PROJECT = 'project'
}

export interface ContentDistribution {
  id: string;
  subjectId: string;
  subjectName: string;
  weekNumber: number;
  activityType: ActivityType;
  topicTitle: string;
  contentDescription: string;
  durationHours: number;
  academicPeriod: string;
  startDate?: Date | string;
  endDate?: Date | string;
  learningObjectives?: string;
  requiredMaterials?: string;
  prerequisites?: string;
  evaluationMethod?: string;
  priority?: number;
  attendanceRequired?: boolean;
  resourcesUrls?: string;
  onlineMeetingLink?: string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}
