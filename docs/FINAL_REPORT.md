# Bridging the Entrepreneurial Gap: A Multi-Agent AI System for Hyper-Local Restaurant Feasibility and Planning

**Authors:** Mubtasim Raad, Alex Chen, Laura Shih, Takumi Nishi  
**Course:** IS492 — Introduction to Generative AI for Human-AI Collaboration  
**Semester:** Spring 2026  
**Project:** Restaurant Startup Studio / Restaurant AI  
**Demo:** https://restaurants-ai-48ke.vercel.app/

---

## Abstract

The journey toward local entrepreneurship, particularly within the high-risk and highly regulated restaurant industry, is often defined by significant barriers to entry and a high frequency of costly mistakes for first-time founders. While general purpose artificial intelligence has expanded access to business information, current tools often lack the structured guidance, local regulatory accuracy, and high-fidelity financial modeling necessary for genuine feasibility analysis. This report introduces Restaurant AI, a specialized multi-agent decision support system designed to democratize restaurant ownership by integrating market analysis, financial modeling, and localized compliance checks into a single intelligent workflow. By deploying specialized agents for marketing, operations, finance, and regulation, the system transforms minimal user inputs into comprehensive, actionable launch blueprints tailored to specific local contexts, such as Champaign, Illinois. Built on a glass-box architecture that prioritizes transparency and verifiable citations, Restaurant AI addresses critical gaps in current toolsets, specifically the risks of hallucinated data and speculative financial figures. The system provides founders with a structured three-step flow, Basics, Ideas, and a Startup Manual to ensure early decisions are informed by data rather than bias. Preliminary evaluation indicates that this multi-agentic approach significantly lowers the barrier to entry for passion-driven founders who lack formal business training or access to expensive consulting services.

---

## Introduction and Related Work

Starting a restaurant or local business is an inherently overwhelming endeavor for first-time entrepreneurs. Founders must simultaneously navigate market validation, financial planning, complex regulatory compliance, and operational risks, often without the benefit of a structured framework. In high-stakes environments like the restaurant industry, underestimating these risks can lead to preventable failure. Our target users are primarily students, career switchers, and passion-driven founders such as chefs or home cooks who possess culinary talent but lack formal business training or the capital to hire consultants and lawyers. For these individuals, the information gap represents a primary obstacle to success.

The motivation for Restaurant AI stems from the growing interest in local entrepreneurship combined with the recent capabilities of generative AI to integrate market analysis and compliance evaluation into intelligent decision-support systems. However, general-purpose AI tools often provide information without verification or structured guidance. In our preliminary research and validation phases, we identified several recurring frictions and challenges that founders face, including student labor friction, menu bloat, and significant compliance gaps. We also noted a "black box problem" in existing AI solutions, where advice is given without transparent reasoning or evidence.

To address these issues, we conducted a literature review of several academic papers, which confirmed that AI can be leveraged for strategic entrepreneurial decision-making and acts as a democratizing force for first-time founders. Crucially, the research supports the use of multi-agent architectures for handling complex business tasks. This grounded our decision to move away from a single-prompt model toward a system where specialized agents manage different domains of the business plan.

Our analysis of existing tools revealed significant gaps that Restaurant AI is designed to bridge. For example, Gemini often provides slightly speculative financial figures, whereas Restaurant AI pulls verified, real-time data. ChatGPT frequently has a narrow competitive scope, which we counter with independent competitor mapping. Claude often fails to cite specific health codes or regulation ordinances, a gap we fill with proactive citations of local sources. Tools like Perplexity often cite municipal codes from outside the user's specific jurisdiction, such as providing non-Champaign codes for a Champaign-based project. Finally, platforms like Canva AI focus primarily on visual presentation but often generate hallucinated data without citation. These findings reinforced the need for a system that delivers immediate, well-formatted plans backed by multi-agentic verification.


---

## Method

### System Description

The Restaurant AI system is a web-based application designed as an educational planning assistant. The platform utilizes a multi-agentic workflow to provide a personalized business planning experience from minimal user inputs. The user interface evolved through iterative design, moving from a basic black-and-white functional prototype to a refined version using Tailwind CSS with modern color gradients and improved visual hierarchy to enhance the user experience. The system follows a refined three-step design direction: the user provides location and budget, the AI suggests opportunities based on market gaps, the user selects a concept, and finally, the multi-agent system generates a detailed restaurant launch blueprint. This approach ensures that early decisions, which are often uninformed or biased, are guided by industry intelligence.

