#!/usr/bin/env python3
"""
AI-Driven Detection Engineering Lab Platform - Premium Gradio Frontend
A beautiful, modern cybersecurity detection lab interface for APT simulation and analysis.
"""

import gradio as gr
import pandas as pd
import json
import time
import os
from datetime import datetime
from typing import Dict, List, Tuple, Optional
import threading
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots

# =============================================================================
# ENHANCED MOCK DATA AND CONFIGURATION
# =============================================================================

# APT Groups with enhanced metadata
APT_GROUPS_ENHANCED = {
    "APT29 (Cozy Bear)": {"country": "Russia", "sophistication": "Very High", "targets": "Government, Healthcare", "color": "#dc2626"},
    "APT28 (Fancy Bear)": {"country": "Russia", "sophistication": "Very High", "targets": "Military, Government", "color": "#ea580c"},
    "APT33 (Elfin)": {"country": "Iran", "sophistication": "High", "targets": "Energy, Aviation", "color": "#d97706"},
    "APT34 (OilRig)": {"country": "Iran", "sophistication": "High", "targets": "Financial, Government", "color": "#ca8a04"},
    "APT38 (Lazarus)": {"country": "North Korea", "sophistication": "Very High", "targets": "Financial, Crypto", "color": "#65a30d"},
    "APT39 (Chafer)": {"country": "Iran", "sophistication": "Medium", "targets": "Telecommunications", "color": "#16a34a"},
    "APT40 (Leviathan)": {"country": "China", "sophistication": "High", "targets": "Maritime, Engineering", "color": "#0d9488"},
    "APT41 (Double Dragon)": {"country": "China", "sophistication": "Very High", "targets": "Healthcare, Telecom", "color": "#0891b2"},
    "Carbanak": {"country": "International", "sophistication": "High", "targets": "Financial", "color": "#3b82f6"},
    "FIN7": {"country": "Unknown", "sophistication": "High", "targets": "Retail, Hospitality", "color": "#6366f1"}
}

APT_GROUPS = list(APT_GROUPS_ENHANCED.keys())

# Enhanced detection results with more realistic data
ENHANCED_DETECTION_RESULTS = {
    "APT29 (Cozy Bear)": [
        {"Technique": "T1055.002", "Name": "Process Injection: Portable Executable", "Tactic": "Defense Evasion", "Coverage": "Full", "Confidence": "95%", "Last_Seen": "2024-01-15", "Severity": "High"},
        {"Technique": "T1078.004", "Name": "Valid Accounts: Cloud Accounts", "Tactic": "Initial Access", "Coverage": "Partial", "Confidence": "78%", "Last_Seen": "2024-01-14", "Severity": "Critical"},
        {"Technique": "T1083", "Name": "File and Directory Discovery", "Tactic": "Discovery", "Coverage": "Full", "Confidence": "92%", "Last_Seen": "2024-01-15", "Severity": "Medium"},
        {"Technique": "T1090.003", "Name": "Proxy: Multi-hop Proxy", "Tactic": "Command and Control", "Coverage": "None", "Confidence": "0%", "Last_Seen": "N/A", "Severity": "High"},
        {"Technique": "T1105", "Name": "Ingress Tool Transfer", "Tactic": "Command and Control", "Coverage": "Partial", "Confidence": "65%", "Last_Seen": "2024-01-13", "Severity": "Medium"},
        {"Technique": "T1566.001", "Name": "Spearphishing Attachment", "Tactic": "Initial Access", "Coverage": "Full", "Confidence": "88%", "Last_Seen": "2024-01-15", "Severity": "Critical"},
        {"Technique": "T1059.001", "Name": "PowerShell", "Tactic": "Execution", "Coverage": "Full", "Confidence": "96%", "Last_Seen": "2024-01-15", "Severity": "High"},
    ],
    "APT33 (Elfin)": [
        {"Technique": "T1059.003", "Name": "Windows Command Shell", "Tactic": "Execution", "Coverage": "Full", "Confidence": "98%", "Last_Seen": "2024-01-12", "Severity": "High"},
        {"Technique": "T1087.002", "Name": "Domain Account Discovery", "Tactic": "Discovery", "Coverage": "Full", "Confidence": "89%", "Last_Seen": "2024-01-12", "Severity": "Medium"},
        {"Technique": "T1135", "Name": "Network Share Discovery", "Tactic": "Discovery", "Coverage": "Partial", "Confidence": "67%", "Last_Seen": "2024-01-11", "Severity": "Medium"},
        {"Technique": "T1560.001", "Name": "Archive via Utility", "Tactic": "Collection", "Coverage": "None", "Confidence": "0%", "Last_Seen": "N/A", "Severity": "Medium"},
        {"Technique": "T1003.001", "Name": "LSASS Memory", "Tactic": "Credential Access", "Coverage": "Partial", "Confidence": "73%", "Last_Seen": "2024-01-10", "Severity": "Critical"},
    ]
}

# Mock report files
MOCK_REPORTS = [
    "APT29_CozyBear_Analysis.md",
    "APT33_Elfin_Report.md", 
    "Detection_Coverage_Summary.md",
    "MITRE_ATT&CK_Heatmap.md",
    "Weekly_Lab_Report.pdf",
    "Threat_Intelligence_Brief.pdf"
]

# Global state for enhanced simulation
simulation_state = {
    "running": False,
    "current_apt": None,
    "start_time": None,
    "logs": [],
    "progress": 0,
    "current_phase": "Idle",
    "techniques_executed": 0,
    "detections_triggered": 0
}

# =============================================================================
# ENHANCED VISUALIZATION FUNCTIONS
# =============================================================================

