import React, { useState } from 'react';
import { SAMPLE_READINGS } from '../data/readingGardenData';
import { GARDEN_INFOS } from '../data/curriculumData';
import { SampleReading, GardenType, AppSettings } from '../types';
import { playPop } from '../utils/audio';
import { BookOpen, Sparkles, HelpCircle, ArrowLeft, Lightbulb, Compass, Award } from 'lucide-react';

interface ReadingGardenProps {
  settings: AppSettings;
  onBack: () => void;
}

export const ReadingGarden: React.FC<ReadingGardenProps> = ({ settings, onBack }) => {
  const [selectedGarden, setSelectedGarden] = useState<GardenType | 'all'>('all');
  const [activeSample, setActiveSample] = useState<SampleReading>(SAMPLE_READINGS[0]);

  const filteredSamples = SAMPLE_READINGS.filter(s => {
    return selectedGarden === 'all' || s.gardenType === selectedGarden;
  });

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-100 via-rose-50 to-emerald-100 rounded-3xl p-5 border-2 border-amber-300 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white border-2 border-amber-400 flex items-center justify-center text-3xl shadow-xs">
            📚
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-white">
                Vườn Đọc Thú Vị
              </span>
              <span className="text-xs text-stone-500 font-bold">Đoạn văn tham khảo Lớp 3 chọn lọc</span>
            </div>
            <h2 className="text-2xl font-black text-amber-950 font-display">
              Đọc để cảm nhận – Học cách diễn đạt hay
            </h2>
          </div>
        </div>

        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 font-bold text-xs sm:text-sm shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Trở về</span>
        </button>
      </div>

      {/* Pedagogical Notice */}
      <div className="p-3.5 bg-amber-50 border-2 border-amber-200 rounded-2xl text-xs sm:text-sm text-stone-700 font-medium flex items-center gap-2.5">
        <span className="text-xl">🌸</span>
        <span>
          <strong>Hoa Nhỏ nhắn em:</strong> Các bài viết ở đây để em đọc thư giãn, học từ ngữ đẹp và cách quan sát tinh tế. Mỗi em hãy viết bằng lời văn và cảm xúc của chính mình, không sao chép nhé!
        </span>
      </div>

      {/* Filter by Garden */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => { setSelectedGarden('all'); playPop(settings.soundEnabled); }}
          className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-colors ${
            selectedGarden === 'all'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          Tất cả bài đọc
        </button>
        {(Object.keys(GARDEN_INFOS) as GardenType[]).map(key => (
          <button
            key={key}
            onClick={() => { setSelectedGarden(key); playPop(settings.soundEnabled); }}
            className={`px-3 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
              selectedGarden === key
                ? 'bg-amber-200 text-amber-900 border border-amber-400 font-extrabold shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <span>{GARDEN_INFOS[key].icon}</span>
            <span>{GARDEN_INFOS[key].name}</span>
          </button>
        ))}
      </div>

      {/* Reading Grid: List on Left, Active Sample on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sample List (4 cols) */}
        <div className="lg:col-span-4 space-y-2.5">
          <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wide block mb-1">
            Danh mục bài đọc ({filteredSamples.length})
          </span>
          {filteredSamples.map(sample => {
            const isSelected = activeSample.id === sample.id;
            const garden = GARDEN_INFOS[sample.gardenType];
            return (
              <div
                key={sample.id}
                onClick={() => {
                  playPop(settings.soundEnabled);
                  setActiveSample(sample);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-2 border-amber-400 shadow-md ring-2 ring-amber-200'
                    : 'bg-white border-stone-200 hover:border-amber-200 hover:bg-amber-50/40'
                }`}
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700 mb-1">
                  <span>{garden.icon}</span>
                  <span>{garden.name}</span>
                  <span>•</span>
                  <span>Tập {sample.volume}</span>
                </div>
                <h4 className="font-bold text-sm text-stone-900 font-display">
                  {sample.title}
                </h4>
                <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                  {sample.content}
                </p>
              </div>
            );
          })}
        </div>

        {/* Active Sample Reader (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border-2 border-amber-300 p-5 sm:p-6 shadow-md space-y-5">
          <div className="border-b border-amber-100 pb-3">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
              {GARDEN_INFOS[activeSample.gardenType].name}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-amber-950 font-display mt-1">
              {activeSample.title}
            </h3>
            <p className="text-xs text-stone-400 font-medium mt-0.5">
              {activeSample.author}
            </p>
          </div>

          {/* Reading text styled like a friendly book */}
          <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/40 border border-amber-200 text-base sm:text-lg leading-relaxed text-stone-800 font-medium shadow-inner">
            <p className="indent-6">{activeSample.content}</p>
          </div>

          {/* Điều hay trong bài */}
          <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 space-y-2">
            <h4 className="font-extrabold text-sm text-emerald-950 font-display flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-emerald-600" />
              <span>Điều hay trong bài để em học tập:</span>
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm text-stone-700 font-medium">
              {activeSample.goodPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Dàn ý minh họa */}
          <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 space-y-2">
            <h4 className="font-extrabold text-sm text-rose-950 font-display flex items-center gap-2">
              <Compass className="w-4 h-4 text-rose-600" />
              <span>Dàn ý minh họa của bài viết:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {activeSample.sampleOutline.map(item => (
                <div key={item.id} className="p-2.5 rounded-xl bg-white border border-rose-100 text-xs">
                  <span className="font-bold text-rose-800 block text-[10px] uppercase">{item.section}</span>
                  <p className="text-stone-700 mt-0.5">{item.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Câu hỏi giúp em học cách viết & Nhiệm vụ mới để tự sáng tạo */}
          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-2">
            <div className="space-y-1">
              <span className="font-bold text-amber-900 text-xs sm:text-sm flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>Câu hỏi suy ngẫm:</span>
              </span>
              <p className="text-xs sm:text-sm text-stone-700 font-medium pl-6">
                {activeSample.learningQuestion}
              </p>
            </div>

            <div className="pt-2 border-t border-amber-200/80 space-y-1">
              <span className="font-bold text-emerald-800 text-xs sm:text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Nhiệm vụ mới để em tự sáng tạo:</span>
              </span>
              <p className="text-xs sm:text-sm text-stone-800 font-bold pl-6">
                {activeSample.creativeMission}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
