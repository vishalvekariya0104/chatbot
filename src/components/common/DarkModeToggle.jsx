import { useDarkMode } from '../../hooks/useDarkMode';

export const DarkModeToggle = () => {
    const [isDarkMode, toggleDarkMode] = useDarkMode();

    return (
        <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle dark mode"
        >
            {isDarkMode ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 00-1.414-1.414L12.95 4.536a1 1 0 001.414 1.414l.707-.707zm-7.072 7.072l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zm-2.12-10.607a1 1 0 011.414-1.414L6.05 4.536a1 1 0 01-1.414 1.414l-.707-.707zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM3 11a1 1 0 100-2H2a1 1 0 100 2h1zm9.485 2.121a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 010 1.414zM6.364 13.536a1 1 0 000 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 0zm3.536-7.072l.707-.707a1 1 0 00-1.414-1.414L9.485 6.364a1 1 0 001.414 1.414z" /></svg>
            ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
            )}
        </button>
    );
};