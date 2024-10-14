import { useEffect } from "react";

export type AlertLevel = "info" | "success" | "warning" | "error";

interface AlertProps {
  level?: AlertLevel;
  position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
  message?: string;
  onClose: () => void;
}

const borderLevelStyles = {
  info: "text-blue-800 border-blue-300 bg-blue-50 dark:text-blue-400 dark:border-blue-800",
  success: "text-green-800 border-green-300 bg-green-50 dark:text-green-400 dark:border-green-800",
  warning: "text-yellow-800 border-yellow-300 bg-yellow-50 dark:text-yellow-300 dark:border-yellow-800",
  error: "text-red-800 border-red-300 bg-red-50 dark:text-red-400 dark:border-red-800",
}

const buttonLevelStyles = {
  info: "bg-blue-50 text-blue-500 focus:ring-blue-400 hover:bg-blue-200 dark:text-blue-300",
  success: "bg-green-50 text-green-500 focus:ring-green-400 hover:bg-green-200 dark:text-green-300",
  warning: "bg-yellow-50 text-yellow-500 focus:ring-yellow-400 hover:bg-yellow-200 dark:text-yellow-300",
  error: "bg-red-50 text-red-500 focus:ring-red-400 hover:bg-red-200 dark:text-red-300",
}

const positionStyles = {
  "top-left": "top-20 left-4",
  "top-center": "top-20 left-1/2 transform -translate-x-1/2",
  "top-right": "top-20 right-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
  "bottom-right": "bottom-4 right-4",
};

const Alert = ({ level = "info", position = "bottom-center", message, onClose }: AlertProps) => {
  useEffect(() => {
    if (!message) {
      onClose();
    }
  }, [message, onClose])

  return (
    <div id="alert-border"
      className={`w-full sm:w-max fixed ${positionStyles[position]} flex items-center p-4 mb-4 border-t-4 dark:bg-gray-800 ${borderLevelStyles[level]}`}
      role="alert">
      <svg className="flex-shrink-0 w-4 h-4"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
      </svg>
      <div className="ms-3 mr-2 text-sm font-medium">
        {message || "..."}
      </div>

      <button type="button"
        className={`ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex items-center justify-center h-8 w-8 ${buttonLevelStyles[level]} dark:bg-gray-800 dark:hover:bg-gray-700`}
        data-dismiss-target="#alert-border"
        aria-label="Close"
        onClick={onClose}>
        <span className="sr-only">Dismiss</span>
        <svg className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14">
          <path stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
        </svg>
      </button>
    </div>
  );
}

export default Alert;
