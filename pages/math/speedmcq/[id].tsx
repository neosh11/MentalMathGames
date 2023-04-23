import Head from "next/head";
import { Inter } from "next/font/google";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const generateQuestionsInteger = (n) => {
  const newQuestions = [];
  for (let i = 0; i < 80; i++) {
    const l1 = Math.floor(Math.random() * 100);
    const l2 = Math.floor(Math.random() * 100);
    const operation = Math.random() > 0.5 ? "+" : "-";
    const l3 = operation === "+" ? l1 + l2 : l1 - l2;

    // delete one of l1, l2, l3 randomly
    const deleteOne = Math.floor(Math.random() * 3);
    const l1_ = deleteOne === 0 ? undefined : l1.toString();
    const l2_ = deleteOne === 1 ? undefined : l2.toString();
    const l3_ = deleteOne === 2 ? undefined : l3.toString();

    // answer /options  basically which one was deleted
    const answer = deleteOne === 0 ? l1 : deleteOne === 1 ? l2 : l3;

    // options are numbers close to answer with some randomness, and only 1 option is correct with no 2 options being same
    const options = [answer];
    for (let j = 0; j < 3; j++) {
      let option = answer + Math.floor(Math.random() * 10) - 5;
      while (options.includes(option)) {
        option = answer + Math.floor(Math.random() * 10) - 5;
      }
      options.push(option);
    }
    // shuffle options
    for (let j = 0; j < 4; j++) {
      const i1 = Math.floor(Math.random() * 4);
      const i2 = Math.floor(Math.random() * 4);
      const temp = options[i1];
      options[i1] = options[i2];
      options[i2] = temp;
    }

    const [option1, option2, option3, option4] = options;

    newQuestions.push({
      l1: l1_,
      l2: l2_,
      l3: l3_,
      operation,
      option1,
      option2,
      option3,
      option4,
      answer,
    });
  }
  return newQuestions;
};

// Component to deal with not started
function NotStarted({ onStart }) {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* a button to start */}
      <button
        onClick={() => onStart()}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Start
      </button>
    </div>
  );
}

const DisplayQuestionNM = ({
  question,
  onAnswer,
}: {
  question: Question;
  onAnswer;
}) => {
  const { l1, l2, l3, operation, option1, option2, option3, option4, answer } =
    question;
  return (
    <div>
      <div className="text-2xl">
        {l1 || "?"} {operation} {l2 || "?"} = {l3 || "?"}
      </div>

      {/* display buttons to select options */}
      <div className="flex flex-col gap-y-2 items-center justify-center">
        {[option1, option2, option3, option4].map((option, i) => (
          <button
            key={option + i.toString()}
            onClick={() => {
              onAnswer(option, answer);
            }}
            className="bg-blue-500 hover:bg-blue-700 w-full text-white font-bold py-2 px-4 rounded"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

const DisplayQuestion = React.memo(DisplayQuestionNM, (prev, next) => {
  return prev.question === next.question && prev.onAnswer === next.onAnswer;
});

const Started = ({ testState, questions, setTestState, timeAllowed }) => {
  const { question, score } = testState;
  const { l1, l2, l3, operation, option1, option2, option3, option4, answer } =
    questions[question];
  const [timeLeft, setTimeLeft] = useState(timeAllowed);
  const [flashClass, setFlashClass] = useState("");

  useEffect(() => {
    // Update the timer every second
    const timer = setInterval(() => {
      setTimeLeft((timeLeft) => timeLeft - 1);
    }, 1000);

    // End the test when the timer reaches 0
    if (timeLeft <= 0) {
      // save all the wrong answers

      setTestState({ ...testState, started: "done" });
      clearInterval(timer);
    }

    // Cleanup the timer when the component is unmounted or the test ends
    return () => {
      clearInterval(timer);
    };
  }, [timeLeft, setTestState, testState]);

  // Format remaining time display
  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const onAnswer = (option: any, ans: any) => {
    if (option === ans) {
      // right answer selected
      setTestState({
        ...testState,
        score: score + 1,
        question: question + 1,
      });

      setFlashClass("green-flash");
    } else {
      // wrong answer selected
      setTestState({
        ...testState,
        score: score - 1,
        question: question + 1,
      });
      setFlashClass("red-flash");
    }
    // if last question, then end test
    if (question === questions.length - 1) {
      setTestState({ ...testState, started: "done" });
    }
  };

  useEffect(() => {
    if (flashClass) {
      const timer = setTimeout(() => {
        setFlashClass("");
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [flashClass]);

  // memoize onAnswer
  const onAnswerMemo = useCallback(onAnswer, [
    question,
    questions.length,
    score,
    setTestState,
    testState,
  ]);

  return (
    <div className="rounded-lg bg-gray-100">
      <div
        className={`flex flex-col items-center justify-center rounded-lg ${flashClass}`}
      >
        {/* display time left */}
        <div className="text-xl">Time remaining: {formatTimeLeft()}</div>
        {/* display your score */}
        <div className="text-2xl">Score: {score}</div>
        <div className="text-2xl">Question: {question + 1}</div>
        <DisplayQuestion
          onAnswer={onAnswerMemo}
          question={questions[question]}
        />
      </div>
    </div>
  );
};

const inter = Inter({ subsets: ["latin"] });
interface Question {
  l1?: string;
  l2?: string;
  l3?: string;
  operation: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answer: string;
}

const defaultQuestions: Question[] = [
  {
    l1: "1",
    l2: "2",
    operation: "+",
    option1: "3",
    option2: "4",
    option3: "5",
    option4: "6",
    answer: "3",
  },
];

interface TestState {
  question: number;
  score: number;
  started: "no" | "yes" | "done";
}

export default function Test() {
  const router = useRouter();
  const { id } = router.query;

  const [testState, setTestState] = useState<TestState>({
    question: 0,
    score: 0,
    started: "no",
  });

  const { question, score, started } = testState;
  const [questions, setQuestions] = useState<Question[]>(defaultQuestions);
  const [timeAllowed, setTimeAllowed] = useState<number>(8 * 60);

  // create questions on first render
  useEffect(() => {
    let newQuestions = [];
    let newTime = 8 * 60;
    if (id === "80in8") {
      newQuestions = generateQuestionsInteger(80);
    } else if (id === "20in2integer") {
      newTime = 2 * 60;
      newQuestions = generateQuestionsInteger(20);
    } else {
      newQuestions = generateQuestionsInteger(80);
    }
    setQuestions(newQuestions);
    setTimeAllowed(newTime);
    // update time too
  }, [id]);

  console.log("parent rerendered");

  return (
    <>
      <Head>
        <title>QuantWorld</title>
        <meta
          name="description"
          content="Made this site to get a brain workout."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {/* deal with not started */}
        {started === "no" && (
          <NotStarted
            onStart={() => setTestState({ ...testState, started: "yes" })}
          />
        )}
        {/* deal with started */}
        {started === "yes" && (
          <Started
            timeAllowed={timeAllowed}
            testState={testState}
            questions={questions}
            setTestState={setTestState}
          />
        )}
        {/* deal with test ended */}
        {started === "done" && (
          <div className="flex flex-col items-center justify-center">
            <div className="text-2xl">Test Ended</div>
            <div className="text-2xl">Total Answered: {question}</div>
            <div className="text-2xl">Score: {score}</div>
            {/* go back to index.html*/}
            <Link href="/">
              <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Go Back
              </div>
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