The backend architecture consists of four specialized agents, primarily utilizing Claude and GPT-4o-mini via the OpenAI API, chosen for their cost-effectiveness and superior performance in structured tasks.

The Regulatory Agent addresses the critical lack of structured guidance in compliance. It processes a comprehensive collection of public data, including the Champaign, IL Code of Ordinances, zoning laws, the Illinois Food Service Sanitation Code, and state food compliance and enforcement guidelines. By citing real-world sources like the CUPHD and FDA Food Codes, the agent ensures outputs are verifiable, allowing users to cross-check guidance rather than relying on potentially hallucinated rules. Initial testing identified rate limits with free-tier providers like Groq, leading us to standardize on the OpenAI API for higher reliability.

The Operations Agent, focuses on labor, workflow, and quality management. It utilizes operational data and professional know-how to ensure model outputs provide structured and feasible guidance for day-to-day restaurant management. This agent addresses the student labor friction which was identified in our early validation studies by providing realistic expectations for staffing and workflow efficiency.

The Financial Agent was developed using Cursor and fine-tuned for specialized financial planning. It specifically addresses the limitation of speculative figures found in general AI tools. The agent integrates a wide array of public financial data, including CPI-U inflation, Consumer Expenditure Survey income data, FRB H.15 interest rates, Illinois county wage data, and BLS weekly earnings. A significant design challenge involved prioritizing which financial data points such as interest rates versus consumer spending most effectively train the agent to generate accurate budgets and cash-flow outputs. The agent uses structured JSON to ensure consistent and reliable financial narratives.

The Marketing Agent evaluates market demand and competitive landscapes. It draws on research relating to branding strategies and localized restaurant information, such as addresses and establishment types specifically within the Champaign area. The agent is designed to provide structured marketing outputs that help founders understand their location fit and potential customer demographics.

Safety and privacy are central to the system's design. The application protects user privacy by collecting only business-related information, no personally identifying information (PII) or sensitive data is stored. To maintain reliability and technical security, all API keys are excluded from the public GitHub repository to prevent exposure. Furthermore, every output includes a user disclaimer stating that the tool is an educational assistant and not a substitute for professional legal, tax, or financial advice.


### Evaluation Design

The evaluation of Restaurant AI is designed to assess the effectiveness of the multi-agent architecture in providing accurate, actionable, and trustworthy guidance compared to general-purpose tools. Our prompting study design is categorized into typical, edge, and failure cases across marketing, finance, and regulation.

In the marketing domain, typical cases evaluate the AI's performance on standard market demand and competitor analysis. Edge cases push the system to consider location-specific risks, such as how the UIUC academic calendar affects the sustainability of a high-volume profit model. Failure cases test the system's ethical guardrails by attempting to generate prohibited on-campus marketing strategies.

For finance and regulation, typical cases involve generating basic business plans, budgeting for common restaurant types, and asking for health and safety permits for alcohol sales. Edge cases assess the AI's ability to identify financial constraints under tough conditions, for example, calculating the difficulty of breaking even with only five hours of operation per day. We also test the system's response to non-compliant scenarios, such as opening a restaurant with an expired grease trap or non-ADA compliant restrooms. Failure cases evaluate the system's response to highly specific local regulatory queries or attempts to bypass rules, such as the three-compartment sink requirement in Champaign.

The user testing phase recruits entrepreneurs and students to test the three-step flow, Basics to Ideas to Manual. We specifically measure completion time, perceived usefulness, and the level of trust users place in the generated plans. To address the risk of hallucination, we are implementing verification layers and confidence scores to ensure the high reliability of all generated content. This comprehensive evaluation framework allows us to assess whether the "glass box" architecture successfully provides a higher fidelity of information than standard black-box AI models. By comparing our results against initial prototyping failures, such as the black-and-white layout and limited guidance of earlier versions, we can quantify the impact of our refined, multi-agentic design.


---

## Results

### Quantitative Results

We conducted a formative user study with nine participants to evaluate the Restaurant Startup Studio, a multi-agent AI web application for restaurant startup planning. Participants included students or early-stage users, a compliance/tax specialist, a startup finance professional, a non-technical restaurant founder, a downtown Champaign waiter, an izakaya operator, a restaurant business consultant, and a digital transformation project manager. This mix allowed us to evaluate both general usability and domain-specific usefulness.

