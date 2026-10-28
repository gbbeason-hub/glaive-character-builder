# Glaive Character Builder & Printable Sheet

This character builder is a web-based character generator and interactive two-page printable character sheet designed for the **Glaive RPG** (v3). Built with React, TypeScript, and Vite, this tool allows players to create Glaive characters online and generate a clean, print-ready 8.5" x 11" PDF character sheet for tabletop play.

---

## 🎲 For Players

You don't need to install anything to use the builder! Just go to the live site to create and print your character sheet.

1. **Configure Your Character:** Use the interactive builder UI to set up your attributes, gear, spells, and character details.
2. **Print or Save as PDF:** Click **Print Character Sheet** (or press `Ctrl + P` / `Cmd + P`). It includes space for adding talents, inventory, weapons, etc. 
3. **Save & Upload JSON:** Save your character as JSON to use with other applications or to load & modify. 
4. **Recommended Print Settings:**
   - **Paper Size:** Letter (8.5" x 11")
   - **Layout:** Portrait
   - **Margins:** Minimum or Custom (`0.25in`)
   - **Background Graphics:** **ON** (required for stat fills and condition checkmarks)

---

## ✨ Key Features

- **2-Page Printable Layout (`@media print`):** Formatted for 8.5" x 11" portrait printing with crisp page breaks and distinct front/back sections:
  - **Page 1 (Core & Combat):** Stat blocks, conditions tracker, equipped weapon cards, and a 9-row talent write-in table.
  - **Page 2 (Logistics & Inventory):** Active bound spells list, 10 spell write-in slots, starting gear summary, and an 18-slot inventory grid.
- **Pencil-Friendly Progression Design:** 
  - Unearned/locked inventory slots render with a subtle **dashed border**. As characters gain Strength or unlock slots, simply outline the dotted slots.
  - Dedicated write-in rows for additional weapons, spells, and talents acquired mid-session.
- **Custom Tabletop Typography:** Styled using atmospheric display fonts (*Lilita One*, *Amaranth*, *Rubik Dirt*) optimized for readability both on screen and on paper.

---

## ⚠️ Known Limits & Scope

This app focuses on core *Glaive* rules. Please note the following intentional limitations:

* **Builder vs Online Character Sheet:** The focus is on a character builder. It's not intended to be an online character sheet you can use & update as you play at the table. It's meant to be printed. But you can save the JSON for your build, load it, and update it. 
* **No Optional Simple Quantum Gear:** This option for gear isn't supported at this time. I currently don't have plans for it, but I'll consider it. 
* **Core Items, Spells, Traits, Talents:** Glaive is great to customize. But I didn't build that ability into this version. (It'd be cool to include homebrewed content and give players an option to use it . . . but that's out of scope for now.)

---

## 🛠️ Developer Setup & Local Development

If you want to clone this repository, tweak the CSS, or customize the mechanics for your homebrew rules:

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)

### Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR-USERNAME/glaive-character-builder.git
   cd glaive-character-builder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start local development server:
   ```bash
   npm run dev
   ```

---

## 📜 License

Distributed under the MIT License. Feel free to fork, adapt, and build upon it for your home games!