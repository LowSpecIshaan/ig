import { useRef, useState } from 'react';

export default function MeWindow({ onClose }) {
  const windowRef = useRef(null);

  const [maximized, setMaximized] = useState(false);

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
    } catch {}
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
        el.dataset.restoreLeft || '20vw';

      el.style.top =
        el.dataset.restoreTop || '15vh';

      setMaximized(false);
    }
  };

  return (
    <section
      ref={windowRef}
      className={`window txt-window ${
        maximized ? 'me-maximized' : ''
      }`}
    >
      <div
        className="window-header"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <span>I:\me.txt</span>
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
            className="resume-btn close"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="txt-content">
        <i>// Ishaan Gupta</i>
        <br /><br />

        <i>// CS undergrad</i>
        <br />

        <i>// 2024-2028</i>
        <br /><br />

        <i>// Backend Dev</i>
        <br />

        <i>// Data Science</i>
        <br /><br />

        <i>// I like to create</i>
        <br /><br />

        <div className="profile-image-wrapper">
          <img
            className="profile-image profile-normal"
            src="/images/me.jpg"
            alt="Ishaan Gupta"
            draggable="false"
          />

          <img
            className="profile-image profile-hover"
            src="/images/me-hover.jpg"
            alt=""
            draggable="false"
          />
        </div>

        <br /><br />

        ==== CONTACT ====
        <br /><br />

        <div className="email">
          ishaangupta1231@gmail.com
          <br />
        </div>

        <br /><br />
      </div>
    </section>
  );
}