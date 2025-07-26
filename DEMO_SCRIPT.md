# Detection Lab - Demo Script for Pitch Video

## 🎬 **Demo Flow Overview**

### **Scene 1: Introduction & Problem Statement (30 seconds)**
- **Visual**: Show the main dashboard with security metrics
- **Narration**: "In today's complex threat landscape, organizations struggle to validate their detection capabilities against real-world APT attacks. Traditional security testing is manual, time-consuming, and doesn't provide comprehensive coverage."

### **Scene 2: Platform Overview (45 seconds)**
- **Visual**: Navigate through the main dashboard showing:
  - System health metrics
  - Recent activity feed
  - MITRE ATT&CK coverage
- **Narration**: "Detection Lab provides an automated platform for running MITRE-mapped breach simulations, streaming telemetry to multiple SIEMs, and converting detection rules across different security platforms."

---

## 🚀 **Core Demo Scenarios**

### **Scenario 1: APT Attack Simulation (2 minutes)**

#### **Step 1: Select APT Profile**
- **Action**: Click "Run Simulation" → Select "APT29 (Cozy Bear)"
- **Visual**: Show APT profile selection with sophistication level and techniques
- **Narration**: "Let's simulate an APT29 attack, a sophisticated Russian state-sponsored group known for their advanced techniques."

#### **Step 2: Launch Advanced Simulation**
- **Action**: Click "Advanced Simulation" button
- **Visual**: Simulation modal opens showing:
  - APT group selection
  - Target environment configuration
  - MITRE technique mapping
- **Narration**: "Our platform maps each attack step to specific MITRE ATT&CK techniques, providing comprehensive coverage of the attack lifecycle."

#### **Step 3: Real-time Attack Chain**
- **Action**: Click "Start Simulation"
- **Visual**: Show real-time progress through attack chain:
  - Initialization (30s)
  - Reconnaissance - T1595 Active Scanning (45s)
  - Initial Access - T1566 Phishing (60s)
  - Execution - T1059 Command and Scripting Interpreter (90s)
  - Persistence - T1547 Boot or Logon Autostart Execution (75s)
  - Privilege Escalation - T1055 Process Injection (120s)
  - Defense Evasion - T1027 Obfuscated Files or Information (90s)
  - Collection - T1003 Credential Access (60s)
  - Data Exfiltration - T1041 Exfiltration Over C2 Channel (45s)
  - Cleanup - T1070 Indicator Removal (30s)
- **Narration**: "Watch as the simulation progresses through each phase of the attack chain, with real-time telemetry generation and MITRE technique mapping."

#### **Step 4: Live Telemetry Streaming**
- **Visual**: Show telemetry panel with real-time events:
  - Process creation events
  - Network connections
  - File access patterns
  - Registry modifications
  - DNS queries
- **Narration**: "Each attack step generates realistic telemetry events that are streamed to your SIEM infrastructure in real-time."

---

### **Scenario 2: Multi-SIEM Integration (1.5 minutes)**

#### **Step 1: SIEM Connection Status**
- **Action**: Click "SIEM Integration" button
- **Visual**: Show SIEM connections panel:
  - Splunk Enterprise (Connected - 1,247 events)
  - Elastic Security (Connected - 1,247 events)
  - Grafana Loki (Connected - 1,247 events)
  - IBM QRadar (Connecting...)
- **Narration**: "Detection Lab integrates with multiple SIEM platforms simultaneously, ensuring your existing security infrastructure receives the telemetry data."

#### **Step 2: Rule Conversion Process**
- **Action**: Click "Convert All Rules"
- **Visual**: Show rule conversion progress:
  - Process Injection Detection (T1055) - Deployed
  - Credential Dumping (T1003) - Converting (75%)
  - Lateral Movement (T1021) - Converted
  - Data Exfiltration (T1041) - Pending
- **Narration**: "Our PySigma integration automatically converts detection rules across different SIEM formats - Splunk SPL, Elastic YAML, QRadar XML, and Sigma rules."

#### **Step 3: Multi-Format Output**
- **Visual**: Show converted rules for each SIEM:
  - Splunk: `splunk_rule_001.spl`
  - Elastic: `elastic_rule_001.yml`
  - QRadar: `qradar_rule_001.xml`
  - Sigma: `sigma_rule_001.yml`
- **Narration**: "Each detection rule is automatically converted to the native format of your SIEM, eliminating manual rule translation and ensuring consistent detection across platforms."

---

