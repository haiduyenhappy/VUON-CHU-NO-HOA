import { ClassWeekSchedule, Classroom, ClassAssignment, WritingTask } from '../types';
import { 
  GRADE_1_TASKS, 
  GRADE_2_TASKS, 
  GRADE_4_TASKS, 
  GRADE_5_TASKS 
} from '../data/curriculumTasksByGrade';
import { GRADE_3_TASKS } from '../data/curriculumData';

/**
 * Định dạng ngày YYYY-MM-DD sang DD/MM/YYYY chuẩn Việt Nam
 */
export function formatDateVN(dateStr?: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('vi-VN');
    }
  } catch (e) {}
  return dateStr;
}

/**
 * Khởi tạo 35 tuần học chuẩn GDPT 2018 cho một lớp bắt đầu từ startDateStr (ngày Thứ Hai tuần 1)
 */
export function generateDefaultClassWeeks(
  startDateStr: string = '2026-09-07',
  explicitCurrentWeek?: number
): ClassWeekSchedule[] {
  const weeks: ClassWeekSchedule[] = [];
  const baseStart = new Date(startDateStr);
  
  // Xác định ngày Thứ Hai của tuần bắt đầu
  const day = baseStart.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(baseStart);
  monday.setDate(baseStart.getDate() + diffToMonday);

  // Mặc định tuần hiện tại tính theo khoảng thời gian thực tế nếu không có explicitCurrentWeek
  const now = new Date();
  
  for (let i = 1; i <= 35; i++) {
    const wStart = new Date(monday);
    wStart.setDate(monday.getDate() + (i - 1) * 7);

    const wEnd = new Date(wStart);
    wEnd.setDate(wStart.getDate() + 6); // Chủ nhật

    const startIso = wStart.toISOString().split('T')[0];
    const endIso = wEnd.toISOString().split('T')[0];

    const isCurrent = explicitCurrentWeek 
      ? i === explicitCurrentWeek 
      : (now >= wStart && now <= new Date(wEnd.getTime() + 86400000));

    weeks.push({
      weekNumber: i,
      title: `Tuần ${i}`,
      startDate: startIso,
      endDate: endIso,
      isCurrent: Boolean(isCurrent),
      notes: i === 9 ? 'Kiểm tra giữa kỳ 1' : i === 18 ? 'Ôn tập học kỳ 1' : undefined
    });
  }

  return weeks;
}

/**
 * Lấy thông tin tuần học hiện tại của lớp
 */
export function getCurrentWeekInfo(classroom?: Classroom | null): {
  weekNumber: number;
  formattedRange: string;
  startDate: string;
  endDate: string;
} {
  const defaultStartDate = classroom?.startDate || '2026-09-07';
  const weeks = classroom?.weeks && classroom.weeks.length > 0 
    ? classroom.weeks 
    : generateDefaultClassWeeks(defaultStartDate, classroom?.currentWeek || 8);

  const activeWeekNum = classroom?.currentWeek || 8;
  const matched = weeks.find(w => w.weekNumber === activeWeekNum) || weeks[7] || weeks[0];

  const startFormatted = formatDateVN(matched?.startDate || '2026-10-26');
  const endFormatted = formatDateVN(matched?.endDate || '2026-11-01');

  return {
    weekNumber: activeWeekNum,
    formattedRange: `Tuần ${activeWeekNum} (${startFormatted} – ${endFormatted})`,
    startDate: matched?.startDate || '2026-10-26',
    endDate: matched?.endDate || '2026-11-01'
  };
}

/**
 * Định dạng nhãn tuần học kèm khoảng thời gian
 */
export function formatWeekScheduleTitle(week: ClassWeekSchedule): string {
  const s = formatDateVN(week.startDate);
  const e = formatDateVN(week.endDate);
  return `Tuần ${week.weekNumber} (${s} – ${e})`;
}

/**
 * Tìm bài học SGK Kết nối tri thức tương ứng theo khối lớp và tuần học
 */
export function getCurriculumTaskForGradeAndWeek(grade: number, week: number): WritingTask | undefined {
  let pool: WritingTask[] = [];
  if (grade === 1) pool = GRADE_1_TASKS;
  else if (grade === 2) pool = GRADE_2_TASKS;
  else if (grade === 3) pool = GRADE_3_TASKS;
  else if (grade === 4) pool = GRADE_4_TASKS;
  else if (grade === 5) pool = GRADE_5_TASKS;
  else pool = GRADE_3_TASKS;

  return pool.find(t => t.week === week) || pool[0];
}

/**
 * Lấy toàn bộ ngân hàng đề theo khối lớp để giáo viên chọn nhanh
 */
export function getCurriculumTasksByGrade(grade: number): WritingTask[] {
  if (grade === 1) return GRADE_1_TASKS;
  if (grade === 2) return GRADE_2_TASKS;
  if (grade === 3) return GRADE_3_TASKS;
  if (grade === 4) return GRADE_4_TASKS;
  if (grade === 5) return GRADE_5_TASKS;
  return GRADE_3_TASKS;
}