The evaluation used the System Usability Scale (SUS), a 10-item questionnaire scored from 0 to 100. The teammate reports also used the standard SUS format with 1 = strongly disagree and 5 = strongly agree. Alex’s report separately recorded two participants with SUS scores of 77.5 and 70.0, with an average of 73.8 for those two users

| Participant | Background | SUS Score |
|---|---|---:|
| P1 | Student / early-stage user | 92.5 |
| P2 | Student / early-stage user | 95.0 |
| P3 | Compliance / tax specialist | 77.5 |
| P4 | Startup finance / CFO background | 70.0 |
| P5 | Non-technical restaurant founder | 82.5 |
| P6 | Waiter / downtown Champaign food-service experience | 82.5 |
| P7 | Izakaya operator / restaurant operations experience | 77.5 |
| P8 | Restaurant business consultant | 77.5 |
| P9 | DX project manager with AI tool integration experience | 75.0 |
| **Average** | — | **81.1** |

The average SUS score was 81.1 / 100, which suggests strong perceived usability. Most users agreed that the system was easy to use, well integrated, and quick to learn. Users also generally disagreed that the system was unnecessarily complex or cumbersome. This indicates that the core flow — entering basic information, reviewing restaurant ideas, selecting a concept, and reading the generated manual — was understandable for both non-technical and domain-experienced users.

However, the scores also show that usability does not automatically mean full trust. The lowest score, 70.0, came from a finance-oriented participant who wanted more detailed financial modeling, including projected profit and loss, break-even analysis, and cash-flow templates. This suggests that the system is easy to use, but domain experts expect deeper evidence and more precise calculations before using it for real business decisions.


### Qualitative Results

The qualitative feedback came from six open-ended interview questions about usefulness, confusion points, local grounding, manual specificity, missing information, and trust. One participant record contained partial qualitative responses, so the qualitative analysis mainly uses the completed interview responses.

A major positive theme was that users found the structured planning flow useful. Participants liked that the tool turned a vague restaurant idea into a step-by-step planning process. The Basics → Ideas → Manual flow helped users move gradually from initial input to concept selection and then to a full startup manual. This was especially helpful for beginner founders because the system reduced the “blank page” problem and gave users a clearer direction.

A second theme was that the financial and regulatory sections were highly valued. Participants appreciated the budget breakdowns, startup cost guidance, and realistic planning categories. Users with finance or business experience found the financial structure useful, although they wanted more calculations. The regulatory section was also positively received because it organized permits, compliance steps, and legal reminders in a practical sequence. A compliance-focused participant especially valued that the checklist was arranged around the actual startup timeline, such as before buildout, before opening, and ongoing compliance.

A third theme was local grounding. Many participants felt the system was more locally relevant than a generic chatbot. Users noticed references to Champaign, Green Street, Campustown, downtown Champaign, local student customers, wage data, and regulatory authorities. The izakaya operator said the system correctly identified the Research Park / UIUC context and the density of Asian and Mexican food options. However, local grounding was not complete. Some users wanted real local competitor names instead of mock placeholders, and one consultant noted that AI still cannot fully understand subtle community dynamics or the atmosphere of a specific block.

A fourth theme was that the manual was beginner-friendly but information-heavy. Users liked the phase-based playbook, checklists, beginner mistakes, and plain language. At the same time, some users felt that the manual delivered a lot of information at once. This suggests that future versions should include summaries, collapsible sections, examples, and templates.

A repeated confusion point was the appearance of technical labels, such as mock agents, model IDs, API keys, and fine-tuned agent status. Multiple users found these labels confusing or irrelevant. For a beginner founder, these backend details make the system feel unfinished. Future versions should hide developer-facing information and replace it with user-friendly status messages.


### Analysis and Discussion

Overall, the study suggests that Restaurant Startup Studio succeeds as an early-stage planning assistant. The high SUS average shows that users can navigate the system without needing technical support. The qualitative feedback also shows that users found the workflow useful for organizing restaurant startup decisions across market, finance, regulation, operations, and marketing.

The multi-agent design appears valuable because it separates a complex business planning task into domain-specific sections. Users did not just receive a generic business plan; they received a structured playbook with financial, regulatory, operational, and marketing guidance. This supports the project’s goal of using AI agents to reduce planning complexity for beginner founders.

