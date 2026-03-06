# Gap Analysis

## Overview

After testing GPT, Gemini, and Claude with our restaurant planning prompts, we found that current AI tools are helpful for brainstorming and generating initial ideas. However, they are not reliable enough to provide full decision support for someone who actually wants to open a restaurant in a specific local area.

Across all prompts, several common limitations appeared.

---

## Key Gaps

### 1. Weak local grounding
The tools sometimes mentioned local restaurants or market conditions, but it was hard to verify whether the information was correct or up to date.

Why this matters:  
A founder making a real decision about opening a restaurant cannot rely on possibly incorrect or outdated local information.

---

### 2. High confidence but low transparency
The tools often sounded very confident even when the information might be uncertain.

Why this matters:  
Users may trust the answer too much even though the AI might just be generating reasonable guesses.

---

### 3. Financial estimates are very rough
The tools can generate cost breakdowns, but the numbers are usually broad estimates without clear sources.

Why this matters:  
Startup costs such as rent, renovation, and equipment are critical for restaurant planning, so rough estimates are not always enough.

---

### 4. Operations advice is mostly generic
The tools gave reasonable suggestions for staffing and kitchen setup, but most of the advice could apply to almost any restaurant.

Why this matters:  
Our use case requires planning specifically for a campus area with high student traffic.

---

### 5. No built-in critique or validation
The tools mainly provide answers, but they do not challenge their own assumptions or highlight potential problems unless asked.

Why this matters:  
Founders need systems that not only generate ideas but also point out risks and unrealistic plans.

---

## Design Implications

These results suggest that a better system should:

1. use stronger local grounding  
2. separate different types of analysis (market, finance, operations)  
3. include a critique step to identify risks  
4. show assumptions clearly and allow user edits  

These observations support our idea of building a **multi-agent AI assistant for restaurant launch planning**.
