import { Submission, WritingSkillId } from '../types';

export interface DetailedErrorItem {
  id: string;
  submissionId: string;
  submissionTitle: string;
  date: string;
  category: 'chinh_ta' | 'dung_tu' | 'dat_cau' | 'bo_cuc';
  categoryLabel: string;
  errorName: string;
  contextText: string;
  suggestion: string;
  explanation: string;
  isCertain: boolean;
}

export interface CompetencyItem {
  key: 'noi_dung' | 'dien_dat' | 'cam_xuc' | 'hinh_thuc';
  label: string;
  score: number; // 1 to 5
  levelLabel: string;
  deltaFromPrevious: number; // e.g. +1, 0, -1
  gradeExpectation: string;
  evidence: string;
}

export interface PeriodicExamScoreItem {
  submissionId: string;
  title: string;
  date: string;
  score: number; // 0 to 10
  teacherName: string;
  comment?: string;
  status: 'published' | 'draft';
}

/**
 * Tiêu chí Năng lực thành phần theo Chương trình GDPT 2018 điều chỉnh theo khối lớp 1–5
 */
export const GRADE_COMPETENCY_EXPECTATIONS: Record<number, Record<'noi_dung' | 'dien_dat' | 'cam_xuc' | 'hinh_thuc', string>> = {
  1: {
    noi_dung: 'Nói và viết được 1–2 câu giới thiệu bản thân, người thân hoặc đồ vật quen thuộc.',
    dien_dat: 'Dùng từ ngữ ngây thơ đúng nghĩa, diễn đạt thành câu đơn hoàn chỉnh.',
    cam_xuc: 'Bộc lộ niềm vui, tình cảm tự nhiên với người và cảnh vật xung quanh.',
    hinh_thuc: 'Chữ viết rõ ràng, viết hoa chữ cái đầu câu, kết thúc bằng dấu chấm.'
  },
  2: {
    noi_dung: 'Viết đoạn văn ngắn 3–5 câu kể hoặc tả đồ vật, con vật, loài cây quen thuộc.',
    dien_dat: 'Biết dùng từ chỉ đặc điểm, màu sắc, hành động; câu văn không bị lặp từ vụng về.',
    cam_xuc: 'Thể hiện tình cảm gắn bó, biết dùng hình ảnh so sánh đơn giản gần gũi.',
    hinh_thuc: 'Viết hoa danh từ riêng và đầu câu; dùng đúng dấu chấm, dấu phẩy ngắt vế.'
  },
  3: {
    noi_dung: 'Nắm chắc thể loại (kể, tả, cảm xúc, viết thư); xác định rõ đối tượng và bám sát yêu cầu đề bài.',
    dien_dat: 'Vận dụng từ láy, từ gợi cảm giác; liên kết câu bằng các từ nối tự nhiên, chuyển ý nhịp nhàng.',
    cam_xuc: 'Sử dụng hình ảnh so sánh, nhân hóa sinh động; bày tỏ tình cảm chân thật, tự nhiên.',
    hinh_thuc: 'Trình bày đúng thể thức đoạn văn/lá thư; hạn chế tối đa lỗi chính tả và dấu câu.'
  },
  4: {
    noi_dung: 'Bố cục bài viết chặt chẽ (mở bài, thân bài, kết bài); phát triển ý phong phú từ nhiều góc độ.',
    dien_dat: 'Câu văn biến hóa linh hoạt (câu đơn, câu ghép); từ ngữ trau chuốt, sinh động, biểu cảm.',
    cam_xuc: 'Cảm xúc sâu sắc, có liên tưởng bất ngờ, khơi gợi rung cảm nơi người đọc.',
    hinh_thuc: 'Chính tả chuẩn mực; sử dụng thành thạo dấu ngoặc kép, gạch đầu dòng, dấu hai chấm.'
  },
  5: {
    noi_dung: 'Bao quát toàn diện đề bài mở; chọn lọc chi tiết đắt giá, làm nổi bật thông điệp nhân văn.',
    dien_dat: 'Hành văn lưu loát, giọng điệu tự nhiên, từ ngữ phong phú mang đậm dấu ấn cá nhân.',
    cam_xuc: 'Tình cảm tinh tế, có chiều sâu chiêm nghiệm và bài học cuộc sống sâu sắc.',
    hinh_thuc: 'Trình bày thẩm mỹ, chữ viết nắn nót; sử dụng dấu câu điêu luyện để tạo nhịp điệu.'
  }
};

