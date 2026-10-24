import { WritingTask } from '../types';

// ==========================================
// BÀI TẬP TIẾNG VIỆT LỚP 1 (GDPT 2018)
// Phương châm: "Em tập viết câu" (1–2 câu trọn vẹn, đúng ngữ pháp, không gượng ép mở-thân-kết)
// ==========================================
export const GRADE_1_TASKS: WritingTask[] = [
  // Tập 1
  {
    id: 'g1-t1-01',
    grade: 1,
    volume: 1,
    week: 8,
    title: 'Viết 1–2 câu giới thiệu bản thân em',
    gardenType: 'ke_chuyen',
    genre: 'ke_su_viec',
    prompt: 'Viết 1–2 câu giới thiệu họ tên, lớp và sở thích đáng yêu của em.',
    suggestedQuestions: [
      'Em tên là gì? Năm nay em học lớp mấy?',
      'Em thích chơi trò gì hoặc thích màu sắc nào nhất?'
    ],
    evaluationCriteria: [
      'Viết hoa chữ cái đầu câu và tên riêng của em',
      'Cuối câu có dấu chấm rõ ràng',
      'Câu văn ngắn gọn, đủ ý'
    ],
    textbookRef: 'Tiếng Việt 1 Tập 1 - Bài Em là học sinh lớp 1',
    gradeMission: 'Em tập viết câu hoàn chỉnh',
    expectedLength: '1–2 câu ngắn'
  },
  {
    id: 'g1-t1-02',
    grade: 1,
    volume: 1,
    week: 12,
    title: 'Viết 1–2 câu về người thân yêu nhất',
    gardenType: 'yeu_thuong',
    genre: 'tinh_cam_cam_xuc',
    prompt: 'Viết 1–2 câu thể hiện tình cảm yêu thương của em dành cho bố, mẹ, ông hoặc bà.',
    suggestedQuestions: [
      'Người em yêu quý nhất trong nhà là ai?',
      'Em muốn nói lời yêu thương gì với người đó?'
    ],
    evaluationCriteria: [
      'Dùng từ xưng hô lễ phép, ấm áp',
      'Đầu câu viết hoa, cuối câu có dấu chấm'
    ],
    textbookRef: 'Tiếng Việt 1 Tập 1 - Bài Mái ấm gia đình',
    gradeMission: 'Em tập viết câu bày tỏ tình cảm',
    expectedLength: '1–2 câu'
  },
  {
    id: 'g1-t1-03',
    grade: 1,
    volume: 1,
    week: 15,
    title: 'Nhìn tranh viết câu về chú mèo con',
    gardenType: 'sac_mau',
    genre: 'ta_do_vat',
    prompt: 'Quan sát tranh chú mèo con và viết 1–2 câu tả hình dáng hoặc hành động của mèo con.',
    suggestedQuestions: [
      'Chú mèo có bộ lông màu gì?',
      'Chú mèo đang làm gì (sưởi nắng, chơi cuộn len, bắt chuột)?'
    ],
    evaluationCriteria: [
      'Có từ tả màu sắc hoặc hành động ngộ nghĩnh của mèo con',
      'Câu văn trọn vẹn, dễ hiểu'
    ],
    textbookRef: 'Tiếng Việt 1 Tập 1 - Bài Chú mèo mướp',
    gradeMission: 'Em tập viết câu quan sát tranh',
    expectedLength: '1–2 câu'
  },
  {
    id: 'g1-t1-04',
    grade: 1,
    volume: 1,
    week: 18,
    title: 'Viết 1–2 câu về cây bút chì của em',
    gardenType: 'sac_mau',
    genre: 'ta_do_vat',
    prompt: 'Viết 1–2 câu miêu tả chiếc bút chì hoặc hộp bút xinh xắn giúp em tập viết mỗi ngày.',
    suggestedQuestions: [
      'Chiếc bút chì của em có màu sắc hay hình vẽ gì đẹp?',
      'Chiếc bút giúp em viết chữ đẹp như thế nào?'
    ],
    evaluationCriteria: [
      'Nêu được tên đồ vật và màu sắc yêu thích',
      'Đúng dấu câu và chính tả'
    ],
    textbookRef: 'Tiếng Việt 1 Tập 1 - Bài Đồ dùng học tập',
    gradeMission: 'Em tập viết câu tả đồ vật',
    expectedLength: '1–2 câu'
  },
  // Tập 2
  {
    id: 'g1-t2-01',
    grade: 1,
    volume: 2,
    week: 22,
    title: 'Viết 1–2 câu về giờ ra chơi ở sân trường',
    gardenType: 'ke_chuyen',
    genre: 'ke_su_viec',
    prompt: 'Viết 1–2 câu kể lại niềm vui của em và các bạn khi cùng chơi trên sân trường giờ ra chơi.',
    suggestedQuestions: [
      'Giờ ra chơi, sân trường rộn rã như thế nào?',
      'Em và các bạn chơi trò gì vui nhất (nhảy dây, đuổi bắt, đọc truyện)?'
    ],
    evaluationCriteria: [
      'Diễn đạt niềm vui tươi hồn nhiên',
      'Không viết thiếu dấu chấm cuối câu'
    ],
    textbookRef: 'Tiếng Việt 1 Tập 2 - Bài Giờ ra chơi',
    gradeMission: 'Em tập viết câu kể việc',
    expectedLength: '1–2 câu'
  },
  {
    id: 'g1-t2-02',
    grade: 1,
    volume: 2,
    week: 26,
    title: 'Viết 1–2 câu về một loài hoa mùa xuân',
    gardenType: 'sac_mau',
    genre: 'ta_canh_vat',
    prompt: 'Viết 1–2 câu nói về sắc hoa rực rỡ đón Tết hoặc vẻ đẹp của một bông hoa em thấy trong vườn.',
    suggestedQuestions: [
      'Em thấy bông hoa nào (hoa mai, hoa đào, hoa cúc)?',
      'Cánh hoa và màu sắc của hoa tươi đẹp ra sao?'
    ],
    evaluationCriteria: [
      'Từ ngữ tả màu sắc tươi sáng',
      'Đầu câu viết hoa'
    ],
    textbookRef: 'Tiếng Việt 1 Tập 2 - Bài Hoa nở đón xuân',
    gradeMission: 'Em tập viết câu tả cảnh',
    expectedLength: '1–2 câu'
  },
  {
    id: 'g1-t2-03',
    grade: 1,
    volume: 2,
    week: 30,
    title: 'Viết 1–2 câu cảm ơn thầy cô giáo',
    gardenType: 'yeu_thuong',
    genre: 'tinh_cam_cam_xuc',
    prompt: 'Viết 1–2 câu bày tỏ lời cảm ơn cô giáo hoặc thầy giáo đã dạy em từng nét chữ đầu đời.',
    suggestedQuestions: [
      'Cô giáo (thầy giáo) đã dạy em điều gì?',
      'Em muốn gửi lời chúc hay tình cảm gì tới cô?'
    ],
    evaluationCriteria: [
      'Lời lẽ kính trọng, lễ phép',
      'Đúng cấu trúc câu trọn vẹn'
    ],
    textbookRef: 'Tiếng Việt 1 Tập 2 - Bài Cô giáo của em',
    gradeMission: 'Em tập viết câu tri ân',
    expectedLength: '1–2 câu'
  },
  {
    id: 'g1-t2-04',
    grade: 1,
    volume: 2,
    week: 34,
    title: 'Viết 1–2 câu về ước mơ khi lớn lên',
    gardenType: 'y_kien',
    genre: 'sang_tao',
    prompt: 'Viết 1–2 câu nói về ước mơ của em: lớn lên em muốn làm nghề gì (bác sĩ, giáo viên, phi công...)?',
    suggestedQuestions: [
      'Ước mơ tương lai của em là gì?',
      'Vì sao em lại thích công việc đó?'
    ],
    evaluationCriteria: [
      'Bày tỏ ước mơ trong sáng, tự tin',
      'Đúng chính tả'
    ],
    textbookRef: 'Tiếng Việt 1 Tập 2 - Bài Ước mơ của bé',
    gradeMission: 'Em tập viết câu chia sẻ ước mơ',
    expectedLength: '1–2 câu'
  }
];

