export interface BlogPost {
  slug: string
  title: string
  description: string
  content: string
  date: string
  readTime: string
  authorName: string
  authorLink: string
  tags: string[]
  image?: string
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "google-notebooklm-presentation-slides-guide",
    title: "The Ultimate Guide to Generating Presentation Slides with Google NotebookLM",
    description:
      "Stop spending hours manually formatting slides from your research documents. Here is how to use Google NotebookLM alongside structured visual prompts to generate publication-ready slide decks in minutes.",
    date: "2026-07-22",
    readTime: "6 min read",
    authorName: "Nabil Thange",
    authorLink: "https://nabil-thange.vercel.app/",
    tags: ["NotebookLM", "AI Prompts", "Presentations", "Productivity"],
    content: `
Traditional presentation tools ask you to start with a blank slide. You pick a theme, tweak font sizes, drag text boxes around, and suddenly two hours have passed while your actual message remains unwritten.

Google NotebookLM changed the research synthesis game by allowing you to ground LLMs directly in your personal source files—PDFs, notes, docs, and slide transcripts. But while NotebookLM excels at generating audio overviews and textual summaries, getting structured **visual slide blueprints** out of it requires a different approach.

In this guide, we will break down how to pair NotebookLM with AwesomeLM visual prompt engineering to build presentation decks in a fraction of the time.

## The Problem with Default AI Slide Summaries

If you ask an AI model "Turn this document into a slide deck," you will almost certainly get 10 bullet-heavy slides with generic titles like "Introduction," "Key Takeaways," and "Conclusion."

That is because LLMs default to summarizing text rather than **structuring visual hierarchy**. 

Slide presentations require visual contrast:
- One core message per slide.
- Action headlines instead of topic labels.
- Clear structural layout patterns (grids, timelines, data callouts, comparison cards).

## Step 1: Upload and Ground Your Sources

Before asking for slides, upload all relevant project documentation to your NotebookLM notebook:
1. Product specs, technical architecture papers, or market research PDFs.
2. Raw meeting notes or executive outlines.
3. Transcripts of user interviews or team presentations.

NotebookLM creates a grounded context index, ensuring that all factual claims and numbers in your slides stay strictly faithful to your original data.

## Step 2: Apply a Structured Visual Prompt

Instead of generic prompts, use an architectural prompt template from the [AwesomeLM Treasury](https://awesomelm.app/treasure). 

Here is an example prompt structure designed for NotebookLM:

\`\`\`markdown
Act as a Principal Presentation Architect. Analyze the grounded sources in this notebook and construct a 6-slide executive deck outline.

Enforce the following layout rules for every slide:
1. Headline: Write an action-driven headline (max 10 words) expressing the key strategic decision.
2. Visual Framework: Specify the exact layout type (e.g. 2x2 Matrix, 3-Column Feature Cards, Metric Highlight + Caption).
3. Data Callouts: Highlight numbers or key stats in bold [BOXED] metrics.
4. Speaker Notes: Provide 2 concise sentences explaining the strategic rationale.
\`\`\`

## Step 3: Move from Outline to Visual Render

Once NotebookLM generates the structured markdown outline, you can import the outline directly into PowerPoint, Google Slides, or modern AI slide builders.

By separating the **narrative structure** (handled by NotebookLM) from the **visual layout constraint** (handled by AwesomeLM prompts), you eliminate blank-slide anxiety and produce presentation decks that communicate with maximum impact.

---

### Further Reading & Resources
- Explore curated prompt blueprints on [AwesomeLM Treasury](https://awesomelm.app/treasure)
- Discover more technical articles on [Nabil Thange's Portfolio](https://nabil-thange.vercel.app/) and [Developer Blog](https://nabil-thange.vercel.app/blog)
- Install the open-source [AwesomeLM Chrome Extension](https://github.com/NabilThange/AwesomeLM-Extension)
`,
  },
  {
    slug: "why-templates-fail-visual-prompts-win",
    title: "Why Templates Fail and Visual Prompts Win: A Presentation Design Blueprint",
    description:
      "Downloadable slide templates force your content into rigid, arbitrary boxes. Learn why AI visual prompts are replacing static PowerPoint templates and how to build responsive slide layouts.",
    date: "2026-07-21",
    readTime: "5 min read",
    authorName: "Nabil Thange",
    authorLink: "https://nabil-thange.vercel.app/",
    tags: ["Design System", "PowerPoint", "Prompts", "UI/UX"],
    content: `
We have all been there. You download a sleek 50-slide PowerPoint template with gorgeous gradients and polished stock photography. You open it up, feeling confident.

Then you try to put your actual content into it.

Suddenly, your 4-step workflow doesn't fit the 3-circle diagram in the template. Your detailed metric analysis gets squished into a tiny placeholder font. You spend 45 minutes ungrouping vector shapes, adjusting line heights, and fixing broken alignment.

By the end, your deck looks broken, and you have wasted an entire afternoon.

## The Flaw of Static Templates

Templates are **static artifacts**. They assume a fixed quantity of text, fixed column widths, and arbitrary visual elements chosen by a graphic designer who has no idea what your presentation is about.

Static templates fail because:
1. **Content Mismatch**: Real content rarely matches placeholder text length.
2. **Design Debt**: Customizing templates introduces inconsistent spacing and typography.
3. **Generic Aesthetic**: Every team using the same popular template ends up looking identical.

## The Rise of Visual Prompts

Visual prompts take the opposite approach. Instead of prescribing rigid coordinates, a visual prompt acts as a **dynamic design system constraint**.

When you pass a visual prompt to an AI model like Claude 3.5 Sonnet, ChatGPT, or NotebookLM alongside your topic notes, the model understands both the **semantic meaning** of your content and the **geometric rules** of visual design.

If you have 3 key metrics, the prompt instructs the LLM to format a 3-column dashboard. If you have 5 sequential milestones, it automatically constructs a 5-stage horizontal roadmap.

## Anatomy of a High-Impact Visual Prompt

A great visual prompt contains four essential layers:

1. **Role & Intent**: Sets the perspective (e.g. "Principal Product Designer preparing a board deck").
2. **Layout Topology**: Defines structural shapes (Grid, Metric Split, Comparison Columns).
3. **Typographic Hierarchy**: Establishes contrast (Bold H1 action headers, muted body text).
4. **Constraint Boundaries**: Restricts character counts to prevent text bloat.

At [AwesomeLM](https://awesomelm.app/), we curate free prompt templates that enforce these design boundaries out of the box.

---

### Build Better Decks Faster
- Browse our collection of curated visual prompts at [AwesomeLM Gallery](https://awesomelm.app/treasure)
- Read more about frontend architecture and design systems on [Nabil Thange's Blog](https://nabil-thange.vercel.app/blog)
`,
  },
  {
    slug: "prompt-engineering-for-powerpoint-keynote",
    title: "Prompt Engineering for PowerPoint & Keynote: Turn Outlines into Visual Decks",
    description:
      "Master the art of prompt engineering specifically tailored for presentation slides. Turn raw bullet points into visually compelling decks for PowerPoint, Keynote, and Google Slides.",
    date: "2026-07-20",
    readTime: "7 min read",
    authorName: "Nabil Thange",
    authorLink: "https://nabil-thange.vercel.app/",
    tags: ["Prompt Engineering", "PowerPoint", "Keynote", "AI"],
    content: `
Prompt engineering is usually discussed in the context of writing code, drafting emails, or generating images. But prompt engineering for **presentation design** requires a specific set of rules.

A presentation slide is not an essay. It is a visual communication artifact meant to be processed by a human audience in under 5 seconds per slide.

In this deep dive, we explore how to write prompt instructions that turn raw text outlines into executive-ready slides for PowerPoint and Keynote.

## Rule 1: Enforce Action Titles Over Topic Headers

The single biggest mistake in presentation slides is using passive topic headers like "Market Overview" or "Financial Update."

When engineering prompts for slide generation, instruct the LLM:

> "Rewrite all slide titles as active strategic assertions. Instead of 'Market Overview', write 'Enterprise Cloud Market Growing 35% Year-Over-Year'."

This forces the AI to extract the core insight and display it prominently at the top of the slide.

## Rule 2: Limit Text Density with Character Constraints

LLMs naturally love to write long, verbose paragraphs. That is fatal for presentation slides.

Include strict character and word caps directly in your prompt:
- **Slide Title**: Max 12 words.
- **Key Takeaways**: Max 3 bullet points per slide.
- **Bullet Length**: Max 15 words per bullet.

## Rule 3: Use Markdown Tables and Cards for Visual Structure

Instead of plain bullet lists, ask the AI to render content using Markdown tables or visual card blocks:

\`\`\`markdown
| Pillar | Focus Area | Key Metric |
| :--- | :--- | :--- |
| **Performance** | Core Web Vitals | TTFB < 100ms |
| **Security** | RLS Policies | 100% Audit Passed |
| **Scalability** | Global Edge CDN | 99.99% Uptime |
\`\`\`

Most AI slide tools and modern markdown presentation frameworks convert Markdown tables and blockquotes into multi-column cards automatically.

---

### Resources & Author Credits
- Try pre-tested presentation prompts on [AwesomeLM](https://awesomelm.app/treasure)
- Learn more about developer tools on [Nabil Thange's Portfolio](https://nabil-thange.vercel.app/)
`,
  },
  {
    slug: "from-blank-slide-to-pitch-deck-in-10-minutes",
    title: "From Blank Slide to Finished Pitch Deck in 10 Minutes with AI Prompts",
    description:
      "A step-by-step workflow for founders and product leaders to build investor-grade pitch decks in 10 minutes using open-source visual prompts.",
    date: "2026-07-19",
    readTime: "5 min read",
    authorName: "Nabil Thange",
    authorLink: "https://nabil-thange.vercel.app/",
    tags: ["Pitch Deck", "Startups", "AI Prompts", "Guide"],
    content: `
Building a pitch deck is one of the most stressful tasks for startup founders and product leads. You have to distill months of hard work, financial modeling, and product strategy into 10 clear slides.

Here is a 10-minute battle-tested workflow using AwesomeLM prompts to create a pitch deck from scratch.

## Minute 0-3: The Raw Dump

Don't worry about formatting or design. Write down your raw facts in bullet points:
- The problem you solve.
- Your solution and secret sauce.
- Target market size (TAM/SAM/SOM).
- Traction & metrics.
- Business model and unit economics.
- The team & competition.
- The ask (funding required).

## Minute 3-6: The Prompt Transformation

Head over to [AwesomeLM](https://awesomelm.app/treasure) and grab the **Startup Pitch Deck Blueprint** prompt. Paste your raw dump into ChatGPT, Claude, or Google NotebookLM along with the prompt.

The prompt automatically structures your dump into a standard 10-slide narrative arc:
1. **Title**: Memorable tagline + vision.
2. **Problem**: Customer pain point highlighted with a stat card.
3. **Solution**: Product capabilities arranged in a 3-pillar grid.
4. **Market Opportunity**: TAM/SAM/SOM breakdown.
5. **Product Demo / Screenshots**: Visual frame placeholders.
6. **Traction**: Growth chart indicators.
7. **Business Model**: Monetization channels.
8. **Competitive Advantage**: 2x2 Positioning Matrix.
9. **Team**: Leadership bios.
10. **The Ask**: Use of funds breakdown.

## Minute 6-10: Polishing and Exporting

Copy the generated structure into your favorite slide builder (PowerPoint, Google Slides, Pitch, or Canva). Swap in your actual screenshots and metrics.

You are done in 10 minutes—with zero time wasted battling blank screens.

---

### Explore AwesomeLM
- Access 100% free prompt templates on [AwesomeLM Treasury](https://awesomelm.app/treasure)
- Created by [Nabil Thange](https://nabil-thange.vercel.app/) — Developer & Creator of AwesomeLM
`,
  },
]

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug)
}