/**
 * Trích xuất hoặc phân tích lỗi của học sinh từ các bài viết
 */
export function extractSubmissionErrors(submissions: Submission[]): DetailedErrorItem[] {
  const errors: DetailedErrorItem[] = [];

  submissions.forEach((sub, subIdx) => {
    const subTitle = sub.taskTitle || `Bài viết ${subIdx + 1}`;
    const subDate = sub.completedAt || sub.startedAt || new Date().toISOString();
    const formattedDate = new Date(subDate).toLocaleDateString('vi-VN');

    // 1. Ưu tiên lấy từ comprehensiveFeedback.corrections nếu có
    if (sub.comprehensiveFeedback?.corrections && sub.comprehensiveFeedback.corrections.length > 0) {
      sub.comprehensiveFeedback.corrections.forEach((c, idx) => {
        let cat: 'chinh_ta' | 'dung_tu' | 'dat_cau' | 'bo_cuc' = 'chinh_ta';
        let catLabel = 'Chính tả';

        if (c.type === 'dung_tu' || (c as any).category === 'dung_tu') {
          cat = 'dung_tu';
          catLabel = 'Dùng từ';
        } else if (c.type === 'dat_cau' || (c as any).category === 'dat_cau') {
          cat = 'dat_cau';
          catLabel = 'Đặt câu';
        } else if ((c as any).type === 'bo_cuc' || (c as any).category === 'bo_cuc') {
          cat = 'bo_cuc';
          catLabel = 'Bố cục';
        }

        errors.push({
          id: `err-${sub.id}-${idx}`,
          submissionId: sub.id,
          submissionTitle: subTitle,
          date: formattedDate,
          category: cat,
          categoryLabel: catLabel,
          errorName: c.reviewPoint || 'Cần chỉnh sửa',
          contextText: c.originalText || 'Trích đoạn trong bài',
          suggestion: c.suggestion || 'Gợi ý chỉnh sửa',
          explanation: c.explanation || 'Để câu văn mạch lạc, đúng quy tắc ngữ pháp.',
          isCertain: c.isCertainError ?? true
        });
      });
      return;
    }

    // 2. Nếu bài viết chưa có comprehensiveFeedback.corrections, phân tích trực tiếp văn bản học sinh
    const text = (sub.finalContent || sub.firstDraft || '').trim();
    if (!text) return;

    // A. Kiểm tra Chính tả (Spelling & Punctuation)
    // - Thiếu dấu chấm kết đoạn
    if (!text.endsWith('.') && !text.endsWith('!') && !text.endsWith('?')) {
      const lastSentence = text.split(/[.!?]/).pop()?.trim() || text.slice(-40);
      errors.push({
        id: `err-${sub.id}-ct-end`,
        submissionId: sub.id,
        submissionTitle: subTitle,
        date: formattedDate,
        category: 'chinh_ta',
        categoryLabel: 'Chính tả',
        errorName: 'Thiếu dấu chấm kết thúc đoạn/bài',
        contextText: `...${lastSentence}`,
        suggestion: `Thêm dấu chấm "." vào cuối câu: "...${lastSentence}."`,
        explanation: 'Dấu chấm giúp người đọc nhận biết câu chuyện đã kết thúc trọn vẹn.',
        isCertain: true
      });
    }

    // - Viết hoa đầu câu: tìm ký tự thường ngay sau dấu chấm
    const lowercaseAfterPeriod = text.match(/\.\s+([a-záàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ])/g);
    if (lowercaseAfterPeriod && lowercaseAfterPeriod.length > 0) {
      lowercaseAfterPeriod.slice(0, 2).forEach((match, mIdx) => {
        const char = match.slice(-1);
        errors.push({
          id: `err-${sub.id}-ct-cap-${mIdx}`,
          submissionId: sub.id,
          submissionTitle: subTitle,
          date: formattedDate,
          category: 'chinh_ta',
          categoryLabel: 'Chính tả',
          errorName: 'Chữ cái đầu câu chưa viết hoa',
          contextText: `...${match}...`,
          suggestion: `Viết hoa chữ cái đầu: ". ${char.toUpperCase()}"`,
          explanation: 'Quy tắc chính tả Tiếng Việt quy định chữ cái đầu câu bắt buộc phải viết hoa.',
          isCertain: true
        });
      });
    }

    // B. Kiểm tra Dùng từ (Word Usage)
    // Lặp từ nhiều lần (ví dụ từ "và", "xong rồi", "thì" xuất hiện quá dày)
    const words = text.toLowerCase().split(/\s+/);
    const countVa = words.filter(w => w === 'và').length;
    if (countVa >= 4 && words.length < 100) {
      errors.push({
        id: `err-${sub.id}-dt-va`,
        submissionId: sub.id,
        submissionTitle: subTitle,
        date: formattedDate,
        category: 'dung_tu',
        categoryLabel: 'Dùng từ',
        errorName: 'Lặp từ nối "và" nhiều lần',
        contextText: `Đoạn văn có ${countVa} lần dùng từ "và"`,
        suggestion: 'Thay thế bớt từ "và" bằng dấu phẩy "," hoặc các từ nối khác như: "đồng thời", "cùng với", "rồi".',
        explanation: 'Giúp đoạn văn thanh thoát, tránh cảm giác đơn điệu.',
        isCertain: false
      });
    }

    // C. Kiểm tra Đặt câu (Sentence Construction)
    // Câu quá dài không có dấu ngắt câu (trên 35 từ không có dấu chấm/phẩy)
    const sentences = text.split(/[.!?]/).map(s => s.trim()).filter(Boolean);
    sentences.forEach((s, sIdx) => {
      const sWords = s.split(/\s+/);
      if (sWords.length > 32 && !s.includes(',')) {
        errors.push({
          id: `err-${sub.id}-dc-len-${sIdx}`,
          submissionId: sub.id,
          submissionTitle: subTitle,
          date: formattedDate,
          category: 'dat_cau',
          categoryLabel: 'Đặt câu',
          errorName: 'Câu văn quá dài chưa ngắt ý',
          contextText: s.length > 60 ? `"${s.slice(0, 55)}..."` : `"${s}"`,
          suggestion: 'Ngắt câu dài thành hai câu ngắn hoặc dùng dấu phẩy để ngắt các vế câu.',
          explanation: 'Câu văn ngắn gọn giúp người đọc không bị hụt hơi và nắm rõ ý chính.',
          isCertain: true
        });
      }
    });

    // D. Kiểm tra Bố cục (Layout / Structure)
    // Nếu đoạn văn quá ngắn dưới 3 câu đối với lớp 3–5
    if (sentences.length < 3 && words.length > 0) {
      errors.push({
        id: `err-${sub.id}-bc-short`,
        submissionId: sub.id,
        submissionTitle: subTitle,
        date: formattedDate,
        category: 'bo_cuc',
        categoryLabel: 'Bố cục',
        errorName: 'Dung lượng đoạn văn chưa đủ 3 phần',
        contextText: `Bài hiện có ${sentences.length} câu`,
        suggestion: 'Bổ sung thêm câu mở đoạn hoặc câu nêu cảm xúc kết đoạn để tạo bố cục trọn vẹn.',
        explanation: 'Một đoạn văn chuẩn mực cần có câu mở đoạn, các câu phát triển và câu kết đoạn.',
        isCertain: false
      });
    }
  });

  return errors;
}

