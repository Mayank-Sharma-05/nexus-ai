<div align="center">

  <img src="https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Gemini_API-1.13-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini API">

  <h1 align="center">⚡ Nexus AI</h1>
  <p align="center">One AI. Unlimited Creation.</p>
  
  <p align="center">
    <em>The autonomous unified AI platform for websites, portfolios, conversational AI, ATS resume scoring, and enterprise document RAG.</em>
  </p>

  <p align="center">
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#installation">Installation</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#contributing">Contributing</a>
  </p>

</div>

---

## 🌟 Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Chat Assistant** | Real-time conversational AI with streaming responses powered by Gemini API |
| 🌐 **AI Website Generator** | Generate full-stack websites from natural language prompts with AI-powered code generation |
| 🎨 **AI Portfolio Builder** | Create stunning portfolios with AI autofill, multiple themes (Cyber, Minimal, Terminal), and export options (ZIP, HTML, PDF) |
| 📄 **Resume Analyzer** | ATS scoring system with keyword matching, impact metrics detection, formatting checks, and AI-powered suggestions |
| 📚 **RAG Knowledge Base** | Upload documents (PDF, DOCX, TXT, Images), perform semantic search with pgvector, and get grounded AI responses |
| 📊 **Dashboard** | Real-time analytics, project management, usage metrics, and cost tracking |
| 🔐 **Authentication** | Secure authentication with Clerk, role-based access control, and admin management |

---

## 📸 Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### AI Chat
![AI Chat](./screenshots/chat.png)

### Resume Analyzer
![Resume Analyzer](./screenshots/resume.png)

### RAG Knowledge Base
![RAG](./screenshots/rag.png)

### Portfolio Builder
![Portfolio](./screenshots/portfolio.png)

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15.5 (App Router)
- **Language**: TypeScript 5.6
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Shadcn UI, Lucide Icons
- **Authentication**: Clerk 6.0
- **State Management**: React Hooks, Server Components

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: PostgreSQL 16 with pgvector extension
- **ORM**: Prisma 5.22
- **File Processing**: pdf-parse, mammoth, tesseract.js

### AI & ML
- **LLM**: Google Gemini API 1.13
- **Embeddings**: OpenAI text-embedding-3-small
- **Vector Search**: pgvector with HNSW cosine similarity
- **OCR**: Tesseract.js 7.0

### Infrastructure
- **Deployment**: Vercel
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Environment**: Node.js 20+

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Chat    │  │ Websites │  │ Portfolios│  │ Resumes  │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                     │
│  │   RAG    │  │ Dashboard│  │  Admin   │                     │
│  └──────────┘  └──────────┘  └──────────┘                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API Layer                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           Next.js API Routes (Serverless)               │   │
│  │  /api/v1/chat  /api/v1/files/parse  /api/v1/rag/query  │   │
│  │  /api/v1/resumes/analyze  /api/v1/portfolios/autofill   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Service Layer                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ Gemini   │  │ OpenAI   │  │ File     │  │ Resume   │      │
│  │   API    │  │ Embeddings│  │ Parser   │  │ Analyzer │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Data Layer                               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              PostgreSQL + pgvector (Supabase)              │   │
│  │  Users | Projects | Documents | Chunks | ResumeAnalysis  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Installation

### Prerequisites

- Node.js 20+ 
- PostgreSQL 16+ with pgvector extension
- npm or yarn or pnpm

### Clone the Repository

```bash
git clone https://github.com/Mayank-Sharma-05/nexus-ai.git
cd nexus-ai
```

### Install Dependencies

```bash
npm install
```

### Database Setup

```bash
# Install Prisma CLI globally (if not already installed)
npm install -g prisma

# Generate Prisma Client
npm run prisma:generate

# Push database schema
npm run prisma:push

# (Optional) Seed database with sample data
npm run prisma:seed
```

---

## 🔑 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Google Gemini API
GOOGLE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# OpenAI API (for embeddings)
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Database (Supabase)
DATABASE_URL=postgresql://user:password@host:5432/database

