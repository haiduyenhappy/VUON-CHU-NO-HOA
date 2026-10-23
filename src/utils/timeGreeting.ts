/**
 * Utility for Vietnam timezone (GMT+7 / Asia/Ho_Chi_Minh) greeting and mascot personalization
 */

export interface TimePeriodInfo {
  period: 'sang' | 'trua' | 'chieu' | 'toi';
  periodLabel: string;
  greetingTitle: string;
  hour: number;
}

export function getVietnamTimePeriod(): TimePeriodInfo {
  // Current time in Vietnam (UTC+7)
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const vnDate = new Date(utc + 7 * 3600000);
  const hour = vnDate.getHours() + vnDate.getMinutes() / 60;

  // 05:00 – 10:59: Buổi sáng
  if (hour >= 5 && hour < 11) {
    return {
      period: 'sang',
      periodLabel: 'buổi sáng',
      greetingTitle: 'Chào buổi sáng',
      hour: Math.floor(hour)
    };
  }
  // 11:00 – 13:29: Buổi trưa
  if (hour >= 11 && hour < 13.5) {
    return {
      period: 'trua',
      periodLabel: 'buổi trưa',
      greetingTitle: 'Chào buổi trưa',
      hour: Math.floor(hour)
    };
  }
  // 13:30 – 17:59: Buổi chiều
  if (hour >= 13.5 && hour < 18) {
    return {
      period: 'chieu',
      periodLabel: 'buổi chiều',
      greetingTitle: 'Chào buổi chiều',
      hour: Math.floor(hour)
    };
  }
  // 18:00 – 04:59: Buổi tối
  return {
    period: 'toi',
    periodLabel: 'buổi tối',
    greetingTitle: 'Chào buổi tối',
    hour: Math.floor(hour)
  };
}

export function getHomeGreeting(): string {
  const { periodLabel } = getVietnamTimePeriod();
  return `Chào ${periodLabel} các bạn nhỏ yêu quý! Chào mừng em đến với Vườn Chữ Nở Hoa – nơi mỗi em có một ý tưởng, mỗi bài viết một sắc màu rực rỡ!`;
}

export function getStudentGreeting(studentName: string, flowersEarned: number): string {
  const { greetingTitle, periodLabel } = getVietnamTimePeriod();
  return `${greetingTitle} ${studentName}! Chúc em một ${periodLabel} tràn đầy cảm hứng. Hôm nay con đã nở được ${flowersEarned} bông hoa chữ đẹp! Em hãy chọn nhiệm vụ để gieo hạt ý tưởng mới nhé!`;
}

export function getTeacherGreeting(teacherName: string, pendingCount: number): string {
  const { greetingTitle, periodLabel } = getVietnamTimePeriod();
  return `Kính ${greetingTitle.toLowerCase()} cô ${teacherName}! Chúc cô một ${periodLabel} tràn đầy năng lượng. Hôm nay lớp 3 có ${pendingCount > 0 ? `${pendingCount} bài viết mới đang chờ cô trao gửi nhận xét yêu thương` : 'các bạn đang hăng say tìm ý và hoàn thiện bài viết'}!`;
}

export function getFamilyGreeting(studentName: string, flowersCount: number): string {
  const { greetingTitle, periodLabel } = getVietnamTimePeriod();
  return `Kính ${greetingTitle.toLowerCase()} bố mẹ của bé ${studentName}! Chúc gia đình một ${periodLabel} ấm áp và nhiều niềm vui. Cùng xem bông hoa chữ (${flowersCount} 🌸) và những điều con muốn kể hôm nay nhé!`;
}
