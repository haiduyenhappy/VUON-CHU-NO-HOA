import React, { useState, useEffect } from 'react';
import { Student, Submission, AppSettings } from '../types';
import { playPop } from '../utils/audio';
import { 
  Heart, 
  Sparkles, 
  Star, 
  MessageCircle, 
  BookOpen, 
  Trees, 
  Calendar, 
  Award, 
  HelpCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface FamilyPortalProps {
  student: Student;
  settings: AppSettings;
  onBackToGarden: () => void;
  onOpenProgressGarden: () => void;
}

export const FamilyPortal: React.FC<FamilyPortalProps> = ({
  student,
  settings,
  onBackToGarden,
  onOpenProgressGarden
}) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);

  useEffect(() => {
    fetch(`/api/submissions?studentId=${student.id}`)
      .then(r => r.json())
      .then(d => {
        const subs = d.submissions || [];
        setSubmissions(subs);
        if (subs.length > 0) {
          setSelectedSub(subs[0]);
        }
      })
      .catch(() => {});
  }, [student.id]);

  const conversationPrompts = [
    'Hôm nay ở lớp, chi tiết hoặc hoạt động nào làm con nhớ nhất?',
    'Con muốn kể cho bố mẹ nghe về ai trong bài văn hôm nay?',
    'Điều gì khi viết bài khiến con thấy vui và hào hứng nhất?',
    'Con thấy từ ngữ nào con vừa học được là đẹp nhất?',
    'Nếu được vẽ một bức tranh minh họa cho bài viết của con, con sẽ vẽ những màu gì?'
  ];

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-100 via-pink-50 to-amber-100 rounded-3xl p-4 sm:p-5 border-2 border-rose-300 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playPop(settings.soundEnabled);
              onBackToGarden();
            }}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-2xl bg-white hover:bg-stone-50 text-rose-950 border-2 border-rose-300 font-extrabold text-xs sm:text-sm shadow-xs transition-all hover:scale-102"
            title="Quay lại vườn hoa chính"
          >
            <ArrowLeft className="w-4 h-4 text-rose-700" />
            <span>← Quay lại</span>
          </button>

          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border-2 border-rose-400 flex items-center justify-center text-2xl sm:text-3xl shadow-xs">
            🏡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                Góc Gia Đình
              </span>
              <span className="text-xs text-stone-500 font-bold">Mã kết nối: {student.parentCode}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-rose-950 font-display">
              Hành trình học viết của bé {settings.demoPrivacyMode ? student.demoName : student.name}
            </h2>
          </div>
        </div>

        <button
          onClick={onOpenProgressGarden}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-rose-50 text-rose-900 border border-rose-300 font-bold text-xs sm:text-sm shadow-xs transition-colors"
        >
          <Trees className="w-4 h-4 text-emerald-600" />
          <span>Vườn hoa của con ({student.flowersEarned} 🌸)</span>
        </button>
      </div>

      {/* Main Grid: Left is Essay & Teacher Feedback, Right is Family Conversation & Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Bài viết mới của con & Lời cô giáo */}
        <div className="lg:col-span-7 space-y-5">
          {selectedSub ? (
            <div className="bg-white rounded-3xl border-2 border-rose-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-rose-100 pb-2">
                <div>
                  <span className="text-xs font-bold text-rose-700 uppercase tracking-wide">
                    Bài viết mới nhất của con
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 font-display">
                    {selectedSub.taskTitle}
                  </h3>
                </div>
                <div className="flex items-center text-amber-500">
                  {[...Array(selectedSub.teacherFeedback?.confirmedStars || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
              </div>

              {/* The Essay Paragraph */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 leading-relaxed text-stone-800 text-sm sm:text-base font-medium">
                "{selectedSub.finalContent}"
              </div>

              {/* Lời cô giáo gửi gia đình */}
              {selectedSub.teacherFeedback ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900 text-xs sm:text-sm flex items-center gap-1.5">
                      <span>👩‍🏫</span>
                      <span>Lời cô giáo gửi gia đình:</span>
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                      {selectedSub.teacherFeedback.flowerSticker || '🌸 Bông hoa chăm ngoan'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                    "{selectedSub.teacherFeedback.comment}"
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-stone-50 rounded-2xl text-xs text-stone-500 italic">
                  Bài viết đang được cô giáo đọc và sẽ sớm có lời nhận xét gửi đến gia đình.
                </div>
              )}

              {/* Other Submissions by this student */}
              {submissions.length > 1 && (
                <div className="pt-2">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-2">
                    Các bài viết khác của con:
                  </span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {submissions.map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => {
                          playPop(settings.soundEnabled);
                          setSelectedSub(sub);
                        }}
                        className={`p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-colors flex items-center justify-between ${
                          selectedSub.id === sub.id
                            ? 'bg-rose-50 border-rose-400 text-rose-950 font-bold'
                            : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700'
                        }`}
                      >
                        <span className="truncate">{sub.taskTitle}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border-2 border-dashed border-rose-200 p-8 text-center text-stone-500 text-sm">
              Con đang chuẩn bị viết bài đầu tiên trên Vườn Chữ Nở Hoa. Bố mẹ hãy cùng động viên con nhé!
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Điều con làm tốt & Bố mẹ cùng con trò chuyện */}
        <div className="lg:col-span-5 space-y-5">
          {/* Section: Hôm nay con đã học gì? */}
          <div className="bg-white rounded-3xl border-2 border-rose-200 p-5 shadow-sm space-y-3">
            <h4 className="font-extrabold text-sm text-rose-950 font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Hôm nay con đã học gì?</span>
            </h4>
            <div className="space-y-2 text-xs text-stone-700 font-medium">
              <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100 flex items-start gap-2">
                <span className="text-rose-600 font-bold">🌸</span>
                <div>
                  <strong className="text-rose-900 block">Tự lập dàn ý 3 phần:</strong>
                  Con biết sắp xếp ý mở đầu, chi tiết kỷ niệm và cảm xúc kết bài.
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 flex items-start gap-2">
                <span className="text-amber-600 font-bold">✨</span>
                <div>
                  <strong className="text-amber-900 block">Phát triển ý tưởng cá nhân:</strong>
                  Con tự dùng lời văn và kỷ niệm của riêng mình, không sao chép bài mẫu.
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2">
                <span className="text-emerald-600 font-bold">🍃</span>
                <div>
                  <strong className="text-emerald-900 block">Tự sửa bài viết:</strong>
                  Con đã tự đọc lại, bổ sung dấu câu và rèn chữ ngày càng nắn nót.
                </div>
              </div>
            </div>
          </div>

          {/* Section: Bố mẹ cùng con trò chuyện */}
          <div className="bg-gradient-to-b from-white to-amber-50/60 rounded-3xl border-2 border-amber-300 p-5 shadow-sm space-y-3">
            <h4 className="font-extrabold text-sm text-amber-950 font-display flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-amber-600" />
              <span>Bố mẹ cùng con trò chuyện</span>
            </h4>
            <p className="text-xs text-stone-600 font-medium">
              Sau giờ học, bố mẹ có thể hỏi con những câu hỏi nhẹ nhàng để khơi gợi thêm cảm xúc:
            </p>

            <div className="space-y-2">
              {conversationPrompts.map((prompt, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-white border border-amber-200 text-xs text-stone-800 font-semibold shadow-2xs flex items-center gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <span>"{prompt}"</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
