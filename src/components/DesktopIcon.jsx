import { useEffect, useRef } from 'react';

export default function DesktopIcon({ id, label, image, initialStyle, onOpen }) {
  const ref = useRef(null);
  const drag = useRef({ active: false, offsetX: 0, offsetY: 0, startX: 0, startY: 0 });

  useEffect(() => {
    const positions =
      JSON.parse(localStorage.getItem('desktopIconPositions')) || {};

    if (positions[id]) {
      ref.current.style.left = positions[id].left;
      ref.current.style.top = positions[id].top;
    }
  }, [id]);

  const onPointerDown = (e) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();

    drag.current = {
      active: true,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      startX: rect.left,
      startY: rect.top,
    };

    el.setPointerCapture(e.pointerId);
    el.style.zIndex = '1000';
  };

  const onPointerMove = (e) => {
    if (!drag.current.active) return;

    const el = ref.current;
    const { offsetX, offsetY } = drag.current;

    const maxX = window.innerWidth - el.offsetWidth;
    const maxY = window.innerHeight - el.offsetHeight;

    const left = Math.max(
      0,
      Math.min(e.clientX - offsetX, maxX)
    );

    const top = Math.max(
      0,
      Math.min(e.clientY - offsetY, maxY)
    );

    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
  };

  const finish = (e) => {
    if (!drag.current.active) return;

    const el = ref.current;
    const { startX, startY } = drag.current;

    const rect = el.getBoundingClientRect();

    drag.current.active = false;

    try {
      el.releasePointerCapture(e.pointerId);
    } catch { }

    el.style.zIndex = '1';

    const moved =
      Math.abs(rect.left - startX) > 3 ||
      Math.abs(rect.top - startY) > 3;

    if (moved) {
      savePosition();
    } else {
      onOpen(id);
      return;
    }

    // Keep the position in pixels after dragging.
    el.style.left = `${rect.left}px`;
    el.style.top = `${rect.top}px`;
  };

  const savePosition = () => {
    const el = ref.current;

    const positions =
      JSON.parse(localStorage.getItem('desktopIconPositions')) || {};

    positions[id] = {
      left: el.style.left,
      top: el.style.top,
    };

    localStorage.setItem(
      'desktopIconPositions',
      JSON.stringify(positions)
    );
  };

  return (
    <div
      ref={ref}
      id={id}
      className="folder desktop-folder"
      style={initialStyle}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={finish}
      onPointerCancel={finish}
    >
      <img src={image} alt="" draggable="false" />
      <div>{label}</div>
    </div>
  );
}
