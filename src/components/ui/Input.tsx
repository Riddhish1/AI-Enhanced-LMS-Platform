import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="mb-4">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
          </label>
          )}
          
          <input
            ref={ref}
            className={`
            block w-full px-3 py-2 rounded-lg shadow-sm
              border-gray-300 dark:border-gray-600
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-indigo-500
              disabled:opacity-60
            ${error ? 'border-red-300 dark:border-red-700 focus:ring-red-500' : ''}
              ${className}
            `}
            {...props}
          />
        
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;