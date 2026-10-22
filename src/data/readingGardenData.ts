import { SampleReading } from '../types';

export const SAMPLE_READINGS: SampleReading[] = [
  {
    id: 'sample-01',
    title: 'Bàn tay ấm áp của bà',
    gardenType: 'yeu_thuong',
    volume: 1,
    author: 'Đoạn văn tham khảo lớp 3 (Cô giáo tuyển chọn)',
    content: `Trong gia đình, em yêu quý bà nội nhất. Mỗi buổi tối trước khi đi ngủ, bà thường quạt mát và kể cho em nghe những câu chuyện cổ tích ly kỳ. Đôi bàn tay bà gầy gầy, ram ráp nhưng khi xoa lưng cho em lại ấm áp lạ kỳ. Em thích nhất là được nép vào lòng bà hít hà mùi trầu cay nhè nhẹ. Em thầm mong bà luôn mạnh khỏe để mãi ở bên cạnh chúng em.`,
    goodPoints: [
      'Có hình ảnh chi tiết rất chân thực: "bàn tay bà gầy gầy, ram ráp", "mùi trầu cay nhè nhẹ".',
      'Diễn tả cảm xúc ấm áp và sự gắn bó sâu nặng của đứa cháu nhỏ.',
      'Câu kết bày tỏ mong ước hiếu thảo rất tự nhiên, chân thành.'
    ],
    sampleOutline: [
      { id: 'so-1', section: 'Mở đoạn', content: 'Giới thiệu bà nội là người em yêu quý nhất trong gia đình.' },
      { id: 'so-2', section: 'Thân đoạn', content: 'Kể việc bà quạt mát, kể chuyện cổ tích và cảm giác ấm áp khi được bà xoa lưng, ôm vào lòng.' },
      { id: 'so-3', section: 'Kết đoạn', content: 'Mong ước bà luôn mạnh khỏe, sống vui cùng con cháu.' }
    ],
    learningQuestion: 'Em thấy câu văn nào tả đôi bàn tay của bà hay nhất? Em có thể tìm một cử chỉ yêu thương của người thân em để tả lại không?',
    creativeMission: 'Hãy nhớ lại một khoảnh khắc một người thân ôm hoặc chăm sóc em, rồi kể lại bằng 3 câu ngắn nhé!'
  },
  {
    id: 'sample-02',
    title: 'Buổi sáng trồng hoa cùng bố',
    gardenType: 'ke_chuyen',
    volume: 1,
    author: 'Đoạn văn tham khảo lớp 3 (Cô giáo tuyển chọn)',
    content: `Sáng chủ nhật tuần trước, em đã cùng bố trồng luống hoa mười giờ trước hiên nhà. Bố xới đất tơi xốp, còn em thoăn thoắt cắm từng nhánh hoa non xuống đất mùn. Sau đó, em cẩn thận dùng bình ô doa nhỏ tưới những giọt nước mát lành cho cây. Nhìn những mầm xanh đứng thẳng tươi tắn dưới nắng mai, em thấy lòng vui sướng vô cùng. Em tự hứa sẽ tưới nước mỗi ngày để luống hoa sớm nở rộ rực rỡ.`,
    goodPoints: [
      'Trình tự sự việc rõ ràng từ lúc bắt đầu làm đến khi hoàn thành.',
      'Dùng từ ngữ chỉ hoạt động rất sinh động: "xới đất", "thoăn thoắt cắm nhánh", "tưới những giọt nước mát lành".',
      'Bộc lộ niềm vui lao động và ý thức chăm sóc cây cối.'
    ],
    sampleOutline: [
      { id: 'so-4', section: 'Mở đoạn', content: 'Thời gian và việc làm: Sáng chủ nhật cùng bố trồng hoa mười giờ.' },
      { id: 'so-5', section: 'Thân đoạn', content: 'Các bước làm: Bố xới đất, em cắm cành hoa và tưới nước bằng bình ô doa.' },
      { id: 'so-6', section: 'Kết đoạn', content: 'Cảm nghĩ vui sướng và lời hứa chăm sóc hoa mỗi ngày.' }
    ],
    learningQuestion: 'Bạn nhỏ trong bài đã dùng những từ ngữ nào để tả động tác của mình và của bố?',
    creativeMission: 'Em hãy kể lại một việc nhà đơn giản em từng giúp người thân (như quét nhà, lau bàn hoặc nhặt rau).'
  },
  {
    id: 'sample-03',
    title: 'Chiếc gọt bút chì hình chú ếch',
    gardenType: 'sac_mau',
    volume: 1,
    author: 'Đoạn văn tham khảo lớp 3 (Cô giáo tuyển chọn)',
    content: `Nhân dịp đầu năm học mới, mẹ mua tặng em một chiếc gọt bút chì hình chú ếch xanh rất ngộ nghĩnh. Chiếc gọt chỉ nhỏ bằng nắm tay em, được làm bằng nhựa bóng mịn. Hai mắt chú ếch lồi to tròn xoe, miệng mở rộng chính là nơi để đưa đầu bút chì vào gọt. Mỗi khi xoay nhẹ tay cầm, vỏ chì cuộn tròn rơi gọn vào bụng ếch. Nhờ có chiếc gọt, những chiếc bút chì của em luôn nhọn hoắt và viết chữ thật ngay ngắn. Em luôn cất giữ nó cẩn thận trong ngăn cặp.`,
    goodPoints: [
      'Quan sát cụ thể từ kích thước, màu sắc, mắt, miệng đến cách hoạt động của đồ vật.',
      'So sánh gần gũi: "chỉ nhỏ bằng nắm tay em".',
      'Nêu rõ công dụng giúp ích cho việc rèn chữ mỗi ngày.'
    ],
    sampleOutline: [
      { id: 'so-7', section: 'Mở đoạn', content: 'Giới thiệu chiếc gọt bút chì hình chú ếch mẹ tặng.' },
      { id: 'so-8', section: 'Thân đoạn', content: 'Tả hình dáng (bằng nắm tay, màu xanh), các bộ phận (mắt tròn, miệng, tay cầm) và cách dùng.' },
      { id: 'so-9', section: 'Kết đoạn', content: 'Ích lợi của chiếc gọt và ý thức giữ gìn cẩn thận của em.' }
    ],
    learningQuestion: 'Bạn nhỏ đã tả chú ếch gọt bút chì giống như một người bạn nhỏ thế nào qua những bộ phận nào?',
    creativeMission: 'Chọn một đồ dùng học tập trong hộp bút của em (thước kẻ, cục tẩy, bút mực) và tả lại màu sắc của nó.'
  },
  {
    id: 'sample-04',
    title: 'Em yêu chú Dế Mèn dũng cảm',
    gardenType: 'y_kien',
    volume: 2,
    author: 'Đoạn văn tham khảo lớp 3 (Cô giáo tuyển chọn)',
    content: `Trong câu chuyện "Dế Mèn phiêu lưu ký", em rất yêu thích nhân vật Dế Mèn sau khi chú đã biết sửa chữa lỗi lầm. Dù lúc đầu chú còn kiêu căng, xốc nổi khiến Dế Choắt phải chịu khổ, nhưng Dế Mèn đã biết ăn năn sâu sắc. Đáng khâm phục nhất là khi chú dám đứng ra bênh vực chị Nhà Trò yếu đuối trước bọn nhện hung ác. Hành động dũng cảm và tấm lòng hào hiệp đó khiến em thấy Dế Mèn xứng đáng là một trang hiệp sĩ tí hon. Chú đã dạy cho em bài học về lòng dũng cảm và biết bảo vệ bạn bè.`,
    goodPoints: [
      'Nêu ý kiến rõ ràng: yêu thích Dế Mèn vì chú biết sửa lỗi và dũng cảm.',
      'Dẫn chứng chi tiết cụ thể trong truyện: hành động bênh vực chị Nhà Trò.',
      'Rút ra bài học đạo đức bổ ích cho bản thân.'
    ],
    sampleOutline: [
      { id: 'so-10', section: 'Mở đoạn', content: 'Nêu tên nhân vật Dế Mèn và cảm tình yêu thích của em.' },
      { id: 'so-11', section: 'Thân đoạn', content: 'Nêu dẫn chứng: Dế Mèn biết hối hận và dũng cảm giúp chị Nhà Trò.' },
      { id: 'so-12', section: 'Kết đoạn', content: 'Khẳng định phẩm chất hiệp sĩ và bài học cho em.' }
    ],
    learningQuestion: 'Vì sao người viết lại cho rằng Dế Mèn xứng đáng là một "trang hiệp sĩ tí hon"?',
    creativeMission: 'Hãy chọn một nhân vật cổ tích em mến phục (như cô Tấm, Thạch Sanh) và nêu 1 việc làm tốt của nhân vật đó.'
  },
  {
    id: 'sample-05',
    title: 'Buổi sáng trên cánh đồng quê em',
    gardenType: 'sac_mau',
    volume: 2,
    author: 'Đoạn văn tham khảo lớp 3 (Cô giáo tuyển chọn)',
    content: `Vào những ngày hè về quê ngoại, em thích nhất là được ngắm cánh đồng lúa chín lúc bình minh. Cả cánh đồng trải dài mênh mông như một tấm thảm vàng óng ả dập dờn theo làn gió sớm. Trên từng ngọn lúa trĩu hạt, những giọt sương mai đọng lại lấp lánh như những hạt ngọc trời. Thoang thoảng trong không gian là mùi hương lúa mới thơm ngòn ngọt, thanh khiết. Đứng trước cảnh sắc thanh bình ấy, em càng thêm yêu quý mảnh đất quê hương thân thương của mình.`,
    goodPoints: [
      'Sử dụng nhiều giác quan: thị giác (thảm vàng óng ả, sương lấp lánh), khứu giác (hương lúa mới thơm ngòn ngọt).',
      'Hình ảnh so sánh đẹp: "như tấm thảm vàng", "như những hạt ngọc trời".',
      'Gửi gắm tình yêu quê hương dạt dào.'
    ],
    sampleOutline: [
      { id: 'so-13', section: 'Mở đoạn', content: 'Giới thiệu cánh đồng lúa chín quê ngoại vào buổi sáng bình minh.' },
      { id: 'so-14', section: 'Thân đoạn', content: 'Tả màu sắc tấm thảm vàng, hạt sương lấp lánh và hương lúa thơm thanh khiết.' },
      { id: 'so-15', section: 'Kết đoạn', content: 'Cảm xúc bình yên và tình yêu sâu nặng với quê hương.' }
    ],
    learningQuestion: 'Tìm những từ ngữ miêu tả màu sắc và hương thơm trong đoạn văn trên.',
    creativeMission: 'Tả lại một cảnh thiên nhiên em thấy đẹp mắt (bầu trời hoàng hôn hoặc một góc công viên xanh mát).'
  }
];
