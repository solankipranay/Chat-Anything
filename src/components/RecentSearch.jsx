

const RecentSearch = ({ recentHistory, setRecentHistory, setSelectedHistory }) => {
  const clearHistory = () => {
    localStorage.removeItem("history");
    setRecentHistory([]);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden text-gray-800 dark:text-white pt-4">
      <div className="flex items-center justify-between px-4 mb-4">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Recent Searches</h2>
        <button onClick={clearHistory} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors" title="Clear history">
          <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-2">
        <ul className="space-y-1">
          {recentHistory && recentHistory.length > 0 ? (
            recentHistory.map((item, index) => (
              <li
                key={index}
                onClick={() => setSelectedHistory(item)}
                className="p-2 px-3 text-sm truncate rounded-lg cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2f2f2f] transition-colors"
              >
                {item}
              </li>
            ))
          ) : (
            <li className="p-2 px-3 text-sm text-gray-400 dark:text-gray-600">
              No recent searches
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default RecentSearch;