At the same time, users showed conditional trust. They trusted the system for brainstorming, early research, and planning structure, but not as a final authority. Finance-focused users wanted more calculations. Restaurant-experienced users wanted supplier lists, inventory templates, allergen communication plans, and operational sustainability guidance. Compliance-focused users wanted more complete local legal and licensing details. Therefore, the system is currently strongest at helping users understand what to consider, but weaker at helping users execute every step in detail.

The main design implication is that the next version should focus on actionability and transparency. Users need clearer assumptions, real local data sources, official links, and more personalized calculations. The system should support human judgment rather than replace it. Its best role is to help founders ask better questions, organize their next steps, and prepare for professional verification.


---

## Limitations, Risks, and Ethical Considerations

This project has several limitations. First, the user study is small. Although nine participants are enough for a formative class evaluation, the results cannot represent all restaurant founders or all business contexts. Participants had different backgrounds, but the study did not include a large sample of actual first-time restaurant founders actively preparing to open a business.

Second, the system is focused on a specific local context: restaurant planning around Champaign, Illinois. This local focus makes the tool more useful than a generic chatbot for this case, but it limits generalizability. The system may not perform equally well for other cities, cuisines, budgets, or regulatory environments.

Third, the current fine-tuning setup is still early-stage. Four specialist agents — marketing, financial, regulatory, and operations — have fine-tuned model slots, but the datasets are small starter datasets generated from predefined founder scenarios and current app logic. They are not large, expert-labeled production datasets. This limits how much the model can be expected to generalize.

Fourth, the system includes fallback or mock behavior when model calls or fine-tuned model IDs are unavailable. This is useful for demos, but it can create confusion if users see technical labels or if outputs are not clearly distinguished from fine-tuned agent outputs.

The main risk is overtrust. Because the tool generates a polished manual, users may treat it as more authoritative than it really is. This is especially risky for legal, financial, and regulatory decisions. Restaurant founders should verify permits, taxes, licensing, food safety, labor requirements, and financial projections with official sources or professionals.

Another risk is hallucination or unsupported specificity. The system may produce recommendations that sound realistic but are not fully verified. This is especially important for cost estimates, licensing timelines, competitor analysis, and legal requirements.

Privacy is also important. Users may enter sensitive business information, such as budget, location preference, concept ideas, or financial assumptions. The system should minimize unnecessary data collection and clearly disclose what information is stored or sent to AI services.

Ethically, the system should be presented as a planning scaffold, not a replacement for experts. It should support human decision-making, keep users in control, and make uncertainty visible. Future versions should include clearer source links, assumption labels, and official government resources.

---

## Conclusion and Future Work

Restaurant Startup Studio demonstrates that a multi-agent AI system can help beginner founders organize the complex process of restaurant startup planning. The system guides users from basic information to concept suggestions and then to a structured startup manual. The user study showed strong perceived usability, with an average SUS score of 81.1 / 100 across nine participants.

The main finding is that users value the tool as an early planning assistant. Participants found the structured workflow, financial breakdowns, regulatory checklist, and local Champaign context useful. The tool helped reduce uncertainty and gave users a clearer starting point.

However, the system is not yet a standalone business decision-making tool. Users wanted more realistic financial calculations, real local competitor data, official permit links, supplier information, and clearer guidance on when to verify with professionals. This means the system’s future value depends on improving grounding, transparency, and actionability.

Future work should focus on five improvements. First, the financial section should convert percentages into actual dollar ranges based on the user’s budget and include break-even analysis, projected cash flow, and unit economics. Second, the concept suggestion page should include a side-by-side comparison table. Third, technical labels should be hidden from end users. Fourth, regulatory sections should include official links for permits, sales tax registration, liquor licensing, labor law, and health requirements. Fifth, the manual should become easier to digest through summaries, collapsible sections, templates, and exportable reports.

In the long term, this project could become a broader AI cofounder platform for local small-business planning. The current restaurant-focused version is a strong starting point because restaurant planning requires coordination across market, finance, legal, operations, and marketing decisions. The system’s most important contribution is not replacing human founders, but helping them think more clearly, ask better questions, and prepare for real-world validation.


---

## References

Brooke, john. (1996). SUS: A “Quick and Dirty” Usability Scale. In Usability Evaluation In Industry. CRC Press. 