def create_coverage_donut_chart(apt_name: Optional[str] = None):
    """Create a beautiful donut chart for detection coverage."""
    if apt_name and apt_name != "All APT Groups" and apt_name in ENHANCED_DETECTION_RESULTS:
        data = ENHANCED_DETECTION_RESULTS[apt_name]
    else:
        data = []
        for apt_results in ENHANCED_DETECTION_RESULTS.values():
            data.extend(apt_results)
    
    df = pd.DataFrame(data)
    if df.empty:
        # Return empty chart if no data
        fig = go.Figure()
        fig.update_layout(
            title="No data available",
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)',
            font=dict(color='#e5e7eb'),
            height=400
        )
        return fig
    
    coverage_counts = df['Coverage'].value_counts()
    colors = ['#10b981', '#f59e0b', '#ef4444']  # Green, Yellow, Red
    
    fig = go.Figure(data=[go.Pie(
        labels=coverage_counts.index,
        values=coverage_counts.values,
        hole=.6,
        marker_colors=colors,
        textinfo='label+percent',
        textfont_size=14,
        marker=dict(line=dict(color='#1f2937', width=2))
    )])
    
    fig.update_layout(
        title={
            'text': f"<b>Detection Coverage Overview</b><br><sub>{'All APT Groups' if not apt_name or apt_name == 'All APT Groups' else apt_name}</sub>",
            'x': 0.5,
            'font': {'size': 18, 'color': '#e5e7eb'}
        },
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        font=dict(color='#e5e7eb'),
        showlegend=True,
        legend=dict(
            orientation="h",
            yanchor="top",
            y=-0.1,
            xanchor="center",
            x=0.5
        ),
        height=400
    )
    
    return fig

def create_technique_heatmap():
    """Create a MITRE ATT&CK technique heatmap."""
    techniques = []
    tactics = []
    scores = []
    
    for apt_data in ENHANCED_DETECTION_RESULTS.values():
        for item in apt_data:
            techniques.append(item['Technique'])
            tactics.append(item['Tactic'])
            if item['Coverage'] == 'Full':
                scores.append(100)
            elif item['Coverage'] == 'Partial':
                scores.append(60)
            else:
                scores.append(0)
    
    df = pd.DataFrame({
        'Technique': techniques,
        'Tactic': tactics,
        'Score': scores
    })
    
    pivot_df = df.groupby(['Tactic', 'Technique'])['Score'].mean().reset_index()
    
    fig = px.treemap(
        pivot_df,
        path=['Tactic', 'Technique'],
        values='Score',
        color='Score',
        color_continuous_scale=['#ef4444', '#f59e0b', '#10b981'],
        title="<b>MITRE ATT&CK Coverage Heatmap</b>"
    )
    
    fig.update_layout(
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        font=dict(color='#e5e7eb'),
        title_font_size=18,
        height=500
    )
    
    return fig

def create_apt_comparison_chart():
    """Create APT group comparison radar chart."""
    apt_scores = {
        "APT29": [95, 78, 88, 45, 92],
        "APT33": [87, 92, 76, 23, 89],
        "APT38": [91, 65, 82, 78, 85],
        "APT28": [89, 88, 79, 67, 94],
        "APT34": [76, 71, 69, 34, 78]
    }
    
    categories = ['Initial Access', 'Execution', 'Persistence', 'Defense Evasion', 'Discovery']
    
    fig = go.Figure()
    
    colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']
    
    for i, (apt, scores) in enumerate(apt_scores.items()):
        fig.add_trace(go.Scatterpolar(
            r=scores + [scores[0]],  # Close the polygon
            theta=categories + [categories[0]],
            fill='toself',
            name=apt,
            line_color=colors[i],
            fillcolor=colors[i],
            opacity=0.3
        ))
    
    fig.update_layout(
        polar=dict(
            radialaxis=dict(
                visible=True,
                range=[0, 100],
                gridcolor='#374151',
                tickfont=dict(color='#9ca3af')
            ),
            angularaxis=dict(
                gridcolor='#374151',
                tickfont=dict(color='#e5e7eb', size=12)
            ),
            bgcolor='rgba(0,0,0,0)'
        ),
        title={
            'text': "<b>APT Group Detection Comparison</b>",
            'x': 0.5,
            'font': {'size': 18, 'color': '#e5e7eb'}
        },
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        font=dict(color='#e5e7eb'),
        showlegend=True,
        legend=dict(
            orientation="h",
            yanchor="top",
            y=-0.1,
            xanchor="center",
            x=0.5
        ),
        height=500
    )
    
    return fig

def create_timeline_chart():
    """Create detection timeline chart."""
    dates = pd.date_range(start='2024-01-01', end='2024-01-15', freq='D')
    detections = [12, 15, 8, 23, 19, 31, 27, 18, 25, 22, 29, 16, 33, 28, 24]
    false_positives = [2, 3, 1, 4, 2, 5, 3, 2, 3, 2, 4, 1, 5, 3, 2]
    
    fig = make_subplots(specs=[[{"secondary_y": True}]])
    
    fig.add_trace(
        go.Scatter(
            x=dates, y=detections,
            mode='lines+markers',
            name='True Detections',
            line=dict(color='#10b981', width=3),
            marker=dict(size=8)
        ),
        secondary_y=False,
    )
    
    fig.add_trace(
        go.Scatter(
            x=dates, y=false_positives,
            mode='lines+markers',
            name='False Positives',
            line=dict(color='#ef4444', width=2, dash='dash'),
            marker=dict(size=6)
        ),
        secondary_y=True,
    )
    
    fig.update_xaxes(
        title_text="<b>Date</b>",
        gridcolor='#374151',
        title_font_color='#e5e7eb',
        tickfont_color='#9ca3af'
    )
    fig.update_yaxes(
        title_text="<b>True Detections</b>",
        secondary_y=False,
        gridcolor='#374151',
        title_font_color='#10b981',
        tickfont_color='#9ca3af'
    )
    fig.update_yaxes(
        title_text="<b>False Positives</b>",
        secondary_y=True,
        title_font_color='#ef4444',
        tickfont_color='#9ca3af'
    )
    
    fig.update_layout(
        title={
            'text': "<b>Detection Performance Timeline</b>",
            'x': 0.5,
            'font': {'size': 18, 'color': '#e5e7eb'}
        },
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        font=dict(color='#e5e7eb'),
        hovermode='x unified',
        height=400
    )
    
    return fig

