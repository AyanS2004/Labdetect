#!/usr/bin/env python3
"""
AI-Driven Detection Engineering Lab Platform - Gradio Frontend
A comprehensive cybersecurity detection lab interface for APT simulation and analysis.
"""

import gradio as gr
import pandas as pd
import json
import time
import os
from datetime import datetime
from typing import Dict, List, Tuple, Optional
import threading

# =============================================================================
# MOCK DATA AND CONFIGURATION
# =============================================================================

# APT Groups available for simulation
APT_GROUPS = [
    "APT29 (Cozy Bear)",
    "APT28 (Fancy Bear)", 
    "APT33 (Elfin)",
    "APT34 (OilRig)",
    "APT38 (Lazarus)",
    "APT39 (Chafer)",
    "APT40 (Leviathan)",
    "APT41 (Double Dragon)",
    "Carbanak",
    "FIN7"
]

# Mock detection results data
MOCK_DETECTION_RESULTS = {
    "APT29 (Cozy Bear)": [
        {"Technique": "T1055", "Name": "Process Injection", "Coverage": "Full", "Confidence": "95%"},
        {"Technique": "T1078", "Name": "Valid Accounts", "Coverage": "Partial", "Confidence": "78%"},
        {"Technique": "T1083", "Name": "File and Directory Discovery", "Coverage": "Full", "Confidence": "92%"},
        {"Technique": "T1090", "Name": "Connection Proxy", "Coverage": "None", "Confidence": "0%"},
        {"Technique": "T1105", "Name": "Ingress Tool Transfer", "Coverage": "Partial", "Confidence": "65%"},
    ],
    "APT33 (Elfin)": [
        {"Technique": "T1059", "Name": "Command and Scripting Interpreter", "Coverage": "Full", "Confidence": "98%"},
        {"Technique": "T1087", "Name": "Account Discovery", "Coverage": "Full", "Confidence": "89%"},
        {"Technique": "T1135", "Name": "Network Share Discovery", "Coverage": "Partial", "Confidence": "67%"},
        {"Technique": "T1560", "Name": "Archive Collected Data", "Coverage": "None", "Confidence": "0%"},
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

# Global state for simulation status
simulation_state = {
    "running": False,
    "current_apt": None,
    "start_time": None,
    "logs": []
}

# =============================================================================
# BACKEND MOCK FUNCTIONS
# =============================================================================

def simulate_attack(apt_name: str) -> Tuple[str, str]:
    """
    Mock function to simulate an APT attack scenario.
    
    Args:
        apt_name: Name of the APT group to simulate
        
    Returns:
        Tuple of (status_message, logs)
    """
    global simulation_state
    
    if simulation_state["running"]:
        return "⚠️ Simulation already running!", "\n".join(simulation_state["logs"])
    
    # Start simulation
    simulation_state["running"] = True
    simulation_state["current_apt"] = apt_name
    simulation_state["start_time"] = datetime.now()
    simulation_state["logs"] = [
        f"🚀 Starting {apt_name} simulation at {simulation_state['start_time'].strftime('%H:%M:%S')}",
        "📊 Initializing attack simulation environment...",
        "🔧 Loading MITRE ATT&CK techniques for " + apt_name,
        "⚡ Launching simulated attack vectors...",
    ]
    
    # Simulate running state
    def run_simulation():
        time.sleep(2)  # Simulate processing time
        simulation_state["logs"].extend([
            "🎯 Executing initial access techniques...",
            "💾 Deploying persistence mechanisms...",
            "🔍 Running discovery and reconnaissance...",
            "📡 Simulating command and control communications...",
            "✅ Simulation completed successfully!",
            f"📈 Generated telemetry data for analysis",
            f"⏱️ Total runtime: {(datetime.now() - simulation_state['start_time']).total_seconds():.1f} seconds"
        ])
        simulation_state["running"] = False
    
    # Run simulation in background
    threading.Thread(target=run_simulation, daemon=True).start()
    
    return "🔄 Running simulation...", "\n".join(simulation_state["logs"])

def get_simulation_status() -> Tuple[str, str]:
    """Get current simulation status and logs."""
    if simulation_state["running"]:
        status = f"🔄 Running {simulation_state['current_apt']} simulation..."
    elif simulation_state["current_apt"]:
        status = f"✅ Last simulation: {simulation_state['current_apt']} - Completed"
    else:
        status = "⏹️ No simulation running"
    
    logs = "\n".join(simulation_state["logs"]) if simulation_state["logs"] else "No logs available"
    return status, logs

def get_detection_results(apt_name: Optional[str] = None) -> pd.DataFrame:
    """
    Mock function to fetch detection results from backend.
    
    Args:
        apt_name: Optional APT name to filter results
        
    Returns:
        DataFrame with detection results
    """
    if apt_name and apt_name in MOCK_DETECTION_RESULTS:
        data = MOCK_DETECTION_RESULTS[apt_name]
    elif simulation_state["current_apt"] and simulation_state["current_apt"] in MOCK_DETECTION_RESULTS:
        data = MOCK_DETECTION_RESULTS[simulation_state["current_apt"]]
    else:
        # Return combined results if no specific APT selected
        data = []
        for apt_results in MOCK_DETECTION_RESULTS.values():
            data.extend(apt_results)
    
    return pd.DataFrame(data)

def list_reports() -> List[str]:
    """Mock function to list available reports."""
    return MOCK_REPORTS

def load_report(report_name: str) -> str:
    """
    Mock function to load and return report content.
    
    Args:
        report_name: Name of the report file
        
    Returns:
        Report content as string
    """
    if not report_name:
        return "Please select a report to view."
    
    if report_name.endswith('.pdf'):
        return f"📄 **{report_name}**\n\n*PDF reports would be rendered here in a production environment.*\n\nThis is a placeholder for PDF content. In the actual implementation, this would integrate with a PDF viewer or convert PDF content to viewable format."
    
    # Mock markdown content
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
# GRADIO UI COMPONENTS
# =============================================================================

def create_simulation_tab():
    """Create the APT Simulation tab interface."""
    with gr.Tab("🎯 APT Simulation", id="simulation"):
        gr.Markdown("## APT Group Simulation Launcher")
        gr.Markdown("Select an APT group and launch a realistic attack simulation mapped to MITRE ATT&CK framework.")
        
        with gr.Row():
            with gr.Column(scale=2):
                apt_dropdown = gr.Dropdown(
                    choices=APT_GROUPS,
                    label="Select APT Group",
                    value=APT_GROUPS[0],
                    info="Choose an Advanced Persistent Threat group to simulate"
                )
                
                launch_btn = gr.Button("🚀 Launch Simulation", variant="primary", size="lg")
                refresh_btn = gr.Button("🔄 Refresh Status", variant="secondary")
                
            with gr.Column(scale=3):
                status_display = gr.Textbox(
                    label="Simulation Status",
                    value="⏹️ No simulation running",
                    interactive=False,
                    lines=2
                )
                
                logs_display = gr.Textbox(
                    label="Simulation Logs",
                    value="No logs available",
                    interactive=False,
                    lines=8,
                    max_lines=15
                )
        
        # Event handlers
        launch_btn.click(
            fn=simulate_attack,
            inputs=[apt_dropdown],
            outputs=[status_display, logs_display]
        )
        
        refresh_btn.click(
            fn=get_simulation_status,
            outputs=[status_display, logs_display]
        )
        
        # Auto-refresh every 3 seconds when simulation is running
        gr.Timer(3).tick(
            fn=get_simulation_status,
            outputs=[status_display, logs_display]
        )

def create_detection_tab():
    """Create the Detection Results tab interface."""
    with gr.Tab("🔍 Detection Results", id="detection"):
        gr.Markdown("## Detection Coverage Analysis")
        gr.Markdown("View detection results and MITRE ATT&CK technique coverage from completed simulations.")
        
        with gr.Row():
            with gr.Column(scale=1):
                apt_filter = gr.Dropdown(
                    choices=["All APT Groups"] + APT_GROUPS,
                    label="Filter by APT Group",
                    value="All APT Groups",
                    info="Filter results by specific APT group"
                )
                
                fetch_btn = gr.Button("📊 Fetch Detection Results", variant="primary")
                export_btn = gr.Button("💾 Export Results", variant="secondary")
                
            with gr.Column(scale=3):
                results_table = gr.Dataframe(
                    label="Detection Results",
                    headers=["Technique", "Name", "Coverage", "Confidence"],
                    interactive=False,
                    wrap=True
                )
                
                coverage_summary = gr.Textbox(
                    label="Coverage Summary",
                    lines=3,
                    interactive=False,
                    placeholder="Click 'Fetch Detection Results' to view coverage analysis"
                )
        
        def fetch_and_summarize(apt_filter_val):
            apt_name = apt_filter_val if apt_filter_val != "All APT Groups" else None
            df = get_detection_results(apt_name)
            
            if not df.empty:
                total = len(df)
                full_coverage = len(df[df['Coverage'] == 'Full'])
                partial_coverage = len(df[df['Coverage'] == 'Partial'])
                no_coverage = len(df[df['Coverage'] == 'None'])
                
                summary = f"""📈 Coverage Statistics:
• Full Coverage: {full_coverage}/{total} ({full_coverage/total*100:.1f}%)
• Partial Coverage: {partial_coverage}/{total} ({partial_coverage/total*100:.1f}%)
• No Coverage: {no_coverage}/{total} ({no_coverage/total*100:.1f}%)"""
            else:
                summary = "No detection results available. Run a simulation first."
            
            return df, summary
        
        fetch_btn.click(
            fn=fetch_and_summarize,
            inputs=[apt_filter],
            outputs=[results_table, coverage_summary]
        )

def create_reports_tab():
    """Create the Reports tab interface."""
    with gr.Tab("📋 Reports", id="reports"):
        gr.Markdown("## Analysis Reports")
        gr.Markdown("View detailed analysis reports, threat intelligence briefings, and detection summaries.")
        
        with gr.Row():
            with gr.Column(scale=1):
                report_dropdown = gr.Dropdown(
                    choices=list_reports(),
                    label="Select Report",
                    info="Choose a report to view"
                )
                
                load_btn = gr.Button("📖 Load Report", variant="primary")
                download_btn = gr.Button("⬇️ Download Report", variant="secondary")
                
                gr.Markdown("### Report Types")
                gr.Markdown("""
                - **APT Analysis**: Detailed APT group behavior analysis
                - **Detection Coverage**: Coverage gap analysis and recommendations  
                - **MITRE Heatmaps**: Visual technique coverage mapping
                - **Intelligence Briefs**: Threat landscape updates
                """)
                
            with gr.Column(scale=3):
                report_viewer = gr.Markdown(
                    value="Select a report and click 'Load Report' to view content.",
                    label="Report Content"
                )
        
        load_btn.click(
            fn=load_report,
            inputs=[report_dropdown],
            outputs=[report_viewer]
        )

def create_mitre_tab():
    """Create the MITRE ATT&CK Heatmap tab interface."""
    with gr.Tab("🗺️ MITRE Heatmap", id="mitre"):
        gr.Markdown("## MITRE ATT&CK Coverage Heatmap")
        gr.Markdown("Visualize detection coverage across MITRE ATT&CK techniques and export Navigator-compatible JSON.")
        
        with gr.Row():
            with gr.Column(scale=1):
                gr.Markdown("### Heatmap Controls")
                
                generate_btn = gr.Button("🎨 Generate Heatmap", variant="primary")
                download_json_btn = gr.Button("📥 Download Navigator JSON", variant="secondary")
                
                gr.Markdown("### Legend")
                gr.HTML("""
                <div style="padding: 10px; border-radius: 5px; background-color: #1f2937;">
                    <div style="margin: 5px 0;"><span style="color: #00ff00;">●</span> Full Coverage (90-100%)</div>
                    <div style="margin: 5px 0;"><span style="color: #ffff00;">●</span> Partial Coverage (50-89%)</div>
                    <div style="margin: 5px 0;"><span style="color: #ff6600;">●</span> Limited Coverage (1-49%)</div>
                    <div style="margin: 5px 0;"><span style="color: #ff0000;">●</span> No Coverage (0%)</div>
                </div>
                """)
                
            with gr.Column(scale=3):
                heatmap_placeholder = gr.HTML(
                    value="""
                    <div style="text-align: center; padding: 50px; border: 2px dashed #666; border-radius: 10px; background-color: #1f2937;">
                        <h3>🗺️ MITRE ATT&CK Navigator Heatmap</h3>
                        <p>Click 'Generate Heatmap' to create a visual representation of detection coverage.</p>
                        <p><em>In production, this would display an interactive MITRE Navigator heatmap.</em></p>
                    </div>
                    """,
                    label="Heatmap Visualization"
                )
                
                json_output = gr.Code(
                    language="json",
                    label="Navigator JSON Export",
                    lines=10,
                    interactive=False
                )
        
        generate_btn.click(
            fn=lambda: (
                """
                <div style="text-align: center; padding: 30px; border: 2px solid #00ff00; border-radius: 10px; background-color: #0a2e0a;">
                    <h3>✅ Heatmap Generated Successfully!</h3>
                    <p>Detection coverage heatmap has been generated based on current simulation results.</p>
                    <p><strong>Coverage Score: 73.2%</strong></p>
                    <div style="margin-top: 20px;">
                        <div style="display: inline-block; margin: 5px; padding: 10px; background-color: #00ff00; color: black; border-radius: 5px;">Full: 8 techniques</div>
                        <div style="display: inline-block; margin: 5px; padding: 10px; background-color: #ffff00; color: black; border-radius: 5px;">Partial: 5 techniques</div>
                        <div style="display: inline-block; margin: 5px; padding: 10px; background-color: #ff0000; color: white; border-radius: 5px;">None: 3 techniques</div>
                    </div>
                </div>
                """,
                generate_mitre_heatmap()
            ),
            outputs=[heatmap_placeholder, json_output]
        )

def create_main_interface():
    """Create the main Gradio interface."""
    
    # Custom CSS for dark theme and styling
    css = """
    .gradio-container {
        background-color: #0f172a !important;
        color: #e2e8f0 !important;
    }
    
    .tab-nav {
        background-color: #1e293b !important;
        border-radius: 8px !important;
    }
    
    .selected {
        background-color: #3b82f6 !important;
    }
    
    .gr-button-primary {
        background: linear-gradient(45deg, #3b82f6, #1d4ed8) !important;
        border: none !important;
        font-weight: 600 !important;
    }
    
    .gr-button-secondary {
        background: linear-gradient(45deg, #6b7280, #4b5563) !important;
        border: none !important;
    }
    
    .gr-textbox, .gr-dropdown, .gr-dataframe {
        background-color: #1e293b !important;
        border: 1px solid #374151 !important;
        border-radius: 6px !important;
    }
    
    .status-running {
        color: #fbbf24 !important;
        font-weight: 600 !important;
    }
    
    .status-completed {
        color: #10b981 !important;
        font-weight: 600 !important;
    }
    
    .coverage-full { color: #10b981 !important; }
    .coverage-partial { color: #f59e0b !important; }
    .coverage-none { color: #ef4444 !important; }
    """
    
    with gr.Blocks(css=css, theme=gr.themes.Soft(primary_hue="blue"), title="AI Detection Engineering Lab") as app:
        
        # Header
        gr.HTML("""
        <div style="text-align: center; padding: 20px; background: linear-gradient(45deg, #1e3a8a, #3b82f6); border-radius: 10px; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 2.5em;">🛡️ AI Detection Engineering Lab</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 1.2em;">Advanced Persistent Threat Simulation & Detection Analysis Platform</p>
        </div>
        """)
        
        # Main tabbed interface
        with gr.Tabs():
            create_simulation_tab()
            create_detection_tab()
            create_reports_tab()
            create_mitre_tab()
        
        # Footer
        gr.HTML("""
        <div style="text-align: center; padding: 20px; margin-top: 30px; border-top: 1px solid #374151; color: #6b7280;">
            <p>🔬 AI-Driven Detection Engineering Lab Platform | Built with Gradio | Ready for Backend Integration</p>
        </div>
        """)
    
    return app

# =============================================================================
# MAIN APPLICATION
# =============================================================================

if __name__ == "__main__":
    # Create the main interface
    app = create_main_interface()
    
    print("🚀 Starting AI Detection Engineering Lab Platform...")
    print("🌐 Access the platform at: http://localhost:7860")
    print("📚 Features available:")
    print("   • APT Group Simulation Launcher")
    print("   • Real-time Detection Results Analysis") 
    print("   • Interactive Report Viewer")
    print("   • MITRE ATT&CK Coverage Heatmap")
    print("\n✨ Platform ready for cybersecurity teams!")
    
    # Launch the application
    app.launch(
        server_name="0.0.0.0",
        server_port=7860,
        share=False,
        show_error=True,
        quiet=False
    ) 