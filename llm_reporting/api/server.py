# server.py - Core FastAPI logic
from fastapi import FastAPI, HTTPException
from llm_reporting.core.evaluator import evaluate_rule_by_id
from llm_reporting.core.utils import list_rule_ids, load_evaluation
from typing import List
import os

app = FastAPI()

@app.get("/list_results", response_model=List[str])
def list_results():
    return list_rule_ids()

@app.get("/get_result/{rule_id}")
def get_result(rule_id: str):
    data = load_evaluation(rule_id)
    if not data:
        raise HTTPException(status_code=404, detail="Rule not found")
    return data

@app.post("/evaluate_rule")
def eval_rule(rule_id: str):
    try:
        result = evaluate_rule_by_id(rule_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))