# =============================================================================
# ENHANCED BACKEND FUNCTIONS
# =============================================================================

def simulate_attack(apt_name: str) -> Tuple[str, str, float, str]:
    """Enhanced simulation with progress tracking."""
    global simulation_state
    
    if simulation_state["running"]:
        return (
            "⚠️ Simulation already running!",
            "\n".join(simulation_state["logs"]),
            simulation_state["progress"],
            simulation_state["current_phase"]
        )
    
    # Reset and start simulation
    simulation_state = {
        "running": True,
        "current_apt": apt_name,
        "start_time": datetime.now(),
        "logs": [],
        "progress": 0,
        "current_phase": "Initializing",
        "techniques_executed": 0,
        "detections_triggered": 0
    }
    
    apt_info = APT_GROUPS_ENHANCED[apt_name]
    initial_logs = [
        f"🚀 Launching {apt_name} simulation",
        f"🌍 Origin: {apt_info['country']} | Sophistication: {apt_info['sophistication']}",
        f"🎯 Primary targets: {apt_info['targets']}",
        f"⏰ Started at {simulation_state['start_time'].strftime('%H:%M:%S')}",
        "═" * 50,
        "📊 Initializing attack simulation environment...",
        "🔧 Loading MITRE ATT&CK technique library...",
        "⚡ Preparing attack vectors and payloads..."
    ]
    
    simulation_state["logs"] = initial_logs
    
    def run_enhanced_simulation():
        phases = [
            ("Initial Access", ["🎣 Deploying spearphishing campaign...", "📧 Crafting targeted emails...", "🔓 Attempting credential harvesting..."]),
            ("Execution", ["💻 Executing PowerShell payloads...", "🔄 Running command interpreters...", "📜 Deploying malicious scripts..."]),
            ("Persistence", ["🔐 Establishing registry persistence...", "⏰ Creating scheduled tasks...", "🎭 Modifying startup folders..."]),
            ("Defense Evasion", ["🥷 Injecting into legitimate processes...", "🗑️ Cleaning up artifacts...", "🎪 Obfuscating command lines..."]),
            ("Discovery", ["🔍 Enumerating system information...", "👥 Discovering user accounts...", "🌐 Mapping network topology..."]),
            ("Collection", ["📂 Accessing sensitive files...", "📋 Capturing clipboard data...", "🎥 Recording screen activity..."]),
            ("Exfiltration", ["📤 Preparing data for extraction...", "🔐 Encrypting stolen data...", "🌐 Establishing exfil channels..."])
        ]
        
        for i, (phase, activities) in enumerate(phases):
            simulation_state["current_phase"] = phase
            simulation_state["progress"] = (i / len(phases)) * 90  # Leave 10% for completion
            
            simulation_state["logs"].append(f"\n🎯 Phase {i+1}/7: {phase.upper()}")
            simulation_state["logs"].append("─" * 30)
            
            for activity in activities:
                time.sleep(0.8)  # Realistic timing
                simulation_state["logs"].append(activity)
                simulation_state["techniques_executed"] += 1
                
                # Simulate detections
                if "executing" in activity.lower() or "deploying" in activity.lower():
                    simulation_state["detections_triggered"] += 1
                    simulation_state["logs"].append("  ✅ Detection triggered!")
                elif "obfuscating" in activity.lower() or "cleaning" in activity.lower():
                    simulation_state["logs"].append("  ⚠️ Evasion attempt detected!")
        
        # Completion phase
        simulation_state["current_phase"] = "Completing"
        simulation_state["progress"] = 95
        time.sleep(1)
        
        completion_logs = [
            "\n🏁 SIMULATION COMPLETED",
            "═" * 50,
            f"📊 Techniques executed: {simulation_state['techniques_executed']}",
            f"🚨 Detections triggered: {simulation_state['detections_triggered']}",
            f"📈 Detection rate: {(simulation_state['detections_triggered']/simulation_state['techniques_executed']*100):.1f}%",
            f"⏱️ Total runtime: {(datetime.now() - simulation_state['start_time']).total_seconds():.1f} seconds",
            "✅ Telemetry data generated and ready for analysis"
        ]
        
        simulation_state["logs"].extend(completion_logs)
        simulation_state["progress"] = 100
        simulation_state["current_phase"] = "Complete"
        simulation_state["running"] = False
    
    # Run simulation in background
    threading.Thread(target=run_enhanced_simulation, daemon=True).start()
    
    return (
        f"🔄 Launching {apt_name} simulation...",
        "\n".join(simulation_state["logs"]),
        simulation_state["progress"],
        simulation_state["current_phase"]
    )

def get_simulation_status() -> Tuple[str, str, float, str]:
    """Get enhanced simulation status."""
    if simulation_state["running"]:
        status = f"🔄 {simulation_state['current_phase']}: {simulation_state['current_apt']}"
    elif simulation_state["current_apt"]:
        status = f"✅ Completed: {simulation_state['current_apt']}"
    else:
        status = "⏹️ No simulation running"
    
    logs = "\n".join(simulation_state["logs"]) if simulation_state["logs"] else "Ready for simulation..."
    
    return status, logs, simulation_state["progress"], simulation_state["current_phase"]

