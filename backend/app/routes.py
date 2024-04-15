from os import path

import torch
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from numpy import float32
from transformers import BertTokenizerFast, pipeline

file_path = path.dirname(__file__)

tokenizer = BertTokenizerFast.from_pretrained(
    path.join(file_path, "../models/bert_finetuned/tokenizer")
)
model = torch.load(
    path.join(file_path, "../models/Bert Model.h5"), map_location=torch.device("cpu")
)
pipe = pipeline(
    task="token-classification", model=model, tokenizer=tokenizer, aggregation_strategy="simple"
)


def serialize_result(results):
    formatted_result = list()
    for result in results:
        temp_result = dict()
        for key, value in result.items():
            if type(value) == float32:
                temp_result[key] = value.item()
            else:
                temp_result[key] = value
        formatted_result.append(temp_result)
    return formatted_result


def preprocess_tag(results, text):
    tags = []
    for result in results:
        start_word = text[: result["start"]].count(" ")
        end_word = text[: result["end"]].count(" ")
        tags.append(
            {
                "start": start_word,
                "end": end_word + 1,
                "tag": result["entity_group"],
                "score": result["score"],
            }
        )
    return tags


router = APIRouter(prefix="/api")


@router.get("/ner-tags")
def get_ner_tags(string: str):
    results = serialize_result(pipe(string))
    results = preprocess_tag(results, string)
    return JSONResponse(results)
