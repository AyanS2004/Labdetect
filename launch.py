#!/usr/bin/env python3
"""
Launch script for AI Detection Engineering Lab Platform
"""

import os
import sys
import subprocess

def main():
    """Launch the Gradio application."""
    
    print("🛡️ AI Detection Engineering Lab Platform")
    print("=" * 50)
    
    # Check if we're in the correct directory
    if not os.path.exists("web_ui/app.py"):
        print("❌ Error: web_ui/app.py not found!")
        print("Please run this script from the Labdetect root directory.")
        sys.exit(1)
    
    # Check if requirements are installed
    try:
        import gradio
        import pandas
        print("✅ Dependencies verified")
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Please install requirements: pip install -r requirements.txt")
        sys.exit(1)
    
    print("🚀 Starting the platform...")
    print("🌐 Access URL: http://localhost:7860")
    print("📱 Mobile URL: http://localhost:7860")
    print("\nPress Ctrl+C to stop the server")
    print("-" * 50)
    
    # Launch the application
    try:
        subprocess.run([sys.executable, "web_ui/app.py"], check=True)
    except KeyboardInterrupt:
        print("\n👋 Platform stopped. Goodbye!")
    except Exception as e:
        print(f"❌ Error launching platform: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 