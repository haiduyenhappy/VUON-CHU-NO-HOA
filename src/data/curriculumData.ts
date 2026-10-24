import { WritingTask, GardenType } from '../types';
import { GRADE_1_TASKS, GRADE_2_TASKS, GRADE_4_TASKS, GRADE_5_TASKS } from './curriculumTasksByGrade';

export const GARDEN_INFOS: Record<GardenType, { name: string; icon: string; description: string; color: string; bgLight: string; border: string }> = {
  ke_chuyen: {
    name: 'Vườn kể chuyện',
    icon: '📖',
    description: 'Kể lại các sự việc, hoạt động và trải nghiệm đáng nhớ của em.',
    color: 'text-amber-700',
    bgLight: 'bg-amber-50',
    border: 'border-amber-300'
  },
  yeu_thuong: {
    name: 'Vườn yêu thương',
    icon: '💖',
    description: 'Bày tỏ tình cảm, cảm xúc ấm áp với người thân, thầy cô và bạn bè.',
    color: 'text-rose-700',
    bgLight: 'bg-rose-50',
    border: 'border-rose-300'
  },
  sac_mau: {
    name: 'Vườn sắc màu',
    icon: '🎨',
    description: 'Miêu tả đồ vật thân quen, ngôi nhà ấm cúng và cảnh vật tươi đẹp.',
    color: 'text-emerald-700',
    bgLight: 'bg-emerald-50',
    border: 'border-emerald-300'
  },
  y_kien: {
    name: 'Vườn ý kiến',
    icon: '💡',
    description: 'Nêu suy nghĩ, góc nhìn và cảm nhận của em về nhân vật, việc làm.',
    color: 'text-purple-700',
    bgLight: 'bg-purple-50',
    border: 'border-purple-300'
  },
  cuoc_song: {
    name: 'Vườn cuộc sống',
    icon: '📬',
    description: 'Viết tin nhắn, lá thư, thông báo, bản tin và phiếu đọc sách bổ ích.',
    color: 'text-sky-700',
    bgLight: 'bg-sky-50',
    border: 'border-sky-300'
  }
};

