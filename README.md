<div align="center">
  <h1 align="center">GRADE.MGR</h1>
  <p align="center">
    A minimalist, brutalist-inspired dashboard for tracking and analyzing academic grades.
  </p>
  <p align="center">
    <a href="#key-features">Key Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#installation--setup">Installation</a> •
    <a href="#usage">Usage</a>
  </p>
</div>

---

## Description

**GRADE.MGR** is a sleek, client-side web application designed for students to meticulously track and analyze their academic performance. With a distinctive brutalist-inspired UI, it provides a high-contrast, focused environment for managing grades.

The application leverages powerful data visualizations to reveal trends, identify strengths and weaknesses, and track progress towards academic goals. All data is stored locally in your browser's `localStorage`, ensuring complete user privacy and fast, offline-first access. A key feature is the integration with **Google's Gemini AI** to provide personalized academic insights and actionable feedback.

## Key Features

-   **Intuitive Grade Entry**: Log new grades with details like subject, assessment type (Midterm, Final, Quiz), score, and academic year. Supports both a predefined subject list and custom entries.
-   **Dynamic Dashboard**: Get an at-a-glance overview of your academic health, including your current average vs. a customizable target, a clear pass/fail indicator, and a trendline of your performance over time.
-   **Smart Insights & Alerts**: The dashboard automatically highlights subjects where you've shown improvement and flags subjects in the "Risk Radar" that require immediate attention.
-   **In-Depth Analytics Suite**: Dive deeper into your data with comprehensive charts:
    -   **Grade Histogram**: Visualize the frequency of each letter grade (A, B, C, etc.).
    -   **Pie Chart**: See the percentage distribution of your grade bands.
    -   **Year-over-Year Comparison**: Compare your performance across different academic years.
    -   **Subject Skill Radar**: Analyze your proficiency in different subjects by comparing Midterm vs. Final exam scores.
-   **Gemini AI Analysis**: Generate a personalized academic report with a single click. The AI analyzes your grade patterns to provide constructive feedback and suggest areas for improvement.
-   **Customizable System**: Tailor the application to your school's standards by adjusting grading thresholds (e.g., min score for an 'A') and setting personal academic target scores.
-   **Local Data Management**: Export your complete grade history to JSON or CSV for backup, and import from a JSON file to restore your data.

## Tech Stack

-   **Frontend**: React, TypeScript
-   **Build Tool**: Vite
-   **Styling**: Tailwind CSS (via CDN)
-   **Data Visualization**: Recharts
-   **Icons**: Lucide React
-   **AI**: Google Gemini API (`@google/genai`)
-   **Markdown Rendering**: `react-markdown`

## Installation & Setup

Follow these steps to get the project running on your local machine.

**Prerequisites:**
-   Node.js (v18 or later)
-   npm or a compatible package manager
-   A [Google Gemini API Key](https://ai.google.dev/)

**Steps:**

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/DVDHSN/GRADE.MGR.git
    cd GRADE.MGR
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a new file named `.env` in the root of the project and add your Gemini API key:
    ```
    GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Usage

After starting the development server, open the application in your browser.

1.  **Navigate using the sidebar:**
    -   **Input Protocol**: Start by adding your grades here. Fill in the subject, year, assessment type, and score.
    -   **Dashboard**: View your primary statistics, recent grades, and motivational insights.
    -   **Analytics**: Explore detailed charts and breakdowns of your performance.
    -   **System Config**: Adjust grading thresholds, set your target score, and manage your data (import/export).

2.  **Generate AI Insights**:
    On the **Analytics** page, you'll find the **Gemini AI Analysis** card. Click `GENERATE REPORT` to send your grade data to the Gemini API and receive a personalized performance summary with actionable advice.

## File Structure

Here is an overview of the key files and directories in the project:

```
/
├── src/
│   ├── components/      # UI Components (Dashboard, Analytics, Charts, etc.)
│   ├── services/        # External API services (geminiService.ts)
│   ├── App.tsx          # Main application layout and view router
│   ├── index.tsx        # React root entry point
│   └── types.ts         # TypeScript type definitions for the application
├── index.html           # Main HTML file with CDN links
├── package.json         # Project dependencies and scripts
└── vite.config.ts       # Vite build tool configuration
```

## Contributing

Contributions are welcome! If you'd like to help improve GRADE.MGR, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes and commit them (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/your-feature-name`).
5.  Open a Pull Request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
```
