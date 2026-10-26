// ==========================================
// SECTION A: TYPES & INTERFACES
// ==========================================
import React, { useState, useEffect } from 'react';
import type { InventoryItem } from './SilverAndGearCard';
import rawCatalogItems from '../public/items.json';
import nameData from '../public/names.json'; // Adjust path if names.json lives elsewhere

export interface CatalogItem {
  id: string;
  name: string;
  type: 'Weapon' | 'Armor' | 'Equipment' | 'Ammunition';
  damage?: string;
  slots: number;
  hands?: number;
  defense?: number;
  cost_sp: number;
  cost_cp: number;
  details?: string;
}

interface ItemShopModalProps {
  isOpen: boolean;
  categoryType: 'Weapon' | 'Armor' | 'Equipment' | 'Magic' | null;
  onClose: () => void;
  silver: number;
  copper: number;
  usedSlots: number;
  maxSlots: number;
  inventory: InventoryItem[];
  onBuyItem: (item: CatalogItem) => void;
  onSellItem: (itemId: string) => void;
}

// Flavor templates for shopkeepers
const SHOPKEEPER_TEMPLATES = [
  // Reactions & Humor
  (name: string) => `Your entrance has ${name} excited! A customer!`,
  (name: string) => `${name} eyes your coin pouch with unsettling enthusiasm.`,
  (name: string) => `${name} quickly slides an suspicious parcel under the counter.`,
  (name: string) => `${name} mutters, "No refunds, no questions, no guards."`,
  (name: string) => `${name} sighs deeply and sets down their cheap novel.`,
  (name: string) => `${name} offers a toothy grin that doesn't quite reach their eyes.`,
  (name: string) => `${name} checks the door twice before asking what you need.`,
  

  // Town Rumors & Reputation
  (name: string) => `Town rumor says ${name} once sold a rusty spoon to a dragon.`,
  (name: string) => `Locals swear ${name} never actually sleeps—just stares at the door.`,
  (name: string) => `Some say ${name} used to be an adventurer until... well, you know.`,
  (name: string) => `The local guard keeps a unusually close watch on ${name}'s shop.`,
  (name: string) => `${name} claims these items were acquired "entirely legally."`,
  (name: string) => `"${name} is known for the best for the best prices!`,
  (name: string) => `You know ${name} isn't a haggler but is fair.`,

  // Demeanor & Appearance
  (name: string) => `${name} wipes down the counter with a dubious, grease-stained rag.`,
  (name: string) => `${name} adjusts a pair of smudged spectacles and squints at you.`,
  (name: string) => `${name} blows a thick layer of dust off the front display.`,
  (name: string) => `${name} taps a wooden pegleg rhythmically against the floorboards.`,
  (name: string) => `${name} leans casually against a shelf loaded with polished steel.`,
  (name: string) => `${name} gives you a sharp, practiced appraiser's glance.`,
  (name: string) => `${name} hums a jaunty sea shanty while arranging inventory.`,

];