### **Scenario 3: Detection Analysis (1 minute)**

#### **Step 1: Results Dashboard**
- **Action**: Navigate to "Detection Results"
- **Visual**: Show detection analysis:
  - 12 MITRE techniques tested
  - 10 techniques detected (83% coverage)
  - 2 techniques missed (17% gap)
  - Detailed breakdown by technique
- **Narration**: "After the simulation completes, you get a comprehensive analysis of your detection coverage, identifying gaps in your security posture."

#### **Step 2: Gap Analysis**
- **Visual**: Show missed detections:
  - T1027 (Obfuscated Files) - Not detected
  - T1070 (Indicator Removal) - Not detected
- **Narration**: "The platform identifies specific MITRE techniques that weren't detected, helping you prioritize improvements to your detection rules."

---

## 🎯 **Key Value Propositions to Highlight**

### **1. Automation & Efficiency**
- **Point**: "What used to take security teams weeks of manual testing now happens automatically in minutes"
- **Visual**: Show simulation completion time vs traditional manual testing

### **2. MITRE ATT&CK Coverage**
- **Point**: "100% MITRE ATT&CK technique mapping ensures comprehensive attack simulation"
- **Visual**: Show MITRE matrix with covered techniques highlighted

### **3. Multi-SIEM Support**
- **Point**: "Works with your existing SIEM infrastructure - no rip and replace required"
- **Visual**: Show multiple SIEM connections and rule conversions

### **4. Real-time Telemetry**
- **Point**: "Realistic telemetry streaming provides authentic data for your detection testing"
- **Visual**: Show live telemetry events streaming to SIEMs

### **5. Rule Conversion**
- **Point**: "Automatic rule conversion eliminates manual translation between SIEM formats"
- **Visual**: Show PySigma conversion process and multi-format outputs

---

## 📊 **Technical Specifications to Mention**

### **Supported APT Groups**
- APT29 (Cozy Bear) - Russian state-sponsored
- APT28 (Fancy Bear) - Russian military intelligence
- APT41 (BARIUM) - Chinese state-sponsored
- Lazarus Group - North Korean cyber operations

### **Supported SIEMs**
- Splunk Enterprise
- Elastic Security
- Grafana Loki
- IBM QRadar
- Any SIEM supporting Sigma rules

### **MITRE ATT&CK Coverage**
- 15+ attack techniques per APT group
- Full attack lifecycle simulation
- Real-time technique mapping

### **Telemetry Generation**
- Process creation events
- Network connections
- File system activity
- Registry modifications
- DNS queries
- Authentication events

---

## 🎬 **Video Production Notes**

### **Camera Angles**
- **Wide shot**: Show entire dashboard layout
- **Medium shot**: Focus on specific features being demonstrated
- **Close-up**: Highlight important metrics and status indicators

### **Screen Recording Tips**
- Use smooth transitions between sections
- Highlight important UI elements with cursor movements
- Show real-time animations and progress indicators
- Include status bars and loading states

### **Audio Guidelines**
- Clear, professional narration
- Background music (subtle, cybersecurity-themed)
- Sound effects for button clicks and notifications
- Consistent audio levels throughout

### **Graphics & Overlays**
- Add MITRE ATT&CK technique IDs as overlays
- Show progress percentages during simulations
- Highlight SIEM connection status indicators
- Display real-time event counters

---

## 🎯 **Call to Action**

### **Ending Message**
"Detection Lab transforms how organizations validate their security posture. From automated APT simulations to multi-SIEM integration, we provide the tools you need to build robust detection capabilities. Ready to see your security infrastructure in action? Let's get started."

### **Contact Information**
- Website: [detectionlab.com]
- Email: [contact@detectionlab.com]
- Demo Request: [demo@detectionlab.com]

---

## 📋 **Demo Checklist**

### **Pre-Demo Setup**
- [ ] All SIEM connections configured
- [ ] APT profiles loaded
- [ ] Detection rules prepared
- [ ] Telemetry streaming ready
- [ ] Screen recording software active

### **Demo Flow**
- [ ] Introduction and problem statement
- [ ] Platform overview
- [ ] APT simulation demonstration
- [ ] SIEM integration showcase
- [ ] Detection analysis results
- [ ] Key value propositions
- [ ] Call to action

### **Post-Demo**
- [ ] Save recording
- [ ] Edit for clarity and timing
- [ ] Add graphics and overlays
- [ ] Review and finalize
- [ ] Prepare for distribution 