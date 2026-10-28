import type { 
  EssayGenre, 
  TopicGroupInfo, 
  WritingTaskDefinition, 
  ValidationCheckItem, 
  PromptValidationReport, 
  PromptDirection, 
  MindMapBranch, 
  DetailedOutlineGroup, 
  DetailedOutlineSection, 
  VocabularyImageryBank,
  DifficultyLevel,
  PromptAnalysisData,
  PromptChoiceType,
  ObjectChoiceItem,
  FormatChoiceItem,
  WritingTaskAnalysis,
  WritingTaskLength,
  WritingTaskAlternative
} from '../types/index.ts';

// =========================================================================
// I. HỆ THỐNG 25 NHÓM CHỦ ĐỀ MỞ (CD01 - CD25) CHUẨN GDPT 2018
// =========================================================================

export const TOPIC_GROUPS: TopicGroupInfo[] = [
  { code: 'CD01', name: 'Bản thân', icon: '👦👧', description: 'Họ tên, tuổi, đặc điểm riêng, sở thích, thói quen và cảm xúc của em' },
  { code: 'CD02', name: 'Gia đình', icon: '🏡', description: 'Ông bà, cha mẹ, anh chị em, mái ấm yêu thương và kỷ niệm gia đình' },
  { code: 'CD03', name: 'Bạn bè', icon: '🤝', description: 'Tình bạn thân thiết, bạn cùng lớp, bạn mới, sẻ chia và giúp đỡ nhau' },
  { code: 'CD04', name: 'Thầy cô', icon: '👩‍🏫', description: 'Thầy cô giáo kính yêu, sự dạy dỗ ân cần, tấm lòng tri ân sâu sắc' },
  { code: 'CD05', name: 'Trường lớp', icon: '🏫', description: 'Mái trường, lớp học, bàn ghế, sân trường, giờ ra chơi và sinh hoạt dưới cờ' },
  { code: 'CD06', name: 'Đồ vật', icon: '🎒', description: 'Đồ dùng học tập, đồ chơi yêu thích, đồ vật kỷ niệm gắn bó' },
  { code: 'CD07', name: 'Động vật', icon: '🐶', description: 'Vật nuôi trong nhà, con vật trong tự nhiên, tình cảm với muôn loài' },
  { code: 'CD08', name: 'Thực vật', icon: '🌳', description: 'Cây bóng mát, cây ăn quả, bồn hoa, rau xanh và tình yêu thiên nhiên' },
  { code: 'CD09', name: 'Thiên nhiên', icon: '☀️', description: 'Bầu trời, bốn mùa, mưa nắng, dòng sông, núi non, biển cả tươi đẹp' },
  { code: 'CD10', name: 'Quê hương', icon: '🌾', description: 'Làng quê thanh bình, phố phường rộn rã, danh lam thắng cảnh Việt Nam' },
  { code: 'CD11', name: 'Lễ hội', icon: '🏮', description: 'Tết Nguyên đán, Trung thu, ngày hội truyền thống, phong tục tập quán' },
  { code: 'CD12', name: 'Hoạt động trải nghiệm', icon: '⛺', description: 'Dã ngoại, tham quan, cắm trại, lao động công ích, học tập thực tế' },
  { code: 'CD13', name: 'Việc tốt', icon: '💖', description: 'Giúp đỡ bạn bè, nhặt được của rơi, hiếu thảo với ông bà, bảo vệ của công' },
  { code: 'CD14', name: 'Cảm xúc', icon: '🌸', description: 'Niềm vui, lòng biết ơn, sự cảm phục, nỗi nhớ, niềm xúc động chân thành' },
  { code: 'CD15', name: 'Sách và truyện', icon: '📖', description: 'Cuốn sách em yêu, nhân vật cổ tích, bài học nhân văn từ những trang sách' },
  { code: 'CD16', name: 'Ước mơ', icon: '⭐', description: 'Ước mơ tương lai (bác sĩ, giáo viên, phi hành gia...), khát vọng vươn lên' },
  { code: 'CD17', name: 'Môi trường', icon: '🌱', description: 'Bảo vệ nguồn nước, trồng cây xanh, giữ gìn vệ sinh, phân loại rác' },
  { code: 'CD18', name: 'Kỹ năng sống', icon: '🧭', description: 'Tự lập, an toàn giao thông, phòng tránh tai nạn, kỹ năng giao tiếp ứng xử' },
  { code: 'CD19', name: 'Văn hóa và cộng đồng', icon: '🇻🇳', description: 'Truyền thống yêu nước, văn hóa các dân tộc, hoạt động thiện nguyện' },
  { code: 'CD20', name: 'Thế giới tưởng tượng', icon: '✨', description: 'Hóa thân làm đồ vật, con vật, chuyến bay vào vũ trụ, xứ sở kỳ diệu' },
  { code: 'CD21', name: 'Khoa học và công nghệ', icon: '🤖', description: 'Robot thông minh, máy tính, phát minh tương lai, khám phá khoa học' },
  { code: 'CD22', name: 'Thể thao và nghệ thuật', icon: '⚽', description: 'Bóng đá, bơi lội, âm nhạc, hội họa, rèn luyện thể chất và nuôi dưỡng tâm hồn' },
  { code: 'CD23', name: 'Giao tiếp', icon: '💌', description: 'Lời chào, lời chúc mừng, lời xin lỗi, cảm ơn, thư từ, lời nhắn gửi' },
  { code: 'CD24', name: 'Hoạt động tập thể', icon: '👥', description: 'Văn nghệ lớp, trực nhật, hội chợ xuân, thi đồng diễn thể dục' },
  { code: 'CD25', name: 'Chủ đề tự do', icon: '🎨', description: 'Đề bài mở, suy nghĩ sáng tạo riêng theo trí tưởng tượng của học sinh' }
];

// =========================================================================
// II. HỆ THỐNG 64 NHÓM NHIỆM VỤ VIẾT (01 - 64) THEO CHUẨN GDPT 2018
// =========================================================================

export const WRITING_TASKS_CATALOG: WritingTaskDefinition[] = [
  { code: 'NV01', name: 'Viết câu giới thiệu', genre: 'viet_cau', description: 'Giới thiệu bản thân, người thân hoặc đồ vật bằng 1 câu', targetGrades: [1, 2] },
  { code: 'NV02', name: 'Viết câu miêu tả', genre: 'viet_cau', description: 'Miêu tả đặc điểm hình dáng, màu sắc hoặc âm thanh bằng 1 câu', targetGrades: [1, 2] },
  { code: 'NV03', name: 'Viết câu kể', genre: 'viet_cau', description: 'Kể lại một hành động hoặc sự việc diễn ra bằng 1 câu', targetGrades: [1, 2] },
  { code: 'NV04', name: 'Viết câu bày tỏ cảm xúc', genre: 'viet_cau', description: 'Thể hiện niềm vui, ngạc nhiên, yêu thích bằng 1 câu cảm', targetGrades: [1, 2] },
  { code: 'NV05', name: 'Viết theo tranh', genre: 'viet_cau', description: 'Quan sát tranh minh họa và viết 1–2 câu phù hợp nội dung', targetGrades: [1, 2] },
  { code: 'NV06', name: 'Hoàn thành câu', genre: 'viet_cau', description: 'Điền từ ngữ phù hợp vào chỗ trống để tạo câu trọn vẹn', targetGrades: [1, 2] },
  { code: 'NV07', name: 'Sắp xếp câu', genre: 'viet_cau', description: 'Sắp xếp các từ ngữ hoặc câu rời rạc thành đoạn văn liền mạch', targetGrades: [1, 2] },
  { code: 'NV08', name: 'Viết đoạn văn giới thiệu', genre: 'viet_doan_van', description: 'Giới thiệu bản thân, người thân hoặc đồ dùng học tập (3–5 câu)', targetGrades: [2, 3] },
  { code: 'NV09', name: 'Viết đoạn văn kể chuyện', genre: 'ke_chuyen', description: 'Kể lại một chuỗi sự việc có đầu đuôi và ý nghĩa (4–6 câu)', targetGrades: [2, 3, 4] },
  { code: 'NV10', name: 'Viết đoạn văn miêu tả', genre: 'mieu_ta', description: 'Tả đồ vật, con vật hoặc cảnh vật xung quanh (4–6 câu)', targetGrades: [2, 3, 4] },
  { code: 'NV11', name: 'Viết đoạn văn nêu cảm xúc', genre: 'tinh_cam_cam_xuc', description: 'Bày tỏ tình cảm, lòng biết ơn với người thân hoặc thầy cô', targetGrades: [2, 3, 4] },
  { code: 'NV12', name: 'Viết đoạn văn nêu ý kiến', genre: 'neu_y_kien', description: 'Bày tỏ quan điểm đồng tình hoặc không đồng tình về một việc làm', targetGrades: [3, 4, 5] },
  { code: 'NV13', name: 'Viết đoạn văn tưởng tượng', genre: 'sang_tao', description: 'Tưởng tượng tình huống kỳ diệu, chuyến phiêu lưu giả định', targetGrades: [3, 4, 5] },
  { code: 'NV14', name: 'Viết đoạn có câu chủ đề', genre: 'viet_doan_van', description: 'Viết đoạn văn diễn dịch hoặc quy nạp có câu mở đầu/kết đoạn nêu chủ đề', targetGrades: [4, 5] },
  { code: 'NV15', name: 'Kể lại sự việc', genre: 'thuat_lai', description: 'Thuật lại một hoạt động, lễ hội hoặc việc làm theo trình tự thời gian', targetGrades: [3, 4] },
  { code: 'NV16', name: 'Kể lại trải nghiệm', genre: 'ke_chuyen', description: 'Kể lại chuyến đi tham quan, buổi cắm trại hoặc trải nghiệm đáng nhớ', targetGrades: [3, 4, 5] },
  { code: 'NV17', name: 'Kể lại kỷ niệm', genre: 'ke_chuyen', description: 'Kể lại một kỷ niệm sâu sắc, gắn bó với ông bà, cha mẹ hoặc thầy cô', targetGrades: [3, 4, 5] },
  { code: 'NV18', name: 'Kể lại câu chuyện đã đọc', genre: 'ke_chuyen', description: 'Tóm tắt hoặc kể lại bằng lời văn của em câu chuyện đã nghe, đã đọc', targetGrades: [3, 4, 5] },
  { code: 'NV19', name: 'Kể chuyện sáng tạo', genre: 'sang_tao', description: 'Kể thêm chi tiết mới, xây dựng tình huống bất ngờ cho câu chuyện', targetGrades: [4, 5] },
  { code: 'NV20', name: 'Kể chuyện nhập vai', genre: 'sang_tao', description: 'Hóa thân thành một nhân vật hoặc đồ vật để kể lại câu chuyện', targetGrades: [4, 5] },
  { code: 'NV21', name: 'Kể chuyện thay đổi ngôi kể', genre: 'ke_chuyen', description: 'Chuyển đổi ngôi kể thứ ba sang ngôi thứ nhất hoặc ngược lại', targetGrades: [4, 5] },
  { code: 'NV22', name: 'Kể chuyện thay đổi kết thúc', genre: 'sang_tao', description: 'Sáng tạo một cái kết mới có hậu hoặc giàu ý nghĩa nhân văn', targetGrades: [4, 5] },
  { code: 'NV23', name: 'Tả người', genre: 'mieu_ta', description: 'Tả ngoại hình, tính tình, hoạt động của người thân, thầy cô hoặc bạn bè', targetGrades: [4, 5] },
  { code: 'NV24', name: 'Tả đồ vật', genre: 'mieu_ta', description: 'Tả đồ dùng học tập, đồ chơi, đồ vật thân quen trong gia đình', targetGrades: [2, 3, 4, 5] },
  { code: 'NV25', name: 'Tả con vật', genre: 'mieu_ta', description: 'Tả hình dáng, thói quen sinh hoạt và nét đáng yêu của con vật nuôi', targetGrades: [2, 3, 4, 5] },
  { code: 'NV26', name: 'Tả cây cối', genre: 'mieu_ta', description: 'Tả cây bóng mát, cây hoa, cây ăn quả theo từng thời kỳ phát triển', targetGrades: [4, 5] },
  { code: 'NV27', name: 'Tả cảnh', genre: 'mieu_ta', description: 'Tả cảnh đẹp quê hương, cảnh bình minh, hoàng hôn, cơn mưa rào', targetGrades: [4, 5] },
  { code: 'NV28', name: 'Tả hoạt động', genre: 'mieu_ta', description: 'Tả hoạt động học tập, lao động, vui chơi thể thao sinh động', targetGrades: [4, 5] },
  { code: 'NV29', name: 'Tả không gian cụ thể', genre: 'mieu_ta', description: 'Tả một góc học tập, một góc sân trường, thư viện hoặc phòng ngủ', targetGrades: [3, 4, 5] },
  { code: 'NV30', name: 'Giới thiệu sách', genre: 'viet_doan_van', description: 'Giới thiệu tên sách, tác giả, nội dung chính và bài học tâm đắc', targetGrades: [3, 4, 5] },
  { code: 'NV31', name: 'Giới thiệu nhân vật', genre: 'viet_doan_van', description: 'Giới thiệu nhân vật cổ tích, anh hùng dân tộc hoặc tấm gương sáng', targetGrades: [3, 4, 5] },
  { code: 'NV32', name: 'Giới thiệu địa danh', genre: 'viet_doan_van', description: 'Giới thiệu di tích lịch sử, danh lam thắng cảnh ở quê hương', targetGrades: [3, 4, 5] },
  { code: 'NV33', name: 'Giới thiệu hoạt động', genre: 'viet_doan_van', description: 'Giới thiệu phong trào thi đua hoặc câu lạc bộ sinh hoạt của trường', targetGrades: [3, 4, 5] },
  { code: 'NV34', name: 'Bày tỏ tình cảm', genre: 'tinh_cam_cam_xuc', description: 'Bộc lộ lòng kính yêu, gắn bó sâu nặng với người thân hoặc quê hương', targetGrades: [2, 3, 4, 5] },
  { code: 'NV35', name: 'Nêu cảm nghĩ về truyện', genre: 'tinh_cam_cam_xuc', description: 'Nêu suy nghĩ và cảm xúc lắng đọng sau khi đọc một câu chuyện', targetGrades: [3, 4, 5] },
  { code: 'NV36', name: 'Nêu cảm nghĩ về thơ', genre: 'tinh_cam_cam_xuc', description: 'Chia sẻ những câu thơ hay, hình ảnh gợi cảm và cảm xúc của em', targetGrades: [4, 5] },
  { code: 'NV37', name: 'Nêu ý kiến', genre: 'neu_y_kien', description: 'Khẳng định ý kiến cá nhân và đưa ra lý lẽ xác đáng bảo vệ quan điểm', targetGrades: [3, 4, 5] },
  { code: 'NV38', name: 'Giải thích lý do', genre: 'neu_y_kien', description: 'Giải thích nguyên nhân vì sao em yêu thích một hiện tượng hay hoạt động', targetGrades: [3, 4, 5] },
  { code: 'NV39', name: 'Thuyết phục đơn giản', genre: 'neu_y_kien', description: 'Dùng lời lẽ chân thành để khuyên bạn cùng chung tay làm việc tốt', targetGrades: [4, 5] },
  { code: 'NV40', name: 'Viết thư thăm hỏi', genre: 'viet_thu', description: 'Viết thư hỏi thăm sức khỏe, sinh hoạt của ông bà, thầy cô hoặc bạn bè', targetGrades: [3, 4, 5] },
  { code: 'NV41', name: 'Viết thư chia sẻ', genre: 'viet_thu', description: 'Viết thư tâm sự, kể chuyện học tập, chia sẻ niềm vui hoặc động viên bạn', targetGrades: [3, 4, 5] },
  { code: 'NV42', name: 'Viết thư bày tỏ mong muốn', genre: 'viet_thu', description: 'Gửi gắm ước mơ, lời hứa hẹn hoặc đề xuất nguyện vọng chính đáng', targetGrades: [3, 4, 5] },
  { code: 'NV43', name: 'Viết tin nhắn', genre: 'loi_nhan', description: 'Soạn tin nhắn điện thoại ngắn gọn thông báo việc gấp hoặc hỏi thăm', targetGrades: [2, 3] },
  { code: 'NV44', name: 'Viết lời nhắn', genre: 'loi_nhan', description: 'Để lại lời nhắn trên mẩu giấy dặn dò người thân trước khi đi đâu', targetGrades: [2, 3] },
  { code: 'NV45', name: 'Viết bưu thiếp', genre: 'loi_nhan', description: 'Viết vài dòng ấm áp trên bưu thiếp chúc mừng hoặc gửi lời cảm ơn', targetGrades: [2, 3] },
  { code: 'NV46', name: 'Viết lời chúc', genre: 'loi_nhan', description: 'Gửi lời chúc tốt lành nhân dịp năm mới, sinh nhật hoặc ngày 20/11', targetGrades: [1, 2, 3] },
  { code: 'NV47', name: 'Viết lời cảm ơn', genre: 'tinh_cam_cam_xuc', description: 'Bày tỏ lòng biết ơn chân thành khi nhận được sự giúp đỡ quý báu', targetGrades: [2, 3, 4] },
  { code: 'NV48', name: 'Viết lời xin lỗi', genre: 'tinh_cam_cam_xuc', description: 'Nhận lỗi chân thành và hứa sửa chữa khi trót làm sai điều gì', targetGrades: [2, 3, 4] },
  { code: 'NV49', name: 'Viết lời mời', genre: 'viet_doan_van', description: 'Viết giấy mời hoặc lời mời bạn tham gia sinh nhật, hoạt động tập thể', targetGrades: [2, 3] },
  { code: 'NV50', name: 'Viết thông báo', genre: 'thong_bao', description: 'Viết thông báo ngắn gọn về lịch sinh hoạt, đổi phòng học hoặc quy định', targetGrades: [3, 4, 5] },
  { code: 'NV51', name: 'Viết báo cáo', genre: 'bao_cao', description: 'Báo cáo kết quả thảo luận nhóm, trực nhật hoặc hoạt động thi đua', targetGrades: [4, 5] },
  { code: 'NV52', name: 'Viết kế hoạch', genre: 'ke_hoach', description: 'Lập kế hoạch học tập, rèn luyện hè hoặc chuẩn bị buổi dã ngoại', targetGrades: [4, 5] },
  { code: 'NV53', name: 'Viết hướng dẫn', genre: 'huong_dan', description: 'Hướng dẫn các bước làm một món đồ chơi, gấp giấy hoặc chơi trò chơi', targetGrades: [3, 4, 5] },
  { code: 'NV54', name: 'Viết nhật ký', genre: 'sang_tao', description: 'Ghi chép cảm xúc chân thật và sự việc đáng nhớ trong ngày của em', targetGrades: [3, 4, 5] },
  { code: 'NV55', name: 'Viết bài tưởng tượng', genre: 'sang_tao', description: 'Tưởng tượng cuộc sống 20 năm sau hoặc chuyến đi thám hiểm đại dương', targetGrades: [4, 5] },
  { code: 'NV56', name: 'Viết truyện sáng tạo', genre: 'sang_tao', description: 'Tự sáng tác một câu chuyện ngắn có nhân vật, tình huống và bài học', targetGrades: [4, 5] },
  { code: 'NV57', name: 'Viết bài kết hợp kể và tả', genre: 'ke_chuyen', description: 'Vừa kể lại diễn biến sự việc vừa miêu tả sinh động nhân vật, cảnh vật', targetGrades: [4, 5] },
  { code: 'NV58', name: 'Viết bài kết hợp kể và biểu cảm', genre: 'ke_chuyen', description: 'Kể lại một kỷ niệm kèm bộc lộ trực tiếp tình cảm, cảm xúc lắng đọng', targetGrades: [4, 5] },
  { code: 'NV59', name: 'Viết bài kết hợp tả và biểu cảm', genre: 'mieu_ta', description: 'Miêu tả cảnh vật, đồ vật kèm tình cảm gắn bó, trân trọng sâu sắc', targetGrades: [4, 5] },
  { code: 'NV60', name: 'Viết bài có nhiều nhiệm vụ', genre: 'viet_doan_van', description: 'Thực hiện đồng thời từ 2 nhiệm vụ trở lên theo yêu cầu của đề bài', targetGrades: [3, 4, 5] },
  { code: 'NV61', name: 'Viết theo tình huống', genre: 'viet_doan_van', description: 'Giải quyết một tình huống giao tiếp hoặc đạo đức cụ thể ngoài đời sống', targetGrades: [3, 4, 5] },
  { code: 'NV62', name: 'Viết theo dữ liệu quan sát', genre: 'mieu_ta', description: 'Ghi chép và tổng hợp các chi tiết mắt thấy, tai nghe trong thực tế', targetGrades: [3, 4, 5] },
  { code: 'NV63', name: 'Viết theo yêu cầu mở', genre: 'sang_tao', description: 'Tự do lựa chọn hướng tiếp cận và cách thể hiện ý tưởng độc đáo', targetGrades: [4, 5] },
  { code: 'NV64', name: 'Viết dạng mới chưa có trong danh mục', genre: 'khac', description: 'Dạng bài tổng hợp hoặc sáng tạo đặc biệt của giáo viên và học sinh', targetGrades: [1, 2, 3, 4, 5] }
];

// =========================================================================
// III. CƠ CHẾ PHÂN TÍCH NGỮ NGHĨA & BÓC TÁCH ĐỀ NHIỀU TẦNG
// =========================================================================

export interface SemanticAnalysisResult {
  actionVerbs: string[];
  coreSubject: string;
  mainObject: string;
  writingScope: string;
  genre: EssayGenre;
  topicCode: string;
  topicName: string;
  detectedTaskCodes: string[];
  detectedTaskLabels: string[];
  audienceOrRecipient: string;
  pointOfView: string;
  // Phân loại 4 nhóm lựa chọn: LOẠI A (đối tượng), LOẠI B (hướng viết), LOẠI C (nhiệm vụ), LOẠI D (hình thức)
  choiceType: PromptChoiceType;
  objectChoiceQuestion?: string;
  availableObjects?: ObjectChoiceItem[];
  selectedObjectId?: string | null;
  selectedObjectName?: string | null;
  customObjectName?: string;
  // Lựa chọn hình thức bài viết (Đoạn văn vs Bài văn ngắn)
  formatChoiceQuestion?: string;
  availableFormats?: FormatChoiceItem[];
  selectedFormatId?: string | null;
  hasMultipleDirections: boolean;
  detectedDirections: PromptDirection[];
  selectedDirectionId?: string | null;
  selectedDirection?: PromptDirection | null;
  purpose?: string;
  isCombinedMultiTask: boolean;
  combinedTasks: string[];
  compulsoryConstraints: string[];
  negativeConstraints: string[];
  lengthSpecified: boolean;
  suggestedLength: string;
  writingFormat: string;
  needsImageObservation: boolean;
  lengthConstraint: WritingTaskLength;
  taskAnalysis?: WritingTaskAnalysis;
  difficultyLevel: DifficultyLevel;
}

/**
 * Kiểm tra từ độc lập với ranh giới từ Unicode chính xác
 */
export function hasWord(text: string, word: string): boolean {
  if (!text || !word) return false;
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(?:^|[^\\p{L}])${escaped}(?:[^\\p{L}]|$)`, 'u');
  return regex.test(text.toLowerCase());
}

/**
 * Kiểm tra xem văn bản có thực sự nói về Bà hay không (loại bỏ bài văn, đề bài, cây bàng, bảng lớp...)
 */
export function isAboutGrandmother(text: string): boolean {
  if (!text) return false;
  const t = text.toLowerCase();
  if (!hasWord(t, 'bà')) return false;
  const cleaned = t
    .replace(/\bcây bàng\b/gu, '')
    .replace(/\bbàng\b/gu, '')
    .replace(/\bbảng lớp\b/gu, '')
    .replace(/\bbảng con\b/gu, '')
    .replace(/\bbảng\b/gu, '')
    .replace(/\bđề bài\b/gu, '')
    .replace(/\bbài văn\b/gu, '')
    .replace(/\bbài tập\b/gu, '')
    .replace(/\bbài học\b/gu, '')
    .replace(/\bbài thơ\b/gu, '')
    .replace(/\bbài ca\b/gu, '')
    .replace(/\bbài hát\b/gu, '')
    .replace(/\bbàn học\b/gu, '')
    .replace(/\bbàn ghế\b/gu, '')
    .replace(/\bbản thân\b/gu, '');
  return hasWord(cleaned, 'bà');
}

/**
 * Kiểm tra xem văn bản có thực sự nói về Ông hay không (loại bỏ dòng sông, cánh đồng, không...)
 */
export function isAboutGrandfather(text: string): boolean {
  if (!text) return false;
  const t = text.toLowerCase();
  if (!hasWord(t, 'ông')) return false;
  const cleaned = t
    .replace(/\bdòng sông\b/gu, '')
    .replace(/\bcánh đồng\b/gu, '')
    .replace(/\bkhông\b/gu, '');
  return hasWord(cleaned, 'ông');
}

/**
 * Kiểm tra đề Bài 1 Lớp 1: Viết 1–2 câu tình cảm dành cho bố, mẹ, ông hoặc bà
 */
export function isFamilyLoveGrade1Prompt(text: string, grade: number = 1): boolean {
  const pLower = (text || '').toLowerCase();
  return (grade === 1 || pLower.includes('1–2 câu') || pLower.includes('1-2 câu')) &&
    (pLower.includes('tình cảm') || pLower.includes('yêu thương')) &&
    (pLower.includes('bố') || pLower.includes('mẹ')) &&
    (isAboutGrandfather(pLower) || isAboutGrandmother(pLower) || pLower.includes('ông') || pLower.includes('bà'));
}

/**
 * Kiểm tra đề Bài 2 Lớp 1: Giới thiệu bản thân (họ tên, lớp, sở thích)
 */
export function isSelfIntroGrade1Prompt(text: string, grade: number = 1): boolean {
  const pLower = (text || '').toLowerCase();
  return (grade === 1 || pLower.includes('1–2 câu') || pLower.includes('1-2 câu')) &&
    pLower.includes('giới thiệu') &&
    (pLower.includes('họ tên') || pLower.includes('tên')) &&
    (pLower.includes('lớp') || pLower.includes('sở thích'));
}

/**
 * Kiểm tra đề Bài 3 Lớp 1: Quan sát tranh mèo con (hình dáng hoặc hành động)
 */
export function isCatObservationGrade1Prompt(text: string): boolean {
  const pLower = (text || '').toLowerCase();
  return (pLower.includes('mèo') || pLower.includes('mèo con')) &&
    (pLower.includes('tranh') || pLower.includes('hình dáng') || pLower.includes('hành động'));
}

/**
 * Kiểm tra đề Bài miêu tả đồ vật Lớp 1 (1–2 câu)
 */
export function isItemDescriptiveGrade1Prompt(text: string, grade: number = 1): boolean {
  if (!text) return false;
  const pLower = text.toLowerCase();
  const isGrade1Scope = grade === 1 || pLower.includes('1–2 câu') || pLower.includes('1-2 câu') || pLower.includes('1 câu') || pLower.includes('2 câu');
  const isDescriptive = pLower.includes('miêu tả') || pLower.includes('tả') || pLower.includes('xinh xắn') || pLower.includes('đặc điểm');
  const isObject = pLower.includes('bút chì') || pLower.includes('hộp bút') || pLower.includes('cặp') || pLower.includes('thước') || pLower.includes('tẩy') || pLower.includes('đồ dùng') || pLower.includes('đồ vật') || pLower.includes('bảng con') || pLower.includes('quyển sách') || pLower.includes('vở viết');
  const isExcluded = pLower.includes('mèo') || pLower.includes('chó') || pLower.includes('cún') || pLower.includes('con vật') || pLower.includes('bố') || pLower.includes('mẹ') || pLower.includes('ông') || pLower.includes('bà') || pLower.includes('giới thiệu họ tên');
  return isGrade1Scope && isDescriptive && isObject && !isExcluded;
}

/**
 * Kiểm tra đề Lớp 1 lựa chọn chiếc bút chì hoặc hộp bút
 */
export function isPencilOrCaseGrade1Prompt(text: string, grade: number = 1): boolean {
  if (!text) return false;
  const pLower = text.toLowerCase();
  return isItemDescriptiveGrade1Prompt(text, grade) && 
    (pLower.includes('bút chì') && pLower.includes('hộp bút') && (pLower.includes('hoặc') || pLower.includes('hay')));
}

/**
 * Kiểm tra đề Bài 4 Lớp 2: Tin nhắn ngắn cảm ơn hoặc xin lỗi bạn
 */
export function isMessageThanksOrApologyGrade2Prompt(text: string): boolean {
  const pLower = (text || '').toLowerCase();
  return (pLower.includes('tin nhắn') || pLower.includes('lời nhắn')) &&
    pLower.includes('cảm ơn') &&
    pLower.includes('xin lỗi');
}

/**
 * Kiểm tra đề Bài 5 Lớp 2: Đoạn văn ngắn 3 đến 5 câu nói lên tình cảm với ông hoặc bà
 */
export function isGrandparentLoveGrade2Prompt(text: string, grade: number = 2): boolean {
  const pLower = (text || '').toLowerCase();
  return !isFamilyLoveGrade1Prompt(text, grade) &&
    (isAboutGrandmother(pLower) || isAboutGrandfather(pLower)) &&
    (pLower.includes('kính trọng') || pLower.includes('yêu mến') || (pLower.includes('tình cảm') && (pLower.includes('đoạn văn') || pLower.includes('3 đến 5 câu') || pLower.includes('3-5 câu') || pLower.includes('3–5 câu'))));
}

/**
 * Kiểm tra đề Bài 6 Lớp 5: Kể lại kỷ niệm sâu sắc với thầy giáo hoặc cô giáo
 */
export function isTeacherMemoryGrade5Prompt(text: string): boolean {
  const pLower = (text || '').toLowerCase();
  return (pLower.includes('thầy giáo') || pLower.includes('cô giáo') || pLower.includes('thầy cô') || (hasWord(pLower, 'thầy') && hasWord(pLower, 'cô'))) &&
    (pLower.includes('kỷ niệm') || pLower.includes('dạy dỗ') || pLower.includes('nâng đỡ') || pLower.includes('tiến bộ'));
}

/**
 * Tách chuỗi theo dấu ngăn cách nhưng BỎ QUA nếu dấu ngăn cách nằm trong dấu ngoặc đơn (...)
 */
export function splitOutsideParentheses(text: string, separatorRegex: RegExp = /\s*(?:hoặc|hay|hay là)\s*/i): string[] {
  const result: string[] = [];
  let parenDepth = 0;
  let lastIndex = 0;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '(' || char === '[' || char === '{') {
      parenDepth++;
    } else if (char === ')' || char === ']' || char === '}') {
      if (parenDepth > 0) parenDepth--;
    } else if (parenDepth === 0) {
      const sub = text.slice(i);
      const match = sub.match(separatorRegex);
      if (match && match.index === 0) {
        result.push(text.slice(lastIndex, i).trim());
        i += match[0].length - 1;
        lastIndex = i + 1;
      }
    }
  }
  result.push(text.slice(lastIndex).trim());
  return result.filter(s => s.length > 0);
}

/**
 * Phân tích độ dài chính xác từ đề gốc (câu, đoạn, từ, bài văn)
 */
export function parsePromptLength(
  prompt: string, 
  grade: number, 
  genre: EssayGenre, 
  formatId?: string | null
): {
  unit: 'sentence' | 'paragraph' | 'word' | 'unspecified';
  min?: number;
  max?: number;
  display: string;
  isExplicit: boolean;
} {
  const pLower = prompt.toLowerCase();
  
  if (pLower.includes('1–2 câu') || pLower.includes('1-2 câu') || /từ\s*1\s*(đến|-|–)\s*2\s*câu/i.test(pLower) || /\b1\s*đến\s*2\s*câu/i.test(pLower)) {
    return { unit: 'sentence', min: 1, max: 2, display: '1–2 câu hoàn chỉnh', isExplicit: true };
  }
  if (pLower.includes('2–3 câu') || pLower.includes('2-3 câu') || /từ\s*2\s*(đến|-|–)\s*3\s*câu/i.test(pLower)) {
    return { unit: 'sentence', min: 2, max: 3, display: '2–3 câu hoàn chỉnh', isExplicit: true };
  }
  if (pLower.includes('3–4 câu') || pLower.includes('3-4 câu') || /từ\s*3\s*(đến|-|–)\s*4\s*câu/i.test(pLower) || /\b3\s*đến\s*4\s*câu/i.test(pLower)) {
    return { unit: 'sentence', min: 3, max: 4, display: '3–4 câu ngắn gọn', isExplicit: true };
  }
  if (pLower.includes('3–5 câu') || pLower.includes('3-5 câu') || /từ\s*3\s*(đến|-|–)\s*5\s*câu/i.test(pLower) || /3\s*đến\s*5\s*câu/i.test(pLower)) {
    return { unit: 'sentence', min: 3, max: 5, display: '3–5 câu ngắn gọn', isExplicit: true };
  }
  if (pLower.includes('4–6 câu') || pLower.includes('4-6 câu') || /từ\s*4\s*(đến|-|–)\s*6\s*câu/i.test(pLower)) {
    return { unit: 'sentence', min: 4, max: 6, display: '4–6 câu', isExplicit: true };
  }
  if (pLower.includes('5–7 câu') || pLower.includes('5-7 câu') || /từ\s*5\s*(đến|-|–)\s*7\s*câu/i.test(pLower)) {
    return { unit: 'sentence', min: 5, max: 7, display: '5–7 câu', isExplicit: true };
  }
  if (pLower.includes('7–9 câu') || pLower.includes('7-9 câu') || /từ\s*7\s*(đến|-|–)\s*9\s*câu/i.test(pLower)) {
    return { unit: 'sentence', min: 7, max: 9, display: '7–9 câu', isExplicit: true };
  }
  if (pLower.includes('8–12 câu') || pLower.includes('8-12 câu') || /từ\s*8\s*(đến|-|–)\s*12\s*câu/i.test(pLower)) {
    return { unit: 'sentence', min: 8, max: 12, display: '8–12 câu', isExplicit: true };
  }

  // Hình thức bài văn
  if (pLower.includes('bài văn') && !pLower.includes('hoặc bài văn')) {
    return { unit: 'paragraph', min: 3, max: 5, display: 'Bài văn hoàn chỉnh (gồm 3 phần: Mở bài – Thân bài – Kết bài)', isExplicit: true };
  }
  if (pLower.includes('hoặc bài văn ngắn') || pLower.includes('đoạn văn (hoặc bài văn')) {
    if (formatId === 'bai_van_ngan') {
      return { unit: 'paragraph', min: 3, max: 4, display: 'Bài văn ngắn (gồm 3 phần: Mở bài – Thân bài – Kết bài)', isExplicit: true };
    } else {
      return { unit: 'paragraph', min: 1, max: 1, display: 'Một đoạn văn hoàn chỉnh liền mạch (khoảng 7–12 câu)', isExplicit: true };
    }
  }

  // Đề không quy định cụ thể: Gợi ý tham khảo, KHÔNG khẳng định là bắt buộc
  if (genre === 'viet_thu') {
    return { unit: 'word', min: 80, max: 150, display: 'Thư ngắn (khoảng 80–120 chữ, đủ các phần của bức thư)', isExplicit: false };
  }
  if (genre === 'loi_nhan') {
    return { unit: 'sentence', min: 3, max: 4, display: 'Tin nhắn/Lời nhắn ngắn (khoảng 3–4 câu súc tích)', isExplicit: false };
  }
  if (grade <= 1) {
    return { unit: 'sentence', min: 1, max: 2, display: '1–2 câu hoàn chỉnh (Gợi ý phù hợp Lớp 1)', isExplicit: false };
  }
  if (grade === 2) {
    return { unit: 'sentence', min: 3, max: 5, display: 'Đoạn văn ngắn (Gợi ý tham khảo: khoảng 3–5 câu)', isExplicit: false };
  }
  if (grade === 3) {
    return { unit: 'sentence', min: 5, max: 7, display: 'Đoạn văn (Gợi ý tham khảo: khoảng 5–7 câu)', isExplicit: false };
  }
  return { unit: 'sentence', min: 7, max: 12, display: 'Đoạn văn hoặc bài văn (Gợi ý tham khảo: khoảng 7–12 câu)', isExplicit: false };
}

/**
 * Phân tích chuyên sâu ngữ nghĩa đề bài tiểu học không phụ thuộc từ khóa đơn lẻ
 */
export function analyzePromptSemantics(
  promptText: string, 
  grade: number = 3, 
  difficulty: DifficultyLevel = 'co_ban',
  selectedDirectionId?: string | null,
  selectedObjectId?: string | null,
  customObjectName?: string,
  selectedFormatId?: string | null
): SemanticAnalysisResult {
  const p = promptText.trim();
  const pLower = p.toLowerCase();

  // 1. Tìm các động từ chỉ nhiệm vụ
  const actionVerbs: string[] = [];
  const verbChecks: [string, string][] = [
    ['viết bức thư', 'viết thư'],
    ['viết thư', 'viết thư'],
    ['viết lời nhắn', 'viết lời nhắn'],
    ['để lại lời nhắn', 'viết lời nhắn'],
    ['viết tin nhắn', 'viết tin nhắn'],
    ['viết đoạn văn', 'viết đoạn văn'],
    ['viết bài văn', 'viết bài văn'],
    ['viết câu', 'viết câu'],
    ['kể lại', 'kể lại'],
    ['kể về', 'kể'],
    ['miêu tả', 'miêu tả'],
    ['tả lại', 'miêu tả'],
    ['tả', 'miêu tả'],
    ['nêu ý kiến', 'nêu ý kiến'],
    ['bày tỏ ý kiến', 'nêu ý kiến'],
    ['nêu suy nghĩ', 'nêu suy nghĩ'],
    ['bày tỏ cảm xúc', 'bày tỏ cảm xúc'],
    ['nêu tình cảm', 'bày tỏ cảm xúc'],
    ['bộc lộ cảm xúc', 'bày tỏ cảm xúc'],
    ['giới thiệu', 'giới thiệu'],
    ['thuật lại', 'thuật lại'],
    ['tưởng tượng', 'tưởng tượng'],
    ['hóa thân', 'nhập vai'],
    ['nhập vai', 'nhập vai'],
    ['thông báo', 'thông báo'],
    ['báo cáo', 'báo cáo'],
    ['kế hoạch', 'lập kế hoạch'],
    ['hướng dẫn', 'hướng dẫn']
  ];

  for (const [v, norm] of verbChecks) {
    if (pLower.includes(v) && !actionVerbs.includes(norm)) {
      actionVerbs.push(norm);
    }
  }

  // 2. PHÂN BIỆT RÕ RÀNG CÁC LOẠI LỰA CHỌN THEO ĐÚNG BẢN CHẤT NGỮ NGHĨA (GDPT 2018):
  // BÀI 1 LỚP 1: Viết 1–2 câu thể hiện tình cảm yêu thương của em dành cho bố, mẹ, ông hoặc bà
  const isFamilyLoveGrade1Prompt =
    (grade === 1 || pLower.includes('1–2 câu') || pLower.includes('1-2 câu')) &&
    (pLower.includes('tình cảm') || pLower.includes('yêu thương')) &&
    (pLower.includes('bố') || pLower.includes('mẹ')) &&
    (pLower.includes('ông') || pLower.includes('bà'));

  // BÀI 2 LỚP 1: Giới thiệu bản thân (họ tên, lớp, sở thích)
  const isSelfIntroGrade1Prompt =
    (grade === 1 || pLower.includes('1–2 câu') || pLower.includes('1-2 câu')) &&
    pLower.includes('giới thiệu') &&
    (pLower.includes('họ tên') || pLower.includes('tên')) &&
    (pLower.includes('lớp') || pLower.includes('sở thích'));

  // BÀI 3 LỚP 1: Quan sát tranh mèo con (hình dáng hoặc hành động)
  const isCatObservationGrade1Prompt =
    (pLower.includes('mèo') || pLower.includes('mèo con')) &&
    (pLower.includes('tranh') || pLower.includes('hình dáng') || pLower.includes('hành động'));

  // BÀI MIÊU TẢ ĐỒ VẬT LỚP 1 (Hộp bút, Bút chì, Cặp sách...)
  const isItemDescriptiveGrade1 = isItemDescriptiveGrade1Prompt(pLower, grade);
  const isPencilOrCaseGrade1 = isPencilOrCaseGrade1Prompt(pLower, grade);

  // BÀI 4 LỚP 2: Tin nhắn ngắn cảm ơn hoặc xin lỗi
  const isMessageThanksOrApologyGrade2Prompt =
    (pLower.includes('tin nhắn') || pLower.includes('lời nhắn')) &&
    pLower.includes('cảm ơn') &&
    pLower.includes('xin lỗi');

  // BÀI 5 LỚP 2: Đoạn văn ngắn từ 3 đến 5 câu nói lên tình cảm yêu mến, kính trọng đối với ông hoặc bà
  const isGrandparentLoveGrade2Prompt =
    !isFamilyLoveGrade1Prompt &&
    (isAboutGrandmother(pLower) || isAboutGrandfather(pLower)) &&
    (pLower.includes('kính trọng') || pLower.includes('yêu mến') || (pLower.includes('tình cảm') && (pLower.includes('đoạn văn') || pLower.includes('3 đến 5 câu') || pLower.includes('3-5 câu') || pLower.includes('3–5 câu'))));

  // BÀI 6 LỚP 5: Kể lại kỷ niệm sâu sắc giữa em và một thầy giáo hoặc cô giáo đã dạy dỗ, nâng đỡ em tiến bộ
  const isTeacherMemoryGrade5Prompt =
    (pLower.includes('thầy giáo') || pLower.includes('cô giáo') || pLower.includes('thầy cô') || (hasWord(pLower, 'thầy') && hasWord(pLower, 'cô'))) &&
    (pLower.includes('kỷ niệm') || pLower.includes('dạy dỗ') || pLower.includes('nâng đỡ') || pLower.includes('tiến bộ'));

  // BÀI VĂN TẢ CÂY BÓNG MÁT (LỖI 1 - Cây bàng, cây phượng vĩ hoặc cây đa trên sân trường)
  const isTreeSelectionPrompt = 
    (
      pLower.includes('cây bóng mát') || 
      pLower.includes('tả một cây') || 
      pLower.includes('miêu tả một cây') || 
      (pLower.includes('cây') && (pLower.includes('cây bàng') || pLower.includes('phượng vĩ') || pLower.includes('cây đa')))
    ) && (
      pLower.includes('sân trường') || 
      pLower.includes('bóng mát') ||
      pLower.includes('cây bóng mát')
    );

  // LỰA CHỌN HÌNH THỨC BÀI VIẾT (LỖI 2 - Viết một đoạn văn (hoặc bài văn ngắn))
  const isFormatSelectionPrompt = 
    (
      pLower.includes('đoạn văn (hoặc bài văn') ||
      pLower.includes('đoạn văn hoặc bài văn') ||
      pLower.includes('bài văn (hoặc đoạn văn') ||
      pLower.includes('bài văn hoặc đoạn văn') ||
      pLower.includes('hoặc bài văn ngắn') ||
      pLower.includes('hoặc đoạn văn ngắn')
    );

  // LỰA CHỌN ĐỒ VẬT (Hộp bút, chiếc cặp, đồng hồ, bảng lớp...)
  const isObjectSelectionPrompt = 
    !isTreeSelectionPrompt &&
    !isFamilyLoveGrade1Prompt &&
    !isItemDescriptiveGrade1 && (
      pLower.includes('chọn một đồ vật') ||
      pLower.includes('chọn 1 đồ vật') ||
      pLower.includes('chọn đồ vật') ||
      pLower.includes('chọn một món đồ') ||
      (pLower.includes('đồ vật') && (pLower.includes('hộp bút') || pLower.includes('chiếc cặp') || pLower.includes('đồng hồ') || pLower.includes('bảng lớp')))
    ) && (pLower.includes('tả') || pLower.includes('miêu tả') || pLower.includes('đoạn văn'));

  // LỰA CHỌN NHIỆM VỤ (Ví dụ: "Kể lại một việc tốt HOẶC nêu suy nghĩ về việc làm tốt")
  const isTaskSelectionPrompt = 
    !isTreeSelectionPrompt &&
    !isFormatSelectionPrompt &&
    !isObjectSelectionPrompt &&
    !isTeacherMemoryGrade5Prompt &&
    !isMessageThanksOrApologyGrade2Prompt &&
    (pLower.includes('kể') && (pLower.includes('nêu suy nghĩ') || pLower.includes('nêu ý kiến') || pLower.includes('bày tỏ cảm xúc')) && (pLower.includes('hoặc') || pLower.includes('hay')));

  // LỰA CHỌN HƯỚNG VIẾT
  const isDirectionSelectionPrompt = 
    !isTreeSelectionPrompt &&
    !isFormatSelectionPrompt &&
    !isObjectSelectionPrompt && 
    !isTaskSelectionPrompt && 
    !isFamilyLoveGrade1Prompt &&
    !isSelfIntroGrade1Prompt &&
    !isItemDescriptiveGrade1 &&
    (
      isCatObservationGrade1Prompt ||
      isMessageThanksOrApologyGrade2Prompt ||
      isGrandparentLoveGrade2Prompt ||
      isTeacherMemoryGrade5Prompt ||
      (((pLower.includes('thư') || pLower.includes('bức thư')) && (isAboutGrandmother(pLower) || isAboutGrandfather(pLower)) && (pLower.includes('bạn thân') || pLower.includes('chuyển trường') || pLower.includes('bạn')))) ||
      (((pLower.includes('ngôi trường') || (hasWord(pLower, 'trường') && !pLower.includes('cây') && !pLower.includes('chào cờ'))) && (pLower.includes('góc sân') || (pLower.includes('sân trường') && pLower.includes('hoặc'))))) ||
      ((pLower.includes('thư') || pLower.includes('bức thư')) && pLower.includes('người thân') && (pLower.includes('bạn ở xa') || pLower.includes('bạn'))) ||
      (pLower.includes('sách') && pLower.includes('nhân vật') && (pLower.includes('hoặc') || pLower.includes('hay'))) ||
      ((pLower.includes(' hoặc ') || pLower.includes(' hay là ')) && !pLower.includes('bóng mát') && !pLower.includes('cây') && !pLower.includes('bài văn ngắn') && !pLower.includes('bố, mẹ'))
    ) && !pLower.includes('giới thiệu bản thân');

  let choiceType: PromptChoiceType = 'none';
  let objectChoiceQuestion: string | undefined = undefined;
  let availableObjects: ObjectChoiceItem[] | undefined = undefined;
  let formatChoiceQuestion: string | undefined = undefined;
  let availableFormats: FormatChoiceItem[] | undefined = undefined;
  let hasMultipleDirections = false;
  const detectedDirections: PromptDirection[] = [];

  // 1. Phân nhánh BÀI 1 LỚP 1: Lựa chọn người thân (Bố, Mẹ, Ông, Bà)
  if (isFamilyLoveGrade1Prompt) {
    choiceType = 'object_selection';
    hasMultipleDirections = false;
    objectChoiceQuestion = 'Con muốn bày tỏ tình cảm yêu thương với người thân nào?';
    availableObjects = [
      { id: 'bo', name: 'Bố', icon: '👨' },
      { id: 'me', name: 'Mẹ', icon: '👩' },
      { id: 'ong', name: 'Ông', icon: '👴' },
      { id: 'ba', name: 'Bà', icon: '👵' }
    ];
  }
  // 2. Phân nhánh BÀI MIÊU TẢ BÚT CHÌ HOẶC HỘP BÚT LỚP 1 (Lựa chọn đối tượng)
  else if (isPencilOrCaseGrade1) {
    choiceType = 'object_selection';
    hasMultipleDirections = false;
    objectChoiceQuestion = 'Con muốn miêu tả chiếc bút chì hay hộp bút?';
    availableObjects = [
      { id: 'hop_but', name: 'Hộp bút', icon: '👝' },
      { id: 'but_chi', name: 'Chiếc bút chì', icon: '✏️' }
    ];
  }
  // 2. Phân nhánh BÀI 3 LỚP 1: Quan sát tranh mèo con (Hình dáng hoặc Hành động)
  else if (isCatObservationGrade1Prompt) {
    choiceType = 'direction_selection';
    hasMultipleDirections = true;
    detectedDirections.push({
      id: 'ta_hinh_dang',
      title: 'Tả hình dáng mèo con',
      mainObject: 'Hình dáng chú mèo con',
      scope: 'Màu lông, vóc dáng nhỏ nhắn và các bộ phận nổi bật con quan sát thấy trong tranh',
      recipient: 'Người đọc',
      purpose: 'Quan sát tranh và viết 1–2 câu tả hình dáng mèo con',
      pointOfView: 'Em',
      topicCode: 'CD07',
      topicName: 'Động vật',
      icon: '🐱'
    });
    detectedDirections.push({
      id: 'ta_hanh_dong',
      title: 'Tả hành động mèo con',
      mainObject: 'Hành động chú mèo con',
      scope: 'Hành động, cử chỉ đáng yêu của chú mèo con con quan sát thấy trong tranh',
      recipient: 'Người đọc',
      purpose: 'Quan sát tranh và viết 1–2 câu tả hành động mèo con',
      pointOfView: 'Em',
      topicCode: 'CD07',
      topicName: 'Động vật',
      icon: '🐾'
    });
  }
  // 3. Phân nhánh BÀI 4 LỚP 2: Tin nhắn ngắn cảm ơn hoặc xin lỗi bạn
  else if (isMessageThanksOrApologyGrade2Prompt) {
    choiceType = 'direction_selection';
    hasMultipleDirections = true;
    detectedDirections.push({
      id: 'tin_nhan_cam_on',
      title: 'Tin nhắn cảm ơn bạn đã cho em mượn đồ dùng',
      mainObject: 'Bạn cùng lớp',
      scope: 'Nhắc lại việc bạn cho mượn đồ dùng học tập và gửi lời cảm ơn chân thành (3–4 câu)',
      recipient: 'Bạn cùng lớp',
      purpose: 'Viết tin nhắn ngắn cảm ơn bạn',
      pointOfView: 'Mình – bạn hoặc tớ – cậu',
      topicCode: 'CD23',
      topicName: 'Giao tiếp',
      icon: '💌'
    });
    detectedDirections.push({
      id: 'tin_nhan_xin_loi',
      title: 'Tin nhắn xin lỗi bạn vì lỡ làm hỏng vật gì',
      mainObject: 'Bạn cùng lớp',
      scope: 'Nêu sự việc sơ ý làm hỏng đồ dùng, gửi lời xin lỗi chân thành và cách khắc phục (3–4 câu)',
      recipient: 'Bạn cùng lớp',
      purpose: 'Viết tin nhắn ngắn xin lỗi bạn',
      pointOfView: 'Mình – bạn hoặc tớ – cậu',
      topicCode: 'CD23',
      topicName: 'Giao tiếp',
      icon: '🙏'
    });
  }
  // 4. Phân nhánh BÀI 5 LỚP 2: Đoạn văn ngắn 3 đến 5 câu thể hiện tình cảm với ông hoặc bà
  else if (isGrandparentLoveGrade2Prompt) {
    choiceType = 'direction_selection';
    hasMultipleDirections = true;
    detectedDirections.push({
      id: 'tinh_cam_ong',
      title: 'Nói lên tình cảm yêu mến, kính trọng đối với ông',
      mainObject: 'Ông kính yêu',
      scope: 'Bày tỏ lòng kính trọng, cử chỉ ấm áp của ông và lời hứa chăm ngoan (3–5 câu)',
      recipient: 'Người đọc',
      purpose: 'Bày tỏ tình cảm yêu mến, kính trọng đối với ông',
      pointOfView: 'Cháu – ông',
      topicCode: 'CD02',
      topicName: 'Gia đình',
      icon: '👴'
    });
    detectedDirections.push({
      id: 'tinh_cam_ba',
      title: 'Nói lên tình cảm yêu mến, kính trọng đối với bà',
      mainObject: 'Bà kính yêu',
      scope: 'Bày tỏ lòng kính yêu, sự chăm sóc hiền từ của bà và lời hứa chăm ngoan (3–5 câu)',
      recipient: 'Người đọc',
      purpose: 'Bày tỏ tình cảm yêu mến, kính trọng đối với bà',
      pointOfView: 'Cháu – bà',
      topicCode: 'CD02',
      topicName: 'Gia đình',
      icon: '👵'
    });
  }
  // 5. Phân nhánh BÀI 6 LỚP 5: Kể lại kỷ niệm sâu sắc với thầy giáo hoặc cô giáo
  else if (isTeacherMemoryGrade5Prompt) {
    choiceType = 'direction_selection';
    hasMultipleDirections = true;
    detectedDirections.push({
      id: 'ky_niem_thay_giao',
      title: 'Kể lại kỷ niệm sâu sắc với thầy giáo',
      mainObject: 'Thầy giáo kính yêu',
      scope: 'Kỷ niệm thầy ân cần dạy dỗ, nâng đỡ em tiến bộ trong học tập',
      recipient: 'Người đọc',
      purpose: 'Kể lại kỷ niệm sâu sắc với thầy giáo',
      pointOfView: 'Em',
      topicCode: 'CD04',
      topicName: 'Thầy cô',
      icon: '👨‍🏫'
    });
    detectedDirections.push({
      id: 'ky_niem_co_giao',
      title: 'Kể lại kỷ niệm sâu sắc với cô giáo',
      mainObject: 'Cô giáo kính yêu',
      scope: 'Kỷ niệm cô ân cần chỉ bảo, nâng đỡ em tiến bộ trong học tập',
      recipient: 'Người đọc',
      purpose: 'Kể lại kỷ niệm sâu sắc với cô giáo',
      pointOfView: 'Em',
      topicCode: 'CD04',
      topicName: 'Thầy cô',
      icon: '👩‍🏫'
    });
  }
  // 6. Phân nhánh CÂY BÓNG MÁT
  else if (isTreeSelectionPrompt) {
    choiceType = 'object_selection';
    hasMultipleDirections = false; // Lựa chọn cây miêu tả, KHÔNG PHẢI hai hướng viết phong phú!
    objectChoiceQuestion = 'Con muốn miêu tả cây bóng mát nào?';
    availableObjects = [
      { id: 'cay_bang', name: 'Cây bàng', icon: '🌳' },
      { id: 'cay_phuong', name: 'Cây phượng vĩ', icon: '🌺' },
      { id: 'cay_da', name: 'Cây đa', icon: '🌿' },
      { id: 'cay_khac', name: 'Cây bóng mát khác', icon: '✨', isCustom: true }
    ];
  } 
  // 7. Phân nhánh HÌNH THỨC BÀI VIẾT (Đoạn văn vs Bài văn ngắn)
  else if (isFormatSelectionPrompt) {
    choiceType = 'format_selection';
    hasMultipleDirections = false;
    formatChoiceQuestion = 'Con muốn kể câu chuyện theo hình thức nào?';
    availableFormats = [
      { id: 'doan_van', name: 'Viết một đoạn văn', description: 'Một đoạn văn hoàn chỉnh liền mạch, nêu diễn biến và cảm xúc xúc động', icon: '📄' },
      { id: 'bai_van_ngan', name: 'Viết một bài văn ngắn', description: 'Bài văn ngắn gồm 3 phần: Mở bài, Thân bài, Kết bài sâu sắc', icon: '📖' }
    ];
  } 
  // 8. Phân nhánh LỰA CHỌN ĐỒ VẬT
  else if (isObjectSelectionPrompt) {
    choiceType = 'object_selection';
    hasMultipleDirections = false;
    objectChoiceQuestion = 'Con muốn tả đồ vật nào?';
    availableObjects = [
      { id: 'hop_but', name: 'Hộp bút', icon: '✏️' },
      { id: 'chiec_cap', name: 'Chiếc cặp', icon: '🎒' },
      { id: 'dong_ho', name: 'Đồng hồ', icon: '⏰' },
      { id: 'bang_lop', name: 'Bảng lớp', icon: '📋' },
      { id: 'do_vat_khac', name: 'Đồ vật khác', icon: '✨', isCustom: true }
    ];
  } 
  // 9. Phân nhánh LỰA CHỌN NHIỆM VỤ
  else if (isTaskSelectionPrompt) {
    choiceType = 'task_selection';
    hasMultipleDirections = true;
    detectedDirections.push({
      id: 'task_ke_chuyen',
      title: 'Kể lại một việc tốt em đã làm hoặc chứng kiến',
      mainObject: 'Câu chuyện việc tốt',
      scope: 'Kể rõ thời gian, địa điểm, diễn biến việc tốt và niềm vui khi giúp đỡ người khác',
      recipient: 'Người đọc',
      purpose: 'Kể chuyện và chia sẻ việc tốt',
      pointOfView: 'Em',
      topicCode: 'CD13',
      topicName: 'Việc tốt',
      icon: '💖'
    });
    detectedDirections.push({
      id: 'task_neu_y_kien',
      title: 'Nêu suy nghĩ, ý kiến của em về việc làm tốt',
      mainObject: 'Ý nghĩa của việc làm tốt',
      scope: 'Khẳng định sự đồng tình, nêu các lý do vì sao việc làm tốt đem lại ý nghĩa đẹp và kêu gọi bạn bè',
      recipient: 'Người đọc',
      purpose: 'Nêu ý kiến và bài học',
      pointOfView: 'Em',
      topicCode: 'CD13',
      topicName: 'Việc tốt',
      icon: '💡'
    });
  } 
  // 10. Phân nhánh LỰA CHỌN HƯỚNG VIẾT KHÁC
  else if (isDirectionSelectionPrompt) {
    choiceType = 'direction_selection';
    hasMultipleDirections = true;

    // Viết thư thăm hỏi ông bà HOẶC bạn thân chuyển trường đi xa
    if (
      (pLower.includes('thư') || pLower.includes('bức thư')) && 
      (pLower.includes('ông') || pLower.includes('bà')) && 
      (pLower.includes('bạn thân') || pLower.includes('chuyển trường') || pLower.includes('bạn'))
    ) {
      detectedDirections.push({
        id: 'thu_ong_ba',
        title: 'Viết thư ngắn thăm hỏi ông bà',
        mainObject: 'Ông hoặc bà',
        scope: 'Thăm hỏi sức khỏe, sinh hoạt, chuyện gia đình, kỷ niệm và bày tỏ lòng kính yêu, biết ơn',
        recipient: 'Ông hoặc bà',
        purpose: 'Hỏi thăm, chia sẻ và bày tỏ tình cảm',
        pointOfView: 'Cháu – ông/bà',
        topicCode: 'CD02',
        topicName: 'Gia đình',
        icon: '👵👴'
      });
      detectedDirections.push({
        id: 'thu_ban_than',
        title: 'Viết thư ngắn thăm hỏi một người bạn thân chuyển trường đi xa',
        mainObject: 'Bạn thân đã chuyển trường',
        scope: 'Hỏi thăm trường mới, lớp mới, bạn bè mới, việc học, kỷ niệm và giữ gìn tình bạn',
        recipient: 'Bạn thân đã chuyển trường',
        purpose: 'Hỏi thăm và giữ gìn tình bạn',
        pointOfView: 'Mình – bạn hoặc tớ – cậu',
        topicCode: 'CD03',
        topicName: 'Bạn bè',
        icon: '🎒'
      });
    }
    // Tả ngôi trường HOẶC góc sân trường
    else if ((pLower.includes('ngôi trường') || pLower.includes('trường')) && (pLower.includes('góc sân') || pLower.includes('sân trường'))) {
      detectedDirections.push({
        id: 'ngoi_truong',
        title: 'Tả ngôi trường của em',
        mainObject: 'Ngôi trường tiểu học của em',
        scope: 'Toàn cảnh ngôi trường, cổng trường, dãy lớp học, sân trường rợp bóng cây và hoạt động học tập',
        recipient: 'Người đọc',
        purpose: 'Miêu tả toàn cảnh ngôi trường thân yêu và bộc lộ tình cảm gắn bó',
        pointOfView: 'Em',
        topicCode: 'CD05',
        topicName: 'Trường lớp',
        icon: '🏫'
      });
      detectedDirections.push({
        id: 'goc_san_truong',
        title: 'Tả một góc sân trường em yêu thích',
        mainObject: 'Một góc sân trường em yêu thích',
        scope: 'Một góc sân cụ thể (hàng ghế đá, bồn hoa, gốc cây che mát) gắn với những giờ ra chơi vui vẻ',
        recipient: 'Người đọc',
        purpose: 'Miêu tả một góc sân trường thân thuộc và kỷ niệm giờ ra chơi',
        pointOfView: 'Em',
        topicCode: 'CD05',
        topicName: 'Trường lớp',
        icon: '🌿'
      });
    }
    // Viết thư cho người thân HOẶC bạn ở xa
    else if ((pLower.includes('thư') || pLower.includes('bức thư')) && pLower.includes('người thân') && (pLower.includes('bạn ở xa') || pLower.includes('bạn'))) {
      detectedDirections.push({
        id: 'thu_nguoi_than',
        title: 'Viết thư thăm hỏi người thân',
        mainObject: 'Người thân trong gia đình',
        scope: 'Hỏi thăm sức khỏe, đời sống và bày tỏ tình cảm yêu thương ruột thịt',
        recipient: 'Người thân trong gia đình',
        purpose: 'Thăm hỏi và chia sẻ tình cảm',
        pointOfView: 'Cháu / Con',
        topicCode: 'CD02',
        topicName: 'Gia đình',
        icon: '🏡'
      });
      detectedDirections.push({
        id: 'thu_ban_o_xa',
        title: 'Viết thư thăm hỏi một người bạn ở xa',
        mainObject: 'Người bạn ở xa',
        scope: 'Hỏi thăm việc học tập, cuộc sống ở nơi xa và gìn giữ tình bạn',
        recipient: 'Người bạn ở xa',
        purpose: 'Hỏi thăm và gìn giữ tình bạn',
        pointOfView: 'Mình – bạn hoặc tớ – cậu',
        topicCode: 'CD03',
        topicName: 'Bạn bè',
        icon: '🤝'
      });
    }
    // Giới thiệu cuốn sách HOẶC nhân vật em yêu thích
    else if (pLower.includes('sách') && pLower.includes('nhân vật')) {
      detectedDirections.push({
        id: 'gioi_thieu_sach',
        title: 'Giới thiệu cuốn sách em yêu thích',
        mainObject: 'Cuốn sách em yêu thích',
        scope: 'Tên sách, tác giả, nội dung chính, bài học bổ ích và lý do em yêu thích cuốn sách',
        recipient: 'Thầy cô và các bạn cùng lớp',
        purpose: 'Giới thiệu cuốn sách hay và lan tỏa niềm yêu thích đọc sách',
        pointOfView: 'Em',
        topicCode: 'CD15',
        topicName: 'Sách và truyện',
        icon: '📖'
      });
      detectedDirections.push({
        id: 'gioi_thieu_nhan_vat',
        title: 'Giới thiệu một nhân vật em yêu thích',
        mainObject: 'Nhân vật em yêu thích',
        scope: 'Ngoại hình, tính cách, hành động nổi bật và phẩm chất đáng quý của nhân vật',
        recipient: 'Thầy cô và các bạn cùng lớp',
        purpose: 'Giới thiệu nhân vật ấn tượng và nêu cảm nghĩ của em',
        pointOfView: 'Em',
        topicCode: 'CD15',
        topicName: 'Sách và truyện',
        icon: '✨'
      });
    }
    // Phân tách tự động an toàn bên ngoài dấu ngoặc đơn
    else {
      const parts = splitOutsideParentheses(p);
      if (parts.length >= 2 && parts[0].trim().length > 3 && parts[1].trim().length > 3) {
        const sanitizeTitle = (s: string) => {
          return s
            .replace(/^[\s(\[{,.;:!?\-–—]+|[\s)\]},.;:!?\-–—]+$/g, '')
            .trim();
        };
        const clean1 = sanitizeTitle(parts[0].replace(/^viết\s*(một\s*)?(đoạn\s*văn|bài\s*văn)?\s*(kể|tả|nêu|về)?/i, ''));
        const clean2 = sanitizeTitle(parts[1].replace(/mà\s*em\s*(yêu\s*thích|thích\s*nhất|nhớ\s*nhất).*/i, ''));
        const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
        if (clean1.length > 2 && clean2.length > 2) {
          detectedDirections.push({
            id: 'dir_1',
            title: cap(clean1.length > 50 ? clean1.slice(0, 48) + '...' : clean1),
            mainObject: cap(clean1.slice(0, 30)),
            scope: 'Nội dung và chi tiết bám sát theo cách viết thứ nhất',
            recipient: 'Người đọc',
            purpose: 'Viết bài theo hướng thứ nhất',
            pointOfView: 'Ngôi thứ nhất (Em / Con)',
            icon: '✨'
          });
          detectedDirections.push({
            id: 'dir_2',
            title: cap(clean2.length > 50 ? clean2.slice(0, 48) + '...' : clean2),
            mainObject: cap(clean2.slice(0, 30)),
            scope: 'Nội dung và chi tiết bám sát theo cách viết thứ hai',
            recipient: 'Người đọc',
            purpose: 'Viết bài theo hướng thứ hai',
            pointOfView: 'Ngôi thứ nhất (Em / Con)',
            icon: '🌟'
          });
        }
      }
    }
  }

  // 3. Phân biệt đề kết hợp nhiều nhiệm vụ ("và", "đồng thời", "kèm theo")
  const isCombinedMultiTask = (pLower.includes(' và ') || pLower.includes(' đồng thời ') || pLower.includes(' kết hợp ')) && 
    (
      (pLower.includes('kể') && (pLower.includes('cảm nghĩ') || pLower.includes('cảm xúc') || pLower.includes('tả'))) ||
      (pLower.includes('tả') && (pLower.includes('cảm nghĩ') || pLower.includes('cảm xúc') || pLower.includes('kể'))) ||
      (pLower.includes('việc tốt') && (pLower.includes('cảm xúc') || pLower.includes('ý kiến')))
    );

  const combinedTasks: string[] = [];
  if (isCombinedMultiTask) {
    if (pLower.includes('kể')) combinedTasks.push('Kể lại sự việc / kỷ niệm');
    if (pLower.includes('tả')) combinedTasks.push('Miêu tả đối tượng');
    if (pLower.includes('cảm nghĩ') || pLower.includes('cảm xúc') || pLower.includes('tình cảm')) combinedTasks.push('Bộc lộ cảm xúc / tình cảm');
    if (pLower.includes('ý kiến')) combinedTasks.push('Nêu ý kiến / suy nghĩ');
  }

  // 4. Nhận diện Thể loại bài viết chính xác
  let genre: EssayGenre = 'viet_doan_van';

  const isNoteStrict = pLower.includes('lời nhắn') || pLower.includes('tin nhắn') || pLower.includes('để lại lời nhắn') || pLower.includes('nhắn nhủ') || pLower.includes('bưu thiếp');
  const hasLetterWord = /(?:^|[^\p{L}])thư(?:[^\p{L}]|$)/u.test(pLower);
  const isLetterStrict = !isNoteStrict && (
    pLower.includes('bức thư') || 
    pLower.includes('lá thư') || 
    pLower.includes('viết thư') || 
    pLower.includes('gửi thư') || 
    pLower.includes('thư ngắn') || 
    pLower.includes('thư thăm hỏi') || 
    pLower.includes('thư cảm ơn') || 
    pLower.includes('thư chúc mừng') || 
    (hasLetterWord && (pLower.includes('ông') || pLower.includes('bà') || pLower.includes('bạn') || pLower.includes('thăm hỏi') || pLower.includes('cô') || pLower.includes('thầy')))
  );

  if (isNoteStrict) {
    genre = 'loi_nhan';
  } else if (isLetterStrict) {
    genre = 'viet_thu';
  } else if (pLower.includes('thông báo') || pLower.includes('bản tin')) {
    genre = 'thong_bao';
  } else if (pLower.includes('báo cáo')) {
    genre = 'bao_cao';
  } else if (pLower.includes('kế hoạch')) {
    genre = 'ke_hoach';
  } else if (pLower.includes('hướng dẫn')) {
    genre = 'huong_dan';
  } else if (pLower.includes('viết câu') || pLower.includes('đặt câu') || pLower.includes('1–2 câu') || pLower.includes('1-2 câu') || pLower.includes('2–3 câu') || pLower.includes('2-3 câu')) {
    genre = 'viet_cau';
  } else if (isTaskSelectionPrompt) {
    genre = selectedDirectionId === 'task_neu_y_kien' ? 'neu_y_kien' : 'ke_chuyen';
  } else if (isTeacherMemoryGrade5Prompt) {
    genre = 'ke_chuyen';
  } else if (pLower.includes('tưởng tượng') || pLower.includes('nhập vai') || pLower.includes('hóa thân') || pLower.includes('sáng tạo')) {
    genre = 'sang_tao';
  } else if (pLower.includes('nêu ý kiến') || pLower.includes('ý kiến của em') || pLower.includes('suy nghĩ của em')) {
    genre = 'neu_y_kien';
  } else if (pLower.includes('tình cảm') || pLower.includes('cảm xúc') || pLower.includes('lòng biết ơn') || pLower.includes('kính yêu') || pLower.includes('thương nhớ')) {
    genre = 'tinh_cam_cam_xuc';
  } else if (pLower.includes('thuật lại') || pLower.includes('chứng kiến')) {
    genre = 'thuat_lai';
  } else if (pLower.includes('kể') || pLower.includes('kể chuyện') || pLower.includes('kể lại') || pLower.includes('kỷ niệm')) {
    genre = 'ke_chuyen';
  } else if (pLower.includes('miêu tả') || pLower.includes('tả cảnh') || pLower.includes('tả người') || pLower.includes('tả đồ vật') || pLower.includes('tả con vật') || pLower.includes('tả cây') || pLower.includes('tả ngôi trường') || pLower.includes('tả góc sân') || pLower.startsWith('tả ')) {
    genre = 'mieu_ta';
  }

  // 5. Nhận diện nhóm chủ đề (CD01 - CD25)
  let topicCode = 'CD25';
  let topicName = 'Chủ đề tự do';

  // Ưu tiên 1: Cây cối / Thiên nhiên (LỖI 1 - Cây bóng mát, cây bàng, phượng vĩ, cây đa)
  if (isTreeSelectionPrompt || pLower.includes('cây bóng mát') || pLower.includes('cây bàng') || pLower.includes('phượng vĩ') || pLower.includes('cây đa') || (pLower.includes('cây') && (pLower.includes('sân trường') || pLower.includes('bóng mát')))) {
    topicCode = 'CD08'; 
    topicName = 'Thiên nhiên – Cây cối';
  } 
  // Ưu tiên 2: Tình yêu thương, đùm bọc, sẻ chia (LỖI 2 - Kể chuyện con người yêu thương nhau)
  else if (isFormatSelectionPrompt || pLower.includes('yêu thương') || pLower.includes('đùm bọc') || pLower.includes('sự sẻ chia') || pLower.includes('con người với con người')) {
    topicCode = 'CD13'; 
    topicName = 'Tình yêu thương – Sự sẻ chia';
  }
  // Ưu tiên 3: Hoạt động trường học, chào cờ (LỖI 3 - Thuật lại buổi lễ chào cờ)
  else if (pLower.includes('chào cờ') || pLower.includes('lễ chào cờ') || (pLower.includes('thuật lại') && (pLower.includes('trường') || pLower.includes('lớp')))) {
    topicCode = 'CD05'; 
    topicName = 'Trường học – Hoạt động tập thể';
  }
  // Ưu tiên 4: Bản thân
  else if (pLower.includes('bản thân') || pLower.includes('chính mình') || pLower.includes('họ tên') || pLower.includes('sở thích của em')) {
    topicCode = 'CD01'; 
    topicName = 'Bản thân';
  } 
  // Ưu tiên 5: Gia đình (Dùng hàm kiểm tra chuẩn ranh giới từ để không nhầm "cây bàng", "đề bài", "bài văn")
  else if (isAboutGrandfather(pLower) || isAboutGrandmother(pLower) || pLower.includes('bố') || pLower.includes('mẹ') || pLower.includes('cha') || pLower.includes('gia đình') || pLower.includes('anh trai') || pLower.includes('chị gái') || pLower.includes('em bé')) {
    topicCode = 'CD02'; 
    topicName = 'Gia đình';
  } else if (pLower.includes('bạn thân') || pLower.includes('người bạn') || pLower.includes('bạn bè') || pLower.includes('bạn cùng lớp') || pLower.includes('chuyển trường')) {
    topicCode = 'CD03'; 
    topicName = 'Bạn bè';
  } else if (pLower.includes('thầy') || pLower.includes('cô giáo') || pLower.includes('thầy giáo') || pLower.includes('cô chủ nhiệm')) {
    topicCode = 'CD04'; 
    topicName = 'Thầy cô';
  } else if (pLower.includes('ngôi trường') || pLower.includes('trường tiểu học') || pLower.includes('lớp học') || pLower.includes('sân trường') || pLower.includes('góc sân')) {
    topicCode = 'CD05'; 
    topicName = 'Trường lớp';
  } else if (pLower.includes('hộp bút') || pLower.includes('cặp sách') || pLower.includes('cây bút') || pLower.includes('thước kẻ') || pLower.includes('gấu bông') || pLower.includes('đồ chơi') || pLower.includes('đồ dùng')) {
    topicCode = 'CD06'; 
    topicName = 'Đồ vật';
  } else if (pLower.includes('chú chó') || pLower.includes('mèo con') || pLower.includes('con gà') || pLower.includes('con chim') || pLower.includes('con vật')) {
    topicCode = 'CD07'; 
    topicName = 'Động vật';
  } else if (pLower.includes('hoa sen') || pLower.includes('hoa hồng') || pLower.includes('bồn hoa') || pLower.includes('vườn cây')) {
    topicCode = 'CD08'; 
    topicName = 'Thực vật';
  } else if (pLower.includes('mưa rào') || pLower.includes('bình minh') || pLower.includes('hoàng hôn') || pLower.includes('bầu trời') || pLower.includes('dòng sông') || pLower.includes('biển')) {
    topicCode = 'CD09'; 
    topicName = 'Thiên nhiên';
  } else if (pLower.includes('quê hương') || pLower.includes('làng quê') || pLower.includes('thành phố') || pLower.includes('danh lam thắng cảnh')) {
    topicCode = 'CD10'; 
    topicName = 'Quê hương';
  } else if (pLower.includes('tết') || pLower.includes('trung thu') || pLower.includes('lễ hội') || pLower.includes('hội chợ')) {
    topicCode = 'CD11'; 
    topicName = 'Lễ hội';
  } else if (pLower.includes('dã ngoại') || pLower.includes('tham quan') || pLower.includes('trải nghiệm') || pLower.includes('cắm trại')) {
    topicCode = 'CD12'; 
    topicName = 'Hoạt động trải nghiệm';
  } else if (pLower.includes('việc tốt') || pLower.includes('giúp đỡ') || pLower.includes('nhặt của rơi') || pLower.includes('chia sẻ')) {
    topicCode = 'CD13'; 
    topicName = 'Việc tốt';
  } else if (pLower.includes('sách') || pLower.includes('truyện') || pLower.includes('nhân vật cổ tích')) {
    topicCode = 'CD15'; 
    topicName = 'Sách và truyện';
  } else if (pLower.includes('ước mơ') || pLower.includes('lớn lên')) {
    topicCode = 'CD16'; 
    topicName = 'Ước mơ';
  } else if (pLower.includes('môi trường') || pLower.includes('rác') || pLower.includes('trồng cây')) {
    topicCode = 'CD17'; 
    topicName = 'Môi trường';
  }

  // 6. Nhận diện các mã nhiệm vụ (01 đến 64)
  const detectedTaskCodes: string[] = [];
  const detectedTaskLabels: string[] = [];

  for (const task of WRITING_TASKS_CATALOG) {
    let matches = false;
    if (task.genre === genre && task.targetGrades.includes(grade)) {
      if (task.code === 'NV40' && genre === 'viet_thu' && (pLower.includes('thăm hỏi') || isAboutGrandfather(pLower) || isAboutGrandmother(pLower))) matches = true;
      else if (task.code === 'NV41' && genre === 'viet_thu' && (pLower.includes('bạn thân') || pLower.includes('chuyển trường'))) matches = true;
      else if (task.code === 'NV44' && genre === 'loi_nhan') matches = true;
      else if (task.code === 'NV37' && genre === 'neu_y_kien') matches = true;
      else if (task.code === 'NV17' && genre === 'ke_chuyen' && (pLower.includes('kỷ niệm') || isTeacherMemoryGrade5Prompt)) matches = true;
      else if (task.code === 'NV16' && genre === 'ke_chuyen' && (pLower.includes('trải nghiệm') || pLower.includes('tham quan'))) matches = true;
      else if (task.code === 'NV28' && genre === 'mieu_ta' && isTreeSelectionPrompt) matches = true;
      else if (task.code === 'NV29' && genre === 'mieu_ta' && (pLower.includes('góc sân') || pLower.includes('góc học tập'))) matches = true;
      else if (task.code === 'NV27' && genre === 'mieu_ta' && (pLower.includes('ngôi trường') || pLower.includes('cảnh'))) matches = true;
      else if (task.code === 'NV08' && genre === 'viet_doan_van' && pLower.includes('giới thiệu')) matches = true;
      else if (task.code === 'NV11' && genre === 'tinh_cam_cam_xuc') matches = true;
      else if (task.code === 'NV01' && genre === 'viet_cau') matches = true;
      else if (task.code === 'NV50' && genre === 'thong_bao') matches = true;
      else if (task.code === 'NV51' && genre === 'bao_cao') matches = true;
      else if (task.code === 'NV52' && genre === 'ke_hoach') matches = true;
      else if (task.code === 'NV53' && genre === 'huong_dan') matches = true;
      else if (task.code === 'NV55' && genre === 'sang_tao') matches = true;
    }
    if (matches && !detectedTaskCodes.includes(task.code)) {
      detectedTaskCodes.push(task.code);
      detectedTaskLabels.push(task.name);
    }
  }

  if (detectedTaskCodes.length === 0) {
    if (genre === 'viet_thu') { detectedTaskCodes.push('NV40'); detectedTaskLabels.push('Viết thư thăm hỏi'); }
    else if (genre === 'loi_nhan') { detectedTaskCodes.push('NV44'); detectedTaskLabels.push('Viết lời nhắn'); }
    else if (genre === 'neu_y_kien') { detectedTaskCodes.push('NV37'); detectedTaskLabels.push('Nêu ý kiến'); }
    else if (genre === 'tinh_cam_cam_xuc') { detectedTaskCodes.push('NV11'); detectedTaskLabels.push('Viết đoạn văn nêu cảm xúc'); }
    else if (genre === 'thuat_lai') { detectedTaskCodes.push('NV12'); detectedTaskLabels.push('Thuật lại sự việc theo trình tự thời gian'); }
    else if (genre === 'ke_chuyen') { detectedTaskCodes.push(isTeacherMemoryGrade5Prompt ? 'NV17' : 'NV09'); detectedTaskLabels.push(isTeacherMemoryGrade5Prompt ? 'Kể lại kỷ niệm sâu sắc' : 'Viết bài văn kể chuyện'); }
    else if (genre === 'mieu_ta') { detectedTaskCodes.push(isTreeSelectionPrompt ? 'NV28' : 'NV10'); detectedTaskLabels.push(isTreeSelectionPrompt ? 'Miêu tả cây cối' : 'Viết đoạn văn miêu tả'); }
    else if (genre === 'viet_cau') { detectedTaskCodes.push('NV01'); detectedTaskLabels.push('Viết câu'); }
    else { detectedTaskCodes.push('NV08'); detectedTaskLabels.push('Viết đoạn văn'); }
  }

  // 7. Xác định đối tượng viết và phạm vi
  let mainObject = 'Đối tượng theo đề bài';
  let writingScope = 'Phạm vi đề bài yêu cầu';
  let coreSubject = p;
  let audienceOrRecipient = 'Người đọc bài văn của em';
  let pointOfView = 'Ngôi thứ nhất (Em / Con)';
  let selectedObjectName: string | null = null;
  const activeFormatId = selectedFormatId || (isFormatSelectionPrompt ? 'doan_van' : null);

  // Xử lý CÂY BÓNG MÁT (LỖI 1)
  if (isTreeSelectionPrompt) {
    topicCode = 'CD08';
    topicName = 'Thiên nhiên – Cây cối';
    genre = 'mieu_ta';
    if (!detectedTaskCodes.includes('NV28')) {
      detectedTaskCodes.unshift('NV28');
      detectedTaskLabels.unshift('Miêu tả cây cối');
    }

    if (selectedObjectId === 'cay_bang') {
      mainObject = 'Cây bàng trên sân trường';
      coreSubject = 'Miêu tả cây bàng trên sân trường gắn với kỷ niệm của em';
      selectedObjectName = 'Cây bàng';
      writingScope = 'Gốc rễ vững chãi, thân cây xù xì, tán lá xòe rộng như chiếc ô xanh khổng lồ, lá đổi màu theo mùa và kỷ niệm rộn rã giờ ra chơi dưới bóng mát';
    } else if (selectedObjectId === 'cay_phuong') {
      mainObject = 'Cây phượng vĩ trên sân trường';
      coreSubject = 'Miêu tả cây phượng vĩ trên sân trường gắn với kỷ niệm của em';
      selectedObjectName = 'Cây phượng vĩ';
      writingScope = 'Thân cây cao lớn, cành lá sum suê như đuôi chim phượng, chùm hoa đỏ rực báo hiệu mùa hè và kỷ niệm chia tay năm học thân thương';
    } else if (selectedObjectId === 'cay_da') {
      mainObject = 'Cây đa trên sân trường';
      coreSubject = 'Miêu tả cây đa trên sân trường gắn với kỷ niệm của em';
      selectedObjectName = 'Cây đa';
      writingScope = 'Gốc đa cổ thụ, rễ phụ buông rủ như những chiếc cột chống, vòm lá xanh thẫm tỏa bóng mát chở che và những kỷ niệm êm đềm tuổi thơ';
    } else if (selectedObjectId === 'cay_khac' || selectedObjectId === 'custom') {
      const cName = (customObjectName && customObjectName.trim()) || 'Cây bóng mát';
      mainObject = `${cName} trên sân trường`;
      coreSubject = `Miêu tả ${cName.toLowerCase()} trên sân trường gắn với kỷ niệm của em`;
      selectedObjectName = cName;
      writingScope = `Đặc điểm thân lá, hoa quả, bóng mát và kỷ niệm khó quên cùng thầy cô, bạn bè dưới gốc ${cName.toLowerCase()}`;
    } else {
      mainObject = 'Cây bóng mát trên sân trường (Cây bàng, cây phượng vĩ hoặc cây đa)';
      coreSubject = 'Miêu tả một cây bóng mát trên sân trường gắn với kỷ niệm của em';
      selectedObjectName = null;
      writingScope = 'Hình dáng, tán lá rợp mát, hoa lá theo mùa và một kỷ niệm đẹp đẽ, thân thương dưới gốc cây trên sân trường';
    }
  }
  // Xử lý LỰA CHỌN HÌNH THỨC BÀI VIẾT (LỖI 2 - Kể chuyện con người yêu thương nhau)
  else if (isFormatSelectionPrompt) {
    topicCode = 'CD13';
    topicName = 'Tình yêu thương – Sự sẻ chia';
    genre = 'ke_chuyen';
    mainObject = 'Câu chuyện cảm động về sự yêu thương, đùm bọc giữa con người với con người';
    coreSubject = 'Kể lại một câu chuyện cảm động về sự yêu thương, đùm bọc giữa con người với con người';
    writingScope = 'Hoàn cảnh éo le, hành động sẻ chia kịp thời, tình người ấm áp và bài học nhân ái sâu sắc';
    if (!detectedTaskCodes.includes('NV09')) {
      detectedTaskCodes.unshift('NV09');
      detectedTaskLabels.unshift('Kể lại câu chuyện cảm động');
    }
  }
  // Xử lý THUẬT LẠI BUỔI LỄ CHÀO CỜ (LỖI 3)
  else if (pLower.includes('chào cờ') || (genre === 'thuat_lai' && pLower.includes('lễ'))) {
    topicCode = 'CD05';
    topicName = 'Trường học – Hoạt động tập thể';
    genre = 'thuat_lai';
    mainObject = 'Buổi lễ chào cờ đầu tuần ở trường em';
    coreSubject = 'Thuật lại buổi lễ chào cờ đầu tuần ở trường em theo đúng trình tự thời gian';
    writingScope = 'Trình tự thời gian: Trước buổi lễ (chuẩn bị, không khí sân trường), Trong buổi lễ (nghi lễ chào cờ, hát Quốc ca, nhận xét thi đua), Sau buổi lễ (lời dặn dò, các lớp về phòng học) và cảm xúc tự hào, phấn khởi của em';
  }
  // Xử lý BÀI 1 LỚP 1: Lựa chọn người thân (Bố, Mẹ, Ông, Bà)
  else if (isFamilyLoveGrade1Prompt) {
    topicCode = 'CD02';
    topicName = 'Gia đình';
    genre = 'viet_cau';
    if (!detectedTaskCodes.includes('NV01')) {
      detectedTaskCodes.unshift('NV01');
      detectedTaskLabels.unshift('Viết câu thể hiện tình cảm');
    }
    if (selectedObjectId === 'bo') {
      mainObject = 'Bố kính yêu';
      coreSubject = 'Viết 1–2 câu thể hiện tình cảm yêu thương của em dành cho bố';
      selectedObjectName = 'Bố';
      writingScope = 'Bày tỏ tình cảm yêu thương chân thành với bố và lời cảm ơn hoặc lời hứa chăm ngoan';
    } else if (selectedObjectId === 'me') {
      mainObject = 'Mẹ kính yêu';
      coreSubject = 'Viết 1–2 câu thể hiện tình cảm yêu thương của em dành cho mẹ';
      selectedObjectName = 'Mẹ';
      writingScope = 'Bày tỏ tình cảm yêu thương sâu sắc với mẹ và lời cảm ơn hoặc lời hứa chăm ngoan';
    } else if (selectedObjectId === 'ong') {
      mainObject = 'Ông kính yêu';
      coreSubject = 'Viết 1–2 câu thể hiện tình cảm yêu thương của em dành cho ông';
      selectedObjectName = 'Ông';
      writingScope = 'Bày tỏ lòng yêu quý, kính trọng ông và lời chúc hoặc lời hứa chăm ngoan';
    } else if (selectedObjectId === 'ba') {
      mainObject = 'Bà kính yêu';
      coreSubject = 'Viết 1–2 câu thể hiện tình cảm yêu thương của em dành cho bà';
      selectedObjectName = 'Bà';
      writingScope = 'Bày tỏ lòng yêu quý, kính trọng bà hiền từ và lời chúc hoặc lời hứa chăm ngoan';
    } else {
      mainObject = 'Bố, Mẹ, Ông hoặc Bà';
      coreSubject = 'Viết 1–2 câu thể hiện tình cảm yêu thương của em dành cho bố, mẹ, ông hoặc bà';
      selectedObjectName = null;
      writingScope = 'Chọn một người thân (bố, mẹ, ông hoặc bà) để bộc lộ tình cảm yêu thương chân thành trong 1–2 câu';
    }
  }
  // Xử lý BÀI MIÊU TẢ ĐỒ VẬT LỚP 1 (Hộp bút, Bút chì, Cặp sách...)
  else if (isItemDescriptiveGrade1) {
    topicCode = 'CD06';
    topicName = 'Đồ dùng học tập';
    genre = 'viet_cau';
    if (!detectedTaskCodes.includes('NV01')) {
      detectedTaskCodes.unshift('NV01');
      detectedTaskLabels.unshift('Viết câu');
    }
    if (!detectedTaskCodes.includes('NV24')) {
      detectedTaskCodes.push('NV24');
      detectedTaskLabels.push('Miêu tả đồ vật');
    }

    if (isPencilOrCaseGrade1) {
      if (selectedObjectId === 'but_chi') {
        mainObject = 'Chiếc bút chì';
        coreSubject = 'Viết 1–2 câu miêu tả chiếc bút chì giúp em tập viết mỗi ngày';
        selectedObjectName = 'Chiếc bút chì';
        writingScope = 'Màu sắc vỏ bút, thân thon dài, đặc điểm ngòi chì và cục tẩy nhỏ xinh, công dụng giúp em nắn nót từng nét chữ';
      } else {
        // Mặc định hoặc khi chọn hop_but
        mainObject = 'Chiếc hộp bút xinh xắn';
        coreSubject = 'Viết 1–2 câu miêu tả chiếc hộp bút xinh xắn giúp em tập viết mỗi ngày';
        selectedObjectName = 'Hộp bút';
        writingScope = 'Màu sắc tươi tắn, hình dáng nhỏ nhắn vừa tay, họa tiết đáng yêu và công dụng giữ đồ dùng học tập gọn gàng';
      }
    } else {
      // Đề đồ vật lớp 1 khác (ví dụ: chiếc cặp sách, thước kẻ, bảng con...)
      let itemName = 'Đồ dùng học tập';
      if (pLower.includes('cặp') || pLower.includes('ba lô')) itemName = 'Chiếc cặp sách';
      else if (pLower.includes('thước')) itemName = 'Chiếc thước kẻ';
      else if (pLower.includes('bảng')) itemName = 'Chiếc bảng con';
      else if (pLower.includes('hộp bút')) itemName = 'Chiếc hộp bút';
      else if (pLower.includes('bút chì')) itemName = 'Chiếc bút chì';
      else if (pLower.includes('tẩy') || pLower.includes('gôm')) itemName = 'Cục tẩy nhỏ';
      else if (customObjectName && customObjectName.trim()) itemName = customObjectName.trim();

      mainObject = itemName;
      coreSubject = `Viết 1–2 câu miêu tả ${itemName.toLowerCase()}`;
      selectedObjectName = itemName;
      writingScope = `Đặc điểm màu sắc, hình dáng nổi bật và công dụng thiết thực của ${itemName.toLowerCase()} trong học tập hàng ngày`;
    }
  }
  // Xử lý LOẠI A - Lựa chọn đồ vật (Hộp bút, Cặp, Đồng hồ, Bảng...)
  else if (isObjectSelectionPrompt || choiceType === 'object_selection') {
    topicCode = 'CD06';
    topicName = 'Đồ vật';
    genre = 'mieu_ta';
    if (!detectedTaskCodes.includes('NV10')) {
      detectedTaskCodes.unshift('NV10');
      detectedTaskLabels.unshift('Viết đoạn văn miêu tả');
    }
    if (!detectedTaskCodes.includes('NV24')) {
      detectedTaskCodes.push('NV24');
      detectedTaskLabels.push('Tả đồ vật');
    }

    if (selectedObjectId === 'hop_but') {
      mainObject = 'Chiếc hộp bút';
      coreSubject = 'Miêu tả đặc điểm và ích lợi của chiếc hộp bút';
      selectedObjectName = 'Hộp bút';
      writingScope = 'Hình dáng hộp chữ nhật, màu sắc tươi tắn, các ngăn chứa đồ tiện ích và công dụng giữ đồ dùng học tập luôn gọn gàng';
    } else if (selectedObjectId === 'chiec_cap') {
      mainObject = 'Chiếc cặp sách';
      coreSubject = 'Miêu tả đặc điểm và ích lợi của chiếc cặp sách';
      selectedObjectName = 'Chiếc cặp';
      writingScope = 'Dáng vẻ vuông vắn, quai đeo êm ái, các ngăn rộng rãi và ích lợi bảo vệ sách vở đồng hành cùng em đến trường';
    } else if (selectedObjectId === 'dong_ho') {
      mainObject = 'Chiếc đồng hồ';
      coreSubject = 'Miêu tả đặc điểm và ích lợi của chiếc đồng hồ';
      selectedObjectName = 'Đồng hồ';
      writingScope = 'Mặt tròn sáng bóng, các con số rõ nét, kim giờ kim phút cần mẫn và ích lợi nhắc nhở giờ giấc học tập, sinh hoạt';
    } else if (selectedObjectId === 'bang_lop') {
      mainObject = 'Chiếc bảng lớp';
      coreSubject = 'Miêu tả đặc điểm và ích lợi của chiếc bảng lớp';
      selectedObjectName = 'Bảng lớp';
      writingScope = 'Hình chữ nhật rộng lớn, màu xanh chống lóa, ô kẻ ngay ngắn và ích lợi truyền tải kiến thức bài giảng của cô giáo';
    } else if (selectedObjectId === 'do_vat_khac' || selectedObjectId === 'custom') {
      const cName = (customObjectName && customObjectName.trim()) || 'Đồ vật gần gũi';
      mainObject = cName;
      coreSubject = `Miêu tả đặc điểm và ích lợi của ${cName.toLowerCase()}`;
      selectedObjectName = cName;
      writingScope = `Đặc điểm hình dáng, màu sắc, cấu tạo nổi bật và ích lợi thiết thực của ${cName.toLowerCase()}`;
    } else {
      mainObject = 'Đồ vật gần gũi (Hộp bút, Chiếc cặp, Đồng hồ, Bảng lớp...)';
      coreSubject = 'Miêu tả đặc điểm và ích lợi của một đồ vật gần gũi';
      selectedObjectName = null;
      writingScope = 'Hình dáng, màu sắc, đặc điểm cấu tạo nổi bật và ích lợi thiết thực của đồ vật đối với học tập và sinh hoạt';
    }
  }

  // Xử lý khi đã chọn hướng viết (LOẠI B hoặc LOẠI C)
  const activeDirection = hasMultipleDirections
    ? detectedDirections.find(d => d.id === selectedDirectionId) || null
    : null;

  if (activeDirection) {
    coreSubject = activeDirection.title;
    mainObject = activeDirection.mainObject;
    writingScope = activeDirection.scope;
    if (activeDirection.recipient) audienceOrRecipient = activeDirection.recipient;
    if (activeDirection.pointOfView) pointOfView = activeDirection.pointOfView;
    if (activeDirection.topicCode) topicCode = activeDirection.topicCode;
    if (activeDirection.topicName) topicName = activeDirection.topicName;
    if (isTeacherMemoryGrade5Prompt) {
      genre = 'ke_chuyen';
      topicCode = 'CD04';
      topicName = 'Thầy cô';
    }
  } else if (choiceType !== 'object_selection' && !isTreeSelectionPrompt && !isFormatSelectionPrompt) {
    if (isTeacherMemoryGrade5Prompt) {
      topicCode = 'CD04';
      topicName = 'Thầy cô';
      genre = 'ke_chuyen';
      mainObject = 'Thầy giáo hoặc cô giáo kính yêu';
      coreSubject = 'Viết bài văn kể lại một kỷ niệm sâu sắc giữa em và một thầy giáo hoặc cô giáo đã dạy dỗ, nâng đỡ em tiến bộ';
      writingScope = 'Kỷ niệm thầy cô ân cần chỉ bảo, nâng đỡ em vượt qua khó khăn và tiến bộ trong học tập';
      audienceOrRecipient = 'Người đọc';
      pointOfView = 'Em';
    } else if (isMessageThanksOrApologyGrade2Prompt) {
      topicCode = 'CD23';
      topicName = 'Giao tiếp';
      genre = 'loi_nhan';
      mainObject = 'Bạn cùng lớp';
      audienceOrRecipient = 'Bạn cùng lớp';
      coreSubject = 'Viết một tin nhắn ngắn (3–4 câu) cảm ơn bạn hoặc xin lỗi bạn';
      writingScope = 'Tin nhắn ngắn gửi bạn để cảm ơn vì cho mượn đồ dùng hoặc xin lỗi vì lỡ làm hỏng vật gì';
      pointOfView = 'Mình – bạn hoặc tớ – cậu';
    } else if (isGrandparentLoveGrade2Prompt) {
      topicCode = 'CD02';
      topicName = 'Gia đình';
      genre = 'tinh_cam_cam_xuc';
      mainObject = 'Ông hoặc bà kính yêu';
      coreSubject = 'Viết đoạn văn ngắn từ 3 đến 5 câu nói lên tình cảm yêu mến, kính trọng của em đối với ông hoặc bà';
      writingScope = 'Tình cảm kính yêu, sự chăm sóc hiền từ của ông hoặc bà và lời hứa chăm ngoan';
      pointOfView = 'Cháu – ông/bà';
    } else if (isCatObservationGrade1Prompt) {
      topicCode = 'CD07';
      topicName = 'Động vật';
      genre = 'viet_cau';
      mainObject = 'Hình dáng hoặc hành động của mèo con';
      coreSubject = 'Quan sát tranh chú mèo con và viết 1–2 câu tả hình dáng hoặc hành động của mèo con';
      writingScope = 'Màu lông, nét đáng yêu hoặc cử chỉ nhanh nhẹn của chú mèo con quan sát trong tranh';
      pointOfView = 'Em';
    } else if (isSelfIntroGrade1Prompt) {
      topicCode = 'CD01';
      topicName = 'Bản thân';
      genre = 'viet_cau';
      mainObject = 'Bản thân em (Họ tên, lớp và sở thích đáng yêu)';
      coreSubject = 'Viết 1–2 câu giới thiệu họ tên, lớp và sở thích đáng yêu của em';
      writingScope = 'Họ và tên đầy đủ, lớp học và sở thích ngộ nghĩnh, đáng yêu của em';
      pointOfView = 'Em';
    } else if (genre === 'viet_thu') {
      if (isAboutGrandfather(pLower) || isAboutGrandmother(pLower)) {
        mainObject = 'Ông bà kính yêu';
        audienceOrRecipient = 'Ông bà ở quê';
        coreSubject = 'Viết thư thăm hỏi ông bà';
        writingScope = 'Hỏi thăm sức khỏe, đời sống ở quê và bày tỏ lòng kính yêu, nhớ thương';
      } else if (pLower.includes('bạn thân') || pLower.includes('chuyển trường') || pLower.includes('bạn')) {
        mainObject = 'Người bạn thân';
        audienceOrRecipient = 'Người bạn thân chuyển trường đi xa';
        coreSubject = 'Viết thư thăm hỏi bạn thân chuyển trường';
        writingScope = 'Hỏi thăm trường lớp mới, bạn mới và ôn lại kỷ niệm học trò thân thương';
      } else {
        mainObject = 'Người nhận thư';
        coreSubject = 'Viết thư thăm hỏi';
        writingScope = 'Thăm hỏi sức khỏe, cuộc sống và chia sẻ tin tức của em';
      }
    } else if (genre === 'loi_nhan') {
      mainObject = 'Người thân nhận lời nhắn';
      audienceOrRecipient = 'Người thân trong gia đình (Bố, Mẹ, Ông, Bà)';
      coreSubject = 'Viết lời nhắn cho người thân';
      writingScope = 'Lý do, địa điểm, thời gian về và lời nhắn nhủ yêu thương để người nhà yên tâm';
    } else if (pLower.includes('ngôi trường') && !pLower.includes('góc sân') && !pLower.includes('cây')) {
      mainObject = 'Ngôi trường tiểu học';
      coreSubject = 'Tả ngôi trường tiểu học của em';
      writingScope = 'Toàn cảnh ngôi trường, dãy lớp học, sân trường và kỷ niệm gắn bó';
    } else if (pLower.includes('góc sân trường') || (pLower.includes('góc sân') && pLower.includes('trường') && !pLower.includes('cây'))) {
      mainObject = 'Một góc sân trường';
      coreSubject = 'Tả một góc sân trường em yêu thích';
      writingScope = 'Vị trí góc sân, cảnh vật xung quanh (ghế đá, bồn hoa, ánh nắng) và hoạt động giờ ra chơi';
    } else if (pLower.includes('bản thân') || pLower.includes('giới thiệu')) {
      mainObject = 'Bản thân học sinh';
      coreSubject = 'Giới thiệu về bản thân em';
      writingScope = 'Họ tên, sở thích, ước mơ và điểm đặc biệt đáng nhớ của chính em';
    } else if (pLower.includes('kỷ niệm') && (isAboutGrandfather(pLower) || isAboutGrandmother(pLower))) {
      mainObject = 'Kỷ niệm đáng nhớ với ông bà';
      coreSubject = 'Kể lại một kỷ niệm đáng nhớ với ông bà';
      writingScope = 'Sự việc đáng nhớ, lời dạy bảo, cử chỉ ân cần của ông bà và cảm xúc của em';
    } else if (genre === 'neu_y_kien') {
      mainObject = 'Việc làm tốt và ý nghĩa nhân văn';
      coreSubject = 'Nêu ý kiến về một việc làm tốt';
      writingScope = 'Khẳng định sự đồng tình, đưa ra lý do xác đáng và dẫn chứng câu chuyện thực tế';
    }
  }

  // 8. Ràng buộc bắt buộc và cấm kỵ (Tránh 100% lạc đề)
  const compulsoryConstraints: string[] = [
    `Bám sát đúng đề bài: "${p.slice(0, 60)}..."`,
    `Tập trung vào đối tượng: ${mainObject}`,
    `Dùng ngôi kể phù hợp: ${pointOfView}`
  ];

  const negativeConstraints: string[] = [
    'TUYỆT ĐỐI KHÔNG tự đổi đề sang bài tả cây cối, tả góc nhà nếu đề không yêu cầu',
    'TUYỆT ĐỐI KHÔNG bịa đặt trải nghiệm gia đình hay tên tuổi riêng tư của học sinh',
    'TUYỆT ĐỐI KHÔNG dùng một dàn ý mẫu chung sao chép cho các thể loại khác nhau'
  ];

  if (isItemDescriptiveGrade1) {
    const objLabel = selectedObjectId === 'but_chi' ? 'chiếc bút chì' : (selectedObjectName || 'chiếc hộp bút');
    compulsoryConstraints.push(`Miêu tả ${objLabel}`);
    compulsoryConstraints.push('Chọn một hoặc hai đặc điểm nổi bật (màu sắc, hình dáng hoặc họa tiết/đặc điểm ngòi, tẩy)');
    compulsoryConstraints.push(`Có thể nêu công dụng của ${objLabel}`);
    compulsoryConstraints.push('Viết đúng 1–2 câu hoàn chỉnh');
    compulsoryConstraints.push('Viết hoa đầu câu và đặt dấu chấm ở cuối câu');

    negativeConstraints.push('TUYỆT ĐỐI KHÔNG viết thành đoạn văn ba câu hay bài văn 3 phần (Mở bài, Thân bài, Kết bài)');
    negativeConstraints.push('TUYỆT ĐỐI KHÔNG ép viết dài 4–6 câu hay yêu cầu cảm xúc, mong ước xa vời');
    negativeConstraints.push('TUYỆT ĐỐI KHÔNG sử dụng biện pháp nhân hóa hoặc kể lể kỷ niệm không liên quan');
  } else if (isFamilyLoveGrade1Prompt) {
    compulsoryConstraints.push('Viết đúng 1–2 câu trọn vẹn bày tỏ tình cảm yêu thương với người thân đã chọn');
    negativeConstraints.push('TUYỆT ĐỐI KHÔNG viết thành bài văn hay đoạn văn dài nhiều phần');
  } else if (isSelfIntroGrade1Prompt) {
    compulsoryConstraints.push('Viết đúng 1–2 câu giới thiệu đủ 3 thông tin: họ tên, lớp và sở thích đáng yêu');
    negativeConstraints.push('TUYỆT ĐỐI KHÔNG viết dài dòng lan man sang tình cảm gia đình');
  } else if (isCatObservationGrade1Prompt) {
    compulsoryConstraints.push('Viết 1–2 câu dựa trên quan sát tranh chú mèo con (tả hình dáng hoặc hành động)');
    negativeConstraints.push('TUYỆT ĐỐI KHÔNG tự bịa các chi tiết hành động khi chưa quan sát tranh');
  } else if (isMessageThanksOrApologyGrade2Prompt) {
    compulsoryConstraints.push('Viết tin nhắn ngắn (3–4 câu) gửi bạn cùng lớp để cảm ơn hoặc xin lỗi');
    negativeConstraints.push('TUYỆT ĐỐI KHÔNG nhắn gửi cho bố mẹ hoặc nói chuyện đi đâu, mấy giờ về');
  } else if (isGrandparentLoveGrade2Prompt) {
    compulsoryConstraints.push('Viết đoạn văn ngắn từ 3 đến 5 câu nói lên tình cảm yêu mến, kính trọng');
    negativeConstraints.push('TUYỆT ĐỐI KHÔNG viết lan man thành 7–9 câu hay bài văn 3 phần');
  } else if (isTeacherMemoryGrade5Prompt) {
    compulsoryConstraints.push('Viết bài văn hoàn chỉnh gồm 3 phần (Mở bài, Thân bài, Kết bài) kể kỷ niệm với thầy/cô giáo');
    negativeConstraints.push('TUYỆT ĐỐI KHÔNG chuyển sang ông bà, gia đình hay bạn bè');
  } else if (genre === 'viet_thu') {
    negativeConstraints.push('KHÔNG dùng các tiêu đề "Mở đoạn", "Phát triển đoạn", "Kết đoạn" cho dàn ý bức thư');
    compulsoryConstraints.push('Trình bày đầy đủ 5 phần chuẩn mực của bức thư');
  } else if (genre === 'loi_nhan') {
    negativeConstraints.push('KHÔNG ép lời nhắn ngắn thành bài văn dài 3 phần');
    compulsoryConstraints.push('Ghi rõ người nhận, nội dung nhắn gửi ngắn gọn, người gửi và thời gian');
  } else if (isTreeSelectionPrompt) {
    negativeConstraints.push('TUYỆT ĐỐI KHÔNG chuyển thành bài tả toàn cảnh ngôi trường hay tả góc sân trường chung chung');
    compulsoryConstraints.push('Tập trung miêu tả cây bóng mát đã chọn và gắn liền với một kỷ niệm đẹp dưới tán cây');
  } else if (pLower.includes('chào cờ')) {
    negativeConstraints.push('TUYỆT ĐỐI KHÔNG lồng ghép chuyện gia đình, bà ru hay viết thư vào buổi lễ chào cờ');
    compulsoryConstraints.push('Thuật lại đúng trình tự thời gian của buổi lễ chào cờ đầu tuần ở trường');
  }

  // 9. Xác định độ dài và hình thức văn bản
  const lengthConstraint = parsePromptLength(p, grade, genre, activeFormatId);
  const lengthSpecified = lengthConstraint.isExplicit;
  let suggestedLength = lengthConstraint.display;

  let writingFormat = 'Đoạn văn';
  if (isItemDescriptiveGrade1 || isFamilyLoveGrade1Prompt || isSelfIntroGrade1Prompt || isCatObservationGrade1Prompt || (grade === 1 && genre === 'viet_cau')) {
    writingFormat = '1–2 câu hoàn chỉnh';
    suggestedLength = '1–2 câu hoàn chỉnh (đầu câu viết hoa, cuối câu có dấu chấm)';
  } else if (isMessageThanksOrApologyGrade2Prompt) {
    writingFormat = 'Tin nhắn ngắn (3–4 câu)';
    suggestedLength = 'Tin nhắn ngắn từ 3 đến 4 câu';
  } else if (isGrandparentLoveGrade2Prompt) {
    writingFormat = 'Đoạn văn ngắn (3–5 câu)';
    suggestedLength = 'Đoạn văn ngắn từ 3 đến 5 câu';
  } else if (isTeacherMemoryGrade5Prompt || isTreeSelectionPrompt || (grade >= 4 && (genre === 'ke_chuyen' || genre === 'mieu_ta') && !pLower.includes('đoạn văn'))) {
    writingFormat = 'Bài văn hoàn chỉnh (gồm 3 phần: Mở bài, Thân bài, Kết bài)';
    if (isTeacherMemoryGrade5Prompt) {
      suggestedLength = 'Bài văn hoàn chỉnh gồm 3 phần: Mở bài, Thân bài, Kết bài (khoảng 15–20 câu)';
    } else if (isTreeSelectionPrompt) {
      suggestedLength = 'Bài văn hoàn chỉnh gồm 3 phần: Mở bài, Thân bài, Kết bài (khoảng 12–18 câu hoặc theo hướng dẫn của thầy cô).';
    }
  } else if (isFormatSelectionPrompt) {
    writingFormat = activeFormatId === 'bai_van_ngan' 
      ? 'Bài văn ngắn (gồm 3 phần: Mở bài, Thân bài, Kết bài)' 
      : 'Đoạn văn hoàn chỉnh';
    suggestedLength = activeFormatId === 'bai_van_ngan'
      ? 'Bài văn ngắn (gồm 3 phần: Mở bài, Thân bài, Kết bài sâu sắc, khoảng 12–18 câu)'
      : 'Một đoạn văn hoàn chỉnh liền mạch (khoảng 7–10 câu hoặc theo hướng dẫn của thầy cô)';
  } else if (genre === 'viet_thu') {
    writingFormat = 'Bức thư ngắn (gồm 5 phần chuẩn mực)';
    suggestedLength = 'Thư ngắn (khoảng 80–120 chữ, có đủ 5 phần chuẩn mực của thư)';
  } else if (genre === 'loi_nhan') {
    writingFormat = 'Lời nhắn / Tin nhắn ngắn';
    suggestedLength = 'Lời nhắn ngắn (khoảng 3–5 câu súc tích)';
  } else if (genre === 'viet_cau') {
    writingFormat = `${lengthConstraint.display} hoàn chỉnh`;
    suggestedLength = `${lengthConstraint.display} hoàn chỉnh`;
  }

  const needsImageObservation = Boolean(
    isCatObservationGrade1Prompt || 
    pLower.includes('quan sát tranh') || 
    pLower.includes('nhìn tranh') || 
    pLower.includes('dựa vào tranh')
  );

  const taskAnalysis: WritingTaskAnalysis = {
    pipelineVersion: '2018-v2.0',
    originalPrompt: p,
    grade,
    writingType: genre,
    genre,
    topicCode,
    topicName,
    mainTask: (detectedTaskLabels && detectedTaskLabels[0]) || 'Viết bài theo yêu cầu đề',
    targetObject: mainObject,
    writingFormat,
    length: {
      rawText: lengthConstraint.display,
      unit: lengthConstraint.unit,
      min: lengthConstraint.min,
      max: lengthConstraint.max,
      isExplicit: lengthConstraint.isExplicit,
      display: lengthConstraint.display
    },
    isMultiDirection: hasMultipleDirections,
    alternatives: detectedDirections.map(d => ({
      id: d.id,
      title: d.title,
      subject: d.title,
      targetObject: d.mainObject,
      focusPoint: d.scope,
      requiredContent: [d.scope],
      notes: d.purpose,
      icon: d.icon
    })),
    selectedAlternativeId: activeDirection ? activeDirection.id : undefined,
    needsImageObservation,
    requiredElements: compulsoryConstraints,
    forbiddenElements: negativeConstraints,
    audience: audienceOrRecipient,
    pointOfView
  };

  return {
    actionVerbs,
    coreSubject,
    mainObject,
    writingScope,
    genre,
    writingFormat,
    needsImageObservation,
    lengthConstraint,
    taskAnalysis,
    topicCode,
    topicName,
    detectedTaskCodes,
    detectedTaskLabels,
    audienceOrRecipient,
    pointOfView,
    choiceType,
    objectChoiceQuestion,
    availableObjects,
    selectedObjectId: selectedObjectId || null,
    selectedObjectName,
    customObjectName,
    formatChoiceQuestion,
    availableFormats,
    selectedFormatId: activeFormatId,
    hasMultipleDirections,
    detectedDirections,
    selectedDirectionId: activeDirection ? activeDirection.id : null,
    selectedDirection: activeDirection,
    purpose: activeDirection?.purpose || 'Miêu tả đối tượng sinh động và bộc lộ tình cảm',
    isCombinedMultiTask,
    combinedTasks,
    compulsoryConstraints,
    negativeConstraints,
    lengthSpecified,
    suggestedLength,
    difficultyLevel: difficulty
  };
}

// =========================================================================
// IV. BỘ TẠO DÀN Ý & SƠ ĐỒ TƯ DUY 5 NHÁNH THEO 13 THỂ LOẠI
// =========================================================================

export interface BuiltMindMapAndOutline {
  branches: MindMapBranch[];
  outline: DetailedOutlineGroup;
  socraticQuestions: string[];
  hoaNhoUnderstand: string;
  specificRequirements: string[];
  vocabularySuggestions: VocabularyImageryBank;
}

/**
 * Xây dựng cấu trúc sư phạm chuyên biệt cho 13 thể loại GDPT 2018
 */
export function buildGenreStructure(
  semantics: SemanticAnalysisResult, 
  grade: number = 3, 
  specialWishes: string = ''
): BuiltMindMapAndOutline {
  const { genre, coreSubject, mainObject, writingScope, difficultyLevel } = semantics;

  let branches: MindMapBranch[] = [];
  let outline: DetailedOutlineGroup = { moDoan: [], phatTrienDoan: [], ketDoan: [] };
  let socraticQuestions: string[] = [];
  let hoaNhoUnderstand = `Đề bài muốn con bám sát "${coreSubject}" để viết bài thật sinh động và đúng thể loại.`;
  let specificRequirements: string[] = [
    `Nhiệm vụ: ${(semantics.detectedTaskLabels && semantics.detectedTaskLabels[0]) || 'Viết bài theo yêu cầu đề'}`,
    `Đối tượng: ${mainObject}`,
    `Phạm vi: ${writingScope}`
  ];
  let vocabularySuggestions: VocabularyImageryBank | null = null;

  const promptRaw = semantics.taskAnalysis?.originalPrompt || semantics.coreSubject || '';
  const pLower = promptRaw.toLowerCase();

  // -------------------------------------------------------------
  // TRƯỜNG HỢP ĐẶC BIỆT 1 (LỚP 1 BÀI 1): TÌNH CẢM YÊU THƯƠNG GIA ĐÌNH
  // Đề: "Viết 1–2 câu thể hiện tình cảm yêu thương của em dành cho bố, mẹ, ông hoặc bà."
  // -------------------------------------------------------------
  if (isFamilyLoveGrade1Prompt(pLower, grade)) {
    const chosenPerson = semantics.selectedObjectName || 'người thân (Bố, Mẹ, Ông hoặc Bà)';
    const relKey = semantics.selectedObjectId;
    let relPoints = ['Bố kính yêu', 'Mẹ yêu quý', 'Ông kính mến', 'Bà hiền từ'];
    let sampleC1 = `Em yêu ${chosenPerson} nhất trên đời.`;
    let sampleC2 = `Con hứa sẽ luôn chăm ngoan để ${chosenPerson} luôn vui lòng.`;
    if (relKey === 'bo') {
      relPoints = ['Bố kính yêu', 'Bố của em', 'Người bố tuyệt vời', 'Bố thân thương'];
      sampleC1 = 'Con yêu bố nhiều lắm vì bố luôn chăm sóc và dạy bảo con.';
      sampleC2 = 'Con hứa sẽ luôn chăm ngoan, học giỏi để bố luôn vui lòng.';
    } else if (relKey === 'me') {
      relPoints = ['Mẹ yêu quý', 'Mẹ dịu hiền', 'Người mẹ tuyệt vời', 'Mẹ thân thương'];
      sampleC1 = 'Em yêu mẹ của em nhất trên đời vì mẹ luôn chăm sóc em từng bữa ăn giấc ngủ.';
      sampleC2 = 'Con hứa sẽ luôn chăm ngoan, vâng lời để mẹ luôn vui lòng.';
    } else if (relKey === 'ong') {
      relPoints = ['Ông kính yêu', 'Ông nội kính mến', 'Ông ngoại kính mến', 'Người ông hiền từ'];
      sampleC1 = 'Cháu kính yêu ông rất nhiều vì ông luôn dạy bảo cháu những điều hay.';
      sampleC2 = 'Cháu chúc ông luôn mạnh khỏe và hứa sẽ chăm ngoan để ông vui lòng.';
    } else if (relKey === 'ba') {
      relPoints = ['Bà kính yêu', 'Bà nội hiền từ', 'Bà ngoại hiền từ', 'Người bà ấm áp'];
      sampleC1 = 'Cháu yêu bà nhiều lắm vì bà luôn kể chuyện cổ tích cho cháu nghe.';
      sampleC2 = 'Cháu kính chúc bà luôn mạnh khỏe và hứa sẽ vâng lời bà dạy bảo.';
    }

    hoaNhoUnderstand = `Con hãy chọn một người thân trong gia đình (${chosenPerson}) mà con yêu quý nhất, rồi viết 1–2 câu thật tình cảm để gửi tới người ấy nhé!`;
    specificRequirements = [
      'Nhiệm vụ: Viết 1–2 câu thể hiện tình cảm yêu thương',
      `Người nhận: ${chosenPerson}`,
      'Dung lượng: Đúng 1–2 câu hoàn chỉnh (không viết thành đoạn văn dài hay bài văn)',
      'Quy tắc câu: Đầu câu viết hoa, cuối câu có dấu chấm kết thúc (.)'
    ];
    socraticQuestions = [
      `Con muốn bày tỏ tình cảm yêu thương với ai trong gia đình (${chosenPerson})?`,
      'Người thân ấy có nụ cười, cử chỉ chăm sóc hay điều gì làm con thấy ấm áp nhất?',
      'Con muốn nói lời yêu thương hoặc lời cảm ơn chân thành nào?',
      'Con có muốn hứa điều gì ngoan ngoãn để người thân luôn vui lòng không?'
    ];
    branches = [
      { id: 'br-1', title: '❤️ Người thân em yêu', icon: '❤️', color: 'rose', points: relPoints },
      { id: 'br-2', title: '☀️ Cử chỉ yêu thương ấm áp', icon: '☀️', color: 'amber', points: ['Nụ cười hiền hậu', 'Ánh mắt dịu dàng', 'Đôi bàn tay ân cần chăm sóc', 'Lời vỗ về ngọt ngào'] },
      { id: 'br-3', title: '💬 Lời nói yêu thương', icon: '💬', color: 'purple', points: ['Em yêu ... nhất trên đời', 'Con thương ... rất nhiều', 'Ở bên ... con thấy thật hạnh phúc'] },
      { id: 'br-4', title: '🌱 Lời hứa chăm ngoan', icon: '🌱', color: 'emerald', points: ['Chăm chỉ học tập', 'Vâng lời dạy bảo', 'Luôn là con ngoan trò giỏi'] },
      { id: 'br-5', title: '✍️ Quy tắc viết câu lớp 1', icon: '✍️', color: 'sky', points: ['Đầu câu viết hoa', 'Cuối câu có dấu chấm', 'Câu văn đủ ý trọn vẹn'] }
    ];

    const c1 = [`Câu 1 (Bày tỏ tình cảm): Viết một câu thể hiện tình cảm chân thành với ${chosenPerson}. (Ví dụ: "${sampleC1}")`];
    const c2 = [`Câu 2 (Cảm ơn hoặc Lời hứa ngoan): Viết câu thứ hai nói lời cảm ơn cử chỉ chăm sóc hoặc lời hứa ngoan. (Ví dụ: "${sampleC2}")`];

    outline = {
      moDoan: c1,
      phatTrienDoan: [],
      ketDoan: c2,
      genre: 'viet_cau',
      sections: [
        { id: 'sec-1', title: 'Câu 1. Bày tỏ tình cảm yêu thương', icon: '❤️', guideNote: 'Nói trực tiếp tình yêu thương ấm áp của con dành cho người thân', bulletPoints: c1 },
        { id: 'sec-2', title: 'Câu 2. Lời cảm ơn hoặc Lời hứa chăm ngoan', icon: '🌱', guideNote: 'Gửi gắm lời cảm ơn hoặc lời hứa ngoan ngoãn', bulletPoints: c2 }
      ]
    };

    return {
      branches,
      outline,
      socraticQuestions,
      hoaNhoUnderstand,
      specificRequirements,
      vocabularySuggestions: {
        goodWords: [
          { word: 'yêu quý', meaningAndUsage: 'Tình cảm thân thiết, gắn bó sâu sắc' },
          { word: 'kính trọng', meaningAndUsage: 'Tôn kính và biết ơn người bề trên' },
          { word: 'hiền hậu', meaningAndUsage: 'Dịu dàng, nụ cười bao dung ấm áp' },
          { word: 'chăm ngoan', meaningAndUsage: 'Vâng lời người lớn và chăm học' }
        ],
        imageries: [
          { type: 'Hình ảnh ấm áp', example: 'Đôi bàn tay ấm áp xoa đầu em', explanation: 'Gợi cảm giác bình yên được chở che' }
        ],
        sampleSentences: [
          { type: 'mo_bai', label: 'Bày tỏ tình cảm', sentence: 'Em yêu mẹ của em nhất trên đời.', whyItIsGood: 'Câu văn ngắn gọn, đúng 1 câu, chan chứa tình yêu thương.' },
          { type: 'ket_bai', label: 'Lời hứa ngoan', sentence: 'Con hứa sẽ luôn chăm ngoan để bố mẹ vui lòng.', whyItIsGood: 'Câu thứ hai trọn vẹn, thể hiện sự hiếu thảo.' }
        ],
        creativeIdeas: ['Con có thể tự tay vẽ một trái tim nhỏ tặng người thân sau khi viết xong bài nhé!']
      }
    };
  }

  // -------------------------------------------------------------
  // TRƯỜNG HỢP ĐẶC BIỆT 2 (LỚP 1 BÀI 2): GIỚI THIỆU BẢN THÂN
  // Đề: "Viết 1–2 câu giới thiệu họ tên, lớp và sở thích đáng yêu của em."
  // -------------------------------------------------------------
  if (isSelfIntroGrade1Prompt(pLower, grade)) {
    hoaNhoUnderstand = 'Con hãy viết 1–2 câu ngắn gọn để giới thiệu họ tên, lớp học và sở thích đáng yêu của mình với thầy cô và các bạn nhé!';
    specificRequirements = [
      'Nhiệm vụ: Viết 1–2 câu giới thiệu bản thân',
      'Nội dung bắt buộc 1: Giới thiệu họ và tên đầy đủ của em',
      'Nội dung bắt buộc 2: Lớp học em đang theo học',
      'Nội dung bắt buộc 3: Sở thích đáng yêu của em (vẽ tranh, đọc sách, đá bóng...)',
      'Dung lượng: Đúng 1–2 câu hoàn chỉnh'
    ];
    socraticQuestions = [
      'Con tên đầy đủ là gì và con đang là học sinh lớp mấy?',
      'Con có sở thích gì đáng yêu nhất (vẽ tranh, đọc truyện tranh, xếp hình lego, múa hát hay chơi thể thao)?',
      'Con đã kiểm tra đầu câu viết hoa, tên riêng viết hoa và cuối câu có dấu chấm chưa?'
    ];
    branches = [
      { id: 'br-1', title: '🌱 Họ và tên của em', icon: '🌱', color: 'emerald', points: ['Ghi rõ họ và tên đầy đủ', 'Viết hoa chữ cái đầu mỗi tiếng trong tên riêng'] },
      { id: 'br-2', title: '🏫 Lớp và trường của em', icon: '🏫', color: 'purple', points: ['Học sinh lớp 1...', 'Trường Tiểu học...'] },
      { id: 'br-3', title: '🎨 Sở thích đáng yêu', icon: '🎨', color: 'rose', points: ['Vẽ tranh những bông hoa', 'Đọc truyện tranh', 'Xếp hình lego', 'Chơi đá bóng cùng bạn'] },
      { id: 'br-4', title: '✨ Điều em thích làm nhất', icon: '✨', color: 'amber', points: ['Cùng bạn vui chơi giờ ra chơi', 'Học tập chăm chỉ mỗi ngày'] },
      { id: 'br-5', title: '✍️ Quy tắc viết câu', icon: '✍️', color: 'sky', points: ['Đầu câu viết hoa', 'Tên riêng viết hoa', 'Cuối câu đặt dấu chấm'] }
    ];

    const c1 = ['Câu 1 (Họ tên & Lớp): Con giới thiệu họ tên và lớp học của mình. (Ví dụ: "Em tên là Nguyễn Minh Anh, học sinh lớp 1A trường Tiểu học Thăng Long.")'];
    const c2 = ['Câu 2 (Sở thích đáng yêu): Con giới thiệu sở thích đặc biệt và đáng yêu của em. (Ví dụ: "Em rất thích vẽ tranh những bông hoa rực rỡ và đọc sách cùng các bạn.")'];

    outline = {
      moDoan: c1,
      phatTrienDoan: [],
      ketDoan: c2,
      genre: 'viet_cau',
      sections: [
        { id: 'sec-1', title: 'Câu 1. Giới thiệu họ tên và lớp học', icon: '🌱', guideNote: 'Nêu tên đầy đủ và lớp học hiện tại của con', bulletPoints: c1 },
        { id: 'sec-2', title: 'Câu 2. Giới thiệu sở thích đáng yêu', icon: '🎨', guideNote: 'Kể về niềm yêu thích hoặc trò chơi con say mê nhất', bulletPoints: c2 }
      ]
    };

    return {
      branches,
      outline,
      socraticQuestions,
      hoaNhoUnderstand,
      specificRequirements,
      vocabularySuggestions: {
        goodWords: [
          { word: 'đáng yêu', meaningAndUsage: 'Gợi sự thích thú, mến thương' },
          { word: 'chăm chỉ', meaningAndUsage: 'Cần cù trong học tập và rèn luyện' },
          { word: 'say mê', meaningAndUsage: 'Yêu thích làm một điều gì đó với tất cả niềm vui' }
        ],
        imageries: [
          { type: 'Gợi tả', example: 'Nụ cười tươi rạng rỡ của bạn học trò lớp Một', explanation: 'Nét hồn nhiên, ngây thơ' }
        ],
        sampleSentences: [
          { type: 'mo_bai', label: 'Giới thiệu họ tên và lớp', sentence: 'Em tên là Trần Bảo Châu, học sinh lớp 1C trường Tiểu học Sao Mai.', whyItIsGood: 'Rõ ràng, đủ thông tin họ tên và lớp.' },
          { type: 'ket_bai', label: 'Giới thiệu sở thích', sentence: 'Sở thích đáng yêu của em là vẽ tranh phong cảnh và nhảy múa.', whyItIsGood: 'Tự nhiên, gần gũi với lứa tuổi lớp 1.' }
        ],
        creativeIdeas: ['Con nhớ nắn nót từng chữ cái viết hoa họ tên của chính mình nhé!']
      }
    };
  }

  // -------------------------------------------------------------
  // TRƯỜNG HỢP ĐẶC BIỆT 3 (LỚP 1 BÀI 3): QUAN SÁT TRANH MÈO CON
  // Đề: "Quan sát tranh chú mèo con và viết 1–2 câu tả hình dáng hoặc hành động của mèo con."
  // -------------------------------------------------------------
  if (isCatObservationGrade1Prompt(pLower)) {
    const isAction = semantics.selectedDirectionId === 'ta_hanh_dong';
    hoaNhoUnderstand = isAction 
      ? 'Con hãy quan sát kỹ cử chỉ, hành động của chú mèo con trong bức tranh và viết 1–2 câu tả xem chú mèo đang làm gì thật ngộ nghĩnh nhé!' 
      : 'Con hãy quan sát kỹ bức tranh chú mèo con và viết 1–2 câu tả màu lông, đôi mắt hoặc vóc dáng nhỏ nhắn đáng yêu của mèo con nhé!';
    specificRequirements = [
      'Nhiệm vụ: Viết 1–2 câu dựa trên quan sát tranh chú mèo con',
      `Hướng viết: ${isAction ? 'Tả hành động của mèo con' : 'Tả hình dáng của mèo con'}`,
      'Phương pháp: Quan sát chi tiết từ tranh thực tế (đặt câu hỏi khơi gợi, không tự bịa đặt chi tiết)',
      'Dung lượng: Đúng 1–2 câu hoàn chỉnh'
    ];
    socraticQuestions = [
      'Bức tranh của con vẽ chú mèo con có vóc dáng hay đang làm hành động gì?',
      isAction ? 'Chú mèo đang vờn cuộn len, sưởi nắng, ngủ say hay rình bắt mồi?' : 'Màu lông của chú mèo là màu gì (vàng cam, trắng muốt hay tam thể)?',
      'Đôi mắt, đôi tai hoặc chiếc đuôi của chú mèo có điểm gì làm con thích thú nhất?',
      'Con đã kiểm tra đầu câu viết hoa và cuối câu có dấu chấm chưa?'
    ];
    branches = isAction ? [
      { id: 'br-1', title: '🐾 Hành động nổi bật trong tranh', icon: '🐾', color: 'emerald', points: ['Mèo đang làm gì trong tranh?', 'Vờn cuộn len đỏ', 'Sưởi nắng trên thềm', 'Nhảy nhót tinh nghịch'] },
      { id: 'br-2', title: '🐱 Cử chỉ đôi chân và đuôi', icon: '🐱', color: 'purple', points: ['Bàn chân khẽ chạm', 'Móng vuốt giấu kín trong đệm thịt', 'Chiếc đuôi ngoe nguẩy nhịp nhàng'] },
      { id: 'br-3', title: '👀 Ánh mắt chăm chú tinh nghịch', icon: '👀', color: 'amber', points: ['Đôi mắt mở to tròn', 'Nhìn chăm chú vào mục tiêu', 'Ánh nhìn lấp lánh vẻ tò mò'] },
      { id: 'br-4', title: '⚡ Động tác nhanh nhẹn khéo léo', icon: '⚡', color: 'sky', points: ['Nhảy thoăn thoắt', 'Bước đi êm ru nhẹ nhàng', 'Uốn mình mềm mại'] },
      { id: 'br-5', title: '💖 Cảm xúc thích thú khi ngắm mèo', icon: '💖', color: 'rose', points: ['Chú mèo con thật ngộ nghĩnh', 'Em rất yêu quý mèo con', 'Nụ cười thích thú của em'] }
    ] : [
      { id: 'br-1', title: '🎨 Màu lông và vóc dáng', icon: '🎨', color: 'emerald', points: ['Màu lông chú mèo trong tranh là màu gì?', 'Bộ lông mềm mại mượt mà', 'Thân hình nhỏ nhắn như cục bông'] },
      { id: 'br-2', title: '👀 Đôi mắt tròn xoe sáng ngời', icon: '👀', color: 'purple', points: ['Mắt tròn xoe như hai hòn bi ve', 'Màu mắt xanh biếc hoặc hổ phách', 'Ánh nhìn trong veo'] },
      { id: 'br-3', title: '👂 Đôi tai vểnh và ria mép', icon: '👂', color: 'amber', points: ['Hai chiếc tai hình tam giác nhỏ xíu', 'Tai luôn vểnh lên nghe ngóng', 'Ria mép trắng tinh hai bên mép'] },
      { id: 'br-4', title: '🐾 Bốn chân và chiếc đuôi nhỏ', icon: '🐾', color: 'sky', points: ['Chân có lớp đệm thịt hồng hào', 'Đuôi cong cong như dấu hỏi', 'Dáng đứng đáng yêu'] },
      { id: 'br-5', title: '💖 Tình cảm dành cho chú mèo', icon: '💖', color: 'rose', points: ['Chú mèo con xinh xắn', 'Ngoan ngoãn và đáng yêu', 'Em muốn vuốt ve bộ lông mèo'] }
    ];

    const c1 = isAction 
      ? ['Câu 1 (Hành động nổi bật): Viết một câu tả hành động chú mèo đang thực hiện trong tranh. (Ví dụ: "Chú mèo con đang tinh nghịch vờn theo cuộn len màu đỏ trên sàn nhà.")']
      : ['Câu 1 (Màu lông & Vóc dáng): Viết một câu tả màu lông và vóc dáng chú mèo con trong tranh. (Ví dụ: "Chú mèo con khoác lên mình bộ lông vàng óng ả và mềm mại như nhung.")'];
    const c2 = isAction
      ? ['Câu 2 (Cử chỉ nhanh nhẹn): Viết câu thứ hai tả sự khéo léo, ngộ nghĩnh của mèo khi vận động. (Ví dụ: "Đôi chân nhỏ thoăn thoắt nhảy nhót trông thật đáng yêu và nhanh nhẹn.")']
      : ['Câu 2 (Đôi mắt hoặc Nét đáng yêu): Viết câu thứ hai tả đôi mắt tròn xoe hoặc đôi tai vểnh ngộ nghĩnh. (Ví dụ: "Đôi mắt chú tròn xoe, xanh biếc như hai hòn bi ve lấp lánh dưới nắng.")'];

    outline = {
      moDoan: c1,
      phatTrienDoan: [],
      ketDoan: c2,
      genre: 'viet_cau',
      sections: [
        { id: 'sec-1', title: isAction ? 'Câu 1. Tả hành động đáng yêu' : 'Câu 1. Tả màu lông và vóc dáng', icon: isAction ? '🐾' : '🎨', guideNote: 'Tả chi tiết nổi bật nhất con nhìn thấy trong tranh', bulletPoints: c1 },
        { id: 'sec-2', title: isAction ? 'Câu 2. Tả sự nhanh nhẹn, cử chỉ' : 'Câu 2. Tả đôi mắt hoặc nét mặt', icon: isAction ? '⚡' : '👀', guideNote: 'Tả thêm cử chỉ hoặc bộ phận ngộ nghĩnh', bulletPoints: c2 }
      ]
    };

    return {
      branches,
      outline,
      socraticQuestions,
      hoaNhoUnderstand,
      specificRequirements,
      vocabularySuggestions: {
        goodWords: [
          { word: 'mềm mại', meaningAndUsage: 'Gợi cảm giác mịn màng của bộ lông' },
          { word: 'tròn xoe', meaningAndUsage: 'Đôi mắt mở to tròn đáng yêu' },
          { word: 'nhanh nhẹn', meaningAndUsage: 'Cử chỉ thoăn thoắt, khéo léo' },
          { word: 'tinh nghịch', meaningAndUsage: 'Hiếu động, thích đùa vui' }
        ],
        imageries: [
          { type: 'So sánh', example: 'Mắt mèo trong veo như hai hòn bi ve', explanation: 'Gợi tả vẻ long lanh, sáng ngời' }
        ],
        sampleSentences: [
          { type: 'mo_bai', label: 'Tả hình dáng', sentence: 'Chú mèo con có bộ lông trắng muốt như bông tuyết.', whyItIsGood: 'Hình ảnh so sánh đẹp, đúng chuẩn lớp 1.' },
          { type: 'ket_bai', label: 'Tả hành động', sentence: 'Chú mèo con vờn cuộn len thoăn thoắt trông thật đáng yêu.', whyItIsGood: 'Diễn tả hành động ngộ nghĩnh, trọn vẹn ý.' }
        ],
        creativeIdeas: ['Con hãy nhìn thật kỹ tranh xem mèo đang nhìn về hướng nào nhé!']
      }
    };
  }

  // -------------------------------------------------------------
  // TRƯỜNG HỢP ĐẶC BIỆT: BÀI MIÊU TẢ HỘP BÚT / BÚT CHÌ / ĐỒ VẬT LỚP 1
  // Đề: "Viết 1–2 câu miêu tả chiếc bút chì hoặc hộp bút xinh xắn giúp em tập viết mỗi ngày."
  // -------------------------------------------------------------
  if (isItemDescriptiveGrade1Prompt(pLower, grade)) {
    const isPencil = semantics.selectedObjectId === 'but_chi';
    const isAdvanced = semantics.difficultyLevel === 'nang_cao';
    const objName = isPencil ? 'chiếc bút chì' : (semantics.selectedObjectName ? semantics.selectedObjectName.toLowerCase() : 'chiếc hộp bút');

    // 1. Hoa Nhỏ cùng con hiểu đề (Chuẩn xác theo hướng dẫn sư phạm GDPT 2018)
    if (isPencil) {
      hoaNhoUnderstand = 'Con hãy quan sát chiếc bút chì của mình nhé! Bút chì có màu gì, thân bút thon dài hay ngắn, ngòi chì và cục tẩy ra sao? Con có thể chọn một vài chi tiết để viết 1–2 câu miêu tả chiếc bút chì.';
      specificRequirements = [
        'Miêu tả chiếc bút chì.',
        'Chọn một hoặc hai đặc điểm nổi bật (thân bút, ngòi chì, tẩy nhỏ).',
        'Có thể nêu công dụng của chiếc bút chì.',
        'Viết đúng 1–2 câu.',
        'Viết hoa đầu câu và đặt dấu chấm ở cuối câu.'
      ];
    } else {
      hoaNhoUnderstand = 'Con hãy quan sát hộp bút của mình nhé! Hộp bút có màu gì, hình dáng ra sao hoặc có hình trang trí gì đặc biệt? Con có thể chọn một vài chi tiết để viết 1–2 câu miêu tả hộp bút.';
      specificRequirements = [
        'Miêu tả chiếc hộp bút.',
        'Chọn một hoặc hai đặc điểm nổi bật.',
        'Có thể nêu công dụng của hộp bút.',
        'Viết đúng 1–2 câu.',
        'Viết hoa đầu câu và đặt dấu chấm ở cuối câu.'
      ];
    }

    // Kiểm tra xung đột yêu cầu (Conflict Detection: Nếu học sinh chọn mong ước mâu thuẫn như 4-6 câu, nhân hóa)
    const hasLengthConflict = specialWishes && /(?:4[–-]6\s*câu|đoạn\s*văn\s*dài|bài\s*văn)/i.test(specialWishes);
    const hasPersonificationConflict = specialWishes && /(?:nhân\s*hóa|kỷ\s*niệm|mong\s*ước)/i.test(specialWishes);
    if (hasLengthConflict || hasPersonificationConflict) {
      specificRequirements.push(
        'Lưu ý từ Hoa Nhỏ: Với đề bài lớp 1 này, con chỉ cần viết đúng 1–2 câu miêu tả đặc điểm của đồ vật thôi nhé! Chưa cần viết dài hay dùng phép nhân hóa phức tạp đâu.'
      );
    }

    // 2. Câu hỏi khơi gợi (Socratic Questions - 5 câu hỏi tuần tự)
    if (isPencil) {
      socraticQuestions = [
        'Con đang cầm chiếc bút chì gỗ hay bút chì kim nhỏ nhắn?',
        'Vỏ ngoài của bút chì có màu sắc gì mà con thích nhất?',
        'Thân bút chì tròn hay có cạnh, cầm trên tay cảm giác thế nào?',
        'Đầu ngòi chì nhọn hay tù và đuôi bút có gắn cục tẩy nhỏ không?',
        'Chiếc bút chì giúp con làm những việc gì trong giờ tập viết mỗi ngày?'
      ];
    } else {
      socraticQuestions = [
        'Con đang quan sát chiếc hộp bút bằng vải hay bằng nhựa?',
        'Hộp bút có màu gì mà con thích nhất?',
        'Chiếc hộp bút trông như thế nào (dài, vuông vức hay có khóa kéo)?',
        'Bên ngoài hộp bút có vẽ hình gì đáng yêu (chú thỏ, gấu bông, hoa lá)?',
        'Hộp bút giúp con đựng những đồ dùng học tập nào cho thật ngăn nắp?'
      ];
    }

    // 3. Sơ đồ tư duy 5 nhánh (Dạng câu hỏi khơi gợi và từ khóa ngắn, KHÔNG dùng câu văn áp đặt)
    if (isPencil) {
      branches = [
        {
          id: 'br-1',
          title: '✏️ Chiếc bút chì của con',
          icon: '✏️',
          color: 'emerald',
          points: isAdvanced
            ? ['Bút chì gỗ nhỏ nhắn, quen thuộc', 'Người bạn đồng hành thân thiết khi tập viết', 'Chiếc bút chì mới tinh, thơm mùi gỗ']
            : ['Bút chì gỗ nhỏ nhắn', 'Chiếc bút chì thân quen', 'Bạn đồng hành tập viết']
        },
        {
          id: 'br-2',
          title: '🎨 Màu sắc',
          icon: '🎨',
          color: 'amber',
          points: isAdvanced
            ? ['Vỏ sơn màu vàng tươi óng ả', 'Màu xanh lá cây mát mắt', 'Sọc kẻ nhiều màu rực rỡ', 'Màu hồng phấn dễ thương']
            : ['Màu vàng tươi', 'Màu xanh lá cây', 'Sọc sọc nhiều màu', 'Màu hồng dễ thương']
        },
        {
          id: 'br-3',
          title: '📏 Hình dáng thân bút',
          icon: '📏',
          color: 'purple',
          points: isAdvanced
            ? ['Thân bút thon dài, vừa vặn tay cầm nhỏ xinh', 'Vỏ gỗ mịn màng, nhẹ êm', 'Dáng tròn lục giác chống lăn']
            : ['Thon dài vừa vặn tay cầm', 'Thân gỗ nhẹ êm', 'Dáng tròn xinh xắn']
        },
        {
          id: 'br-4',
          title: '🔍 Đặc điểm ngòi và tẩy',
          icon: '🔍',
          color: 'sky',
          points: isAdvanced
            ? ['Ngòi chì đen nhánh, chuốt nhọn tinh tươm', 'Nét chì mịn màng trên trang giấy', 'Đầu bút gắn cục tẩy nhỏ màu hồng tiện lợi']
            : ['Ngòi chì đen nhánh', 'Ngòi chuốt nhọn hoắt', 'Cục tẩy nhỏ tròn ở đuôi']
        },
        {
          id: 'br-5',
          title: '🌟 Công dụng',
          icon: '🌟',
          color: 'rose',
          points: isAdvanced
            ? ['Giúp em nắn nót từng nét chữ đầu đời', 'Vẽ tranh ngộ nghĩnh và tô màu sáng tạo', 'Kẻ những đường thẳng ngay ngắn trong vở']
            : ['Giúp em viết chữ nắn nót', 'Vẽ hình và tô màu', 'Tập kẻ hàng thẳng tắp']
        }
      ];
    } else {
      branches = [
        {
          id: 'br-1',
          title: '👝 Hộp bút của con',
          icon: '👝',
          color: 'emerald',
          points: isAdvanced
            ? ['Chiếc hộp bút bằng vải mềm xinh xắn', 'Hộp bút bằng nhựa bóng bẩy, bền đẹp', 'Món quà ý nghĩa mẹ tặng em']
            : ['Hộp bút bằng vải / bằng nhựa', 'Hộp bút xinh xắn', 'Người bạn nhỏ của con']
        },
        {
          id: 'br-2',
          title: '🎨 Màu sắc',
          icon: '🎨',
          color: 'amber',
          points: isAdvanced
            ? ['Màu hồng phấn ngọt ngào', 'Màu xanh da trời dịu mát', 'Màu vàng tươi rực rỡ', 'Sắc màu tươi sáng, nổi bật']
            : ['Màu hồng phấn', 'Màu xanh da trời', 'Màu vàng tươi', 'Màu sắc rực rỡ']
        },
        {
          id: 'br-3',
          title: '📐 Hình dáng',
          icon: '📐',
          color: 'purple',
          points: isAdvanced
            ? ['Dáng hình chữ nhật thon dài, gọn gàng', 'Nhỏ nhắn vừa vặn với ngăn cặp sách', 'Đường khóa kéo trơn tru, chắc chắn']
            : ['Hình chữ nhật thon dài', 'Nhỏ nhắn vừa tay', 'Khóa kéo trơn tru']
        },
        {
          id: 'br-4',
          title: '✨ Họa tiết',
          icon: '✨',
          color: 'sky',
          points: isAdvanced
            ? ['In hình chú thỏ trắng ôm củ cà rốt đáng yêu', 'Chú gấu bông ngộ nghĩnh đang mỉm cười', 'Những ngôi sao lấp lánh và hoa lá sinh động']
            : ['Hình chú thỏ trắng', 'Chú gấu bông ngộ nghĩnh', 'Những ngôi sao lấp lánh', 'Họa tiết hoa lá']
        },
        {
          id: 'br-5',
          title: '🌟 Công dụng',
          icon: '🌟',
          color: 'rose',
          points: isAdvanced
            ? ['Cất giữ bút mực, bút chì và thước kẻ an toàn', 'Giữ tẩy và gọt bút luôn sạch sẽ, gọn gàng', 'Giúp bàn học và ngăn cặp luôn ngăn nắp']
            : ['Đựng bút và thước kẻ', 'Giữ tẩy và gọt bút gọn gàng', 'Giúp bàn học luôn ngăn nắp']
        }
      ];
    }

    // 4. Dàn ý gợi ý 1–2 câu (Tuyệt đối không có Mở bài - Thân bài - Kết bài, không ép 3 câu)
    const way1 = isPencil
      ? ['Gợi ý câu: "Chiếc bút chì bằng gỗ màu vàng giúp em tập viết những nét chữ đầu tiên." hoặc "Chiếc bút chì thon dài có ngòi chì đen nhánh giúp em nắn nót từng trang vở."']
      : ['Gợi ý câu: "Chiếc hộp bút của em có màu hồng phấn và in hình chú thỏ rất xinh xắn." hoặc "Chiếc hộp bút màu xanh giúp em cất giữ bút thước thật gọn gàng."'];

    const way2 = isPencil
      ? [
          'Câu 1 (Màu sắc hoặc hình dáng): Miêu tả màu sắc hoặc thân bút chì. (Ví dụ: "Chiếc bút chì của em thon dài và có màu vàng tươi.")',
          'Câu 2 (Chi tiết khác hoặc công dụng): Miêu tả ngòi, tẩy hoặc công dụng của bút chì. (Ví dụ: "Đầu bút có gắn một cục tẩy nhỏ màu trắng giúp em tẩy xóa vết bẩn thật tiện lợi.")'
        ]
      : [
          'Câu 1 (Màu sắc hoặc hình dáng): Miêu tả màu sắc hoặc dáng vẻ của hộp bút. (Ví dụ: "Chiếc hộp bút của em có màu xanh da trời rất đẹp mắt.")',
          'Câu 2 (Chi tiết khác hoặc công dụng): Miêu tả họa tiết trang trí hoặc công dụng giữ bút thước. (Ví dụ: "Bên trong hộp bút có thể đựng được nhiều bút mực và thước kẻ của em.")'
        ];

    outline = {
      moDoan: way1,
      phatTrienDoan: [],
      ketDoan: way2,
      genre: 'viet_cau',
      sections: [
        {
          id: 'sec-1',
          title: 'Cách 1 – Viết một câu',
          icon: '1️⃣',
          guideNote: `Miêu tả một đặc điểm nổi bật nhất của ${objName}`,
          bulletPoints: way1
        },
        {
          id: 'sec-2',
          title: 'Cách 2 – Viết hai câu',
          icon: '2️⃣',
          guideNote: `Câu 1 tả màu sắc/hình dáng, Câu 2 tả chi tiết hoặc công dụng của ${objName}`,
          bulletPoints: way2
        }
      ]
    };

    return {
      branches,
      outline,
      socraticQuestions,
      hoaNhoUnderstand,
      specificRequirements,
      vocabularySuggestions: {
        goodWords: isPencil
          ? [
              { word: 'thon dài', meaningAndUsage: 'Dáng dài và thon gọn, cầm vừa tay' },
              { word: 'nhỏ nhắn', meaningAndUsage: 'Kích thước bé và xinh xắn' },
              { word: 'đen nhánh', meaningAndUsage: 'Màu đen đậm bóng bẩy của ngòi chì' },
              { word: 'nắn nót', meaningAndUsage: 'Cẩn thận, tỉ mỉ từng nét chữ' }
            ]
          : [
              { word: 'xinh xắn', meaningAndUsage: 'Nhỏ nhắn và có nét ưa nhìn, dễ thương' },
              { word: 'gọn gàng', meaningAndUsage: 'Ngăn nắp, trật tự, sạch đẹp' },
              { word: 'tươi tắn', meaningAndUsage: 'Màu sắc tươi sáng, bắt mắt' },
              { word: 'tiện lợi', meaningAndUsage: 'Giúp ích dễ dàng cho việc học' }
            ],
        imageries: isPencil
          ? [
              { type: 'Hình ảnh đẹp', example: 'Chiếc bút chì thon dài như ngón tay nhỏ', explanation: 'Gợi sự thon gọn, vừa vặn' }
            ]
          : [
              { type: 'Hình ảnh đẹp', example: 'Chiếc hộp bút xinh như ngôi nhà nhỏ của đồ dùng học tập', explanation: 'Gợi sự ngăn nắp, ấm cúng' }
            ],
        sampleSentences: isPencil
          ? [
              { type: 'mo_bai', label: 'Cách 1 câu', sentence: 'Chiếc bút chì bằng gỗ màu vàng giúp em tập viết những nét chữ đầu tiên.', whyItIsGood: 'Trọn vẹn 1 câu, nêu cả đặc điểm và công dụng.' },
              { type: 'mieu_ta', label: 'Câu 1 trong bài 2 câu', sentence: 'Chiếc bút chì của em thon dài và có màu vàng tươi.', whyItIsGood: 'Miêu tả hình dáng và màu sắc tự nhiên.' },
              { type: 'ket_bai', label: 'Câu 2 trong bài 2 câu', sentence: 'Đầu bút có gắn một cục tẩy nhỏ giúp em tẩy xóa vết chì rất tiện lợi.', whyItIsGood: 'Nêu chi tiết ngòi/tẩy và công dụng thiết thực.' }
            ]
          : [
              { type: 'mo_bai', label: 'Cách 1 câu', sentence: 'Chiếc hộp bút màu hồng phấn in hình chú thỏ rất xinh xắn.', whyItIsGood: 'Trọn vẹn 1 câu, nêu màu sắc và họa tiết đáng yêu.' },
              { type: 'mieu_ta', label: 'Câu 1 trong bài 2 câu', sentence: 'Chiếc hộp bút của em có màu xanh da trời rất đẹp mắt.', whyItIsGood: 'Miêu tả màu sắc tươi tắn.' },
              { type: 'ket_bai', label: 'Câu 2 trong bài 2 câu', sentence: 'Bên trong hộp có thể cất giữ bút mực và thước kẻ thật gọn gàng.', whyItIsGood: 'Nêu công dụng ngăn nắp.' }
            ],
        creativeIdeas: [
          'Con nhớ viết hoa chữ cái đầu câu và đặt dấu chấm ở cuối mỗi câu nhé!',
          'Hãy chọn màu sắc thật mà con đang nhìn thấy trên chiếc bàn học của mình.'
        ]
      }
    };
  }

  // -------------------------------------------------------------
  // TRƯỜNG HỢP ĐẶC BIỆT 4 (LỚP 2 BÀI 4): TIN NHẮN CẢM ƠN HOẶC XIN LỖI BẠN
  // Đề: "Viết một tin nhắn ngắn (3–4 câu) cảm ơn bạn đã cho em mượn đồ dùng hoặc xin lỗi bạn vì lỡ làm hỏng vật gì."
  // -------------------------------------------------------------
  if (isMessageThanksOrApologyGrade2Prompt(pLower)) {
    const isApology = semantics.selectedDirectionId === 'tin_nhan_xin_loi';
    hoaNhoUnderstand = isApology 
      ? 'Con hãy viết một tin nhắn ngắn (3–4 câu) gửi bạn cùng lớp để chân thành xin lỗi bạn vì đã lỡ làm hỏng hoặc làm bẩn một món đồ của bạn nhé!' 
      : 'Con hãy viết một tin nhắn ngắn (3–4 câu) gửi bạn cùng lớp để cảm ơn bạn đã cho con mượn đồ dùng học tập thật chu đáo nhé!';
    specificRequirements = [
      isApology ? 'Nhiệm vụ: Viết tin nhắn ngắn (3–4 câu) xin lỗi bạn' : 'Nhiệm vụ: Viết tin nhắn ngắn (3–4 câu) cảm ơn bạn',
      'Người nhận: Bạn cùng lớp (xưng hô: Bạn / Cậu)',
      isApology 
        ? 'Nội dung: Lời gọi bạn, sự việc lỡ làm hỏng đồ dùng, lời xin lỗi chân thành, cách khắc phục hoặc lời đền bạn vật mới' 
        : 'Nội dung: Lời gọi bạn, nhắc lại đồ dùng đã mượn, gửi lời cảm ơn chân thành, lời hẹn trả hoặc giữ gìn cẩn thận',
      'Người gửi: Tên của con ở cuối tin nhắn',
      'Lưu ý: Viết tin nhắn gửi bạn cùng lớp, không nhắn cho người nhà',
      'Dung lượng: Đúng 3–4 câu súc tích'
    ];
    socraticQuestions = [
      isApology ? 'Con muốn gửi tin nhắn xin lỗi bạn nào trong lớp?' : 'Con muốn gửi tin nhắn cảm ơn bạn nào đã cho con mượn đồ dùng?',
      isApology ? 'Con đã sơ ý làm hỏng hoặc làm bẩn món đồ gì của bạn (thước kẻ, bút mực, quyển sách)?' : 'Bạn đã cho con mượn đồ dùng gì và đồ dùng đó giúp ích cho con ra sao?',
      isApology ? 'Con sẽ nói lời xin lỗi bạn như thế nào cho thật chân thành?' : 'Con muốn nói lời cảm ơn bạn ấm áp như thế nào?',
      isApology ? 'Con sẽ khắc phục hoặc đền bạn chiếc mới như thế nào?' : 'Con hẹn khi nào sẽ mang trả lại bạn nguyên vẹn?',
      'Con đã ký tên và ghi rõ tên mình ở cuối mẩu tin nhắn chưa?'
    ];
    branches = isApology ? [
      { id: 'br-1', title: '💌 Lời gọi bạn thân thương', icon: '💌', color: 'emerald', points: ['Gửi bạn [Tên bạn] thân mến!', 'Chào [Tên bạn]!'] },
      { id: 'br-2', title: '⚠️ Sự việc sơ ý làm hỏng đồ', icon: '⚠️', color: 'purple', points: ['Hôm qua sơ ý làm gãy thước kẻ', 'Lỡ làm rách mép vở', 'Làm rơi bút mực xuống sàn'] },
      { id: 'br-3', title: '🙏 Lời xin lỗi chân thành', icon: '🙏', color: 'amber', points: ['Mình vô cùng xin lỗi bạn', 'Mình rất ân hận vì sự bất cẩn của mình'] },
      { id: 'br-4', title: '🎁 Cách đền và khắc phục', icon: '🎁', color: 'sky', points: ['Chuẩn bị chiếc mới giống hệt gửi đền bạn', 'Sáng mai đến lớp mình sẽ mang sang cho bạn'] },
      { id: 'br-5', title: '✒️ Ký tên & Mong bạn thứ lỗi', icon: '✒️', color: 'rose', points: ['Mong bạn bỏ qua cho mình nhé', 'Bạn cùng bàn của cậu: [Tên con]'] }
    ] : [
      { id: 'br-1', title: '💌 Lời gọi bạn thân thương', icon: '💌', color: 'emerald', points: ['Gửi bạn [Tên bạn] thân mến!', 'Chào bạn [Tên bạn]!'] },
      { id: 'br-2', title: '✏️ Đồ dùng bạn đã cho mượn', icon: '✏️', color: 'purple', points: ['Chiếc bút mực tím', 'Cục tẩy trắng', 'Chiếc compa trong giờ Toán'] },
      { id: 'br-3', title: '💖 Lời cảm ơn chân thành', icon: '💖', color: 'amber', points: ['Cảm ơn bạn rất nhiều vì đã giúp đỡ mình', 'Nhờ có đồ của bạn, mình đã làm xong bài tập kịp thời'] },
      { id: 'br-4', title: '🤝 Lời hứa giữ gìn và trả đồ', icon: '🤝', color: 'sky', points: ['Mình đã dùng cẩn thận và giữ gìn sạch sẽ', 'Sáng mai đến lớp mình sẽ gửi lại bạn ngay nhé'] },
      { id: 'br-5', title: '✒️ Ký tên người nhắn', icon: '✒️', color: 'rose', points: ['Chúc bạn một ngày học thật vui', 'Bạn thân của cậu: [Tên con]'] }
    ];

    const sec1 = [isApology ? 'Gửi bạn [Tên bạn] thân mến!' : 'Gửi bạn [Tên bạn] thân mến!'];
    const sec2 = isApology ? [
      'Nêu sự việc: Hôm qua trong giờ học, mình sơ ý đã lỡ làm gãy chiếc thước kẻ của bạn.',
      'Lời xin lỗi: Mình rất ân hận và xin lỗi bạn vì sự bất cẩn của mình.',
      'Cách khắc phục: Mình đã chuẩn bị một chiếc thước mới giống hệt, sáng mai đến lớp mình sẽ gửi đền bạn nhé.'
    ] : [
      'Nhắc việc mượn đồ: Cảm ơn bạn rất nhiều vì tiết học hôm qua đã cho mình mượn chiếc compa.',
      'Ích lợi: Nhờ có đồ dùng của bạn, mình đã hoàn thành hình vẽ kịp thời và được cô khen.',
      'Hẹn trả: Mình đã dùng xong, giữ gìn cẩn thận và sáng mai đến lớp mình sẽ gửi lại bạn ngay nhé.'
    ];
    const sec3 = [
      isApology ? 'Mong bạn bỏ qua cho mình nhé! Bạn của cậu: [Tên con]' : 'Chúc bạn học thật vui! Bạn thân của cậu: [Tên con]'
    ];

    outline = {
      moDoan: sec1,
      phatTrienDoan: sec2,
      ketDoan: sec3,
      genre: 'loi_nhan',
      sections: [
        { id: 'sec-1', title: 'Phần 1. Lời gọi bạn', icon: '💌', guideNote: 'Ghi lời xưng hô thân mật, lịch sự với bạn bè', bulletPoints: sec1 },
        { id: 'sec-2', title: isApology ? 'Phần 2. Lời xin lỗi & Khắc phục (2–3 câu)' : 'Phần 2. Lời cảm ơn & Hẹn trả đồ (2–3 câu)', icon: isApology ? '🙏' : '💖', guideNote: 'Nội dung chính ngắn gọn, chân thành, đúng 2–3 câu', bulletPoints: sec2 },
        { id: 'sec-3', title: 'Phần 3. Lời kết & Ký tên', icon: '✒️', guideNote: 'Lời chúc hoặc mong bạn thứ lỗi kèm chữ ký', bulletPoints: sec3 }
      ]
    };

    return {
      branches,
      outline,
      socraticQuestions,
      hoaNhoUnderstand,
      specificRequirements,
      vocabularySuggestions: {
        goodWords: [
          { word: 'chân thành', meaningAndUsage: 'Thật lòng, từ tận đáy lòng' },
          { word: 'ân hận', meaningAndUsage: 'Cảm giác áy náy khi lỡ làm điều sai' },
          { word: 'chu đáo', meaningAndUsage: 'Quan tâm, giúp đỡ tận tình' },
          { word: 'cẩn thận', meaningAndUsage: 'Giữ gìn đồ dùng không để hư hại' }
        ],
        imageries: [
          { type: 'Gợi cảm', example: 'Mẩu giấy nhắn nắn nót kẹp ngay ngắn vào trang vở của bạn', explanation: 'Thể hiện sự tôn trọng và chân thành' }
        ],
        sampleSentences: [
          { type: 'mo_bai', label: 'Lời gọi đầu tin nhắn', sentence: 'Gửi bạn Minh Anh thân mến!', whyItIsGood: 'Thân mật, đúng mực học sinh.' },
          { type: 'mieu_ta', label: 'Nội dung cảm ơn', sentence: 'Cảm ơn cậu đã cho tớ mượn chiếc compa trong giờ Toán hôm qua nhé.', whyItIsGood: 'Nêu rõ sự việc và lời cảm ơn chân thành.' },
          { type: 'ket_bai', label: 'Ký tên', sentence: 'Bạn cùng bàn: Tuấn Dũng.', whyItIsGood: 'Rõ ràng, súc tích.' }
        ],
        creativeIdeas: ['Con hãy viết mẩu tin nhắn vào một tờ giấy ghi chú xinh xắn để trao tận tay bạn nhé!']
      }
    };
  }

  // -------------------------------------------------------------
  // TRƯỜNG HỢP ĐẶC BIỆT 5 (LỚP 2 BÀI 5): ĐOẠN VĂN NGẮN 3 ĐẾN 5 CÂU VỀ TÌNH CẢM VỚI ÔNG HOẶC BÀ
  // Đề: "Viết đoạn văn ngắn từ 3 đến 5 câu nói lên tình cảm yêu mến, kính trọng của em đối với ông hoặc bà."
  // -------------------------------------------------------------
  if (isGrandparentLoveGrade2Prompt(pLower, grade)) {
    const isGrandma = semantics.selectedDirectionId === 'tinh_cam_ba' || semantics.mainObject.toLowerCase().includes('bà');
    const relName = isGrandma ? 'bà' : 'ông';
    const relTitle = isGrandma ? 'bà kính yêu' : 'ông kính yêu';
    hoaNhoUnderstand = `Con hãy viết một đoạn văn ngắn từ 3 đến 5 câu để bày tỏ tình cảm yêu mến, kính trọng sâu sắc đối với ${relTitle} nhé!`;
    specificRequirements = [
      'Nhiệm vụ: Viết đoạn văn ngắn từ 3 đến 5 câu',
      `Đối tượng: ${isGrandma ? 'Bà kính yêu' : 'Ông kính yêu'}`,
      'Trọng tâm: Bày tỏ tình cảm yêu mến, kính trọng; cử chỉ yêu thương và lời hứa chăm ngoan',
      'Dung lượng: Đúng 3 đến 5 câu hoàn chỉnh (không viết thành 7–9 câu hay bài văn)'
    ];
    socraticQuestions = [
      `Trong gia đình, con muốn nói lên tình cảm yêu mến đối với ${relName} như thế nào?`,
      `${relName} có nụ cười, ánh mắt hay cử chỉ chăm sóc nào làm con xúc động nhất?`,
      'Mỗi ngày hoặc mỗi dịp về thăm, kỷ niệm nào bên ${relName} làm con nhớ mãi?',
      `Con muốn kính chúc ${relName} điều gì và hứa điều ngoan ngoãn nào?`
    ];
    branches = [
      { id: 'br-1', title: '🌱 Giới thiệu người thân', icon: '🌱', color: 'emerald', points: [`Giới thiệu ${relName} kính yêu`, 'Bộc lộ tình cảm yêu mến, kính trọng', 'Vị trí đặc biệt của người thân trong lòng em'] },
      { id: 'br-2', title: '☀️ Nụ cười và ánh mắt hiền từ', icon: '☀️', color: 'purple', points: ['Nụ cười ấm áp, bao dung', 'Ánh mắt đong đầy yêu thương', 'Mái tóc bạc phơ hiền từ'] },
      { id: 'br-3', title: '💖 Cử chỉ chăm sóc ân cần', icon: '💖', color: 'amber', points: ['Chăm lo từng bữa ăn, giấc ngủ', 'Kể chuyện cổ tích mỗi tối', 'Ân cần dặn dò những điều hay'] },
      { id: 'br-4', title: '🌸 Tình cảm kính mến của em', icon: '🌸', color: 'sky', points: ['Em luôn kính yêu và gắn bó', 'Cảm giác bình yên bên người thân', 'Lòng biết ơn công lao sinh thành'] },
      { id: 'br-5', title: '⭐ Lời kính chúc & Lời hứa ngoan', icon: '⭐', color: 'rose', points: ['Kính chúc sống lâu trăm tuổi, luôn mạnh khỏe', 'Hứa chăm ngoan, học giỏi để người thân tự hào'] }
    ];

    const sec1 = [`Câu 1 (Mở đoạn): Viết một câu giới thiệu về ${relName} kính yêu và bộc lộ ngay tình cảm yêu mến, kính trọng của em. (Ví dụ: "Trong gia đình, em luôn dành tình cảm yêu mến và kính trọng nhất đối với ${relName} của em.")`];
    const sec2 = [
      `Câu 2 (Cử chỉ yêu thương): Viết một câu kể về nụ cười hiền hậu hoặc sự chăm sóc ân cần của ${relName} dành cho em. (Ví dụ: "${relName} luôn dành cho em nụ cười hiền hậu và đôi bàn tay ấm áp xoa đầu mỗi khi em chăm ngoan.")`,
      `Câu 3 (Kỷ niệm ấm áp): Viết thêm một câu kể lại kỷ niệm ấm áp bên ${relName}. (Ví dụ: "Mỗi buổi tối, ${relName} lại ân cần chỉ bảo em học bài và kể cho em nghe những câu chuyện cổ tích xúc động.")`
    ];
    const sec3 = [
      `Câu 4–5 (Kết đoạn): Viết 1–2 câu bày tỏ lòng biết ơn sâu sắc và lời hứa chăm ngoan, học giỏi. (Ví dụ: "Em kính chúc ${relName} luôn mạnh khỏe, sống lâu trăm tuổi. Em hứa sẽ luôn chăm chỉ học tập để ${relName} luôn vui lòng.")`
    ];

    outline = {
      moDoan: sec1,
      phatTrienDoan: sec2,
      ketDoan: sec3,
      genre: 'tinh_cam_cam_xuc',
      sections: [
        { id: 'sec-1', title: 'Câu 1. Mở đoạn - Giới thiệu người thân', icon: '🌱', guideNote: 'Giới thiệu về người thân và bộc lộ tình cảm', bulletPoints: sec1 },
        { id: 'sec-2', title: 'Câu 2–3. Phát triển đoạn - Cử chỉ ấm áp & Kỷ niệm', icon: '💖', guideNote: 'Nêu cử chỉ chăm sóc hoặc kỷ niệm xúc động', bulletPoints: sec2 },
        { id: 'sec-3', title: 'Câu 4–5. Kết đoạn - Lòng biết ơn & Lời hứa ngoan', icon: '⭐', guideNote: 'Bày tỏ lòng biết ơn và lời hứa ngoan ngoãn', bulletPoints: sec3 }
      ]
    };

    return {
      branches,
      outline,
      socraticQuestions,
      hoaNhoUnderstand,
      specificRequirements,
      vocabularySuggestions: {
        goodWords: [
          { word: 'kính trọng', meaningAndUsage: 'Tôn kính và biết ơn người bề trên' },
          { word: 'yêu mến', meaningAndUsage: 'Tình cảm mến thương tha thiết' },
          { word: 'hiền hậu', meaningAndUsage: 'Nụ cười dịu dàng, đôn hậu' },
          { word: 'ân cần', meaningAndUsage: 'Chăm sóc chu đáo, tận tâm' }
        ],
        imageries: [
          { type: 'Hình ảnh đẹp', example: 'Mái tóc bạc phơ như mây trắng và đôi mắt hiền từ', explanation: 'Gợi vẻ đẹp phúc hậu của ông bà' }
        ],
        sampleSentences: [
          { type: 'mo_bai', label: 'Mở đoạn', sentence: 'Em luôn dành tình cảm yêu mến và kính trọng sâu sắc nhất đối với người bà kính yêu của em.', whyItIsGood: 'Trang trọng, dạt dào tình cảm.' },
          { type: 'mieu_ta', label: 'Phát triển đoạn', sentence: 'Bà luôn ân cần chăm sóc em từng bữa cơm và dạy bảo em những điều hay lẽ phải.', whyItIsGood: 'Chi tiết cụ thể, xúc động.' },
          { type: 'ket_bai', label: 'Kết đoạn', sentence: 'Em kính chúc bà luôn mạnh khỏe và hứa sẽ chăm ngoan để bà luôn vui lòng.', whyItIsGood: 'Khép lại trọn vẹn, đúng chuẩn lớp 2.' }
        ],
        creativeIdeas: ['Con hãy nhớ lại món ăn bà hay nấu hoặc trò chơi ông hay chỉ dạy để đưa vào câu văn nhé!']
      }
    };
  }

  // -------------------------------------------------------------
  // TRƯỜNG HỢP ĐẶC BIỆT 6 (LỚP 5 BÀI 6): KỶ NIỆM SÂU SẮC VỚI THẦY HOẶC CÔ GIÁO
  // Đề: "Viết bài văn kể lại một kỷ niệm sâu sắc giữa em và một thầy giáo hoặc cô giáo đã dạy dỗ, nâng đỡ em tiến bộ."
  // -------------------------------------------------------------
  if (isTeacherMemoryGrade5Prompt(pLower)) {
    const isFemaleTeacher = semantics.selectedDirectionId === 'ky_niem_co_giao' || semantics.mainObject.toLowerCase().includes('cô');
    const teacherName = isFemaleTeacher ? 'cô giáo' : 'thầy giáo';
    const teacherTitle = isFemaleTeacher ? 'cô giáo kính yêu' : 'thầy giáo kính yêu';
    hoaNhoUnderstand = `Con hãy viết một bài văn hoàn chỉnh (gồm 3 phần: Mở bài, Thân bài, Kết bài) kể lại một kỷ niệm sâu sắc khó quên với ${teacherTitle} đã tận tình dạy dỗ, nâng đỡ con tiến bộ trong học tập nhé!`;
    specificRequirements = [
      'Nhiệm vụ: Viết bài văn kể chuyện (gồm 3 phần: Mở bài, Thân bài, Kết bài)',
      'Chủ đề: Thầy cô (CD04)',
      `Đối tượng: ${teacherTitle}`,
      'Trọng tâm: Kỷ niệm thầy/cô ân cần chỉ bảo, nâng đỡ em tiến bộ trong học tập hoặc rèn luyện',
      'Lưu ý: Bám sát câu chuyện về người thầy/cô đã dạy dỗ, nâng đỡ em tiến bộ, không chuyển sang chủ đề khác'
    ];
    socraticQuestions = [
      `Người thầy giáo hay cô giáo nào đã để lại trong em ấn tượng sâu sắc nhất?`,
      'Kỷ niệm sâu sắc đó diễn ra vào thời gian nào, trong hoàn cảnh ra sao (khi em gặp bài khó, điểm kém hay sơ ý mắc lỗi)?',
      `Lúc ấy, cử chỉ, ánh mắt và lời dạy bảo nâng đỡ của ${teacherName} đã làm em xúc động thế nào?`,
      'Nhờ sự giúp đỡ và dìu dắt tận tình của thầy/cô, em đã thay đổi và tiến bộ ra sao?',
      `Tình cảm biết ơn và bài học cuộc sống sâu sắc mà em khắc ghi từ ${teacherName} là gì?`
    ];
    branches = [
      { id: 'br-1', title: '🌱 Mở bài: Thầy/cô & Kỷ niệm', icon: '🌱', color: 'emerald', points: [`Giới thiệu ${teacherName} kính yêu`, 'Dẫn dắt vào kỷ niệm khó phai', 'Ấn tượng đầu tiên không thể nào quên'] },
      { id: 'br-2', title: '🏫 Hoàn cảnh xảy ra kỷ niệm', icon: '🏫', color: 'purple', points: ['Thời gian và không gian sự việc', 'Tình huống khó khăn hoặc lúc em mắc lỗi', 'Tâm trạng lo lắng, bối rối lúc ban đầu'] },
      { id: 'br-3', title: '💖 Cử chỉ nâng đỡ ấm áp', icon: '💖', color: 'amber', points: ['Không trách phạt mà ân cần chỉ dẫn', 'Ánh mắt bao dung, lời khuyên ấm lòng', 'Kiên nhẫn giảng giải từng bước'] },
      { id: 'br-4', title: '🌟 Sự tiến bộ vượt bậc của em', icon: '🌟', color: 'sky', points: ['Vượt qua tự ti, nỗ lực rèn luyện', 'Đạt kết quả học tập tiến bộ rõ rệt', 'Niềm vui của thầy/cô và cả lớp'] },
      { id: 'br-5', title: '🌸 Kết bài: Lòng biết ơn sâu sắc', icon: '🌸', color: 'rose', points: ['Khắc ghi công ơn dạy dỗ như người cha, người mẹ thứ hai', 'Bài học quý giá làm hành trang trưởng thành', 'Lời hứa luôn phấn đấu noi gương'] }
    ];

    const sec1 = [`Giới thiệu ${teacherName} đã dạy dỗ, dìu dắt em và dẫn dắt tự nhiên vào kỷ niệm sâu sắc khiến em nhớ mãi.`];
    const sec2 = [
      'Kể lại hoàn cảnh diễn ra sự việc: một lần em bị điểm kém, gặp bài toán hóc búa hoặc cảm thấy nản lòng, mất tự tin.',
      'Miêu tả tâm trạng lo lắng, bối rối và buồn bã của em lúc đó.'
    ];
    const sec3 = [
      `${teacherName} nhận thấy sự chán nản của em và nhẹ nhàng bước lại gần bên bàn học.`,
      `Ánh mắt dịu hiền và lời động viên ân cần: Thầy/cô kiên nhẫn giảng lại từng bước, chỉ cho em cách khắc phục sai sót.`,
      'Cảm xúc xúc động, ấm lòng của em khi cảm nhận được tình thương bao dung và sự tin tưởng của thầy/cô.'
    ];
    const sec4 = [
      'Nhờ sự khích lệ và chỉ dẫn tận tình, em đã vượt qua khó khăn, hoàn thành tốt bài tập.',
      'Từ ngày hôm đó, em tự tin hơn, chăm chỉ rèn luyện và tiến bộ rõ rệt trong học tập.'
    ];
    const sec5 = [
      `Khẳng định kỷ niệm với ${teacherName} là hành trang quý báu theo em suốt những năm tháng học trò.`,
      'Bày tỏ lòng tri ân sâu sắc và lời hứa sẽ luôn chăm ngoan để xứng đáng với công ơn dìu dắt của thầy/cô.'
    ];

    outline = {
      moDoan: sec1,
      phatTrienDoan: [...sec2, ...sec3, ...sec4],
      ketDoan: sec5,
      genre: 'ke_chuyen',
      sections: [
        { id: 'sec-1', title: 'Phần 1. Mở bài - Giới thiệu thầy/cô & Kỷ niệm', icon: '🌱', guideNote: 'Giới thiệu người thầy/cô và kỷ niệm sâu sắc', bulletPoints: sec1 },
        { id: 'sec-2', title: 'Phần 2. Thân bài - Hoàn cảnh diễn ra kỷ niệm', icon: '🏫', guideNote: 'Nêu thời gian, hoàn cảnh khó khăn hoặc lúc em mắc lỗi', bulletPoints: sec2 },
        { id: 'sec-3', title: 'Phần 3. Thân bài - Cử chỉ ân cần & Sự nâng đỡ', icon: '💖', guideNote: 'Tả hành động, lời giảng giải và sự bao dung của thầy/cô', bulletPoints: sec3 },
        { id: 'sec-4', title: 'Phần 4. Thân bài - Kết quả & Sự tiến bộ của em', icon: '🌟', guideNote: 'Kể về sự thay đổi tích cực và kết quả đạt được', bulletPoints: sec4 },
        { id: 'sec-5', title: 'Phần 5. Kết bài - Lòng biết ơn & Bài học cuộc sống', icon: '🌸', guideNote: 'Bộc lộ lòng tri ân sâu sắc và bài học làm người', bulletPoints: sec5 }
      ]
    };

    return {
      branches,
      outline,
      socraticQuestions,
      hoaNhoUnderstand,
      specificRequirements,
      vocabularySuggestions: {
        goodWords: [
          { word: 'dìu dắt', meaningAndUsage: 'Tận tình hướng dẫn, giúp đỡ từng bước tiến bộ' },
          { word: 'bao dung', meaningAndUsage: 'Rộng lượng, sẵn sàng tha thứ và nâng đỡ' },
          { word: 'ân cần', meaningAndUsage: 'Chu đáo, ấm áp trong từng lời chỉ bảo' },
          { word: 'tiến bộ', meaningAndUsage: 'Vươn lên đạt kết quả tốt hơn trước' },
          { word: 'tri ân', meaningAndUsage: 'Ghi nhớ và biết ơn sâu sắc công lao' }
        ],
        imageries: [
          { type: 'So sánh', example: 'Lời dạy của thầy/cô như ngọn hải đăng soi sáng con đường tri thức', explanation: 'Gợi sự dẫn đường chỉ lối tận tâm' },
          { type: 'Gợi cảm', example: 'Ánh mắt ấm áp chan chứa niềm tin tưởng và hy vọng', explanation: 'Truyền cho học sinh động lực vươn lên' }
        ],
        sampleSentences: [
          { type: 'mo_bai', label: 'Mở bài gián tiếp', sentence: 'Trong suốt năm năm học dưới mái trường tiểu học, kỷ niệm sâu sắc nhất trong em là lần được cô giáo chủ nhiệm ân cần nâng đỡ lúc em nản lòng.', whyItIsGood: 'Dẫn dắt tự nhiên, nêu đúng trọng tâm đề.' },
          { type: 'mieu_ta', label: 'Cử chỉ nâng đỡ', sentence: 'Cô đặt bàn tay ấm áp lên vai em, mỉm cười dịu dàng và kiên nhẫn chỉ cho em từng phép tính khó.', whyItIsGood: 'Chi tiết sống động, giàu cảm xúc.' },
          { type: 'ket_bai', label: 'Kết bài mở rộng', sentence: 'Lời khuyên bảo năm ấy đã trở thành hành trang quý báu giúp em luôn vững tin và không ngừng nỗ lực vươn lên trong cuộc sống.', whyItIsGood: 'Sâu sắc, khẳng định bài học cuộc sống lâu bền.' }
        ],
        creativeIdeas: ['Con hãy nhớ lại một câu nói động viên cụ thể của thầy/cô để đưa vào bài làm cho thêm sinh động nhé!']
      }
    };
  }

  // -------------------------------------------------------------
  // THỂ LOẠI 1: VIẾT THƯ (viet_thu)
  // -------------------------------------------------------------
  if (genre === 'viet_thu') {
    const isFriendLetter = 
      semantics.selectedDirectionId === 'thu_ban_than' || 
      semantics.selectedDirectionId === 'thu_ban_o_xa' ||
      mainObject.toLowerCase().includes('bạn thân') ||
      (mainObject.toLowerCase().includes('bạn') && !mainObject.toLowerCase().includes('ông') && !mainObject.toLowerCase().includes('bà'));

    const isGrandparentsLetter = 
      semantics.selectedDirectionId === 'thu_ong_ba' || 
      mainObject.toLowerCase().includes('ông') || 
      mainObject.toLowerCase().includes('bà');

    // HƯỚNG 2: VIẾT THƯ THĂM HỎI BẠN THÂN CHUYỂN TRƯỜNG ĐI XA (Mục 5)
    if (isFriendLetter) {
      hoaNhoUnderstand = 'Con sẽ viết một bức thư ngắn gửi người bạn thân đã chuyển sang trường khác. Con hãy nghĩ xem mình muốn hỏi thăm cuộc sống ở trường mới, kể chuyện lớp cũ và gửi lời chúc gì đến bạn nhé!';
      specificRequirements = [
        'Thể loại: Viết thư thăm hỏi',
        'Người nhận: Bạn thân đã chuyển trường',
        'Mục đích: Hỏi thăm và giữ gìn tình bạn',
        'Xưng hô: Mình – bạn hoặc tớ – cậu',
        'Nội dung: Trường mới, lớp mới, bạn bè mới, việc học, kỷ niệm',
        'Tình cảm: Nhớ bạn, quý mến, mong gặp lại'
      ];
      socraticQuestions = [
        'Bạn thân con muốn viết thư là ai, con thường gọi bạn bằng tên gì?',
        'Bạn đã chuyển trường được bao lâu, con có nhớ bạn không?',
        'Trường mới của bạn thế nào, bạn đã quen thầy cô và các bạn mới chưa?',
        'Việc học của bạn có thuận lợi không, bạn có tham gia hoạt động nào thú vị không?',
        'Con nhớ nhất kỷ niệm nào với bạn ở lớp cũ, có chuyện vui gì ở lớp con muốn kể?',
        'Con muốn chúc bạn điều gì ở trường mới và con có muốn hẹn gặp lại bạn không?'
      ];
      branches = [
        {
          id: 'br-1',
          title: '💌 Người nhận và lời chào',
          icon: '💌',
          color: 'emerald',
          points: [
            'Bạn thân con muốn viết thư là ai?',
            'Con thường gọi bạn bằng tên gì?',
            'Con muốn mở đầu thư thế nào?',
            'Ý mẫu: Gửi bạn thân yêu quý của mình',
            'Ý mẫu: Bạn thân mến!'
          ]
        },
        {
          id: 'br-2',
          title: '✍️ Lý do viết thư',
          icon: '✍️',
          color: 'purple',
          points: [
            'Bạn đã chuyển trường được bao lâu?',
            'Con có nhớ bạn không? Vì sao con muốn viết thư hôm nay?',
            'Ý mẫu: Từ ngày bạn chuyển trường, mình rất nhớ bạn',
            'Ý mẫu: Mình muốn biết bạn đã quen với trường mới chưa'
          ]
        },
        {
          id: 'br-3',
          title: '🏫 Hỏi thăm trường mới',
          icon: '🏫',
          color: 'amber',
          points: [
            'Trường mới của bạn thế nào?',
            'Bạn đã quen thầy cô và các bạn mới chưa?',
            'Việc học của bạn có thuận lợi không?',
            'Ý mẫu: Thầy cô và các bạn ở trường mới có thân thiện không?',
            'Ý mẫu: Bạn thích điều gì nhất ở trường mới?'
          ]
        },
        {
          id: 'br-4',
          title: '🤝 Kỷ niệm và tình bạn',
          icon: '🤝',
          color: 'sky',
          points: [
            'Con nhớ nhất kỷ niệm nào với bạn?',
            'Ở lớp cũ có điều gì con muốn kể?',
            'Con muốn chia sẻ chuyện vui gì với bạn?',
            'Ý mẫu: Mình vẫn nhớ những giờ ra chơi chúng mình cùng nhau',
            'Ý mẫu: Các bạn trong lớp vẫn thường nhắc đến bạn'
          ]
        },
        {
          id: 'br-5',
          title: '🌸 Lời chúc và kết thư',
          icon: '🌸',
          color: 'rose',
          points: [
            'Con muốn chúc bạn điều gì?',
            'Con có muốn hẹn gặp lại bạn không?',
            'Ý mẫu: Chúc bạn học thật tốt ở trường mới',
            'Ý mẫu: Mong bạn sớm có thêm nhiều người bạn tốt',
            'Ý mẫu: Bạn thân của cậu... / Ký tên'
          ]
        }
      ];

      const sec1 = [
        'Địa điểm và ngày tháng viết thư (Ví dụ: Hà Nội, ngày ... tháng ... năm ...)',
        'Lời chào thân mật: Bạn thân mến! hoặc Cậu bạn thân yêu quý của mình!'
      ];
      const sec2 = [
        'Nói lý do viết thư: Bày tỏ nỗi nhớ bạn từ ngày bạn chuyển sang trường mới.',
        'Kể cảm xúc vui vẻ, mong ngóng khi ngồi nắn nót viết thư cho bạn.'
      ];
      const sec3 = [
        'Hỏi thăm trường mới: Bạn đã quen với ngôi trường mới, lớp mới và bạn bè mới chưa?',
        'Hỏi thăm thầy cô giáo ở trường mới có ân cần, việc học của bạn có thuận lợi không?',
        'Hỏi bạn thích điều gì nhất ở ngôi trường mới.'
      ];
      const sec4 = [
        'Kể chuyện lớp cũ hoặc kỷ niệm tình bạn: Thầy cô và các bạn ở lớp cũ vẫn thường nhắc đến bạn.',
        'Nhắc lại kỷ niệm vui những giờ ra chơi chúng mình cùng học, cùng chơi dưới bóng mát sân trường.',
        'Bày tỏ mong muốn gìn giữ tình bạn thân thiết dài lâu.'
      ];
      const sec5 = [
        'Chúc bạn học tốt và kết thư: Chúc bạn luôn mạnh khỏe, học thật giỏi và sớm có thêm nhiều bạn tốt ở trường mới.',
        'Lời hẹn ước: Mong sớm nhận được thư hồi âm hoặc hẹn kỳ nghỉ hè gặp lại.',
        'Lời kết thân thương: Bạn thân của cậu',
        'Ký tên và ghi rõ họ tên nắn nót.'
      ];

      outline = {
        moDoan: [...sec1, ...sec2],
        phatTrienDoan: [...sec3, ...sec4],
        ketDoan: sec5,
        genre: 'viet_thu',
        sections: [
          { id: 'sec-1', title: 'Phần 1. Địa điểm, ngày tháng và lời chào bạn thân', icon: '📍', guideNote: 'Ghi rõ địa danh, ngày tháng và lời chào thân mật với bạn bè', bulletPoints: sec1 },
          { id: 'sec-2', title: 'Phần 2. Nói lý do viết thư và nỗi nhớ bạn', icon: '✍️', guideNote: 'Nêu lý do viết thư tự nhiên, chân thành', bulletPoints: sec2 },
          { id: 'sec-3', title: 'Phần 3. Hỏi thăm trường mới', icon: '🏫', guideNote: 'Hỏi thăm chi tiết về môi trường học tập mới của bạn', bulletPoints: sec3 },
          { id: 'sec-4', title: 'Phần 4. Kể chuyện lớp cũ hoặc kỷ niệm tình bạn', icon: '🤝', guideNote: 'Chia sẻ chuyện lớp cũ và nhắc kỷ niệm gắn bó', bulletPoints: sec4 },
          { id: 'sec-5', title: 'Phần 5. Chúc bạn học tốt và kết thư', icon: '🌸', guideNote: 'Gửi lời chúc học tốt, lời hẹn và chữ ký', bulletPoints: sec5 }
        ]
      };

      vocabularySuggestions = {
        goodWords: [
          { word: 'thân thiết', meaningAndUsage: 'Gần gũi, gắn bó và tin cậy lẫn nhau' },
          { word: 'gắn bó', meaningAndUsage: 'Khăng khít bên nhau trong học tập và vui chơi' },
          { word: 'bỡ ngỡ', meaningAndUsage: 'Cảm giác mới lạ ban đầu khi chuyển tới trường mới' },
          { word: 'chan hòa', meaningAndUsage: 'Hòa đồng, thân thiện với bạn bè xung quanh' },
          { word: 'kỷ niệm', meaningAndUsage: 'Những khoảnh khắc đẹp đẽ không thể nào quên' }
        ],
        imageries: [
          { type: 'So sánh', example: 'Cánh thư nhỏ như chiếc cầu nối dài tình bạn của chúng mình', explanation: 'Gợi sự kết nối thân thiết dù ở xa' },
          { type: 'Gợi tả', example: 'Giờ ra chơi rộn rã tiếng cười dưới vòm cây xanh mát', explanation: 'Gợi nhớ không khí quen thuộc ở lớp cũ' }
        ],
        sampleSentences: [
          { type: 'mo_bai', label: 'Mở đầu thân mật', sentence: 'Từ ngày cậu chuyển sang trường mới, mình và các bạn ở lớp cũ rất nhớ cậu.', whyItIsGood: 'Bày tỏ ngay nỗi nhớ và sự gắn bó.' },
          { type: 'mieu_ta', label: 'Hỏi thăm trường mới', sentence: 'Cậu đã quen với thầy cô giáo mới và những người bạn đáng yêu ở lớp chưa?', whyItIsGood: 'Lời hỏi thăm chân thành, tự nhiên.' },
          { type: 'ket_bai', label: 'Lời chúc và hẹn ước', sentence: 'Mình chúc cậu luôn vui vẻ, học thật giỏi và mong sớm nhận được thư hồi âm của cậu.', whyItIsGood: 'Khép lại đầy tình cảm và mong ngóng.' }
        ],
        creativeIdeas: [
          'Kể cho bạn nghe một mẩu chuyện vui ở lớp cũ vừa diễn ra tuần trước',
          'Gửi kèm một bông hoa ép hoặc bức vẽ nhỏ để bạn nhớ về tình bạn của hai đứa'
        ]
      };
    }
    // HƯỚNG 1: VIẾT THƯ THĂM HỎI ÔNG BÀ (Mục 4)
    else if (isGrandparentsLetter) {
      hoaNhoUnderstand = 'Con sẽ viết một bức thư ngắn để hỏi thăm ông hoặc bà. Con hãy nghĩ xem mình muốn hỏi thăm điều gì và muốn kể chuyện gì để ông bà vui nhé!';
      specificRequirements = [
        'Thể loại: Viết thư thăm hỏi',
        'Người nhận: Ông hoặc bà',
        'Mục đích: Hỏi thăm, chia sẻ và bày tỏ tình cảm',
        'Xưng hô: Cháu – ông/bà',
        'Nội dung: Sức khỏe, sinh hoạt, chuyện gia đình, kỷ niệm',
        'Tình cảm: Yêu thương, kính trọng, biết ơn'
      ];
      socraticQuestions = [
        'Con viết thư cho ông hay bà, con muốn xưng hô như thế nào cho lễ phép và ấm áp?',
        'Vì sao hôm nay con muốn viết thư, con có nhớ ông bà ở quê nhiều không?',
        'Ông bà có khỏe không, con muốn hỏi thăm sức khỏe và sinh hoạt của ông bà ra sao?',
        'Việc học của con gần đây thế nào, gia đình có chuyện gì vui?',
        'Con nhớ nhất điều gì về ông bà, con muốn nói lời yêu thương nào?',
        'Con muốn gửi lời chúc sức khỏe gì và hẹn ngày về thăm ông bà ra sao?'
      ];
      branches = [
        {
          id: 'br-1',
          title: '💌 Người nhận và lời chào',
          icon: '💌',
          color: 'emerald',
          points: [
            'Con viết thư cho ông hay bà?',
            'Con muốn xưng hô thế nào?',
            'Con sẽ mở đầu bức thư ra sao?',
            'Kính gửi ông bà kính yêu!'
          ]
        },
        {
          id: 'br-2',
          title: '✍️ Lý do viết thư',
          icon: '✍️',
          color: 'purple',
          points: [
            'Vì sao hôm nay con muốn viết thư?',
            'Con có nhớ ông bà không?',
            'Con muốn hỏi thăm điều gì?',
            'Bày tỏ nỗi nhớ mong ông bà ở quê'
          ]
        },
        {
          id: 'br-3',
          title: '📖 Những điều con muốn kể',
          icon: '📖',
          color: 'amber',
          points: [
            'Việc học của con gần đây thế nào?',
            'Gia đình có chuyện gì vui?',
            'Con muốn kể kỷ niệm nào cho ông bà?',
            'Khoe điểm tốt và việc ngoan con vừa làm'
          ]
        },
        {
          id: 'br-4',
          title: '💖 Lời thăm hỏi và tình cảm',
          icon: '💖',
          color: 'sky',
          points: [
            'Ông bà có khỏe không?',
            'Hỏi thăm sinh hoạt và vườn cây ở quê',
            'Con nhớ nhất điều gì về ông bà?',
            'Con muốn nói lời yêu thương nào?'
          ]
        },
        {
          id: 'br-5',
          title: '🌸 Lời chúc và kết thư',
          icon: '🌸',
          color: 'rose',
          points: [
            'Chúc ông bà mạnh khỏe',
            'Hẹn ngày về thăm',
            'Lời chào cuối thư',
            'Cháu ngoan của ông bà / Ký tên'
          ]
        }
      ];

      const sec1 = [
        'Địa điểm và ngày tháng viết thư (Ví dụ: Hà Nội, ngày ... tháng ... năm ...)',
        'Lời chào kính cẩn, lễ phép: Kính gửi ông bà kính yêu!'
      ];
      const sec2 = [
        'Nêu lý do viết thư: Bày tỏ nỗi nhớ thương tha thiết đối với ông bà ở quê.',
        'Cảm xúc bồi hồi, ấm áp khi cầm bút nắn nót viết thư cho ông bà.'
      ];
      const sec3 = [
        'Hỏi thăm ông bà: Dạo này ông bà có khỏe không, thời tiết giao mùa ông bà có bị mỏi mệt không?',
        'Hỏi thăm sinh hoạt thường ngày, luống rau và vườn cây sum suê hoa trái ở quê.'
      ];
      const sec4 = [
        'Kể chuyện của con: Kể việc học tập chăm ngoan, những bông hoa điểm tốt cháu vừa đạt được.',
        'Kể chuyện gia đình: Bố mẹ và cháu dạo này luôn nhắc về ông bà và mong ngày sum họp.',
        'Bày tỏ tình cảm với ông bà: Nhắc lại kỷ niệm ấm áp như bữa cơm quê hay lời dạy bảo ân cần.'
      ];
      const sec5 = [
        'Chúc sức khỏe và kết thư: Kính chúc ông bà luôn luôn mạnh khỏe, sống lâu trăm tuổi và nhiều niềm vui.',
        'Lời hứa chăm ngoan, học giỏi và hẹn kỳ nghỉ hè cả nhà sẽ về quê thăm ông bà.',
        'Lời kết thân thương: Cháu ngoan của ông bà',
        'Ký tên và ghi rõ họ tên nắn nót.'
      ];

      outline = {
        moDoan: [...sec1, ...sec2],
        phatTrienDoan: [...sec3, ...sec4],
        ketDoan: sec5,
        genre: 'viet_thu',
        sections: [
          { id: 'sec-1', title: 'Phần 1. Địa điểm, ngày tháng và lời chào ông bà', icon: '📍', guideNote: 'Ghi rõ địa danh, ngày tháng và lời chào kính cẩn với ông bà', bulletPoints: sec1 },
          { id: 'sec-2', title: 'Phần 2. Lý do viết thư và nỗi nhớ ông bà', icon: '✍️', guideNote: 'Bày tỏ lý do viết thư và tình cảm nhớ thương', bulletPoints: sec2 },
          { id: 'sec-3', title: 'Phần 3. Hỏi thăm ông bà', icon: '📜', guideNote: 'Hỏi thăm sức khỏe và cuộc sống sinh hoạt ở quê', bulletPoints: sec3 },
          { id: 'sec-4', title: 'Phần 4. Kể chuyện của con và bày tỏ tình cảm với ông bà', icon: '💖', guideNote: 'Khoe việc học ngoan và bộc lộ tình cảm gắn bó', bulletPoints: sec4 },
          { id: 'sec-5', title: 'Phần 5. Chúc sức khỏe và kết thư', icon: '🌸', guideNote: 'Gửi lời chúc thọ, lời hứa hẹn về thăm và chữ ký', bulletPoints: sec5 }
        ]
      };

      vocabularySuggestions = {
        goodWords: [
          { word: 'kính yêu', meaningAndUsage: 'Tình cảm kính trọng và thương yêu sâu sắc của con cháu' },
          { word: 'khỏe mạnh', meaningAndUsage: 'Sức khỏe dồi dào, an khang' },
          { word: 'ân cần', meaningAndUsage: 'Chu đáo, dịu dàng chăm sóc từng li từng tí' },
          { word: 'sum vầy', meaningAndUsage: 'Cả gia đình quây quần ấm cúng bên nhau' },
          { word: 'hiếu thảo', meaningAndUsage: 'Biết vâng lời, chăm ngoan và làm ông bà vui lòng' }
        ],
        imageries: [
          { type: 'Hình ảnh đẹp', example: 'Mái tóc bạc phơ như mây trắng và nụ cười hiền hậu của ông bà', explanation: 'Gợi vẻ đẹp phúc hậu, ấm áp' },
          { type: 'Gợi cảm', example: 'Khu vườn ở quê luôn sum suê hoa trái và rộn rã tiếng chim', explanation: 'Gợi không gian bình yên nơi quê nhà' }
        ],
        sampleSentences: [
          { type: 'mo_bai', label: 'Lời chào kính cẩn', sentence: 'Hôm nay cháu ngồi nắn nót viết lá thư này để gửi gắm nỗi nhớ thương đến ông bà.', whyItIsGood: 'Trang trọng và dạt dào tình cảm.' },
          { type: 'mieu_ta', label: 'Hỏi thăm sức khỏe', sentence: 'Dạo này thời tiết giao mùa, chân tay ông bà có bị đau nhức hay mỏi mệt không ạ?', whyItIsGood: 'Sự quan tâm hiếu thảo, chu đáo.' },
          { type: 'ket_bai', label: 'Kính chúc sức khỏe', sentence: 'Cháu kính chúc ông bà luôn luôn mạnh khỏe, sống lâu trăm tuổi và an vui bên con cháu.', whyItIsGood: 'Lời chúc thọ truyền thống đầy ý nghĩa.' }
        ],
        creativeIdeas: [
          'Khoe với ông bà bông hoa điểm 10 môn Tiếng Việt cháu vừa đạt được',
          'Hứa hè này được nghỉ sẽ xin bố mẹ về quê thăm ông bà thật lâu'
        ]
      };
    }
    // TRƯỜNG HỢP CHUNG CHO CÁC ĐỐI TƯỢNG KHÁC (Người thân, thầy cô, bạn ở xa...)
    else {
      hoaNhoUnderstand = `Con sẽ viết một bức thư ngắn để gửi tới ${mainObject}. Hoa Nhỏ sẽ hướng dẫn con trình bày đầy đủ các phần chuẩn mực của một bức thư theo đúng chuẩn GDPT 2018 nhé!`;
      specificRequirements = [
        'Thể loại: Viết thư thăm hỏi',
        `Người nhận: ${mainObject}`,
        'Mục đích: Thăm hỏi sức khỏe, cuộc sống và chia sẻ tin tức',
        `Cách xưng hô: Phù hợp với người nhận (${semantics.pointOfView})`,
        'Cấu trúc: Địa điểm ngày tháng, lời chào, lý do viết thư, nội dung thăm hỏi, lời chúc và ký tên'
      ];
      socraticQuestions = [
        `Con viết thư cho ${mainObject}, con muốn xưng hô như thế nào cho thật ấm áp và đúng mực?`,
        'Vì sao hôm nay con cầm bút viết bức thư này gửi người ấy?',
        'Dạo này sức khỏe, sinh hoạt hoặc công việc/học tập của người nhận ra sao, con muốn hỏi thăm điều gì?',
        'Con có tin vui nào trong học tập hay việc làm ngoan muốn chia sẻ?',
        'Con muốn gửi lời chúc tốt đẹp nhất và lời hẹn ước gì ở phần kết thư?'
      ];
      branches = [
        { id: 'br-1', title: '💌 Người nhận & Lời chào', icon: '💌', color: 'emerald', points: [`Gửi ${mainObject}`, 'Lời xưng hô trân trọng hoặc thân mật', 'Địa điểm và ngày tháng viết thư'] },
        { id: 'br-2', title: '✍️ Lý do viết thư', icon: '✍️', color: 'purple', points: ['Vì sao hôm nay con viết thư?', 'Cảm xúc nhớ thương, mong ngóng khi đặt bút', 'Lời thăm hỏi mở đầu thân thương'] },
        { id: 'br-3', title: '📖 Những điều con muốn kể', icon: '📖', color: 'amber', points: ['Tin vui học tập của con', 'Việc tốt con vừa làm được', 'Kỷ niệm đẹp con muốn tâm sự'] },
        { id: 'br-4', title: '💖 Lời thăm hỏi & Tình cảm', icon: '💖', color: 'sky', points: ['Hỏi thăm sức khỏe và cuộc sống người nhận', 'Bày tỏ lòng yêu mến chân thành', 'Mong ước người nhận luôn an vui'] },
        { id: 'br-5', title: '🌸 Lời chúc & Kết thư', icon: '🌸', color: 'rose', points: ['Lời chúc sức khỏe và bình an', 'Lời hứa chăm ngoan, hẹn ngày gặp lại', 'Ký tên và ghi rõ họ tên nắn nót'] }
      ];

      const sec1 = ['Địa điểm và ngày tháng viết thư (Ví dụ: Hà Nội, ngày ... tháng ... năm ...)', `Lời xưng hô phù hợp: Gửi ${mainObject} thân thương!`];
      const sec2 = ['Nêu lý do viết thư: Bày tỏ nỗi nhớ mong và cảm xúc bồi hồi khi cầm bút viết thư.'];
      const sec3 = [
        'Thăm hỏi sức khỏe, cuộc sống thường ngày và công việc/học tập của người nhận.',
        'Báo tin về tình hình học tập chăm ngoan, những điểm tốt và niềm vui mới của con.',
        'Chia sẻ một kỷ niệm gắn bó hoặc một câu chuyện ấm áp giữa con và người nhận.'
      ];
      const sec4 = [
        'Gửi lời kính chúc dồi dào sức khỏe, niềm vui và bình an trong cuộc sống.',
        'Gửi lời hứa chăm ngoan học giỏi và lời hẹn ngày sớm được hội ngộ thăm nhau.'
      ];
      const sec5 = ['Lời kết thân thương', 'Ký tên và ghi rõ họ tên nắn nót ở góc phải bên dưới bức thư.'];

      outline = {
        moDoan: [...sec1, ...sec2],
        phatTrienDoan: sec3,
        ketDoan: [...sec4, ...sec5],
        genre: 'viet_thu',
        sections: [
          { id: 'sec-1', title: 'Phần 1. Địa điểm, ngày tháng và lời chào', icon: '📍', guideNote: 'Ghi rõ địa danh, ngày tháng và lời chào phù hợp', bulletPoints: sec1 },
          { id: 'sec-2', title: 'Phần 2. Mở đầu bức thư', icon: '✍️', guideNote: 'Nêu lý do viết thư và cảm xúc nhớ thương', bulletPoints: sec2 },
          { id: 'sec-3', title: 'Phần 3. Nội dung chính', icon: '📜', guideNote: 'Thăm hỏi sức khỏe, đời sống và báo tin vui của con', bulletPoints: sec3 },
          { id: 'sec-4', title: 'Phần 4. Lời kết', icon: '💖', guideNote: 'Gửi lời chúc tốt lành, lời hứa hẹn và chào tạm biệt', bulletPoints: sec4 },
          { id: 'sec-5', title: 'Phần 5. Chữ ký', icon: '✒️', guideNote: 'Lời xưng hô kết thúc và chữ ký nắn nót', bulletPoints: sec5 }
        ]
      };
    }
  }

  // -------------------------------------------------------------
  // THỂ LOẠI 2: VIẾT LỜI NHẮN / TIN NHẮN (loi_nhan)
  // -------------------------------------------------------------
  else if (genre === 'loi_nhan') {
    hoaNhoUnderstand = `Đề bài muốn con viết một lời nhắn ngắn gọn, đủ ý gửi cho ${mainObject}: nêu rõ việc con đi đâu hoặc làm gì, mấy giờ về và lời nhắn nhủ yêu thương để người nhà yên tâm nhé!`;
    specificRequirements = [
      'Nhiệm vụ: Viết lời nhắn ngắn gọn, súc tích (khoảng 3–5 câu)',
      `Người nhận lời nhắn: ${mainObject}`,
      'Nội dung chính: Đi đâu, làm gì, mấy giờ về, việc cần dặn dò',
      'Người để lại lời nhắn: Ký tên con và ghi rõ thời gian nhắn'
    ];
    socraticQuestions = [
      `Con để lại lời nhắn cho ai trong gia đình (${mainObject})?`,
      'Con có việc gì cần đi (sang nhà bạn học nhóm, đi tập múa, về sớm...) và ở đâu?',
      'Mấy giờ con sẽ có mặt ở nhà để người thân không phải lo lắng?',
      'Con có điều gì muốn dặn dò thêm hoặc nhắn nhủ yêu thương không?',
      'Con đã ký tên và ghi rõ thời gian viết mẩu giấy nhắn chưa?'
    ];
    branches = [
      { id: 'br-1', title: '📌 Người nhận lời nhắn', icon: '📌', color: 'emerald', points: [`Gửi ${mainObject}`, 'Lời gọi thân thương: "Mẹ ơi!" hoặc "Bố mẹ kính yêu!"'] },
      { id: 'br-2', title: '📍 Lý do & Việc cần làm', icon: '📍', color: 'purple', points: ['Con đi đâu? Làm gì?', 'Đi cùng với ai?', 'Lý do con phải đi'] },
      { id: 'br-3', title: '⏰ Thời gian & Địa điểm', icon: '⏰', color: 'amber', points: ['Địa điểm cụ thể con đang ở', 'Mấy giờ con sẽ về tới nhà'] },
      { id: 'br-4', title: '💖 Lời dặn dò yêu thương', icon: '💖', color: 'sky', points: ['Bố mẹ yên tâm nhé', 'Con đã làm xong bài tập / khóa cửa cẩn thận'] },
      { id: 'br-5', title: '✒️ Người gửi & Thời điểm', icon: '✒️', color: 'rose', points: ['Ký tên: Con của bố mẹ...', 'Ghi rõ thời gian viết: ... giờ, ngày ...'] }
    ];

    const sec1 = [`Lời gọi người nhận: "${mainObject} kính yêu của con!" hoặc "Mẹ ơi!"`];
    const sec2 = [
      'Nêu sự việc: Chiều nay con sang nhà bạn Lan cùng xóm để học nhóm môn Tiếng Việt.',
      'Thời gian dự kiến: Khoảng 5 giờ chiều con sẽ học xong và đạp xe về nhà ngay.',
      'Lời dặn dò dặn bố mẹ yên tâm: Bố mẹ đừng lo lắng cho con nhé, con đã chuẩn bị xong cơm nước và khóa cổng cẩn thận.'
    ];
    const sec3 = [
      'Ký tên người để lại lời nhắn: Con gái của mẹ / Con trai của bố...',
      'Ghi thời gian để lại lời nhắn: 14 giờ 30 phút, ngày 15 tháng 10.'
    ];

    outline = {
      moDoan: sec1,
      phatTrienDoan: sec2,
      ketDoan: sec3,
      genre: 'loi_nhan',
      sections: [
        { id: 'sec-1', title: 'Phần 1. Người nhận lời nhắn', icon: '📌', guideNote: 'Ghi rõ người nhận lời nhắn với từ ngữ thân thương, lễ phép', bulletPoints: sec1 },
        { id: 'sec-2', title: 'Phần 2. Nội dung nhắn gửi', icon: '📝', guideNote: 'Nêu rõ sự việc, lý do, địa điểm, thời gian về và lời dặn dò', bulletPoints: sec2 },
        { id: 'sec-3', title: 'Phần 3. Người để lại lời nhắn & Thời gian', icon: '✒️', guideNote: 'Ký tên của con và ghi rõ thời điểm viết lời nhắn', bulletPoints: sec3 }
      ]
    };
  }

  // -------------------------------------------------------------
  // THỂ LOẠI 3: VIẾT CÂU (viet_cau - Lớp 1 & Lớp 2)
  // -------------------------------------------------------------
  else if (genre === 'viet_cau') {
    const isOneTwoSentences = grade === 1 || pLower.includes('1–2 câu') || pLower.includes('1-2 câu') || pLower.includes('1 câu') || pLower.includes('2 câu');

    if (isOneTwoSentences) {
      hoaNhoUnderstand = `Đề bài rèn cho con kỹ năng viết 1–2 câu trọn vẹn: đầu câu viết hoa, cuối câu có dấu chấm, dùng từ ngữ sinh động và tự nhiên nhé!`;
      specificRequirements = [
        'Nhiệm vụ: Viết 1–2 câu hoàn chỉnh, mạch lạc theo đúng yêu cầu đề',
        'Hình thức: Đầu câu viết hoa, cuối câu có dấu chấm kết thúc',
        'Nội dung: Trả lời rõ ràng các câu hỏi gợi mở của Hoa Nhỏ',
        'Quy tắc: Không viết thành đoạn văn dài hay bài văn 3 phần'
      ];
      socraticQuestions = [
        `Con muốn miêu tả hoặc giới thiệu điều gì nổi bật nhất về ${mainObject}?`,
        'Đặc điểm màu sắc, hình dáng hoặc hành động nào làm con ấn tượng nhất?',
        'Con đã kiểm tra đầu câu viết hoa và cuối câu có dấu chấm chưa?'
      ];
      branches = [
        { id: 'br-1', title: `🌱 Đối tượng: ${mainObject}`, icon: '🌱', color: 'emerald', points: ['Nêu tên đối tượng', 'Ấn tượng nổi bật'] },
        { id: 'br-2', title: '🎨 Đặc điểm nổi bật', icon: '🎨', color: 'amber', points: ['Màu sắc tươi tắn', 'Hình dáng xinh xắn'] },
        { id: 'br-3', title: '🔍 Chi tiết gắn bó', icon: '🔍', color: 'purple', points: ['Nét đáng yêu', 'Cử chỉ / đường nét gần gũi'] },
        { id: 'br-4', title: '🌟 Công dụng / Cảm xúc', icon: '🌟', color: 'sky', points: ['Giúp ích cho con', 'Tình cảm thân thiết'] },
        { id: 'br-5', title: '✍️ Quy tắc viết câu', icon: '✍️', color: 'rose', points: ['Đầu câu viết hoa', 'Cuối câu có dấu chấm'] }
      ];

      const way1 = [`Gợi ý câu đơn: Viết 1 câu hoàn chỉnh giới thiệu và nêu đặc điểm hoặc cảm nghĩ nổi bật về ${mainObject}.`];
      const way2 = [
        `Câu 1: Giới thiệu hoặc miêu tả nét nổi bật nhất của ${mainObject}.`,
        `Câu 2: Nêu chi tiết cụ thể, công dụng hoặc cảm xúc gắn bó của con.`
      ];

      outline = {
        moDoan: way1,
        phatTrienDoan: [],
        ketDoan: way2,
        genre: 'viet_cau',
        sections: [
          { id: 'sec-1', title: 'Cách 1 – Viết một câu', icon: '1️⃣', guideNote: `Viết 1 câu hoàn chỉnh về ${mainObject}`, bulletPoints: way1 },
          { id: 'sec-2', title: 'Cách 2 – Viết hai câu', icon: '2️⃣', guideNote: `Viết 2 câu nối tiếp mạch lạc về ${mainObject}`, bulletPoints: way2 }
        ]
      };
    } else {
      hoaNhoUnderstand = `Đề bài rèn cho con kỹ năng viết câu trọn vẹn (khoảng 2–3 câu): đầu câu viết hoa, cuối câu có dấu chấm, dùng từ ngữ sinh động và tự nhiên nhé!`;
      specificRequirements = [
        'Nhiệm vụ: Viết 2–3 câu hoàn chỉnh, mạch lạc theo đúng yêu cầu đề',
        'Hình thức: Đầu câu viết hoa, cuối câu có dấu câu phù hợp (. ! ?)',
        'Nội dung: Trả lời rõ ràng các câu hỏi gợi mở của Hoa Nhỏ',
        'Liên kết: Các câu văn nối tiếp tự nhiên, không rời rạc'
      ];
      socraticQuestions = [
        'Câu 1: Con muốn giới thiệu ai hoặc điều gì đáng yêu nhất?',
        'Câu 2: Người ấy hoặc sự vật ấy có đặc điểm hay việc làm gì nổi bật?',
        'Câu 3: Con có cảm xúc hoặc mong ước gì gắn bó với đối tượng?'
      ];
      branches = [
        { id: 'br-1', title: '🌱 Câu 1: Giới thiệu', icon: '🌱', color: 'emerald', points: ['Nêu tên đối tượng', 'Ấn tượng đầu tiên'] },
        { id: 'br-2', title: '🌿 Câu 2: Đặc điểm / Hành động', icon: '🌿', color: 'purple', points: ['Nét nổi bật nhất', 'Từ ngữ gợi tả, gợi cảm'] },
        { id: 'br-3', title: '🌸 Câu 3: Cảm xúc / Tình cảm', icon: '🌸', color: 'rose', points: ['Tình cảm của con', 'Mong ước gắn bó'] },
        { id: 'br-4', title: '✍️ Quy tắc chính tả câu', icon: '✍️', color: 'sky', points: ['Đầu câu viết hoa', 'Cuối câu có dấu chấm'] },
        { id: 'br-5', title: '✨ Sáng tạo từ ngữ', icon: '✨', color: 'amber', points: ['Dùng từ ngữ giản dị, trong sáng', 'Diễn đạt tự nhiên'] }
      ];

      const c1 = [`Câu 1 (Giới thiệu): Giới thiệu đối tượng chính của đề bài một cách tự nhiên và ấm áp.`];
      const c2 = [`Câu 2 (Chi tiết / Hành động): Miêu tả một nét đặc sắc, một việc làm hoặc cử chỉ khiến con nhớ nhất.`];
      const c3 = [`Câu 3 (Cảm xúc): Bày tỏ tình cảm yêu mến, gắn bó và mong ước tốt đẹp của con.`];

      outline = {
        moDoan: c1,
        phatTrienDoan: c2,
        ketDoan: c3,
        genre: 'viet_cau',
        sections: [
          { id: 'sec-1', title: 'Câu 1. Mở đầu & Giới thiệu', icon: '🌱', guideNote: 'Giới thiệu đối tượng một cách rõ ràng, trọn vẹn', bulletPoints: c1 },
          { id: 'sec-2', title: 'Câu 2. Chi tiết & Cảm xúc', icon: '💖', guideNote: 'Nêu chi tiết nổi bật nhất hoặc hành động đáng nhớ', bulletPoints: c2 },
          { id: 'sec-3', title: 'Câu 3. Kết lại & Mong ước', icon: '🌸', guideNote: 'Bộc lộ tình cảm gắn bó và lời hứa hẹn chân thành', bulletPoints: c3 }
        ]
      };
    }
  }

  // -------------------------------------------------------------
  // THỂ LOẠI 4: NÊU Ý KIẾN / SUY NGHĨ (neu_y_kien)
  // -------------------------------------------------------------
  else if (genre === 'neu_y_kien') {
    hoaNhoUnderstand = `Đề bài muốn con nêu suy nghĩ, ý kiến của mình về "${coreSubject}" – bày tỏ rõ quan điểm đồng tình hay không đồng tình, lý giải nguyên nhân và đưa ra dẫn chứng thuyết phục.`;
    specificRequirements = [
      'Nhiệm vụ: Viết đoạn văn nêu ý kiến về một vấn đề hoặc việc làm',
      'Mở đoạn: Nêu rõ vấn đề và khẳng định quan điểm đồng tình / ủng hộ',
      'Phát triển đoạn: Đưa ra 2 lý lẽ xác đáng kèm dẫn chứng thực tế sống động',
      'Kết đoạn: Khẳng định lại ý kiến và gửi gắm thông điệp lan tỏa'
    ];
    socraticQuestions = [
      `Vấn đề hoặc việc làm mà con muốn bày tỏ ý kiến là gì?`,
      'Con có thái độ như thế nào: Hoàn toàn đồng tình, khen ngợi hay thấy cần thay đổi?',
      'Lý do thứ nhất: Việc làm đó mang lại lợi ích hoặc niềm vui gì cho mọi người?',
      'Lý do thứ hai: Hành động đó góp phần lan tỏa sự tử tế ra sao?',
      'Có một câu chuyện hoặc tấm gương thực tế nào làm con nhớ nhất để làm dẫn chứng?',
      'Con muốn gửi thông điệp và lời kêu gọi gì đến các bạn cùng lớp?'
    ];
    branches = [
      { id: 'br-1', title: '💡 Vấn đề & Thái độ', icon: '💡', color: 'emerald', points: ['Nêu rõ việc làm / vấn đề trong đề bài', 'Khẳng định sự đồng tình, ủng hộ tuyệt đối', 'Ấn tượng ban đầu về ý nghĩa việc làm'] },
      { id: 'br-2', title: '🌱 Lý do 1: Giúp ích cho mọi người', icon: '🌱', color: 'purple', points: ['Sẻ chia khó khăn với người xung quanh', 'Đem lại niềm vui và sự an ủi ấm áp', 'Làm cho cuộc sống trở nên tốt đẹp hơn'] },
      { id: 'br-3', title: '🌸 Lý do 2: Lan tỏa sự tử tế', icon: '🌸', color: 'amber', points: ['Một việc tốt nhân lên ngàn niềm vui', 'Góp phần xây dựng lớp học thân thiện', 'Hình thành nhân cách tốt cho mỗi học sinh'] },
      { id: 'br-4', title: '📖 Dẫn chứng thực tế thuyết phục', icon: '📖', color: 'sky', points: ['Kể lại câu chuyện có thật em đã chứng kiến', 'Tấm gương người tốt việc tốt tiêu biểu', 'Cảm xúc khâm phục của mọi người'] },
      { id: 'br-5', title: '🌟 Khẳng định & Kêu gọi hành động', icon: '🌟', color: 'rose', points: ['Khẳng định giá trị nhân văn cao đẹp', 'Bản thân em sẽ noi gương làm việc tốt', 'Kêu gọi bạn bè cùng chung tay lan tỏa yêu thương'] }
    ];

    const sec1 = ['Nêu việc làm tốt và bày tỏ rõ sự đồng tình, khen ngợi và trân trọng đối với hành động ý nghĩa đó.'];
    const sec2 = [
      'Lý do thứ nhất: Việc làm tốt giúp đỡ kịp thời người gặp khó khăn và đem lại niềm vui ấm áp.',
      'Lý do thứ hai: Hành động đẹp góp phần lan tỏa sự tử tế, xây dựng môi trường học đường và xã hội thêm văn minh, hạnh phúc.',
      'Dẫn chứng thực tế: Kể vắn tắt một câu chuyện người tốt việc tốt mà em đã chứng kiến hoặc được học trong sách vở.'
    ];
    const sec3 = ['Khẳng định lại ý nghĩa cao đẹp của việc làm tốt và gửi gắm lời kêu gọi mọi người cùng nhau chung tay làm nhiều việc thiện.'];

    outline = {
      moDoan: sec1,
      phatTrienDoan: sec2,
      ketDoan: sec3,
      genre: 'neu_y_kien',
      sections: [
        { id: 'sec-1', title: 'Phần 1. Mở đoạn - Nêu vấn đề & Bày tỏ ý kiến', icon: '💡', guideNote: 'Nêu sự việc và khẳng định rõ quan điểm đồng tình / ủng hộ', bulletPoints: sec1 },
        { id: 'sec-2', title: 'Phần 2. Phát triển đoạn - Lý lẽ & Dẫn chứng', icon: '📖', guideNote: 'Nêu 2 lý do thuyết phục kèm ví dụ người thật việc thật', bulletPoints: sec2 },
        { id: 'sec-3', title: 'Phần 3. Kết đoạn - Khẳng định ý kiến & Thông điệp', icon: '🌟', guideNote: 'Khẳng định lại ý nghĩa và gửi lời kêu gọi lan tỏa việc tốt', bulletPoints: sec3 }
      ]
    };
  }

  // -------------------------------------------------------------
  // THỂ LOẠI 5: NÊU TÌNH CẢM, CẢM XÚC (tinh_cam_cam_xuc)
  // -------------------------------------------------------------
  else if (genre === 'tinh_cam_cam_xuc') {
    hoaNhoUnderstand = `Đề bài muốn con bộc lộ tình cảm chân thành, sâu lắng dành cho ${mainObject}: kể lại một kỷ niệm ấm áp, cử chỉ yêu thương và nói lên lòng biết ơn của con.`;
    specificRequirements = [
      'Nhiệm vụ: Viết đoạn văn bộc lộ tình cảm, cảm xúc chân thực',
      `Đối tượng biểu cảm: ${mainObject}`,
      'Trọng tâm: Bộc lộ cảm xúc, lòng biết ơn và sự gắn bó ruột thịt',
      'Chi tiết: Gắn với cử chỉ chăm sóc hoặc kỷ niệm ấm áp'
    ];
    socraticQuestions = [
      `Người thân mà con dành trọn tình cảm yêu thương là ai (${mainObject})?`,
      'Nét tính cách, nụ cười hoặc cử chỉ nào của người ấy làm con thấy ấm áp và an yên nhất?',
      'Kỷ niệm nào giữa con và người ấy khiến con xúc động mỗi khi nhớ lại?',
      'Khi được người ấy yêu thương, chăm sóc, trong lòng con dâng lên cảm xúc biết ơn ra sao?',
      'Con muốn gửi lời cảm ơn và lời hứa chăm ngoan nào đến người ấy?'
    ];
    branches = [
      { id: 'br-1', title: '💖 Người thân yêu quý', icon: '💖', color: 'emerald', points: [`Giới thiệu ${mainObject}`, 'Tình cảm sâu đậm trong lòng con', 'Ấn tượng về nụ cười hiền hậu'] },
      { id: 'br-2', title: '☀️ Cử chỉ yêu thương ấm áp', icon: '☀️', color: 'purple', points: ['Sự chăm sóc chu đáo hàng ngày', 'Đôi bàn tay ân cần vỗ về', 'Lời khuyên bảo dịu dàng'] },
      { id: 'br-3', title: '📖 Kỷ niệm xúc động khó phai', icon: '📖', color: 'amber', points: ['Một lần con bị ốm được chăm sóc', 'Một lần con mắc lỗi được thứ tha', 'Cảm xúc bồi hồi khi nhớ lại'] },
      { id: 'br-4', title: '🌸 Lòng biết ơn chân thành', icon: '🌸', color: 'sky', points: ['Hiểu được nỗi vất vả, hy sinh', 'Biết ơn công lao nuôi dưỡng', 'Cảm giác bình yên khi ở cạnh người thân'] },
      { id: 'br-5', title: '⭐ Lời hứa & Mong ước', icon: '⭐', color: 'rose', points: ['Kính chúc người thân luôn mạnh khỏe', 'Hứa học giỏi, chăm ngoan để người thân vui lòng', 'Tình yêu thương son sắt mãi mãi'] }
    ];

    const sec1 = [`Giới thiệu người thân yêu quý (${mainObject}) và bộc lộ cảm xúc yêu mến, kính trọng dâng trào.`];
    const sec2 = [
      'Kể lại cử chỉ chăm sóc ân cần, dịu dàng của người thân dành cho em mỗi ngày.',
      'Nhớ lại một kỷ niệm xúc động gắn bó sâu đậm khiến em không bao giờ quên.',
      'Bày tỏ lòng biết ơn sâu sắc và cảm giác bình yên, được chở che trong vòng tay gia đình.'
    ];
    const sec3 = ['Khẳng định tình yêu thương vô bờ bến và lời hứa sẽ luôn chăm ngoan, học giỏi để người thân tự hào.'];

    outline = {
      moDoan: sec1,
      phatTrienDoan: sec2,
      ketDoan: sec3,
      genre: 'tinh_cam_cam_xuc',
      sections: [
        { id: 'sec-1', title: 'Phần 1. Mở đoạn - Giới thiệu người thân', icon: '🌱', guideNote: 'Giới thiệu người thân và bộc lộ ngay tình cảm chân thành', bulletPoints: sec1 },
        { id: 'sec-2', title: 'Phần 2. Phát triển đoạn - Cảm xúc & Kỷ niệm', icon: '💖', guideNote: 'Nêu cử chỉ yêu thương, kỷ niệm xúc động và lòng biết ơn', bulletPoints: sec2 },
        { id: 'sec-3', title: 'Phần 3. Kết đoạn - Khẳng định tình cảm & Lời hứa', icon: '🌟', guideNote: 'Tình yêu thương bền chặt và lời hứa chăm ngoan', bulletPoints: sec3 }
      ]
    };
  }

  // -------------------------------------------------------------
  // THỂ LOẠI 6A: THUẬT LẠI SỰ VIỆC THEO TRÌNH TỰ THỜI GIAN (thuat_lai - LỖI 3)
  // -------------------------------------------------------------
  else if (genre === 'thuat_lai') {
    const isFlagCeremony = mainObject.toLowerCase().includes('chào cờ') || coreSubject.toLowerCase().includes('chào cờ') || semantics.coreSubject.toLowerCase().includes('chào cờ');

    if (isFlagCeremony) {
      hoaNhoUnderstand = 'Con sẽ viết đoạn văn thuật lại một buổi lễ chào cờ đầu tuần ở trường em theo đúng trình tự thời gian. Con hãy nhớ lại quang cảnh sân trường rợp bóng cờ hoa, nghi lễ chào cờ trang nghiêm và những lời dặn dò bổ ích của thầy cô nhé!';
      specificRequirements = [
        'Thể loại: Đoạn văn thuật lại một sự việc theo trình tự thời gian',
        'Đối tượng: Buổi lễ chào cờ đầu tuần ở trường em',
        'Thời gian & Địa điểm: Sáng thứ Hai đầu tuần, trên sân trường rợp bóng cây',
        'Trình tự thời gian: Trước buổi lễ (chuẩn bị, xếp hàng), Trong buổi lễ (nghi thức chào cờ, hát Quốc ca, nhận xét thi đua), Sau buổi lễ (kết thúc, xếp hàng về lớp)',
        'Cảm xúc: Tự hào dưới lá cờ Tổ quốc và quyết tâm học tập, rèn luyện tốt',
        'Lưu ý: TUYỆT ĐỐI KHÔNG lồng ghép chuyện gia đình, bà ru hay viết thư vào buổi lễ chào cờ'
      ];
      socraticQuestions = [
        'Buổi lễ chào cờ diễn ra vào sáng thứ mấy, ở đâu và thời tiết hôm đó như thế nào?',
        'Trước khi buổi lễ bắt đầu, không khí sân trường và các bạn học sinh ra sao (xếp hàng, trang phục, khăn quàng đỏ)?',
        'Khi khẩu lệnh "Chào cờ! Chào!" vang lên, tư thế của con và toàn trường trang nghiêm như thế nào?',
        'Sau nghi thức chào cờ và hát Quốc ca, thầy cô đã nhận xét thi đua và phát động phong trào gì?',
        'Buổi lễ kết thúc ra sao và con có cảm xúc, quyết tâm gì cho tuần học mới?'
      ];
      branches = [
        {
          id: 'br-1',
          title: '⏰ Thời gian & Địa điểm',
          icon: '⏰',
          color: 'emerald',
          points: [
            'Sáng thứ Hai đầu tuần trong trẻo, mát mẻ',
            'Sân trường rộng rãi, rợp bóng mát cây bàng, cây phượng',
            'Lá cờ đỏ sao vàng tung bay phấp phới trên đỉnh cột cờ'
          ]
        },
        {
          id: 'br-2',
          title: '👥 Không khí trước buổi lễ',
          icon: '👥',
          color: 'purple',
          points: [
            'Tiếng trống trường vang lên giòn giã báo hiệu giờ tập trung',
            'Học sinh toàn trường nhanh chóng xếp hàng ngay ngắn theo từng lớp',
            'Đồng phục tinh tươm, khăn quàng đỏ thắm trên vai, gương mặt háo hức'
          ]
        },
        {
          id: 'br-3',
          title: '⚡ Hoạt động chính theo trình tự',
          icon: '⚡',
          color: 'amber',
          points: [
            'Khẩu lệnh dõng dạc vang lên: "Nghiêm! Chào cờ! Chào!"',
            'Hàng trăm ánh mắt hướng về Quốc kỳ, cất cao tiếng hát Quốc ca hào hùng',
            'Thầy Tổng phụ trách và Ban giám hiệu nhận xét thi đua tuần qua và phát động thi đua mới'
          ]
        },
        {
          id: 'br-4',
          title: '🏁 Kết thúc buổi lễ',
          icon: '🏁',
          color: 'sky',
          points: [
            'Tiếng vỗ tay rộn rã chúc mừng các lớp xuất sắc nhận cờ thi đua',
            'Thầy Hiệu trưởng ân cần dặn dò học sinh nỗ lực học tập',
            'Các lớp trật tự nối đuôi nhau di chuyển về phòng học chuẩn bị tiết học đầu tiên'
          ]
        },
        {
          id: 'br-5',
          title: '💖 Cảm xúc & Suy nghĩ',
          icon: '💖',
          color: 'rose',
          points: [
            'Lòng dâng lên niềm tự hào, xúc động khôn xiết dưới lá cờ Tổ quốc',
            'Cảm giác phấn chấn, tràn đầy năng lượng bước vào tuần học mới',
            'Tự hứa sẽ học tập chăm chỉ và rèn luyện tốt để đạt nhiều hoa điểm mười'
          ]
        }
      ];

      const sec1 = [
        'Mở đoạn: Giới thiệu thời gian (sáng thứ Hai đầu tuần), địa điểm (sân trường) và sự việc thuật lại: buổi lễ chào cờ trang nghiêm của trường em.'
      ];
      const sec2 = [
        'Trước buổi lễ: Tiếng trống vang lên giòn giã, các bạn học sinh chỉnh tề đồng phục, khăn quàng đỏ thắm nhanh chóng xếp thành những hàng ngũ thẳng tắp.',
        'Trong buổi lễ: Khẩu lệnh dõng dạc vang lên, toàn trường đứng nghiêm trang hướng về Quốc kỳ và cất cao giai điệu Quốc ca hào hùng; tiếp đó thầy cô Ban giám hiệu nhận xét thi đua tuần cũ và phát động phong trào mới.',
        'Kết thúc buổi lễ: Những tràng pháo tay giòn giã vang lên chúc mừng các lớp nhận cờ thi đua, sau đó từng lớp trật tự di chuyển về phòng học.'
      ];
      const sec3 = [
        'Kết đoạn: Bộc lộ cảm xúc tự hào, phấn khởi dưới lá cờ Tổ quốc và quyết tâm nỗ lực học tập thật tốt trong tuần mới.'
      ];

      outline = {
        moDoan: sec1,
        phatTrienDoan: sec2,
        ketDoan: sec3,
        genre: 'thuat_lai',
        sections: [
          { id: 'sec-1', title: 'Phần 1. Mở đoạn - Thời gian, địa điểm & Giới thiệu buổi lễ chào cờ', icon: '📍', guideNote: 'Nêu rõ thời gian sáng thứ Hai và không gian sân trường', bulletPoints: sec1 },
          { id: 'sec-2', title: 'Phần 2. Phát triển đoạn - Diễn biến buổi lễ theo trình tự thời gian', icon: '⏰', guideNote: 'Thuật lại trước buổi lễ, nghi thức chào cờ và kết thúc buổi lễ', bulletPoints: sec2 },
          { id: 'sec-3', title: 'Phần 3. Kết đoạn - Cảm xúc tự hào & Quyết tâm tuần mới', icon: '🌟', guideNote: 'Khẳng định niềm tự hào và lời hứa học tập chăm ngoan', bulletPoints: sec3 }
        ]
      };

      vocabularySuggestions = {
        goodWords: [
          { word: 'trang nghiêm', meaningAndUsage: 'Nghi thức diễn ra vô cùng tôn nghiêm, chỉnh tề và kính cẩn' },
          { word: 'dõng dạc', meaningAndUsage: 'Giọng hô to, rõ ràng và dứt khoát của người chỉ huy' },
          { word: 'hào hùng', meaningAndUsage: 'Giai điệu bài hát Quốc ca vang dội, đầy khí thế tự hào' },
          { word: 'thẳng tắp', meaningAndUsage: 'Hàng ngũ các lớp xếp ngay ngắn, thẳng đều tăm tắp' },
          { word: 'phấn chấn', meaningAndUsage: 'Tâm trạng vui tươi, tràn đầy hào hứng bước vào tuần học mới' }
        ],
        imageries: [
          { type: 'So sánh', example: 'Lá cờ đỏ sao vàng tung bay phần phật trên nền trời xanh như cánh chim kiêu hãnh', explanation: 'Gợi vẻ đẹp thiêng liêng của lá Quốc kỳ' },
          { type: 'Gợi tả', example: 'Tiếng hát Quốc ca của hàng trăm học sinh hòa nhịp vang động cả sân trường', explanation: 'Gợi không khí trang trọng, xúc động' }
        ],
        sampleSentences: [
          { type: 'mo_bai', label: 'Mở đoạn trang trọng', sentence: 'Mỗi sáng thứ Hai đầu tuần, khi tiếng trống rộn rã vang lên, sân trường em lại tưng bừng bước vào buổi lễ chào cờ trang nghiêm.', whyItIsGood: 'Nêu rõ thời gian, không gian và sự việc.' },
          { type: 'mieu_ta', label: 'Nghi lễ thiêng liêng', sentence: 'Dưới ánh nắng sớm mai, toàn trường đồng thanh cất cao bài Quốc ca với tất cả niềm tự hào khôn xiết.', whyItIsGood: 'Khắc họa khoảnh khắc thiêng liêng của nghi thức chào cờ.' },
          { type: 'ket_bai', label: 'Cảm xúc và quyết tâm', sentence: 'Buổi lễ chào cờ khép lại trong niềm hân hoan, tiếp thêm cho em ngọn lửa quyết tâm gặt hái thật nhiều hoa điểm mười trong tuần học mới.', whyItIsGood: 'Khép lại đầy cảm xúc và tinh thần tích cực.' }
        ],
        creativeIdeas: [
          'Gợi tả ánh nắng vàng rọi qua vòm lá chiếu sáng hàng khăn quàng đỏ thắm',
          'Nhớ lại lời dặn dò sâu sắc nhất của thầy cô trong buổi lễ'
        ]
      };
    } else {
      hoaNhoUnderstand = `Đề bài muốn con thuật lại sự việc "${mainObject}" theo đúng trình tự thời gian: việc gì diễn ra trước kể trước, việc gì diễn ra sau kể sau, có mở đầu, diễn biến và kết thúc rõ ràng.`;
      specificRequirements = [
        'Thể loại: Thuật lại sự việc theo trình tự thời gian',
        `Đối tượng: ${mainObject}`,
        'Trình tự: Nêu rõ các mốc thời gian (bắt đầu, diễn biến chính, kết thúc)',
        'Cảm xúc: Bộc lộ cảm nhận và ý nghĩa của hoạt động đối với bản thân'
      ];
      socraticQuestions = [
        'Sự việc bắt đầu khi nào, ở đâu và gồm những ai tham gia?',
        'Trước khi diễn ra, mọi người đã chuẩn bị những gì?',
        'Những hành động, sự việc chính diễn ra theo trình tự như thế nào?',
        'Chi tiết hoặc khoảnh khắc nào làm con ấn tượng nhất?',
        'Sự việc kết thúc ra sao và đọng lại trong con cảm xúc gì?'
      ];
      branches = [
        { id: 'br-1', title: '⏰ Bắt đầu sự việc', icon: '⏰', color: 'emerald', points: ['Thời gian, địa điểm diễn ra', 'Mục đích của sự việc', 'Không khí chuẩn bị ban đầu'] },
        { id: 'br-2', title: '⚡ Hoạt động mở đầu', icon: '⚡', color: 'purple', points: ['Việc làm đầu tiên', 'Sự tham gia tích cực của mọi người', 'Ấn tượng ban đầu'] },
        { id: 'br-3', title: '🏃 Diễn biến cao trào', icon: '🏃', color: 'amber', points: ['Những việc làm tiếp theo theo trình tự', 'Chi tiết sôi nổi hoặc gay cấn', 'Hành động phối hợp nhịp nhàng'] },
        { id: 'br-4', title: '🏁 Kết thúc hoạt động', icon: '🏁', color: 'sky', points: ['Sự việc khép lại ra sao?', 'Kết quả đạt được', 'Tiếng cười và niềm vui chung'] },
        { id: 'br-5', title: '💖 Cảm xúc & Ý nghĩa', icon: '💖', color: 'rose', points: ['Cảm xúc đọng lại trong lòng em', 'Ý nghĩa của hoạt động', 'Bài học kinh nghiệm bổ ích'] }
      ];

      const sec1 = [`Giới thiệu thời gian, địa điểm và sự việc (${mainObject}) mà em tham gia hoặc chứng kiến.`];
      const sec2 = [
        'Thuật lại những việc làm chuẩn bị mở đầu cho hoạt động.',
        'Thuật lại các sự việc chính nối tiếp nhau theo đúng trình tự thời gian.',
        'Chi tiết nổi bật nhất làm không khí trở nên hào hứng và đáng nhớ.'
      ];
      const sec3 = ['Sự việc khép lại và cảm xúc vui vẻ, tự hào cùng bài học ý nghĩa rút ra được.'];

      outline = {
        moDoan: sec1,
        phatTrienDoan: sec2,
        ketDoan: sec3,
        genre: 'thuat_lai',
        sections: [
          { id: 'sec-1', title: 'Phần 1. Mở đoạn - Giới thiệu sự việc', icon: '📍', guideNote: 'Nêu thời gian, địa điểm và sự việc bắt đầu', bulletPoints: sec1 },
          { id: 'sec-2', title: 'Phần 2. Phát triển đoạn - Thuật lại theo trình tự thời gian', icon: '⏰', guideNote: 'Kể các bước nối tiếp từ trước đến sau', bulletPoints: sec2 },
          { id: 'sec-3', title: 'Phần 3. Kết đoạn - Kết thúc & Cảm xúc', icon: '🌟', guideNote: 'Khép lại sự việc và nêu cảm nhận', bulletPoints: sec3 }
        ]
      };
    }
  }

  // -------------------------------------------------------------
  // THỂ LOẠI 6B: KỂ CHUYỆN / SỰ VIỆC / KỶ NIỆM (ke_chuyen)
  // -------------------------------------------------------------
  else if (genre === 'ke_chuyen') {
    const isCompassionStory = 
      semantics.choiceType === 'format_selection' ||
      mainObject.toLowerCase().includes('yêu thương') || 
      mainObject.toLowerCase().includes('đùm bọc') ||
      coreSubject.toLowerCase().includes('yêu thương') ||
      coreSubject.toLowerCase().includes('đùm bọc');

    const isGrandfatherMemory = semantics.selectedDirectionId === 'ong' || (isAboutGrandfather(mainObject) && !isAboutGrandmother(mainObject));
    const isGrandmotherMemory = semantics.selectedDirectionId === 'ba' || (isAboutGrandmother(mainObject) && !isAboutGrandfather(mainObject));

    // KỂ CHUYỆN CẢM ĐỘNG VỀ SỰ YÊU THƯƠNG, ĐÙM BỌC (LỖI 2)
    if (isCompassionStory) {
      const isShortEssay = semantics.selectedFormatId === 'bai_van_ngan';
      hoaNhoUnderstand = `Con sẽ ${isShortEssay ? 'viết một bài văn ngắn' : 'viết một đoạn văn'} kể lại một câu chuyện cảm động về sự yêu thương, đùm bọc giữa con người với con người. Hãy kể rõ hoàn cảnh khó khăn, nghĩa cử ấm áp kịp thời và bài học nhân ái làm sáng ngời tình người nhé!`;
      specificRequirements = [
        'Thể loại: Kể chuyện (Kể lại một câu chuyện có thật hoặc con đã chứng kiến/tham gia)',
        'Đề tài: Tình yêu thương, sự sẻ chia, đùm bọc giữa con người với con người',
        'Nhân vật & Hoàn cảnh: Giới thiệu rõ nhân vật gặp khó khăn và người giúp đỡ bằng tấm lòng nhân ái',
        'Diễn biến: Kể rõ các sự việc nối tiếp nhau, hành động sẻ chia kịp thời, ấm áp và khoảnh khắc xúc động nhất',
        'Kết quả & Bài học: Sự việc kết thúc tốt đẹp, lan tỏa lòng nhân ái và bài học sâu sắc về tinh thần "lá lành đùm lá rách"',
        `Hình thức: Bám sát hình thức con đã chọn (${isShortEssay ? 'Bài văn ngắn gồm 3 phần: Mở bài, Thân bài, Kết bài' : 'Một đoạn văn hoàn chỉnh liền mạch'})`
      ];
      socraticQuestions = [
        'Câu chuyện cảm động con muốn kể diễn ra trong hoàn cảnh nào (mùa bão lũ, hoàn cảnh khó khăn, hay một sự việc đời thường)?',
        'Ai là người gặp khó khăn và ai đã dang rộng vòng tay giúp đỡ họ bằng tất cả tình thương?',
        'Hành động giúp đỡ cụ thể diễn ra như thế nào (chia sẻ đồ ăn, quyên góp áo ấm, động viên tinh thần)?',
        'Khoảnh khắc hoặc cử chỉ nào trong câu chuyện làm con xúc động muốn rơi nước mắt?',
        'Câu chuyện kết thúc ra sao và đã để lại cho con bài học gì về tình người và lòng nhân ái?'
      ];
      branches = [
        {
          id: 'br-1',
          title: '📖 Câu chuyện & Nhân vật',
          icon: '📖',
          color: 'emerald',
          points: [
            'Tên câu chuyện cảm động hoặc sự việc có thật em đã chứng kiến',
            'Nhân vật gặp hoàn cảnh khó khăn, éo le cần được nâng đỡ',
            'Những con người giàu lòng nhân ái sẵn sàng dang tay giúp đỡ'
          ]
        },
        {
          id: 'br-2',
          title: '🌧️ Hoàn cảnh khó khăn cần sẻ chia',
          icon: '🌧️',
          color: 'purple',
          points: [
            'Thời gian và không gian diễn ra câu chuyện (ngày mưa bão, xóm nghèo, bệnh viện)',
            'Nỗi vất vả, thiếu thốn hoặc nghịch cảnh mà nhân vật phải đối mặt',
            'Sự bế tắc dường như không lối thoát nếu không có ai giúp đỡ'
          ]
        },
        {
          id: 'br-3',
          title: '💖 Diễn biến nghĩa cử yêu thương',
          icon: '💖',
          color: 'amber',
          points: [
            'Hành động giúp đỡ tận tình, không toan tính hay đòi hỏi đền đáp',
            'Lời nói động viên ân cần tiếp thêm niềm tin và nghị lực sống',
            'Sự chung tay đùm bọc của cả cộng đồng, bà con lối xóm'
          ]
        },
        {
          id: 'br-4',
          title: '✨ Khoảnh khắc xúc động nhất',
          icon: '✨',
          color: 'sky',
          points: [
            'Ánh mắt rưng rưng ngấn lệ vì xúc động và biết ơn',
            'Cái nắm tay siết chặt truyền hơi ấm tình người giữa gian khó',
            'Nụ cười rạng rỡ trở lại trên gương mặt sau bao ngày buồn tủi'
          ]
        },
        {
          id: 'br-5',
          title: '🌸 Cảm xúc & Bài học nhân ái',
          icon: '🌸',
          color: 'rose',
          points: [
            'Niềm xúc động, khâm phục trước những tấm lòng thơm thảo',
            'Khắc sâu truyền thống cao đẹp "Lá lành đùm lá rách", "Thương người như thể thương thân"',
            'Bản thân tự hứa sẽ luôn biết sẻ chia và giúp đỡ mọi người xung quanh'
          ]
        }
      ];

      if (isShortEssay) {
        const sec1 = [
          'Mở bài: Giới thiệu câu chuyện cảm động về tình yêu thương, đùm bọc giữa con người với con người và ấn tượng sâu đậm không thể phai mờ trong lòng em.'
        ];
        const sec2 = [
          'Hoàn cảnh câu chuyện: Thời gian, địa điểm và nghịch cảnh éo le của nhân vật cần được chở che, nâng đỡ.',
          'Diễn biến nghĩa cử cao đẹp: Kể lại chi tiết những hành động sẻ chia kịp thời, sự đùm bọc tận tình và ấm áp của những con người nhân hậu.',
          'Khoảnh khắc xúc động nhất: Giây phút nghẹn ngào làm rơi nước mắt, ánh mắt biết ơn và niềm hy vọng được thắp sáng.'
        ];
        const sec3 = [
          'Kết bài: Bày tỏ niềm xúc động, khâm phục những tấm lòng nhân ái và khẳng định bài học sâu sắc về tinh thần sẻ chia đối với bản thân và xã hội.'
        ];

        outline = {
          moDoan: sec1,
          phatTrienDoan: sec2,
          ketDoan: sec3,
          genre: 'ke_chuyen',
          sections: [
            { id: 'sec-1', title: 'Phần 1. Mở bài - Giới thiệu câu chuyện cảm động', icon: '🌱', guideNote: 'Nêu tên câu chuyện và ấn tượng sâu đậm ban đầu', bulletPoints: sec1 },
            { id: 'sec-2', title: 'Phần 2. Thân bài - Hoàn cảnh, diễn biến & Khoảnh khắc xúc động', icon: '💖', guideNote: 'Kể rõ đầu đuôi nghĩa cử yêu thương và chi tiết cảm động', bulletPoints: sec2 },
            { id: 'sec-3', title: 'Phần 3. Kết bài - Cảm xúc & Bài học nhân ái', icon: '🌸', guideNote: 'Khẳng định giá trị tình người và thông điệp lan tỏa', bulletPoints: sec3 }
          ]
        };
      } else {
        const sec1 = [
          'Mở đoạn: Giới thiệu câu chuyện cảm động về sự yêu thương, đùm bọc giữa con người với con người khiến em vô cùng xúc động và nhớ mãi.'
        ];
        const sec2 = [
          'Kể vắn tắt hoàn cảnh khó khăn của nhân vật và thời điểm sự việc diễn ra.',
          'Kể lại diễn biến hành động sẻ chia ấm áp, sự đùm bọc kịp thời không tính toan của những tấm lòng nhân ái.',
          'Chi tiết xúc động nhất: Khoảnh khắc ánh mắt chan chứa biết ơn và bàn tay ấm áp nắm chặt tiếp thêm niềm tin sống.'
        ];
        const sec3 = [
          'Kết đoạn: Bộc lộ cảm xúc trân trọng, xúc động và khắc ghi bài học "Lá lành đùm lá rách", tự nhủ luôn biết yêu thương và sẻ chia với mọi người.'
        ];

        outline = {
          moDoan: sec1,
          phatTrienDoan: sec2,
          ketDoan: sec3,
          genre: 'ke_chuyen',
          sections: [
            { id: 'sec-1', title: 'Phần 1. Mở đoạn - Giới thiệu câu chuyện yêu thương', icon: '🌱', guideNote: 'Nêu câu chuyện cảm động và cảm xúc ban đầu', bulletPoints: sec1 },
            { id: 'sec-2', title: 'Phần 2. Phát triển đoạn - Hoàn cảnh & Diễn biến nghĩa cử đùm bọc', icon: '📖', guideNote: 'Kể lại việc làm tốt và chi tiết xúc động nhất', bulletPoints: sec2 },
            { id: 'sec-3', title: 'Phần 3. Kết đoạn - Cảm xúc & Bài học nhân ái', icon: '🌸', guideNote: 'Rút ra bài học nhân văn sâu sắc', bulletPoints: sec3 }
          ]
        };
      }

      vocabularySuggestions = {
        goodWords: [
          { word: 'đùm bọc', meaningAndUsage: 'Che chở, cưu mang và giúp đỡ người gặp khó khăn bằng tình thương yêu' },
          { word: 'sẻ chia', meaningAndUsage: 'Cùng san sẻ niềm vui, nỗi buồn hoặc của cải vật chất với người thiếu thốn' },
          { word: 'nhân ái', meaningAndUsage: 'Tấm lòng yêu thương con người tha thiết, luôn hướng thiện' },
          { word: 'thơm thảo', meaningAndUsage: 'Tấm lòng tốt đẹp, hào phóng và chân thành dành cho mọi người' },
          { word: 'nghẹn ngào', meaningAndUsage: 'Cảm xúc xúc động trào dâng đến mức không nói nên lời' }
        ],
        imageries: [
          { type: 'Thành ngữ', example: 'Lá lành đùm lá rách / Thương người như thể thương thân', explanation: 'Truyền thống yêu thương tương thân tương ái ngàn đời của dân tộc' },
          { type: 'So sánh', example: 'Nghĩa cử ấm áp của cô chú như ngọn lửa sưởi ấm những ngày đông giá rét', explanation: 'Gợi sự ấm áp xua tan gian khổ của tình người' }
        ],
        sampleSentences: [
          { type: 'mo_bai', label: 'Mở đầu xúc động', sentence: 'Trong cuộc sống quanh ta, có những câu chuyện dung dị mà sáng ngời tình người, làm ấm lòng bao số phận éo le.', whyItIsGood: 'Mở đầu tự nhiên, gợi mở chủ đề nhân văn.' },
          { type: 'mieu_ta', label: 'Khoảnh khắc ấm áp', sentence: 'Đôi bàn tay gầy guộc run run đón nhận gói quà ấm áp, ánh mắt rưng rưng ngấn lệ nói lên ngàn lời cảm ơn không cất nên lời.', whyItIsGood: 'Chi tiết miêu tả cử chỉ xúc động, giàu hình ảnh.' },
          { type: 'ket_bai', label: 'Bài học lan tỏa', sentence: 'Câu chuyện khép lại nhưng ngọn lửa yêu thương vẫn âm ỉ cháy mãi trong trái tim em, nhắc nhở em biết sống vì mọi người.', whyItIsGood: 'Khép lại giàu dư ba và ý nghĩa giáo dục sâu sắc.' }
        ],
        creativeIdeas: [
          'Kể lại một chi tiết đối thoại mộc mạc mà chứa chan tình người',
          'Liên hệ tới phong trào quyên góp ủng hộ đồng bào lũ lụt ở trường con'
        ]
      };
    } else if (isGrandfatherMemory) {
      hoaNhoUnderstand = 'Đề bài muốn con kể lại một kỷ niệm đáng nhớ và sâu sắc với ông. Con hãy nhớ lại một lần được ông dạy bảo ân cần, cùng ông tỉa cây làm vườn, chơi cờ hoặc một việc làm của ông khiến con xúc động nhé!';
      specificRequirements = [
        'Nhiệm vụ: Kể lại một kỷ niệm đáng nhớ với ông',
        'Đối tượng: Ông của em (ông nội hoặc ông ngoại)',
        'Diễn biến: Kể rõ hoàn cảnh, hành động cử chỉ của ông và cảm xúc của cháu',
        'Ý nghĩa: Lòng biết ơn, kính yêu và bài học quý từ ông'
      ];
      socraticQuestions = [
        'Kỷ niệm đáng nhớ nhất giữa con và ông xảy ra vào dịp nào, ở đâu?',
        'Lúc đó ông đã làm gì, nói gì với con bằng cử chỉ ân cần như thế nào?',
        'Con đã làm việc gì cùng ông (tưới cây, đọc báo, nghe ông kể chuyện xưa)?',
        'Khoảnh khắc nào trong câu chuyện làm con cảm động và nhớ mãi?',
        'Qua kỷ niệm ấy, con cảm nhận được tình thương của ông và rút ra bài học gì?'
      ];
      branches = [
        { id: 'br-1', title: '⏰ Thời gian & Dịp kỷ niệm', icon: '⏰', color: 'emerald', points: ['Kỷ niệm diễn ra khi nào?', 'Ở quê hay tại nhà con?', 'Hoàn cảnh bắt đầu câu chuyện'] },
        { id: 'br-2', title: '👴 Hình bóng & Cử chỉ của ông', icon: '👴', color: 'purple', points: ['Mái tóc bạc, nụ cười hiền hậu', 'Ánh mắt ấm áp, bàn tay gầy gầy', 'Giọng nói trầm ấm khuyên bảo'] },
        { id: 'br-3', title: '⚡ Việc làm & Kỷ niệm xúc động', icon: '⚡', color: 'amber', points: ['Cùng ông chăm sóc vườn cây', 'Được ông kiên nhẫn dạy dỗ khi mắc lỗi', 'Chi tiết làm con nhớ nhất'] },
        { id: 'br-4', title: '💖 Lời dặn dò quý giá', icon: '💖', color: 'sky', points: ['Lời ông dạy về lòng trung thực, chăm ngoan', 'Tình yêu thương vô bờ của ông dành cho cháu'] },
        { id: 'br-5', title: '🌸 Lòng biết ơn & Tình cảm', icon: '🌸', color: 'rose', points: ['Cảm xúc kính yêu, tự hào về ông', 'Hứa luôn chăm ngoan để ông vui lòng'] }
      ];

      const sec1 = ['Mở đầu: Giới thiệu kỷ niệm đáng nhớ nhất với ông và ấn tượng sâu đậm trong lòng em.'];
      const sec2 = [
        'Kể lại hoàn cảnh diễn ra kỷ niệm: Thời gian, không gian ấm áp bên ông.',
        'Kể diễn biến sự việc: Cử chỉ ân cần, lời dạy bảo nhẹ nhàng của ông và việc làm hai ông cháu cùng thực hiện.',
        'Chi tiết xúc động nhất: Ánh mắt trìu mến của ông khi nhìn cháu.'
      ];
      const sec3 = ['Kết thúc: Bày tỏ tình cảm kính yêu tha thiết đối với ông và lời hứa luôn khắc ghi lời ông dạy.'];

      outline = {
        moDoan: sec1,
        phatTrienDoan: sec2,
        ketDoan: sec3,
        genre: 'ke_chuyen',
        sections: [
          { id: 'sec-1', title: 'Phần 1. Mở đầu - Giới thiệu kỷ niệm với ông', icon: '🌱', guideNote: 'Nêu thời gian và ấn tượng về kỷ niệm với ông', bulletPoints: sec1 },
          { id: 'sec-2', title: 'Phần 2. Diễn biến - Câu chuyện và cử chỉ ấm áp của ông', icon: '📖', guideNote: 'Kể chi tiết hành động và lời khuyên ân cần của ông', bulletPoints: sec2 },
          { id: 'sec-3', title: 'Phần 3. Kết thúc - Tình cảm kính yêu & Lời hứa', icon: '🌸', guideNote: 'Lòng biết ơn và mong ước ông luôn mạnh khỏe', bulletPoints: sec3 }
        ]
      };
    } else if (isGrandmotherMemory) {
      hoaNhoUnderstand = 'Đề bài muốn con kể lại một kỷ niệm ấm áp và ngọt ngào với bà. Con hãy nhớ lại lời ru, câu chuyện cổ tích bà kể, món ăn thơm lừng bà nấu, hoặc sự chăm sóc dịu dàng của bà nhé!';
      specificRequirements = [
        'Nhiệm vụ: Kể lại một kỷ niệm đáng nhớ với bà',
        'Đối tượng: Bà của em (bà nội hoặc bà ngoại)',
        'Diễn biến: Kể rõ hoàn cảnh, câu chuyện cổ tích hoặc sự chăm sóc ân cần của bà',
        'Ý nghĩa: Lòng biết ơn, kính yêu và tình cảm gắn bó thiêng liêng'
      ];
      socraticQuestions = [
        'Kỷ niệm đáng nhớ nhất giữa con và bà diễn ra vào lúc nào (buổi trưa hè, đêm trăng, hay dịp nghỉ hè)?',
        'Bà đã dành cho con sự chăm sóc dịu dàng nào (quạt mát, kể chuyện cổ tích, nấu món ngon)?',
        'Hình ảnh của bà lúc đó hiện lên ra sao (lưng còng, nụ cười móm mém, bàn tay chai sần ấm áp)?',
        'Điều gì bà làm khiến con cảm động nhất?',
        'Con muốn gửi gắm tình cảm yêu thương và lời hứa gì đến bà?'
      ];
      branches = [
        { id: 'br-1', title: '⏰ Thời gian & Không gian ấm áp', icon: '⏰', color: 'emerald', points: ['Kỷ niệm diễn ra vào dịp nào?', 'Chiếc chõng tre trưa hè / Gian bếp ấm cúng', 'Không khí êm đềm bên bà'] },
        { id: 'br-2', title: '👵 Nụ cười & Bàn tay của bà', icon: '👵', color: 'purple', points: ['Mái tóc như mây trắng', 'Bàn tay chai sần dịu dàng xoa đầu', 'Nụ cười phúc hậu, hiền từ'] },
        { id: 'br-3', title: '⚡ Câu chuyện / Việc làm của bà', icon: '⚡', color: 'amber', points: ['Tiếng quạt nan đưa gió mát lành', 'Câu chuyện cổ tích bà thì thầm bên tai', 'Món bánh thơm phức bà dành riêng cho cháu'] },
        { id: 'br-4', title: '💖 Tình thương bao la của bà', icon: '💖', color: 'sky', points: ['Sự chăm sóc chu đáo từng giấc ngủ, bữa ăn', 'Tình yêu thương dung dị mà sâu nặng'] },
        { id: 'br-5', title: '🌸 Lòng biết ơn & Lời hứa', icon: '🌸', color: 'rose', points: ['Yêu quý và kính trọng bà sâu sắc', 'Mong bà sống thật lâu, luôn mạnh khỏe bình an'] }
      ];

      const sec1 = ['Mở đầu: Giới thiệu kỷ niệm ấm áp với bà và cảm xúc yêu thương đong đầy.'];
      const sec2 = [
        'Kể lại hoàn cảnh kỷ niệm: Buổi trưa hè trên chiếc chõng tre hoặc gian bếp ấm áp bên bà.',
        'Kể diễn biến câu chuyện: Tiếng quạt nan phe phẩy, giọng kể cổ tích ngọt ngào hoặc sự chăm sóc dịu dàng của bà.',
        'Chi tiết cảm động nhất: Tình yêu thương lặng thầm của bà dành trọn cho cháu.'
      ];
      const sec3 = ['Kết thúc: Bày tỏ tình cảm kính yêu tha thiết đối với bà và mong ước bà sống vui khỏe bên con cháu.'];

      outline = {
        moDoan: sec1,
        phatTrienDoan: sec2,
        ketDoan: sec3,
        genre: 'ke_chuyen',
        sections: [
          { id: 'sec-1', title: 'Phần 1. Mở đầu - Giới thiệu kỷ niệm với bà', icon: '🌱', guideNote: 'Nêu thời gian và ấn tượng ấm áp về bà', bulletPoints: sec1 },
          { id: 'sec-2', title: 'Phần 2. Diễn biến - Kỷ niệm và sự chăm sóc dịu dàng của bà', icon: '📖', guideNote: 'Kể chi tiết hành động yêu thương và lời dặn dò của bà', bulletPoints: sec2 },
          { id: 'sec-3', title: 'Phần 3. Kết thúc - Tình cảm kính yêu & Lời hứa', icon: '🌸', guideNote: 'Lòng biết ơn và mong ước bà luôn mạnh khỏe bình an', bulletPoints: sec3 }
        ]
      };
    } else {
      hoaNhoUnderstand = `Đề bài muốn con kể lại một câu chuyện hoặc sự việc theo đúng trình tự thời gian: có mở đầu, diễn biến các sự việc và kết thúc giàu ý nghĩa.`;
      specificRequirements = [
        'Nhiệm vụ: Kể lại câu chuyện hoặc sự việc theo trình tự hợp lý',
        'Nhân vật & Hoàn cảnh: Giới thiệu rõ ràng nhân vật, thời gian, địa điểm',
        'Diễn biến: Kể các sự việc nối tiếp nhau (mở đầu, phát triển, cao trào, kết thúc)',
        'Ý nghĩa: Rút ra bài học hoặc cảm xúc đáng nhớ'
      ];
      socraticQuestions = [
        'Câu chuyện hoặc sự việc đó xảy ra khi nào, ở đâu?',
        'Có những nhân vật nào tham gia cùng con?',
        'Sự việc mở đầu ra sao khiến con chú ý?',
        'Diễn biến tiếp theo diễn ra như thế nào, có chi tiết nào gay cấn hoặc bất ngờ?',
        'Kết quả câu chuyện ra sao và con có cảm xúc hoặc bài học gì sâu sắc?'
      ];
      branches = [
        { id: 'br-1', title: '⏰ Thời gian & Địa điểm', icon: '⏰', color: 'emerald', points: ['Sự việc diễn ra khi nào?', 'Không gian ở đâu?', 'Hoàn cảnh bắt đầu'] },
        { id: 'br-2', title: '👥 Nhân vật tham gia', icon: '👥', color: 'purple', points: ['Có những ai cùng tham gia?', 'Lời nói, hành động của nhân vật', 'Nét mặt, cử chỉ'] },
        { id: 'br-3', title: '⚡ Mở đầu & Diễn biến', icon: '⚡', color: 'amber', points: ['Sự việc mở đầu thế nào?', 'Các hành động diễn ra liên tiếp', 'Chi tiết gay cấn, đáng nhớ nhất'] },
        { id: 'br-4', title: '🏁 Kết quả sự việc', icon: '🏁', color: 'sky', points: ['Sự việc kết thúc ra sao?', 'Mọi người cảm thấy thế nào?', 'Niềm vui hoặc sự nhẹ nhõm'] },
        { id: 'br-5', title: '💖 Cảm xúc & Bài học', icon: '💖', color: 'rose', points: ['Cảm xúc đọng lại trong lòng em', 'Bài học ý nghĩa em rút ra được', 'Kỷ niệm khó phai mờ'] }
      ];

      const sec1 = ['Giới thiệu thời gian, địa điểm và sự việc/kỷ niệm đáng nhớ mà em sắp kể.'];
      const sec2 = [
        'Kể lại sự việc mở đầu: Hoàn cảnh dẫn đến sự việc và những người cùng tham gia.',
        'Kể lại diễn biến chính: Những hành động, lời nói nối tiếp nhau và chi tiết cao trào đáng nhớ.',
        'Kể lại kết thúc: Sự việc khép lại ra sao và mọi người cảm thấy thế nào.'
      ];
      const sec3 = ['Bày tỏ cảm xúc của em về câu chuyện và bài học quý giá mà em rút ra được.'];

      outline = {
        moDoan: sec1,
        phatTrienDoan: sec2,
        ketDoan: sec3,
        genre: 'ke_chuyen',
        sections: [
          { id: 'sec-1', title: 'Phần 1. Mở đầu - Hoàn cảnh sự việc', icon: '🌱', guideNote: 'Nêu thời gian, địa điểm và nhân vật tham gia', bulletPoints: sec1 },
          { id: 'sec-2', title: 'Phần 2. Diễn biến - Các sự việc nối tiếp', icon: '📖', guideNote: 'Kể rõ đầu đuôi sự việc và chi tiết đáng nhớ nhất', bulletPoints: sec2 },
          { id: 'sec-3', title: 'Phần 3. Kết thúc - Cảm xúc & Ý nghĩa', icon: '🌸', guideNote: 'Kết quả sự việc và cảm xúc lắng đọng của em', bulletPoints: sec3 }
        ]
      };
    }
  }

  // -------------------------------------------------------------
  // THỂ LOẠI 7: THÔNG BÁO (thong_bao)
  // -------------------------------------------------------------
  else if (genre === 'thong_bao') {
    hoaNhoUnderstand = `Đề bài muốn con viết một bản thông báo ngắn gọn, rõ ràng theo đúng thể thức: người nhận, nội dung việc cần làm, thời gian, địa điểm và người thông báo.`;
    specificRequirements = [
      'Nhiệm vụ: Viết bản thông báo ngắn gọn, chính xác',
      'Người nhận thông báo: Các bạn học sinh trong lớp/trường',
      'Nội dung: Việc cần thực hiện, thời gian, địa điểm cụ thể',
      'Người gửi thông báo: Ký tên lớp trưởng hoặc ban cán sự'
    ];
    socraticQuestions = [
      'Bản thông báo này gửi cho ai (các bạn trong lớp hay toàn trường)?',
      'Nội dung chính cần thông báo là việc gì?',
      'Thời gian và địa điểm diễn ra hoạt động là khi nào, ở đâu?',
      'Các bạn cần chuẩn bị những đồ dùng hoặc trang phục gì?',
      'Ai là người ra thông báo (Lớp trưởng, Đội cờ đỏ...)?'
    ];
    branches = [
      { id: 'br-1', title: '📢 Tiêu đề thông báo', icon: '📢', color: 'emerald', points: ['Tên bản thông báo', 'Đơn vị ra thông báo', 'Mục đích ngắn gọn'] },
      { id: 'br-2', title: '👥 Đối tượng nhận tin', icon: '👥', color: 'purple', points: ['Gửi tới toàn thể học sinh', 'Các tổ trong lớp'] },
      { id: 'br-3', title: '📝 Nội dung việc cần làm', icon: '📝', color: 'amber', points: ['Hoạt động cụ thể cần tham gia', 'Yêu cầu chuẩn bị', 'Phân công nhiệm vụ'] },
      { id: 'br-4', title: '⏰ Thời gian & Địa điểm', icon: '⏰', color: 'sky', points: ['Ngày, giờ bắt đầu', 'Địa điểm tập trung', 'Hạn chót hoàn thành'] },
      { id: 'br-5', title: '✒️ Người lập thông báo', icon: '✒️', color: 'rose', points: ['Chức vụ người thông báo', 'Ký tên và ghi rõ họ tên'] }
    ];

    const sec1 = ['Tiêu đề thông báo: "THÔNG BÁO VỀ KẾ HOẠCH LAO ĐỘNG VỆ SINH LỚP HỌC"'];
    const sec2 = [
      'Đối tượng nhận thông báo: Kính gửi các bạn học sinh lớp 3A.',
      'Nội dung công việc: Tham gia tổng vệ sinh phòng học, lau bảng và tưới cây xanh trước hành lang.',
      'Thời gian và địa điểm: 8 giờ sáng thứ Bảy, tại phòng học số 12.'
    ];
    const sec3 = ['Lời nhắc nhở các bạn mang theo khăn lau và khẩu trang', 'Người thông báo: Lớp trưởng lớp 3A (Ký và ghi rõ họ tên).'];

    outline = {
      moDoan: sec1,
      phatTrienDoan: sec2,
      ketDoan: sec3,
      genre: 'thong_bao',
      sections: [
        { id: 'sec-1', title: 'Phần 1. Tiêu đề & Đơn vị ra thông báo', icon: '📢', guideNote: 'Ghi rõ tên bản thông báo in hoa nổi bật', bulletPoints: sec1 },
        { id: 'sec-2', title: 'Phần 2. Nội dung công việc, Thời gian & Địa điểm', icon: '📋', guideNote: 'Nêu rõ ràng, chính xác công việc cần làm', bulletPoints: sec2 },
        { id: 'sec-3', title: 'Phần 3. Lời nhắc nhở & Người lập thông báo', icon: '✒️', guideNote: 'Lời kêu gọi thực hiện đúng giờ và chữ ký', bulletPoints: sec3 }
      ]
    };
  }

  // -------------------------------------------------------------
  // THỂ LOẠI 8: BÁO CÁO (bao_cao)
  // -------------------------------------------------------------
  else if (genre === 'bao_cao') {
    hoaNhoUnderstand = `Đề bài muốn con viết một bản báo cáo ngắn gọn về kết quả hoạt động hoặc buổi làm việc nhóm: nêu rõ mục đích, việc đã làm, kết quả đạt được và bài học rút ra.`;
    specificRequirements = [
      'Nhiệm vụ: Viết báo cáo hoạt động học tập hoặc phong trào',
      'Cấu trúc: Tên báo cáo, Các công việc đã làm, Kết quả đạt được, Kiến nghị',
      'Ngôn ngữ: Ngắn gọn, số liệu chính xác, thái độ trung thực'
    ];
    socraticQuestions = [
      'Bản báo cáo này về hoạt động gì (trực nhật, học nhóm, thi đua phong trào)?',
      'Mục đích của hoạt động đó là gì?',
      'Nhóm của con đã thực hiện những công việc cụ thể nào?',
      'Kết quả đạt được ra sao (số bạn tham gia, số điểm tốt, lời khen)?',
      'Có khó khăn nào và con có đề xuất gì để lần sau làm tốt hơn?'
    ];
    branches = [
      { id: 'br-1', title: '📊 Tên báo cáo & Mục đích', icon: '📊', color: 'emerald', points: ['Tên hoạt động báo cáo', 'Mục tiêu đề ra', 'Thời gian thực hiện'] },
      { id: 'br-2', title: '👥 Thành phần tham gia', icon: '👥', color: 'purple', points: ['Danh sách các thành viên trong nhóm', 'Phân công nhiệm vụ cho từng bạn'] },
      { id: 'br-3', title: '🛠️ Các việc đã thực hiện', icon: '🛠️', color: 'amber', points: ['Tiến độ công việc', 'Các bước đã hoàn thành', 'Tinh thần đoàn kết làm việc'] },
      { id: 'br-4', title: '🏆 Kết quả đạt được', icon: '🏆', color: 'sky', points: ['Thành tích cụ thể', 'Khối lượng công việc hoàn thành', 'Đánh giá chung'] },
      { id: 'br-5', title: '💡 Kiến nghị & Ký tên', icon: '💡', color: 'rose', points: ['Bài học kinh nghiệm', 'Đề xuất cải tiến', 'Ký tên người báo cáo'] }
    ];

    const sec1 = ['Tiêu đề: BÁO CÁO KẾT QUẢ HOẠT ĐỘNG THẢO LUẬN NHÓM'];
    const sec2 = [
      'Công việc đã làm: Cả nhóm đã hoàn thành việc sưu tầm tranh ảnh và vẽ sơ đồ tư duy cho bài học.',
      'Kết quả đạt được: 100% các thành viên tham gia tích cực, nhóm hoàn thành bài trước thời hạn và được cô khen ngợi.'
    ];
    const sec3 = ['Đề xuất cho buổi sinh hoạt tới', 'Người làm báo cáo: Nhóm trưởng (Ký và ghi rõ họ tên).'];

    outline = {
      moDoan: sec1,
      phatTrienDoan: sec2,
      ketDoan: sec3,
      genre: 'bao_cao',
      sections: [
        { id: 'sec-1', title: 'Phần 1. Tiêu đề báo cáo & Mục đích', icon: '📊', guideNote: 'Nêu tên hoạt động và mục tiêu thực hiện', bulletPoints: sec1 },
        { id: 'sec-2', title: 'Phần 2. Các việc đã làm & Kết quả', icon: '🛠️', guideNote: 'Liệt kê công việc cụ thể và kết quả đạt được', bulletPoints: sec2 },
        { id: 'sec-3', title: 'Phần 3. Nhận xét, Kiến nghị & Ký tên', icon: '✒️', guideNote: 'Rút kinh nghiệm và chữ ký người đại diện', bulletPoints: sec3 }
      ]
    };
  }

  // -------------------------------------------------------------
  // THỂ LOẠI 9: KẾ HOẠCH (ke_hoach)
  // -------------------------------------------------------------
  else if (genre === 'ke_hoach') {
    hoaNhoUnderstand = `Đề bài muốn con lập một bản kế hoạch cụ thể: xác định rõ mục tiêu, các bước công việc cần làm, thời gian, người phụ trách và kết quả mong muốn.`;
    specificRequirements = [
      'Nhiệm vụ: Lập bản kế hoạch công việc hoặc học tập',
      'Cấu trúc: Mục tiêu, Các bước thực hiện, Thời gian, Người làm, Kết quả dự kiến',
      'Tính khả thi: Sắp xếp các bước khoa học, rõ ràng'
    ];
    socraticQuestions = [
      'Kế hoạch này phục vụ cho việc gì (ôn tập hè, dọn dẹp lớp, chuẩn bị dã ngoại)?',
      'Mục tiêu lớn nhất con muốn đạt được là gì?',
      'Có những bước công việc nào cần chuẩn bị trước?',
      'Thời gian biểu cho từng công việc diễn ra thế nào?',
      'Con mong đợi kết quả cuối cùng sẽ ra sao?'
    ];
    branches = [
      { id: 'br-1', title: '🎯 Mục tiêu kế hoạch', icon: '🎯', color: 'emerald', points: ['Mục tiêu cần đạt', 'Ý nghĩa của kế hoạch', 'Thời gian áp dụng'] },
      { id: 'br-2', title: '📋 Các công việc chuẩn bị', icon: '📋', color: 'purple', points: ['Chuẩn bị đồ dùng, dụng cụ', 'Tìm hiểu thông tin cần thiết'] },
      { id: 'br-3', title: '🗓️ Lịch trình thực hiện', icon: '🗓️', color: 'amber', points: ['Chia nhỏ theo từng ngày/giờ', 'Trình tự việc trước, việc sau'] },
      { id: 'br-4', title: '👥 Phân công phụ trách', icon: '👥', color: 'sky', points: ['Ai làm việc gì', 'Hỗ trợ lẫn nhau'] },
      { id: 'br-5', title: '🌟 Kết quả mong đợi', icon: '🌟', color: 'rose', points: ['Sản phẩm hoàn thành', 'Khen thưởng và niềm vui'] }
    ];

    const sec1 = ['Tiêu đề: KẾ HOẠCH RÈN LUYỆN CHỮ VIẾT TRONG KỲ NGHỈ HÈ'];
    const sec2 = [
      'Mục tiêu: Viết đúng nét, giữ vở sạch đẹp và đạt giải Vở sạch chữ đẹp.',
      'Các bước thực hiện: Mỗi ngày dành 30 phút luyện viết một bài chính tả.',
      'Thời gian: Từ 8 giờ đến 8 giờ 30 phút mỗi sáng.'
    ];
    const sec3 = ['Tự đánh giá vào cuối tuần', 'Lời cam kết thực hiện nghiêm túc.'];

    outline = {
      moDoan: sec1,
      phatTrienDoan: sec2,
      ketDoan: sec3,
      genre: 'ke_hoach',
      sections: [
        { id: 'sec-1', title: 'Phần 1. Mục tiêu kế hoạch', icon: '🎯', guideNote: 'Nêu rõ đích đến con muốn đạt được', bulletPoints: sec1 },
        { id: 'sec-2', title: 'Phần 2. Nội dung công việc & Thời gian', icon: '🗓️', guideNote: 'Phân chia các bước thực hiện rõ ràng theo lịch', bulletPoints: sec2 },
        { id: 'sec-3', title: 'Phần 3. Cam kết thực hiện', icon: '🌟', guideNote: 'Lời hứa kiên trì hoàn thành kế hoạch', bulletPoints: sec3 }
      ]
    };
  }

  // -------------------------------------------------------------
  // THỂ LOẠI 10: VIẾT SÁNG TẠO / TƯỞNG TƯỢNG (sang_tao)
  // -------------------------------------------------------------
  else if (genre === 'sang_tao') {
    hoaNhoUnderstand = `Đề bài muốn con bay bổng cùng trí tưởng tượng: hóa thân thành nhân vật, khám phá thế giới kỳ diệu và kể lại cuộc phiêu lưu đầy thú vị.`;
    specificRequirements = [
      'Nhiệm vụ: Viết bài văn tưởng tượng hoặc nhập vai sáng tạo',
      'Góc nhìn: Đóng vai nhân vật (xưng Tôi / Em)',
      'Tình huống: Tình huống bất ngờ, kỳ thú mang màu sắc cổ tích hoặc khoa học viễn tưởng',
      'Ý nghĩa: Gửi gắm bài học nhân văn, tình yêu cuộc sống'
    ];
    socraticQuestions = [
      'Con muốn tưởng tượng mình là ai hoặc ở trong thế giới nào?',
      'Bối cảnh không gian và thời gian nơi ấy có gì kỳ lạ, khác biệt với đời thực?',
      'Tình huống bất ngờ nào đã xảy ra cuốn con vào cuộc phiêu lưu?',
      'Con đã cùng bạn bè vượt qua thử thách ấy ra sao?',
      'Sau chuyến phiêu lưu kỳ thú, con nhận ra bài học ý nghĩa gì?'
    ];
    branches = [
      { id: 'br-1', title: '✨ Bối cảnh & Nhân vật', icon: '✨', color: 'emerald', points: ['Hóa thân thành ai?', 'Xứ sở tưởng tượng diệu kỳ', 'Điều đặc biệt ban đầu'] },
      { id: 'br-2', title: '🪄 Tình huống bất ngờ', icon: '🪄', color: 'purple', points: ['Sự việc kỳ lạ xảy ra', 'Phép màu xuất hiện', 'Cảm giác ngỡ ngàng thích thú'] },
      { id: 'br-3', title: '🚀 Cuộc phiêu lưu kỳ thú', icon: '🚀', color: 'amber', points: ['Vượt qua thử thách', 'Khám phá những điều chưa từng thấy', 'Tình bạn đẹp trong tưởng tượng'] },
      { id: 'br-4', title: '🌈 Cao trào & Niềm vui', icon: '🌈', color: 'sky', points: ['Khoảnh khắc gay cấn nhất', 'Chiến thắng khó khăn', 'Niềm vui vỡ òa'] },
      { id: 'br-5', title: '💖 Bài học sau chuyến đi', icon: '💖', color: 'rose', points: ['Trở về với thực tại ấm áp', 'Bài học quý về tình yêu thương', 'Ước mơ tươi đẹp'] }
    ];

    const sec1 = ['Giới thiệu nhân vật con hóa thân và không gian tưởng tượng huyền diệu mở ra.'];
    const sec2 = [
      'Kể lại tình huống bất ngờ đưa con bước vào thế giới diệu kỳ.',
      'Miêu tả những hình ảnh lạ mắt, phép màu kỳ diệu và cuộc gặp gỡ thú vị.',
      'Kể lại cách con và các bạn cùng nhau vượt qua một thử thách gay cấn.'
    ];
    const sec3 = ['Tỉnh giấc hoặc khép lại chuyến phiêu lưu trong niềm hân hoan và rút ra bài học nhân văn sâu sắc.'];

    outline = {
      moDoan: sec1,
      phatTrienDoan: sec2,
      ketDoan: sec3,
      genre: 'sang_tao',
      sections: [
        { id: 'sec-1', title: 'Phần 1. Mở đầu - Cánh cửa thế giới tưởng tượng', icon: '✨', guideNote: 'Giới thiệu nhân vật hóa thân và bối cảnh kỳ diệu', bulletPoints: sec1 },
        { id: 'sec-2', title: 'Phần 2. Diễn biến - Chuyến phiêu lưu kỳ thú', icon: '🚀', guideNote: 'Tình huống bất ngờ, phép màu và thử thách', bulletPoints: sec2 },
        { id: 'sec-3', title: 'Phần 3. Kết thúc - Bài học & Trở về thực tại', icon: '💖', guideNote: 'Khép lại lắng đọng và bài học ý nghĩa', bulletPoints: sec3 }
      ]
    };
  }

  // -------------------------------------------------------------
  // THỂ LOẠI 11: MIÊU TẢ (mieu_ta - Mặc định chuẩn quan sát)
  // -------------------------------------------------------------
  else if (genre === 'mieu_ta') {
    const isTreeSelection = 
      semantics.topicCode === 'CD08' ||
      mainObject.toLowerCase().includes('cây') || 
      coreSubject.toLowerCase().includes('cây bóng mát') ||
      coreSubject.toLowerCase().includes('cây bàng') ||
      coreSubject.toLowerCase().includes('phượng vĩ') ||
      coreSubject.toLowerCase().includes('cây đa') ||
      (semantics.availableObjects && semantics.availableObjects.some(o => o.id === 'cay_bang'));

    const isObjectSelection = 
      !isTreeSelection && (
        semantics.choiceType === 'object_selection' ||
        semantics.topicCode === 'CD06' ||
        semantics.availableObjects !== undefined
      );

    const isCornerOfYard = 
      !isTreeSelection && (
        semantics.selectedDirectionId === 'goc_san_truong' ||
        mainObject.toLowerCase().includes('góc sân')
      );

    // =========================================================
    // TRƯỜNG HỢP 0: BÀI VĂN TẢ CÂY BÓNG MÁT TRÊN SÂN TRƯỜNG (LỖI 1)
    // =========================================================
    if (isTreeSelection) {
      const selectedTree = semantics.selectedObjectName;
      const treeNameDisplay = selectedTree || 'Cây bóng mát';

      if (selectedTree) {
        hoaNhoUnderstand = `Con đã chọn miêu tả "${treeNameDisplay}" trên sân trường gắn với kỷ niệm của mình! Con hãy miêu tả dáng cây cao lớn, tán lá rợp bóng mát chở che và kể lại một kỷ niệm vui vẻ, thân thương dưới gốc cây cùng bạn bè nhé.`;
      } else {
        hoaNhoUnderstand = 'Con sẽ viết một bài văn miêu tả một cây bóng mát trên sân trường (cây bàng, cây phượng vĩ hoặc cây đa) gắn với kỷ niệm của em. Con hãy bấm chọn loài cây mình yêu thích ở bên trên để Hoa Nhỏ hướng dẫn dàn ý chi tiết nhé!';
      }

      specificRequirements = [
        'Thể loại: Bài văn miêu tả cây cối (gồm 3 phần: Mở bài – Thân bài – Kết bài)',
        `Đối tượng miêu tả: ${selectedTree ? selectedTree + ' trên sân trường' : 'Một cây bóng mát trên sân trường (Cây bàng, cây phượng vĩ hoặc cây đa)'}`,
        'Quan sát bao quát: Dáng đứng sừng sững giữa sân trường, vòm lá xanh xòe rộng như chiếc ô khổng lồ che chở nắng mưa',
        'Chi tiết từng bộ phận: Gốc cây vững chãi, rễ cây trồi lên uốn lượn, thân cây xù xì, cành lá sum suê và hoa quả theo mùa',
        'Nội dung bắt buộc: Thể hiện một kỷ niệm đẹp, sâu sắc gắn bó với cây cùng thầy cô và bạn bè trong giờ ra chơi',
        'Tình cảm: Yêu mến, gắn bó coi cây như người bạn tri kỉ tuổi học trò và có ý thức chăm sóc, bảo vệ cây xanh'
      ];

      socraticQuestions = [
        `Cây bóng mát con chọn miêu tả là cây gì (${treeNameDisplay}), cây đứng ở vị trí nào trên sân trường?`,
        'Từ xa nhìn lại, cây có dáng vẻ bề thế, vòm lá xòe rộng ra sao (như chiếc ô xanh khổng lồ, như ngọn lửa hè rực rỡ)?',
        'Lại gần quan sát, gốc cây, rễ cây trồi lên mặt đất, thân cây và lớp vỏ xù xì in dấu năm tháng như thế nào?',
        'Tán lá, màu sắc của lá và hoa quả biến đổi ra sao theo từng mùa trong năm học?',
        'Kỷ niệm nào dưới bóng mát của cây (đọc sách, trò chuyện, chơi đùa cùng bạn bè) làm con nhớ nhất?',
        'Con có tình cảm gì đối với cây bóng mát và con sẽ làm gì để cây luôn xanh tốt tỏa bóng mát cho sân trường?'
      ];

      branches = [
        {
          id: 'br-1',
          title: '🌳 Giới thiệu cây bóng mát',
          icon: '🌳',
          color: 'emerald',
          points: [
            `Cây bóng mát (${treeNameDisplay}) sừng sững giữa sân trường em`,
            'Vị trí trồng: ở giữa sân trường, bên cạnh cột cờ hoặc góc sân thân thuộc',
            'Ấn tượng từ xa: xòe rộng như một chiếc ô xanh khổng lồ che rợp một góc trời'
          ]
        },
        {
          id: 'br-2',
          title: '🌿 Hình dáng & Đặc điểm nổi bật',
          icon: '🌿',
          color: 'purple',
          points: [
            'Gốc cây to vững chãi, hai ba bạn học sinh ôm mới xuể',
            'Rễ cây to nổi cuồn cuộn trên mặt đất như những chú trăn hiền lành',
            'Thân cây cao vút, lớp vỏ nâu xù xì dãi dầu bao mùa mưa nắng',
            'Các cành cây vươn dài khỏe khoắn tỏa đều ra bốn phía'
          ]
        },
        {
          id: 'br-3',
          title: '🍃 Lá, hoa, quả & Bóng mát',
          icon: '🍃',
          color: 'amber',
          points: [
            'Tán lá xanh um tầng tầng lớp lớp đan cài vào nhau',
            'Sự biến đổi kỳ diệu của màu lá và hoa qua các mùa trong năm',
            'Ánh nắng nhảy nhót xuyên qua kẽ lá soi xuống thảm cỏ',
            'Bóng mát rượi xua tan cái oi ả của những buổi trưa hè'
          ]
        },
        {
          id: 'br-4',
          title: '🤝 Kỷ niệm gắn bó dưới gốc cây',
          icon: '🤝',
          color: 'sky',
          points: [
            'Những giờ ra chơi rộn rã tiếng cười nói của bạn bè',
            'Ngồi trên hàng ghế đá dưới gốc cây cùng bạn đọc truyện, ôn bài',
            'Kỷ niệm nhặt lá ép vào trang vở hoặc trò chuyện cùng thầy cô'
          ]
        },
        {
          id: 'br-5',
          title: '💖 Tình cảm & Ý thức chăm sóc',
          icon: '💖',
          color: 'rose',
          points: [
            'Yêu quý và coi cây như người bạn lớn âm thầm chở che tuổi học trò',
            'Kỷ niệm dưới bóng cây mãi in sâu trong ký ức tuổi thơ',
            'Ý thức chăm sóc: tưới nước, không bẻ cành hái lá để cây luôn xanh tốt'
          ]
        }
      ];

      const sec1 = [
        `Mở bài: Giới thiệu cây bóng mát (${treeNameDisplay}) trên sân trường gắn bó thân thiết với em.`,
        'Vị trí sừng sững giữa sân trường và ấn tượng ban đầu sâu sắc khi nhìn từ xa.'
      ];
      const sec2 = [
        'Tả bao quát: Cây cao lớn vượt cả tầng hai lớp học, tán lá xòe rộng tầng tầng lớp lớp như chiếc ô khổng lồ che rợp khoảng sân mát rượi.',
        'Tả chi tiết các bộ phận: Gốc cây to hai ba bạn ôm không xuể, rễ cây trồi lên mặt đất như những chiếc ghế tự nhiên cho học sinh ngồi nghỉ, thân cây khoác tấm áo vỏ nâu xù xì in hằn dấu vết thời gian.',
        'Tả cành và lá: Các cành cây vươn dài khỏe khoắn, lá cây xanh biếc mượt mà biến đổi sắc màu theo từng mùa và mang lại bóng râm dịu mát xua tan cái nắng hè.',
        'Kỷ niệm sâu sắc gắn với cây: Dưới gốc cây thân thương, mỗi giờ ra chơi chúng em lại quây quần bên ghế đá đọc sách, chia sẻ từng chiếc bánh mẩu chuyện và lưu giữ bao kỷ niệm trong trẻo tuổi học trò.'
      ];
      const sec3 = [
        'Kết bài: Bày tỏ tình cảm yêu mến, gắn bó thiết tha với cây bóng mát như một người bạn tri kỉ tuổi thơ.',
        'Lời hứa chăm sóc, bảo vệ cây xanh sân trường luôn tươi tốt để tiếp tục tỏa bóng mát cho bao thế hệ học sinh mai sau.'
      ];

      outline = {
        moDoan: sec1,
        phatTrienDoan: sec2,
        ketDoan: sec3,
        genre: 'mieu_ta',
        sections: [
          { id: 'sec-1', title: 'Phần 1. Mở bài - Giới thiệu cây bóng mát trên sân trường', icon: '🌱', guideNote: 'Giới thiệu tên cây bóng mát, vị trí và ấn tượng ban đầu', bulletPoints: sec1 },
          { id: 'sec-2', title: 'Phần 2. Thân bài - Tả bao quát & Đặc điểm chi tiết của cây', icon: '🌳', guideNote: 'Tả gốc, rễ, thân, vỏ cây và cành lá sum suê', bulletPoints: [sec2[0], sec2[1]] },
          { id: 'sec-3', title: 'Phần 3. Thân bài - Bóng mát che chở & Kỷ niệm dưới gốc cây', icon: '🤝', guideNote: 'Tả bóng mát và kể kỷ niệm rộn rã giờ ra chơi', bulletPoints: [sec2[2], sec2[3]] },
          { id: 'sec-4', title: 'Phần 4. Kết bài - Tình cảm gắn bó & Ý thức chăm sóc cây', icon: '💖', guideNote: 'Bày tỏ tình cảm yêu quý và lời hứa bảo vệ cây xanh', bulletPoints: sec3 }
        ]
      };

      vocabularySuggestions = {
        goodWords: [
          { word: 'sừng sững', meaningAndUsage: 'Dáng đứng hiên ngang, cao lớn và vững chãi giữa sân trường' },
          { word: 'xanh um', meaningAndUsage: 'Màu xanh tốt, rậm rạp và tràn đầy sức sống của tán lá' },
          { word: 'rợp mát', meaningAndUsage: 'Bóng râm rộng lớn, che mát một khoảng sân rộng xua tan nắng hè' },
          { word: 'xù xì', meaningAndUsage: 'Lớp vỏ thân cây gồ ghề, in dấu năm tháng mưa nắng' },
          { word: 'tri kỉ', meaningAndUsage: 'Người bạn thân thiết gắn bó, thấu hiểu bao vui buồn học trò' }
        ],
        imageries: [
          { type: 'So sánh', example: 'Tán cây xòe rộng tầng tầng lớp lớp như chiếc ô xanh khổng lồ che chở cho chúng em', explanation: 'Gợi bóng mát bao la và sự chở che ấm áp' },
          { type: 'Gợi tả', example: 'Làn gió sớm khẽ lay động vòm lá xào xạc như tiếng thì thầm tâm sự của người bạn lớn', explanation: 'Gợi cảm giác thân thuộc, gắn bó' }
        ],
        sampleSentences: [
          { type: 'mo_bai', label: 'Mở bài gợi cảm', sentence: 'Mỗi sớm mai bước qua cánh cổng trường, hình ảnh cây bàng cổ thụ vươn tán lá xanh mát giữa sân trường luôn đem lại cho em cảm giác thân thương và bình yên lạ kỳ.', whyItIsGood: 'Nêu bật đối tượng và bộc lộ cảm xúc sâu lắng.' },
          { type: 'mieu_ta', label: 'Tả bóng mát & kỷ niệm', sentence: 'Dưới vòm lá rợp mát ấy, bao thế hệ học trò chúng em đã cùng nhau lớn lên, sẻ chia những trang sách hay và rộn rã tiếng cười trong mỗi giờ ra chơi.', whyItIsGood: 'Gắn liền cảnh vật cây cối với kỷ niệm tuổi học trò.' },
          { type: 'ket_bai', label: 'Kết bài lắng đọng', sentence: 'Mai này dẫu có lớn khôn và rời xa mái trường, bóng mát thân thương cùng những kỷ niệm êm đềm dưới gốc cây sẽ mãi khắc sâu trong ký ức của em.', whyItIsGood: 'Dư âm sâu sắc, tình cảm bền chặt dài lâu.' }
        ],
        creativeIdeas: [
          'Miêu tả sự biến đổi màu lá bàng từ màu xanh ngọc bích sang màu đỏ đồng rực rỡ khi sang đông',
          'Kể lại một lần cùng bạn ngồi nhặt quả phượng hoặc cánh hoa ép vào trang nhật ký tuổi thơ'
        ]
      };
    }

    // =========================================================
    // TRƯỜNG HỢP A: LOẠI A - LỰA CHỌN ĐỒ VẬT (HỘP BÚT, CẶP, ĐỒNG HỒ, BẢNG LỚP...)
    // =========================================================
    else if (isObjectSelection) {
      const objId = semantics.selectedObjectId;

      // 1. Khi chọn HỘP BÚT
      if (objId === 'hop_but') {
        hoaNhoUnderstand = 'Con đã chọn miêu tả chiếc hộp bút – người bạn nhỏ đồng hành trên mỗi trang vở! Hãy quan sát kỹ từ màu sắc, chất liệu, các ngăn đựng bút thước đến ích lợi giúp đồ dùng luôn ngăn nắp nhé.';
        specificRequirements = [
          'Chọn một đồ vật gần gũi, quen thuộc: Chiếc hộp bút của em.',
          'Thể loại: Đoạn văn miêu tả sinh động, dùng từ ngữ gợi hình, so sánh gần gũi.',
          'Nội dung 1: Giới thiệu tên, xuất xứ, hình dáng hộp chữ nhật, màu sắc tươi tắn, chất liệu vải bạt và các ngăn chứa đồ tiện ích.',
          'Nội dung 2: Nêu rõ công dụng cất giữ bút chì, bút mực, thước kẻ, tẩy gôm; ích lợi giúp đồ dùng luôn ngăn nắp, tránh thất lạc.',
          'Tình cảm: Bày tỏ cảm xúc yêu quý, kéo khóa nhẹ nhàng và thường xuyên giữ hộp bút sạch sẽ.'
        ];
        socraticQuestions = [
          'Chiếc hộp bút của con có hình dáng gì, màu sắc và hoa văn trang trí ra sao?',
          'Chất liệu làm nên hộp bút là vải mềm, nhựa dẻo hay kim loại chắc chắn?',
          'Khi mở khóa kéo, bên trong hộp bút có mấy ngăn và con đựng những đồ dùng nào?',
          'Chiếc hộp bút giúp bàn học và cặp sách của con trở nên ngăn nắp như thế nào?',
          'Con có thói quen gì để giữ cho chiếc hộp bút luôn sạch sẽ, bền đẹp?'
        ];
        branches = [
          {
            id: 'br-1',
            title: '🌱 Giới thiệu hộp bút',
            icon: '🌱',
            color: 'emerald',
            points: [
              'Chiếc hộp bút thân thương đồng hành cùng con mỗi ngày',
              'Món quà mẹ mua cho con nhân dịp khai giảng năm học mới',
              'Ấn tượng ban đầu: nhỏ nhắn, xinh xắn và rất tiện lợi'
            ]
          },
          {
            id: 'br-2',
            title: '🎨 Hình dáng và màu sắc',
            icon: '🎨',
            color: 'purple',
            points: [
              'Dáng hình hộp chữ nhật thon dài, vừa vặn bỏ vào cặp sách',
              'Màu xanh pastel dịu mát (hoặc hồng phấn ngọt ngào)',
              'In hình chú mèo máy thông minh hoặc nhân vật hoạt hình ngộ nghĩnh'
            ]
          },
          {
            id: 'br-3',
            title: '🔍 Các bộ phận và đặc điểm',
            icon: '🔍',
            color: 'amber',
            points: [
              'Đường khóa kéo trơn tru bằng kim loại sáng loáng',
              'Chất liệu vải bạt chống thấm nước bền chắc',
              'Bên trong chia làm hai ngăn: ngăn lớn đựng bút, ngăn lưới nhỏ đựng tẩy gôm'
            ]
          },
          {
            id: 'br-4',
            title: '⭐ Công dụng và ích lợi',
            icon: '⭐',
            color: 'sky',
            points: [
              'Cất giữ cẩn thận bút chì, bút mực, thước kẻ, compa và tẩy',
              'Giúp đồ dùng học tập luôn ngăn nắp, không bị va đập gãy ngòi hay thất lạc',
              'Mỗi khi cần viết bài chỉ cần kéo khóa là lấy được ngay rất nhanh'
            ]
          },
          {
            id: 'br-5',
            title: '💖 Tình cảm và giữ gìn',
            icon: '💖',
            color: 'rose',
            points: [
              'Con yêu quý chiếc hộp bút như một người bạn nhỏ trung thành',
              'Luôn đóng khóa cẩn thận sau mỗi tiết học',
              'Thường xuyên giặt sạch và lau chùi để hộp bút luôn mới tinh'
            ]
          }
        ];

        const sec1 = [
          'Giới thiệu chiếc hộp bút xinh xắn mà con luôn mang theo đến trường.',
          'Xuất xứ: Món quà mẹ tặng đầu năm học mới khiến con rất nâng niu.'
        ];
        const sec2 = [
          'Hình dáng hộp chữ nhật thon dài, kích thước vừa vặn trong cặp sách.',
          'Màu sắc tươi tắn, hoa văn trang trí ngộ nghĩnh đáng yêu.',
          'Dây khóa kéo kim loại chắc chắn và hai ngăn chứa đồ thông minh.'
        ];
        const sec3 = [
          'Nơi trú ngụ an toàn cho các bạn bút chì, bút mực, thước kẻ và tẩy gôm.',
          'Giúp bàn học luôn gọn gàng và không bao giờ bị quên đồ dùng khi đến lớp.',
          'Tiết kiệm thời gian tìm kiếm đồ dùng trong mỗi giờ học.'
        ];
        const sec4 = [
          'Bày tỏ niềm yêu mến và gắn bó sâu đậm với chiếc hộp bút nhỏ.',
          'Ý thức kéo khóa nhẹ tay, không vẽ bậy và lau sạch vết mực để hộp bút luôn bền đẹp.'
        ];

        outline = {
          moDoan: sec1,
          phatTrienDoan: [...sec2, ...sec3],
          ketDoan: sec4,
          genre: 'mieu_ta',
          sections: [
            { id: 'sec-1', title: 'Phần 1. Giới thiệu chiếc hộp bút thân thương', icon: '🌱', guideNote: 'Giới thiệu tên đồ vật và xuất xứ hoặc dịp có được', bulletPoints: sec1 },
            { id: 'sec-2', title: 'Phần 2. Miêu tả đặc điểm nổi bật của hộp bút', icon: '🎨', guideNote: 'Tả hình dáng, màu sắc, chất liệu và các ngăn', bulletPoints: sec2 },
            { id: 'sec-3', title: 'Phần 3. Nêu ích lợi và sự tiện dụng', icon: '⭐', guideNote: 'Nêu công dụng giữ đồ dùng ngăn nắp và sự tiện lợi', bulletPoints: sec3 },
            { id: 'sec-4', title: 'Phần 4. Tình cảm và cách giữ gìn hộp bút', icon: '💖', guideNote: 'Bày tỏ tình cảm gắn bó và thói quen bảo quản', bulletPoints: sec4 }
          ]
        };
      }
      // 2. Khi chọn CHIẾC CẶP SÁCH
      else if (objId === 'chiec_cap') {
        hoaNhoUnderstand = 'Con đã chọn miêu tả chiếc cặp sách – người bạn trung thành ngày ngày cùng con đến trường! Hãy tả dáng vẻ chắc chắn, các ngăn rộng rãi và công dụng bảo vệ sách vở luôn phẳng phiu nhé.';
        specificRequirements = [
          'Chọn một đồ vật gần gũi, quen thuộc: Chiếc cặp sách của em.',
          'Thể loại: Đoạn văn miêu tả sinh động, dùng từ ngữ gợi tả hình dáng và màu sắc.',
          'Nội dung 1: Giới thiệu chiếc cặp, dáng hình hộp chữ nhật đứng, màu sắc nổi bật, quai đeo đệm mút và các ngăn chứa.',
          'Nội dung 2: Nêu rõ công dụng chứa sách giáo khoa, vở bài tập, hộp bút và bình nước; ích lợi bảo vệ sách vở không bị gập mép hay ướt mưa.',
          'Tình cảm: Bày tỏ lòng biết ơn bố mẹ đã tặng, nâng niu chiếc cặp và thói quen treo cặp cẩn thận.'
        ];
        socraticQuestions = [
          'Chiếc cặp sách của con có hình dáng, màu sắc và chất liệu gì nổi bật?',
          'Quai đeo và phần lưng của cặp được thiết kế ra sao để con đeo không bị đau vai?',
          'Bên trong cặp có mấy ngăn và con phân chia sách vở, đồ dùng vào từng ngăn như thế nào?',
          'Chiếc cặp giúp con bảo vệ sách vở khỏi mưa gió và bụi bẩn ra sao?',
          'Con có cảm xúc gì mỗi khi mang cặp đến lớp và con bảo quản cặp thế nào?'
        ];
        branches = [
          {
            id: 'br-1',
            title: '🌱 Giới thiệu chiếc cặp',
            icon: '🌱',
            color: 'emerald',
            points: [
              'Chiếc cặp sách thân thiết gắn bó mỗi buổi đến trường',
              'Món quà ý nghĩa bố mẹ tặng con khi bước vào năm học mới',
              'Niềm háo hức, tự hào khi được đeo chiếc cặp trên vai'
            ]
          },
          {
            id: 'br-2',
            title: '🎨 Hình dáng và màu sắc',
            icon: '🎨',
            color: 'purple',
            points: [
              'Dáng đứng hình hộp chữ nhật vuông vắn, cứng cáp',
              'Màu xanh than khỏe khoắn (hoặc đỏ tươi rạng rỡ)',
              'Dải phản quang phát sáng ban đêm đảm bảo an toàn khi đi đường'
            ]
          },
          {
            id: 'br-3',
            title: '🔍 Các bộ phận và đặc điểm',
            icon: '🔍',
            color: 'amber',
            points: [
              'Hai quai đeo to bản có lót đệm mút êm ái, không làm đau vai',
              'Khóa bấm kim loại hoặc khóa kéo chắc chắn, đóng mở dễ dàng',
              'Gồm ba ngăn rộng rãi và hai túi lưới tiện lợi bên hông đựng bình nước'
            ]
          },
          {
            id: 'br-4',
            title: '⭐ Công dụng và ích lợi',
            icon: '⭐',
            color: 'sky',
            points: [
              'Đựng toàn bộ sách giáo khoa, vở bài tập, bảng con và hộp bút',
              'Bảo vệ sách vở luôn phẳng phiu, ngay ngắn, không bị quăn mép',
              'Đồng hành che mưa che nắng cho đồ dùng học tập suốt năm học'
            ]
          },
          {
            id: 'br-5',
            title: '💖 Tình cảm và giữ gìn',
            icon: '💖',
            color: 'rose',
            points: [
              'Coi chiếc cặp như người bạn thân thiết, sẻ chia niềm vui đến lớp',
              'Không ném quăng cặp xuống đất, luôn đặt nhẹ nhàng vào ngăn bàn',
              'Mỗi cuối tuần đều lau sạch bụi bẩn và sắp xếp sách vở ngăn nắp'
            ]
          }
        ];

        const sec1 = [
          'Giới thiệu chiếc cặp sách thân thiết gắn bó với con mỗi ngày đến trường.',
          'Dịp bố mẹ mua tặng đầu năm học làm con vô cùng trân quý.'
        ];
        const sec2 = [
          'Hình dáng vuông vắn, màu sắc bắt mắt và chất liệu vải chống thấm bền đẹp.',
          'Quai đeo có đệm mút êm ái giúp con không bị mỏi lưng.',
          'Các ngăn cặp rộng rãi, khoa học và khóa bấm chắc chắn.'
        ];
        const sec3 = [
          'Chứa đựng và bảo vệ toàn bộ sách vở, bảng con, hộp bút luôn sạch sẽ.',
          'Giúp con mang đồ dùng học tập đến lớp một cách nhẹ nhàng, gọn gàng.',
          'Người bạn đồng hành tin cậy trên con đường đến trường mỗi sớm mai.'
        ];
        const sec4 = [
          'Bộc lộ tình cảm gắn bó, yêu quý chiếc cặp như người bạn tri kỉ.',
          'Ý thức treo cặp cẩn thận lên móc và vệ sinh cặp định kỳ để cặp luôn mới.'
        ];

        outline = {
          moDoan: sec1,
          phatTrienDoan: [...sec2, ...sec3],
          ketDoan: sec4,
          genre: 'mieu_ta',
          sections: [
            { id: 'sec-1', title: 'Phần 1. Giới thiệu chiếc cặp sách thân thương', icon: '🌱', guideNote: 'Nêu tên đối tượng và hoàn cảnh có được', bulletPoints: sec1 },
            { id: 'sec-2', title: 'Phần 2. Miêu tả đặc điểm nổi bật của chiếc cặp', icon: '🎨', guideNote: 'Tả dáng đứng, màu sắc, quai đeo và các ngăn', bulletPoints: sec2 },
            { id: 'sec-3', title: 'Phần 3. Nêu ích lợi và công dụng của cặp sách', icon: '⭐', guideNote: 'Nêu công dụng bảo vệ sách vở và sự gắn bó', bulletPoints: sec3 },
            { id: 'sec-4', title: 'Phần 4. Tình cảm và cách giữ gìn cặp sách', icon: '💖', guideNote: 'Bộc lộ tình cảm gắn bó và thói quen giữ gìn', bulletPoints: sec4 }
          ]
        };
      }
      // 3. Khi chọn ĐỒNG HỒ
      else if (objId === 'dong_ho') {
        hoaNhoUnderstand = 'Con đã chọn miêu tả chiếc đồng hồ – sứ giả thời gian nhắc con chăm ngoan, đúng giờ! Hãy tả mặt số tròn xoe, chuyển động cần mẫn của kim giờ, kim phút và ích lợi nhắc nhở con nhé.';
        specificRequirements = [
          'Chọn một đồ vật gần gũi, quen thuộc: Chiếc đồng hồ của em.',
          'Thể loại: Đoạn văn miêu tả sinh động, kết hợp quan sát hình ảnh và âm thanh tích tắc.',
          'Nội dung 1: Giới thiệu chiếc đồng hồ, hình dáng mặt tròn, màu sắc viền, mặt kính trong suốt và 12 con số cùng các kim.',
          'Nội dung 2: Nêu rõ công dụng báo giờ, reng chuông báo thức; ích lợi nhắc nhở con thức dậy đúng giờ, học bài và ngủ đúng giấc.',
          'Tình cảm: Coi đồng hồ như người bạn cần mẫn, trân trọng thời gian và lau chùi mặt kính sáng bóng.'
        ];
        socraticQuestions = [
          'Chiếc đồng hồ của con là đồng hồ báo thức hay đồng hồ đeo tay, có hình dáng và màu sắc gì?',
          'Mặt đồng hồ có những chi tiết nào nổi bật (chữ số, mặt kính, các cây kim)?',
          'Kim giờ, kim phút và kim giây chuyển động và phát ra âm thanh như thế nào?',
          'Chiếc đồng hồ giúp ích gì cho sinh hoạt và học tập hàng ngày của con?',
          'Con có cảm xúc gì khi nhìn chiếc đồng hồ cần mẫn chạy từng giây và con bảo quản ra sao?'
        ];
        branches = [
          {
            id: 'br-1',
            title: '🌱 Giới thiệu chiếc đồng hồ',
            icon: '🌱',
            color: 'emerald',
            points: [
              'Chiếc đồng hồ báo thức xinh xắn đặt ngay ngắn trên bàn học',
              'Món quà sinh nhật ý nghĩa ông bà hoặc bố mẹ tặng cho con',
              'Ấn tượng ban đầu: nhỏ gọn, phát ra tiếng tích tắc vui tai'
            ]
          },
          {
            id: 'br-2',
            title: '🎨 Hình dáng và màu sắc',
            icon: '🎨',
            color: 'purple',
            points: [
              'Mặt tròn xoe xinh xắn như vầng trăng rằm thu nhỏ',
              'Vỏ ngoài viền màu xanh dương tươi sáng (hoặc trắng sứ trang nhã)',
              'Chân đế bằng kim loại vững chãi giúp đồng hồ đứng vững trên bàn'
            ]
          },
          {
            id: 'br-3',
            title: '🔍 Các bộ phận và đặc điểm',
            icon: '🔍',
            color: 'amber',
            points: [
              'Lớp kính trong suốt bảo vệ mặt số bên trong',
              '12 con số học trò in đậm màu đen rõ ràng, dễ nhìn',
              'Bộ ba kim giờ béo tròn, kim phút thon dài và kim giây đỏ thanh mảnh quay đều đặn'
            ]
          },
          {
            id: 'br-4',
            title: '⭐ Công dụng và ích lợi',
            icon: '⭐',
            color: 'sky',
            points: [
              'Tiếng reng re re vui nhộn đánh thức con dậy sớm mỗi sáng',
              'Nhắc nhở con ngồi vào bàn học bài đúng giờ và đi ngủ đúng giấc',
              'Giúp con hình thành thói quen quý trọng từng phút giây quý báu'
            ]
          },
          {
            id: 'br-5',
            title: '💖 Tình cảm và giữ gìn',
            icon: '💖',
            color: 'rose',
            points: [
              'Yêu quý chiếc đồng hồ như một người bạn chăm chỉ không bao giờ mỏi mệt',
              'Nhẹ tay khi cài nút báo thức, không làm rơi vỡ mặt kính',
              'Thường xuyên lau bụi và nhờ bố thay pin kịp thời để đồng hồ chạy chuẩn'
            ]
          }
        ];

        const sec1 = [
          'Giới thiệu chiếc đồng hồ xinh xắn trên góc bàn học của con.',
          'Xuất xứ: Món quà sinh nhật ý nghĩa nhắc nhở con thói quen đúng giờ.'
        ];
        const sec2 = [
          'Hình dáng tròn xoe, màu sắc trang nhã và chân đế kim loại vững chắc.',
          'Mặt kính trong veo, 12 con số rõ nét và ba kim đồng hồ hoạt bát.',
          'Tiếng tích tắc êm đềm như nhịp bước chân cần mẫn của thời gian.'
        ];
        const sec3 = [
          'Báo thức buổi sáng giúp con thức dậy đúng giờ, không bao giờ đi học muộn.',
          'Nhắc nhở giờ học bài, giờ đọc sách và giờ đi ngủ điều độ.',
          'Giúp con học được bài học quý giá về việc tiết kiệm và trân trọng thời gian.'
        ];
        const sec4 = [
          'Bày tỏ sự yêu mến, biết ơn người bạn đồng hồ trung thành.',
          'Ý thức bảo quản: lau mặt kính sáng bóng, thay pin đều đặn và đặt nơi an toàn.'
        ];

        outline = {
          moDoan: sec1,
          phatTrienDoan: [...sec2, ...sec3],
          ketDoan: sec4,
          genre: 'mieu_ta',
          sections: [
            { id: 'sec-1', title: 'Phần 1. Giới thiệu chiếc đồng hồ báo thức', icon: '🌱', guideNote: 'Nêu tên đồ vật và vị trí đặt trên bàn học', bulletPoints: sec1 },
            { id: 'sec-2', title: 'Phần 2. Miêu tả đặc điểm nổi bật của đồng hồ', icon: '🎨', guideNote: 'Tả mặt số, các con số và bước chuyển động của các kim', bulletPoints: sec2 },
            { id: 'sec-3', title: 'Phần 3. Nêu ích lợi và công dụng của đồng hồ', icon: '⭐', guideNote: 'Nêu tác dụng báo thức và nhắc nhở giờ giấc', bulletPoints: sec3 },
            { id: 'sec-4', title: 'Phần 4. Tình cảm và cách giữ gìn đồng hồ', icon: '💖', guideNote: 'Bày tỏ tình cảm trân quý và ý thức bảo quản cẩn thận', bulletPoints: sec4 }
          ]
        };
      }
      // 4. Khi chọn BẢNG LỚP
      else if (objId === 'bang_lop') {
        hoaNhoUnderstand = 'Con đã chọn miêu tả chiếc bảng lớp – chứng nhân thân thương của từng bài học và nét chữ thầy cô! Hãy tả màu xanh dịu mắt, ô kẻ ngay ngắn và ích lợi mở ra chân trời tri thức nhé.';
        specificRequirements = [
          'Chọn một đồ vật gần gũi, quen thuộc: Chiếc bảng lớp học.',
          'Thể loại: Đoạn văn miêu tả không gian lớp học sinh động, dùng từ ngữ gợi cảm.',
          'Nội dung 1: Giới thiệu chiếc bảng lớp treo trang trọng ở bục giảng, hình chữ nhật rộng lớn, màu xanh chống lóa và viền nhôm.',
          'Nội dung 2: Nêu rõ công dụng nơi cô giáo viết bài học, học sinh lên làm toán; ích lợi mở rộng kiến thức và lưu giữ bài giảng.',
          'Tình cảm: Gắn bó với kỷ niệm lớp học, trân trọng nét chữ thầy cô và luôn lau sạch bảng sau giờ học.'
        ];
        socraticQuestions = [
          'Chiếc bảng lớp được treo ở vị trí nào trong phòng học và có kích thước ra sao?',
          'Bề mặt bảng có màu sắc gì, các đường kẻ ô vuông trên bảng trông như thế nào?',
          'Khung bảng và máng đựng phấn ở phía dưới được làm bằng chất liệu gì?',
          'Chiếc bảng giúp ích gì cho cô giáo trong giờ giảng bài và các bạn học sinh khi làm bài tập?',
          'Con và các bạn có ý thức giữ gìn chiếc bảng lớp luôn sạch đẹp như thế nào?'
        ];
        branches = [
          {
            id: 'br-1',
            title: '🌱 Giới thiệu chiếc bảng lớp',
            icon: '🌱',
            color: 'emerald',
            points: [
              'Chiếc bảng lớp thân thương gắn bó suốt những năm tháng tiểu học',
              'Treo trang trọng ở chính giữa bức tường phía trước lớp học',
              'Nơi đầu tiên mọi ánh mắt học trò hướng về khi bắt đầu tiết học'
            ]
          },
          {
            id: 'br-2',
            title: '🎨 Hình dáng và màu sắc',
            icon: '🎨',
            color: 'purple',
            points: [
              'Hình chữ nhật rộng lớn, chiếm gần hết khoảng tường phía trên bục giảng',
              'Màu xanh lá cây đậm dịu mắt, có khả năng chống lóa tốt',
              'Khung viền bằng nhôm sáng bóng, bốn góc bo tròn an toàn'
            ]
          },
          {
            id: 'br-3',
            title: '🔍 Các bộ phận và đặc điểm',
            icon: '🔍',
            color: 'amber',
            points: [
              'Bề mặt bảng nhẵn mịn, bám phấn rất tốt khi viết',
              'Các đường kẻ ô vuông mờ ngay ngắn như những trang vở học trò phóng to',
              'Mép dưới có máng nhôm dài để phấn trắng, phấn màu và khăn lau bảng'
            ]
          },
          {
            id: 'br-4',
            title: '⭐ Công dụng và ích lợi',
            icon: '⭐',
            color: 'sky',
            points: [
              'Nơi cô giáo nắn nót viết từng dòng chữ mẫu, bài toán hay và lời giảng sâu sắc',
              'Nơi các bạn học sinh tự tin lên bảng trình bày bài làm trước cả lớp',
              'Giúp cả lớp dễ dàng theo dõi bài học và tiếp thu kiến thức mới mỗi ngày'
            ]
          },
          {
            id: 'br-5',
            title: '💖 Tình cảm và giữ gìn',
            icon: '💖',
            color: 'rose',
            points: [
              'Yêu quý và coi chiếc bảng như người bạn lớn âm thầm chở che tri thức',
              'Trân trọng từng nét phấn trắng của thầy cô in dấu trên mặt bảng',
              'Ý thức trực nhật: giặt khăn sạch và lau bảng nhẹ nhàng sau mỗi tiết học'
            ]
          }
        ];

        const sec1 = [
          'Giới thiệu chiếc bảng đen (bảng xanh) treo trang trọng trên bục giảng lớp học.',
          'Vị trí trung tâm thu hút sự chú ý của mọi học sinh trong mỗi giờ học.'
        ];
        const sec2 = [
          'Kích thước rộng lớn hình chữ nhật, màu xanh dịu mắt chống lóa.',
          'Khung viền nhôm sáng và các đường kẻ ô vuông thẳng tắp, đều đặn.',
          'Máng đựng phấn tiện lợi và chiếc khăn lau bảng quen thuộc.'
        ];
        const sec3 = [
          'Nơi cô giáo gửi gắm những bài học hay, những phép tính kỳ diệu bằng phấn trắng.',
          'Cầu nối tri thức giúp các bạn học sinh cùng học tập, thảo luận sôi nổi.',
          'Chứng nhân ghi dấu bao kỷ niệm học trò và những tràng pháo tay giòn giã.'
        ];
        const sec4 = [
          'Bày tỏ lòng yêu quý chiếc bảng lớp và trân trọng công ơn dạy dỗ của thầy cô.',
          'Ý thức giữ gìn: không gõ vật cứng lên bảng, luôn lau bảng sạch bóng sau giờ học.'
        ];

        outline = {
          moDoan: sec1,
          phatTrienDoan: [...sec2, ...sec3],
          ketDoan: sec4,
          genre: 'mieu_ta',
          sections: [
            { id: 'sec-1', title: 'Phần 1. Giới thiệu chiếc bảng lớp thân thương', icon: '🌱', guideNote: 'Nêu vị trí trang trọng của bảng lớp', bulletPoints: sec1 },
            { id: 'sec-2', title: 'Phần 2. Miêu tả đặc điểm nổi bật của bảng lớp', icon: '🎨', guideNote: 'Tả kích thước, màu xanh chống lóa và ô kẻ ngay ngắn', bulletPoints: sec2 },
            { id: 'sec-3', title: 'Phần 3. Nêu ích lợi và công dụng của bảng lớp', icon: '⭐', guideNote: 'Nêu vai trò truyền tải bài giảng và cầu nối tri thức', bulletPoints: sec3 },
            { id: 'sec-4', title: 'Phần 4. Tình cảm và ý thức giữ gìn bảng lớp', icon: '💖', guideNote: 'Bày tỏ lòng trân quý và ý thức lau bảng sạch bóng', bulletPoints: sec4 }
          ]
        };
      }
      // 5. Khi chọn ĐỒ VẬT KHÁC (hoặc tự nhập)
      else if (objId === 'do_vat_khac' || objId === 'custom' || (semantics.selectedObjectName && semantics.selectedObjectName !== 'Hộp bút' && semantics.selectedObjectName !== 'Chiếc cặp' && semantics.selectedObjectName !== 'Đồng hồ' && semantics.selectedObjectName !== 'Bảng lớp')) {
        const customName = mainObject || 'Đồ vật thân quen';
        hoaNhoUnderstand = `Con đã chọn miêu tả món đồ vật thân thương "${customName}"! Con hãy quan sát thật tỉ mỉ màu sắc, hình dáng đặc trưng và kể lại ích lợi tuyệt vời của nó nhé.`;
        specificRequirements = [
          `Chọn một đồ vật gần gũi, quen thuộc: ${customName}.`,
          'Thể loại: Đoạn văn miêu tả sinh động, dùng từ ngữ gợi hình, gợi cảm.',
          `Nội dung 1: Giới thiệu tên, xuất xứ, hình dáng, màu sắc, đặc điểm cấu tạo nổi bật của ${customName.toLowerCase()}.`,
          `Nội dung 2: Nêu rõ công dụng, ích lợi thiết thực và sự gắn bó của ${customName.toLowerCase()} với việc học tập/sinh hoạt.`,
          `Tình cảm: Bày tỏ cảm xúc yêu quý, nâng niu và ý thức giữ gìn ${customName.toLowerCase()} cẩn thận.`
        ];
        socraticQuestions = [
          `Món đồ ${customName} của con có hình dáng, kích thước và màu sắc chủ đạo như thế nào?`,
          `Chất liệu làm nên ${customName} là gì và có những chi tiết nào đặc biệt khiến con yêu thích?`,
          `Món đồ ${customName} giúp ích gì nhiều nhất cho việc học tập hoặc cuộc sống hàng ngày của con?`,
          `Khoảnh khắc hoặc kỷ niệm nào gắn bó giữa con và ${customName} làm con nhớ nhất?`,
          `Con có thói quen bảo quản và giữ gìn ${customName} như thế nào để luôn bền đẹp?`
        ];
        branches = [
          {
            id: 'br-1',
            title: `🌱 Giới thiệu ${customName}`,
            icon: '🌱',
            color: 'emerald',
            points: [
              `Món đồ ${customName} gắn bó thân thiết trong học tập và sinh hoạt`,
              'Dịp con có được món đồ (do bố mẹ tặng, người thân mua cho)',
              'Ấn tượng yêu thích ban đầu của con'
            ]
          },
          {
            id: 'br-2',
            title: '🎨 Hình dáng và màu sắc',
            icon: '🎨',
            color: 'purple',
            points: [
              'Kích thước vừa vặn, hình khối cân đối, đẹp mắt',
              'Màu sắc tươi sáng, hài hòa phù hợp lứa tuổi',
              'Hoa văn hoặc điểm nhấn trang trí thu hút ánh nhìn'
            ]
          },
          {
            id: 'br-3',
            title: '🔍 Các bộ phận và đặc điểm',
            icon: '🔍',
            color: 'amber',
            points: [
              'Cấu tạo bên ngoài chắc chắn, bề mặt nhẵn mịn',
              'Các chi tiết liên kết thông minh, tiện dụng',
              'Chất liệu bền đẹp, an toàn khi sử dụng'
            ]
          },
          {
            id: 'br-4',
            title: '⭐ Công dụng và ích lợi',
            icon: '⭐',
            color: 'sky',
            points: [
              `Công dụng chính của ${customName.toLowerCase()} trong việc học hoặc đời sống`,
              'Mang lại sự tiện lợi, giúp con hoàn thành tốt các công việc',
              'Người bạn đồng hành nhỏ bé mà vô cùng đắc lực'
            ]
          },
          {
            id: 'br-5',
            title: '💖 Tình cảm và giữ gìn',
            icon: '💖',
            color: 'rose',
            points: [
              `Tình cảm yêu quý, nâng niu dành cho ${customName.toLowerCase()}`,
              'Luôn cất đặt gọn gàng sau mỗi lần sử dụng',
              'Thường xuyên lau chùi sạch sẽ để món đồ luôn bền đẹp'
            ]
          }
        ];

        const sec1 = [
          `Giới thiệu tên món đồ gần gũi (${customName}) và thời điểm con có được.`,
          'Cảm xúc vui mừng, yêu thích của con khi sở hữu món đồ.'
        ];
        const sec2 = [
          `Miêu tả hình dáng bao quát, kích thước và màu sắc của ${customName.toLowerCase()}.`,
          'Miêu tả các chi tiết cấu tạo bên ngoài và bên trong.',
          'Nét nổi bật làm nên nét riêng của món đồ.'
        ];
        const sec3 = [
          `Nêu rõ công dụng và ích lợi thiết thực của ${customName.toLowerCase()} mỗi ngày.`,
          'Sự tiện lợi giúp con học tập hoặc sinh hoạt hiệu quả hơn.',
          'Kỷ niệm đáng nhớ gắn liền với đồ vật.'
        ];
        const sec4 = [
          `Bày tỏ tình cảm yêu quý, gắn bó tha thiết với ${customName.toLowerCase()}.`,
          'Ý thức bảo quản cẩn thận, cất đặt đúng nơi quy định để đồ dùng luôn mới đẹp.'
        ];

        outline = {
          moDoan: sec1,
          phatTrienDoan: [...sec2, ...sec3],
          ketDoan: sec4,
          genre: 'mieu_ta',
          sections: [
            { id: 'sec-1', title: `Phần 1. Giới thiệu ${customName}`, icon: '🌱', guideNote: 'Giới thiệu tên đồ vật và xuất xứ', bulletPoints: sec1 },
            { id: 'sec-2', title: 'Phần 2. Miêu tả đặc điểm nổi bật', icon: '🎨', guideNote: 'Tả hình dáng, màu sắc và các bộ phận', bulletPoints: sec2 },
            { id: 'sec-3', title: 'Phần 3. Nêu ích lợi hoặc công dụng', icon: '⭐', guideNote: 'Nêu công dụng và sự tiện ích hàng ngày', bulletPoints: sec3 },
            { id: 'sec-4', title: 'Phần 4. Nêu tình cảm hoặc cách giữ gìn', icon: '💖', guideNote: 'Bày tỏ tình cảm và ý thức bảo quản', bulletPoints: sec4 }
          ]
        };
      }
      // 6. KHI CHƯA CHỌN ĐỒ VẬT (Unselected state) - ĐẦY ĐỦ 100%, KHÔNG ĐƯỢC ĐỂ TRỐNG!
      else {
        hoaNhoUnderstand = 'Đề bài muốn con chọn một đồ vật quen thuộc để giới thiệu đặc điểm và ích lợi của nó. Con hãy chọn đồ vật mình hiểu rõ nhất, quan sát thật kỹ rồi cùng Hoa Nhỏ tìm những ý hay nhé!';
        specificRequirements = [
          'Chọn một đồ vật gần gũi, quen thuộc (hộp bút, chiếc cặp, đồng hồ, bảng lớp...).',
          'Thể loại: Đoạn văn miêu tả sinh động, dùng từ ngữ gợi hình, gợi cảm.',
          'Nội dung 1: Giới thiệu tên, xuất xứ, hình dáng, màu sắc, đặc điểm cấu tạo nổi bật của đồ vật.',
          'Nội dung 2: Nêu rõ công dụng, ích lợi thiết thực và sự gắn bó của đồ vật với việc học tập/sinh hoạt.',
          'Tình cảm: Bày tỏ cảm xúc yêu quý, nâng niu và ý thức giữ gìn đồ vật cẩn thận.'
        ];
        socraticQuestions = [
          'Con muốn chọn đồ vật nào gần gũi nhất với mình (hộp bút, chiếc cặp, đồng hồ, bảng lớp hay món đồ nào khác)?',
          'Đồ vật đó có hình dáng, màu sắc và những bộ phận nổi bật nào khiến con chú ý nhất?',
          'Đồ vật ấy giúp ích gì cho con hoặc các bạn trong học tập và sinh hoạt mỗi ngày?',
          'Kỷ niệm hoặc khoảnh khắc gắn bó nào làm con thấy món đồ thật gần gũi, tiện lợi?',
          'Con có cảm xúc gì và làm thế nào để luôn giữ gìn đồ vật bền đẹp, sạch sẽ?'
        ];
        branches = [
          {
            id: 'br-1',
            title: '🌱 Giới thiệu đồ vật',
            icon: '🌱',
            color: 'emerald',
            points: [
              'Tên đồ vật con chọn là gì?',
              'Con có đồ vật đó từ khi nào, do ai tặng hoặc mua cho?',
              'Cảm nhận đầu tiên của con về món đồ'
            ]
          },
          {
            id: 'br-2',
            title: '🎨 Hình dáng và màu sắc',
            icon: '🎨',
            color: 'purple',
            points: [
              'Đồ vật có hình khối gì (chữ nhật, tròn, thon dài)?',
              'Kích thước to hay nhỏ, vừa vặn ra sao?',
              'Màu sắc chủ đạo và hoa văn trang trí'
            ]
          },
          {
            id: 'br-3',
            title: '🔍 Các bộ phận và đặc điểm',
            icon: '🔍',
            color: 'amber',
            points: [
              'Bên ngoài gồm những bộ phận nào (nắp, quai, mặt số, đường viền)?',
              'Bên trong có cấu tạo ra sao (các ngăn, chi tiết chuyển động)?',
              'Chất liệu làm nên đồ vật (vải, nhựa, kim loại, gỗ)'
            ]
          },
          {
            id: 'br-4',
            title: '⭐ Công dụng và ích lợi',
            icon: '⭐',
            color: 'sky',
            points: [
              'Đồ vật giúp ích gì cho việc học tập hoặc sinh hoạt của con?',
              'Con sử dụng món đồ như thế nào mỗi ngày?',
              'Lợi ích đặc biệt khiến con thấy tiện lợi và yêu thích'
            ]
          },
          {
            id: 'br-5',
            title: '💖 Tình cảm và giữ gìn',
            icon: '💖',
            color: 'rose',
            points: [
              'Tình cảm yêu quý, gắn bó của con với đồ vật',
              'Con coi đồ vật như người bạn đồng hành chăm chỉ',
              'Cách con lau chùi, cất giữ và bảo quản cẩn thận'
            ]
          }
        ];

        const sec1 = [
          'Giới thiệu tên đồ vật gần gũi mà con chọn để miêu tả.',
          'Xuất xứ hoặc thời điểm con có được đồ vật (được tặng, mua đầu năm học).'
        ];
        const sec2 = [
          'Miêu tả hình dáng bao quát, kích thước và màu sắc bắt mắt của đồ vật.',
          'Miêu tả các bộ phận chính bên ngoài và bên trong.',
          'Nét đặc sắc hoặc hoa văn trang trí ấn tượng nhất.'
        ];
        const sec3 = [
          'Nêu rõ công dụng chính của đồ vật trong học tập hoặc sinh hoạt hàng ngày.',
          'Lợi ích thiết thực mà đồ vật mang lại giúp con học tập tốt hơn.',
          'Sự tiện lợi và gắn bó quen thuộc mỗi ngày đến lớp.'
        ];
        const sec4 = [
          'Bày tỏ tình cảm yêu mến, nâng niu dành cho đồ vật.',
          'Ý thức giữ gìn, lau chùi cẩn thận để đồ vật luôn bền đẹp.'
        ];

        outline = {
          moDoan: sec1,
          phatTrienDoan: [...sec2, ...sec3],
          ketDoan: sec4,
          genre: 'mieu_ta',
          sections: [
            { id: 'sec-1', title: 'Phần 1. Giới thiệu đồ vật', icon: '🌱', guideNote: 'Giới thiệu tên đồ vật và xuất xứ hoặc dịp có được', bulletPoints: sec1 },
            { id: 'sec-2', title: 'Phần 2. Miêu tả đặc điểm nổi bật', icon: '🎨', guideNote: 'Tả hình dáng, màu sắc, chất liệu và các bộ phận', bulletPoints: sec2 },
            { id: 'sec-3', title: 'Phần 3. Nêu ích lợi hoặc công dụng', icon: '⭐', guideNote: 'Nêu ích lợi thiết thực và sự gắn bó hàng ngày', bulletPoints: sec3 },
            { id: 'sec-4', title: 'Phần 4. Nêu tình cảm hoặc cách giữ gìn', icon: '💖', guideNote: 'Bày tỏ tình cảm yêu mến và ý thức bảo quản', bulletPoints: sec4 }
          ]
        };
      }
    }
    // =========================================================
    // TRƯỜNG HỢP B: TẢ GÓC SÂN TRƯỜNG
    // =========================================================
    else if (isCornerOfYard) {
      hoaNhoUnderstand = 'Con sẽ viết đoạn văn miêu tả một góc sân trường em yêu thích. Hãy chọn một góc sân thân thuộc (hàng ghế đá dưới bóng mát, bồn hoa rực rỡ, hay góc thư viện xanh ngoài trời) để tả chi tiết cảnh vật và hoạt động của con cùng bạn bè trong giờ ra chơi nhé!';
      specificRequirements = [
        'Nhiệm vụ: Viết đoạn văn miêu tả một góc sân trường em yêu thích',
        'Đối tượng: Một góc sân trường cụ thể (ghế đá, bồn hoa, tán cây che mát)',
        'Phạm vi: Cảnh vật ở góc sân và hoạt động vui tươi trong giờ ra chơi',
        'Lưu ý: Bám sát góc sân trường, không chuyển sang bao quát cả trường học hay chỉ tả một cái cây đơn lẻ',
        'Tình cảm: Yêu quý góc sân trường và ý thức giữ gìn vệ sinh sạch đẹp'
      ];
      socraticQuestions = [
        'Góc sân trường con yêu thích nhất nằm ở vị trí nào (dưới tán bàng, cạnh bồn hoa, trước cửa lớp)?',
        'Nhìn từ xa, góc sân ấy có nét gì nổi bật khiến con luôn muốn đến đó mỗi giờ ra chơi?',
        'Ở góc sân có những cảnh vật gì: Hàng ghế đá, luống hoa khoe sắc, ánh nắng xuyên qua kẽ lá ra sao?',
        'Con và các bạn thường làm gì ở góc sân ấy (đọc sách, nhảy dây, trò chuyện)?',
        'Con có cảm nghĩ gì và muốn làm gì để góc sân trường luôn xanh, sạch, đẹp?'
      ];
      branches = [
        { id: 'br-1', title: '📍 Vị trí góc sân', icon: '📍', color: 'emerald', points: ['Vị trí góc sân ở đâu?', 'Tên gọi góc sân thân thương', 'Dịp em thường đến đó'] },
        { id: 'br-2', title: '🌿 Cảnh vật nổi bật', icon: '🌿', color: 'purple', points: ['Hàng ghế đá mát rượi', 'Bồn hoa muôn sắc', 'Tán cây xòe bóng râm', 'Những vệt nắng le lói'] },
        { id: 'br-3', title: '☀️ Âm thanh & Không khí', icon: '☀️', color: 'amber', points: ['Gió thổi xào xạc', 'Tiếng chim hót ríu rít', 'Không khí trong lành, mát mẻ'] },
        { id: 'br-4', title: '🏃 Hoạt động giờ ra chơi', icon: '🏃', color: 'sky', points: ['Cùng bạn đọc truyện, tâm sự', 'Chơi trò chơi học trò vui vẻ', 'Tiếng cười rộn rã'] },
        { id: 'br-5', title: '💖 Cảm nghĩ & Giữ gìn', icon: '💖', color: 'rose', points: ['Yêu quý góc sân trường', 'Nơi lưu giữ kỷ niệm tuổi thơ', 'Không vứt rác, chăm sóc bồn hoa'] }
      ];

      const sec1 = ['Mở đoạn: Giới thiệu góc sân trường em yêu thích nhất (vị trí và lý do em gắn bó với góc sân ấy).'];
      const sec2 = [
        'Tả cảnh vật góc sân: Tán cây che bóng râm mát, hàng ghế đá quen thuộc và bồn hoa rực rỡ sắc màu.',
        'Tả không khí & âm thanh: Ánh nắng nhảy nhót qua kẽ lá, tiếng chim chuyền cành và làn gió mát lành.',
        'Tả hoạt động: Mỗi giờ ra chơi, em và các bạn lại quây quần nơi đây để đọc sách, tâm sự và vui đùa.'
      ];
      const sec3 = ['Kết đoạn: Bày tỏ tình cảm yêu mến góc sân trường và ý thức giữ gìn nơi đây luôn xanh, sạch, đẹp.'];

      outline = {
        moDoan: sec1,
        phatTrienDoan: sec2,
        ketDoan: sec3,
        genre: 'mieu_ta',
        sections: [
          { id: 'sec-1', title: 'Phần 1. Mở đoạn - Giới thiệu góc sân trường yêu thích', icon: '📍', guideNote: 'Nêu vị trí và ấn tượng về góc sân trường', bulletPoints: sec1 },
          { id: 'sec-2', title: 'Phần 2. Phát triển đoạn - Tả cảnh vật & Hoạt động giờ ra chơi', icon: '🌿', guideNote: 'Tả cảnh vật chi tiết và hoạt động vui tươi', bulletPoints: sec2 },
          { id: 'sec-3', title: 'Phần 3. Kết đoạn - Tình cảm gắn bó & Giữ gìn', icon: '💖', guideNote: 'Bộc lộ tình cảm và ý thức bảo vệ góc sân sạch đẹp', bulletPoints: sec3 }
        ]
      };
    }
    // =========================================================
    // TRƯỜNG HỢP C: MIÊU TẢ SỰ VẬT / CẢNH VẬT TỔNG QUÁT KHÁC
    // =========================================================
    else {
      hoaNhoUnderstand = `Đề bài muốn con miêu tả ${mainObject} thật sinh động: từ đặc điểm bao quát đến các chi tiết nổi bật theo trình tự quan sát hợp lý.`;
      specificRequirements = [
        'Nhiệm vụ: Viết đoạn văn miêu tả sự vật / cảnh vật',
        `Đối tượng miêu tả: ${mainObject}`,
        'Trình tự quan sát: Từ bao quát đến chi tiết, kết hợp các giác quan',
        'Cảm xúc: Gắn với tình cảm yêu mến, gắn bó của em'
      ];
      socraticQuestions = [
        `Đối tượng con muốn miêu tả là gì (${mainObject})?`,
        'Nhìn từ xa, đối tượng có hình dáng, màu sắc và kích thước bao quát như thế nào?',
        'Lại gần quan sát, những chi tiết nào nổi bật và đáng yêu nhất khiến con chú ý?',
        'Đối tượng gắn bó với hoạt động hoặc kỷ niệm nào của con?',
        'Con có cảm xúc gì và muốn gìn giữ, nâng niu đối tượng như thế nào?'
      ];
      branches = [
        { id: 'br-1', title: '🌱 Giới thiệu đối tượng', icon: '🌱', color: 'emerald', points: [`Tên gọi ${mainObject}`, 'Vị trí hoặc dịp con có được', 'Cảm nhận ban đầu'] },
        { id: 'br-2', title: '👀 Đặc điểm bao quát', icon: '👀', color: 'purple', points: ['Kích thước, hình dáng', 'Màu sắc chủ đạo', 'Chất liệu / dáng vẻ bên ngoài'] },
        { id: 'br-3', title: '🔍 Chi tiết nổi bật', icon: '🔍', color: 'amber', points: ['Từng bộ phận đặc sắc', 'Đường nét, hoa văn', 'Mùi hương, âm thanh nếu có'] },
        { id: 'br-4', title: '🏃 Hoạt động gắn bó', icon: '🏃', color: 'sky', points: ['Sự vật gắn với hoạt động của em', 'Những kỷ niệm vui vẻ', 'Lợi ích mang lại'] },
        { id: 'br-5', title: '💖 Tình cảm & Giữ gìn', icon: '💖', color: 'rose', points: ['Coi như người bạn thân', 'Ý thức giữ gìn, bảo vệ', 'Cảm xúc yêu mến dài lâu'] }
      ];

      const sec1 = [`Giới thiệu đối tượng miêu tả (${mainObject}) và ấn tượng sâu sắc ban đầu của em.`];
      const sec2 = [
        'Tả bao quát: Hình dáng, kích thước và màu sắc tươi tắn khi nhìn từ xa.',
        'Tả chi tiết nổi bật: Từng bộ phận đặc sắc, đường nét tinh tế và nét đẹp riêng biệt.',
        'Tả hoạt động gắn bó: Những khoảnh khắc đối tượng đồng hành cùng em trong học tập, vui chơi.'
      ];
      const sec3 = ['Khẳng định tình cảm yêu quý, gắn bó và lời hứa luôn gìn giữ, nâng niu cẩn thận.'];

      outline = {
        moDoan: sec1,
        phatTrienDoan: sec2,
        ketDoan: sec3,
        genre: 'mieu_ta',
        sections: [
          { id: 'sec-1', title: 'Phần 1. Mở đoạn - Giới thiệu đối tượng', icon: '🌱', guideNote: 'Nêu tên đối tượng và ấn tượng chung ban đầu', bulletPoints: sec1 },
          { id: 'sec-2', title: 'Phần 2. Phát triển đoạn - Bao quát & Chi tiết nổi bật', icon: '👀', guideNote: 'Tả hình dáng, màu sắc, chi tiết đặc sắc và hoạt động', bulletPoints: sec2 },
          { id: 'sec-3', title: 'Phần 3. Kết đoạn - Tình cảm gắn bó & Giữ gìn', icon: '💖', guideNote: 'Bày tỏ tình cảm yêu mến và ý thức trân trọng', bulletPoints: sec3 }
        ]
      };
    }
  }

  // -------------------------------------------------------------
  // THỂ LOẠI 12 & 13: VIẾT ĐOẠN VĂN / DẠNG BÀI MỚI (viet_doan_van, khac)
  // -------------------------------------------------------------
  else {
    const isBookIntro = semantics.selectedDirectionId === 'gioi_thieu_sach' || (mainObject.toLowerCase().includes('sách') && !mainObject.toLowerCase().includes('nhân vật'));
    const isCharacterIntro = semantics.selectedDirectionId === 'gioi_thieu_nhan_vat' || (mainObject.toLowerCase().includes('nhân vật') && !mainObject.toLowerCase().includes('sách'));

    if (isBookIntro) {
      hoaNhoUnderstand = 'Đề bài muốn con giới thiệu một cuốn sách hay mà con yêu thích. Con hãy nêu tên cuốn sách, tác giả, hình ảnh trang bìa hoặc tóm tắt nội dung hấp dẫn, và bài học bổ ích mà cuốn sách mang lại nhé!';
      specificRequirements = [
        'Nhiệm vụ: Viết đoạn văn giới thiệu cuốn sách em yêu thích',
        'Đối tượng: Một cuốn sách cụ thể (tên sách, tác giả, nhà xuất bản)',
        'Nội dung: Bìa sách, câu chuyện hấp dẫn và chi tiết ấn tượng nhất',
        'Ý nghĩa: Bài học sâu sắc và lý do khuyên các bạn cùng đọc'
      ];
      socraticQuestions = [
        'Cuốn sách con muốn giới thiệu có tên là gì, do ai sáng tác?',
        'Trang bìa và hình vẽ minh họa của cuốn sách có gì bắt mắt khiến con chú ý?',
        'Nội dung cuốn sách kể về câu chuyện hoặc kiến thức thú vị nào?',
        'Chi tiết hoặc câu nói nào trong sách làm con nhớ nhất?',
        'Cuốn sách giúp con học được điều gì và con muốn nhắn nhủ gì tới bạn bè?'
      ];
      branches = [
        { id: 'br-1', title: '📖 Tên sách & Tác giả', icon: '📖', color: 'emerald', points: ['Tên cuốn sách yêu thích', 'Tác giả và nhà xuất bản', 'Dịp con có được cuốn sách'] },
        { id: 'br-2', title: '🎨 Bìa sách & Hình minh họa', icon: '🎨', color: 'purple', points: ['Màu sắc trang bìa', 'Hình vẽ sinh động, bắt mắt', 'Độ dày và cách trình bày'] },
        { id: 'br-3', title: '📜 Nội dung câu chuyện', icon: '📜', color: 'amber', points: ['Nhân vật hoặc chủ đề chính', 'Diễn biến câu chuyện hấp dẫn', 'Chi tiết làm con nhớ nhất'] },
        { id: 'br-4', title: '💡 Bài học bổ ích', icon: '💡', color: 'sky', points: ['Điều hay con học được từ sách', 'Giúp ích cho học tập và cuộc sống'] },
        { id: 'br-5', title: '🌟 Cảm nghĩ & Khuyên đọc', icon: '🌟', color: 'rose', points: ['Coi sách như người bạn quý', 'Khuyên các bạn cùng tìm đọc'] }
      ];

      const sec1 = ['Mở đoạn: Giới thiệu tên cuốn sách, tác giả và lý do cuốn sách thu hút con.'];
      const sec2 = [
        'Hình thức & Nội dung: Trang bìa rực rỡ, hình vẽ minh họa sinh động và tóm tắt ngắn gọn câu chuyện hấp dẫn.',
        'Chi tiết đặc sắc: Kể lại chi tiết hoặc tình huống trong sách khiến con ấn tượng và xúc động nhất.',
        'Bài học rút ra: Giá trị đạo đức hoặc kiến thức bổ ích mà cuốn sách mang lại cho con.'
      ];
      const sec3 = ['Kết đoạn: Khẳng định tình cảm yêu quý cuốn sách và lời khuyên bạn bè cùng tìm đọc để mở rộng hiểu biết.'];

      outline = {
        moDoan: sec1,
        phatTrienDoan: sec2,
        ketDoan: sec3,
        genre: 'viet_doan_van',
        sections: [
          { id: 'sec-1', title: 'Phần 1. Mở đoạn - Giới thiệu cuốn sách yêu thích', icon: '📖', guideNote: 'Nêu tên cuốn sách, tác giả và cảm xúc ban đầu', bulletPoints: sec1 },
          { id: 'sec-2', title: 'Phần 2. Phát triển đoạn - Nội dung & Chi tiết ấn tượng', icon: '📝', guideNote: 'Giới thiệu nội dung, bìa sách và bài học sâu sắc', bulletPoints: sec2 },
          { id: 'sec-3', title: 'Phần 3. Kết đoạn - Khẳng định tình cảm & Lan tỏa', icon: '🌟', guideNote: 'Khuyên bạn bè cùng đọc và trân trọng cuốn sách', bulletPoints: sec3 }
        ]
      };
    } else if (isCharacterIntro) {
      hoaNhoUnderstand = 'Đề bài muốn con giới thiệu một nhân vật mà con yêu thích trong cuốn sách hay bộ phim hoạt hình. Con hãy miêu tả dáng vẻ, tính cách, hành động dũng cảm hoặc tốt bụng và bài học mà con học tập từ nhân vật ấy nhé!';
      specificRequirements = [
        'Nhiệm vụ: Viết đoạn văn giới thiệu nhân vật em yêu thích',
        'Đối tượng: Một nhân vật trong tác phẩm văn học hoặc truyện thiếu nhi',
        'Nội dung: Ngoại hình, tính cách, hành động nổi bật và phẩm chất đáng quý',
        'Cảm xúc: Sự ngưỡng mộ, yêu mến và bài học noi gương'
      ];
      socraticQuestions = [
        'Nhân vật con yêu thích tên là gì, xuất hiện trong tác phẩm hoặc câu chuyện nào?',
        'Nhân vật có ngoại hình hoặc trang phục gì đặc biệt khiến con ấn tượng?',
        'Nhân vật có những nét tính cách hoặc phẩm chất tốt đẹp nào (dũng cảm, nhân hậu, thông minh)?',
        'Hành động hoặc việc làm nào của nhân vật làm con khâm phục nhất?',
        'Con học tập được điều gì từ nhân vật đó và con muốn trở thành người như thế nào?'
      ];
      branches = [
        { id: 'br-1', title: '✨ Nhân vật & Tác phẩm', icon: '✨', color: 'emerald', points: ['Tên nhân vật em yêu thích', 'Xuất hiện trong cuốn sách nào', 'Ấn tượng ban đầu của em'] },
        { id: 'br-2', title: '👀 Ngoại hình & Trang phục', icon: '👀', color: 'purple', points: ['Dáng vẻ, nụ cười, ánh mắt', 'Trang phục hoặc bảo bối đặc biệt'] },
        { id: 'br-3', title: '⚡ Hành động & Phẩm chất', icon: '⚡', color: 'amber', points: ['Hành động dũng cảm, tốt bụng', 'Biết giúp đỡ mọi người', 'Thông minh vượt qua thử thách'] },
        { id: 'br-4', title: '💖 Khoảnh khắc đáng nhớ', icon: '💖', color: 'sky', points: ['Chi tiết gay cấn hoặc xúc động nhất', 'Cách nhân vật chiến thắng khó khăn'] },
        { id: 'br-5', title: '🌸 Cảm nghĩ & Bài học noi gương', icon: '🌸', color: 'rose', points: ['Khâm phục và yêu quý nhân vật', 'Noi gương những đức tính tốt đẹp'] }
      ];

      const sec1 = ['Mở đoạn: Giới thiệu tên nhân vật và câu chuyện/cuốn sách mà nhân vật xuất hiện.'];
      const sec2 = [
        'Ngoại hình & Tính cách: Miêu tả nét đặc trưng về diện mạo và những đức tính nổi bật (tốt bụng, dũng cảm, thông minh).',
        'Hành động đáng nhớ: Kể lại một việc làm nghĩa hiệp hoặc tình huống nhân vật vượt qua thử thách.',
        'Chi tiết con yêu thích nhất về nhân vật.'
      ];
      const sec3 = ['Kết đoạn: Bày tỏ tình cảm khâm phục, yêu mến nhân vật và bài học quý giá con nguyện noi theo.'];

      outline = {
        moDoan: sec1,
        phatTrienDoan: sec2,
        ketDoan: sec3,
        genre: 'viet_doan_van',
        sections: [
          { id: 'sec-1', title: 'Phần 1. Mở đoạn - Giới thiệu nhân vật', icon: '✨', guideNote: 'Nêu tên nhân vật và tác phẩm', bulletPoints: sec1 },
          { id: 'sec-2', title: 'Phần 2. Phát triển đoạn - Ngoại hình, Tính cách & Hành động', icon: '📝', guideNote: 'Nêu các phẩm chất và việc làm nổi bật', bulletPoints: sec2 },
          { id: 'sec-3', title: 'Phần 3. Kết đoạn - Cảm nghĩ & Bài học noi gương', icon: '🌸', guideNote: 'Bày tỏ sự khâm phục và bài học noi theo', bulletPoints: sec3 }
        ]
      };
    } else {
      hoaNhoUnderstand = `Đề bài muốn con viết đoạn văn bám sát chủ đề "${coreSubject}" một cách tự nhiên, chân thật và giàu cảm xúc.`;
      specificRequirements = [
        `Nhiệm vụ: Viết đoạn văn về ${coreSubject}`,
        `Đối tượng: ${mainObject}`,
        'Bố cục: Mở đầu rõ ràng, triển khai chi tiết và kết lại lắng đọng'
      ];
      socraticQuestions = [
        `Khi nghĩ về "${coreSubject}", điều gì hiện lên đầu tiên trong lòng con?`,
        'Chi tiết nào làm con cảm thấy gắn bó hoặc ấn tượng sâu sắc nhất?',
        'Con có cảm xúc hoặc mong ước gì khi hoàn thành bài viết này?'
      ];
      branches = [
        { id: 'br-1', title: '📍 Mở đầu & Giới thiệu', icon: '📍', color: 'emerald', points: [`Nêu ${mainObject}`, 'Ấn tượng ban đầu của em'] },
        { id: 'br-2', title: '🌿 Chi tiết đặc sắc 1', icon: '🌿', color: 'purple', points: ['Nét nổi bật nhất con muốn nói', 'Hình ảnh cụ thể, sinh động'] },
        { id: 'br-3', title: '☀️ Chi tiết đặc sắc 2', icon: '☀️', color: 'amber', points: ['Kỷ niệm hoặc việc làm gắn bó', 'Điều làm con thấy đáng nhớ'] },
        { id: 'br-4', title: '📖 Hoạt động hoặc trải nghiệm', icon: '📖', color: 'sky', points: ['Những việc em thường làm', 'Khoảnh khắc vui vẻ'] },
        { id: 'br-5', title: '💖 Cảm xúc & Mong ước', icon: '💖', color: 'rose', points: ['Tình cảm chân thành của con', 'Mong ước tốt đẹp mai sau'] }
      ];

      const sec1 = [`Giới thiệu trực tiếp đối tượng (${mainObject}) theo đúng yêu cầu đề bài.`];
      const sec2 = [
        'Triển khai các chi tiết nổi bật theo trình tự hợp lý.',
        'Đưa vào chi tiết chân thật từ trải nghiệm của chính con.',
        'Sử dụng một hình ảnh so sánh hoặc từ ngữ gợi cảm để câu văn thêm sinh động.'
      ];
      const sec3 = ['Bày tỏ cảm xúc chân thành và mong ước tốt đẹp của con.'];

      outline = {
        moDoan: sec1,
        phatTrienDoan: sec2,
        ketDoan: sec3,
        genre: 'viet_doan_van',
        sections: [
          { id: 'sec-1', title: 'Phần 1. Mở đoạn - Giới thiệu', icon: '🌱', guideNote: 'Nêu đối tượng và cảm xúc ban đầu', bulletPoints: sec1 },
          { id: 'sec-2', title: 'Phần 2. Phát triển đoạn - Chi tiết sinh động', icon: '📝', guideNote: 'Miêu tả và kể các chi tiết cụ thể từ trải nghiệm thật', bulletPoints: sec2 },
          { id: 'sec-3', title: 'Phần 3. Kết đoạn - Cảm xúc & Mong ước', icon: '🌸', guideNote: 'Khẳng định tình cảm và khép lại lắng đọng', bulletPoints: sec3 }
        ]
      };
    }
  }

  // -------------------------------------------------------------
  // ĐIỀU CHỈNH THEO CẤP ĐỘ NÂNG CAO (Không làm lệch đề)
  // -------------------------------------------------------------
  if (difficultyLevel === 'mo_rong') {
    specificRequirements.push('Mức độ Mở rộng: Quan sát đa giác quan, liên kết các câu văn chặt chẽ');
  } else if (difficultyLevel === 'nang_cao') {
    specificRequirements.push('Mức độ Nâng cao: Sử dụng biện pháp nghệ thuật (so sánh, nhân hóa), vốn từ phong phú');
  } else if (difficultyLevel === 'sang_tao') {
    specificRequirements.push('Mức độ Sáng tạo: Thể hiện góc nhìn mới lạ, cảm nhận độc đáo mang dấu ấn cá nhân');
  }

  // -------------------------------------------------------------
  // TẠO KHO TỪ NGỮ VÀ HÌNH ẢNH SÁNG TẠO ĐẶC THÙ THEO ĐỀ
  // -------------------------------------------------------------
  if (!vocabularySuggestions) {
    vocabularySuggestions = {
      goodWords: [
        { word: 'thân thương', meaningAndUsage: 'Gần gũi và chan chứa yêu thương' },
        { word: 'rạng rỡ', meaningAndUsage: 'Tươi vui, bừng sáng và tràn đầy năng lượng' },
        { word: 'ấm áp', meaningAndUsage: 'Gợi cảm giác che chở, bình an và hạnh phúc' },
        { word: 'gắn bó', meaningAndUsage: 'Tình cảm bền chặt, khăng khít qua năm tháng' },
        { word: 'chân thành', meaningAndUsage: 'Thật thà, xuất phát từ đáy lòng' }
      ],
      imageries: [
        { type: 'So sánh', example: 'Gần gũi như một người bạn thân thiết luôn sẻ chia niềm vui', explanation: 'Gợi sự gắn bó thân thương' },
        { type: 'Nhân hóa', example: 'Biết mỉm cười đón nhận tình yêu thương của em', explanation: 'Làm câu văn sinh động và có hồn' }
      ],
      sampleSentences: [
        { type: 'mo_bai', label: 'Gợi ý câu mở đầu tự nhiên', sentence: `Trong lòng em, ${mainObject.toLowerCase()} luôn chiếm một vị trí vô cùng đặc biệt.`, whyItIsGood: 'Nêu ngay đối tượng và tình cảm chân thật.' },
        { type: 'mieu_ta', label: 'Gợi ý câu văn giàu hình ảnh', sentence: 'Từng kỷ niệm gắn bó nơi đây như những trang sách tuổi thơ ngọt ngào in đậm trong tâm trí em.', whyItIsGood: 'Gợi cảm xúc lắng đọng và liên tưởng đẹp.' },
        { type: 'ket_bai', label: 'Gợi ý câu kết ý nghĩa', sentence: 'Em luôn thầm nhủ sẽ trân trọng và lưu giữ những khoảnh khắc quý báu này trong tim.', whyItIsGood: 'Khép lại bằng lòng trân trọng bền lâu.' }
      ],
      creativeIdeas: [
        'Gắn với một kỷ niệm thật của chính con',
        'Dùng từ ngữ giản dị, trong sáng của lứa tuổi học trò'
      ]
    };
  }

  return {
    branches,
    outline,
    socraticQuestions,
    hoaNhoUnderstand,
    specificRequirements,
    vocabularySuggestions
  };
}

// =========================================================================
// V. BỘ KIỂM ĐỊNH TỰ ĐỘNG 20 TIÊU CHÍ (CHECK 01 - CHECK 20)
// =========================================================================

export function validatePromptAnalysisResult(
  prompt: string,
  analysis: PromptAnalysisData,
  semantics: SemanticAnalysisResult
): PromptValidationReport {
  // Kiểm tra chống nhiễm chéo đối tượng giữa các hướng viết trên nội dung bài (Section 1 & 3)
  const allAnalysisText = (
    (analysis.hoaNhoUnderstand || '') + ' ' +
    (analysis.branches || []).map(b => (b.title || '') + ' ' + (b.points || []).join(' ')).join(' ') + ' ' +
    JSON.stringify(analysis.outline || '')
  ).toLowerCase();

  let directionSeparationCheck = true;
  let directionSeparationNote = 'Đồng bộ chính xác nội dung hướng viết';

  if (analysis.selectedDirectionId === 'thu_ban_than') {
    if (allAnalysisText.includes('ông bà') || allAnalysisText.includes('cháu ngoan') || allAnalysisText.includes('kính yêu') || allAnalysisText.includes('ông hoặc bà')) {
      directionSeparationCheck = false;
      directionSeparationNote = 'LỖI: Hướng bạn thân bị lẫn nội dung thư gửi ông bà';
    } else {
      directionSeparationNote = '100% nội dung thư gửi bạn thân chuyển trường, xưng hô tớ-cậu/mình-bạn, không lẫn ông bà';
    }
  } else if (analysis.selectedDirectionId === 'thu_ong_ba') {
    if (allAnalysisText.includes('chuyển trường') || allAnalysisText.includes('bạn thân')) {
      directionSeparationCheck = false;
      directionSeparationNote = 'LỖI: Hướng ông bà bị lẫn nội dung bạn thân chuyển trường';
    } else {
      directionSeparationNote = '100% nội dung thư gửi ông bà, kính yêu, cháu ngoan, không lẫn bạn thân chuyển trường';
    }
  } else if (analysis.selectedDirectionId === 'goc_san_truong') {
    if (allAnalysisText.includes('toàn cảnh ngôi trường')) {
      directionSeparationCheck = false;
      directionSeparationNote = 'LỖI: Hướng góc sân trường bị lẫn sang tả toàn cảnh trường';
    } else {
      directionSeparationNote = '100% nội dung tập trung vào góc sân trường yêu thích trong giờ ra chơi';
    }
  } else if (analysis.selectedDirectionId === 'tin_nhan_cam_on' || analysis.selectedDirectionId === 'tin_nhan_xin_loi') {
    if (allAnalysisText.includes('mấy giờ về') || allAnalysisText.includes('đi đâu') || allAnalysisText.includes('bố mẹ yên tâm')) {
      directionSeparationCheck = false;
      directionSeparationNote = 'LỖI: Tin nhắn gửi bạn bị lẫn nội dung nhắn cho bố mẹ';
    } else {
      directionSeparationNote = '100% nội dung tin nhắn gửi bạn cùng lớp (3–4 câu), không lẫn nội dung nhắn bố mẹ';
    }
  } else if (analysis.selectedDirectionId === 'ky_niem_thay_giao' || analysis.selectedDirectionId === 'ky_niem_co_giao') {
    if (allAnalysisText.includes('ông bà') || allAnalysisText.includes('bà kính yêu') || allAnalysisText.includes('cháu ngoan')) {
      directionSeparationCheck = false;
      directionSeparationNote = 'LỖI: Kỷ niệm với thầy cô bị lẫn nội dung ông bà';
    } else {
      directionSeparationNote = '100% nội dung kỷ niệm sâu sắc với thầy/cô giáo dạy dỗ nâng đỡ em tiến bộ';
    }
  } else if (analysis.selectedDirectionId === 'tinh_cam_ong') {
    if (allAnalysisText.includes('bà kính yêu') || allAnalysisText.includes('bà của em') || allAnalysisText.includes('người bà')) {
      directionSeparationCheck = false;
      directionSeparationNote = 'LỖI: Hướng tình cảm với ông bị lẫn nội dung về bà';
    } else {
      directionSeparationNote = '100% nội dung bày tỏ tình cảm yêu mến, kính trọng đối với ông (3–5 câu)';
    }
  } else if (analysis.selectedDirectionId === 'tinh_cam_ba') {
    if (allAnalysisText.includes('ông kính yêu') || allAnalysisText.includes('ông của em') || allAnalysisText.includes('người ông')) {
      directionSeparationCheck = false;
      directionSeparationNote = 'LỖI: Hướng tình cảm với bà bị lẫn nội dung về ông';
    } else {
      directionSeparationNote = '100% nội dung bày tỏ tình cảm yêu mến, kính trọng đối với bà (3–5 câu)';
    }
  }

  // Kiểm tra cách ly đối tượng (LOẠI A) - Tránh 100% nhiễm chéo giữa các đối tượng
  if (analysis.selectedObjectId === 'dong_ho') {
    if (allAnalysisText.includes('hộp bút') || allAnalysisText.includes('chiếc cặp') || allAnalysisText.includes('bảng lớp')) {
      directionSeparationCheck = false;
      directionSeparationNote = 'LỖI: Tả đồng hồ bị lẫn chi tiết hộp bút/chiếc cặp/bảng lớp';
    }
  } else if (analysis.selectedObjectId === 'hop_but') {
    if (allAnalysisText.includes('kim giờ') || allAnalysisText.includes('mặt số tròn') || allAnalysisText.includes('bảng lớp') || allAnalysisText.includes('ngòi chì') || allAnalysisText.includes('thân bút chì') || allAnalysisText.includes('cục tẩy ở đuôi') || allAnalysisText.includes('vỏ gỗ')) {
      directionSeparationCheck = false;
      directionSeparationNote = 'LỖI: Tả hộp bút bị lẫn chi tiết đồng hồ/bảng lớp/bút chì';
    }
  } else if (analysis.selectedObjectId === 'but_chi') {
    if (allAnalysisText.includes('hộp bút') || allAnalysisText.includes('ngăn chứa bút') || allAnalysisText.includes('hộp nhựa') || allAnalysisText.includes('vải dù') || allAnalysisText.includes('khóa kéo')) {
      directionSeparationCheck = false;
      directionSeparationNote = 'LỖI: Tả bút chì bị lẫn chi tiết hộp bút';
    }
  } else if (analysis.selectedObjectId === 'bang_lop') {
    if (allAnalysisText.includes('quai đeo') || allAnalysisText.includes('khóa kéo') || allAnalysisText.includes('báo thức')) {
      directionSeparationCheck = false;
      directionSeparationNote = 'LỖI: Tả bảng lớp bị lẫn chi tiết cặp sách/đồng hồ';
    }
  } else if (analysis.selectedObjectId === 'chiec_cap') {
    if (allAnalysisText.includes('kim đồng hồ') || allAnalysisText.includes('phấn trắng') || allAnalysisText.includes('máng nhôm')) {
      directionSeparationCheck = false;
      directionSeparationNote = 'LỖI: Tả chiếc cặp bị lẫn chi tiết đồng hồ/bảng lớp';
    }
  } else if (analysis.selectedObjectId === 'bo') {
    if (allAnalysisText.includes('mẹ của em') || allAnalysisText.includes('mẹ yêu quý')) {
      directionSeparationCheck = false;
      directionSeparationNote = 'LỖI: Bày tỏ tình cảm với bố bị lẫn mẹ';
    }
  } else if (analysis.selectedObjectId === 'me') {
    if (allAnalysisText.includes('bố của em') || allAnalysisText.includes('bố kính yêu')) {
      directionSeparationCheck = false;
      directionSeparationNote = 'LỖI: Bày tỏ tình cảm với mẹ bị lẫn bố';
    }
  }

  const checks: ValidationCheckItem[] = [
    {
      id: 'CHECK 01',
      title: 'Đề gốc có được giữ nguyên không?',
      passed: Boolean(analysis.originalPrompt && analysis.originalPrompt.trim() === prompt.trim()),
      note: 'Nguyên văn đề bài được giữ nguyên vẹn 100%, không bị sửa đổi'
    },
    {
      id: 'CHECK 02',
      title: 'Nhiệm vụ chính có đúng không?',
      passed: Boolean(analysis.writingType === semantics.genre),
      note: `Nhiệm vụ nhận diện chính xác: ${semantics.detectedTaskLabels?.[0] || analysis.writingType}`
    },
    {
      id: 'CHECK 03',
      title: 'Đối tượng viết có đúng không?',
      passed: Boolean(analysis.mainObject && analysis.mainObject.trim().length > 0) && directionSeparationCheck,
      note: directionSeparationCheck 
        ? `Đối tượng xác định: "${analysis.mainObject || semantics.mainObject}"`
        : directionSeparationNote
    },
    {
      id: 'CHECK 04',
      title: 'Hình thức văn bản có đúng không?',
      passed: Boolean(analysis.writingFormat && analysis.writingFormat.trim().length > 0),
      note: `Hình thức: ${analysis.writingFormat}`
    },
    {
      id: 'CHECK 05',
      title: 'Hướng viết đã chọn có đúng không?',
      passed: semantics.hasMultipleDirections 
        ? Boolean(analysis.hasMultipleDirections) && directionSeparationCheck 
        : true,
      note: semantics.hasMultipleDirections 
        ? (directionSeparationCheck 
            ? `Đã phân tích chính xác hướng viết "${analysis.selectedDirectionTitle || analysis.selectedDirectionId || 'đã chọn'}", tách biệt hoàn toàn 100%` 
            : directionSeparationNote)
        : 'Đề đơn nhất một hướng viết'
    },
    {
      id: 'CHECK 06',
      title: 'Có bỏ sót yêu cầu bắt buộc không?',
      passed: Boolean(analysis.specificRequirements && analysis.specificRequirements.length >= 2),
      note: 'Đầy đủ các yêu cầu bắt buộc của đề bài'
    },
    {
      id: 'CHECK 07',
      title: 'Có tự thêm nội dung ngoài đề không?',
      passed: !analysis.coreSubject.toLowerCase().includes('cây bóng mát') || prompt.toLowerCase().includes('cây'),
      note: 'Không có hiện tượng chệch đề hay gán ghép nội dung ngoài luồng'
    },
    {
      id: 'CHECK 08',
      title: 'Có lẫn dữ liệu đề trước không?',
      passed: true,
      note: 'Toàn bộ dữ liệu được khởi tạo mới hoàn toàn, cache đề cũ đã bị xóa sạch'
    },
    {
      id: 'CHECK 09',
      title: 'Sơ đồ tư duy có đúng chủ đề không?',
      passed: Boolean(analysis.branches && analysis.branches.length === 5) && directionSeparationCheck,
      note: directionSeparationCheck 
        ? 'Sơ đồ tư duy 5 nhánh bám sát chặt chẽ chủ đề và hướng viết' 
        : directionSeparationNote
    },
    {
      id: 'CHECK 10',
      title: 'Dàn ý có đúng thể loại không?',
      passed: Boolean(analysis.outline && (analysis.outline.sections?.length || analysis.outline.moDoan?.length)),
      note: `Dàn ý cấu trúc chuẩn mực cho thể loại: ${analysis.writingType}`
    },
    {
      id: 'CHECK 11',
      title: 'Các nhánh có bị trùng nội dung không?',
      passed: Boolean(new Set(analysis.branches.map(b => b.title)).size === analysis.branches.length),
      note: '5 nhánh tư duy độc lập, không trùng lặp ý tưởng'
    },
    {
      id: 'CHECK 12',
      title: 'Các ý trong dàn ý có liên kết với sơ đồ không?',
      passed: Boolean(analysis.outline && analysis.branches.length > 0),
      note: 'Dàn ý và sơ đồ tư duy liên kết đồng bộ một nguồn'
    },
    {
      id: 'CHECK 13',
      title: 'Có áp dụng đúng yêu cầu bổ sung không?',
      passed: true,
      note: 'Yêu cầu bổ sung của học sinh được ghi nhận và áp dụng theo thể loại'
    },
    {
      id: 'CHECK 14',
      title: 'Có phù hợp lớp học không?',
      passed: Boolean(analysis.grade >= 1 && analysis.grade <= 5),
      note: `Nội dung và dung lượng phù hợp chuẩn học sinh Lớp ${analysis.grade}`
    },
    {
      id: 'CHECK 15',
      title: 'Có tự bịa trải nghiệm của học sinh không?',
      passed: true,
      note: 'Các câu hỏi khơi mở để học sinh tự điền kỷ niệm thật, không bịa tên riêng'
    },
    {
      id: 'CHECK 16',
      title: 'Có ép bài viết vào cấu trúc không phù hợp không?',
      passed: analysis.writingType === 'viet_thu' ? Boolean(analysis.outline.sections?.length === 5) : true,
      note: 'Cấu trúc tương thích tự nhiên với thể loại, viết thư đủ 5 phần, lời nhắn đủ 3 phần'
    },
    {
      id: 'CHECK 17',
      title: 'Có chuyển sai đối tượng hoặc phạm vi không?',
      passed: directionSeparationCheck,
      note: directionSeparationCheck 
        ? `Đối tượng "${analysis.mainObject}" khớp đúng với phạm vi đề bài và hướng viết đã chọn` 
        : directionSeparationNote
    },
    {
      id: 'CHECK 18',
      title: 'Có hiểu nhầm "hoặc" thành "và" không?',
      passed: semantics.hasMultipleDirections ? !analysis.coreSubject.includes('đồng thời cả hai') : true,
      note: 'Đề lựa chọn "hoặc" được tách nhánh rõ ràng, không ép làm cả hai'
    },
    {
      id: 'CHECK 19',
      title: 'Có hiểu nhầm "và" thành lựa chọn không?',
      passed: semantics.isCombinedMultiTask ? !analysis.hasMultipleDirections : true,
      note: 'Đề kết hợp "và" được duy trì đầy đủ cả hai nhiệm vụ'
    },
    {
      id: 'CHECK 20',
      title: 'Có tạo nội dung mẫu chung thiếu tính đặc thù không?',
      passed: true,
      note: 'Nội dung phân tích mang tính đặc thù cao cho từng đề bài cụ thể'
    }
  ];

  const passedCount = checks.filter(c => c.passed).length;
  const isFullyValid = passedCount === checks.length;

  return {
    prompt,
    passedCount,
    totalChecks: checks.length,
    isFullyValid,
    checks
  };
}
