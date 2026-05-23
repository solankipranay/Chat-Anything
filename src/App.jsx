import { useEffect, useRef, useState } from "react";
import { URL } from "./constants";

import RecentSearch from "./components/RecentSearch";
import QuestionAnswer from "./components/QuestionAnswer";

const App = () => {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState("");
  const scrollToAns = useRef();
  const [loader, setLoader] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const askQuestion = async (queryText) => {
    setIsSidebarOpen(false);
    const activeQuestion =
      typeof queryText === "string" && queryText ? queryText : question;
    if (!activeQuestion) {
      return false;
    }

    try {
      const storedHistory = localStorage.getItem("history");
      let history = [];

      if (storedHistory) {
        history = JSON.parse(storedHistory);
        if (!Array.isArray(history)) {
          history = [];
        }
      }

      const updatedHistory = [
        activeQuestion,
        ...history.filter((h) => h !== activeQuestion),
      ];
      localStorage.setItem("history", JSON.stringify(updatedHistory));
      setRecentHistory(updatedHistory);
    } catch (error) {
      console.log("LocalStorage Error:", error);
      localStorage.removeItem("history");
      setRecentHistory([]);
    }

    const payload = {
      contents: [
        {
          parts: [{ text: activeQuestion }],
        },
      ],
    };

    setLoader(true);
    setQuestion("");
    setSelectedHistory("");

    try {
      let response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      response = await response.json();
      let dataString = response.candidates[0].content.parts[0].text;

      dataString = dataString.split("\n");
      dataString = dataString
        .map((item) => item.trim())
        .filter((item) => item !== "");

      setResult((prevResult) => [
        ...prevResult,
        { type: "q", text: activeQuestion },
        { type: "a", text: dataString },
      ]);

      setTimeout(() => {
        if (scrollToAns.current) {
          scrollToAns.current.scrollTop = scrollToAns.current.scrollHeight;
        }
      }, 500);

      setLoader(false);
    } catch (error) {
      console.log(error);
      setResult((prevResult) => [
        ...prevResult,
        { type: "q", text: activeQuestion },
        {
          type: "a",
          text: ["Something went wrong while fetching the answer."],
        },
      ]);
      setLoader(false);
    }
  };

  const isEnter = (event) => {
    if (event.key === "Enter") {
      askQuestion();
    }
  };

  useEffect(() => {
    if (selectedHistory) {
      setTimeout(() => {
        askQuestion(selectedHistory);
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHistory]);

  useEffect(() => {
    const storedHistory = localStorage.getItem("history");
    if (storedHistory) {
      try {
        const history = JSON.parse(storedHistory);
        if (Array.isArray(history)) {
          setTimeout(() => {
            setRecentHistory(history);
          }, 0);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }, []);

  const [darkMode, setDarkMode] = useState("dark");
  useEffect(() => {
    if (darkMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className={`flex h-screen w-full overflow-hidden ${darkMode === "dark" ? "dark bg-[#212121]" : "bg-white"}`}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? "flex fixed z-30" : "hidden"} md:relative md:flex flex-col w-[260px] bg-gray-50 dark:bg-[#171717] h-full border-r border-gray-200 dark:border-white/10 shrink-0`}>
        <RecentSearch
          recentHistory={recentHistory}
          setRecentHistory={setRecentHistory}
          setSelectedHistory={setSelectedHistory}
        />
        <div className="p-4 mt-auto border-t border-gray-200 dark:border-white/10">
          <select
            onChange={(event) => setDarkMode(event.target.value)}
            className="w-full p-2 bg-transparent text-gray-800 dark:text-white rounded-lg outline-none cursor-pointer"
            value={darkMode}
          >
            <option value="dark" className="bg-white dark:bg-[#2f2f2f] text-gray-800 dark:text-white">Dark Mode</option>
            <option value="light" className="bg-white dark:bg-[#2f2f2f] text-gray-800 dark:text-white">Light Mode</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative max-w-full">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center p-4 border-b border-gray-200 dark:border-white/10 shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 bg-transparent rounded-md text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-[#2f2f2f] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <span className="font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r from-pink-700 to-violet-700 ml-2">Chat-Anything</span>
        </div>

        {/* Chat Area */}
        <div ref={scrollToAns} className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar w-full pb-36">
          {result.length === 0 && !loader ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-3xl md:text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-700 to-violet-700 mb-8">
                Hello User, Ask me Anything
              </h1>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto w-full px-4 pt-6 pb-4">
              <ul className="space-y-6">
                {result.map((item, index) => (
                  <QuestionAnswer key={index} item={item} index={index} />
                ))}
              </ul>
              {loader && (
                <div className="flex justify-center mt-6 w-full">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center mr-4 shrink-0 bg-white dark:bg-[#212121]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-800 dark:text-white"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path></svg>
                    </div>
                    <div className="animate-pulse flex space-x-2 items-center h-8">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Searchbar / Input Area */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white via-white dark:from-[#212121] dark:via-[#212121] to-transparent pt-10 pb-6 px-4">
          <div className="max-w-3xl mx-auto relative flex items-center bg-gray-100 dark:bg-[#2f2f2f] rounded-[26px] pl-4 pr-2 py-2 shadow-sm border border-transparent dark:border-white/10">
            <input
              type="text"
              value={question}
              onKeyDown={isEnter}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1 h-10 bg-transparent outline-none dark:text-white text-gray-800 placeholder-gray-500"
              placeholder="Ask me anything..."
            />
            <button
              onClick={() => askQuestion()}
              disabled={!question.trim() || loader}
              className={`ml-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                question.trim() && !loader
                  ? "bg-black text-white dark:bg-white dark:text-black hover:opacity-80"
                  : "bg-gray-300 text-gray-500 dark:bg-[#676767] dark:text-[#2f2f2f]"
              }`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>
          </div>
          <div className="text-center text-xs text-gray-500 mt-3">
            AI can make mistakes. Check important info.
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
