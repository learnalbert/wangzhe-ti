#!/usr/bin/env python3
"""把 mbti/ 下的拆分文件合并回 ../questions.json。"""
import json, os, sys
here = os.path.dirname(os.path.abspath(__file__))
out = os.path.abspath(os.path.join(here, '..', 'questions.json'))
data = {'mainQuiz': json.load(open(f'{here}/_mainQuiz.json', encoding='utf-8')),
        'heroQuizzes': {}}
order = ['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP',
         'ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP']
for k in order:
    p = f'{here}/{k}.json'
    if os.path.exists(p):
        data['heroQuizzes'][k] = json.load(open(p, encoding='utf-8'))
json.dump(data, open(out,'w',encoding='utf-8'), ensure_ascii=False, indent=2)
print(f'merged {len(data["heroQuizzes"])} MBTI → {out}')
