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

## Background Updates for HP, AC, Inventory, Coins

- **Background Data Automation (backgrounds.json):** Expanded background entries to include structured grants for items, silver currency, free gear text, and companions.   
- **Custom Slot Overrides:** Configured item grants to support custom slot overrides (such as enforcing 1 full slot for the Romanticist's quill, ink, and paper).   
- **State Synchronization & Cleanup:** Built a useEffect handler in `App.tsx` that tracks prevBackground to automatically revert previously granted silver, text, and inventory items when switching backgrounds, preventing exploit stacking.Inline 
- **Catalog & Database Wiring:** Integrated `items.json` lookups with inline item fallbacks to push background-granted equipment directly into the character's active inventory.
- **Companion Sync Integration:** Tied background-granted companions and talent-granted companion slots into the active companion state and sheet rendering.

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
- [DONE] Phase 7d Talents: Alternative to long list of talents. Dialog?

- [DONE] Phase 8 Advancement: Add logic for leveling up characters -- HP, talents, ability bonus. 
- [DONE] Phase 9a Ability Max: Add logic for controlling maximum value of ability scores 
- [DONE] Phase 9b Ability: Add instructions, descriptions. Fix Constitution > Willpower, Attributes > Abilities
- [DONE] Phase 10 Traits: Add dropdowns. Stack labels? 2 columns?
- [DONE] Phase 11 Mutations: Add space for mutations
    - no background adds mutations
    - no trait adds mutations
    - no talent adds mutations
    - no talent adds mutations
    - [DONE] Created `Mutations.json` from option Doom & Mishaps table
    - [DONE] Created `spell_mutations.json`
    - [DONE] Check mutations.json vs rules
- [DONE] Phase 12 Economy Sync: Connecting item catalog buttons to check and subtract item `.cost` totals from the active editable silver piece purse balance on equip click.
- [DONE] Phase 13 Magic: Add magic items & spells
    - [DONE] Created spells.json
    - [DONE] Build modal to select spells
- [DONE] Phase 14 Name: Add name generator
- [DONE] Phase 18 Webapp cleanup: Better layout with fonts (look at https://shadowdarklings.net/create as layout for webapp)
- [DONE] Phase 21 Wallet & Coinage: 
- [DONE] Phase 22 Background: No longer shows description.  
- [DONE] Phase 22b Backgrounds: Confirm `backgrounds.json` matches rulebook. 
    - Backgrounds that grant talents: add logic
        - 58–59 (Poacher): Gain the Dog Whisperer talent

## PDF Weapons 
- no damage coming through for standard weapons. 
- no bonus shown for standard weapons. 

## 🏁 Next Target Steps
- [NEW] Phase 7e Talents: Check talents for display. Some have additional effects (like granting spells, familiars, etc.)
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
    - Construct: Secret Compartments - item slots
    - Thief: Always Prepared - 
    - Shield Master: AC bonus for shield
    - Dark Bloodline: Suboptions
- [WIP] Categories of Changes. 
    - [DONE] HP Changes (e.g., Brick Outhouse, Veteran, Professional Killer)
    - [DONE] AC Changes (e.g., Stone Skin, Two-Weapon Fighter, Shield Master)
    - [DONE] Item Slot Changes (e.g., Secret Compartments, Handy if Not Handsome, Pack Rat)
    - [DONE] Suboptions / Choices (e.g., Draconic Bloodlines, Radiance)
    - [WIP] Companions / Summons (e.g., Dog Whisperer, Familiar, Hospitaller)
        - familiar ?

- [WIP] Phase 13 Magic: Add magic items & spells
    - [NEW] Check spells.json vs rules

- [NEW] Phase 15 Conditions: Add conditions (maybe only for PDF print)
- [NEW] Phase 16 Fatigue & Encumbrance: Mark fatigue and Encumbrance
- [NEW] Phase 17 Pregen All: One button to randomize everything!
- [NEW] Phase 19 Bonds: Add input field for PC name? Change input to dropdown?
- [NEW] Phase 20 Character Status: Change name? Stack? Bubble?
- [DONE] Phase 23 Equipment & Inventory: 
    - [DONE] Updated JSON for items (cp,sp,hands,etc.)
    - [DONE] UI mockups for cards & modals
    - [DONE] Built cards
    - [DONE] Built modals
    - [DONE] Live Search Filter in `ItemShopModal`
    - [DONE] Modal Height Stability: Set bounds with `min-height` and `max-height` on the item container so the modal UI stops jumping around vertically as results filter dynamically.
    - [DONE] Added shop flavor text: random name + templates
    - [DONE] Fixed roll silver button & modified card alignments
    - [DONE] Show items from backgrounds
        * [DONE] **Monster Hunter (4-6)**: Gain a shortbow and 20 arrows.
        * [DONE] **Former Squire (13-15)**: Gain a suit of battered medium armor.
        * [DONE] **Ill Luck (16-18)**: Gain a good luck trinket.
        * [DONE] **Accidental Revolutionary (34-36)**: Gain a tattered banner.
        * [DONE] **Romanticist (40-42)**: Gain a quill, ink, and paper (1 slot total).
        * [DONE] **Smuggler (49-51)**: Gain a lantern and 3 flasks of oil.
        * [DONE] **Dissident (56-57)**: Gain a bundle of torches (5).
        * [DONE] **Runaway (60-61)**: Start with 2 extra rations (pork themed).
        * [DONE] **Chicken Thief (62-63)**: Gain 1d6 chickens (if rolled 6, gain $6 \times 1d6 \times 1d6$ chickens instead).
        * [DONE] **Stagecoach Robber (67-69)**: Gain 5 silver pieces.
        * [DONE] **Gambler (70-72)**: Gain a set of weighted dice.
        * [DONE] **Wanderer (79-81)**: Gain a backpack and a shovel.
        * [DONE] **Abandoned (82-84)**: Start with 2 extra rations.
        * [DONE] **Monster Gourmand (85-86)**: Gain an iron pot and cooking utensils.
        * [DONE] **Letcher (99-100)**: Gain a vial of scented oil.
    - [DONE] Inventory changes from talents
        * [DONE] **Pack Rat (Thief)**: Adds 3 additional Item Slots to total carrying capacity.
        * [DONE] **Dog Whisperer (Hunter)**: Grants a dog companion.
        * [DONE] **Keeper of Relics (Holy Warrior)**: Grants 3 holy relics (spellcasting items).
        * [DONE] **Scholar of The Unseen University (Magic User)**: Grants 3 spellbooks.
        * [DONE] **Familiar (Magic User)**: Companion acts as 1 extra item slot for a spell.
        * [DONE] **Always Prepared (Thief)**: Unlocks purchasing Unlabelled Packages (1 slot items).
        * [DONE] **Eldritch Feast (Magic User)**: Spell is grafted directly to soul (0 item slots required).
        * [DONE] **Sword Wizard (Magic User)**: Replaces standard spellbooks with rune-carved swords.
    - [NEW] Items from talents
        * [DONE] **Dog Whisperer (Hunter)**: Grants a dog companion.
        * [DONE] **Keeper of Relics (Holy Warrior)**: Grants 3 holy relics (spellcasting items).
        * [DONE] **Scholar of The Unseen University (Magic User)**: Grants 3 spellbooks.
        * [NEW] **Always Armed (Thief)**: Always grants a hidden dagger.


        

- [NEW] Phase 24 Save & Load: 
    - Button consistency

- [NEW] Phase 25 PDF cleanup: Better looking front & back layout for character sheet

- [NEW] Task 26: App-Wide Accessibility (a11y) Overhaul

    **Status:** [IN PROGRESS]
    **Goal:** Upgrade the Glaive Character Builder to conform to WCAG 2.1 AA standards, ensuring complete screen reader support, keyboard navigation, and high-contrast compliance.

    - [ ] **26.1: Semantic HTML & Document Structure**
        - [ ] Wrap primary layout regions in appropriate semantic tags (`<header>`, `<main>`, `<nav>`, `<footer>`).
        - [ ] Review heading hierarchy (`<h1>` through `<h3>`) across all character card components to ensure logical nesting without skipping levels.

    - [ ] **26.2: Modal Dialog Accessibility & Focus Trapping**
        - [ ] Implement focus trapping for `TalentSelectorModal` and `ItemShopModal` so keyboard navigation (`Tab` / `Shift+Tab`) stays contained inside active modals.
        - [ ] Auto-focus the primary interactive element (e.g., search input) upon modal open, and restore focus to the triggering element upon close.
        - [ ] Add `aria-modal="true"`, `role="dialog"`, and `aria-labelledby` attributes to modal root elements.
        - [ ] Ensure pressing the `Escape` key reliably closes any active modal overlay.

    - [ ] **26.3: Custom Controls & ARIA Attributes**
        - [ ] Convert the 3-option Segmented Control (`All Talents` | `Ancestry` | `Heroic`) to use proper ARIA tab pattern (`role="tablist"`, `role="tab"`, `aria-selected="true|false"`).
        - [ ] Add explicit `aria-label` tags to all icon-only buttons (e.g., modal close `✕` buttons, roll buttons, counter increment/decrement controls).
        - [ ] Ensure all filter pills and dynamic buttons announce active states to screen readers (`aria-pressed` or `aria-selected`).

    - [ ] **26.4: Forms & Input Labeling**
        - [ ] Audit all input fields (Name, Level, Search inputs, Item quantities) to ensure each has a visible `<label>` or an `aria-label` attribute.
        - [ ] Add `aria-describedby` links where input fields have secondary helper text or error messages.

    - [ ] **26.5: Keyboard Navigation & Focus Indicators**
        - [ ] Ensure all interactive elements have highly visible focus rings using CSS `:focus-visible` token colors.
        - [ ] Verify that non-button clickable `<div>` or `<span>` elements are replaced with native `<button>` tags or provided `tabIndex={0}` and keyboard event handlers (`Enter` / `Space`).

    - [ ] **26.6: Color Contrast & Visual Clarity**
        - [ ] Audit low-contrast text colors (`#64748b`, `#4a5568`, dynamic tags) against light surface backgrounds to guarantee at least a 4.5:1 contrast ratio.
        - [ ] Ensure essential UI indicators (selected tabs, active pills, badges) do not rely solely on color to convey state (e.g., include text labels, icons, or visual weight shifts).

    - [ ] **26.7: Automated & Manual Testing Verification**
        - [ ] Run Lighthouse accessibility audits against `npm run preview` to achieve a 95+ score.
        - [ ] Perform full keyboard-only navigation pass (completing a character build without a mouse).
        - [ ] Verify screen reader compatibility using VoiceOver (macOS) or NVDA (Windows).