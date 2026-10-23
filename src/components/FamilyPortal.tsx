import React, { useState, useEffect } from 'react';
import { Student, Submission, AppSettings } from '../types';
import { TEACHER_CONFIG } from '../constants/teacherConfig';
import { playPop } from '../utils/audio';
import { getFamilyGreeting } from '../utils/timeGreeting';
import { HoaNhoMascot } from './HoaNhoMascot';
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

  const studentDisplayName = settings.demoPrivacyMode ? student.demoName : student.name;

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
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                Góc Gia Đình
              </span>
              <span className="text-xs text-stone-600 font-bold">Mã kết nối: {student.parentCode}</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                🛡️ Quyền xem an toàn (Chỉ xem)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-rose-950 font-display">
              Hành trình học viết của bé {studentDisplayName}
            </h2>
            {student.linkedCaregivers && student.linkedCaregivers.length > 0 && (
              <p className="text-xs text-stone-600 font-medium">
                Gia đình: {student.linkedCaregivers.map(cg => `${cg.relation} (${cg.name})`).join(' • ')}
              </p>
            )}
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

      {/* Hoa Nhỏ Family Greeting */}
      <div className="flex justify-start">
        <HoaNhoMascot
          mood="happy"
          size="sm"
          reducedMotion={settings.reducedMotion}
          message={getFamilyGreeting(studentDisplayName, student.flowersEarned)}
        />
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

              {/* Lời cô giáo gửi gia đình (Chỉ hiển thị khi đã công bố) */}
              {selectedSub.teacherFeedback && selectedSub.teacherFeedback.status !== 'draft' ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900 text-xs sm:text-sm flex items-center gap-1.5">
                      <span>👩‍🏫</span>
                      <span>Lời nhận xét chính thức từ {selectedSub.teacherFeedback.teacherName || TEACHER_CONFIG.name}:</span>
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                      {selectedSub.teacherFeedback.flowerSticker || '🌸 Bông hoa chăm ngoan'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-semibold italic bg-white p-3 rounded-xl border border-emerald-100">
                    "{selectedSub.teacherFeedback.comment}"
                  </p>

                  {/* 4 Qualitative criteria details if available */}
                  {(selectedSub.teacherFeedback.praiseIdea || selectedSub.teacherFeedback.wordSentenceSuggestions || selectedSub.teacherFeedback.emotionCreativityEncouragement) && (
                    <div className="space-y-2 pt-1 text-xs">
                      {selectedSub.teacherFeedback.praiseIdea && (
                        <div className="bg-rose-50/80 p-2.5 rounded-xl border border-rose-200">
                          <strong className="text-rose-900 block font-bold">🌸 Ý tưởng nổi bật:</strong>
                          <span className="text-stone-700">{selectedSub.teacherFeedback.praiseIdea}</span>
                        </div>
                      )}
                      {selectedSub.teacherFeedback.wordSentenceSuggestions && (
                        <div className="bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200">
                          <strong className="text-emerald-900 block font-bold">✏️ Góp ý dùng từ & diễn đạt:</strong>
                          <span className="text-stone-700">{selectedSub.teacherFeedback.wordSentenceSuggestions}</span>
                        </div>
                      )}
                      {selectedSub.teacherFeedback.emotionCreativityEncouragement && (
                        <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200">
                          <strong className="text-amber-900 block font-bold">💖 Khích lệ tinh thần:</strong>
                          <span className="text-stone-700">{selectedSub.teacherFeedback.emotionCreativityEncouragement}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-stone-50 rounded-2xl text-xs text-stone-500 italic">
                  Bài viết đang được cô giáo đọc và sẽ sớm công bố lời nhận xét ân cần gửi đến gia đình.
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
                  Con tự do lựa chọn chi tiết độc đáo từ chính trải nghiệm thật của mình.
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2">
                <span className="text-emerald-600 font-bold">🍃</span>
                <div>
                  <strong className="text-emerald-900 block">Học cách tự soát lỗi:</strong>
                  Con biết đọc lại câu chữ, chú ý ngắt nghỉ và dùng từ ngữ biểu cảm.
                </div>
              </div>
            </div>
          </div>

          {/* Section: Gợi ý trò chuyện cùng con */}
          <div className="bg-white rounded-3xl border-2 border-rose-200 p-5 shadow-sm space-y-3">
            <h4 className="font-extrabold text-sm text-rose-950 font-display flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-rose-600" />
              <span>Gợi ý để bố mẹ trò chuyện cùng con:</span>
            </h4>
            <ul className="space-y-2 text-xs text-stone-700">
              {conversationPrompts.map((prompt, index) => (
                <li key={index} className="flex items-start gap-2 p-2 rounded-xl bg-stone-50 border border-stone-100">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{prompt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
