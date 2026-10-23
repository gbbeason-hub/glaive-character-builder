# Glaive v3 Character Builder Progress Master

## 🎯 Core Project Goal
To build a lightweight, fully client-side character generator and digital workbook for the tabletop RPG "Glaive v3." The application must enforce native system rules (such as dynamic attribute caps, slot-based encumbrance, and character origin tables), manage an item marketplace, and export a print-ready, high-fidelity physical character sheet—all powered by a portable, serverless Base64 clipboard save/load system.


## 🛠️ Development Guidelines & Coding Standards

### 🧱 1. Separation of Concerns & Declarations
* **Separate Declaration from Initialization:** Declare variables, state hooks, and component signatures cleanly at the top of the file before applying dynamic logic or initial setting values.
* **Pure CSS Styling:** Keep component files (`.tsx`, `.jsx`) free of inline style objects (`style={{ ... }}`). Move all layout, spacing, and visual styling to centralized CSS rules in `index.css` to maintain clean markup.

### 🧩 2. Modular & Single-Purpose Code
* **Agnostic & Focused Functions:** Write small, single-purpose functions and utility components that perform one task well without hardcoding specific component context or side effects.
* **Decoupled State Management:** Keep dropdown/catalog selection states separate from optional freeform text inputs to prevent redundant UI elements, state collisions, and synchronization bugs.
* **Dynamic Sync Logic:** Handle real-time dependent calculations (such as carrying capacity, Max HP, AC, and dynamic talent slots based on Level/Ancestry) reactively inside dedicated `useEffect` hooks rather than scattering logic across render cycles.
* **DRY (Don't Repeat Yourself):** Extract repeated UI patterns or styling blocks (such as item cards, option pickers, or list items) into reusable sub-components or shared utility classes.

### 🛡️ 3. Defensive Programming & State Safety
* **Fail Gracefully with Safe Defaults:** Always provide safe fallback values for external data fetches (e.g., `traitsData.gender || []` or optional chaining `backgroundDatabase?.map(...)`) so missing or delayed network data never crashes the app.
* **Immutable State Updates:** Always update React array and object states using functional copies (e.g., `setInventory(prev => [...prev, newItem])`) rather than mutating state objects directly.

### 📝 4. Code Organization & Documentation
* **Sectional Comments & Visual Anchors:** Use clear, capitalized section headers (e.g., `// ==========================================`, `/* SECTION A: WEAPONS CATALOG LIST */`) to make long files effortless to scan and navigate down the road.
* **Intent-Focused Inline Comments:** Document *why* complex decisions or data relationships exist (especially formulas, roll tables, or workarounds) rather than just stating *what* the code does.

### 🎨 5. Typography & Visual Hierarchy
* **Google Fonts System:** Map display titles and main headers to `Lilita One`, functional text and inputs to `Amaranth`, and decorative features to `Rubik Dirt`.
* **Balanced Font Proportions:** Set field labels to **16px bold** and input/dropdown values to **14px** to accommodate taller font x-heights while maintaining clear readability.
* **Explicit Native Control Styling:** Target dropdown menu options directly (`select option { font-family: var(--font-body); }`) so custom typography inherits reliably across different browsers.

### 📐 6. Layout & Control Alignment
* **Vertical Control Stacking:** Standardize form inputs to a "label-over-control" layout (`display: flex; flex-direction: column; gap: 6px;`) so fields reliably span the full width of their containers.
* **Aligned Column Rows:** Align multi-column form groups cleanly from the top edge (`display: flex; gap: 20px; align-items: flex-start;`) so mismatched input heights (like text fields vs. select dropdowns) do not warp row alignments.

### 🖨️ 7. Responsive Print & Export System (`@media print`)
* **Isolated Print DOM Layout:** Maintain a dedicated `.printable-character-sheet` container tailored to standard US Letter dimensions, hidden during web view via `display: none !important`.
* **Clean Print Overrides:** Strip interactive UI elements (buttons, catalog browsers) during printing and enforce high-contrast black-and-white rendering (`-webkit-print-color-adjust: exact`).

## 🛠️ Stack Configuration
- Framework: React (v18+) + TypeScript (`src/App.tsx`, `src/ItemCard.tsx`).
- Environment: Local Vite development server running cleanly on localhost:5173.

## 🗃️ Active Flat Databases
1. `public/items.json`: Completed master item array containing categorized Weapon (`w_`), Armor (`a_`), Ammunition, and Gear (`g_`) datasets with exact slot weights and silver piece costs.
2. `public/traits.json`: 1d6 and 1d20 array tables handling text descriptors for Gender, Hair, Looks, Skin, and Speech. Includes a 6x6 multidimensional array matrix for Social Bonds.
3. `public/backgrounds.json`: Compact d100 database mapping narrative origin strings utilizing explicit mathematical `min` and `max` numeric boundaries.
4. `public/ancestries.json`: Master ancestry definitions (Construct, Demi-Ogre, Drake, Dwarf, Elf, Goblin, Half-Foot, Human, Infernal, Kobold, Orc) with associated inherent talents.
5. `public/talents.json`: Archetype and Ancestry talent list complete with mechanical rules text.

## 📐 Implemented Rule Equations (Derived Real-Time Stats)
- Max Attribute Dropdowns: Dynamically capped via `Math.min(5, level + 2)`.
- Vital Gauges: `HP = 10 + STR`. `AC = 10 + DEX + Sum of equipped armor defense keys`.
- Encumbrance Burden: JavaScript array reducer sums item slot weights against `10 + STR`. Changes color layout state to a bright warning box if exceeded.
- Tiered Starting Purse: 1d20 look-up table driving dice pools (0 SP / 2d6x10 SP / 3d6x10 SP).
- Economy Sync: Equipping/purchasing catalog items checks active silver balance and automatically deducts total .cost.

## 🚀 Layout Split & Print Engine Integration
- Left column displays state controllers, text fields, d20/d100 randomizers, and save/load utilities.
- Right column displays active inventory cards and separate categorized shop lists (Weapons, Armor, Equipment).
- Print Engine: Fully hooked up to `window.print()` using an explicit `@media print` style sheet in `src/index.css`. Automatically strips away the web layout dashboard configuration panels and forces a clean, high-fidelity OSR table character grid output.
- Backup Serialization: Base64 encoders (`btoa`/`atob`) successfully bundle name, level, stats, wallet balance, custom descriptors, bond strings, background histories, and item ID tracks.

## PDF Resources
The fonts to use in the PDF & web site
- Lalita One for field labels, table titles, section titles, and attribute, HP, AC values
- Amaranth for regular text, including condition names, edited text fields, and generated text for editable fields
- Rubik Dirt for attribute, hit point, & armor class abbreviated labels

## 🏁 Completed Steps
- [DONE] Phase 4 Mihtril: Add mithril armor 
- [DONE] Phase 5 Ancestry: Add Ancestry selection with talent
- [DONE] Phase 5b Ancestry: remove underline
- [DONE] Phase 6 Columns: Convert from 2 column layout to 1 column. Reorder first 5 cards. 
- [DONE] Phase 7a Talents: Implemented slot count logic, advanced slot controls, selection tracking, deduplication filters, and slot caps.
- [DONE] Phase 7b Talents: Refactored all inline styling out of `TalentsCard.tsx` and moved clean class rules over to `index.css`.
- [DONE] Phase 7c Talents: Panel head is smaller than others

- [DONE] Phase 8 Advancement: Add logic for leveling up characters -- HP, talents, ability bonus. 
- [DONE] Phase 9a Ability Max: Add logic for controlling maximum value of ability scores 
- [DONE] Phase 10 Traits: Add dropdowns. Stack labels? 2 columns?

- [DONE] Phase 22 Background: No longer shows description.  

## 🏁 Next Target Steps

- [NEW] Phase 7d Talents: Check talents for display. Some have additional effects (like granting spells, familiars, etc.)
    - Once per long rest . . . . (see Die Hard) -- Give a checkbox?
    - Favor of the Gods: AC & HP effects
    - Heaven’s Crushing Touch: HP effects
    - Professional Killer: HP effects
    - Radiance: Effects (choice)
    - Veteran: HP effects
    - Hospitaller: Summon
    - Keeper of Relics: Spells (relics)
    - Scholar of The Unseen University: Spells
    - Eldritch Feast: Spell graft
    - Dog Whisperer: Companion
    - Familiar: Companion with storage & roll
    - Two-Weapon Fighter: AC effects
    - Always Prepared: Item?
    - Pack Rat: Item Slots
    - Shield Master: AC bonus for shield
    - Dark Bloodline: Suboptions
- [NEW] Phase 9b Ability: Add instructions 
- [NEW] Phase 11 Mutations: Add space for mutations
- [NEW] Phase 12 Economy Sync: Connecting item catalog buttons to check and subtract item `.cost` totals from the active editable silver piece purse balance on equip click.
- [NEW] Phase 13 Magic: Add magic items & spells
- [NEW] Phase 14 Name: Add name generator
- [NEW] Phase 15 Conditions: Add conditions (maybe only for PDF print)
- [NEW] Phase 16 Fatigue & Encumbrance: Mark fatigue and Encumbrance
- [NEW] Phase 17 Pregen All: One button to randomize everything!
- [DONE] Phase 18 Webapp cleanup: Better layout with fonts (look at https://shadowdarklings.net/create as layout for webapp)
- [NEW] Phase 19 Bonds: Add input field for PC name? Change input to dropdown?
- [NEW] Phase 20 Character Status: Change name? Stack? Bubble?
- [NEW] Phase 21 Wallet & Coinage: 
- [NEW] Phase 23 Equipment & Inventory: 
    - 
- [NEW] Phase 24 Save & Load: 
    - Button consistency

- [NEW] Phase 25 PDF cleanup: Better looking front & back layout for character sheet