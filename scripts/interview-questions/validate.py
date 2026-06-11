import json

with open(r'A:\graudation-project\careerk\scripts\interview-questions\frontend.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f'Valid JSON: {len(data)} questions')

required = {'role','level','category','question','difficulty','skills','estimatedTime','guidance'}
guidance_keys = {'keyPoints','commonMistakes','answerStructure'}

errors = []
for i, q in enumerate(data):
    if q['role'] != 'FRONTEND':
        errors.append(f'Q{i} wrong role: {q["role"]}')
    if q['level'] not in ('JUNIOR','MID','SENIOR'):
        errors.append(f'Q{i} wrong level: {q["level"]}')
    if q['category'] not in ('TECHNICAL','PROBLEM_SOLVING','BEHAVIORAL'):
        errors.append(f'Q{i} wrong category: {q["category"]}')
    if q['difficulty'] not in ('EASY','MEDIUM','HARD'):
        errors.append(f'Q{i} wrong difficulty: {q["difficulty"]}')
    if set(q.keys()) != required:
        errors.append(f'Q{i} extra/missing keys: {set(q.keys()) ^ required}')
    if set(q['guidance'].keys()) != guidance_keys:
        errors.append(f'Q{i} guidance missing keys: {set(q["guidance"].keys()) ^ guidance_keys}')
    g = q['guidance']
    if not (4 <= len(g['keyPoints']) <= 6):
        errors.append(f'Q{i} keyPoints count {len(g["keyPoints"])}')
    if not (3 <= len(g['commonMistakes']) <= 4):
        errors.append(f'Q{i} commonMistakes count {len(g["commonMistakes"])}')
    if not (4 <= len(g['answerStructure']) <= 6):
        errors.append(f'Q{i} answerStructure count {len(g["answerStructure"])}')

if errors:
    for e in errors:
        print(f'ERROR: {e}')
else:
    print('All validations passed!')
