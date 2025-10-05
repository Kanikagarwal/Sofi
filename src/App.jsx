import { useState, useEffect, useRef } from "react";
import { URL } from "./constants";
import Message from "./components/Message";
import User from "./components/User";
import Sofi from './assets/sofi.png';

function App() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState([]);
  const [history, setHistory] = useState([]);
  const [highlight, setHighlight] = useState(null);
  const [highlightCheck, setHighlightCheck] = useState(false);
  const chatEndRef = useRef(null);
  const HighlightRef = useRef(null);
  const [user, setUser] = useState(null);


   useEffect(() => {
    const savedUser = localStorage.getItem("User");
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

   const handleUserSubmit = (name) => {
    localStorage.setItem("User", name);
    setUser(name);
  };


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({behavior:"smooth"});
  }, [result])

  useEffect(() => {
    HighlightRef.current?.scrollIntoView({behavior:"smooth"});
  }, [highlight])
  let payload = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  };

useEffect(() => {
  if (highlight !== null) {
    setHighlightCheck(true); // start blinking
    const interval = setInterval(() => {
      setHighlightCheck((prev) => !prev);
    }, 500);

    const timeout = setTimeout(() => {
      clearInterval(interval); // stop blinking after 3 seconds
      setHighlightCheck(false);
      setHighlight(null); // optional: remove highlight
    }, 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }
}, [highlight]);


  const seeHistoryHighlight = (historyIdx) => {
  const questionIndex = result.findIndex(
    (item) => item.type === "q" && item.text === history[historyIdx]
  );
  if (questionIndex !== -1) setHighlight(questionIndex);
};


  const askPrompt = async () => {
    // setMessage(prompt);
    if (!prompt || prompt.trim() === "") {
    return;
  }
    let response = await fetch(URL, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    response = await response.json();
    let answer = response.candidates[0]["content"]["parts"][0]["text"];
    answer = answer.split("* ");
    answer = answer.map((item) => item.trim());
    setResult([
      ...result,
      { type: "q", text: prompt },
      { type: "a", text: answer },
    ]);
    setHistory([...history, prompt]);

    setPrompt("");
  };

  const revert = async()=>{
    setResult([]);
    setHistory([])
    setHighlight(null);
    setHighlightCheck(false);
    setPrompt("");

  }
  // console.log(result);
if (!user) {
    // If user not found, show User.jsx
    return <User onSubmit={handleUserSubmit} />;
  }
  return (
    <>
      <div className="sm:grid grid-cols-5 h-screen text-center overflow-y-hidden">
        <div className="hidden col-span-1 bg-zinc-800 sm:grid sm:grid-rows-4 h-full">
          {/* SIDEBAR */}
          <div className="row-span-1">
            <img src={Sofi} className="h-12 sm:h-24" alt="" />
            <h2 className=" cursor-pointer text-white hover:bg-zinc-700 text-left bg-zinc-800 padding border-b border-zinc-700 padding" onClick={revert}>New Chat <i className="fa fa-pencil" aria-hidden="true"></i></h2>
          </div>
          <ul className="list-none row-span-3 overflow-y-scroll scrollbar-hide">
            {history &&
              history.map((item, idx) => (
                <li
                  key={idx}
                  onClick={(e) => seeHistoryHighlight(idx)}
                  className="cursor-pointer text-white hover:bg-zinc-700 text-left bg-zinc-600 padding border-b border-zinc-700"
                >
                  {idx + 1}. {item}
                </li>
              ))}
          </ul>
        </div>
        <div className="col-span-4 ">
          <div className="h-[10%] text-center sticky">
            <h1 className="w-full text-pink-400 text-center text-3xl sm:text-4xl md:text-4xl lg:text-5xl margin-heading">
  Hello {user}, Ask Me Anything
</h1>

          </div>
          <div className="container h-[75vh] overflow-y-scroll scrollbar-hide">
            <div className=" text-zinc-300 contain">
              {result.map((item, index) => (
                <div
                  key={index}
                  className={item.type == "q" ? "flex justify-end" : ""}
                >
                  {item.type == "q" ? (
                    <li
                    ref={highlight === index ? HighlightRef : null}
                      key={index}
                      className={`w-fit text-right sm:text-lg border-5 bg-zinc-700 padding-2 sm:padding margin-list list-none border-zinc-700 rounded-3xl rounded-tr-sm ${
                        highlight === index
                          ? highlightCheck
                            ? "bg-zinc-800 border border-zinc-800"
                            : "bg-zinc-700"
                          : "bg-zinc-700 text-gray-300"
                      }`}
                    >
                      <Message
                        ans={item.text}
                        idx={index}
                        totalResult={1}
                        type={item.type}
                      />
                    </li>
                  ) : (
                    item.text.map((i, idx) => (
                      <li
                        key={idx}
                        className="text-left list-style list-none"
                      >
                        <Message
                          ans={i}
                          idx={idx}
                          totalResult={item.text.length}
                          type={item.type}
                        />
                      </li>
                    ))
                  )}
                </div>
              ))}
              {/* {result &&
                result.map((item, index) => (
                  <li key={index+Math.random()} className="text-left padding list-none">
                    <Message ans={item} idx={index} totalResult={result.length} />
                  </li>
                ))} */}
                <div ref={chatEndRef}></div>
            </div>
          </div>
          <div className=" flex justify-center">

          <div className="input margin padding bg-zinc-800 h-[10%] w-full sm:w-1/2 text-white border border-pink-400 rounded-3xl flex items-center shadow-lg">
            <input
              className="w-full padding bg-transparent text-white px-3 outline-none placeholder-gray-400"
              type="text"
              value={prompt}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  askPrompt();
                }
              }}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Ask me anything"
            />
            <button
              className="padding border border-zinc-600 bg-zinc-600 rounded-full w-[40px] h-[40px] flex justify-center items-center cursor-pointer hover:bg-zinc-700 hover:border-zinc-700"
              onClick={() => askPrompt()}
            >
              <i className="fa fa-paper-plane" aria-hidden="true"></i>
            </button>
          </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
