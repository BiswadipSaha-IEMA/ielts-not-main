import { createContext, useContext, useState } from "react";

const ExamContext = createContext();

const ExamProvider = ({ children }) => {
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [module, setModule] = useState(1);
  const [level, setLevel] = useState(1);
  const [passage, setPassage] = useState();
  const [instructions, setInstructions] = useState();
  const [title, setTitle] = useState("");

  return (
    <ExamContext.Provider
      value={{
        isTestRunning,
        module,
        level,
        passage,
        instructions,
        title,
        setIsTestRunning,
        setModule,
        setLevel,
        setPassage,
        setInstructions,
        setTitle,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => useContext(ExamContext);
export default ExamProvider;