// ==========================================
// BÀI TẬP TIẾNG VIỆT LỚP 2 (GDPT 2018)
// Phương châm: "Em tập viết đoạn ngắn" (3–5 câu liên kết, mạch lạc, trả lời các câu hỏi gợi ý)
// ==========================================
export const GRADE_2_TASKS: WritingTask[] = [
  // Tập 1
  {
    id: 'g2-t1-01',
    grade: 2,
    volume: 1,
    week: 3,
    title: 'Viết đoạn văn 3–5 câu kể về một hoạt động em làm cùng người thân',
    gardenType: 'ke_chuyen',
    genre: 'ke_su_viec',
    prompt: 'Viết một đoạn văn từ 3 đến 5 câu kể lại một việc em đã cùng làm với bố mẹ hoặc người thân (nấu cơm, quét nhà, tưới cây...).',
    suggestedQuestions: [
      'Em đã làm việc gì và cùng làm với ai?',
      'Em đã thực hiện những công việc gì cụ thể?',
      'Sau khi hoàn thành, tâm trạng của em và người thân ra sao?'
    ],
    evaluationCriteria: [
      'Đoạn văn có 3–5 câu mạch lạc',
      'Dùng từ ngữ chỉ hoạt động rõ ràng',
      'Có câu kết nêu cảm xúc vui vẻ'
    ],
    textbookRef: 'Tiếng Việt 2 Tập 1 - Bài Em yêu gia đình',
    gradeMission: 'Em tập viết đoạn 3–5 câu',
    expectedLength: '3–5 câu'
  },
  {
    id: 'g2-t1-02',
    grade: 2,
    volume: 1,
    week: 6,
    title: 'Viết đoạn văn 3–5 câu tả một đồ dùng học tập em yêu quý',
    gardenType: 'sac_mau',
    genre: 'ta_do_vat',
    prompt: 'Viết một đoạn văn ngắn (3–5 câu) miêu tả chiếc cặp sách, hộp bút hoặc cây thước kẻ của em.',
    suggestedQuestions: [
      'Đồ dùng học tập em muốn tả là gì? Ai mua hoặc tặng cho em?',
      'Đồ vật đó có màu sắc, hình dáng hoặc đặc điểm gì nổi bật?',
      'Đồ vật giúp ích gì cho việc học của em hàng ngày?',
      'Em giữ gìn đồ vật đó cẩn thận như thế nào?'
    ],
    evaluationCriteria: [
      'Giới thiệu được đồ dùng và màu sắc, hình dáng',
      'Nêu công dụng hữu ích đối với việc học',
      'Thể hiện sự nâng niu, giữ gìn'
    ],
    textbookRef: 'Tiếng Việt 2 Tập 1 - Bài Bạn của em',
    gradeMission: 'Em tập viết đoạn miêu tả đồ vật',
    expectedLength: '3–5 câu'
  },
  {
    id: 'g2-t1-03',
    grade: 2,
    volume: 1,
    week: 10,
    title: 'Viết 3–5 câu bày tỏ tình cảm với ông bà',
    gardenType: 'yeu_thuong',
    genre: 'tinh_cam_cam_xuc',
    prompt: 'Viết đoạn văn ngắn từ 3 đến 5 câu nói lên tình cảm yêu mến, kính trọng của em đối với ông hoặc bà.',
    suggestedQuestions: [
      'Ông hoặc bà có đặc điểm hay hành động dịu hiền nào khiến em nhớ nhất?',
      'Ông bà thường chăm sóc hoặc kể chuyện cho em nghe ra sao?',
      'Em mong ước điều gì cho sức khỏe của ông bà?'
    ],
    evaluationCriteria: [
      'Lời văn ấm áp, chân thành',
      'Nêu việc làm chăm sóc cụ thể',
      'Có lời chúc hoặc mong ước hiếu thảo'
    ],
    textbookRef: 'Tiếng Việt 2 Tập 1 - Bài Bàn tay dịu dàng',
    gradeMission: 'Em tập viết đoạn nêu tình cảm',
    expectedLength: '3–5 câu'
  },
  {
    id: 'g2-t1-04',
    grade: 2,
    volume: 1,
    week: 14,
    title: 'Viết tin nhắn hoặc lời cảm ơn, xin lỗi gửi bạn',
    gardenType: 'cuoc_song',
    genre: 'ke_su_viec',
    prompt: 'Viết một tin nhắn ngắn (3–4 câu) cảm ơn bạn đã cho em mượn đồ dùng hoặc xin lỗi bạn vì lỡ làm hỏng việc gì.',
    suggestedQuestions: [
      'Tin nhắn gửi cho bạn nào?',
      'Lý do em viết lời cảm ơn hoặc xin lỗi là gì?',
      'Lời chúc hoặc lời hứa thân thiết gửi tới bạn?'
    ],
    evaluationCriteria: [
      'Đúng cấu trúc lời nhắn lịch sự',
      'Chân thành, thân thiện'
    ],
    textbookRef: 'Tiếng Việt 2 Tập 1 - Bài Tin nhắn',
    gradeMission: 'Em tập viết tin nhắn ngắn',
    expectedLength: '3–4 câu'
  },
  // Tập 2
  {
    id: 'g2-t2-01',
    grade: 2,
    volume: 2,
    week: 20,
    title: 'Viết đoạn văn 3–5 câu tả một con vật nuôi đáng yêu',
    gardenType: 'sac_mau',
    genre: 'ta_do_vat',
    prompt: 'Viết đoạn văn ngắn (3–5 câu) miêu tả một chú cún, chú mèo con hoặc chú thỏ đáng yêu trong nhà.',
    suggestedQuestions: [
      'Nhà em (hoặc người quen) nuôi con vật gì? Tên gọi của nó là gì?',
      'Bộ lông, đôi mắt hoặc đôi tai của con vật có gì đáng yêu?',
      'Nó thường có hành động ngộ nghĩnh nào quấn quýt bên em?',
      'Em chăm sóc và yêu quý con vật đó ra sao?'
    ],
    evaluationCriteria: [
      'Tả được nét ngộ nghĩnh của con vật',
      'Dùng từ ngữ gợi hình (tròn xoe, mượt mà, thoăn thoắt...)',
      'Thể hiện tình cảm gắn bó'
    ],
    textbookRef: 'Tiếng Việt 2 Tập 2 - Bài Bạn trong nhà',
    gradeMission: 'Em tập viết đoạn miêu tả con vật',
    expectedLength: '3–5 câu'
  },
  {
    id: 'g2-t2-02',
    grade: 2,
    volume: 2,
    week: 24,
    title: 'Viết 3–5 câu kể về một việc làm tốt em đã làm',
    gardenType: 'ke_chuyen',
    genre: 'ke_su_viec',
    prompt: 'Viết một đoạn văn ngắn (3–5 câu) kể lại một việc tốt em đã làm (nhặt được của rơi trả lại, dắt em nhỏ, nhặt rác sân trường...).',
    suggestedQuestions: [
      'Việc tốt em đã làm là việc gì? Diễn ra khi nào?',
      'Em đã chủ động làm việc đó như thế nào?',
      'Thầy cô, người xung quanh khen ngợi em ra sao và em cảm thấy vui thế nào?'
    ],
    evaluationCriteria: [
      'Kể sự việc rõ ràng theo trình tự',
      'Thể hiện tinh thần trung thực, nhân ái'
    ],
    textbookRef: 'Tiếng Việt 2 Tập 2 - Bài Bông hoa việc tốt',
    gradeMission: 'Em tập viết đoạn kể việc tốt',
    expectedLength: '3–5 câu'
  },
  {
    id: 'g2-t2-03',
    grade: 2,
    volume: 2,
    week: 28,
    title: 'Viết đoạn văn 3–5 câu tả một cây hoa khoe sắc',
    gardenType: 'sac_mau',
    genre: 'ta_canh_vat',
    prompt: 'Viết một đoạn văn ngắn (3–5 câu) miêu tả một chậu hoa hoặc cây hoa rực rỡ trong sân trường, công viên.',
    suggestedQuestions: [
      'Đó là cây hoa gì (hoa hồng, hoa cúc, hoa mười giờ...)?',
      'Màu sắc của hoa và mùi hương thơm ngát như thế nào?',
      'Ngắm nhìn bông hoa, em cảm thấy khu vườn thêm đẹp ra sao?'
    ],
    evaluationCriteria: [
      'Có từ ngữ gợi màu sắc, hương thơm',
      'Đoạn văn liên kết tự nhiên'
    ],
    textbookRef: 'Tiếng Việt 2 Tập 2 - Bài Mùa hoa rực rỡ',
    gradeMission: 'Em tập viết đoạn tả hoa cỏ',
    expectedLength: '3–5 câu'
  },
  {
    id: 'g2-t2-04',
    grade: 2,
    volume: 2,
    week: 33,
    title: 'Viết 3–5 câu kể về một ngày hè rộn rã',
    gardenType: 'ke_chuyen',
    genre: 'ke_su_viec',
    prompt: 'Viết đoạn văn từ 3 đến 5 câu kể về niềm vui của em trong những ngày nghỉ hè bên gia đình.',
    suggestedQuestions: [
      'Mùa hè đến, em thích nhất hoạt động gì (về quê, đi biển, học bơi)?',
      'Em đã được trải nghiệm những điều mới lạ nào?',
      'Cảm xúc của em sau kỳ nghỉ hè đó?'
    ],
    evaluationCriteria: [
      'Đúng dung lượng 3–5 câu',
      'Giọng văn rộn ràng, giàu năng lượng mùa hè'
    ],
    textbookRef: 'Tiếng Việt 2 Tập 2 - Bài Mùa hè vui vẻ',
    gradeMission: 'Em tập viết đoạn kể trải nghiệm',
    expectedLength: '3–5 câu'
  }
];

