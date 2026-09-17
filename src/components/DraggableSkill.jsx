import { useEffect, useRef } from 'react';

export default function DraggableSkill({
  skill,
  dimmed,
  index,
}) {
  const ref = useRef(null);

  const drag = useRef({
    active: false,
    offsetX: 0,
    offsetY: 0,
  });

  useEffect(() => {
    const el = ref.current;
    const container = el?.parentElement;

    if (!el || !container) return;

    const savedPositions =
      JSON.parse(
        localStorage.getItem('skillIconPositions')
      ) || {};

    const saved = savedPositions[skill.name];

    if (saved) {
      el.style.left = `${saved.left}px`;
      el.style.top = `${saved.top}px`;
      return;
    }

    // Default grid position
    const columns = window.innerWidth < 768 ? 3 : 6;

    const column = index % columns;
    const row = Math.floor(index / columns);

    const cellWidth = 90;
    const cellHeight = 90;

    const startX = 30;
    const startY = 90;

    el.style.left =
      `${startX + column * cellWidth}px`;

    el.style.top =
      `${startY + row * cellHeight}px`;
  }, [skill.name, index]);

  const onPointerDown = (e) => {
    const el = ref.current;

    if (!el) return;

    const rect = el.getBoundingClientRect();

    drag.current = {
      active: true,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    };

    el.setPointerCapture(e.pointerId);

    el.style.zIndex = '100';
  };

  const onPointerMove = (e) => {
    if (!drag.current.active) return;

    const el = ref.current;
    const container = el.parentElement;

    if (!el || !container) return;

    const containerRect =
      container.getBoundingClientRect();

    let left =
      e.clientX -
      containerRect.left -
      drag.current.offsetX;

    let top =
      e.clientY -
      containerRect.top -
      drag.current.offsetY;

    left = Math.max(
      0,
      Math.min(
        left,
        containerRect.width - el.offsetWidth
      )
    );

    top = Math.max(
      0,
      Math.min(
        top,
        containerRect.height - el.offsetHeight
      )
    );

    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
  };

  const onPointerUp = (e) => {
    if (!drag.current.active) return;

    drag.current.active = false;

    const el = ref.current;

    try {
      el.releasePointerCapture(e.pointerId);
    } catch { }

    el.style.zIndex = '1';

    const positions =
      JSON.parse(
        localStorage.getItem('skillIconPositions')
      ) || {};

    positions[skill.name] = {
      left: parseFloat(el.style.left),
      top: parseFloat(el.style.top),
    };

    localStorage.setItem(
      'skillIconPositions',
      JSON.stringify(positions)
    );
  };

  return (
    <div
      ref={ref}
      className={`skill-desktop-icon ${dimmed ? 'skill-dimmed' : ''
        }`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <img
        src={skill.src}
        alt={skill.name}
        draggable="false"
        style={{
          filter: skill.invert
            ? 'brightness(0) invert(1)'
            : undefined,
        }}
      />

      <span>{skill.name}</span>
    </div>
  );
}