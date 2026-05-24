
import Answers from './Answers'

const QuestionAnswer = ({ item, index }) => {
  return (
    <div className={`flex w-full ${item.type === "q" ? "justify-end" : "justify-start"}`}>
      {item.type === "q" ? (
        <div className="max-w-[85%] md:max-w-[75%] bg-gray-100 dark:bg-[#2f2f2f] text-gray-800 dark:text-white px-5 py-3 rounded-[24px] rounded-br-md">
          <Answers
            ans={item.text}
            totalResult={1}
            index={index}
            type={item.type}
          />
        </div>
      ) : item.type === "error" ? (
        <div className="w-full max-w-full text-gray-800 dark:text-gray-100 pr-4">
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full border border-red-300 dark:border-red-900 flex items-center justify-center mr-4 shrink-0 bg-red-50 dark:bg-red-950/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-red-600 dark:text-red-400">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="9.01" x2="12" y2="9.01"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <div className="flex-1 bg-red-50/30 dark:bg-red-950/10 border border-red-100/80 dark:border-red-900/30 rounded-2xl p-4 space-y-3">
              <div className="text-sm text-red-800 dark:text-red-300 font-medium">
                {item.text.map((ansItem, ansIndex) => (
                  <p key={`err-${index}-${ansIndex}`}>{ansItem}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-full text-gray-800 dark:text-gray-100 pr-4">
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center mr-4 shrink-0 bg-white dark:bg-[#212121]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-800 dark:text-white">
                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
              </svg>
            </div>
            <div className="flex-1 space-y-4 pt-1 overflow-hidden">
              {item.text.map((ansItem, ansIndex) => (
                <div key={`a-${index}-${ansIndex}`} className="prose dark:prose-invert max-w-none text-left break-words">
                  <Answers
                    ans={ansItem}
                    totalResult={item.text?.length || 0}
                    index={ansIndex}
                    type={item.type}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuestionAnswer