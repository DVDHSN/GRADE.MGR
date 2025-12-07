<div align="center">
  <h1>GRADE.MGR // A Brutalist Academic Command Center</h1>
  <p>
    A minimalist, high-contrast, local-first web application for tracking, analyzing, and optimizing academic performance.
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Google_Gemini-8E75B8?style=for-the-badge&logo=google-gemini&logoColor=white" alt="Google Gemini" />
  </p>
</div>

## Description

**GRADE.MGR** is a comprehensive grade management tool designed with a unique neo-brutalist aesthetic. It provides students with a powerful, offline-first interface to input, visualize, and analyze their academic grades. All data is stored securely in the browser's local storage, ensuring privacy and immediate access without needing an internet connection or an account.

The application features a multi-view dashboard that offers everything from high-level performance metrics to granular, chart-based analytics. Users can track their progress over time, compare performance across academic years, identify at-risk subjects, and even receive AI-powered academic insights and suggestions by leveraging the Google Gemini API.

## Key Features

- ** Brutalist UI/UX:** A high-contrast, minimalist, and keyboard-friendly interface built for focus and efficiency.
- ** Local-First Data Storage:** All grade data and settings are saved directly in your browser's `localStorage`, ensuring 100% privacy and offline functionality.
- ** Interactive Dashboard:** Get an instant overview of your academic status, including average performance, peak scores, at-risk subjects, and a live performance trend line.
- ** In-Depth Analytics:** Dive deep into your data with multiple visualizations:
    - **Grade Histogram:** See the frequency of A, B, C, D, and F grades.
    - **Performance Pie Chart:** Understand the distribution of your grades.
    - **Subject Trend Lines:** Track your performance in each subject over time.
    - **Academic Year Comparison:** Compare average scores across different years or forms.
    - **Skill Radar:** Visualize strengths and weaknesses by comparing midterm vs. final exam performance.
- ** Gemini AI Insights:** Generate a concise, analytical report on your academic patterns, strengths, and areas for improvement using Google's Gemini AI.
- ** Customizable Settings:** Adjust the grading scale thresholds (A, B, C, D) and set a personal target score to tailor the application to your school's system.
- ** Data Portability:** Easily back up all your grade data to a JSON or CSV file, and restore it from a backup at any time.
- ** Full CRUD Functionality:** Add, view, edit, and delete grade entries with ease through a streamlined input form and an editable log of recent entries.

## Tech Stack

- **Frontend:** React, TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (for utility-first CSS)
- **Data Visualization:** Recharts
- **Icons:** Lucide React
- **AI Integration:** Google Gemini AI (`@google/genai`)
- **Markdown Rendering:** React Markdown

## Installation & Setup

To get a local copy up and running, follow these simple steps.

**Prerequisites:**
- Node.js (v18 or later)
- npm, yarn, or pnpm

**Steps:**

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/DVDHSN/GRADE.MGR.git
    cd GRADE.MGR
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    The AI Insights feature requires a Google Gemini API key.
    - Create a file named `.env.local` in the root of the project.
    - Add your API key to this file:
      ```
      GEMINI_API_KEY="YOUR_API_KEY_HERE"
      ```
    > **Note:** The application will still function without an API key, but the "Gemini AI Analysis" feature will not work.

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Usage

Once the application is running, you can start managing your grades:

1.  **Input Grades:** Navigate to the **Input_Log** tab (`PenTool` icon). Fill out the form with the subject, academic form, assessment type, and score, then click "Confirm Entry".
2.  **View Dashboard:** The **Dashboard** (`LayoutGrid` icon) is the default view. It shows your key metrics, a trend chart of your performance over time, and a list of your most recent entries.
3.  **Analyze Performance:** Go to the **Analytics** tab (`PieChart` icon) to see detailed charts and breakdowns of your performance by subject, grade distribution, and more.
4.  **Configure Settings:** In the **Config** tab (`SettingsIcon` icon), you can adjust the grading scale, set your target average score, and manage your data (backup, restore, factory reset).
5.  **Get AI Insights:** In the **Analytics** view, find the "Gemini AI Analysis" card and click "GENERATE REPORT" to receive personalized feedback on your academic data.

## File Structure

Here's a brief overview of the key directories and files:

```
/
├── public/
├── src/
│   ├── components/    # Reusable React components (UI, Charts, Views)
│   ├── services/      # Service for interacting with external APIs (Gemini)
│   ├── App.tsx        # Main application component and state management
│   ├── index.tsx      # Application entry point
│   └── types.ts       # TypeScript type definitions for the project
├── .env.local         # (You create this) For environment variables like API keys
├── index.html         # Main HTML file
├── package.json       # Project dependencies and scripts
└── vite.config.ts     # Vite configuration
```

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

This project is open-source and available under the MIT License.