import yaml, json, glob, os

# Make output folder
os.makedirs("converted_json", exist_ok=True)

# Find all .yml files recursively
yml_files = glob.glob("**/*.yml", recursive=True)

for yml_file in yml_files:
    try:
        with open(yml_file, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f)

        # Create matching .json file path
        json_filename = os.path.join("converted_json", os.path.basename(yml_file).replace(".yml", ".json"))

        with open(json_filename, "w", encoding="utf-8") as jf:
            json.dump(data, jf, indent=2)

        print(f"✅ Converted: {yml_file} → {json_filename}")
    except Exception as e:
        print(f"❌ Error in {yml_file}: {e}")