def get_enhanced_detection_results(apt_name: Optional[str] = None) -> Tuple[pd.DataFrame, str, go.Figure]:
    """Get enhanced detection results with visualizations."""
    if apt_name and apt_name != "All APT Groups" and apt_name in ENHANCED_DETECTION_RESULTS:
        data = ENHANCED_DETECTION_RESULTS[apt_name]
        selected_apt = apt_name
    elif simulation_state["current_apt"] and simulation_state["current_apt"] in ENHANCED_DETECTION_RESULTS:
        data = ENHANCED_DETECTION_RESULTS[simulation_state["current_apt"]]
        selected_apt = simulation_state["current_apt"]
    else:
        data = []
        for apt_results in ENHANCED_DETECTION_RESULTS.values():
            data.extend(apt_results)
        selected_apt = None
    
    df = pd.DataFrame(data)
    
    if not df.empty:
        total = len(df)
        full_coverage = len(df[df['Coverage'] == 'Full'])
        partial_coverage = len(df[df['Coverage'] == 'Partial'])
        no_coverage = len(df[df['Coverage'] == 'None'])
        
        # Calculate average confidence
        confidence_values = df['Confidence'].str.rstrip('%').astype(float)
        avg_confidence = confidence_values.mean()
        
        summary = f"""
🎯 **Detection Analysis Summary**

📊 **Coverage Statistics:**
• Full Coverage: **{full_coverage}/{total}** ({full_coverage/total*100:.1f}%)
• Partial Coverage: **{partial_coverage}/{total}** ({partial_coverage/total*100:.1f}%)
• No Coverage: **{no_coverage}/{total}** ({no_coverage/total*100:.1f}%)

🔍 **Performance Metrics:**
• Average Confidence: **{avg_confidence:.1f}%**
• Critical Techniques: **{len(df[df['Severity'] == 'Critical'])}**
• High Priority: **{len(df[df['Severity'] == 'High'])}**

⚡ **Quick Insights:**
• Strongest tactic: **{df.groupby('Tactic').size().idxmax()}**
• Most recent activity: **{df['Last_Seen'].max()}**
• Coverage score: **{(full_coverage + partial_coverage*0.5)/total*100:.1f}/100**
        """
    else:
        summary = "No detection results available. Run a simulation first."
    
    # Create visualization
    chart = create_coverage_donut_chart(selected_apt)
    
    return df, summary, chart

def list_reports() -> List[str]:
    """Mock function to list available reports."""
    return MOCK_REPORTS

