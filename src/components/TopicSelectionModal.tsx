import React, { useState, useMemo } from 'react';
import { WritingTask, GardenType, EssayGenre } from '../types';
import { CURRICULUM_TASKS, GARDEN_INFOS } from '../data/curriculumData';
import { OTHER_CREATIVE_TOPICS, OTHER_TOPICS_CATEGORIES } from '../data/otherTopicsData';
import { TOPIC_GROUPS } from '../utils/promptAnalyzerEngine';
import { playPop, playSparkle } from '../utils/audio';
import { 
  X, 
  Search, 
  BookOpen, 
  Sparkles, 
  GraduationCap, 
  Layers, 
  Check, 
  Filter,
  PenTool,
  Clock
} from 'lucide-react';

interface TopicSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPrompt: string;
  currentGrade: number;
  onSelectTopic: (task: {
    prompt: string;
    grade: number;
    genre: EssayGenre;
    title: string;
    suggestedQuestions?: string[];
  }) => void;
  soundEnabled?: boolean;
}

export const TopicSelectionModal: React.FC<TopicSelectionModalProps> = ({
  isOpen,
  onClose,
  currentPrompt,
  currentGrade,
  onSelectTopic,
  soundEnabled = true
}) => {
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>(currentGrade || 3);
  const [selectedVolumeTab, setSelectedVolumeTab] = useState<'all' | 'tap1' | 'tap2' | 'other'>('all');
  const [selectedGarden, setSelectedGarden] = useState<GardenType | 'all'>('all');
  const [selectedTopicCode, setSelectedTopicCode] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Combine curriculum tasks and other creative topics into a unified selectable list
  const allAvailableTasks = useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      prompt: string;
      grade: number;
      volume: 1 | 2 | null;
      gardenType: GardenType;
      genre: EssayGenre;
      gradeMission?: string;
      expectedLength?: string;
      textbookRef?: string;
      isCreative?: boolean;
      suggestedQuestions?: string[];
    }> = [];

    // Curriculum tasks
    CURRICULUM_TASKS.forEach(t => {
      list.push({
        id: t.id,
        title: t.title,
        prompt: t.prompt,
        grade: t.grade || 3,
        volume: t.volume,
        gardenType: t.gardenType,
        genre: t.genre || 'ke_su_viec',
        gradeMission: t.gradeMission,
        expectedLength: t.expectedLength,
        textbookRef: t.textbookRef,
        isCreative: false,
        suggestedQuestions: t.suggestedQuestions
      });
    });

    // Creative topics
    OTHER_CREATIVE_TOPICS.forEach(ot => {
      let garden: GardenType = 'sac_mau';
      if (ot.category === 'gia_dinh') garden = 'yeu_thuong';
      else if (ot.category === 'truong_hoc') garden = 'sac_mau';
      else if (ot.category === 'tuong_tuong' || ot.category === 'uoc_mo') garden = 'y_kien';
      else if (ot.category === 'muon_ke') garden = 'ke_chuyen';

      list.push({
        id: ot.id,
        title: ot.title,
        prompt: ot.prompt,
        grade: ot.suggestedGrade || 3,
        volume: null,
        gardenType: garden,
        genre: ot.suggestedGenre,
        gradeMission: 'Chủ đề sáng tạo mở rộng',
        expectedLength: 'Đoạn văn hoặc bài văn tự chọn',
        textbookRef: `Chủ đề: ${ot.title}`,
        isCreative: true,
        suggestedQuestions: []
      });
    });

    return list;
  }, []);

  // Filtered items
  const filteredTasks = useMemo(() => {
    return allAvailableTasks.filter(item => {
      // Grade filter (1–5)
      if (selectedGrade !== 'all' && item.grade !== selectedGrade) {
        return false;
      }

      // Volume / Category filter
      if (selectedVolumeTab === 'tap1' && item.volume !== 1) return false;
      if (selectedVolumeTab === 'tap2' && item.volume !== 2) return false;
      if (selectedVolumeTab === 'other' && !item.isCreative) return false;

      // Garden filter
      if (selectedGarden !== 'all' && item.gardenType !== selectedGarden) {
        return false;
      }

      // Topic group filter (25 nhóm chủ đề GDPT 2018)
      if (selectedTopicCode !== 'all') {
        const found = TOPIC_GROUPS.find(t => t.code === selectedTopicCode);
        if (found) {
          const qName = found.name.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(qName);
          const matchPrompt = item.prompt.toLowerCase().includes(qName);
          const matchDesc = found.description.toLowerCase().split(', ').some(w => item.prompt.toLowerCase().includes(w));
          if (!matchTitle && !matchPrompt && !matchDesc) return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchPrompt = item.prompt.toLowerCase().includes(query);
        const matchRef = (item.textbookRef || '').toLowerCase().includes(query);
        if (!matchTitle && !matchPrompt && !matchRef) return false;
      }

      return true;
    });
  }, [allAvailableTasks, selectedGrade, selectedVolumeTab, selectedGarden, selectedTopicCode, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border-2 border-pink-200 overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-pink-50 via-purple-50 to-amber-50 border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white border border-pink-300 flex items-center justify-center text-xl shadow-xs">
              📚
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-pink-950 font-display">
                Kho bài tập Tiếng Việt Lớp 1 – 5
              </h3>
              <p className="text-xs text-stone-600 font-medium">
                Chọn một đề bài phù hợp theo chương trình GDPT 2018 để luyện viết cùng Hoa Nhỏ
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playPop(soundEnabled);
              onClose();
            }}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter controls */}
        <div className="p-4 bg-stone-50/80 border-b border-stone-200 space-y-3 shrink-0">
          {/* Row 1: Grade buttons (Lớp 1 - 5) */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-xs font-bold text-stone-700 flex items-center gap-1 mr-1">
              <GraduationCap className="w-4 h-4 text-purple-600" />
              <span>Khối lớp:</span>
            </span>

            <button
              onClick={() => { playPop(soundEnabled); setSelectedGrade('all'); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedGrade === 'all'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-purple-50'
              }`}
            >
              Tất cả khối
            </button>

            {[1, 2, 3, 4, 5].map(g => (
              <button
                key={g}
                onClick={() => { playPop(soundEnabled); setSelectedGrade(g); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  selectedGrade === g
                    ? 'bg-purple-700 text-white shadow-xs scale-105 ring-2 ring-purple-300'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-purple-50'
                }`}
              >
                Lớp {g}
              </button>
            ))}
          </div>

          {/* Row 2: Category & Search input */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Volume selector tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => { playPop(soundEnabled); setSelectedVolumeTab('all'); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedVolumeTab === 'all'
                    ? 'bg-stone-800 text-white shadow-xs'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                Tất cả nguồn
              </button>
              <button
                onClick={() => { playPop(soundEnabled); setSelectedVolumeTab('tap1'); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedVolumeTab === 'tap1'
                    ? 'bg-amber-500 text-amber-950 shadow-xs'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                📘 SGK Tập 1
              </button>
              <button
                onClick={() => { playPop(soundEnabled); setSelectedVolumeTab('tap2'); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedVolumeTab === 'tap2'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                📗 SGK Tập 2
              </button>
              <button
                onClick={() => { playPop(soundEnabled); setSelectedVolumeTab('other'); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedVolumeTab === 'other'
                    ? 'bg-pink-600 text-white shadow-xs'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                🌈 Mở rộng sáng tạo
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* 25 Chủ đề mở GDPT 2018 selector */}
              <select
                value={selectedTopicCode}
                onChange={(e) => {
                  playPop(soundEnabled);
                  setSelectedTopicCode(e.target.value);
                }}
                className="text-xs font-bold text-stone-700 bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 focus:border-purple-400 focus:outline-hidden max-w-[170px] truncate"
              >
                <option value="all">Tất cả 25 chủ đề</option>
                {TOPIC_GROUPS.map((tg) => (
                  <option key={tg.code} value={tg.code}>
                    {tg.code}: {tg.name}
                  </option>
                ))}
              </select>

              {/* Keyword search box */}
              <div className="relative min-w-[160px] sm:w-56">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm tên đề, từ khóa..."
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs font-medium focus:outline-hidden focus:border-purple-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Row 3: Garden filter pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-[11px] font-bold text-stone-500 mr-1">Vườn:</span>
            <button
              onClick={() => { playPop(soundEnabled); setSelectedGarden('all'); }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                selectedGarden === 'all'
                  ? 'bg-stone-700 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              Tất cả
            </button>
            {(Object.keys(GARDEN_INFOS) as GardenType[]).map(g => (
              <button
                key={g}
                onClick={() => { playPop(soundEnabled); setSelectedGarden(g); }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                  selectedGarden === g
                    ? `${GARDEN_INFOS[g].bgLight} ${GARDEN_INFOS[g].color} border-2 ${GARDEN_INFOS[g].border}`
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                <span>{GARDEN_INFOS[g].icon}</span>
                <span>{GARDEN_INFOS[g].name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Task list container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="text-4xl">🔍</div>
              <p className="text-sm font-bold text-stone-600">
                Không tìm thấy bài tập nào phù hợp với bộ lọc hiện tại.
              </p>
              <button
                onClick={() => {
                  setSelectedGrade('all');
                  setSelectedVolumeTab('all');
                  setSelectedGarden('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs"
              >
                Đặt lại tất cả bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredTasks.map(task => {
                const isCurrent = currentPrompt.trim() === task.prompt.trim();
                const gardenInfo = GARDEN_INFOS[task.gardenType];

                return (
                  <div
                    key={task.id}
                    onClick={() => {
                      playSparkle(soundEnabled);
                      onSelectTopic({
                        prompt: task.prompt,
                        grade: task.grade,
                        genre: task.genre,
                        title: task.title,
                        suggestedQuestions: task.suggestedQuestions
                      });
                      onClose();
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between hover:scale-[1.01] ${
                      isCurrent
                        ? 'bg-purple-50/70 border-purple-500 shadow-md ring-2 ring-purple-200'
                        : 'bg-white border-stone-200 hover:border-pink-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="space-y-2">
                      {/* Badges: Grade + Garden + Volume */}
                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 font-extrabold text-[11px] border border-purple-300">
                            Lớp {task.grade}
                          </span>
                          {task.volume && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 font-bold text-[10px] border border-amber-200">
                              Tập {task.volume}
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${gardenInfo.bgLight} ${gardenInfo.color} border ${gardenInfo.border}`}>
                            {gardenInfo.icon} {gardenInfo.name}
                          </span>
                        </div>

                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Đang làm
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="text-sm font-bold text-stone-900 font-display line-clamp-1">
                        {task.title}
                      </h4>

                      {/* Prompt verbatim */}
                      <p className="text-xs text-stone-700 leading-relaxed font-medium line-clamp-3">
                        "{task.prompt}"
                      </p>

                      {/* Mission / Expected Length */}
                      {(task.gradeMission || task.expectedLength) && (
                        <div className="pt-1 flex items-center gap-2 text-[11px] text-purple-800 font-semibold">
                          <span>🎯 {task.gradeMission || 'Yêu cầu'}</span>
                          {task.expectedLength && (
                            <span>• 📏 {task.expectedLength}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action footer */}
                    <div className="pt-3 border-t border-stone-100 mt-2 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-stone-500 truncate max-w-[200px]">
                        {task.textbookRef || 'Chương trình GDPT 2018'}
                      </span>
                      <span className="font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1">
                        <span>Chọn đề này</span>
                        <span>→</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal footer */}
        <div className="p-3 sm:p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-stone-500 font-medium">
            Tìm thấy <strong className="text-purple-900">{filteredTasks.length}</strong> bài tập phù hợp
          </span>
          <button
            onClick={() => {
              playPop(soundEnabled);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 font-bold text-xs"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
