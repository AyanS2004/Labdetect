import glob
import uuid
import re
import yaml

def is_valid_uuid(val):
    try:
        uuid.UUID(str(val))
        return True
    except:
        return False

files = glob.glob("**/*.yml", recursive=True)

for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = yaml.safe_load(f)

    modified = False
    rule_id = content.get("id")

    if not rule_id or not is_valid_uuid(rule_id):
        new_id = str(uuid.uuid4())
        content["id"] = new_id
        modified = True
        print(f"✅ Added UUID {new_id} to {file}")
    else:
        print(f"✔️ Valid UUID exists in {file}")

    if modified:
        with open(file, "w", encoding="utf-8") as f:
            yaml.dump(content, f, sort_keys=False)
