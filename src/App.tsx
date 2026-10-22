/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Student, AppSettings, EssayGenre, OutlineItem, Submission } from './types';
import { INITIAL_STUDENTS } from './data/studentsData';
import { Navbar, AppView } from './components/Navbar';
import { GardenScene } from './components/GardenScene';
import { StudentPortal } from './components/StudentPortal';
import { TeacherPortal } from './components/TeacherPortal';
import { FamilyPortal } from './components/FamilyPortal';
import { ReadingGarden } from './components/ReadingGarden';
import { ProgressGardenModal } from './components/ProgressGardenModal';
import { IdeaMapPage } from './components/IdeaMapPage';
import { EssayFeedbackPage } from './components/EssayFeedbackPage';
import { playPop, playChime } from './utils/audio';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [activeStudent, setActiveStudent] = useState<Student | null>(INITIAL_STUDENTS[0]); // Default to first student so features can be used immediately
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);

  // Shared state connecting Trang 1 (Bản đồ ý tưởng) & Trang 2 (Cô góp ý bài văn)
  const [sharedPrompt, setSharedPrompt] = useState<string>('Kể lại một hoạt động ngoài trời em đã tham gia cùng người thân hoặc bạn bè.');
  const [sharedGrade, setSharedGrade] = useState<number>(3);
  const [sharedGenre, setSharedGenre] = useState<EssayGenre>('ke_su_viec');
  const [sharedSpecialWishes, setSharedSpecialWishes] = useState<string>('Có hình ảnh so sánh, kể thật từ trải nghiệm của em');
  const [sharedOutline, setSharedOutline] = useState<OutlineItem[]>([
    { id: '1', section: 'Mở đoạn', content: 'Giới thiệu hoạt động ngoài trời diễn ra vào lúc nào và ở đâu.' },
    { id: '2', section: 'Thân đoạn', content: 'Kể lại các chi tiết nổi bật và diễn biến hoạt động cùng người thân.' },
    { id: '3', section: 'Kết đoạn', content: 'Cảm xúc vui sướng và kỷ niệm khó quên trong lòng em.' }
  ]);
  const [sharedEssayText, setSharedEssayText] = useState<string>('');

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('vuonchu_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      soundEnabled: true,
      reducedMotion: false,
      demoPrivacyMode: false
    };
  });

  // Save settings
  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...newSettings };
      try {
        localStorage.setItem('vuonchu_settings', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Fetch current students database from server
  const loadStudents = async () => {
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      if (data.students && Array.isArray(data.students) && data.students.length > 0) {
        setStudents(data.students);
        if (!activeStudent) {
          setActiveStudent(data.students[0]);
        }
      }
    } catch (e) {
      console.warn('Could not load students from server, using local list:', e);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Update active student in list
  const handleUpdateStudent = (updatedStudent: Student) => {
    setActiveStudent(updatedStudent);
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  // Select Role from Garden Scene
  const handleSelectRole = (role: 'student' | 'teacher' | 'family', selectedStudent?: Student) => {
    playPop(settings.soundEnabled);
    if (selectedStudent) {
      setActiveStudent(selectedStudent);
    }
    setCurrentView(role);
  };

  const handleLogout = () => {
    playPop(settings.soundEnabled);
    setCurrentView('home');
  };

  // Transfer from Trang 1 to Trang 2
  const handleProceedToWrite = (data: {
    prompt: string;
    grade: number;
    genre: EssayGenre;
    specialWishes: string;
    selectedOutline: OutlineItem[];
  }) => {
    setSharedPrompt(data.prompt);
    setSharedGrade(data.grade);
    setSharedGenre(data.genre);
    setSharedSpecialWishes(data.specialWishes);
    setSharedOutline(data.selectedOutline);
    setCurrentView('essay_feedback');
  };

  // When task selected from library to Idea Map
  const handleTransferTaskToIdeaMap = (prompt: string, genre: EssayGenre = 'ke_su_viec') => {
    setSharedPrompt(prompt);
    setSharedGenre(genre);
    setCurrentView('idea_map');
  };

  // Handle saving submission from Trang 2
  const handleSaveSubmission = (submissionData: Partial<Submission>) => {
    if (activeStudent) {
      const updated: Student = {
        ...activeStudent,
        flowersEarned: activeStudent.flowersEarned + 1,
        starsEarned: activeStudent.starsEarned + 4,
        treeLevel: Math.min(5, Math.floor((activeStudent.flowersEarned + 1) / 3) + 1)
      };
      handleUpdateStudent(updated);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      settings.reducedMotion ? 'motion-reduce' : ''
    }`}>
      {/* Top Navbar */}
      <Navbar
        currentRole={currentView}
        activeStudent={activeStudent}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onNavigate={(view) => {
          playPop(settings.soundEnabled);
          setCurrentView(view);
        }}
        onLogout={handleLogout}
        onOpenProgressModal={() => setIsProgressModalOpen(true)}
      />

      {/* Main Views */}
      <main className="flex-1 bg-gradient-to-b from-pink-50/30 via-purple-50/20 to-sky-50/30">
        {currentView === 'home' && (
          <GardenScene
            students={students}
            settings={settings}
            onSelectRole={handleSelectRole}
            onOpenReadingGarden={() => {
              playPop(settings.soundEnabled);
              setCurrentView('reading_garden');
            }}
          />
        )}

        {/* TRANG 1: BẢN ĐỒ Ý TƯỞNG */}
        {currentView === 'idea_map' && (
          <IdeaMapPage
            student={activeStudent || students[0]}
            settings={settings}
            initialPrompt={sharedPrompt}
            initialGenre={sharedGenre}
            onProceedToWrite={handleProceedToWrite}
            onBackToGarden={() => setCurrentView('home')}
          />
        )}

        {/* TRANG 2: CÔ GÓP Ý BÀI VĂN */}
        {currentView === 'essay_feedback' && (
          <EssayFeedbackPage
            student={activeStudent || students[0]}
            settings={settings}
            initialPrompt={sharedPrompt}
            initialGrade={sharedGrade}
            initialGenre={sharedGenre}
            initialSpecialWishes={sharedSpecialWishes}
            initialOutline={sharedOutline}
            initialEssayText={sharedEssayText}
            onBackToIdeaMap={() => setCurrentView('idea_map')}
            onSaveSubmission={handleSaveSubmission}
            onOpenProgressGarden={() => setIsProgressModalOpen(true)}
          />
        )}

        {/* THƯ VIỆN BÀI TẬP / GÓC HỌC TẬP CỦA EM */}
        {currentView === 'student' && activeStudent && (
          <StudentPortal
            student={activeStudent}
            settings={settings}
            onUpdateStudent={handleUpdateStudent}
            onBackToGarden={() => setCurrentView('home')}
            onOpenProgressGarden={() => setIsProgressModalOpen(true)}
            onOpenReadingGarden={() => {
              playPop(settings.soundEnabled);
              setCurrentView('reading_garden');
            }}
            onGoToIdeaMap={(prompt, grade, genre) => {
              setSharedPrompt(prompt);
              setSharedGrade(grade);
              setSharedGenre(genre);
              setCurrentView('idea_map');
            }}
          />
        )}

        {/* GÓC CÔ GIÁO */}
        {currentView === 'teacher' && (
          <TeacherPortal
            students={students}
            settings={settings}
            onBackToGarden={() => setCurrentView('home')}
          />
        )}

        {/* GÓC GIA ĐÌNH */}
        {currentView === 'family' && activeStudent && (
          <FamilyPortal
            student={activeStudent}
            settings={settings}
            onBackToGarden={() => setCurrentView('home')}
            onOpenProgressGarden={() => setIsProgressModalOpen(true)}
          />
        )}

        {/* VƯỜN ĐỌC THÚ VỊ / THƯ VIỆN */}
        {currentView === 'reading_garden' && (
          <ReadingGarden
            settings={settings}
            onBack={() => {
              playPop(settings.soundEnabled);
              setCurrentView('home');
            }}
          />
        )}
      </main>

      {/* Universal Footer with Teacher Attribution */}
      <footer className="w-full py-3.5 sm:py-4 px-4 bg-gradient-to-r from-pink-50 via-purple-50 to-sky-50 border-t border-pink-200/80 text-center shadow-xs">
        <p className="text-xs sm:text-sm text-stone-700 font-medium">
          Được phát triển bởi <strong className="font-extrabold text-purple-950">NGUYỄN THỊ HẢI DUYÊN</strong> – Giáo viên trường Tiểu học Lê Đức Thọ
        </p>
      </footer>

      {/* Progress Garden Modal */}
      {isProgressModalOpen && activeStudent && (
        <ProgressGardenModal
          student={activeStudent}
          settings={settings}
          onClose={() => setIsProgressModalOpen(false)}
        />
      )}
    </div>
  );
}