/**
 * Tính toán Năng lực thành phần (1–5) theo 4 tiêu chí cho một bài viết
 */
export function calculateCompetenciesForSubmission(
  sub: Submission,
  prevSub?: Submission | null,
  studentGrade?: number
): CompetencyItem[] {
  const grade = studentGrade || sub.grade || 3;
  const gradeExp = GRADE_COMPETENCY_EXPECTATIONS[grade] || GRADE_COMPETENCY_EXPECTATIONS[3];

  // Helper chuyển điểm 0–100 sang thang 1–5
  const scoreToLevel = (score100: number): { score5: number; label: string } => {
    if (score100 >= 88) return { score5: 5, label: 'Xuất sắc' };
    if (score100 >= 72) return { score5: 4, label: 'Thực hiện tốt' };
    if (score100 >= 55) return { score5: 3, label: 'Có tiến bộ' };
    if (score100 >= 40) return { score5: 2, label: 'Đang luyện tập' };
    return { score5: 1, label: 'Cần cố gắng' };
  };

  // 1. Ý tưởng / Nội dung (dựa trên hieu_de, tim_y, fiveContents.noiDung)
  let rawNoiDung = 82;
  const evalHieuDe = sub.teacherSkillEvaluations?.find(e => e.skillId === 'hieu_de') || sub.aiSkillEvaluations?.find(e => e.skillId === 'hieu_de');
  const evalTimY = sub.teacherSkillEvaluations?.find(e => e.skillId === 'tim_y') || sub.aiSkillEvaluations?.find(e => e.skillId === 'tim_y');
  if (evalHieuDe && evalTimY) {
    rawNoiDung = Math.round((evalHieuDe.score + evalTimY.score) / 2);
  } else if (sub.comprehensiveFeedback?.fiveContents?.noiDung) {
    rawNoiDung = sub.comprehensiveFeedback.fiveContents.noiDung;
  } else if (sub.teacherFeedback?.confirmedStars) {
    rawNoiDung = sub.teacherFeedback.confirmedStars * 18;
  }

  // 2. Diễn đạt / Liên kết (dựa trên dien_dat, sap_xep_y, fiveContents.tuVung, boCuc)
  let rawDienDat = 78;
  const evalDienDat = sub.teacherSkillEvaluations?.find(e => e.skillId === 'dien_dat') || sub.aiSkillEvaluations?.find(e => e.skillId === 'dien_dat');
  const evalSapXep = sub.teacherSkillEvaluations?.find(e => e.skillId === 'sap_xep_y') || sub.aiSkillEvaluations?.find(e => e.skillId === 'sap_xep_y');
  if (evalDienDat && evalSapXep) {
    rawDienDat = Math.round((evalDienDat.score + evalSapXep.score) / 2);
  } else if (evalDienDat) {
    rawDienDat = evalDienDat.score;
  } else if (sub.comprehensiveFeedback?.fiveContents?.tuVung) {
    rawDienDat = Math.round((sub.comprehensiveFeedback.fiveContents.tuVung + (sub.comprehensiveFeedback.fiveContents.boCuc || 75)) / 2);
  }

  // 3. Cảm xúc / Sáng tạo (dựa trên cam_xuc_sang_tao, fiveContents.camXuc)
  let rawCamXuc = 85;
  const evalCamXuc = sub.teacherSkillEvaluations?.find(e => e.skillId === 'cam_xuc_sang_tao') || sub.aiSkillEvaluations?.find(e => e.skillId === 'cam_xuc_sang_tao');
  if (evalCamXuc) {
    rawCamXuc = evalCamXuc.score;
  } else if (sub.comprehensiveFeedback?.fiveContents?.camXuc) {
    rawCamXuc = sub.comprehensiveFeedback.fiveContents.camXuc;
  } else if (sub.teacherFeedback?.emotionCreativityEncouragement) {
    rawCamXuc = 88;
  }

  // 4. Hình thức / Chữ viết (dựa trên chinh_ta_dau_cau, fiveContents.chinhTa)
  let rawHinhThuc = 80;
  const evalChinhTa = sub.teacherSkillEvaluations?.find(e => e.skillId === 'chinh_ta_dau_cau') || sub.aiSkillEvaluations?.find(e => e.skillId === 'chinh_ta_dau_cau');
  if (evalChinhTa) {
    rawHinhThuc = evalChinhTa.score;
  } else if (sub.comprehensiveFeedback?.fiveContents?.chinhTa) {
    rawHinhThuc = sub.comprehensiveFeedback.fiveContents.chinhTa;
  }

  const resNoiDung = scoreToLevel(rawNoiDung);
  const resDienDat = scoreToLevel(rawDienDat);
  const resCamXuc = scoreToLevel(rawCamXuc);
  const resHinhThuc = scoreToLevel(rawHinhThuc);

  // So sánh với bài trước nếu có
  let prevNoiDung = resNoiDung.score5;
  let prevDienDat = resDienDat.score5;
  let prevCamXuc = resCamXuc.score5;
  let prevHinhThuc = resHinhThuc.score5;

  if (prevSub) {
    const prevEvals = calculateCompetenciesForSubmission(prevSub);
    prevNoiDung = prevEvals.find(e => e.key === 'noi_dung')?.score || resNoiDung.score5;
    prevDienDat = prevEvals.find(e => e.key === 'dien_dat')?.score || resDienDat.score5;
    prevCamXuc = prevEvals.find(e => e.key === 'cam_xuc')?.score || resCamXuc.score5;
    prevHinhThuc = prevEvals.find(e => e.key === 'hinh_thuc')?.score || resHinhThuc.score5;
  }

  return [
    {
      key: 'noi_dung',
      label: 'Ý tưởng / Nội dung',
      score: resNoiDung.score5,
      levelLabel: resNoiDung.label,
      deltaFromPrevious: prevSub ? (resNoiDung.score5 - prevNoiDung) : 0,
      gradeExpectation: gradeExp.noi_dung,
      evidence: sub.teacherFeedback?.praiseIdea || evalTimY?.evidence || 'Ý tưởng bám sát đề bài, chọn lọc được chi tiết nổi bật.'
    },
    {
      key: 'dien_dat',
      label: 'Diễn đạt / Liên kết',
      score: resDienDat.score5,
      levelLabel: resDienDat.label,
      deltaFromPrevious: prevSub ? (resDienDat.score5 - prevDienDat) : 0,
      gradeExpectation: gradeExp.dien_dat,
      evidence: sub.teacherFeedback?.wordSentenceSuggestions || evalDienDat?.evidence || 'Câu văn gãy gọn, từ ngữ tự nhiên và phù hợp lứa tuổi.'
    },
    {
      key: 'cam_xuc',
      label: 'Cảm xúc / Sáng tạo',
      score: resCamXuc.score5,
      levelLabel: resCamXuc.label,
      deltaFromPrevious: prevSub ? (resCamXuc.score5 - prevCamXuc) : 0,
      gradeExpectation: gradeExp.cam_xuc,
      evidence: sub.teacherFeedback?.emotionCreativityEncouragement || evalCamXuc?.evidence || 'Bộc lộ tình cảm chân thật, có hình ảnh liên tưởng sinh động.'
    },
    {
      key: 'hinh_thuc',
      label: 'Hình thức / Chữ viết',
      score: resHinhThuc.score5,
      levelLabel: resHinhThuc.label,
      deltaFromPrevious: prevSub ? (resHinhThuc.score5 - prevHinhThuc) : 0,
      gradeExpectation: gradeExp.hinh_thuc,
      evidence: evalChinhTa?.evidence || 'Trình bày sạch sẽ, đúng quy tắc viết hoa và dấu ngắt câu.'
    }
  ];
}

