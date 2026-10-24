/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Student, AppSettings, EssayGenre, OutlineItem, Submission, AuthUser } from './types';
import { INITIAL_STUDENTS } from './data/studentsData';
import { TEACHER_CONFIG } from './constants/teacherConfig';
import { Navbar, AppView } from './components/Navbar';
import { GardenScene } from './components/GardenScene';
import { LoginView } from './components/LoginView';
import { StudentPortal } from './components/StudentPortal';
import { TeacherPortal } from './components/TeacherPortal';
import { FamilyPortal } from './components/FamilyPortal';
import { ReadingGarden } from './components/ReadingGarden';
import { ProgressGardenModal } from './components/ProgressGardenModal';
import { ProgressJourneyPage } from './components/ProgressJourneyPage';
import { IdeaMapPage } from './components/IdeaMapPage';
import { EssayFeedbackPage } from './components/EssayFeedbackPage';
import { playPop, playChime } from './utils/audio';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('vuonchu_auth_session');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  const [currentView, setCurrentView] = useState<AppView>(() => {
    try {
      const saved = localStorage.getItem('vuonchu_auth_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.role) return parsed.role;
      }
    } catch (e) {}
    return 'home';
  });

  // Track the previous view so back buttons navigate to the exact caller without losing state or session
  const [returnToView, setReturnToView] = useState<AppView>('home');

  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [activeStudent, setActiveStudent] = useState<Student | null>(() => {
    try {
      const saved = localStorage.getItem('vuonchu_auth_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.student) return parsed.student;
      }
    } catch (e) {}
    return INITIAL_STUDENTS[0];
  });
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);

  const [sharedPrompt, setSharedPrompt] = useState<string>('Viết một đoạn văn giới thiệu về bản thân em: họ tên, sở thích, ước mơ và một điểm đặc biệt của mình.');
  const [sharedGrade, setSharedGrade] = useState<number>(3);
  const [sharedGenre, setSharedGenre] = useState<EssayGenre>('khac');
  const [sharedSpecialWishes, setSharedSpecialWishes] = useState<string>('Có sử dụng từ láy, thể hiện cảm xúc chân thật');
  const [sharedOutline, setSharedOutline] = useState<OutlineItem[]>([
    { id: '1', section: 'Mở đoạn', content: 'Giới thiệu họ tên và một nét chung nhất về bản thân con.' },
    { id: '2', section: 'Thân đoạn', content: 'Chia sẻ sở thích, ước mơ và một điểm đặc biệt khiến con tự hào là chính mình.' },
    { id: '3', section: 'Kết đoạn', content: 'Nêu cảm nghĩ hoặc điều con mong muốn mọi người hiểu và nhớ về mình.' }
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
        if (activeStudent) {
          const synced = data.students.find((s: Student) => s.id === activeStudent.id);
          if (synced) setActiveStudent(synced);
        }
      }
    } catch (e) {
      console.warn('Could not load remote students, using default list:', e);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    if (activeStudent?.id === updatedStudent.id) {
      setActiveStudent(updatedStudent);
    }
    if (currentUser?.role === 'student') {
      const updatedUser = { ...currentUser, student: updatedStudent };
      setCurrentUser(updatedUser);
      try {
        localStorage.setItem('vuonchu_auth_session', JSON.stringify(updatedUser));
      } catch (e) {}
    }
  };

  // Login handler
  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('vuonchu_auth_session', JSON.stringify(user));
    } catch (e) {}

    if (user.role === 'student' && user.student) {
      setActiveStudent(user.student);
      setCurrentView('student');
    } else if (user.role === 'teacher') {
      setCurrentView('teacher');
    } else if (user.role === 'family') {
      if (user.student) {
        setActiveStudent(user.student);
      }
      setCurrentView('family');
    }
  };

  // Logout handler
  const handleLogout = () => {
    playPop(settings.soundEnabled);
    setCurrentUser(null);
    try {
      localStorage.removeItem('vuonchu_auth_session');
    } catch (e) {}
    setCurrentView('home');
  };

  // Navigation from Top Navbar or Home Gate
  const handleNavigate = (view: AppView) => {
    playPop(settings.soundEnabled);

    // Save previous view if moving forward to subpages
    if (['idea_map', 'essay_feedback', 'reading_garden', 'progress_journey'].includes(view)) {
      setReturnToView(currentView);
    }

    if (view === 'student') {
      if (currentUser?.role === 'student') {
        setCurrentView('student');
      } else {
        setCurrentView('login-student');
      }
      return;
    }

    if (view === 'teacher') {
      if (currentUser?.role === 'teacher') {
        setCurrentView('teacher');
      } else {
        setCurrentView('login-teacher');
      }
      return;
    }

    if (view === 'family') {
      if (currentUser?.role === 'family') {
        setCurrentView('family');
      } else {
        setCurrentView('login-family');
      }
      return;
    }

    setCurrentView(view);
  };

  // Proceed from IdeaMapPage to EssayFeedbackPage
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
    setSharedOutline(data.selectedOutline);
    setSharedSpecialWishes(data.specialWishes);
    setReturnToView('idea_map');
    setCurrentView('essay_feedback');
  };

  // Save submission callback from EssayFeedbackPage
  const handleSaveSubmission = async (newSub: Partial<Submission>) => {
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSub)
      });
      const data = await res.json();
      if (data.success && activeStudent) {
        handleUpdateStudent({
          ...activeStudent,
          flowersEarned: activeStudent.flowersEarned + 1,
          starsEarned: activeStudent.starsEarned + 5
        });
      }
    } catch (e) {
      console.error('Error saving submission:', e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#eefaf3] text-stone-800 antialiased selection:bg-pink-200 selection:text-pink-900">
      {/* Universal Sticky Top Navbar */}
      <Navbar
        currentRole={currentView}
        currentUser={currentUser}
        activeStudent={activeStudent}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onOpenProgressModal={() => {
          setReturnToView(currentView);
          setCurrentView('progress_journey');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* TRANG CHỦ HOÀN CHỈNH: 3 CÁNH CỔNG NẰM NGANG */}
        {currentView === 'home' && (
          <GardenScene
            students={students}
            settings={settings}
            onNavigateToLogin={(role) => handleNavigate(role)}
            onOpenReadingGarden={() => {
              setReturnToView('home');
              setCurrentView('reading_garden');
            }}
          />
        )}

        {/* TRANG ĐĂNG NHẬP RIÊNG BIỆT 1: GÓC CỦA EM */}
        {currentView === 'login-student' && (
          <LoginView
            role="student"
            students={students}
            settings={settings}
            onLoginSuccess={handleLoginSuccess}
            onBackToHome={() => setCurrentView('home')}
          />
        )}

        {/* TRANG ĐĂNG NHẬP RIÊNG BIỆT 2: GÓC CÔ GIÁO */}
        {currentView === 'login-teacher' && (
          <LoginView
            role="teacher"
            students={students}
            settings={settings}
            onLoginSuccess={handleLoginSuccess}
            onBackToHome={() => setCurrentView('home')}
          />
        )}

        {/* TRANG ĐĂNG NHẬP RIÊNG BIỆT 3: GÓC GIA ĐÌNH */}
        {currentView === 'login-family' && (
          <LoginView
            role="family"
            students={students}
            settings={settings}
            onLoginSuccess={handleLoginSuccess}
            onBackToHome={() => setCurrentView('home')}
          />
        )}

        {/* TRANG 1: BẢN ĐỒ Ý TƯỞNG */}
        {currentView === 'idea_map' && (
          <IdeaMapPage
            student={activeStudent || students[0]}
            settings={settings}
            initialPrompt={sharedPrompt}
            initialGrade={sharedGrade}
            initialGenre={sharedGenre}
            onProceedToWrite={handleProceedToWrite}
            onBackToGarden={() => {
              playPop(settings.soundEnabled);
              setCurrentView(returnToView || (currentUser?.role || 'home'));
            }}
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
            onBackToIdeaMap={() => {
              playPop(settings.soundEnabled);
              setCurrentView('idea_map');
            }}
            onSaveSubmission={handleSaveSubmission}
            onOpenProgressGarden={() => {
              setReturnToView('essay_feedback');
              setCurrentView('progress_journey');
            }}
          />
        )}

        {/* TRANG ĐỘC LẬP: HÀNH TRÌNH CỦA CON (VƯỜN HOA TIẾN BỘ GDPT 2018) */}
        {currentView === 'progress_journey' && activeStudent && (
          <ProgressJourneyPage
            student={activeStudent}
            settings={settings}
            returnViewName={returnToView === 'family' ? 'Góc gia đình' : returnToView === 'teacher' ? 'Góc cô giáo' : 'Góc của em'}
            onBack={() => {
              playPop(settings.soundEnabled);
              setCurrentView(returnToView || (currentUser?.role || 'home'));
            }}
          />
        )}

        {/* GÓC HỌC TẬP CỦA EM (Tự động nhận diện sau đăng nhập, không chọn lại tên) */}
        {currentView === 'student' && (
          currentUser?.role === 'student' && activeStudent ? (
            <StudentPortal
              student={activeStudent}
              settings={settings}
              onUpdateStudent={handleUpdateStudent}
              onBackToGarden={() => setCurrentView('home')}
              onOpenProgressGarden={() => {
                setReturnToView('student');
                setCurrentView('progress_journey');
              }}
              onOpenReadingGarden={() => {
                playPop(settings.soundEnabled);
                setReturnToView('student');
                setCurrentView('reading_garden');
              }}
              onGoToIdeaMap={(prompt, grade, genre) => {
                setSharedPrompt(prompt);
                setSharedGrade(grade);
                setSharedGenre(genre);
                setReturnToView('student');
                setCurrentView('idea_map');
              }}
            />
          ) : (
            <LoginView
              role="student"
              students={students}
              settings={settings}
              onLoginSuccess={handleLoginSuccess}
              onBackToHome={() => setCurrentView('home')}
            />
          )
        )}

        {/* GÓC CÔ GIÁO (Bảo mật giáo viên, Sổ chấm bài & Quản lý Tài khoản Lớp em) */}
        {currentView === 'teacher' && (
          currentUser?.role === 'teacher' ? (
            <TeacherPortal
              students={students}
              settings={settings}
              onBackToGarden={() => setCurrentView('home')}
              onRefreshStudents={loadStudents}
            />
          ) : (
            <LoginView
              role="teacher"
              students={students}
              settings={settings}
              onLoginSuccess={handleLoginSuccess}
              onBackToHome={() => setCurrentView('home')}
            />
          )
        )}

        {/* GÓC GIA ĐÌNH (Khóa trực tiếp vào con của phụ huynh) */}
        {currentView === 'family' && (
          currentUser?.role === 'family' && activeStudent ? (
            <FamilyPortal
              student={activeStudent}
              settings={settings}
              onBackToGarden={() => setCurrentView('home')}
              onOpenProgressGarden={() => {
                setReturnToView('family');
                setCurrentView('progress_journey');
              }}
            />
          ) : (
            <LoginView
              role="family"
              students={students}
              settings={settings}
              onLoginSuccess={handleLoginSuccess}
              onBackToHome={() => setCurrentView('home')}
            />
          )
        )}

        {/* VƯỜN ĐỌC THÚ VỊ / THƯ VIỆN BÀI VĂN MẪU */}
        {currentView === 'reading_garden' && (
          <ReadingGarden
            settings={settings}
            onBack={() => {
              playPop(settings.soundEnabled);
              setCurrentView(returnToView || 'home');
            }}
          />
        )}
      </main>

      {/* Universal Footer with Centralized Teacher Attribution */}
      <footer className="w-full py-3.5 sm:py-4 px-4 bg-gradient-to-r from-pink-50 via-purple-50 to-sky-50 border-t border-pink-200/80 text-center shadow-xs">
        <p className="text-xs sm:text-sm text-stone-700 font-medium">
          {TEACHER_CONFIG.attribution}
        </p>
      </footer>

      {/* Backward-compatible Modal fallback if needed */}
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
