
import React from 'react';

export interface InventoryItem {
  id: string;
  name: string;
  type: string;
  slots: number;
  cost_sp: number;
  cost_cp: number;
  details?: string;
  quantity: number;
}

interface SilverAndGearCardProps {
  silver: number;
  copper: number;
  onUpdateSilver: (val: number) => void;
  onUpdateCopper: (val: number) => void;
  hasRolledSilver: boolean;
  onRollStartingSilver: () => void;
  freeGearText: string;
  onUpdateFreeGear: (val: string) => void;
  inventory: InventoryItem[];
  maxSlots: number;
  onOpenShop: (category: 'Weapon' | 'Armor' | 'Equipment' | 'Magic') => void;
  onSellItem: (itemId: string) => void;
}

export const SilverAndGearCard: React.FC<SilverAndGearCardProps> = ({
  silver,
  copper,
  onUpdateSilver,
  onUpdateCopper,
  hasRolledSilver,
  onRollStartingSilver,
  freeGearText,
  onUpdateFreeGear,
  inventory,
  maxSlots,
  onOpenShop,
  onSellItem,
}) => {
  const totalUsedSlots = inventory.reduce(
    (acc, item) => acc + item.slots * item.quantity,
    0
  );

  const isEncumbered = totalUsedSlots > maxSlots;

  return (
    <div className="card-container silver-gear-card">
      <div className="card-header-row">
        <h2>SILVER & GEAR</h2>
      </div>

      <div className="silver-gear-main-grid">
        {/* Purse & Currency Column */}
        <div className="purse-column">
          <div className="currency-header-subtext">1 silver = 10 copper</div>

          <div className="currency-controls-group">
            {/* Silver Control */}
            <div className="field-group-inline">
              <div className="stepper-input-wrapper">
                <button
                  type="button"
                  className="stepper-btn"
                  onClick={() => onUpdateSilver(Math.max(0, silver - 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  className="coin-input"
                  value={silver}
                  onChange={(e) => onUpdateSilver(parseInt(e.target.value) || 0)}
                />
                <button
                  type="button"
                  className="stepper-btn"
                  onClick={() => onUpdateSilver(silver + 1)}
                >
                  +
                </button>
              </div>
              <span className="coin-unit-label">sp</span>
            </div>

            {/* Copper Control */}
            <div className="field-group-inline">
              <div className="stepper-input-wrapper">
                <button
                  type="button"
                  className="stepper-btn"
                  onClick={() => onUpdateCopper(Math.max(0, copper - 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  className="coin-input"
                  value={copper}
                  onChange={(e) => onUpdateCopper(parseInt(e.target.value) || 0)}
                />
                <button
                  type="button"
                  className="stepper-btn"
                  onClick={() => onUpdateCopper(copper + 1)}
                >
                  +
                </button>
              </div>
              <span className="coin-unit-label">cp</span>
            </div>
          </div>

          {!hasRolledSilver && (
            <button
              type="button"
              className="roll-silver-btn"
              onClick={onRollStartingSilver}
            >
             🎲  Roll Starting Silver
            </button>
          )}
        </div>

        {/* Free Gear Column */}
        <div className="free-gear-column">
          <div className="free-gear-header">
            <strong>Free Gear</strong>
            <span>Items that don't use inventory slots</span>
          </div>
          <textarea
            className="free-gear-textarea"
            value={freeGearText}
            onChange={(e) => onUpdateFreeGear(e.target.value)}
            placeholder="backpack, flint & steel, worn travel clothing, tiny trinkets"
            rows={3}
          />
        </div>
      </div>

      {/* Shop Category Triggers */}
      {hasRolledSilver && (
        <div className="shop-buttons-row">
          <button
            type="button"
            className="shop-category-btn"
            onClick={() => onOpenShop('Armor')}
          >
            Armor
          </button>
          <button
            type="button"
            className="shop-category-btn"
            onClick={() => onOpenShop('Weapon')}
          >
            Weapons
          </button>
          <button
            type="button"
            className="shop-category-btn"
            onClick={() => onOpenShop('Equipment')}
          >
            Gear
          </button>
          <button
            type="button"
            className="shop-category-btn"
            onClick={() => onOpenShop('Magic')}
          >
            Magic
          </button>
        </div>
      )}

      {/* Carrying Capacity & Encumbrance Status */}
      <div className="slots-status-row">
        <div className="slots-counter">
          <strong>Used Slots:</strong> {totalUsedSlots} of {maxSlots}
        </div>

        {isEncumbered && (
          <div className="encumbered-warning-box">
            <span className="encumbered-badge">Encumbered!</span>
            <span className="encumbered-rules-text">
              DISADV on all rolls. +1 Fatigue per dungeon turn.
            </span>
          </div>
        )}
      </div>

      {/* Owned Inventory Table */}
      {inventory.length > 0 && (
        <div className="inventory-table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th className="th-item">Item</th>
                <th className="th-center">Number</th>
                <th className="th-center">Slots</th>
                <th className="th-cost">Cost</th>
                <th>Notes</th>
                <th className="actions-header">Sell</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id}>
                  <td className="item-name-cell">{item.name}</td>
                  <td className="td-center">{item.quantity}</td>
                  <td className="td-center">{item.slots * item.quantity}</td>
                  <td className="td-cost">
                    {item.cost_sp > 0 ? `${item.cost_sp} sp` : ''}
                    {item.cost_sp > 0 && item.cost_cp > 0 ? ' ' : ''}
                    {item.cost_cp > 0 ? `${item.cost_cp} cp` : ''}
                    {item.cost_sp === 0 && item.cost_cp === 0 ? 'Free' : ''}
                  </td>
                  <td className="item-notes-cell">{item.details}</td>
                  <td className="actions-cell">
                    <button
                      type="button"
                      className="sell-row-btn"
                      onClick={() => onSellItem(item.id)}
                      title="Sell back to shop"
                    >
                      🪙
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};