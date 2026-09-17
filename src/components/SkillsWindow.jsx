import { useRef, useState } from 'react';
import { skillButtons, skillGroups } from '../data/skills';
import DraggableSkill from './DraggableSkill';

export default function SkillsWindow({ onClose }) {
  const [hovered, setHovered] = useState(null);
  const [maximized, setMaximized] = useState(false);

  const windowRef = useRef(null);

  const drag = useRef({
    active: false,
    offsetX: 0,
    offsetY: 0,
  });

  const handlePointerDown = (e) => {
    if (maximized) return;

    const el = windowRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();

    drag.current = {
      active: true,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    };

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!drag.current.active || maximized) return;

    const el = windowRef.current;

    const maxX = window.innerWidth - el.offsetWidth;
    const maxY = window.innerHeight - el.offsetHeight;

    let left =
      e.clientX -
      drag.current.offsetX;

    let top =
      e.clientY -
      drag.current.offsetY;

    left = Math.max(0, Math.min(left, maxX));
    top = Math.max(0, Math.min(top, maxY));

    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
  };

  const handlePointerUp = (e) => {
    drag.current.active = false;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch { }
  };

  const toggleMaximize = () => {
    const el = windowRef.current;

    if (!el) return;

    if (!maximized) {
      const rect = el.getBoundingClientRect();

      el.dataset.restoreLeft = `${rect.left}px`;
      el.dataset.restoreTop = `${rect.top}px`;

      el.style.left = '0px';
      el.style.top = '0px';

      setMaximized(true);
    } else {
      el.style.left =
        el.dataset.restoreLeft || '10vw';

      el.style.top =
        el.dataset.restoreTop || '12.5vh';

      setMaximized(false);
    }
  };

  return (
    <section
      ref={windowRef}
      className={`window dir-window ${maximized ? 'dir-maximized' : ''
        }`}
    >
      <div
        className="window-header"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <span>I:\skills</span>

        <div className="window-controls">

          <button
            className="maximize-btn"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={toggleMaximize}
            aria-label={maximized ? 'Restore' : 'Fullscreen'}
          >
            {maximized ? '❐' : '□'}
          </button>

          <button
            className="close-btn"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>

        </div>
      </div>

      <div className="dir-content">

        <div className="dir-buttons">
          {skillButtons.map(([key, label]) => (
            <button
              key={key}
              onMouseEnter={() => setHovered(key)}
              onMouseLeave={() => setHovered(null)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="dir-images">
          {Object.entries(skillGroups).flatMap(
            ([group, skills]) =>
              skills.map((skill) => {
                const isHighlighted =
                  hovered === 'languages'
                    ? skill.className === 'lang'
                    : hovered === 'frontend'
                      ? skill.className === 'frontend'
                      : hovered === skill.className;

                const dimmed =
                  Boolean(hovered && !isHighlighted);

                return {
                  skill,
                  dimmed,
                };
              })
          ).map(({ skill, dimmed }, index) => (
            <DraggableSkill
              key={skill.name}
              skill={skill}
              index={index}
              dimmed={dimmed}
            />
          ))}
        </div>

      </div>
    </section>
  );
}