import React from 'react';
import { Modal } from './UI';
import { LayoutGrid, PieChart, PenTool, Settings } from 'lucide-react';

interface HelpSystemProps {
  view: 'dashboard' | 'analytics' | 'input' | 'settings';
  isOpen: boolean;
  onClose: () => void;
}

export const HelpSystem: React.FC<HelpSystemProps> = ({ view, isOpen, onClose }) => {
  const getContent = () => {
    switch (view) {
      case 'dashboard':
        return (
          <div className="flex flex-col gap-4">
            <p>The Dashboard provides a real-time overview of your academic standing.</p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li><strong className="text-white">Goal Tracker:</strong> Visualizes your current average vs your target goal.</li>
              <li><strong className="text-white">Pass/Fail Status:</strong> Indicates if your average is above the passing threshold (D).</li>
              <li><strong className="text-white">Insights & Alerts:</strong> Shows subject improvements and warnings for at-risk subjects.</li>
              <li><strong className="text-white">Recent Logs:</strong> A quick history of your latest grade entries.</li>
            </ul>
          </div>
        );
      case 'analytics':
        return (
          <div className="flex flex-col gap-4">
            <p>Deep dive into your performance data to identify trends and patterns.</p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li><strong className="text-white">Grade Distribution:</strong> A bar chart showing count of grades by type (A, B, C...).</li>
              <li><strong className="text-white">Band Distribution:</strong> A pie chart showing the percentage breakdown of your letter grades.</li>
              <li><strong className="text-white">Year/Form Comparison:</strong> Compare your average performance across different academic years (e.g., Form 4 vs Form 5).</li>
              <li><strong className="text-white">Skill Radar:</strong> Compares Midterm vs Final performance for your top subjects.</li>
            </ul>
          </div>
        );
      case 'input':
        return (
          <div className="flex flex-col gap-4">
            <p>Use the Input Protocol to record new assessment data.</p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li><strong className="text-white">Subject Selection:</strong> Choose from standard subjects or select "(Custom)" to type your own.</li>
              <li><strong className="text-white">Weights:</strong> Currently, all grades are treated equally in average calculations.</li>
              <li><strong className="text-white">Accuracy:</strong> Ensure you select the correct Academic Year to enable accurate year-over-year comparisons.</li>
            </ul>
          </div>
        );
      case 'settings':
        return (
          <div className="flex flex-col gap-4">
            <p>Configure the system to match your school's grading standards.</p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li><strong className="text-white">Thresholds:</strong> Adjust the minimum score required for each letter grade (A, B, C, D). Scores below D are considered Failing (F).</li>
              <li><strong className="text-white">Target Goal:</strong> Set your desired overall average percentage.</li>
              <li><strong className="text-white">Data Management:</strong> Backup your data to JSON or restore from a previous backup.</li>
            </ul>
          </div>
        );
      default:
        return <p>System help not available for this view.</p>;
    }
  };

  const getTitle = () => {
    switch (view) {
      case 'dashboard': return 'Dashboard Overview';
      case 'analytics': return 'Analytics & Trends';
      case 'input': return 'Data Entry Guide';
      case 'settings': return 'System Configuration';
      default: return 'System Help';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()}>
      {getContent()}
    </Modal>
  );
};