def load_report(report_name: str) -> str:
    """Load and return report content."""
    if not report_name:
        return "Please select a report to view."
    
    if report_name.endswith('.pdf'):
        return f"📄 **{report_name}**\n\n*PDF reports would be rendered here in a production environment.*\n\nThis is a placeholder for PDF content. In the actual implementation, this would integrate with a PDF viewer or convert PDF content to viewable format."
    
    # Try to load actual report files
    report_path = f"reports/{report_name}"
    if os.path.exists(report_path):
        try:
            with open(report_path, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            return f"Error loading report: {e}"
    
    # Mock markdown content if file doesn't exist
    mock_content = f"""# {report_name.replace('_', ' ').replace('.md', '')}

## Executive Summary
This report provides a comprehensive analysis of the detection engineering activities and APT simulation results.

## Key Findings
- **Detection Coverage**: 78% of MITRE ATT&CK techniques covered
- **False Positive Rate**: 2.3%
- **Mean Time to Detection**: 4.2 minutes
- **Critical Gaps Identified**: 3 high-priority techniques require additional coverage

## MITRE ATT&CK Technique Analysis

### Covered Techniques
- T1055 (Process Injection) - **Full Coverage** ✅
- T1078 (Valid Accounts) - **Partial Coverage** ⚠️
- T1083 (File and Directory Discovery) - **Full Coverage** ✅

### Coverage Gaps
- T1090 (Connection Proxy) - **No Coverage** ❌
- T1560 (Archive Collected Data) - **No Coverage** ❌

## Recommendations
1. Implement detection rules for connection proxy activities
2. Enhance monitoring for data archiving behaviors
3. Tune existing rules to reduce false positives
4. Schedule regular validation testing

## Metrics Dashboard
```
Total Simulations Run: 15
Successful Detections: 127
False Positives: 8
Coverage Improvement: +12% (last 30 days)
```

---
*Report generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*
"""
    return mock_content

def generate_mitre_heatmap() -> str:
    """Mock function to generate MITRE ATT&CK heatmap JSON."""
    heatmap_data = {
        "name": "Detection Lab Heatmap",
        "versions": {
            "attack": "13.1",
            "navigator": "4.9.1"
        },
        "domain": "enterprise-attack",
        "description": "Detection coverage heatmap for APT simulations",
        "techniques": [
            {"techniqueID": "T1055", "score": 95, "color": "#00ff00"},
            {"techniqueID": "T1078", "score": 78, "color": "#ffff00"},
            {"techniqueID": "T1083", "score": 92, "color": "#00ff00"},
            {"techniqueID": "T1090", "score": 0, "color": "#ff0000"},
            {"techniqueID": "T1105", "score": 65, "color": "#ffff00"},
        ]
    }
    return json.dumps(heatmap_data, indent=2)

# =============================================================================
# ENHANCED UI COMPONENTS
# =============================================================================

def create_enhanced_simulation_tab():
    """Create the enhanced APT Simulation tab."""
    with gr.Tab("🎯 APT Simulation", id="simulation"):
        # Header with gradient
        gr.HTML("""
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 15px; margin-bottom: 20px; text-align: center;">
            <h2 style="color: white; margin: 0; font-size: 28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                🎯 Advanced Persistent Threat Simulation
            </h2>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">
                Launch realistic APT attacks mapped to MITRE ATT&CK framework
            </p>
        </div>
        """)
        
        with gr.Row():
            with gr.Column(scale=1):
                # APT Selection Card
                with gr.Group():
                    gr.HTML("<h3 style='margin-top: 0; color: #3b82f6;'>🔥 Select Threat Actor</h3>")
                    
                    apt_dropdown = gr.Dropdown(
                        choices=APT_GROUPS,
                        label="APT Group",
                        value=APT_GROUPS[0],
                        info="Choose an Advanced Persistent Threat group",
                        container=True
                    )
                    
                    # APT Info Display
                    def show_apt_info(apt_name):
                        if apt_name in APT_GROUPS_ENHANCED:
                            info = APT_GROUPS_ENHANCED[apt_name]
                            return f"""
                            <div style="background: linear-gradient(135deg, #1e293b, #334155); padding: 15px; border-radius: 10px; border-left: 4px solid {info['color']};">
                                <h4 style="margin: 0 0 10px 0; color: {info['color']};">{apt_name}</h4>
                                <p style="margin: 5px 0; color: #cbd5e1;"><strong>🌍 Origin:</strong> {info['country']}</p>
                                <p style="margin: 5px 0; color: #cbd5e1;"><strong>⚡ Level:</strong> {info['sophistication']}</p>
                                <p style="margin: 5px 0; color: #cbd5e1;"><strong>🎯 Targets:</strong> {info['targets']}</p>
                            </div>
                            """
                        return ""
                    
                    # Initialize with default APT group info
                    default_apt = APT_GROUPS[0]
                    apt_info_display = gr.HTML(value=show_apt_info(default_apt))
                    
                    # Control buttons
                    gr.HTML("<h3 style='color: #3b82f6;'>🚀 Simulation Controls</h3>")
                    launch_btn = gr.Button("🚀 Launch Simulation", variant="primary", size="lg")
                    refresh_btn = gr.Button("🔄 Refresh Status", variant="secondary")
                    
            with gr.Column(scale=2):
                # Status Dashboard
                with gr.Group():
                    gr.HTML("<h3 style='margin-top: 0; color: #3b82f6;'>📊 Simulation Dashboard</h3>")
                    
                    status_display = gr.Textbox(
                        label="🔍 Current Status",
                        value="⏹️ Ready for simulation",
                        interactive=False,
                        lines=2
                    )
                    
                    # Progress bar
                    progress_bar = gr.Slider(
                        label="⚡ Progress",
                        minimum=0,
                        maximum=100,
                        value=0,
                        interactive=False,
                        show_label=True
                    )
                    
                    phase_display = gr.Textbox(
                        label="🎯 Current Phase",
                        value="Idle",
                        interactive=False,
                        lines=1
                    )
                    
                    logs_display = gr.Code(
                        label="📋 Live Simulation Logs",
                        value="Ready for simulation...",
                        language="shell",
                        lines=12,
                        interactive=False
                    )
        
        # Event handlers
        apt_dropdown.change(show_apt_info, [apt_dropdown], [apt_info_display])
        
        launch_btn.click(
            fn=simulate_attack,
            inputs=[apt_dropdown],
            outputs=[status_display, logs_display, progress_bar, phase_display]
        )
        
        refresh_btn.click(
            fn=get_simulation_status,
            outputs=[status_display, logs_display, progress_bar, phase_display]
        )
        
        # Auto-refresh
        gr.Timer(2).tick(
            fn=get_simulation_status,
            outputs=[status_display, logs_display, progress_bar, phase_display]
        )

def create_enhanced_detection_tab():
    """Create the enhanced Detection Results tab."""
    with gr.Tab("🔍 Detection Analysis", id="detection"):
        # Header
        gr.HTML("""
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; border-radius: 15px; margin-bottom: 20px; text-align: center;">
            <h2 style="color: white; margin: 0; font-size: 28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                🔍 Detection Coverage Analysis
            </h2>
            <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">
                Comprehensive MITRE ATT&CK technique coverage and performance metrics
            </p>
        </div>
        """)
        
        with gr.Row():
            with gr.Column(scale=1):
                with gr.Group():
                    gr.HTML("<h3 style='margin-top: 0; color: #10b981;'>🎛️ Analysis Controls</h3>")
                    
                    apt_filter = gr.Dropdown(
                        choices=["All APT Groups"] + APT_GROUPS,
                        label="🔎 Filter by APT Group",
                        value="All APT Groups",
                        info="Analyze specific threat actor or view aggregate data"
                    )
                    
                    fetch_btn = gr.Button("📊 Analyze Detection Results", variant="primary", size="lg")
                    export_btn = gr.Button("💾 Export Analysis", variant="secondary")
                    
                    # Performance metrics
                    gr.HTML("<h3 style='color: #10b981;'>⚡ Key Metrics</h3>")
                    metrics_display = gr.HTML("""
                    <div style="background: #0f172a; padding: 15px; border-radius: 10px; border: 1px solid #1e293b;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; text-align: center;">
                            <div style="padding: 10px; background: #1e293b; border-radius: 8px;">
                                <div style="color: #10b981; font-size: 24px; font-weight: bold;">73.2%</div>
                                <div style="color: #94a3b8; font-size: 12px;">Detection Rate</div>
                            </div>
                            <div style="padding: 10px; background: #1e293b; border-radius: 8px;">
                                <div style="color: #3b82f6; font-size: 24px; font-weight: bold;">2.1%</div>
                                <div style="color: #94a3b8; font-size: 12px;">False Positive</div>
                            </div>
                            <div style="padding: 10px; background: #1e293b; border-radius: 8px;">
                                <div style="color: #f59e0b; font-size: 24px; font-weight: bold;">3.8min</div>
                                <div style="color: #94a3b8; font-size: 12px;">Mean TTD</div>
                            </div>
                            <div style="padding: 10px; background: #1e293b; border-radius: 8px;">
                                <div style="color: #ef4444; font-size: 24px; font-weight: bold;">87</div>
                                <div style="color: #94a3b8; font-size: 12px;">Techniques</div>
                            </div>
                        </div>
                    </div>
                    """)
                    
            with gr.Column(scale=2):
                with gr.Group():
                    gr.HTML("<h3 style='margin-top: 0; color: #10b981;'>📈 Coverage Visualization</h3>")
                    coverage_chart = gr.Plot(label="Detection Coverage", show_label=False)
                
                with gr.Tabs():
                    with gr.Tab("📋 Detailed Results"):
                        results_table = gr.Dataframe(
                            headers=["Technique", "Name", "Tactic", "Coverage", "Confidence", "Last Seen", "Severity"],
                            interactive=False,
                            wrap=True
                        )
                    
                    with gr.Tab("📊 Summary Report"):
                        coverage_summary = gr.Markdown(
                            value="Click 'Analyze Detection Results' to view comprehensive coverage analysis",
                            height=400
                        )
        
        # Event handlers
        fetch_btn.click(
            fn=get_enhanced_detection_results,
            inputs=[apt_filter],
            outputs=[results_table, coverage_summary, coverage_chart]
        )

def create_enhanced_reports_tab():
    """Create the enhanced Reports tab."""
    with gr.Tab("📋 Intelligence Reports", id="reports"):
        # Header
        gr.HTML("""
        <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 20px; border-radius: 15px; margin-bottom: 20px; text-align: center;">
            <h2 style="color: white; margin: 0; font-size: 28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                📋 Threat Intelligence & Analysis Reports
            </h2>
            <p style="color: #e9d5ff; margin: 10px 0 0 0; font-size: 16px;">
                Comprehensive analysis reports, threat briefings, and detection summaries
            </p>
        </div>
        """)
        
        with gr.Row():
            with gr.Column(scale=1):
                with gr.Group():
                    gr.HTML("<h3 style='margin-top: 0; color: #8b5cf6;'>📚 Report Library</h3>")
                    
                    report_dropdown = gr.Dropdown(
                        choices=list_reports(),
                        label="📄 Select Report",
                        info="Choose from available analysis reports"
                    )
                    
                    load_btn = gr.Button("📖 Load Report", variant="primary", size="lg")
                    download_btn = gr.Button("⬇️ Download Report", variant="secondary")
                    
                    # Report categories
                    gr.HTML("""
                    <h3 style='color: #8b5cf6;'>📁 Report Categories</h3>
                    <div style="background: #0f172a; padding: 15px; border-radius: 10px; border: 1px solid #1e293b;">
                        <div style="margin-bottom: 10px;">
                            <span style="color: #3b82f6;">🎯</span>
                            <strong style="color: #e2e8f0;">APT Analysis:</strong>
                            <span style="color: #94a3b8; font-size: 14px;">Detailed threat actor profiles</span>
                        </div>
                        <div style="margin-bottom: 10px;">
                            <span style="color: #10b981;">📊</span>
                            <strong style="color: #e2e8f0;">Coverage Reports:</strong>
                            <span style="color: #94a3b8; font-size: 14px;">Detection gap analysis</span>
                        </div>
                        <div style="margin-bottom: 10px;">
                            <span style="color: #f59e0b;">🗺️</span>
                            <strong style="color: #e2e8f0;">MITRE Heatmaps:</strong>
                            <span style="color: #94a3b8; font-size: 14px;">Technique coverage mapping</span>
                        </div>
                        <div style="margin-bottom: 0;">
                            <span style="color: #ef4444;">🔍</span>
                            <strong style="color: #e2e8f0;">Intelligence Briefs:</strong>
                            <span style="color: #94a3b8; font-size: 14px;">Threat landscape updates</span>
                        </div>
                    </div>
                    """)
                    
            with gr.Column(scale=2):
                with gr.Group():
                    gr.HTML("<h3 style='margin-top: 0; color: #8b5cf6;'>📖 Report Viewer</h3>")
                    report_viewer = gr.Markdown(
                        value="""
## 📋 Welcome to the Report Center

Select a report from the dropdown menu and click **'Load Report'** to view detailed analysis.

### 🔥 Recent Reports:
- **APT29 Analysis** - Comprehensive Cozy Bear campaign analysis
- **Detection Coverage Summary** - Q2 2024 performance overview  
- **MITRE Heatmap** - Visual technique coverage mapping

### 📈 Quick Stats:
- **Total Reports**: 15+ available
- **Last Updated**: Today
- **Coverage**: 87 MITRE techniques analyzed
                        """,
                        height=600
                    )
        
        load_btn.click(
            fn=load_report,
            inputs=[report_dropdown],
            outputs=[report_viewer]
        )

def create_enhanced_mitre_tab():
    """Create the enhanced MITRE ATT&CK tab."""
    with gr.Tab("🗺️ MITRE ATT&CK Intelligence", id="mitre"):
        # Header
        gr.HTML("""
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 20px; border-radius: 15px; margin-bottom: 20px; text-align: center;">
            <h2 style="color: white; margin: 0; font-size: 28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                🗺️ MITRE ATT&CK Coverage & Intelligence
            </h2>
            <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">
                Advanced visualizations and Navigator-compatible exports
            </p>
        </div>
        """)
        
        with gr.Tabs():
            with gr.Tab("🎨 Coverage Heatmap"):
                with gr.Row():
                    with gr.Column(scale=1):
                        with gr.Group():
                            gr.HTML("<h3 style='margin-top: 0; color: #f59e0b;'>🎛️ Visualization Controls</h3>")
                            generate_btn = gr.Button("🎨 Generate Heatmap", variant="primary", size="lg")
                            download_json_btn = gr.Button("📥 Export Navigator JSON", variant="secondary")
                            
                            # Legend
                            gr.HTML("""
                            <h3 style='color: #f59e0b;'>🎯 Coverage Legend</h3>
                            <div style="background: #0f172a; padding: 15px; border-radius: 10px; border: 1px solid #1e293b;">
                                <div style="margin: 8px 0; display: flex; align-items: center;">
                                    <div style="width: 20px; height: 20px; background: #10b981; border-radius: 50%; margin-right: 10px;"></div>
                                    <span style="color: #e2e8f0;"><strong>Full Coverage</strong> (90-100%)</span>
                                </div>
                                <div style="margin: 8px 0; display: flex; align-items: center;">
                                    <div style="width: 20px; height: 20px; background: #f59e0b; border-radius: 50%; margin-right: 10px;"></div>
                                    <span style="color: #e2e8f0;"><strong>Partial Coverage</strong> (50-89%)</span>
                                </div>
                                <div style="margin: 8px 0; display: flex; align-items: center;">
                                    <div style="width: 20px; height: 20px; background: #f97316; border-radius: 50%; margin-right: 10px;"></div>
                                    <span style="color: #e2e8f0;"><strong>Limited Coverage</strong> (1-49%)</span>
                                </div>
                                <div style="margin: 8px 0; display: flex; align-items: center;">
                                    <div style="width: 20px; height: 20px; background: #ef4444; border-radius: 50%; margin-right: 10px;"></div>
                                    <span style="color: #e2e8f0;"><strong>No Coverage</strong> (0%)</span>
                                </div>
                            </div>
                            """)
                    
                    with gr.Column(scale=2):
                        heatmap_chart = gr.Plot(label="MITRE ATT&CK Coverage Heatmap", show_label=False)
                        
                        json_output = gr.Code(
                            language="json",
                            label="📋 Navigator JSON Export",
                            lines=8,
                            interactive=False
                        )
            
            with gr.Tab("📊 APT Comparison"):
                comparison_chart = gr.Plot(label="APT Group Comparison", show_label=False, value=create_apt_comparison_chart())
            
            with gr.Tab("📈 Performance Timeline"):
                timeline_chart = gr.Plot(label="Detection Timeline", show_label=False, value=create_timeline_chart())
        
        # Event handlers
        generate_btn.click(
            fn=lambda: (create_technique_heatmap(), generate_mitre_heatmap()),
            outputs=[heatmap_chart, json_output]
        )
        


def create_enhanced_main_interface():
    """Create the enhanced main Gradio interface."""
    
    # Ultra-modern CSS styling
    css = """
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    * {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
    }
    
    .gradio-container {
        background: linear-gradient(135deg, #0c0a09 0%, #1c1917 50%, #0c0a09 100%) !important;
        color: #f8fafc !important;
        min-height: 100vh;
    }
    
    .main {
        background: transparent !important;
        max-width: 1400px !important;
        margin: 0 auto !important;
        padding: 20px !important;
    }
    
    .tab-nav {
        background: rgba(15, 23, 42, 0.8) !important;
        backdrop-filter: blur(10px) !important;
        border-radius: 15px !important;
        padding: 8px !important;
        border: 1px solid rgba(51, 65, 85, 0.3) !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
    }
    
    .tab-nav button {
        background: transparent !important;
        border: none !important;
        color: #94a3b8 !important;
        padding: 12px 24px !important;
        border-radius: 10px !important;
        transition: all 0.3s ease !important;
        font-weight: 500 !important;
        margin: 0 4px !important;
    }
    
    .tab-nav button:hover {
        background: rgba(59, 130, 246, 0.1) !important;
        color: #3b82f6 !important;
        transform: translateY(-2px) !important;
    }
    
    .tab-nav button.selected {
        background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
        color: white !important;
        box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4) !important;
        transform: translateY(-2px) !important;
    }
    
    .gr-button {
        border-radius: 12px !important;
        font-weight: 600 !important;
        padding: 12px 24px !important;
        transition: all 0.3s ease !important;
        border: none !important;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
    }
    
    .gr-button:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3) !important;
    }
    
    .gr-button-primary {
        background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
        color: white !important;
    }
    
    .gr-button-primary:hover {
        background: linear-gradient(135deg, #2563eb, #1e40af) !important;
        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4) !important;
    }
    
    .gr-button-secondary {
        background: linear-gradient(135deg, #64748b, #475569) !important;
        color: white !important;
    }
    
    .gr-textbox, .gr-dropdown, .gr-slider {
        background: rgba(30, 41, 59, 0.8) !important;
        backdrop-filter: blur(10px) !important;
        border: 1px solid rgba(51, 65, 85, 0.5) !important;
        border-radius: 12px !important;
        color: #e2e8f0 !important;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
    }
    
    .gr-textbox:focus, .gr-dropdown:focus {
        border-color: #3b82f6 !important;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
    }
    
    .gr-group {
        background: rgba(15, 23, 42, 0.6) !important;
        backdrop-filter: blur(10px) !important;
        border: 1px solid rgba(51, 65, 85, 0.3) !important;
        border-radius: 15px !important;
        padding: 20px !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
    }
    
    .gr-dataframe {
        background: rgba(15, 23, 42, 0.8) !important;
        border-radius: 12px !important;
        border: 1px solid rgba(51, 65, 85, 0.3) !important;
    }
    
    .gr-dataframe table {
        background: transparent !important;
        color: #e2e8f0 !important;
    }
    
    .gr-dataframe th {
        background: rgba(59, 130, 246, 0.1) !important;
        color: #3b82f6 !important;
        font-weight: 600 !important;
        padding: 12px !important;
    }
    
    .gr-dataframe td {
        padding: 10px 12px !important;
        border-bottom: 1px solid rgba(51, 65, 85, 0.3) !important;
    }
    
    .gr-code {
        background: rgba(15, 23, 42, 0.9) !important;
        border: 1px solid rgba(51, 65, 85, 0.3) !important;
        border-radius: 12px !important;
        font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
    }
    
    .gr-plot {
        background: rgba(15, 23, 42, 0.6) !important;
        border-radius: 15px !important;
        border: 1px solid rgba(51, 65, 85, 0.3) !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
    }
    
    .gr-slider .gr-slider-track {
        background: rgba(51, 65, 85, 0.5) !important;
    }
    
    .gr-slider .gr-slider-thumb {
        background: #3b82f6 !important;
        border: 2px solid #1d4ed8 !important;
    }
    
    .gr-slider .gr-slider-fill {
        background: linear-gradient(to right, #3b82f6, #1d4ed8) !important;
    }
    
    .gr-markdown h1, .gr-markdown h2, .gr-markdown h3 {
        color: #f1f5f9 !important;
    }
    
    .gr-markdown p {
        color: #cbd5e1 !important;
        line-height: 1.6 !important;
    }
    
    .gr-markdown code {
        background: rgba(30, 41, 59, 0.8) !important;
        color: #22d3ee !important;
        padding: 2px 6px !important;
        border-radius: 6px !important;
    }
    
    .gr-markdown pre {
        background: rgba(15, 23, 42, 0.9) !important;
        border: 1px solid rgba(51, 65, 85, 0.3) !important;
        border-radius: 12px !important;
        padding: 16px !important;
    }
    
    /* Scrollbar styling */
    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    
    ::-webkit-scrollbar-track {
        background: rgba(30, 41, 59, 0.3);
        border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb {
        background: rgba(59, 130, 246, 0.5);
        border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: rgba(59, 130, 246, 0.7);
    }
    
    /* Animation keyframes */
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
    
    .pulsing {
        animation: pulse 2s infinite;
    }
    
    /* Glass morphism effects */
    .glass {
        background: rgba(255, 255, 255, 0.02) !important;
        backdrop-filter: blur(20px) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
    }
    """
    
    with gr.Blocks(
        css=css, 
        theme=gr.themes.Base(
            primary_hue="blue",
            secondary_hue="gray",
            neutral_hue="slate",
            font=gr.themes.GoogleFont("Inter")
        ),
        title="🛡️ AI Detection Engineering Lab - Premium"
    ) as app:
        
        # Stunning header with animated gradient
        gr.HTML("""
        <div style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
            background-size: 400% 400%;
            animation: gradientShift 15s ease infinite;
            padding: 40px 20px;
            border-radius: 20px;
            margin-bottom: 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        ">
            <div style="position: relative; z-index: 2;">
                <h1 style="
                    color: white;
                    margin: 0;
                    font-size: 3.5em;
                    font-weight: 700;
                    text-shadow: 2px 2px 8px rgba(0,0,0,0.5);
                    letter-spacing: -1px;
                ">
                    🛡️ AI Detection Engineering Lab
                </h1>
                <p style="
                    color: rgba(255, 255, 255, 0.9);
                    margin: 15px 0 0 0;
                    font-size: 1.4em;
                    font-weight: 500;
                    text-shadow: 1px 1px 4px rgba(0,0,0,0.3);
                ">
                    Advanced Persistent Threat Simulation & Detection Analysis Platform
                </p>
                <div style="
                    margin-top: 20px;
                    display: flex;
                    justify-content: center;
                    gap: 30px;
                    flex-wrap: wrap;
                ">
                    <div style="text-align: center;">
                        <div style="font-size: 2em; font-weight: bold;">10+</div>
                        <div style="font-size: 0.9em; opacity: 0.9;">APT Groups</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 2em; font-weight: bold;">87</div>
                        <div style="font-size: 0.9em; opacity: 0.9;">MITRE Techniques</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 2em; font-weight: bold;">73.2%</div>
                        <div style="font-size: 0.9em; opacity: 0.9;">Detection Rate</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 2em; font-weight: bold;">Real-time</div>
                        <div style="font-size: 0.9em; opacity: 0.9;">Analysis</div>
                    </div>
                </div>
            </div>
            <div style="
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                animation: rotate 20s linear infinite;
                pointer-events: none;
            "></div>
        </div>
        
        <style>
        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        </style>
        """)
        
        # Main tabbed interface with enhanced styling
        with gr.Tabs():
            create_enhanced_simulation_tab()
            create_enhanced_detection_tab()
            create_enhanced_reports_tab()
            create_enhanced_mitre_tab()
        
        # Premium footer
        gr.HTML("""
        <div style="
            background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.8));
            backdrop-filter: blur(20px);
            padding: 30px;
            margin-top: 40px;
            border-radius: 20px;
            border: 1px solid rgba(51, 65, 85, 0.3);
            text-align: center;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        ">
            <div style="display: flex; justify-content: center; align-items: center; gap: 40px; flex-wrap: wrap; margin-bottom: 20px;">
                <div style="text-align: center;">
                    <div style="color: #3b82f6; font-size: 1.5em; margin-bottom: 5px;">🔬</div>
                    <div style="color: #cbd5e1; font-size: 0.9em;">Advanced Analytics</div>
                </div>
                <div style="text-align: center;">
                    <div style="color: #10b981; font-size: 1.5em; margin-bottom: 5px;">⚡</div>
                    <div style="color: #cbd5e1; font-size: 0.9em;">Real-time Detection</div>
                </div>
                <div style="text-align: center;">
                    <div style="color: #f59e0b; font-size: 1.5em; margin-bottom: 5px;">🛡️</div>
                    <div style="color: #cbd5e1; font-size: 0.9em;">Enterprise Security</div>
                </div>
                <div style="text-align: center;">
                    <div style="color: #8b5cf6; font-size: 1.5em; margin-bottom: 5px;">🎯</div>
                    <div style="color: #cbd5e1; font-size: 0.9em;">APT Simulation</div>
                </div>
            </div>
            <p style="color: #64748b; margin: 0; font-size: 14px;">
                🔬 AI-Driven Detection Engineering Lab Platform | Built with Gradio & ❤️ | Ready for Production
            </p>
        </div>
        """)
    
    return app

# =============================================================================
# MAIN APPLICATION
# =============================================================================

if __name__ == "__main__":
    # Create the enhanced interface
    app = create_enhanced_main_interface()
    
    print("🚀 Starting AI Detection Engineering Lab Platform...")
    print("🌐 Access the platform at: http://localhost:7860")
    print("📚 Premium features available:")
    print("   • 🎯 Enhanced APT Group Simulation with Progress Tracking")
    print("   • 🔍 Advanced Detection Analysis with Interactive Charts") 
    print("   • 📋 Professional Report Viewer with Rich Formatting")
    print("   • 🗺️ MITRE ATT&CK Heatmaps with Navigator Export")
    print("   • 🎨 Modern Glass-morphism UI with Stunning Visuals")
    print("   • ⚡ Real-time Updates and Performance Metrics")
    print("\n✨ Premium platform ready for cybersecurity teams!")
    
    # Launch the application
    app.launch(
        server_name="0.0.0.0",
        server_port=7860,
        share=False,
        show_error=True,
        quiet=False,
        favicon_path=None
    ) 