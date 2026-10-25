# CyberShield AI — Cyber Deception & Blockchain Provenance Sentinel

[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![MITRE ATT&CK](https://img.shields.io/badge/MITRE-ATT%26CK%20Aligned-red.svg)](https://attack.mitre.org)
[![Blockchain](https://img.shields.io/badge/Blockchain-Proof--of--Authority-purple.svg)](https://ethereum.org)

> **Next-Generation Autonomous Cyber Deception System with Realistic Decoy Assets, Intruder Movement Tracing, and Blockchain-Anchored Immutable Forensic Audit Ledger.**

---

## 🎯 Problem Statement & Description

### Cybersecurity & Blockchain:
Develop an autonomous **cyber deception system** that creates realistic decoy digital assets to detect intruders and trace their movement through a simulated network.

### Description:
Build a simulated network containing:
- **Decoy Files (Honeyfiles / Canary Documents)**: Confidential documents, credentials files, and source code repositories with embedded web beacons.
- **Fake Credentials (Honeytokens)**: Synthesized high-privilege Active Directory admin accounts, cloud IAM access keys, and poisoned JWT tokens.
- **Monitored Endpoints & Decoy Services**: Honeypot SSH shells, decoy S3 object buckets, and SCADA/OT PLC interfaces.

When suspicious activity interacts with these decoys, the system:
1. **Triggers Real-Time Alerts**: High-fidelity detection with zero false-positives (decoys have zero legitimate business use).
2. **Reconstructs Intruder Movement**: Visualizes hop-by-hop lateral movement trajectory across network subnets.
3. **Generates an Incident Timeline**: Chronological forensic reconstruction mapped to **MITRE ATT&CK tactics**.
4. **Anchors Proof on Blockchain**: Overcomes anti-forensics (log wiping / timestamp tampering) by sealing every alert and telemetry snapshot into an immutable cryptographic blockchain ledger (**DecoyGrid Chain**).

---

## 🚀 Key Modules & Architecture

### 1. 🌐 Interactive Simulated Network Topology
- **6 Interconnected Enterprise Zones**:
  - `Edge Perimeter DMZ` (`198.51.100.2`)
  - `Corp Finance Workstation #42` (`10.0.1.42`)
  - `Decoy Cloud S3 Lake` (`s3://corp-backups-q4`)
  - `Active Directory Domain Controller` (`10.0.2.5`)
  - `Core Financial Database & Vault` (`10.0.3.12`)
  - `Decoy Bastion Honeynet` (`10.0.4.99`)
- Real-time animated packet flows and glowing red attack vectors that trace the intruder's exact hop sequence in real time.
- Interactive node inspector: Click any node to view active services, installed decoys, and real-time containment status.

### 2. 🪤 Decoy Asset Generator & Camouflage Studio
- Pre-seeded realistic decoy assets with high fidelity realism scores:
  - `Q4_Executive_Payroll_Bonus.xlsx` (Embedded macro DNS beacon)
  - `prod-payment-gateway.env` (Poisoned Stripe & AWS API keys)
  - `id_rsa_backup.pem` (Decoy OpenSSH private key with DNS tracking)
  - `DOMAIN\svc_backup_admin` (Active Directory fake administrator account)
  - `AKIA_CANARY_PROD_99` (Decoy AWS IAM credential)
  - `Decoy Bastion SSH Honeypot (Port 2222)` (Monitors brute force & lateral logins)
  - `Decoy SCADA Modbus PLC (Port 502)` (Industrial control honeypot)
- **Deploy New Decoy Wizard**: Deploy custom honeyfiles, tokens, or endpoints on any node with custom payloads on the fly.

### 3. ⚡ Automated Kill-Chain Simulator & Red-Team Terminal
- **3 Pre-Programmed Automated Kill Chains**:
  - **Spear-Phishing to Lateral Pivot** (Workstation -> Decoy Payroll -> Fake AD admin -> Lateral SSH jump -> Bastion Honeynet isolation)
  - **Cloud Recon & Decoy S3 Exfiltration** (Edge port scan -> Canary `.env` file -> AWS STS enumeration -> S3 honeypot trap)
  - **Ransomware Outbreak & Canary Trap Rapid Quarantining** (Rapid encryption attempt -> multiple honeyfiles touched -> heuristic micro-segmentation in 110ms)
- **Interactive Red-Team Attacker Console**:
  - Users can manually type attacker commands: `scan`, `cat`, `download`, `use-cred`, `ssh`, `exfil`, `clear`, `help`.

### 4. ⏱️ Forensic Incident Timeline & MITRE ATT&CK Mapping
- Step-by-step playback controls (Play, Pause, Step Forward/Back, Speed 1x/2x/4x).
- Visual attack trajectory cards displaying source-to-target hops.
- Detailed forensic telemetry: Attacker IP (`194.26.29.112`), User-Agent, Process PID, TTPs, and SHA-256 evidence hashes.

### 5. ⛓️ Blockchain Forensic Ledger & Proof-of-Tamper
- **DecoyGrid On-Chain Explorer**:
  - Live block explorer with Block Number, Previous Hash, Block Hash, Merkle Root, Nonce, and Validator Node.
- **On-Chain Canary Smart Contract**:
  - Monitors a simulated $50,000 USDT honeypot vault contract (`0x71C8360f3a146747E7F092A28b3f27C86A8D6b82`) for unauthorized withdrawal attempts.
- **Interactive Anti-Forensic Tamper Verification Suite**:
  - Analysts can verify cryptographic authenticity against the blockchain ledger.
  - **"Simulate Tamper Attack"**: Demonstrates what happens when an attacker modifies local incident logs. The cryptographic engine immediately detects the hash mismatch and displays a red **"TAMPER DETECTED — BLOCKCHAIN AUDIT FAILED"** alert!
  - **"Recover from Chain"**: Recovers authentic unaltered logs directly from the immutable blockchain.

### 6. 📄 Compliance & Executive Incident Report
- Generates instant executive incident reports with MITRE ATT&CK matrix summaries, evidence hashes, and on-chain verification stamps.
- Supports one-click **JSON export** and formatted **Print to PDF**.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 19, JavaScript (ES2024), HTML5 Semantic Architecture
- **Styling**: Vanilla CSS3 Custom Design System (Tactical Cyber SOC Dark Mode, Glassmorphism, Micro-Animations)
- **Typography**: Google Fonts (`Rajdhani`, `Inter`, `JetBrains Mono`)
- **Icons**: Lucide React
- **Cryptography**: Synchronous SHA-256 + SubtleCrypto, Merkle Tree Root Computation
- **Audio Synthesis**: Native Web Audio API Synthesizer (Zero external audio dependencies)
- **Tooling & Build**: Vite 8.3
- **Deployment**: Vercel & GitHub

---

## 💻 Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Arshi-shaik-07/cybershield-ai.git
   cd cybershield-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## ☁️ Deployment to Vercel

This repository is optimized for one-click deployment on Vercel:

```bash
vercel --prod
```

Or connect the repository on [Vercel Dashboard](https://vercel.com/new).

---

## 🔒 Security & Academic Note

This project is designed as an educational, defensive cyber deception simulation platform and blockchain forensic provenance framework. All decoy assets, credentials, and telemetry are synthesized for authorized defensive research and intrusion analysis.