// ==========================================
// BÀI TẬP TIẾNG VIỆT LỚP 4 (GDPT 2018)
// Phương châm: "Em viết đoạn và bài văn theo thể loại" (Kể chuyện, Thuật lại sự việc, Miêu tả, Nêu ý kiến)
// ==========================================
export const GRADE_4_TASKS: WritingTask[] = [
  // Tập 1
  {
    id: 'g4-t1-01',
    grade: 4,
    volume: 1,
    week: 2,
    title: 'Kể lại một câu chuyện về lòng nhân ái em đã được nghe hoặc đọc',
    gardenType: 'ke_chuyen',
    genre: 'ke_chuyen',
    prompt: 'Viết một đoạn văn (hoặc bài văn ngắn) kể lại một câu chuyện cảm động về sự yêu thương, đùm bọc giữa con người với con người.',
    suggestedQuestions: [
      'Tên câu chuyện là gì và các nhân vật chính gồm những ai?',
      'Hoàn cảnh khó khăn của nhân vật ra sao và sự giúp đỡ đã diễn ra thế nào?',
      'Kết thúc câu chuyện mang lại bài học sâu sắc gì cho em?'
    ],
    evaluationCriteria: [
      'Kể đúng diễn biến câu chuyện có mở đầu, diễn biến, kết thúc',
      'Làm nổi bật hành động nhân ái',
      'Nêu cảm nghĩ và bài học rút ra'
    ],
    textbookRef: 'Tiếng Việt 4 Tập 1 - Bài Thương người như thể thương thân',
    gradeMission: 'Em kể chuyện theo cốt truyện',
    expectedLength: 'Đoạn văn 6–8 câu hoặc bài văn ngắn'
  },
  {
    id: 'g4-t1-02',
    grade: 4,
    volume: 1,
    week: 6,
    title: 'Thuật lại một tiết sinh hoạt dưới cờ trang nghiêm và bổ ích',
    gardenType: 'ke_chuyen',
    genre: 'ke_su_viec',
    prompt: 'Viết đoạn văn thuật lại một buổi lễ chào cờ đầu tuần ở trường em theo đúng trình tự thời gian.',
    suggestedQuestions: [
      'Buổi lễ chào cờ diễn ra vào sáng thứ mấy, thời tiết hôm đó ra sao?',
      'Không khí lúc hát Quốc ca và lắng nghe thầy cô nhận xét như thế nào?',
      'Hoạt động biểu diễn văn nghệ hoặc chuyên đề kỹ năng sống nào làm em ấn tượng nhất?'
    ],
    evaluationCriteria: [
      'Thuật lại theo trình tự thời gian trước - trong - sau buổi lễ',
      'Từ ngữ liên kết chuyển tiếp mạch lạc',
      'Thể hiện sự nghiêm trang và hào hứng'
    ],
    textbookRef: 'Tiếng Việt 4 Tập 1 - Bài Thuật lại sự việc',
    gradeMission: 'Em thuật lại sự việc theo trình tự',
    expectedLength: 'Đoạn văn 7–9 câu'
  },
  {
    id: 'g4-t1-03',
    grade: 4,
    volume: 1,
    week: 11,
    title: 'Viết bài văn tả một cây bóng mát che rợp sân trường',
    gardenType: 'sac_mau',
    genre: 'ta_canh_vat',
    prompt: 'Viết bài văn miêu tả một cây bóng mát (cây bàng, cây phượng vĩ hoặc cây đa) trên sân trường gắn với kỷ niệm của em.',
    suggestedQuestions: [
      'Cây bóng mát đứng ở vị trí nào trên sân trường? Nhìn từ xa cây trông như thế nào?',
      'Đến gần, gốc cây, thân cây, vỏ cây và tán lá xum xuê ra sao qua các mùa?',
      'Vào giờ ra chơi, cây che mát và che chở cho những trò chơi của các bạn học sinh như thế nào?',
      'Tình cảm gắn bó và ý thức chăm sóc cây xanh của em?'
    ],
    evaluationCriteria: [
      'Bố cục 3 phần rõ ràng: Mở bài, Thân bài (bao quát đến chi tiết), Kết bài',
      'Sử dụng các biện pháp nghệ thuật so sánh, nhân hóa sinh động',
      'Thể hiện cảm xúc chân thật với mái trường'
    ],
    textbookRef: 'Tiếng Việt 4 Tập 1 - Bài Miêu tả cây cối',
    gradeMission: 'Em viết bài văn miêu tả cây cối hoàn chỉnh',
    expectedLength: 'Bài văn 3 phần (12–15 câu)'
  },
  {
    id: 'g4-t1-04',
    grade: 4,
    volume: 1,
    week: 15,
    title: 'Viết đoạn văn nêu ý kiến về một nhân vật dũng cảm trong truyện',
    gardenType: 'y_kien',
    genre: 'y_kien_nhan_vat',
    prompt: 'Viết một đoạn văn nêu suy nghĩ, ý kiến của em về một nhân vật thiếu nhi dũng cảm (ví dụ: Kim Đồng, Vừ A Dính, Dế Mèn...).',
    suggestedQuestions: [
      'Nhân vật em muốn bày tỏ ý kiến là ai trong tác phẩm nào?',
      'Nhân vật có những hành động hoặc phẩm chất đáng khâm phục nào?',
      'Học tập nhân vật, em rèn luyện được điều gì cho chính mình?'
    ],
    evaluationCriteria: [
      'Có câu chủ đề khẳng định phẩm chất của nhân vật',
      'Đưa ra các dẫn chứng thuyết phục từ câu chuyện',
      'Khẳng định bài học cho bản thân'
    ],
    textbookRef: 'Tiếng Việt 4 Tập 1 - Bài Nêu ý kiến về nhân vật',
    gradeMission: 'Em viết đoạn văn nêu ý kiến lập luận',
    expectedLength: 'Đoạn văn 6–8 câu'
  },
  // Tập 2
  {
    id: 'g4-t2-01',
    grade: 4,
    volume: 2,
    week: 21,
    title: 'Viết bài văn tả một con vật nuôi có nhiều nét ngộ nghĩnh',
    gardenType: 'sac_mau',
    genre: 'ta_do_vat',
    prompt: 'Viết một bài văn miêu tả một con vật nuôi mà em quan sát kỹ (chú chó giữ nhà thông minh, chú mèo mướp bắt chuột giỏi...).',
    suggestedQuestions: [
      'Giới thiệu con vật em định tả (tên gọi, giống gì, sống ở đâu)?',
      'Tả ngoại hình: vóc dáng, bộ lông, đôi mắt, đôi tai, bốn chân...',
      'Tả hoạt động, thói quen và những cử chỉ đáng yêu khi gặp em?',
      'Tình cảm gắn bó giữa em và con vật nuôi?'
    ],
    evaluationCriteria: [
      'Có đủ mở bài, thân bài (ngoại hình + hoạt động), kết bài',
      'Hình ảnh gợi cảm, từ ngữ miêu tả phong phú',
      'Tình cảm yêu quý con vật'
    ],
    textbookRef: 'Tiếng Việt 4 Tập 2 - Bài Miêu tả con vật',
    gradeMission: 'Em viết bài văn tả con vật sinh động',
    expectedLength: 'Bài văn 3 phần hoàn chỉnh'
  },
  {
    id: 'g4-t2-02',
    grade: 4,
    volume: 2,
    week: 25,
    title: 'Viết đoạn văn nêu cảm nghĩ về một bài thơ ca ngợi tình mẫu tử',
    gardenType: 'yeu_thuong',
    genre: 'tinh_cam_cam_xuc',
    prompt: 'Viết một đoạn văn bày tỏ cảm xúc chân thành của em sau khi đọc một bài thơ ca ngợi tình yêu bao la của mẹ.',
    suggestedQuestions: [
      'Bài thơ mang lại cho em rung động sâu sắc nhất là bài thơ nào?',
      'Những hình ảnh thơ nào gợi sự hy sinh tảo tần của người mẹ?',
      'Đọc bài thơ, em thêm biết ơn và yêu thương mẹ như thế nào?'
    ],
    evaluationCriteria: [
      'Thể hiện cảm xúc sâu lắng, chân thành',
      'Biết trích dẫn hình ảnh đẹp trong thơ',
      'Câu văn giàu hình ảnh, nhịp điệu'
    ],
    textbookRef: 'Tiếng Việt 4 Tập 2 - Bài Cảm nghĩ về bài thơ',
    gradeMission: 'Em viết đoạn cảm thụ văn học',
    expectedLength: 'Đoạn văn 6–8 câu'
  },
  {
    id: 'g4-t2-03',
    grade: 4,
    volume: 2,
    week: 29,
    title: 'Viết bản hướng dẫn các bước làm một món đồ chơi tái chế',
    gardenType: 'cuoc_song',
    genre: 'ke_su_viec',
    prompt: 'Viết đoạn văn hoặc bản hướng dẫn ngắn gọn trình bày các bước làm một món đồ chơi từ chai nhựa hoặc giấy báo cũ.',
    suggestedQuestions: [
      'Tên món đồ chơi tái chế là gì?',
      'Cần chuẩn bị những nguyên liệu và dụng cụ gì?',
      'Các bước thực hiện (Bước 1, Bước 2, Bước 3) cụ thể ra sao?',
      'Lời khuyên khi chơi an toàn và bảo vệ môi trường?'
    ],
    evaluationCriteria: [
      'Các bước sắp xếp khoa học, dễ hiểu',
      'Dùng từ ngữ mệnh lệnh tích cực, chính xác',
      'Lan tỏa ý thức bảo vệ môi trường xanh'
    ],
    textbookRef: 'Tiếng Việt 4 Tập 2 - Bài Viết hướng dẫn',
    gradeMission: 'Em viết văn bản thông tin thực hành',
    expectedLength: 'Bản hướng dẫn 4–6 bước rõ ràng'
  },
  {
    id: 'g4-t2-04',
    grade: 4,
    volume: 2,
    week: 34,
    title: 'Viết bài văn tưởng tượng một cuộc gặp gỡ kỳ thú',
    gardenType: 'ke_chuyen',
    genre: 'sang_tao',
    prompt: 'Tưởng tượng em gặp lại một nhân vật hoạt hình hoặc bước vào vương quốc hoa cỏ trong một giấc mơ tuyệt đẹp.',
    suggestedQuestions: [
      'Cuộc gặp gỡ diễn ra trong hoàn cảnh kỳ diệu nào?',
      'Khung cảnh xứ sở thần tiên ra sao?',
      'Em và nhân vật đã trò chuyện hoặc cùng trải qua thử thách gì?',
      'Khi tỉnh giấc, cảm giác và suy nghĩ của em thế nào?'
    ],
    evaluationCriteria: [
      'Trí tưởng tượng phong phú, bất ngờ nhưng hợp lý',
      'Bố cục câu chuyện hấp dẫn',
      'Gửi gắm thông điệp trong sáng'
    ],
    textbookRef: 'Tiếng Việt 4 Tập 2 - Bài Kể chuyện tưởng tượng',
    gradeMission: 'Em viết truyện sáng tạo độc đáo',
    expectedLength: 'Bài văn 3 phần hoàn chỉnh'
  }
];

