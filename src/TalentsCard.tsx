import React from 'react';

export interface Talent {
  id: string;
  name: string;
  type: string;
  set: string;
  description: string;
  repeatable?: boolean;
}

interface TalentsCardProps {
  talents: Talent[];
  selectedTalentId: string;
  onTalentChange: (talentId: string) => void;
}

export const TalentsCard: React.FC<TalentsCardProps> = ({
  talents,
  selectedTalentId,
  onTalentChange,
}) => {
  const selectedTalent = talents.find((t) => t.id === selectedTalentId);

  const handleRollTalent = () => {
    if (!talents || talents.length === 0) return;
    const randomIndex = Math.floor(Math.random() * talents.length);
    onTalentChange(talents[randomIndex].id);
  };

  return (
    <div className="bg-white border border-gray-300 p-5 rounded-lg shadow-sm font-sans max-w-xl text-gray-800">
      <h3 className="text-lg font-bold uppercase tracking-wide mb-2 text-gray-900 font-[Lalita_One]">
        Character Talents
      </h3>
      <p className="text-xs text-gray-600 mb-4 font-[Amaranth]">
        Select or roll additional heroic talents, veteran tricks, or uncanny aptitudes:
      </p>

      {/* Dropdown Selection */}
      <div className="mb-4">
        <select
          value={selectedTalentId}
          onChange={(e) => onTalentChange(e.target.value)}
          className="w-full bg-white border border-gray-400 px-3 py-2 rounded shadow-sm text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-gray-600"
        >
          <option value="">-- Select a Talent --</option>
          {talents.map((t) => (
            <option key={t.id} value={t.id}>
              [{t.set}] {t.name} {t.repeatable ? '(Repeatable)' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Description Preview Box */}
      {selectedTalent && (
        <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200 mb-4 leading-snug font-[Amaranth]">
          <strong className="text-gray-900">{selectedTalent.name}:</strong> {selectedTalent.description}
        </div>
      )}

      {/* Random Roll Button */}
      <div>
        <button
          onClick={handleRollTalent}
          className="bg-zinc-700 hover:bg-zinc-800 text-white font-medium px-4 py-2 rounded shadow transition-colors text-sm font-[Amaranth]"
        >
          🎲 Roll Random Talent
        </button>
      </div>
    </div>
  );
};