# Stripe (optional, for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=your_stripe_secret_key
```

---

## 🚀 Running Locally

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
nexus-ai/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Authentication pages
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   ├── (dashboard)/         # Protected dashboard pages
│   │   │   ├── chat/
│   │   │   ├── resumes/
│   │   │   ├── rag/
│   │   │   ├── portfolios/
│   │   │   ├── dashboard/
│   │   │   ├── workspace/
│   │   │   ├── admin/
│   │   │   └── settings/
│   │   ├── api/                 # API routes
│   │   │   └── v1/
│   │   │       ├── chat/
│   │   │       ├── files/
│   │   │       ├── resumes/
│   │   │       ├── rag/
│   │   │       ├── portfolios/
│   │   │       ├── analytics/
│   │   │       └── admin/
│   │   ├── layout.tsx           # Root layout with ClerkProvider
│   │   ├── page.tsx             # Landing page
│   │   └── globals.css          # Global styles
│   ├── components/              # Reusable components
│   ├── lib/                     # Utility libraries
│   │   ├── ai/                  # AI integrations
│   │   │   ├── resumeAnalyzer.ts
│   │   │   ├── websiteGenerator.ts
│   │   │   └── portfolioAutofill.ts
│   │   ├── parsers/             # File parsers
│   │   │   └── fileParser.ts
│   │   └── db.ts                # Prisma client
│   └── middleware.ts            # Clerk middleware
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Database seed
├── public/                      # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

---

## 🔌 API Architecture

### File Parsing API
```
POST /api/v1/files/parse
Content-Type: application/json

Request:
{
  "fileName": "document.pdf",
  "fileBuffer": [0, 1, 2, ...]
}

Response:
{
  "success": true,
  "data": {
    "text": "Extracted text content..."
  }
}
```

### Resume Analysis API
```
POST /api/v1/resumes/analyze
Content-Type: application/json

Request:
{
  "text": "Resume content...",
  "jobDescription": "Optional job description..."
}

Response:
{
  "success": true,
  "data": {
    "atsScore": 88,
    "keywordScore": 85,
    "impactScore": 90,
    "formattingScore": 87,
    "skillsScore": 89,
    "suggestions": ["..."]
  }
}
```

### RAG Query API
```
POST /api/v1/rag/query
Content-Type: application/json

Request:
{
  "query": "What is the architecture?"
}

Response:
{
  "success": true,
  "data": {
    "answer": "The architecture consists of...",
    "sources": [
      {
        "chunk": "...",
        "confidence": 0.95
      }
    ]
  }
}
```

---

## 🔄 RAG Workflow

```
1. Document Upload
   ↓
2. File Parsing (PDF/DOCX/TXT/Image OCR)
   ↓
3. Text Chunking (500-1000 tokens)
   ↓
4. Embedding Generation (OpenAI text-embedding-3-small)
   ↓
5. Vector Storage (pgvector with 768 dimensions)
   ↓
6. Query Processing
   ↓
7. Query Embedding
   ↓
8. Similarity Search (HNSW cosine distance)
   ↓
9. Context Retrieval (Top-K chunks)
   ↓
10. AI Response Generation (Gemini with retrieved context)
```

---

## 🗺 Future Roadmap

- [ ] Multi-language support
- [ ] Real-time collaboration
- [ ] Advanced analytics dashboard
- [ ] Custom AI model fine-tuning
- [ ] Mobile app (React Native)
- [ ] API rate limiting and quotas
- [ ] Webhook integrations
- [ ] Advanced document processing (tables, charts)
- [ ] Voice input/output
- [ ] Team workspaces
- [ ] SSO integration (Okta, Auth0)
- [ ] Audit logs and compliance

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Mayank Sharma**

- [GitHub](https://github.com/Mayank-Sharma-05)
- [LinkedIn](https://linkedin.com/in/mayank-sharma-05)

<div align="center">

Made with ⚡ by Nexus AI

</div>
