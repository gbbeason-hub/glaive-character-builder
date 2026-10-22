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
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #ddd', padding: '10px', borderRadius: '6px', backgroundColor: '#fff', marginBottom: '8px' }}>
      <div style={{ flex: 1 }}>
        <strong style={{ fontSize: '15px' }}>{item.name}</strong>{' '}
        <span style={{ fontSize: '12px', color: '#666', backgroundColor: '#eee', padding: '2px 6px', borderRadius: '10px' }}>{item.type}</span>
        <div style={{ fontSize: '13px', color: '#555', marginTop: '4px' }}>{item.details}</div>
        {item.damage && <div style={{ fontSize: '12px', color: 'blue', fontWeight: 'bold' }}>Damage: {item.damage}</div>}
        {item.defense && <div style={{ fontSize: '12px', color: 'green', fontWeight: 'bold' }}>Armor rating: {item.defense}</div>}
      </div>
      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-end' }}>
        <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#444' }}>{item.slots} {item.slots === 1 ? 'Slot' : 'Slots'}</span>
        <button onClick={onButtonClick} style={{ backgroundColor: buttonColor, color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold' }}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}