// ==========================================
// BÀI TẬP TIẾNG VIỆT LỚP 5 (GDPT 2018)
// Phương châm: "Em phát triển bài văn hoàn chỉnh" (Tả cảnh, Tả người, Nghị luận ý kiến, Sáng tạo)
// ==========================================
export const GRADE_5_TASKS: WritingTask[] = [
  // Tập 1
  {
    id: 'g5-t1-01',
    grade: 5,
    volume: 1,
    week: 3,
    title: 'Viết bài văn tả cảnh buổi sáng bình minh trên quê hương em',
    gardenType: 'sac_mau',
    genre: 'ta_canh_vat',
    prompt: 'Viết bài văn miêu tả cảnh bình minh đang lên (trên cánh đồng lúa chín, trên dòng sông hoặc trên góc phố thân quen nơi em sống).',
    suggestedQuestions: [
      'Khung cảnh đất trời lúc tờ mờ sáng khi mặt trời chưa ló dạng?',
      'Khoảnh khắc vầng đông ửng hồng, những tia nắng vàng rực rỡ đầu tiên chiếu rọi xuống?',
      'Âm thanh, màu sắc, cảnh vật và nhịp sống con người bắt đầu ngày mới như thế nào?',
      'Cảm xúc say mê và niềm tự hào của em trước vẻ đẹp quê hương?'
    ],
    evaluationCriteria: [
      'Quan sát cảnh vật theo trình tự thời gian chuyển biến tinh tế',
      'Vốn từ miêu tả phong phú, đa giác quan (thị giác, thính giác, khứu giác)',
      'Bố cục 3 phần chặt chẽ, mở bài - thân bài - kết bài sâu sắc'
    ],
    textbookRef: 'Tiếng Việt 5 Tập 1 - Bài Miêu tả phong cảnh',
    gradeMission: 'Em viết bài văn tả cảnh hoàn chỉnh',
    expectedLength: 'Bài văn 3 phần (15–20 câu)'
  },
  {
    id: 'g5-t1-02',
    grade: 5,
    volume: 1,
    week: 7,
    title: 'Viết bài văn tả một người thân đang say sưa làm việc',
    gardenType: 'sac_mau',
    genre: 'ta_nguoi',
    prompt: 'Viết bài văn tả hình dáng và hành động của một người thân (mẹ nấu ăn, bố làm thợ mộc/sửa xe, bà đan áo, ông tỉa cây...).',
    suggestedQuestions: [
      'Người em muốn tả là ai và đang làm công việc gì?',
      'Ngoại hình khi làm việc: ánh mắt tập trung, giọt mồ hôi, đôi bàn tay thoăn thoắt khéo léo?',
      'Từng thao tác của người đó diễn ra tuần tự và thành thạo ra sao?',
      'Tình yêu thương, sự trân trọng công lao lao động của người thân?'
    ],
    evaluationCriteria: [
      'Kết hợp tả ngoại hình với các hành động, cử chỉ sinh động',
      'Từ ngữ gợi cảm xúc chân thật, ấm áp',
      'Làm toát lên vẻ đẹp của sự cần cù, chăm chỉ'
    ],
    textbookRef: 'Tiếng Việt 5 Tập 1 - Bài Tả người trong hoạt động',
    gradeMission: 'Em viết bài văn tả người hoàn chỉnh',
    expectedLength: 'Bài văn 3 phần (15–20 câu)'
  },
  {
    id: 'g5-t1-03',
    grade: 5,
    volume: 1,
    week: 12,
    title: 'Viết đoạn văn thể hiện ý kiến về việc bảo vệ nguồn nước sạch',
    gardenType: 'y_kien',
    genre: 'y_kien_nhan_vat',
    prompt: 'Viết một đoạn văn nghị luận bày tỏ quan điểm của em về trách nhiệm giữ gìn và tiết kiệm nguồn nước sạch tại trường học và gia đình.',
    suggestedQuestions: [
      'Nước sạch có vai trò sống còn như thế nào đối với cuộc sống con người?',
      'Thực trạng lãng phí hoặc làm ô nhiễm nước ngọt hiện nay diễn ra ra sao?',
      'Mỗi học sinh chúng ta cần hành động thiết thực gì mỗi ngày?',
      'Thông điệp em muốn gửi gắm tới cộng đồng?'
    ],
    evaluationCriteria: [
      'Luận điểm rõ ràng, lập luận chặt chẽ',
      'Dẫn chứng thực tế và hành động cụ thể',
      'Lời văn thuyết phục, truyền cảm hứng'
    ],
    textbookRef: 'Tiếng Việt 5 Tập 1 - Bài Nêu ý kiến về một vấn đề đời sống',
    gradeMission: 'Em viết đoạn văn nghị luận sắc sảo',
    expectedLength: 'Đoạn văn 8–10 câu'
  },
  {
    id: 'g5-t1-04',
    grade: 5,
    volume: 1,
    week: 16,
    title: 'Viết bài văn kể lại một kỷ niệm cảm động về tình thầy trò',
    gardenType: 'ke_chuyen',
    genre: 'ke_su_viec',
    prompt: 'Viết bài văn kể lại một kỷ niệm sâu sắc giữa em và một thầy giáo hoặc cô giáo đã dạy dỗ, nâng đỡ em tiến bộ.',
    suggestedQuestions: [
      'Kỷ niệm đó xảy ra vào năm học lớp mấy, trong hoàn cảnh đặc biệt nào?',
      'Thầy cô đã có hành động, ánh mắt hoặc lời dặn dò ân cần gì khiến em nhớ mãi?',
      'Nhờ có sự động viên đó, em đã thay đổi và trưởng thành ra sao?',
      'Lòng biết ơn sâu nặng em muốn khắc ghi trong tim?'
    ],
    evaluationCriteria: [
      'Cốt truyện có cao trào, diễn biến tự nhiên, xúc động',
      'Khắc họa chân dung người thầy mẫu mực',
      'Cảm xúc lắng đọng, chân thực'
    ],
    textbookRef: 'Tiếng Việt 5 Tập 1 - Bài Kể chuyện kỷ niệm',
    gradeMission: 'Em viết bài văn kể chuyện giàu cảm xúc',
    expectedLength: 'Bài văn 3 phần hoàn chỉnh'
  },
  // Tập 2
  {
    id: 'g5-t2-01',
    grade: 5,
    volume: 2,
    week: 22,
    title: 'Viết bài văn tả cảnh một đêm trăng rằm tuyệt đẹp',
    gardenType: 'sac_mau',
    genre: 'ta_canh_vat',
    prompt: 'Viết bài văn miêu tả vẻ đẹp huyền ảo của đêm trăng rằm (ở làng quê êm ả hoặc trên sân thượng ngắm phố xá lung linh).',
    suggestedQuestions: [
      'Trời bắt đầu tối, vầng trăng từ từ nhô lên như thế nào?',
      'Ánh trăng vàng dịu dàng chiếu rọi xuống mái nhà, cành lá, mặt nước ra sao?',
      'Cảnh vật thiên nhiên và con người cùng thưởng trăng, trò chuyện thế nào?',
      'Cảm xúc yên bình, thơ mộng của em trong đêm trăng?'
    ],
    evaluationCriteria: [
      'Ngôn ngữ giàu chất thơ, có nhiều hình ảnh liên tưởng độc đáo',
      'Quan sát tinh tế từ mặt đất lên bầu trời',
      'Bố cục cân đối, hài hòa'
    ],
    textbookRef: 'Tiếng Việt 5 Tập 2 - Bài Cảnh đẹp thiên nhiên',
    gradeMission: 'Em viết bài văn tả cảnh thơ mộng',
    expectedLength: 'Bài văn 3 phần (15–20 câu)'
  },
  {
    id: 'g5-t2-02',
    grade: 5,
    volume: 2,
    week: 26,
    title: 'Viết bài văn tả một người lao động em luôn cảm phục',
    gardenType: 'sac_mau',
    genre: 'ta_nguoi',
    prompt: 'Viết bài văn miêu tả người lao động bình dị (bác lao công quét rác trong đêm, chú công an giao thông đội mưa, cô y tá dịu hiền...).',
    suggestedQuestions: [
      'Người lao động em muốn tả là ai? Làm công việc gì?',
      'Hình ảnh người đó trong hoàn cảnh làm việc vất vả ra sao?',
      'Nụ cười, tinh thần trách nhiệm và đức tính cao quý của họ?',
      'Lòng biết ơn và sự kính trọng của em đối với những cống hiến thầm lặng?'
    ],
    evaluationCriteria: [
      'Tả ngoại hình gắn liền với tính chất công việc',
      'Nhấn mạnh tinh thần trách nhiệm và lòng yêu nghề',
      'Lời văn giàu tính nhân văn'
    ],
    textbookRef: 'Tiếng Việt 5 Tập 2 - Bài Người lao động quanh em',
    gradeMission: 'Em viết bài văn tả người lao động',
    expectedLength: 'Bài văn 3 phần hoàn chỉnh'
  },
  {
    id: 'g5-t2-03',
    grade: 5,
    volume: 2,
    week: 31,
    title: 'Viết đoạn văn bày tỏ quan điểm về thói quen đọc sách mỗi ngày',
    gardenType: 'y_kien',
    genre: 'y_kien_nhan_vat',
    prompt: 'Viết đoạn văn từ 8–10 câu khẳng định ý nghĩa to lớn của việc đọc sách mỗi ngày đối với lứa tuổi học sinh.',
    suggestedQuestions: [
      'Sách mang lại những kho tàng tri thức và bồi đắp tâm hồn như thế nào?',
      'Những bạn ít đọc sách thường gặp phải những khó khăn gì về vốn từ và hiểu biết?',
      'Mỗi ngày dành 30 phút đọc sách đem lại sự biến đổi tích cực gì?',
      'Lời kêu gọi các bạn cùng xây dựng văn hóa đọc?'
    ],
    evaluationCriteria: [
      'Lý lẽ xác đáng, lập luận sắc bén',
      'Có dẫn chứng cụ thể từ trải nghiệm đọc sách',
      'Giọng văn hùng hồn, thuyết phục'
    ],
    textbookRef: 'Tiếng Việt 5 Tập 2 - Bài Sách và cuộc sống',
    gradeMission: 'Em viết đoạn văn nghị luận tư duy cao',
    expectedLength: 'Đoạn văn 8–10 câu'
  },
  {
    id: 'g5-t2-04',
    grade: 5,
    volume: 2,
    week: 35,
    title: 'Viết bài văn chia tay mái trường tiểu học thân yêu',
    gardenType: 'yeu_thuong',
    genre: 'tinh_cam_cam_xuc',
    prompt: 'Viết bài văn bày tỏ những tâm tư, kỷ niệm và lòng biết ơn sâu nặng với mái trường tiểu học trong những ngày chuẩn bị tốt nghiệp.',
    suggestedQuestions: [
      'Những góc nhỏ nào của ngôi trường làm em bồi hồi nhất khi nhìn lại (lớp học, hàng cây, bục giảng)?',
      'Nhớ lại ngày đầu tiên bỡ ngỡ vào lớp 1 so với sự trưởng thành hôm nay của em?',
      'Lời tri ân sâu sắc gửi thầy cô và lời hẹn ước cùng bè bạn?',
      'Hành trang em mang theo khi bước vào cấp Trung học cơ sở?'
    ],
    evaluationCriteria: [
      'Bày tỏ cảm xúc bồi hồi, tha thiết nhưng lạc quan',
      'Kỷ niệm chọn lọc, tiêu biểu',
      'Bố cục trọn vẹn, lời văn truyền cảm sâu sắc'
    ],
    textbookRef: 'Tiếng Việt 5 Tập 2 - Bài Mái trường mến yêu',
    gradeMission: 'Em viết bài văn tri ân ngày tốt nghiệp',
    expectedLength: 'Bài văn 3 phần hoàn chỉnh'
  }
];
