import { EssayGenre } from '../types';

export interface OtherCreativeTopic {
  id: string;
  category: string;
  categoryIcon: string;
  title: string;
  prompt: string;
  suggestedGenre: EssayGenre;
  suggestedGrade: number;
}

export const OTHER_TOPICS_CATEGORIES = [
  { id: 'gia_dinh', name: 'Gia đình yêu thương', icon: '🏡', color: 'from-pink-500 to-rose-400', border: 'border-pink-300', bg: 'bg-pink-50' },
  { id: 'truong_hoc', name: 'Trường học mến yêu', icon: '🏫', color: 'from-amber-500 to-yellow-400', border: 'border-amber-300', bg: 'bg-amber-50' },
  { id: 'thien_nhien', name: 'Thiên nhiên kỳ thú', icon: '🌿', color: 'from-emerald-500 to-teal-400', border: 'border-emerald-300', bg: 'bg-emerald-50' },
  { id: 'tuong_tuong', name: 'Thế giới tưởng tượng', icon: '✨', color: 'from-purple-500 to-indigo-400', border: 'border-purple-300', bg: 'bg-purple-50' },
  { id: 'uoc_mo', name: 'Ước mơ của em', icon: '⭐', color: 'from-sky-500 to-blue-400', border: 'border-sky-300', bg: 'bg-sky-50' },
  { id: 'muon_ke', name: 'Những điều em muốn kể', icon: '💬', color: 'from-teal-500 to-cyan-400', border: 'border-teal-300', bg: 'bg-teal-50' },
  { id: 'tu_chon', name: 'Chủ đề do em tự chọn', icon: '🎨', color: 'from-fuchsia-500 to-pink-400', border: 'border-fuchsia-300', bg: 'bg-fuchsia-50' }
];

