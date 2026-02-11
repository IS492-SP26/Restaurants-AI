### ---

**Reflection 1: Multi-Agent LLM Approach for Self-Directed Market Research and Analysis**

**Full Citation:** Koshkin, M., et al. (2025). MaRGen: Multi-agent LLM approach for self-directed market research and analysis. *Amazon Science*. [https://www.amazon.science/publications/margen-multi-agent-llm-approach-for-self-directed-market-research-and-analysis](https://www.amazon.science/publications/margen-multi-agent-llm-approach-for-self-directed-market-research-and-analysis)

* **Summary:** This paper presents MaRGen, a multi-agent framework that automates the end-to-end market research process. The system employs specialized agents that can act as researchers, reviewers, writers, and retrievers to autonomously gather data, evaluate its relevance, and produce structured analyses. By employing a "Self-Directed" approach, the agents can iteratively refine their search queries based on initial findings rather than following a predefined prompt. The paper demonstrates that this multi-agent coordination significantly reduces human effort while maintaining high accuracy in business reporting.  
* **Insights Learned:**  
  1. I learned that effective market research requires agents to update their internal knowledge base and generate new search queries based on what they have learned, rather than searching all at once.  
  2. I discovered that breaking down the analysis process into different roles helps catch inconsistencies that a single-agent system might overlook.  
  3. Moving from "Chain-of-Thought" to "Agentic Workflows" enables the system to determine when it has sufficient information to cease research and begin writing.  
* **Limitations/Risks:**  
  1. Hallucination would be a risk if a "Retriever" agent picks up incorrect data; the "Reviewer" might validate it as a fact and cause hallucination.  
  2. The multi-step coordination among four agents can lead to high response times, resulting in latency.   
* **Concrete Idea:** For our project, we can implement a "Self-Directed" query where the agent initially searches for current Green Street menus and, if it finds high competition in "Korean BBQ," autonomously shifts its next search to "Korean Fusion" to identify a better market gap.

### 

### 

### 

### ---

**Reflection 2: An LLM Hierarchical Multi-Agent Framework for Business Partner Selection**

**Full Citation:** Tran, N., et al. (2025). PartnerMAS: An LLM hierarchical multi-agent framework for business partner selection. *arXiv*. [https://arxiv.org/pdf/2509.24046](https://arxiv.org/pdf/2509.24046)

* **Summary:** The paper introduces PartnerMAS, a hierarchical multi-agent system designed to help businesses select optimal partners by analyzing data such as financial health, reputation, and strategic alignment. The framework comprises a "Supervisor" agent that manages two sub-agents: a "Specialist" for in-depth analysis and a "Planner" for task decomposition. This hierarchical structure ensures that high-level strategic goals are not lost when the system dive in low-level data processing. Experimental results demonstrate that this multi-agentic approach provides more practical and reliable business recommendations than standard single-agent LLMs.  
* **Insights Learned:**  
  1. I discovered that having a "Supervisor" agent is important for resolving conflicts between two specialist agents who disagree on a business decision.  
  2. As noted in the paper, when we address complex business problems, such as selecting a partner or starting a restaurant, they must be decomposed into smaller sub-tasks before being assigned to agents.  
  3. I have learned that business LLMs perform better when they are provided with a "Scorecard" or metrics to evaluate different options.  
* **Limitations/Risks:**  
  1. The "Supervisor" agent may introduce risks. If the supervisor's instructions are vague, the sub-agents may get stuck in a reasoning loop.  
  2. Using LLM agents to analyze sensitive business data (e.g., an organization’s private budget) presents a risk of data leakage when commercial APIs are employed.  
* **Concrete Idea:** For our project, we could use the "Supervisor" agent to act as the "Green Street Expert." This agent will oversee the "Financial Analyst" and the "Marketing Strategist" to ensure that their recommendations align with the student-driven economy of the Champaign-Urbana area.

