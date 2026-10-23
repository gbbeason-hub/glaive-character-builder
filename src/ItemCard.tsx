interface Item {
  id: string;
  name: string;
  type: string;
  slots: number;
  damage?: string;
  defense?: number;
  details: string;
}

interface ItemCardProps {
  item: Item;
  buttonText: string;
  buttonColor: string;
  onButtonClick: () => void;
}

export function ItemCard({ item, buttonText, buttonColor, onButtonClick }: ItemCardProps) {
  return (
    <div className="item-card">
      <div className="item-card-info">
        <div className="item-card-header">
          <strong className="item-card-title">{item.name}</strong>
          <span className="item-card-type-badge">{item.type}</span>
        </div>
        <div className="item-card-details">{item.details}</div>
        {item.damage && <div className="item-card-stat damage">Damage: {item.damage}</div>}
        {item.defense && <div className="item-card-stat defense">Armor rating: {item.defense}</div>}
      </div>
      <div className="item-card-actions">
        <span className="item-card-slots">
          {item.slots} {item.slots === 1 ? 'Slot' : 'Slots'}
        </span>
        <button
          onClick={onButtonClick}
          className="item-card-button"
          style={{ backgroundColor: buttonColor }}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}