const RAW_GRADE_3_TASKS: WritingTask[] = [
  // ===================== TẬP 1 (15 nhiệm vụ) =====================
  {
    id: 'tap1-01',
    volume: 1,
    week: 1,
    title: 'Kể lại một hoạt động đã làm cùng người thân',
    gardenType: 'ke_chuyen',
    prompt: 'Kể lại một hoạt động vui vẻ hoặc ý nghĩa mà em đã làm cùng bố, mẹ, ông bà hoặc anh chị em.',
    suggestedQuestions: [
      'Em đã làm việc gì cùng người thân (nấu cơm, trồng cây, đi dạo, dọn dẹp...)?',
      'Hoạt động đó diễn ra vào lúc nào và ở đâu?',
      'Em và người thân đã cùng làm những việc gì cụ thể?',
      'Sau khi làm xong, em cảm thấy như thế nào?'
    ],
    evaluationCriteria: [
      'Nêu rõ hoạt động và người cùng tham gia',
      'Kể lại diễn biến các bước theo trình tự',
      'Bày tỏ cảm xúc vui vẻ, gắn bó'
    ],
    textbookRef: 'Tiếng Việt 3 Tập 1 - Bài 1'
  },
  {
    id: 'tap1-02',
    volume: 1,
    week: 2,
    title: 'Viết 2–3 câu thể hiện tình cảm với một người bạn',
    gardenType: 'yeu_thuong',
    prompt: 'Viết 2–3 câu ngắn gọn thể hiện tình cảm quý mến, sự gắn bó của em với một người bạn thân ở lớp hoặc gần nhà.',
    suggestedQuestions: [
      'Bạn của em tên là gì? Hai bạn quen nhau bao lâu rồi?',
      'Bạn có tính cách hoặc điểm gì khiến em yêu quý nhất?',
      'Em muốn gửi gắm lời chúc hay tình cảm gì tới bạn?'
    ],
    evaluationCriteria: [
      'Đúng dung lượng 2–3 câu hoàn chỉnh',
      'Từ ngữ chân thành, giàu cảm xúc bạn bè',
      'Đầu câu viết hoa, cuối câu có dấu chấm'
    ],
    textbookRef: 'Tiếng Việt 3 Tập 1 - Bài 2'
  },
  {
    id: 'tap1-03',
    volume: 1,
    week: 3,
    title: 'Viết đoạn văn nêu tình cảm, cảm xúc với người em yêu quý',
    gardenType: 'yeu_thuong',
    prompt: 'Viết một đoạn văn (4–5 câu) nêu tình cảm, cảm xúc yêu mến và lòng biết ơn của em đối với một người thân hoặc thầy cô giáo.',
    suggestedQuestions: [
      'Người em muốn viết về là ai (ông bà, bố mẹ, thầy cô)?',
      'Người đó có đặc điểm dịu dàng hay kỷ niệm nào làm em nhớ nhất?',
      'Khi ở bên người đó, em cảm thấy ấm áp như thế nào?',
      'Em muốn hứa hoặc làm điều gì để người đó vui lòng?'
    ],
    evaluationCriteria: [
      'Có câu mở đoạn giới thiệu người thân yêu',
      'Có chi tiết, hành động cụ thể thể hiện tình cảm',
      'Câu kết bày tỏ cảm xúc sâu sắc và lời hứa'
    ],
    textbookRef: 'Tiếng Việt 3 Tập 1 - Bài 3'
  },
  {
    id: 'tap1-04',
    volume: 1,
    week: 4,
    title: 'Viết đoạn văn giới thiệu bản thân',
    gardenType: 'ke_chuyen',
    prompt: 'Viết một đoạn văn giới thiệu về bản thân em: họ tên, sở thích, ước mơ và một điểm đặc biệt của mình.',
    suggestedQuestions: [
      'Em tên là gì, học lớp nào, trường nào?',
      'Em có sở thích gì đặc biệt (vẽ tranh, đọc sách, đá bóng...)?',
      'Tính cách của em như thế nào?',
      'Ước mơ khi lớn lên của em là gì?'
    ],
    evaluationCriteria: [
      'Thông tin rõ ràng, tự tin',
      'Nêu được nét riêng biệt đáng yêu của bản thân',
      'Dùng từ tự nhiên, đúng ngữ pháp'
    ],
    textbookRef: 'Tiếng Việt 3 Tập 1 - Bài 4'
  },
  {
    id: 'tap1-05',
    volume: 1,
    week: 6,
    title: 'Viết đoạn văn về một ngôi trường em yêu quý',
    gardenType: 'sac_mau',
    prompt: 'Viết một đoạn văn tả ngôi trường tiểu học của em hoặc một góc sân trường mà em yêu thích nhất.',
    suggestedQuestions: [
      'Trường của em tên là gì? Trường nằm ở đâu?',
      'Khu vực nào ở trường em thích nhất (hàng cây râm mát, thư viện, sân chơi)?',
      'Vào giờ ra chơi, khung cảnh nơi ấy rộn ràng ra sao?',
      'Tình cảm gắn bó của em với mái trường thân yêu này như thế nào?'
    ],
    evaluationCriteria: [
      'Tả được nét nổi bật của trường hoặc góc sân trường',
      'Có hình ảnh sinh động và cảm nhận chân thực',
      'Thể hiện tình yêu mái trường'
    ],
    textbookRef: 'Tiếng Việt 3 Tập 1 - Bài 6'
  },
  {
    id: 'tap1-06',
    volume: 1,
    week: 8,
    title: 'Kể về một ngày ở trường',
    gardenType: 'ke_chuyen',
    prompt: 'Kể lại những hoạt động thú vị, đáng nhớ trong một ngày em đi học ở trường.',
    suggestedQuestions: [
      'Buổi sáng khi bước vào lớp, em gặp ai và cảm thấy thế nào?',
      'Trong các tiết học và giờ ra chơi, có hoạt động nào làm em hào hứng?',
      'Cuối ngày khi tan học, tâm trạng của em ra sao?'
    ],
    evaluationCriteria: [
      'Trình tự thời gian hợp lý (sáng, trưa, chiều)',
      'Chọn lọc được hoạt động ấn tượng nhất',
      'Diễn đạt trong sáng, mạch lạc'
    ],
    textbookRef: 'Tiếng Việt 3 Tập 1 - Bài 8'
  },
  {
    id: 'tap1-07',
    volume: 1,
    week: 10,
    title: 'Viết đoạn văn tả một đồ vật trong nhà hoặc lớp học',
    gardenType: 'sac_mau',
    prompt: 'Chọn một đồ vật gần gũi (hộp bút, chiếc cặp, đồng hồ, bảng lớp...) và viết đoạn văn miêu tả đặc điểm cùng ích lợi của nó.',
    suggestedQuestions: [
      'Đồ vật em chọn là gì? Ai đã mua hoặc tặng cho em?',
      'Đồ vật đó có hình dáng, màu sắc và chất liệu như thế nào?',
      'Nó giúp ích gì cho việc học hoặc sinh hoạt của em?',
      'Em giữ gìn đồ vật đó cẩn thận ra sao?'
    ],
    evaluationCriteria: [
      'Quan sát tinh tế về hình dáng, màu sắc',
      'Nêu được công dụng và sự gắn bó',
      'Có từ ngữ gợi hình gợi cảm'
    ],
    textbookRef: 'Tiếng Việt 3 Tập 1 - Bài 10'
  },
  {
    id: 'tap1-08',
    volume: 1,
    week: 12,
    title: 'Viết đoạn văn tả ngôi nhà của em',
    gardenType: 'sac_mau',
    prompt: 'Viết đoạn văn tả ngôi nhà ấm cúng của gia đình em hoặc một góc nhỏ em yêu thích nhất trong nhà.',
    suggestedQuestions: [
      'Ngôi nhà của em trông như thế nào từ bên ngoài?',
      'Bên trong nhà có những góc quen thuộc nào (phòng khách ấm cúng, góc học tập bên cửa sổ)?',
      'Điều gì ở ngôi nhà khiến em cảm thấy bình yên và ấm áp nhất?'
    ],
    evaluationCriteria: [
      'Nêu được nét nổi bật, ấm áp của tổ ấm',
      'Dùng từ gợi cảm xúc yêu thương gia đình',
      'Bố cục câu gọn gàng, rõ ràng'
    ],
    textbookRef: 'Tiếng Việt 3 Tập 1 - Bài 12'
  },
  {
    id: 'tap1-09',
    volume: 1,
    week: 13,
    title: 'Viết đoạn văn nêu tình cảm, cảm xúc với người thân',
    gardenType: 'yeu_thuong',
    prompt: 'Viết một đoạn văn bày tỏ tình yêu thương sâu sắc, sự kính trọng của em với ông, bà, cha hoặc mẹ.',
    suggestedQuestions: [
      'Người thân em muốn viết về là ai?',
      'Hằng ngày, người đó chăm sóc hoặc dạy bảo em điều gì?',
      'Một cử chỉ dịu dàng nào của người đó làm em nhớ mãi?',
      'Em mong ước điều gì cho người thân yêu của mình?'
    ],
    evaluationCriteria: [
      'Cảm xúc chân thật, tự nhiên',
      'Có kỷ niệm hoặc cử chỉ chăm sóc cụ thể',
      'Lời văn tha thiết, giàu tình cảm'
    ],
    textbookRef: 'Tiếng Việt 3 Tập 1 - Bài 13'
  },
  {
    id: 'tap1-10',
    volume: 1,
    week: 14,
    title: 'Viết đoạn văn nêu lí do thích hoặc không thích một nhân vật',
    gardenType: 'y_kien',
    prompt: 'Chọn một nhân vật trong câu chuyện em đã học hoặc đã đọc, nêu rõ lí do vì sao em yêu thích hoặc không thích nhân vật đó.',
    suggestedQuestions: [
      'Nhân vật em chọn tên là gì, trong câu chuyện nào?',
      'Nhân vật đó có phẩm chất hoặc hành động nào đặc biệt?',
      'Vì sao chi tiết đó khiến em thích hoặc không thích?',
      'Nhân vật đó để lại cho em bài học quý giá gì?'
    ],
    evaluationCriteria: [
      'Nêu rõ tên nhân vật và tác phẩm',
      'Đưa ra lí lẽ và dẫn chứng hành động cụ thể',
      'Bày tỏ thái độ, suy nghĩ rõ ràng'
    ],
    textbookRef: 'Tiếng Việt 3 Tập 1 - Bài 14'
  },
  {
    id: 'tap1-11',
    volume: 1,
    week: 15,
    title: 'Viết những câu giới thiệu bức tranh do em vẽ',
    gardenType: 'sac_mau',
    prompt: 'Viết 3–4 câu giới thiệu về bức tranh em tự vẽ: chủ đề bức tranh, màu sắc và cảm xúc của em khi vẽ.',
    suggestedQuestions: [
      'Bức tranh của em vẽ về cảnh gì hoặc ai?',
      'Em đã dùng những màu sắc nào nổi bật?',
      'Chi tiết nào trong tranh làm em tâm đắc nhất?',
      'Em muốn gửi gắm thông điệp gì qua bức tranh này?'
    ],
    evaluationCriteria: [
      'Giới thiệu nội dung bức tranh rõ ràng',
      'Miêu tả màu sắc và đường nét sinh động',
      'Thể hiện niềm tự hào sáng tạo'
    ],
    textbookRef: 'Tiếng Việt 3 Tập 1 - Bài 15'
  },
  {
    id: 'tap1-12',
    volume: 1,
    week: 16,
    title: 'Viết một tin nhắn ngắn cho người thân hoặc bạn',
    gardenType: 'cuoc_song',
    prompt: 'Viết một mẩu tin nhắn ngắn gửi cho bố mẹ hoặc bạn khi em có việc cần thông báo hoặc dặn dò.',
    suggestedQuestions: [
      'Em gửi tin nhắn cho ai?',
      'Lí do em nhắn tin là gì (xin phép qua nhà bạn học nhóm, dặn dò đồ dùng...)?',
      'Thời gian và nội dung chính em muốn nhắn là gì?',
      'Lời chào và ký tên của em ra sao?'
    ],
    evaluationCriteria: [
      'Đúng quy cách mẩu tin nhắn ngắn',
      'Nội dung ngắn gọn, súc tích, đủ thông tin',
      'Lời nhắn lễ phép, lịch sự'
    ],
    textbookRef: 'Tiếng Việt 3 Tập 1 - Bài 16'
  },
  {
    id: 'tap1-13',
    volume: 1,
    week: 17,
    title: 'Viết thông báo của lớp theo tình huống',
    gardenType: 'cuoc_song',
    prompt: 'Viết một bản thông báo ngắn cho các bạn trong lớp về buổi dọn vệ sinh lớp học hoặc kế hoạch quyên góp sách.',
    suggestedQuestions: [
      'Thông báo gửi tới ai và do ai viết?',
      'Nội dung hoạt động là gì, diễn ra vào thời gian nào, ở đâu?',
      'Các bạn cần chuẩn bị những gì?',
      'Lời kêu gọi tham gia nhiệt tình của lớp?'
    ],
    evaluationCriteria: [
      'Có tiêu đề thông báo rõ ràng',
      'Đầy đủ thời gian, địa điểm, nội dung yêu cầu',
      'Cách trình bày khoa học, dễ đọc'
    ],
    textbookRef: 'Tiếng Việt 3 Tập 1 - Bài 17'
  },
  {
    id: 'tap1-14',
    volume: 1,
    week: 18,
    title: 'Viết thư cho người thân hoặc bạn ở xa',
    gardenType: 'cuoc_song',
    prompt: 'Viết một bức thư ngắn thăm hỏi ông bà hoặc một người bạn thân chuyển trường đi xa.',
    suggestedQuestions: [
      'Mở đầu: Địa điểm, ngày tháng và lời chào thân mật?',
      'Thăm hỏi: Em muốn hỏi thăm sức khỏe và công việc của người nhận như thế nào?',
      'Kể chuyện: Em muốn kể về việc học tập, sinh hoạt của mình ra sao?',
      'Lời chúc và lời hứa hẹn ở cuối thư?'
    ],
    evaluationCriteria: [
      'Đầy đủ các phần của một lá thư',
      'Lời lẽ thân thương, ấm áp',
      'Cách xưng hô phù hợp với người nhận'
    ],
    textbookRef: 'Tiếng Việt 3 Tập 1 - Bài 18'
  },
  {
    id: 'tap1-15',
    volume: 1,
    week: 18,
    title: 'Viết phiếu đọc sách theo mẫu',
    gardenType: 'cuoc_song',
    prompt: 'Hoàn thành phiếu đọc sách sau khi đọc xong một câu chuyện hoặc bài thơ thiếu nhi hay.',
    suggestedQuestions: [
      'Tên cuốn sách hoặc bài thơ là gì, tác giả là ai?',
      'Nhân vật hoặc hình ảnh nào em thấy ấn tượng nhất?',
      'Em học được điều gì hay hoặc câu văn nào em thích nhất?',
      'Em chấm cho cuốn sách mấy ngôi sao?'
    ],
    evaluationCriteria: [
      'Ghi đúng tên sách, tác giả, nhân vật chính',
      'Nêu cảm nhận ngắn gọn, sâu sắc',
      'Trình bày gọn gàng, sạch đẹp'
    ],
    textbookRef: 'Tiếng Việt 3 Tập 1 - Bài Ôn tập'
  },

  // ===================== TẬP 2 (17 nhiệm vụ) =====================
  {
    id: 'tap2-01',
    volume: 2,
    week: 19,
    title: 'Kể lại một hoạt động ngoài trời đã tham gia hoặc chứng kiến',
    gardenType: 'ke_chuyen',
    prompt: 'Kể lại một buổi cắm trại, ngày hội thể thao hoặc hoạt động trồng cây ngoài trời mà em cảm thấy thích thú.',
    suggestedQuestions: [
      'Hoạt động ngoài trời đó là gì? Diễn ra ở đâu và có những ai?',
      'Không khí xung quanh lúc ấy sôi nổi ra sao?',
      'Em đã tham gia những trò chơi hoặc việc làm gì?',
      'Cảm giác của em sau buổi hoạt động đó thế nào?'
    ],
    evaluationCriteria: [
      'Mô tả được bầu không khí ngoài trời tươi vui',
      'Kể diễn biến hoạt động sinh động',
      'Bộc lộ niềm hứng khởi tuổi thơ'
    ],
    textbookRef: 'Tiếng Việt 3 Tập 2 - Bài 19'
  },
  {
    id: 'tap2-02',
    volume: 2,
    week: 20,
    title: 'Kể hoạt động của các bạn nhỏ theo tranh',
    gardenType: 'ke_chuyen',
    prompt: 'Quan sát một bức tranh thiếu nhi vui chơi, lao động và kể lại các hoạt động của từng nhóm bạn nhỏ trong tranh.',
    suggestedQuestions: [
      'Bức tranh vẽ khung cảnh ở đâu (công viên, sân trường, bãi biển)?',
      'Mỗi bạn nhỏ trong tranh đang làm gì (thả diều, tưới hoa, đọc truyện)?',
      'Nét mặt, nụ cười của các bạn ra sao?',
      'Bức tranh mang lại cho em cảm xúc gì?'
    ],
    evaluationCriteria: [
      'Quan sát kỹ các chi tiết trong tranh',
      'Dùng từ chỉ hoạt động chính xác, phong phú',
      'Liên kết các câu kể nhịp nhàng'
    ],
    textbookRef: 'Tiếng Việt 3 Tập 2 - Bài 20'
  },
  {
    id: 'tap2-03',
    volume: 2,
    week: 21,
    title: 'Viết đoạn văn nêu tình cảm, cảm xúc về cảnh vật',
    gardenType: 'yeu_thuong',
    prompt: 'Viết một đoạn văn bày tỏ niềm xúc động, tình yêu của em trước một cảnh bình minh, hoàng hôn hoặc một đêm trăng đẹp.',
    suggestedQuestions: [
      'Cảnh vật em được ngắm là lúc nào, ở đâu?',
      'Màu sắc của bầu trời, ánh nắng hay ánh trăng lúc ấy như thế nào?',
      'Cảnh vật mang lại cho tâm hồn em cảm giác gì (bình yên, rộn rã, ngỡ ngàng)?',
      'Em yêu thiên nhiên quanh mình ra sao?'
    ],
    evaluationCriteria: [
      'Có hình ảnh so sánh hoặc từ ngữ giàu chất thơ',
      'Bộc lộ cảm xúc chân thành với thiên nhiên',
      'Kết đoạn lắng đọng tình cảm'
    ],
    textbookRef: 'Tiếng Việt 3 Tập 2 - Bài 21'
  },
  {
    id: 'tap2-04',
    volume: 2,
    week: 22,
    title: 'Viết đoạn văn về một cảnh vật em yêu thích',
    gardenType: 'sac_mau',
    prompt: 'Miêu tả một cảnh đẹp mà em yêu thích (vườn hoa xuân, cánh đồng lúa chín, bãi biển xanh hoặc dòng sông quê hương).',
    suggestedQuestions: [
      'Cảnh đẹp em muốn tả là cảnh nào?',
      'Vào thời điểm đẹp nhất, cảnh vật hiện lên với những màu sắc, âm thanh gì?',
      'Có chi tiết nào khiến em nhớ mãi không quên?',
      'Em có mong muốn gì đối với cảnh đẹp ấy?'
    ],
    evaluationCriteria: [
      'Miêu tả bằng nhiều giác quan (mắt thấy, tai nghe, mũi ngửi hương thơm)',
      'Sử dụng biện pháp tu từ đơn giản phù hợp lớp 3',
      'Tình cảm gắn bó với cảnh vật'
    ],
    textbookRef: 'Tiếng Việt 3 Tập 2 - Bài 22'
  },
  {
    id: 'tap2-05',
    volume: 2,
    week: 23,
    title: 'Viết lí do thích hoặc không thích nhân vật trong câu chuyện',
    gardenType: 'y_kien',
    prompt: 'Nêu suy nghĩ và lí do vì sao em đồng tình hoặc không đồng tình với cách ứng xử của một nhân vật cổ tích hoặc hiện đại.',
    suggestedQuestions: [
      'Nhân vật em muốn bàn luận là ai trong câu chuyện nào?',
      'Nhân vật đó đã có hành động hoặc quyết định gì?',
      'Em thấy hành động đó đáng khen hay đáng phê phán? Vì sao?',
      'Nếu là nhân vật ấy, em sẽ làm như thế nào?'
    ],
    evaluationCriteria: [
      'Lập luận rõ ràng, có dẫn chứng cụ thể trong truyện',
      'Thể hiện sự phân biệt đúng - sai lành mạnh',
      'Lời văn chững chạc, thuyết phục'
    ],
    textbookRef: 'Tiếng Việt 3 Tập 2 - Bài 23'
  },
  {
    id: 'tap2-06',
    volume: 2,
    week: 24,
    title: 'Viết đoạn văn về ước mơ của em',
    gardenType: 'yeu_thuong',
    prompt: 'Chia sẻ ước mơ tương lai của em (trở thành bác sĩ, phi công, cô giáo, họa sĩ...) và những điều em sẽ làm để biến ước mơ thành hiện thực.',
    suggestedQuestions: [
      'Ước mơ lớn lên của em là làm nghề gì?',
      'Vì sao em lại ấp ủ ước mơ tươi đẹp ấy?',
      'Khi làm công việc đó, em sẽ giúp đỡ mọi người như thế nào?',
      'Ngay từ bây giờ ở trường lớp, em đang rèn luyện chăm chỉ ra sao?'
    ],
    evaluationCriteria: [
      'Ước mơ trong sáng, giàu ý nghĩa nhân văn',
      'Nêu được hành động cụ thể để vươn tới ước mơ',
      'Giọng văn hào hứng, tràn đầy niềm tin'
    ],
    textbookRef: 'Tiếng Việt 3 Tập 2 - Bài 24'
  },
  {
    id: 'tap2-07',
    volume: 2,
    week: 25,
    title: 'Viết cảm xúc về cảnh vật trong bài đọc',
    gardenType: 'yeu_thuong',
    prompt: 'Nêu cảm nghĩ của em sau khi đọc một bài thơ hoặc bài tập đọc ca ngợi vẻ đẹp non sông, đất nước.',
    suggestedQuestions: [
      'Bài đọc em vừa học có tên là gì?',
      'Hình ảnh thiên nhiên nào trong bài làm em rung động nhất?',
      'Những từ ngữ nào làm em thấy đất nước mình thật tươi đẹp?',
      'Cảm xúc tự hào dâng lên trong em như thế nào?'
    ],
    evaluationCriteria: [
      'Bám sát chi tiết của bài đọc đã học',
      'Nêu cảm nhận cá nhân sâu sắc',
      'Từ ngữ trong sáng, biểu cảm tốt'
    ],
    textbookRef: 'Tiếng Việt 3 Tập 2 - Bài 25'
  },
  {
    id: 'tap2-08',
    volume: 2,
    week: 26,
    title: 'Viết đoạn văn về nhân vật em yêu thích',
    gardenType: 'y_kien',
    prompt: 'Viết đoạn văn bày tỏ lòng ngưỡng mộ với một nhân vật lịch sử, anh hùng nhỏ tuổi hoặc nhân vật gương người tốt việc tốt.',
    suggestedQuestions: [
      'Ai là nhân vật truyền cảm hứng mạnh mẽ cho em?',
      'Nhân vật ấy có đức tính dũng cảm hay nhân hậu nào nổi bật?',
      'Em học tập được điều gì từ tấm gương sáng của nhân vật đó?'
    ],
    evaluationCriteria: [
      'Nêu đúng tấm gương và phẩm chất nổi bật',
      'Có cảm xúc kính trọng, tự hào chân thực',
      'Liên hệ bản thân thiết thực'
    ],
    textbookRef: 'Tiếng Việt 3 Tập 2 - Bài 26'
  },
  {
    id: 'tap2-09',
    volume: 2,
    week: 27,
    title: 'Viết đoạn văn nêu tình cảm, cảm xúc về cảnh vật quê hương',
    gardenType: 'yeu_thuong',
    prompt: 'Viết đoạn văn bày tỏ tình cảm thiết tha của em với quê hương yêu dấu (nơi em sinh ra hoặc quê nội, quê ngoại).',
    suggestedQuestions: [
      'Quê hương em ở đâu? Cảnh vật nơi đó có gì mộc mạc, thân thương?',
      'Mỗi lần về quê, em thích nhất điều gì (tiếng gà gáy, đồng lúa xanh, dòng sông mát lành)?',
      'Tình cảm gắn bó máu thịt của em với quê hương như thế nào?'
    ],
    evaluationCriteria: [
      'Bộc lộ tình cảm gắn bó tha thiết với nguồn cội',
      'Hình ảnh quê hương gần gũi, ấm áp',
      'Câu văn uyển chuyển, giàu cảm xúc'
    ],
    textbookRef: 'Tiếng Việt 3 Tập 2 - Bài 27'
  },
  {
    id: 'tap2-10',
    volume: 2,
    week: 28,
    title: 'Viết đoạn văn về một cảnh đẹp đất nước',
    gardenType: 'sac_mau',
    prompt: 'Viết đoạn văn giới thiệu một danh lam thắng cảnh nổi tiếng của Việt Nam mà em biết qua sách báo, ti vi hoặc từng đến thăm.',
    suggestedQuestions: [
      'Cảnh đẹp đất nước em chọn là danh thắng nào (Vịnh Hạ Long, phố cổ Hội An, chợ nổi miền Tây...)?',
      'Nơi đó có nét đẹp kỳ thú nào làm du khách say mê?',
      'Em tự hào như thế nào về non sông gấm vóc Việt Nam?'
    ],
    evaluationCriteria: [
      'Thông tin chính xác, hình ảnh nổi bật',
      'Biết ngợi ca vẻ đẹp kỳ vĩ của thiên nhiên quê hương',
      'Có niềm tự hào dân tộc'
    ],
    textbookRef: 'Tiếng Việt 3 Tập 2 - Bài 28'
  },
  {
    id: 'tap2-11',
    volume: 2,
    week: 29,
    title: 'Viết những câu giới thiệu cảnh đẹp trong tranh',
    gardenType: 'sac_mau',
    prompt: 'Viết đoạn văn ngắn 3–4 câu giới thiệu một tấm bưu thiếp hoặc tranh ảnh phong cảnh mà em sưu tầm được.',
    suggestedQuestions: [
      'Tấm tranh vẽ hoặc chụp lại cảnh vật ở đâu?',
      'Gam màu chủ đạo và đường nét trong tranh có gì hấp dẫn?',
      'Khi ngắm bức tranh, em có cảm giác như đang được đặt chân đến nơi đó không?'
    ],
    evaluationCriteria: [
      'Miêu tả tranh có trọng tâm',
      'Ngôn ngữ gợi tả, gợi cảm',
      'Đúng cấu trúc đoạn văn ngắn'
    ],
    textbookRef: 'Tiếng Việt 3 Tập 2 - Bài 29'
  },
  {
    id: 'tap2-12',
    volume: 2,
    week: 30,
    title: 'Viết về một việc làm bảo vệ môi trường',
    gardenType: 'ke_chuyen',
    prompt: 'Kể lại một hành động nhỏ mà em đã làm để bảo vệ môi trường xung quanh (nhặt rác, trồng cây, tiết kiệm nước, tắt điện).',
    suggestedQuestions: [
      'Em đã làm việc gì để giữ gìn môi trường xanh - sạch - đẹp?',
      'Em thực hiện việc đó cùng ai, vào lúc nào?',
      'Ý nghĩa của hành động đó đối với lớp học hoặc khu phố của em?',
      'Em muốn nhắn nhủ thông điệp gì đến mọi người?'
    ],
    evaluationCriteria: [
      'Hành động cụ thể, thiết thực của lứa tuổi học sinh',
      'Nêu được ý thức trách nhiệm với hành tinh xanh',
      'Khuyến khích mọi người cùng chung tay'
    ],
    textbookRef: 'Tiếng Việt 3 Tập 2 - Bài 30'
  },
  {
    id: 'tap2-13',
    volume: 2,
    week: 31,
    title: 'Viết đoạn văn giới thiệu tranh vẽ về Trái Đất',
    gardenType: 'sac_mau',
    prompt: 'Viết đoạn văn giới thiệu bức tranh cổ động bảo vệ Trái Đất xanh do em hoặc bạn cùng nhóm sáng tạo.',
    suggestedQuestions: [
      'Trung tâm bức tranh là hình ảnh Trái Đất như thế nào (xanh tươi, nở nụ cười hay cần được chở che)?',
      'Xung quanh có những chi tiết nào nói lên tình yêu sự sống (cánh chim, rừng cây, bàn tay nâng niu)?',
      'Thông điệp bảo vệ Trái Đất trong tranh là gì?'
    ],
    evaluationCriteria: [
      'Làm nổi bật thông điệp bảo vệ hành tinh xanh',
      'Miêu tả chi tiết tranh mạch lạc',
      'Thể hiện tình cảm trong sáng'
    ],
    textbookRef: 'Tiếng Việt 3 Tập 2 - Bài 31'
  },
  {
    id: 'tap2-14',
    volume: 2,
    week: 32,
    title: 'Viết đoạn văn kể lại sự việc đáng nhớ trong năm học',
    gardenType: 'ke_chuyen',
    prompt: 'Kể lại một kỷ niệm vui, một sự cố đáng nhớ hoặc một ngày hội ở lớp 3 mà em không bao giờ quên.',
    suggestedQuestions: [
      'Sự việc xảy ra vào dịp nào trong năm học lớp 3?',
      'Lúc đó có những thầy cô, bạn bè nào cùng tham gia?',
      'Diễn biến nào bất ngờ hoặc làm cả lớp xúc động nhất?',
      'Kỷ niệm đó giúp em trưởng thành hoặc yêu quý lớp mình hơn ra sao?'
    ],
    evaluationCriteria: [
      'Chọn được sự việc có ý nghĩa sâu sắc',
      'Kể lại diễn biến có mở đầu, cao trào, kết thúc',
      'Cảm xúc bạn bè, thầy cô đọng lại ngọt ngào'
    ],
    textbookRef: 'Tiếng Việt 3 Tập 2 - Bài 32'
  },
  {
    id: 'tap2-15',
    volume: 2,
    week: 33,
    title: 'Viết thư điện tử theo tình huống',
    gardenType: 'cuoc_song',
    prompt: 'Viết một bức thư điện tử (email) ngắn gửi thầy cô giáo hoặc bạn để trao đổi về bài học hoặc lời chúc mừng sinh nhật.',
    suggestedQuestions: [
      'Dòng chủ đề (Subject) cần ngắn gọn và rõ ràng như thế nào?',
      'Lời chào đầu thư gửi ai?',
      'Nội dung chính em muốn trao đổi là gì?',
      'Lời chúc và lời chào tạm biệt kèm tên của em?'
    ],
    evaluationCriteria: [
      'Đúng cấu trúc thư điện tử hiện đại',
      'Ngôn ngữ văn minh, lịch sự',
      'Không viết tắt, không sai dấu câu'
    ],
    textbookRef: 'Tiếng Việt 3 Tập 2 - Bài 33'
  },
  {
    id: 'tap2-16',
    volume: 2,
    week: 34,
    title: 'Viết bản tin ngắn về hoạt động vì cộng đồng',
    gardenType: 'cuoc_song',
    prompt: 'Viết một bản tin ngắn đưa tin về phong trào “Kế hoạch nhỏ” hoặc phong trào “Đôi bạn cùng tiến” của trường em.',
    suggestedQuestions: [
      'Tiêu đề bản tin là gì?',
      'Hoạt động diễn ra vào ngày nào, do ai phát động?',
      'Kết quả đạt được của các chi đội ra sao (bao nhiêu kilôgam giấy, bao nhiêu cuốn sách)?',
      'Ý nghĩa tích cực của phong trào đối với học sinh?'
    ],
    evaluationCriteria: [
      'Nắm bắt đúng thể loại bản tin (nhanh, rõ, khách quan)',
      'Số liệu hoặc kết quả cụ thể, thuyết phục',
      'Giọng văn tươi vui, phấn khởi'
    ],
    textbookRef: 'Tiếng Việt 3 Tập 2 - Bài 34'
  },
  {
    id: 'tap2-17',
    volume: 2,
    week: 35,
    title: 'Viết phiếu đọc sách theo mẫu',
    gardenType: 'cuoc_song',
    prompt: 'Ghi lại thu hoạch và cảm nhận của em sau khi đọc xong một cuốn sách khoa học vui hoặc truyện cổ tích hay trong học kỳ 2.',
    suggestedQuestions: [
      'Tên cuốn sách và tác giả là ai?',
      'Điều gì mới mẻ hoặc bất ngờ nhất mà cuốn sách mang lại cho em?',
      'Nhân vật nào làm em thán phục nhất?',
      'Em muốn giới thiệu cuốn sách này cho bạn bè nào đọc cùng?'
    ],
    evaluationCriteria: [
      'Ghi chép chính xác thông tin tác phẩm',
      'Nêu cảm nhận độc đáo của riêng em',
      'Lan tỏa niềm yêu thích đọc sách'
    ],
    textbookRef: 'Tiếng Việt 3 Tập 2 - Bài Ôn tập cuối năm'
  }
];

export const GRADE_3_TASKS: WritingTask[] = RAW_GRADE_3_TASKS.map(t => ({
  ...t,
  grade: 3 as const,
  gradeMission: t.gradeMission || 'Em học lập dàn ý & viết đoạn văn',
  expectedLength: t.expectedLength || (t.volume === 1 ? '4–6 câu hoặc 7–9 câu' : '5–8 câu liên kết')
}));

// TOÀN BỘ BÀI TẬP TIẾNG VIỆT LỚP 1 ĐẾN LỚP 5 THEO GDPT 2018
export const CURRICULUM_TASKS: WritingTask[] = [
  ...GRADE_1_TASKS,
  ...GRADE_2_TASKS,
  ...GRADE_3_TASKS,
  ...GRADE_4_TASKS,
  ...GRADE_5_TASKS
];