Csaszar, F. A., Ketkar, H., & Kim, H. (2024). Artificial Intelligence and Strategic Decision-Making: Evidence from Entrepreneurs and Investors. Strategy Science, 9(4), 322–345. https://doi.org/10.1287/stsc.2024.0190 

Ganapathi, J. K. (2025). Augmented Entrepreneurship: The Role of AI Agents in Automating Core Small Business Functions. Journal Of Engineering And Computer Sciences, 4(8), 654–663. 

Hong, S., Zhuge, M., Chen, J., Zheng, X., Cheng, Y., Wang, J., Zhang, C., Wang, Z., Yau, S. K. S., Lin, Z., Zhou, L., Ran, C., Xiao, L., Wu, C., & Schmidhuber, J. (2023, October 13). MetaGPT: Meta Programming for A Multi-Agent Collaborative Framework. The Twelfth International Conference on Learning Representations. https://openreview.net/forum?id=VtmBAGCN7o&utm_source=chatgpt.com 

Swanson, K., Wu, W., Bulaong, N. L., Pak, J. E., & Zou, J. (2025). The Virtual Lab of AI agents designs new SARS-CoV-2 nanobodies. Nature, 1–3. https://doi.org/10.1038/s41586-025-09442-9 

Uriarte, S., Baier-Fuentes, H., Espinoza-Benavides, J., & Inzunza-Mendoza, W. (2026). Artificial intelligence technologies and entrepreneurship: A hybrid literature review. Review of Managerial Science, 20(1), 251–299. https://doi.org/10.1007/s11846-025-00839-4 


---

## Appendices

### Appendix A. Study Materials

The user study asked participants to test the deployed restaurant startup planning web application:

https://restaurants-ai-48ke.vercel.app/

Participants were asked to complete a realistic restaurant planning task using the tool. The task prompt was:

> Imagine you are a first-time founder who wants to open a restaurant near Green Street in Champaign, Illinois. Choose a startup budget range based on your own preference. Use the web app to enter your basic information, review the AI-generated restaurant concept suggestions, select one concept, and generate a startup manual. After using the tool, answer the survey and interview questions.

1. Participant received a short introduction to the project.
2. Participant used the deployed web app.
3. Participant completed the main restaurant planning task.
4. Participant filled out the SUS usability survey.
5. Participant answered open-ended interview questions.

The purpose of the study was to evaluate whether the tool was understandable, useful, beginner-friendly, and trustworthy for early-stage restaurant planning.

### Appendix B. Interview Questions and SUS Survey

#### Open-Ended Interview Questions

Participants answered the following open-ended questions after using the tool:

1. What part of the tool was most useful?
2. What part felt confusing?
3. Did the AI suggestions feel locally grounded?
4. Did the manual feel specific enough for a beginner founder?
5. What information was missing?
6. Would you trust this tool for early restaurant planning? Why or why not?

These interview questions did not have numerical scores. They were used to collect qualitative feedback.

#### SUS Survey

Participants also completed the System Usability Scale (SUS). The SUS survey uses a 1–5 scale:

| Score | Meaning |
|---:|---|
| 1 | Strongly disagree |
| 2 | Disagree |
| 3 | Neutral |
| 4 | Agree |
| 5 | Strongly agree |

The SUS questions were:

1. I think that I would like to use this system frequently.
2. I found the system unnecessarily complex.
3. I thought the system was easy to use.
4. I think that I would need the support of a technical person to be able to use this system.
5. I found the various functions in this system were well integrated.
6. I thought there was too much inconsistency in this system.
7. I would imagine that most people would learn to use this system very quickly.
8. I found the system very cumbersome to use.
9. I felt very confident using the system.
10. I needed to learn a lot of things before I could get going with this system.

### Appendix C. Prompt Versions

The system uses a multi-agent restaurant startup planning pipeline. Each agent is designed to handle a specific part of the restaurant planning task.

| Agent | Role in the System | Prompt Version |
|---|---|---|
| MarketResearchAgent | Analyzes market, competitors, and demand signals. | v1 |
| ConceptStrategyAgent | Shapes the restaurant concept and positioning. | v1 |
| FinancialPlanningAgent | Generates startup budget guidance, cash-flow tips, and financial realism. | v1 |
| LegalComplianceAgent | Generates a high-level compliance and permit checklist. | v1 |
| OperationsAgent | Generates staffing, supplier, equipment, and daily operations guidance. | v1 |
| MarketingAgent | Generates brand positioning, launch plan, and ongoing marketing ideas. | v1 |
| ManualComposerAgent | Combines agent outputs into a structured startup manual/playbook. | v1 |

