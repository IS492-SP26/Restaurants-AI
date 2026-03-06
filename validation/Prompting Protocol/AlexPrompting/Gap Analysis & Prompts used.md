### **1\. Prompting Protocol (Gemini, Perplexity, Canva AI)**

**Scenario A: Typical Use (Market Analysis & Concept Generation)**

* **Task:** Generate a basic business concept and market overview for a common restaurant type.  
* **Prompt:** "I am a student entrepreneur looking to open a casual, quick-service Korean fried chicken restaurant on Green Street in Champaign, IL. My budget is $150,000, and my target audience is UIUC students. Provide a market analysis and a detailed concept plan."  
* **What to evaluate:** Does the tool understand the UIUC student demographic? Are the cost estimates realistic for Champaign, or are they generic national averages? Canva AI will likely output a visually pleasing but highly generic template.

**Scenario B: Edge Case (Extreme Constraints)**

* **Task:** Test the tool's financial reasoning when given tight operational constraints.  
* **Prompt:** "I have a strict budget of $30,000 to start a late-night boba tea shop on Green Street in Champaign. To save money, it will only operate from 10 PM to 3 AM. Provide a detailed startup cost breakdown and evaluate if this is financially feasible."  
* **What to evaluate:** Does the tool flag the $30k budget as an extreme risk for a brick-and-mortar spot? Does it calculate the difficulty of hitting break-even with only 5 hours of operation per day?

**Scenario C: Failure Case (Hyper-Local Regulatory & Real-Time Data)**

* **Task:** Force the tool to provide highly specific local regulatory and real estate data, which LLMs typically hallucinate or fail to retrieve accurately.  
* **Prompt:** "What are the exact zoning laws, health department permit costs, and current average commercial rent per square foot for a new restaurant requiring a grease trap installation on Green Street in Champaign, IL?"  
* **What to evaluate:** Watch for hallucinations or generic advice like "check with your local city council." This perfectly highlights the need for a locally grounded multi-agent system.

**2 . Tool Performance Analysis**

**Scenario A: Typical Use (Market Analysis & Concept Generation)**

* **The Test:** Generate a concept for a Korean fried chicken restaurant on Green Street with a $150,000 budget targeting UIUC students.  
* **Gemini:** Adopted a highly conversational "brainstorming partner" persona. It correctly recognized the hyper-local context (mentioning local spots like Yogi Korean, Kam's, and The Red Lion). It flagged the $150,000 budget as tight for a full build-out on Green Street and suggested leaner alternatives, such as a grab-and-go window or a fusion sandwich shop.  
* **Perplexity:** Took a highly analytical, data-driven approach. It provided specific data points (UIUC's 60,000+ enrollment, 18-22 demographic) and correctly identified direct local competitors, such as Yogi Korean, Thai Fusion, and Shawarma Joint. It validated (60k equipment, $45k build-out, $45k fixtures).  
* **Canva AI:** Produced a visually formatted but highly generic business plan. While it parroted back "Green Street" and "UIUC," its advice was boilerplate (e.g., "create a welcoming space with bold colors"). Its financial projections were arbitrary, hallucinating a neat 100 customer/day metric to reach a 6-9 month break-even point without grounding it in local real estate costs.

**Scenario B: Edge Case (Extreme Constraints)**

* **The Test:** A strict $30,000 budget for a late-night (10 PM \- 3 AM) boba shop on Green Street.  
* **Gemini:** Immediately passed the primary test by flagging the $30,000 budget as "extremely tight" for a traditional storefront. It provided a bare-bones breakdown but noted it completely excluded major leasehold improvements, warning that health codes and deposits would eat the budget. It smartly suggested pivots such as a mobile cart or a ghost kitchen.  
* **Perplexity:** Performed best on the financial reasoning constraint. It explicitly stated that a brick-and-mortar is "not realistically achievable" and pulled actual Green Street rent data ($34–36/sq ft/yr) to prove that lease costs alone would consume the budget. Furthermore, it calculated the exact difficulty of the 5-hour operating window: noting that to cover $6,000/month in expenses, the shop would need to generate $40/hour in gross profit (15-20 transactions an hour), which is incredibly risky.  
* **Canva AI:** Failed this test entirely. It did not recognize the extreme risk, confidently stating that "opening a late-night boba tea shop with a budget of $30,000 on Green Street is financially feasible". It provided a generic, neatly packaged $27,000 budget that allocated an unrealistic $5,000 for rent/deposit and $4,000 for renovations, completely ignoring the financial math of operating only 5 hours a day.

**Scenario C: Failure Case (Hyper-Local Regulatory Data)**

* **The Test:** Retrieve exact zoning laws, health permit costs, and commercial rent for a new restaurant requiring a grease trap on Green Street.  
* **Gemini:** Avoided hallucinating exact numbers but defaulted to generic routing advice. It told the user to check the "Champaign County GIS Consortium" and the "Champaign-Urbana Public Health District (C-UPHD)" but did not provide the exact zoning class or permit fees requested.  
* **Perplexity:** Excelled by finding specific, proximate data. It identified the area as a Central Business (CB) zoning district subject to Chapter 37 of the Municipal Code. It retrieved exact C-UPHD plan review fees (200–500), cited the specific Illinois Food Service Sanitation Code for grease traps (77 Ill. Adm. Code 750.1090), and pulled recent rent examples (20–34/SF/YR).  
* **Canva AI:** Hallucinated generic averages without citing sources. It claimed application fees are "$300 to 600"*andrentis*"20 to $30 per square foot," presenting generic national averages as hyper-local facts

