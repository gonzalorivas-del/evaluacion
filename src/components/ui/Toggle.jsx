export default function Toggle({ checked, onChange, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-5 w-10 items-center border-2 transition-colors ${
        checked ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-400'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-3 w-3 bg-white border border-gray-400 transform transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        } ${checked ? 'border-gray-900' : ''}`}
      />
    </button>
  );
}
