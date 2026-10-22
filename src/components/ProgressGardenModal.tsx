import React, { useState, useEffect } from 'react';
import { Student, Submission, AppSettings } from '../types';
import { Trees, Star, Award, Heart, CheckCircle, Clock, X, Sparkles, BookOpen } from 'lucide-react';

interface ProgressGardenModalProps {
  student: Student;
  settings: AppSettings;
  onClose: () => void;
}

export const ProgressGardenModal: React.FC<ProgressGardenModalProps> = ({
  student,
  settings,
  onClose
}) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubDetail, setSelectedSubDetail] = useState<Submission | null>(null);

  useEffect(() => {
    fetch(`/api/submissions?studentId=${student.id}`)
      .then(res => res.json())
      .then(d => {
        setSubmissions(d.submissions || []);
      })
      .catch(() => {});
  }, [student.id]);

  const treeTitles = [
    'Hạt mầm bé bỏng',
    'Cây non đâm chồi',
    'Cây vươn cành kết nụ',
    'Cây nở hoa rực rỡ',
    'Khu vườn chữ trăm hoa khoe sắc'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl border-3 border-emerald-400 max-w-4xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl relative animate-fade-in space-y-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-3xl">
            {student.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                Hành trình tiến bộ
              </span>
              <span className="text-xs text-stone-500 font-bold">{student.id}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 font-display">
              Khu Vườn Của {settings.demoPrivacyMode ? student.demoName : student.name}
            </h3>
          </div>
        </div>

        {/* The Visual Growing Tree & Flowers Garden */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-sky-100 via-amber-50 to-emerald-100 border-2 border-emerald-300 relative overflow-hidden text-center">
          {/* Garden Level */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 text-emerald-900 border border-emerald-300 text-xs sm:text-sm font-bold shadow-xs mb-3">
            <Trees className="w-4 h-4 text-emerald-600" />
            <span>Cấp độ vườn: {student.treeLevel}/5 – {treeTitles[student.treeLevel - 1] || treeTitles[0]}</span>
          </div>

          {/* Tree SVG Illustration */}
          <div className="py-2 flex justify-center">
            <svg viewBox="0 0 200 160" className="w-44 h-36 drop-shadow-md">
              {/* Hill */}
              <ellipse cx="100" cy="155" rx="80" ry="20" fill="#86efac" />
              {/* Trunk */}
              <path d="M 94 150 Q 92 100 95 80 Q 98 60 100 50 Q 102 60 105 80 Q 108 100 106 150 Z" fill="#78350f" />
              {/* Branches */}
              <path d="M 96 90 Q 75 75 65 70" stroke="#78350f" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 104 85 Q 125 70 135 65" stroke="#78350f" strokeWidth="4" strokeLinecap="round" fill="none" />
              {/* Foliage */}
              <circle cx="100" cy="45" r={25 + student.treeLevel * 6} fill="#22c55e" opacity="0.9" />
              <circle cx="75" cy="65" r={18 + student.treeLevel * 4} fill="#16a34a" opacity="0.85" />
              <circle cx="125" cy="65" r={18 + student.treeLevel * 4} fill="#4ade80" opacity="0.85" />

              {/* Blooming Flowers on tree according to flowers earned */}
              {[...Array(Math.min(student.flowersEarned, 12))].map((_, idx) => {
                const angle = (idx / 12) * Math.PI * 2;
                const fx = 100 + Math.cos(angle) * (20 + (idx % 3) * 10);
                const fy = 55 + Math.sin(angle) * (15 + (idx % 2) * 8);
                return (
                  <g key={idx} transform={`translate(${fx - 6}, ${fy - 6})`}>
                    <circle cx="6" cy="6" r="5" fill="#f43f5e" />
                    <circle cx="6" cy="6" r="2.5" fill="#fde047" />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* 3 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
            <div className="p-3.5 bg-white/95 rounded-2xl border-2 border-pink-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-pink-700 block">
                🌸 1. Bài viết & Bông hoa
              </span>
              <div className="text-xl sm:text-2xl font-black text-pink-950 font-display">
                {submissions.length} bài • {student.flowersEarned} hoa
              </div>
              <p className="text-[11px] text-stone-500 font-semibold">Tích lũy từ các bài đã viết</p>
            </div>

            <div className="p-3.5 bg-white/95 rounded-2xl border-2 border-amber-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 block">
                ⭐ 2. Sao sáng tạo
              </span>
              <div className="text-xl sm:text-2xl font-black text-amber-950 font-display">
                {student.starsEarned} ngôi sao
              </div>
              <p className="text-[11px] text-stone-500 font-semibold">Thưởng từ ý tưởng riêng</p>
            </div>

            <div className="p-3.5 bg-white/95 rounded-2xl border-2 border-emerald-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 block">
                🌳 3. Cây hoa & Rèn luyện
              </span>
              <div className="text-xl sm:text-2xl font-black text-emerald-950 font-display">
                Cấp {student.treeLevel}/5 • {student.learningTimeMinutes || 45} phút
              </div>
              <p className="text-[11px] text-stone-500 font-semibold">{treeTitles[student.treeLevel - 1]}</p>
            </div>
          </div>
        </div>

        {/* 4 Badges (Huy hiệu vinh danh) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <h4 className="font-extrabold text-sm text-purple-950 font-display flex items-center gap-1.5">
              <span>🏅</span>
              <span>4 Huy hiệu vinh danh sự tiến bộ của con</span>
            </h4>
            <span className="text-xs font-bold text-stone-400">Tự động trao tặng</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                id: 'nguoi_khoi_dau',
                name: 'Người khởi đầu',
                icon: '🥉',
                desc: 'Hoàn thành bài viết đầu tiên',
                achieved: submissions.length >= 1
              },
              {
                id: 'cay_but_cham_chi',
                name: 'Cây bút chăm chỉ',
                icon: '🥈',
                desc: 'Viết từ 3 bài trở lên',
                achieved: submissions.length >= 3
              },
              {
                id: 'cay_but_vang',
                name: 'Cây bút vàng',
                icon: '🥇',
                desc: 'Viết từ 5 bài trở lên',
                achieved: submissions.length >= 5
              },
              {
                id: 'bac_thay_tu_vung',
                name: 'Bậc thầy từ vựng',
                icon: '💎',
                desc: 'Cây nở hoa cấp 3 trở lên',
                achieved: student.treeLevel >= 3 || student.flowersEarned >= 6
              }
            ].map((badge) => (
              <div
                key={badge.id}
                className={`p-3 rounded-2xl border-2 text-center space-y-1 transition-all ${
                  badge.achieved
                    ? 'bg-gradient-to-b from-purple-50 to-pink-50 border-purple-300 shadow-2xs'
                    : 'bg-stone-50 border-stone-200 opacity-60'
                }`}
              >
                <div className="text-3xl mx-auto">{badge.icon}</div>
                <h5 className="font-extrabold text-xs text-stone-900">{badge.name}</h5>
                <p className="text-[10px] text-stone-500 font-medium leading-snug">{badge.desc}</p>
                <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-full ${
                  badge.achieved ? 'bg-purple-600 text-white' : 'bg-stone-200 text-stone-600'
                }`}>
                  {badge.achieved ? '✓ Đã đạt' : 'Đang phấn đấu'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 5 Content Progress Bars */}
        <div className="p-4 rounded-2xl bg-sky-50/60 border-2 border-sky-200 space-y-2.5">
          <span className="font-extrabold text-xs text-sky-950 uppercase tracking-wide block">
            📊 Mức độ thành thạo 5 nội dung trọng tâm:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {[
              { label: 'Chính tả', pct: Math.min(100, 70 + student.flowersEarned * 5), color: 'bg-emerald-500' },
              { label: 'Bố cục', pct: Math.min(100, 65 + student.treeLevel * 7), color: 'bg-amber-500' },
              { label: 'Nội dung', pct: Math.min(100, 75 + submissions.length * 6), color: 'bg-purple-500' },
              { label: 'Từ vựng', pct: Math.min(100, 60 + student.starsEarned * 3), color: 'bg-sky-500' },
              { label: 'Cảm xúc', pct: Math.min(100, 80 + student.treeLevel * 4), color: 'bg-pink-500' }
            ].map((c, i) => (
              <div key={i} className="bg-white p-2 rounded-xl border border-sky-100 text-center space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-stone-700">
                  <span>{c.label}</span>
                  <span className="text-sky-800">{c.pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pedagogical Growth Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 space-y-2">
            <h4 className="font-extrabold text-sm text-emerald-950 font-display flex items-center gap-1.5">
              <span>🌸</span>
              <span>Những điều em đã làm rất tốt:</span>
            </h4>
            <ul className="text-xs text-stone-700 space-y-1 font-medium">
              <li>✓ Biết dùng câu mở đoạn tự nhiên, giới thiệu rõ người hoặc cảnh vật.</li>
              <li>✓ Biết chọn lọc chi tiết và cảm xúc của chính mình, không sao chép văn mẫu.</li>
              <li>✓ Tự đọc lại để bổ sung từ ngữ gợi tả và dấu câu.</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 space-y-2">
            <h4 className="font-extrabold text-sm text-amber-950 font-display flex items-center gap-1.5">
              <span>🍃</span>
              <span>Những điều em đang luyện thêm:</span>
            </h4>
            <ul className="text-xs text-stone-700 space-y-1 font-medium">
              <li>• Mở rộng vốn từ ngữ gợi tả âm thanh và màu sắc.</li>
              <li>• Liên kết các câu văn nhịp nhàng, tránh lặp lại từ nối.</li>
              <li>• Tự tin viết đoạn văn độc lập trong phần "Em tự thử sức".</li>
            </ul>
          </div>
        </div>

        {/* Submission History Archive */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-sm text-stone-800 uppercase tracking-wide">
            Nhật ký các bài viết đã hoàn thành ({submissions.length})
          </h4>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="p-3.5 rounded-2xl bg-white border-2 border-stone-200 hover:border-emerald-300 shadow-xs transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-stone-900">{sub.taskTitle}</span>
                    {sub.isIndependentTest && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                        Tự thử sức
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-stone-400 font-medium">
                    {new Date(sub.startedAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <p className="text-xs text-stone-600 line-clamp-2 italic bg-stone-50 p-2 rounded-xl">
                  "{sub.finalContent}"
                </p>

                {sub.teacherFeedback && (
                  <div className="p-2 bg-emerald-50/70 rounded-xl border border-emerald-100 text-xs flex items-center justify-between">
                    <span className="text-emerald-900 font-medium">
                      <strong>Cô nhận xét:</strong> "{sub.teacherFeedback.comment}"
                    </span>
                    <span className="font-bold text-emerald-800 flex-shrink-0 ml-2">
                      {sub.teacherFeedback.flowerSticker || '🌸 Bông hoa chăm ngoan'}
                    </span>
                  </div>
                )}
              </div>
            ))}

            {submissions.length === 0 && (
              <p className="text-xs text-stone-500 italic text-center py-4">
                Em chưa hoàn thành bài viết nào. Hãy vào "Em chọn bài viết" để bắt đầu nhé!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