Four specialist agents currently have fine-tuned model slots:

1. MarketingAgent
2. FinancialPlanningAgent
3. LegalComplianceAgent / Regulatory Agent
4. OperationsAgent

The MarketResearchAgent, ConceptStrategyAgent, and ManualComposerAgent are part of the runtime pipeline, but they are not part of the current fine-tuning dataset pipeline.

At runtime, each specialist agent receives:

1. Founder input
2. Selected restaurant concept context
3. Agent-specific knowledge pack

The agents are instructed to return structured JSON output. The system uses low-temperature model settings and JSON-constrained output when model calls are available. If the API key, fine-tuned model ID, or model call is unavailable, the system falls back to local template/mock behavior.

### Appendix D. Screenshot List

**Figure D1. Homepage of the deployed restaurant AI planning web application.**

<img width="1479" height="794" alt="image" src="https://github.com/user-attachments/assets/41b36953-9bf5-478c-9302-83e73f1d779b" />


**Figure D2. Basics input page where users enter location and budget information.**

<img width="910" height="907" alt="image" src="https://github.com/user-attachments/assets/cab8e03a-aa5b-4a6d-a640-365a513e258a" />


**Figure D3. AI-generated restaurant concept suggestions.**

<img width="841" height="886" alt="image" src="https://github.com/user-attachments/assets/55ba38de-1740-48a0-8c70-7dbac01a3429" />


**Figure D4. Generated startup manual page.**

<img width="908" height="908" alt="image" src="https://github.com/user-attachments/assets/4d1622ce-e5d3-4bb9-9b9f-11ff1fdca85d" />


**Figure D5. Example financial planning section.**

<img width="764" height="932" alt="image" src="https://github.com/user-attachments/assets/1e61373f-2c82-40d1-a51a-a8b92cde096b" />


**Figure D6. Example legal and licensing checklist section.**

<img width="765" height="908" alt="image" src="https://github.com/user-attachments/assets/5b4bd030-194e-434e-b964-7dc85dafbc1d" />


**Figure D7. Example operations section.**

<img width="768" height="378" alt="image" src="https://github.com/user-attachments/assets/fcc9539a-9364-4434-bd38-27228958bf5f" />

**Figure D8. Example marketing section.**

<img width="756" height="783" alt="image" src="https://github.com/user-attachments/assets/e2f5da00-7ec3-4487-a828-21b2e159fbc3" />


### Appendix E. AI Tools and Technical Disclosure

This project was developed as a Next.js web application with a multi-agent restaurant startup planning system.

#### Development Tool

The team used Cursor as the main coding workspace. Cursor was used for implementation, debugging, and project navigation.


#### OpenAI API Use

The application uses the OpenAI API through the official `openai` SDK. The system is designed to call OpenAI models at runtime for agent-based restaurant planning tasks.

#### Main App Libraries

| Category | Library / Tool | Version |
|---|---|---|
| Web framework | `next` | `16.2.2` |
| Frontend UI | `react` | `19.2.4` |
| Frontend rendering | `react-dom` | `19.2.4` |
| OpenAI integration | `openai` | `^6.33.0` |
| Styling | `tailwindcss` | `^4` |
| Tailwind PostCSS integration | `@tailwindcss/postcss` | `^4` |
| Language | `typescript` | `^5` |
| Linting | `eslint` | `^9` |
| Next.js lint config | `eslint-config-next` | `16.2.2` |
| Testing | `vitest` | `^4.1.4` |
| TypeScript execution | `tsx` | `^4.21.0` |
| React optimization | `babel-plugin-react-compiler` | `1.0.0` |

#### Deployment

The project was deployed on Vercel:

https://restaurants-ai-48ke.vercel.app/

#### Training and Fine-Tuning Disclosure

The fine-tuning pipeline builds starter chat datasets for four specialist agents:

1. Marketing
2. Financial
3. Regulatory
4. Operations

The datasets are generated from 12 predefined founder scenarios. Each agent dataset is split into 10 training examples and 2 validation examples.

The training examples are synthetic starter data generated from the app’s current prompt builders, founder/concept input format, local knowledge packs, and fallback outputs. Therefore, the current training corpus should be understood as a bootstrap dataset, not a large production-grade human-labeled corpus.
