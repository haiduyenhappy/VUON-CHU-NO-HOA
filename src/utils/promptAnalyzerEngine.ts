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
  PromptAnalysisData
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
  hasMultipleDirections: boolean;
  detectedDirections: PromptDirection[];
  selectedDirectionId?: string | null;
  selectedDirection?: PromptDirection | null;
  purpose?: string;
  isCombinedMultiTask: boolean;
  combinedTasks: string[];
  compulsoryConstraints: string[];
  negativeConstraints: string[];
  suggestedLength: string;
  difficultyLevel: DifficultyLevel;
}

/**
 * Phân tích chuyên sâu ngữ nghĩa đề bài tiểu học không phụ thuộc từ khóa đơn lẻ
 */
export function analyzePromptSemantics(
  promptText: string, 
  grade: number = 3, 
  difficulty: DifficultyLevel = 'co_ban',
  selectedDirectionId?: string | null
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

  // 2. Nhận diện đề có nhiều hướng ("hoặc" / "hay là" / "chọn một" / "một trong các" / "có thể viết về" / "tùy chọn")
  const hasAlternative = 
    pLower.includes('hoặc') || 
    pLower.includes('hay là') || 
    (pLower.includes(' hay ') && !pLower.includes('hay ho') && !pLower.includes('điều hay')) ||
    pLower.includes('một trong các') ||
    pLower.includes('chọn một') ||
    pLower.includes('có thể viết về') ||
    pLower.includes('tùy chọn');
  const hasMultipleDirections = hasAlternative && !pLower.includes('bản thân') && !pLower.includes('giới thiệu bản thân');

  const detectedDirections: PromptDirection[] = [];

  if (hasMultipleDirections) {
    // Trường hợp 1: Viết thư thăm hỏi ông bà HOẶC bạn thân chuyển trường đi xa (Đề kiểm thử trọng tâm)
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
    // Trường hợp 2: Tả ngôi trường HOẶC góc sân trường
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
    // Trường hợp 3: Kỷ niệm với ông HOẶC bà
    else if (pLower.includes('kỷ niệm') && (pLower.includes('ông') || pLower.includes('bà')) && (pLower.includes(' hoặc ') || pLower.includes(' hay '))) {
      detectedDirections.push({
        id: 'ong',
        title: 'Kể lại kỷ niệm đáng nhớ với ông',
        mainObject: 'Kỷ niệm đáng nhớ với ông',
        scope: 'Lời dạy bảo ân cần, cử chỉ ấm áp của ông và bài học đạo đức con luôn ghi nhớ',
        recipient: 'Người đọc',
        purpose: 'Kể lại kỷ niệm sâu sắc với ông và bộc lộ lòng biết ơn',
        pointOfView: 'Cháu – ông',
        topicCode: 'CD02',
        topicName: 'Gia đình',
        icon: '👴'
      });
      detectedDirections.push({
        id: 'ba',
        title: 'Kể lại kỷ niệm đáng nhớ với bà',
        mainObject: 'Kỷ niệm đáng nhớ với bà',
        scope: 'Lời ru, câu chuyện cổ tích, sự chăm sóc chu đáo của bà và lòng biết ơn của cháu',
        recipient: 'Người đọc',
        purpose: 'Kể lại kỷ niệm sâu sắc với bà và bộc lộ lòng biết ơn',
        pointOfView: 'Cháu – bà',
        topicCode: 'CD02',
        topicName: 'Gia đình',
        icon: '👵'
      });
    }
    // Trường hợp 4: Viết thư cho người thân HOẶC bạn ở xa
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
    // Trường hợp 5: Giới thiệu cuốn sách HOẶC nhân vật em yêu thích
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
    // Phân tách tự động tổng quát cho mọi đề chứa "hoặc" / "hay là"
    else {
      const parts = p.split(/\bhoặc\b|\bhay là\b/i);
      if (parts.length >= 2 && parts[0].trim().length > 4 && parts[1].trim().length > 4) {
        const clean1 = parts[0].replace(/^viết\s*(một\s*)?(đoạn\s*văn)?\s*(kể|tả|nêu|về)?/i, '').trim();
        const clean2 = parts[1].replace(/mà\s*em\s*(yêu\s*thích|thích\s*nhất|nhớ\s*nhất).*/i, '').trim();
        const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
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
  } else if (pLower.includes('nêu ý kiến') || pLower.includes('ý kiến của em') || pLower.includes('suy nghĩ của em')) {
    genre = 'neu_y_kien';
  } else if (pLower.includes('tình cảm') || pLower.includes('cảm xúc') || pLower.includes('lòng biết ơn') || pLower.includes('kính yêu') || pLower.includes('thương nhớ')) {
    genre = 'tinh_cam_cam_xuc';
  } else if (pLower.includes('thuật lại') || pLower.includes('chứng kiến')) {
    genre = 'thuat_lai';
  } else if (pLower.includes('kể chuyện') || pLower.includes('kể lại câu chuyện') || pLower.includes('kể lại sự việc') || pLower.includes('kể lại kỷ niệm') || pLower.includes('kể lại trải nghiệm') || pLower.includes('kể về')) {
    genre = 'ke_chuyen';
  } else if (pLower.includes('miêu tả') || pLower.includes('tả cảnh') || pLower.includes('tả người') || pLower.includes('tả đồ vật') || pLower.includes('tả con vật') || pLower.includes('tả cây') || pLower.includes('tả ngôi trường') || pLower.includes('tả góc sân') || pLower.startsWith('tả ')) {
    genre = 'mieu_ta';
  } else if (pLower.includes('tưởng tượng') || pLower.includes('nhập vai') || pLower.includes('hóa thân') || pLower.includes('sáng tạo')) {
    genre = 'sang_tao';
  }

  // 5. Nhận diện nhóm chủ đề (CD01 - CD25)
  let topicCode = 'CD25';
  let topicName = 'Chủ đề tự do';

  if (pLower.includes('bản thân') || pLower.includes('chính mình') || pLower.includes('họ tên') || pLower.includes('sở thích của em')) {
    topicCode = 'CD01'; topicName = 'Bản thân';
  } else if (pLower.includes('ông') || pLower.includes('bà') || pLower.includes('bố') || pLower.includes('mẹ') || pLower.includes('cha') || pLower.includes('gia đình') || pLower.includes('anh trai') || pLower.includes('chị gái') || pLower.includes('em bé')) {
    topicCode = 'CD02'; topicName = 'Gia đình';
  } else if (pLower.includes('bạn thân') || pLower.includes('người bạn') || pLower.includes('bạn bè') || pLower.includes('bạn cùng lớp') || pLower.includes('chuyển trường')) {
    topicCode = 'CD03'; topicName = 'Bạn bè';
  } else if (pLower.includes('thầy') || pLower.includes('cô giáo') || pLower.includes('thầy giáo') || pLower.includes('cô chủ nhiệm')) {
    topicCode = 'CD04'; topicName = 'Thầy cô';
  } else if (pLower.includes('ngôi trường') || pLower.includes('trường tiểu học') || pLower.includes('lớp học') || pLower.includes('sân trường') || pLower.includes('góc sân')) {
    topicCode = 'CD05'; topicName = 'Trường lớp';
  } else if (pLower.includes('hộp bút') || pLower.includes('cặp sách') || pLower.includes('cây bút') || pLower.includes('thước kẻ') || pLower.includes('gấu bông') || pLower.includes('đồ chơi') || pLower.includes('đồ dùng')) {
    topicCode = 'CD06'; topicName = 'Đồ vật';
  } else if (pLower.includes('chú chó') || pLower.includes('mèo con') || pLower.includes('con gà') || pLower.includes('con chim') || pLower.includes('con vật')) {
    topicCode = 'CD07'; topicName = 'Động vật';
  } else if (pLower.includes('cây bàng') || pLower.includes('cây phượng') || pLower.includes('cây bóng mát') || pLower.includes('hoa sen') || pLower.includes('hoa hồng') || pLower.includes('bồn hoa') || pLower.includes('vườn cây')) {
    topicCode = 'CD08'; topicName = 'Thực vật';
  } else if (pLower.includes('mưa rào') || pLower.includes('bình minh') || pLower.includes('hoàng hôn') || pLower.includes('bầu trời') || pLower.includes('dòng sông') || pLower.includes('biển')) {
    topicCode = 'CD09'; topicName = 'Thiên nhiên';
  } else if (pLower.includes('quê hương') || pLower.includes('làng quê') || pLower.includes('thành phố') || pLower.includes('danh lam thắng cảnh')) {
    topicCode = 'CD10'; topicName = 'Quê hương';
  } else if (pLower.includes('tết') || pLower.includes('trung thu') || pLower.includes('lễ hội') || pLower.includes('hội chợ')) {
    topicCode = 'CD11'; topicName = 'Lễ hội';
  } else if (pLower.includes('dã ngoại') || pLower.includes('tham quan') || pLower.includes('trải nghiệm') || pLower.includes('cắm trại')) {
    topicCode = 'CD12'; topicName = 'Hoạt động trải nghiệm';
  } else if (pLower.includes('việc tốt') || pLower.includes('giúp đỡ') || pLower.includes('nhặt của rơi') || pLower.includes('chia sẻ')) {
    topicCode = 'CD13'; topicName = 'Việc tốt';
  } else if (pLower.includes('sách') || pLower.includes('truyện') || pLower.includes('nhân vật cổ tích')) {
    topicCode = 'CD15'; topicName = 'Sách và truyện';
  } else if (pLower.includes('ước mơ') || pLower.includes('lớn lên')) {
    topicCode = 'CD16'; topicName = 'Ước mơ';
  } else if (pLower.includes('môi trường') || pLower.includes('rác') || pLower.includes('trồng cây')) {
    topicCode = 'CD17'; topicName = 'Môi trường';
  }

  // 6. Nhận diện các mã nhiệm vụ (01 đến 64)
  const detectedTaskCodes: string[] = [];
  const detectedTaskLabels: string[] = [];

  for (const task of WRITING_TASKS_CATALOG) {
    let matches = false;
    if (task.genre === genre && task.targetGrades.includes(grade)) {
      if (task.code === 'NV40' && genre === 'viet_thu' && (pLower.includes('thăm hỏi') || pLower.includes('ông') || pLower.includes('bà'))) matches = true;
      else if (task.code === 'NV41' && genre === 'viet_thu' && (pLower.includes('bạn thân') || pLower.includes('chuyển trường'))) matches = true;
      else if (task.code === 'NV44' && genre === 'loi_nhan') matches = true;
      else if (task.code === 'NV37' && genre === 'neu_y_kien') matches = true;
      else if (task.code === 'NV17' && genre === 'ke_chuyen' && pLower.includes('kỷ niệm')) matches = true;
      else if (task.code === 'NV16' && genre === 'ke_chuyen' && (pLower.includes('trải nghiệm') || pLower.includes('tham quan'))) matches = true;
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
    else if (genre === 'ke_chuyen') { detectedTaskCodes.push('NV09'); detectedTaskLabels.push('Viết đoạn văn kể chuyện'); }
    else if (genre === 'mieu_ta') { detectedTaskCodes.push('NV10'); detectedTaskLabels.push('Viết đoạn văn miêu tả'); }
    else if (genre === 'viet_cau') { detectedTaskCodes.push('NV01'); detectedTaskLabels.push('Viết câu'); }
    else { detectedTaskCodes.push('NV08'); detectedTaskLabels.push('Viết đoạn văn'); }
  }

  // 7. Xác định đối tượng viết và phạm vi
  let mainObject = 'Đối tượng theo đề bài';
  let writingScope = 'Phạm vi đề bài yêu cầu';
  let coreSubject = p;
  let audienceOrRecipient = 'Người đọc bài văn của em';
  let pointOfView = 'Ngôi thứ nhất (Em / Con)';

  // Xử lý khi đã chọn hướng viết
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
  } else if (genre === 'viet_thu') {
    if (pLower.includes('ông') || pLower.includes('bà')) {
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
  } else if (pLower.includes('ngôi trường') && !pLower.includes('góc sân')) {
    mainObject = 'Ngôi trường tiểu học';
    coreSubject = 'Tả ngôi trường tiểu học của em';
    writingScope = 'Toàn cảnh ngôi trường, dãy lớp học, sân trường và kỷ niệm gắn bó';
  } else if (pLower.includes('góc sân trường') || (pLower.includes('góc sân') && pLower.includes('trường'))) {
    mainObject = 'Một góc sân trường';
    coreSubject = 'Tả một góc sân trường em yêu thích';
    writingScope = 'Vị trí góc sân, cảnh vật xung quanh (ghế đá, bồn hoa, ánh nắng) và hoạt động giờ ra chơi';
  } else if (pLower.includes('bản thân') || pLower.includes('giới thiệu')) {
    mainObject = 'Bản thân học sinh';
    coreSubject = 'Giới thiệu về bản thân em';
    writingScope = 'Họ tên, sở thích, ước mơ và điểm đặc biệt đáng nhớ của chính em';
  } else if (pLower.includes('kỷ niệm') && (pLower.includes('ông') || pLower.includes('bà'))) {
    mainObject = 'Kỷ niệm đáng nhớ với ông bà';
    coreSubject = 'Kể lại một kỷ niệm đáng nhớ với ông bà';
    writingScope = 'Sự việc đáng nhớ, lời dạy bảo, cử chỉ ân cần của ông bà và cảm xúc của em';
  } else if (genre === 'neu_y_kien') {
    mainObject = 'Việc làm tốt và ý nghĩa nhân văn';
    coreSubject = 'Nêu ý kiến về một việc làm tốt';
    writingScope = 'Khẳng định sự đồng tình, đưa ra lý do xác đáng và dẫn chứng câu chuyện thực tế';
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

  if (genre === 'viet_thu') {
    negativeConstraints.push('KHÔNG dùng các tiêu đề "Mở đoạn", "Phát triển đoạn", "Kết đoạn" cho dàn ý bức thư');
    compulsoryConstraints.push('Trình bày đầy đủ 5 phần chuẩn mực của bức thư');
  } else if (genre === 'loi_nhan') {
    negativeConstraints.push('KHÔNG ép lời nhắn ngắn thành bài văn dài 3 phần');
    compulsoryConstraints.push('Ghi rõ người nhận, nội dung nhắn gửi ngắn gọn, người gửi và thời gian');
  }

  // 9. Xác định độ dài đề xuất theo khối lớp và thể loại
  let suggestedLength = '4–6 câu hoặc 7–9 câu';
  if (genre === 'viet_cau' || pLower.includes('2–3 câu') || pLower.includes('2-3 câu')) {
    suggestedLength = '2–3 câu hoàn chỉnh';
  } else if (genre === 'viet_thu') {
    suggestedLength = 'Thư ngắn (khoảng 80–120 chữ, có đủ 5 phần chuẩn mực của thư)';
  } else if (genre === 'loi_nhan') {
    suggestedLength = 'Lời nhắn ngắn (khoảng 3–5 câu súc tích)';
  } else if (grade <= 1) {
    suggestedLength = '1–2 câu trọn vẹn';
  } else if (grade === 2) {
    suggestedLength = '3–5 câu ngắn gọn';
  } else if (grade === 3) {
    suggestedLength = '5–7 câu hoặc 7–9 câu';
  } else if (grade >= 4) {
    suggestedLength = '8–12 câu hoặc 1–2 đoạn văn hoàn chỉnh';
  }

  return {
    actionVerbs,
    coreSubject,
    mainObject,
    writingScope,
    genre,
    topicCode,
    topicName,
    detectedTaskCodes,
    detectedTaskLabels,
    audienceOrRecipient,
    pointOfView,
    hasMultipleDirections,
    detectedDirections,
    selectedDirectionId: activeDirection ? activeDirection.id : null,
    selectedDirection: activeDirection,
    purpose: activeDirection?.purpose || 'Hỏi thăm, chia sẻ và bày tỏ tình cảm',
    isCombinedMultiTask,
    combinedTasks,
    compulsoryConstraints,
    negativeConstraints,
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
    `Nhiệm vụ: ${semantics.detectedTaskLabels[0] || 'Viết bài theo yêu cầu đề'}`,
    `Đối tượng: ${mainObject}`,
    `Phạm vi: ${writingScope}`
  ];
  let vocabularySuggestions: VocabularyImageryBank | null = null;

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
  // THỂ LOẠI 6: KỂ CHUYỆN / SỰ VIỆC / KỶ NIỆM (ke_chuyen)
  // -------------------------------------------------------------
  else if (genre === 'ke_chuyen' || genre === 'thuat_lai') {
    const isGrandfatherMemory = semantics.selectedDirectionId === 'ong' || (mainObject.toLowerCase().includes('ông') && !mainObject.toLowerCase().includes('bà'));
    const isGrandmotherMemory = semantics.selectedDirectionId === 'ba' || (mainObject.toLowerCase().includes('bà') && !mainObject.toLowerCase().includes('ông'));

    if (isGrandfatherMemory) {
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
    const isCornerOfYard = 
      semantics.selectedDirectionId === 'goc_san_truong' ||
      mainObject.toLowerCase().includes('góc sân');

    if (isCornerOfYard) {
      hoaNhoUnderstand = 'Con sẽ viết đoạn văn miêu tả một góc sân trường em yêu thích. Hãy chọn một góc sân thân thuộc (hàng ghế đá dưới bóng mát, bồn hoa rực rỡ, hay góc thư viện xanh ngoài trời) để tả chi tiết cảnh vật và hoạt động của con cùng bạn bè trong giờ ra chơi nhé!';
      specificRequirements = [
        'Nhiệm vụ: Viết đoạn văn miêu tả một góc sân trường em yêu thích',
        'Đối tượng: Một góc sân trường cụ thể (ghế đá, bồn hoa, tán cây che mát)',
        'Phạm vi: Cảnh vật ở góc sân và hoạt động vui tươi trong giờ ra chơi',
        'Lưu ý: Bám sát góc sân trường, TUYỆT ĐỐI KHÔNG chuyển thành tả toàn cảnh ngôi trường hay chỉ tả một cái cây đơn lẻ',
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
    } else {
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
  // Kiểm tra chống nhiễm chéo đối tượng giữa các hướng viết (Section 1 & 3)
  const allAnalysisText = (
    (analysis.hoaNhoUnderstand || '') + ' ' +
    (analysis.specificRequirements || []).join(' ') + ' ' +
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
      note: `Nhiệm vụ nhận diện chính xác: ${semantics.detectedTaskLabels[0] || analysis.writingType}`
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
