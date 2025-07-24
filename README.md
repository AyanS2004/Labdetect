# 🛡️ AI-Driven Detection Engineering Lab Platform

A comprehensive cybersecurity platform that enables security teams to run real-world APT simulations mapped to the MITRE ATT&CK framework, visualize telemetry data in real-time, and automatically validate detection coverage using Large Language Models.

## 🌟 Features

### 🎯 APT Simulation Launcher
- **10+ APT Groups**: Simulate attacks from major threat actors (APT29, APT33, APT38, etc.)
- **Real-time Status**: Monitor simulation progress with live logs and status updates
- **MITRE Mapping**: All simulations mapped to MITRE ATT&CK framework techniques

### 🔍 Detection Results Viewer
- **Coverage Analysis**: View detection coverage for Full, Partial, and None categories
- **Confidence Scoring**: AI-powered confidence ratings for each detection
- **Filterable Results**: Filter by specific APT groups or view aggregate results
- **Export Capability**: Export results for further analysis

### 📋 Interactive Report Viewer
- **Multiple Formats**: Support for Markdown and PDF reports
- **Real-time Generation**: Reports generated with current timestamps
- **Intelligence Briefings**: Threat landscape updates and analysis
- **Coverage Summaries**: Detailed gap analysis and recommendations

### 🗺️ MITRE ATT&CK Heatmap
- **Visual Coverage**: Color-coded technique coverage visualization
- **Navigator Compatible**: Export Navigator JSON for external tools
- **Interactive Legend**: Clear coverage indicators and statistics
- **Downloadable Exports**: JSON exports for integration with other tools

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- pip package manager

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd Labdetect
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Launch the platform:**
   ```bash
   python launch.py
   ```
   
   Or directly:
   ```bash
   python web_ui/app.py
   ```

4. **Access the platform:**
   - Open your browser to `http://localhost:7860`
   - The platform will be ready for use immediately

## 🏗️ Architecture

### Frontend Components
- **Gradio Interface**: Modern, responsive web UI with dark theme
- **Tabbed Navigation**: Organized interface with 4 main sections
- **Real-time Updates**: Auto-refreshing status and progress indicators
- **Modular Design**: Easy to extend and customize

### Backend Integration Points
The platform is designed with clean separation between UI and backend logic:

```python
# Mock functions ready for backend integration
- simulate_attack(apt_name: str)        # Launch APT simulation
- get_detection_results()               # Fetch detection analysis
- list_reports()                        # Get available reports
- load_report(report_name: str)         # Load report content
- generate_mitre_heatmap()              # Create coverage heatmap
```

### Data Flow
```
APT Selection → Simulation Launch → Telemetry Generation → 
Detection Analysis → Coverage Mapping → Report Generation
```

## 🎮 Usage Guide

### Running an APT Simulation

1. **Navigate to the "APT Simulation" tab**
2. **Select an APT group** from the dropdown (e.g., APT29 Cozy Bear)
3. **Click "Launch Simulation"** to start
4. **Monitor progress** in the status area and logs
5. **View completion** when simulation finishes

### Viewing Detection Results

1. **Go to "Detection Results" tab**
2. **Optional**: Filter by specific APT group
3. **Click "Fetch Detection Results"**
4. **Review coverage** in the results table
5. **Check summary statistics** for overall coverage

### Reading Reports

1. **Open the "Reports" tab**
2. **Select a report** from the dropdown
3. **Click "Load Report"** to view content
4. **Read analysis** in the markdown viewer
5. **Download** reports if needed

### MITRE Heatmap Visualization

1. **Switch to "MITRE Heatmap" tab**
2. **Click "Generate Heatmap"** to create visualization
3. **View coverage** with color-coded legend
4. **Download Navigator JSON** for external use

## 🔧 Customization

### Adding New APT Groups
```python
# In web_ui/app.py, update the APT_GROUPS list:
APT_GROUPS = [
    "APT29 (Cozy Bear)",
    "APT33 (Elfin)",
    "Your_New_APT_Group",  # Add here
    # ... existing groups
]
```

### Extending Detection Results
```python
# Add new mock data in MOCK_DETECTION_RESULTS:
MOCK_DETECTION_RESULTS = {
    "Your_APT_Group": [
        {"Technique": "T1234", "Name": "New Technique", "Coverage": "Full", "Confidence": "95%"},
        # ... more techniques
    ]
}
```

### Custom Report Templates
```python
# In load_report() function, add custom report logic:
def load_report(report_name: str) -> str:
    if report_name == "custom_report.md":
        return generate_custom_report()
    # ... existing logic
```

## 🔌 Backend Integration

The platform is designed for easy backend integration. Replace mock functions with real implementations:

### Simulation Backend
```python
def simulate_attack(apt_name: str) -> Tuple[str, str]:
    # Replace with actual simulation logic
    # - Connect to attack simulation framework
    # - Launch containerized attack scenarios
    # - Return real-time status and logs
```

### Detection Engine Integration
```python
def get_detection_results() -> pd.DataFrame:
    # Replace with actual detection engine queries
    # - Query SIEM/detection systems
    # - Analyze telemetry data
    # - Return real coverage metrics
```

### Report Generation
```python
def load_report(report_name: str) -> str:
    # Replace with actual report loading
    # - Read from report storage system
    # - Generate dynamic reports with LLM
    # - Return formatted content
```

## 🛠️ Development

### Project Structure
```
Labdetect/
├── web_ui/
│   └── app.py              # Main Gradio application
├── requirements.txt        # Python dependencies  
├── launch.py              # Application launcher
├── README.md              # This documentation
└── reports/               # Sample reports (to be created)
```

### Mock Data
The platform includes comprehensive mock data for testing:
- **10 APT groups** with realistic names and descriptions
- **Sample detection results** with MITRE technique mappings
- **Report templates** for various analysis types
- **Heatmap data** for coverage visualization

### Extending the Platform
1. **Add new tabs** by creating functions like `create_new_tab()`
2. **Extend data models** by updating mock data structures
3. **Add new visualizations** using Gradio's rich component library
4. **Integrate external APIs** by replacing mock functions

## 📊 Sample Data

### APT Groups Included
- APT29 (Cozy Bear) - Russian state-sponsored
- APT28 (Fancy Bear) - Russian military intelligence  
- APT33 (Elfin) - Iranian state-sponsored
- APT34 (OilRig) - Iranian state-sponsored
- APT38 (Lazarus) - North Korean state-sponsored
- APT39 (Chafer) - Iranian state-sponsored
- APT40 (Leviathan) - Chinese state-sponsored
- APT41 (Double Dragon) - Chinese state-sponsored
- Carbanak - Financial-focused cybercriminal group
- FIN7 - Financial-focused threat group

### MITRE Techniques Covered
- T1055 (Process Injection)
- T1078 (Valid Accounts)
- T1083 (File and Directory Discovery)
- T1090 (Connection Proxy)
- T1105 (Ingress Tool Transfer)
- And many more...

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions, issues, or feature requests:
1. Check the documentation above
2. Review the code comments in `web_ui/app.py`
3. Create an issue in the repository
4. Contact the development team

## 🔮 Future Enhancements

- **Real-time Telemetry Streaming**: Live data visualization
- **Advanced LLM Integration**: ChatGPT/Ollama analysis
- **Multi-tenant Support**: Team-based access control
- **API Documentation**: REST API for external integrations
- **Docker Deployment**: Containerized deployment options
- **Cloud Integration**: AWS/Azure/GCP deployment guides

---

🛡️ **Built for cybersecurity teams who demand excellence in threat detection and analysis.**
