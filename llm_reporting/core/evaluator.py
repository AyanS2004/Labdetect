# evaluator.py (complete version)
import json, os
from ollama import chat  # Replace with appropriate Ollama client if needed
from llm_reporting.core.utils import ensure_dir

RULES_PATH = os.path.join("llm_reporting", "detection_rules", "json")
EVAL_PATH = os.path.join("llm_reporting", "reports", "evaluations")
CONTEXT_PATH = os.path.join("llm_reporting", "data", "model_contexts", "prompt.txt")


def load_prompt_template():
    if os.path.exists(CONTEXT_PATH):
        with open(CONTEXT_PATH, "r") as f:
            return f.read()
    return "Analyze this Sigma rule and generate a detailed detection summary:"


def evaluate_rule_by_id(rule_id: str) -> dict:
    rule_path = os.path.join(RULES_PATH, f"{rule_id}.json")
    if not os.path.exists(rule_path):
        raise FileNotFoundError(f"Rule file not found: {rule_path}")

    with open(rule_path, "r") as f:
        rule_data = json.load(f)

    prompt_template = load_prompt_template()
    full_prompt = f"{prompt_template}\n\n{json.dumps(rule_data, indent=2)}"

    # Run the LLM
    response = chat(
        model="phi3",
        messages=[{"role": "user", "content": full_prompt}]
    )

    # Extract only the content string from the message
    message_content = response.get("message", {}).get("content", "No content returned")

    result = {
        "rule_id": rule_id,
        "evaluation": message_content,
        "summary": "LLM-generated summary or tags to be parsed here",
    }

    ensure_dir(EVAL_PATH)
    output_path = os.path.join(EVAL_PATH, f"{rule_id}.json")
    with open(output_path, "w") as f:
        json.dump(result, f, indent=2)

    return result