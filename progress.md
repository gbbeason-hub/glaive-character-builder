# Glaive v3 Character Builder Progress Master

## 🎯 Core Project Goal
To build a lightweight, fully client-side character generator and digital workbook for the tabletop RPG "Glaive v3." The application must enforce native system rules (such as dynamic attribute caps, slot-based encumbrance, and character origin tables), manage an item marketplace, and export a print-ready, high-fidelity physical character sheet—all powered by a portable, serverless Base64 clipboard save/load system.


## 🛠️ Stack Configuration
- Framework: React (v18+) + TypeScript (`src/App.tsx`, `src/ItemCard.tsx`).
- Environment: Local Vite development server running cleanly on localhost:5173.

## 🗃️ Active Flat Databases
1. `public/items.json`: Completed master item array containing categorized Weapon (`w_`), Armor (`a_`), Ammunition, and Gear (`g_`) datasets with exact slot weights and silver piece costs.
2. `public/traits.json`: 1d6 and 1d20 array tables handling text descriptors for Gender, Hair, Looks, Skin, and Speech. Includes a 6x6 multidimensional array matrix for Social Bonds.
3. `public/backgrounds.json`: Compact d100 database mapping narrative origin strings utilizing explicit mathematical `min` and `max` numeric boundaries.

## 📐 Implemented Rule Equations (Derived Real-Time Stats)
- Max Attribute Dropdowns: Dynamically capped via `Math.min(5, level + 2)`.
- Vital Gauges: `HP = 10 + STR`. `AC = 10 + DEX + Sum of equipped armor defense keys`.
- Encumbrance Burden: JavaScript array reducer sums item slot weights against `10 + STR`. Changes color layout state to a bright warning box if exceeded.
- Tiered Starting Purse: 1d20 look-up table driving dice pools (0 SP / 2d6x10 SP / 3d6x10 SP).

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

## 🏁 Next Target Steps
- Phase 4 Mihtril: Add mithril armor 
- Phase 5 Ancestry: Add Ancestry selection with talent
- Phase 6 Talents: Add space for talents
- Phase 7 Mutations: Add space for mutations
- Phase 8 Economy Sync: Connecting item catalog buttons to check and subtract item `.cost` totals from the active editable silver piece purse balance on equip click.
- Phase 9 Magic: Add magic items & spells
- Phase 10 Name: Add name generator
- Phase 11 Conditions: Add conditions (maybe only for PDF print)
- Phase 12 Fatigue & Encumbrance: Mark fatigue and Encumbrance
- Phase 13 Pregen All: One button to randomize everything!
- Phase 14 Webapp cleanup: Better layout with fonts (look at https://shadowdarklings.net/create as layout for webapp)
- Phase 15 PDF cleanup: Better looking front & back layout for character sheet