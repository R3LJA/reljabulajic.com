import type { CaseStudy } from "./cases";

// MOCKUP ONLY, NOT TRUE (Oct 22, 2026): placeholder case study for a privately
// fine-tuned model Relja has not built yet. Every number here is invented for
// layout. Never used in production.
export const BASTION_MOCK: CaseStudy = {
  slug: "bastion",
  name: "Bastion",
  category: "Private AI model",
  headline: "An AI model trained on the client's own documents, running on their own server. Nothing leaves the building.",
  summary:
    "Bastion is an open model I fine-tuned on 40,000 freight documents. It reads rate confirmations more accurately than GPT, runs offline on one machine in the client's office, and costs a fraction of a cent per document.",
  ownership:
    "Designed, trained, evaluated and deployed end to end: the data pipeline, the training runs, the test set, the on-site server and the fallback to a cloud model.",
  accent: "#cbb48a",
  metrics: [
    { value: "98.6%", label: "fields read correctly, GPT 91%" },
    { value: "$0.0004", label: "per document, API was $0.02" },
    { value: "1", label: "machine on site, no internet needed" },
    { value: "0", label: "documents sent outside" },
  ],
  architecture: [
    {
      title: "Trained on their own work",
      body: "An open model (Qwen, Llama) is fine-tuned with LoRA on the client's real documents, so it learns their brokers, formats and abbreviations.",
    },
    {
      title: "Tested before it ships",
      body: "Every new version is scored on documents it has never seen. It only replaces the old one if it is better on every field.",
    },
    {
      title: "Runs where the data lives",
      body: "One GPU server or Mac Studio in the client's office. A cloud model is only a backup, and only for documents the client allows.",
    },
  ],
  flow: ["Collect and clean", "Label", "Train", "Test against GPT", "Deploy on site", "Run and improve"],
  decisions: [
    {
      title: "Small and specialised beats big and general",
      body: "A 7B model trained on one job outperforms a frontier model that has never seen a rate confirmation, at a hundredth of the cost.",
    },
    {
      title: "Personal data removed first",
      body: "Names, phone numbers and account numbers are masked before training, so the model learns the format, not the people.",
    },
    {
      title: "Every answer has a confidence",
      body: "Low-confidence fields go to a person instead of guessing, and each correction becomes training data for the next version.",
    },
  ],
  stack: ["Qwen 2.5", "Llama", "LoRA", "MLX", "PyTorch", "vLLM", "Ollama", "PostgreSQL"],
  evidence: "",
  problem:
    "Sending every invoice, contract and customer file to an outside AI company is a risk many businesses will not take. General models also get industry paperwork wrong, and the API bill grows with every document.",
  steps: [
    "Thousands of the client's past documents are collected, cleaned, and stripped of personal data.",
    "Each document gets the correct answer for every field, checked by a person, to teach the model.",
    "An open model is fine-tuned with LoRA on that set, on one machine, in a few hours.",
    "The new model is tested on documents it never saw, side by side with GPT, field by field.",
    "It is installed on a server in the client's office and works with no internet connection.",
    "Low-confidence fields go to a person, corrections are saved, and the next version learns from them.",
  ],
  film: "bastion",
};
