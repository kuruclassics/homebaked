'use client';

interface TabsProps {
  tabs: { key: string; label: string }[];
  active: string;
  onChange: (key: string) => void;
}

export default function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="flex gap-1 p-1 bg-cream-dark/50 rounded-xl">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            active === tab.key
              ? 'bg-white text-charcoal shadow-sm'
              : 'text-warm-gray hover:text-charcoal'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