export const ItemShopModal: React.FC<ItemShopModalProps> = ({
  isOpen,
  categoryType,
  onClose,
  silver,
  copper,
  usedSlots,
  maxSlots,
  inventory,
  onBuyItem,
  onSellItem,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [shopkeeperQuote, setShopkeeperQuote] = useState('');

  // Generate a random shopkeeper flavor line whenever the modal opens
  // Generate a random shopkeeper flavor line whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      // Flatten or extract names depending on your names.json structure
      // (e.g. if nameData is an array of strings, or has categories like nameData.firstNames)
      const namesList = Array.isArray(nameData) ? nameData : nameData.names || [];
      
      if (namesList.length > 0) {
        const randomName = namesList[Math.floor(Math.random() * namesList.length)];
        const randomTemplate = SHOPKEEPER_TEMPLATES[Math.floor(Math.random() * SHOPKEEPER_TEMPLATES.length)];
        setShopkeeperQuote(randomTemplate(randomName));
      }
      
      setSearchTerm(''); // Reset search filter on open
    }
  }, [isOpen]);

  // ==========================================
  // SECTION B: EARLY RETURN & FILTERING
  // ==========================================
  if (!isOpen || !categoryType) return null;

  const catalog = rawCatalogItems as CatalogItem[];

  const filteredItems = catalog.filter((item) => {
    let matchesCategory = false;

    if (categoryType === 'Weapon') {
      matchesCategory = item.type === 'Weapon' || item.type === 'Ammunition';
    } else if (categoryType === 'Armor') {
      matchesCategory = item.type === 'Armor';
    } else if (categoryType === 'Equipment') {
      matchesCategory = item.type === 'Equipment';
    } else if (categoryType === 'Magic') {
      matchesCategory = item.type === 'Equipment' && Boolean(item.details?.toLowerCase().includes('spell'));
    }

    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Boolean(item.details?.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const totalCopperWealth = silver * 10 + copper;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* ==========================================
            SECTION C: STICKY MODAL HEADER
           ========================================== */}
        <div className="modal-header">
          <div className="modal-title-row">
            <div className="modal-title-left-group">
              <h3>{categoryType.toUpperCase()} SHOP</h3>
              <span className="shopkeeper-flavor-text">{shopkeeperQuote}</span>
            </div>
            <button type="button" className="modal-close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
          <div className="modal-stats-bar">
            <span>
              <strong>Purse:</strong> {silver} sp {copper} cp
            </span>
            <span>
              <strong>Used Slots:</strong> {usedSlots} of {maxSlots}
            </span>
          </div>
        </div>

        {/* ==========================================
            SECTION D: SEARCH FILTER INPUT
           ========================================== */}
        <div style={{ padding: '12px 20px 0 20px' }}>
          <input
            type="text"
            placeholder={`Search ${categoryType.toLowerCase()} items...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              width: '100%',
              boxSizing: 'border-box',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              backgroundColor: '#fff',
              color: 'var(--text-h)',
            }}
          />
        </div>

        {/* ==========================================
            SECTION E: SCROLLABLE ITEM LIST
           ========================================== */}
        <div className="modal-item-list">
          {filteredItems.length === 0 ? (
            <p className="empty-inventory-text" style={{ textAlign: 'center', padding: '20px' }}>
              No matching items found.
            </p>
          ) : (
            filteredItems.map((item) => {
              const ownedItem = inventory.find((inv) => inv.id === item.id);
              const ownedCount = ownedItem ? ownedItem.quantity : 0;

              const itemCostInCopper = item.cost_sp * 10 + item.cost_cp;
              const canAfford = totalCopperWealth >= itemCostInCopper;

              return (
                <div
                  key={item.id}
                  className={`shop-item-card ${!canAfford ? 'unaffordable' : ''}`}
                >
                  <div className="shop-item-top-row">
                    <div className="item-title-group">
                      <strong className="item-name">{item.name}</strong>
                      {item.hands === 1 && <span className="hand-icon" title="1-Handed">✋</span>}
                      {item.hands === 2 && <span className="hand-icon" title="2-Handed">✋✋</span>}
                    </div>
                    <div className="item-meta-group">
                      <span className="item-slot-weight">
                        {item.slots} {item.slots === 1 ? 'Slot' : 'Slots'}
                      </span>
                      <span className="item-price">
                        {item.cost_sp > 0 ? `${item.cost_sp} SP` : ''}
                        {item.cost_sp > 0 && item.cost_cp > 0 ? ' ' : ''}
                        {item.cost_cp > 0 ? `${item.cost_cp} CP` : ''}
                        {item.cost_sp === 0 && item.cost_cp === 0 ? 'Free' : ''}
                      </span>
                    </div>
                  </div>

                  <div className="shop-item-bottom-row">
                    <div className="item-details-column">
                      {item.damage && (
                        <span className="item-stat-badge">Damage: {item.damage}</span>
                      )}
                      {item.defense !== undefined && item.defense > 0 && (
                        <span className="item-stat-badge">AC +{item.defense}</span>
                      )}
                      <span className="item-details-text">{item.details}</span>
                    </div>

                    <div className="item-actions-column">
                      {ownedCount > 0 && (
                        <span className="owned-counter-badge">Owned: {ownedCount}</span>
                      )}
                      <div className="shop-btn-group">
                        <button
                          type="button"
                          className="buy-btn"
                          disabled={!canAfford}
                          onClick={() => onBuyItem(item)}
                        >
                          + Buy
                        </button>
                        {ownedCount > 0 && (
                          <button
                            type="button"
                            className="sell-btn"
                            onClick={() => onSellItem(item.id)}
                          >
                            - Sell
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};