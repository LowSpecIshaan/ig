import { useRef, useState } from 'react';

export default function ResumeWindow({ onClose }) {
  const windowRef = useRef(null);

  const [maximized, setMaximized] = useState(false);

  const drag = useRef({
    active: false,
    offsetX: 0,
    offsetY: 0,
  });

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
        el.style.left = el.dataset.restoreLeft || '17.5vw';
        el.style.top = el.dataset.restoreTop || '10vh';

        setMaximized(false);
    }
    };

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
    } catch {}
  };

  return (
    <div
      ref={windowRef}
      className={`resume-window ${maximized ? 'resume-maximized' : ''}`}
    >
      <div
        className="resume-header"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <span>I:\resume.pdf</span>

        <div className="resume-controls">
          <button
            className="resume-btn"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={toggleMaximize}
            aria-label={maximized ? 'Restore' : 'Fullscreen'}
            >
            {maximized ? '❐' : '□'}
          </button>

          <button
            className="resume-btn close"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="resume-content">
        <iframe
          src="/ishaan_resume.pdf"
          title="Resume"
        />
      </div>
    </div>
  );
}