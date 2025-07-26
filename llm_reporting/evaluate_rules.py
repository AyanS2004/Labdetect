import os
import json
import yaml
import subprocess

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
RULE_DIR = os.path.join(BASE_DIR, "detection_rules")
REPORT_DIR = os.path.join(BASE_DIR, "reports", "evaluations")
MODEL_NAME = "phi3"

PROMPT_TEMPLATE = """
You are a detection engineering assistant. Analyze the following Sigma detection rule for correctness, coverage, and quality.

Evaluate the following fields:
1. Validate:
   - title: Is it descriptive?
   - id: Is it a valid UUID?
   - logsource: Is it appropriate for this detection?
   - tags: Are MITRE ATT&CK IDs accurate?
   - condition: Is the logic clear and valid?

2. Map to:
   - MITRE ATT&CK technique(s)
   - Kill Chain stage(s)
   - Visibility gaps (unlogged/missing fields)

3. Score (0–10):
   - Completeness
   - Logic Clarity
   - Threat Coverage

4. Suggestions (if any)

Sigma Rule JSON:
"""

os.makedirs(REPORT_DIR, exist_ok=True)

def convert_yaml_to_json(path):
    with open(path, 'r') as f:
        return yaml.safe_load(f)

def call_ollama(model, prompt):
    result = subprocess.run(
        ["ollama", "run", model],
        input=prompt.encode(),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    return result.stdout.decode()

def evaluate_rules():
    for filename in os.listdir(RULE_DIR):
        if not filename.endswith(".yml"):
            continue

        yml_path = os.path.join(RULE_DIR, filename)
        rule_json = convert_yaml_to_json(yml_path)
        rule_str = json.dumps(rule_json, indent=2)

        full_prompt = PROMPT_TEMPLATE + rule_str

        print(f"🔍 Evaluating: {filename}")
        response = call_ollama(MODEL_NAME, full_prompt)

        output_filename = os.path.splitext(filename)[0] + "_eval.json"
        output_path = os.path.join(REPORT_DIR, output_filename)

        with open(output_path, "w", encoding="utf-8") as f:
            f.write(response)

        print(f"✅ Saved: {output_path}")

if __name__ == "__main__":
    evaluate_rules()
