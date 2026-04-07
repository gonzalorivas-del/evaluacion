import { useState } from 'react';

export default function Tooltip({ text, children }) {
  const [visible, setVisible] = useState(false);

  return (
    <span className="relative inline-block">
      <span
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="cursor-help"
      >
        {children || (
          <span className="inline-flex items-center justify-center w-4 h-4 border border-gray-400 text-gray-500 text-xs rounded-full font-mono">?</span>
        )}
      </span>
      {visible && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1.5 bg-gray-900 text-white text-xs w-52 pointer-events-none">
          {text}
        </span>
      )}
    </span>
  );
}