export const OTHER_CREATIVE_TOPICS: OtherCreativeTopic[] = [
  // 1. Gia đình yêu thương
  {
    id: 'ot-gd-01',
    category: 'gia_dinh',
    categoryIcon: '🏡',
    title: 'Một kỷ niệm với ông bà',
    prompt: 'Kể lại một kỷ niệm ấm áp hoặc một lần em được ông bà chăm sóc, dạy dỗ khiến em nhớ mãi.',
    suggestedGenre: 'tinh_cam_cam_xuc',
    suggestedGrade: 3
  },
  {
    id: 'ot-gd-02',
    category: 'gia_dinh',
    categoryIcon: '🏡',
    title: 'Món quà em muốn tặng mẹ',
    prompt: 'Viết về một món quà do chính tay em làm hoặc mong ước dành tặng mẹ nhân ngày đặc biệt.',
    suggestedGenre: 'tinh_cam_cam_xuc',
    suggestedGrade: 3
  },
  {
    id: 'ot-gd-03',
    category: 'gia_dinh',
    categoryIcon: '🏡',
    title: 'Một ngày vui bên gia đình',
    prompt: 'Kể lại một ngày cuối tuần hoặc chuyến đi dạo rộn rã tiếng cười của cả gia đình em.',
    suggestedGenre: 'ke_su_viec',
    suggestedGrade: 3
  },
  {
    id: 'ot-gd-04',
    category: 'gia_dinh',
    categoryIcon: '🏡',
    title: 'Người thân khiến em cảm phục',
    prompt: 'Viết đoạn văn bày tỏ lòng kính trọng, cảm phục trước sự hy sinh hoặc đức tính tốt đẹp của một người thân.',
    suggestedGenre: 'tinh_cam_cam_xuc',
    suggestedGrade: 3
  },

  // 2. Trường học mến yêu
  {
    id: 'ot-th-01',
    category: 'truong_hoc',
    categoryIcon: '🏫',
    title: 'Người bạn đặc biệt của em',
    prompt: 'Miêu tả và chia sẻ tình cảm của em dành cho một người bạn thân thiết cùng bàn hoặc cùng lớp.',
    suggestedGenre: 'ta_nguoi',
    suggestedGrade: 3
  },
  {
    id: 'ot-th-02',
    category: 'truong_hoc',
    categoryIcon: '🏫',
    title: 'Một giờ học đáng nhớ',
    prompt: 'Kể lại một tiết học sôi nổi, nhiều niềm vui và để lại cho em nhiều kiến thức bổ ích.',
    suggestedGenre: 'ke_su_viec',
    suggestedGrade: 3
  },
  {
    id: 'ot-th-03',
    category: 'truong_hoc',
    categoryIcon: '🏫',
    title: 'Ngôi trường trong mơ',
    prompt: 'Tưởng tượng và miêu tả ngôi trường lý tưởng với vườn cây, thư viện thông minh và sân chơi tuyệt vời.',
    suggestedGenre: 'sang_tao',
    suggestedGrade: 3
  },
  {
    id: 'ot-th-04',
    category: 'truong_hoc',
    categoryIcon: '🏫',
    title: 'Kỷ niệm đẹp với thầy cô',
    prompt: 'Kể lại một lời khen hoặc cử chỉ ân cần của thầy cô giáo khiến em xúc động và có thêm động lực học tập.',
    suggestedGenre: 'tinh_cam_cam_xuc',
    suggestedGrade: 3
  },

  // 3. Thiên nhiên kỳ thú
  {
    id: 'ot-tn-01',
    category: 'thien_nhien',
    categoryIcon: '🌿',
    title: 'Khu vườn trong tưởng tượng',
    prompt: 'Miêu tả một khu vườn rực rỡ với muôn sắc hoa, ong bướm lượn bay và những loại quả ngọt ngào.',
    suggestedGenre: 'ta_canh_vat',
    suggestedGrade: 3
  },
  {
    id: 'ot-tn-02',
    category: 'thien_nhien',
    categoryIcon: '🌿',
    title: 'Nếu em là một bông hoa',
    prompt: 'Hóa thân thành một đóa hoa trong nắng mai, kể về cuộc sống đón ánh mặt trời và làm đẹp cho đời.',
    suggestedGenre: 'sang_tao',
    suggestedGrade: 3
  },
  {
    id: 'ot-tn-03',
    category: 'thien_nhien',
    categoryIcon: '🌿',
    title: 'Chuyến phiêu lưu của giọt nước',
    prompt: 'Kể câu chuyện thú vị về một giọt nước tí hon bay lên mây, hóa thành mưa rồi tưới mát cho cây cỏ.',
    suggestedGenre: 'sang_tao',
    suggestedGrade: 3
  },
  {
    id: 'ot-tn-04',
    category: 'thien_nhien',
    categoryIcon: '🌿',
    title: 'Một ngày em được trò chuyện với cây xanh',
    prompt: 'Tưởng tượng em có thể nghe được tiếng thì thầm của cây cổ thụ trong sân trường và những điều cây kể.',
    suggestedGenre: 'sang_tao',
    suggestedGrade: 3
  },

  // 4. Thế giới tưởng tượng
  {
    id: 'ot-tt-01',
    category: 'tuong_tuong',
    categoryIcon: '✨',
    title: 'Nếu em có đôi cánh',
    prompt: 'Tưởng tượng em có đôi cánh thần kỳ để bay lên bầu trời ngắm nhìn quê hương và giúp đỡ mọi người.',
    suggestedGenre: 'sang_tao',
    suggestedGrade: 3
  },
  {
    id: 'ot-tt-02',
    category: 'tuong_tuong',
    categoryIcon: '✨',
    title: 'Chiếc bút biết nói',
    prompt: 'Kể về chiếc bút mực kỳ diệu có thể nói chuyện, động viên em nắn nót viết từng nét chữ đẹp.',
    suggestedGenre: 'sang_tao',
    suggestedGrade: 3
  },
  {
    id: 'ot-tt-03',
    category: 'tuong_tuong',
    categoryIcon: '✨',
    title: 'Cánh cửa dẫn đến thế giới cổ tích',
    prompt: 'Tưởng tượng em mở một cánh cửa thần kỳ và bước vào xứ sở gặp gỡ những nhân vật em yêu mến.',
    suggestedGenre: 'sang_tao',
    suggestedGrade: 3
  },
  {
    id: 'ot-tt-04',
    category: 'tuong_tuong',
    categoryIcon: '✨',
    title: 'Nếu em gặp một chú rô-bốt thông minh',
    prompt: 'Kể về cuộc gặp gỡ giữa em và một bạn rô-bốt thân thiện biết dọn rác và tưới cây xanh.',
    suggestedGenre: 'sang_tao',
    suggestedGrade: 3
  },

  // 5. Ước mơ của em
  {
    id: 'ot-um-01',
    category: 'uoc_mo',
    categoryIcon: '⭐',
    title: 'Nghề nghiệp em yêu thích',
    prompt: 'Viết về ước mơ lớn lên trở thành bác sĩ, kỹ sư, cô giáo hay phi công và lí do em yêu công việc ấy.',
    suggestedGenre: 'tinh_cam_cam_xuc',
    suggestedGrade: 3
  },
  {
    id: 'ot-um-02',
    category: 'uoc_mo',
    categoryIcon: '⭐',
    title: 'Ngôi nhà tương lai',
    prompt: 'Tưởng tượng và miêu tả ngôi nhà thông minh tràn ngập ánh sáng và cây xanh trong tương lai của em.',
    suggestedGenre: 'sang_tao',
    suggestedGrade: 3
  },
  {
    id: 'ot-um-03',
    category: 'uoc_mo',
    categoryIcon: '⭐',
    title: 'Một việc tốt em mong được làm',
    prompt: 'Chia sẻ về một việc làm ý nghĩa mà em ấp ủ thực hiện để mang lại niềm vui cho các bạn nhỏ có hoàn cảnh khó khăn.',
    suggestedGenre: 'tinh_cam_cam_xuc',
    suggestedGrade: 3
  },
  {
    id: 'ot-um-04',
    category: 'uoc_mo',
    categoryIcon: '⭐',
    title: 'Thế giới em muốn xây dựng',
    prompt: 'Bày tỏ mong ước về một thế giới xanh - sạch - đẹp, hòa bình và ngập tràn tình yêu thương muôn loài.',
    suggestedGenre: 'tinh_cam_cam_xuc',
    suggestedGrade: 3
  },

  // 6. Những điều em muốn kể
  {
    id: 'ot-mk-01',
    category: 'muon_ke',
    categoryIcon: '💬',
    title: 'Một niềm vui nhỏ',
    prompt: 'Kể lại một khoảnh khắc giản dị như tìm lại món đồ bị mất hay được điểm tốt làm em vui cả ngày.',
    suggestedGenre: 'ke_su_viec',
    suggestedGrade: 3
  },
  {
    id: 'ot-mk-02',
    category: 'muon_ke',
    categoryIcon: '💬',
    title: 'Một lần em vượt qua khó khăn',
    prompt: 'Kể lại lần em kiên trì tập đi xe đạp, bơi lội hoặc giải một bài toán khó mà không nản chí.',
    suggestedGenre: 'ke_su_viec',
    suggestedGrade: 3
  },
  {
    id: 'ot-mk-03',
    category: 'muon_ke',
    categoryIcon: '💬',
    title: 'Việc tốt em từng làm',
    prompt: 'Kể lại một hành động nhỏ nhưng ấm áp như giúp bạn dọn bàn, nhặt rác sân trường hay dắt em nhỏ qua đường.',
    suggestedGenre: 'ke_su_viec',
    suggestedGrade: 3
  },
  {
    id: 'ot-mk-04',
    category: 'muon_ke',
    categoryIcon: '💬',
    title: 'Một điều em muốn nói với người thân',
    prompt: 'Viết những lời tâm tình, lời cảm ơn hoặc lời xin lỗi chân thành mà em muốn gửi gắm tới bố mẹ hoặc thầy cô.',
    suggestedGenre: 'tinh_cam_cam_xuc',
    suggestedGrade: 3
  }
];