/**
 * Lấy danh sách điểm kiểm tra định kỳ ĐÃ CÔNG BỐ của học sinh (Thang điểm 10)
 * Bắt buộc: Đánh giá thường xuyên không được quy đổi thành điểm số.
 * Nếu chưa có bài định kỳ, trả về mảng rỗng [] để hiển thị "Chưa có bài đánh giá định kỳ".
 */
export function getPublishedPeriodicExamScores(submissions: Submission[]): PeriodicExamScoreItem[] {
  const result: PeriodicExamScoreItem[] = [];

  submissions.forEach(sub => {
    // Chỉ lấy bài có điểm số kiểm tra định kỳ được giáo viên công bố
    const isExamType = sub.isExam === true || sub.assignmentId === 'ASM-002';
    const publishedScore = sub.teacherFeedback?.status === 'published' && typeof sub.teacherFeedback?.score === 'number'
      ? sub.teacherFeedback.score
      : (sub.status === 'reviewed' && isExamType && typeof sub.score === 'number' ? sub.score : undefined);

    if (publishedScore !== undefined && publishedScore > 0 && publishedScore <= 10) {
      const dateStr = sub.completedAt || sub.startedAt || new Date().toISOString();
      result.push({
        submissionId: sub.id,
        title: sub.taskTitle || 'Bài kiểm tra định kỳ',
        date: new Date(dateStr).toLocaleDateString('vi-VN'),
        score: publishedScore,
        teacherName: sub.teacherFeedback?.teacherName || 'Giáo viên',
        comment: sub.teacherFeedback?.comment,
        status: 'published'
      });
    }
  });

  // Sắp xếp theo ngày tăng dần (theo thời gian)
  return result;
}
