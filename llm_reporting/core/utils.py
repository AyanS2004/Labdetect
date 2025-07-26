# utils.py
import os, json

EVAL_PATH = os.path.join("llm_reporting", "reports", "evaluations")

def list_rule_ids():
    return [f[:-5] for f in os.listdir(EVAL_PATH) if f.endswith(".json")]

def load_evaluation(rule_id):
    path = os.path.join(EVAL_PATH, f"{rule_id}.json")
    if os.path.exists(path):
        with open(path, "r") as f:
            return json.load(f)
    return None

def ensure_dir(path):
    os.makedirs(path, exist_ok=True)