import { useEffect, useState } from 'react';
import Header from './components/Header';
import Background from './components/Background';
import DesktopIcon from './components/DesktopIcon';
import MeWindow from './components/MeWindow';
import SkillsWindow from './components/SkillsWindow';
import Footer from './components/Footer';
import ResumeWindow from './components/ResumeWindow';

const icons = [
  { id: 'meButton', label: 'me', image: '/images/file.png', style: { top: '31.5vh', left: '15vw' } },
  { id: 'skillsButton', label: 'skills', image: '/images/folderblue.png', style: { top: '58.9vh', left: '5.5vw' } },
  { id: 'projectsButton', label: 'projects', image: '/images/folderblue.png', style: { top: '63vh', left: '75.3vw' } },
  { id: 'resumeButton', label: 'resume', image: '/images/file.png', style: { top: '22.4vh', left: '75.8vw' } },
];

export default function App() {
  const [windowType, setWindowType] = useState(null);

  const open = (id) => {
    if (id === 'meButton') setWindowType('me');
    if (id === 'skillsButton') setWindowType('skills');
    if (id === 'resumeButton') setWindowType('resume');
    // Kept intentionally inactive because the original portfolio had no click behavior for these icons.
  };

  const resetIcons = () => {
    localStorage.removeItem('desktopIconPositions');
    localStorage.removeItem('skillIconPositions');
    window.location.reload();
  };

  return (
    <main>
      <Header />
      <Background />

      <div className="desktop">
        {icons.map((icon) => (
          <DesktopIcon
            key={icon.id}
            id={icon.id}
            label={icon.label}
            image={icon.image}
            initialStyle={icon.style}
            onOpen={open}
          />
        ))}
      </div>

      {windowType === 'me' && <MeWindow onClose={() => setWindowType(null)} />}
      {windowType === 'skills' && <SkillsWindow onClose={() => setWindowType(null)} />}
      {windowType === 'resume' && (
        <ResumeWindow onClose={() => setWindowType(null)} />
      )}
      <button className="reset-icons-btn" onClick={resetIcons}>
        RESET
      </button>
      <Footer hidden={Boolean(windowType)} />
    </main>
  );
}
