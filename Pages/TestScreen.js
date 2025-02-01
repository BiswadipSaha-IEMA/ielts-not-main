import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import useHttp from "../hooks/useHttp";
import Timer from "../components/Timer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useExam } from "../context/ExamProvider";
import AudioPlayer from "../components/Audio";
import MicrophoneRecorder from "../components/MicrophoneRecorder";

const TestScreen = () => {
  const { getRequest, postRequest } = useHttp();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { module, level, setIsTestRunning } = useExam();
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState({});
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);
  const [audioKey, setAudioKey] = useState(0); // Key to reset Audio component
  const [isScrolling, setIsScrolling] = useState(false); // Flag to track scrolling state
  const [showModal, setShowModal] = useState(false); // State variable to control modal visibility
  const flatListRef = useRef(null); // Reference for FlatList
  const [timerVariable, setTimerVariable] = useState(1);
  const [checkAudio, setCheckAudio] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [getSet, setGetSet] = useState(0);
  const [questionLength, setQuestionLength] = useState(0);
  const accessToken= AsyncStorage.getItem('token')
  const [scoreUpdate, setScoreUpdate]= useState(0)
  const [correctAnswers, setCorrectAnswers]=useState(0);

  // useEffect(() => {
  //   const fetchQuestions = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem("token");
  //       const response = await getRequest(
  //         `/exam/module${module}/level${level}/questions`,
  //         token
  //       );
  //       // console.log(response.totaltime);
  //       console.log(response.questions[0].question,"passageesssss1");
  //       console.log(response.instructions,"instructions")
  //       setInstructions(response.instructions);
  //       console.log(response.totalTime,"time");
  //       setTimerVariable(response.totalTime);
  //       setQuestions(response.questions[0].question);
  //       console.log(response.questions[0].question,"questionsss");
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching questions:", error);
  //     }
  //   };

  //   fetchQuestions();
  // }, []);


  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log("Fetching token...");
        const token = await AsyncStorage.getItem("token");
        console.log("Token fetched:", token);

        console.log("Sending request...");
        const response = await getRequest(
          `/exam/module${module}/level${level}/questions`,
          token
        );
        console.log("Response received:", response.passage);
        let content=''
        for(let i=0;i<response.passage.length;i++){
          if(content.length===0){
            content+=response.passage[i].content
            console.log('content1',content)
          }
          else{
          content+='\n'+response.passage[i].content
          console.log('content2',content)}
        }

        console.log(content)

        setInstructions(content);
        setTimerVariable(response.totalTime);
        setGetSet(response.set);
        console.log(response.set, 'settttt')
        // console.log(response.totalTime,"time");
        setQuestions(response.questions);
        setQuestionLength(response.questions.length);
        setLoading(false);
        console.log(response.questions)
        console.log(currentQuestion)
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);


  useEffect(() => {
    if (instructions) {
      // const instructionArr= instructions[0].split('.')
      // console.log(typeof instructions); // string
      const instructionArr = instructions;
      // console.log(instructionArr);
      if (instructionArr[instructionArr.length - 1] === "mp3")
        // console.log(true)
        setCheckAudio(true);
      // console.log(instructionArr);
    }
  }, [instructions]);

  useEffect(() => {
    // if (
    //   questions.questions &&
    //   currentQuestion === questions.questions.length - 1
    // ) {
    //   setIsReadyToSubmit(true);
    // } else {
    //   setIsReadyToSubmit(false);
    // }




    if (questions.length && currentQuestion === questions.length - 1) {
      setIsReadyToSubmit(true);
    } else {
      setIsReadyToSubmit(false);
    }

  }, [currentQuestion, questions]);

  useEffect(() => {
    console.log(questions.length, "questions")
  }, [questions])

  function handleAnswers(id, optionKey) {
    // Check if there's an existing answer for the given id
    const existingAnswerIndex = answers.findIndex(
      (answer) => Object.keys(answer)[0] == id
    );
    // If there's no existing answer for the given id, add a new object to the answers array
    if (existingAnswerIndex === -1) {
      // Add a new object to the answers array
      setAnswers((prevAnswers) => {
        const updatedAnswers = [...prevAnswers, { [id]: optionKey }];
        return updatedAnswers;
      });
    } else {
      // If there's an existing answer, update its value
      setAnswers((prevAnswers) => {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingAnswerIndex][id] = optionKey;
        return updatedAnswers;
      });
    }
    setSelectedOption((prevSelectedOption) => ({
      ...prevSelectedOption,
      [id]: optionKey,
    }));
  }

  function handleClear(id) {
    // Filter out the answer with the given id from the answers array
    const filteredAnswers = answers.filter(
      (answer) => Object.keys(answer)[0] !== id.toString()
    );
    setAnswers(filteredAnswers);
    // Also clear the selected option for the given id
    setSelectedOption((prevSelectedOption) => {
      const updatedSelectedOption = { ...prevSelectedOption };
      delete updatedSelectedOption[id];
      return updatedSelectedOption;
    });
  }

  useEffect(()=>{
    console.log(scoreUpdate,"scoreUpdate")
  },[scoreUpdate])


  const submitAudioHandler= async()=>{
    try {
      console.log(scoreUpdate)
      console.log(correctAnswers)
      const avg_score = scoreUpdate/correctAnswers
      console.log(avg_score,'avg_score')
      const token = await AsyncStorage.getItem("token");
      const response = await postRequest(
        `/exam/module${module}/level${level}/set${getSet}/submit`,
        { avg_score: scoreUpdate },
        token
      );
      console.log(response);

      setIsTestRunning(false);

      setSelectedOption({}); // Reset selectedOption state to clear the blue selection

      // Reset answers state
      setAnswers([]);
    } catch (error) {
      console.error("Error submitting audio:", error);
    }
  }

  const submitHandler = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await postRequest(
        `/exam/module${module}/level${level}/set${getSet}/submit`,
        { answers },
        token
      );
      console.log(response);
      const { score } = response;

      Alert.alert(`Score: ${score}`, response.message);
      setIsTestRunning(false);

      setSelectedOption({}); // Reset selectedOption state to clear the blue selection

      // Reset answers state
      setAnswers([]);
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  };

  const listComponent = ({ item }) => {
    const isQuestionAnswered = Object.keys(selectedOption).includes(
      item.id.toString()
    );
    const isOptionSelected =
      isQuestionAnswered && selectedOption[item.id] !== undefined;
    const isCurrentQuestion = currentQuestion === item.id - 1;
    const isVisited = isQuestionAnswered || isCurrentQuestion;

    let backgroundColor = "white"; // Default background color
    let textColor = "blue"; // Default text color
    let borderColor = "blue";

    if (isCurrentQuestion) {
      backgroundColor = "#85AEE1"; // Blue for the current question
      textColor = "#354B46"; // White text color for current question
      borderColor = "#4E7AA9";
    } else if (!isVisited && !isOptionSelected) {
      backgroundColor = "#fff";
      textColor = "#000";
      borderColor = "#85AEE1";
    } else if (isQuestionAnswered && isOptionSelected) {
      backgroundColor = "#DAEDE1"; // Green when question is answered
      textColor = "#000"; // White text color for answered question
      borderColor = "#354B46";
    }

    return (
      <Pressable
        style={[
          styles.listItem,
          { backgroundColor, borderColor }, // Apply dynamic background color and border color
        ]}
        onPress={() => {
          setCurrentQuestion(item.id - 1);
          setAudioKey(item.id); // Reset Audio component key
          // Scroll to the selected question number
          flatListRef.current.scrollToIndex({
            animated: true,
            index: item.id - 1,
          });

          setShowModal(true); // Show modal when a listComponent item is clicked

          // Close modal after 3.5 seconds
          setTimeout(() => {
            setShowModal(false);
          }, 3500);
        }}
      >
        <Text style={{ color: textColor }}>{item.id}</Text>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <ActivityIndicator
        style={{ flex: 1, alignSelf: "center" }}
        size={64}
        color={"blue"}
      />
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.timerWithHeading}>
            <View style={styles.heading}>
              <Text style={styles.headingText}>Questions</Text>
            </View>
            <View style={styles.timer}>
              <Timer time={timerVariable} />
            </View>
          </View>
          <View
            style={{
              padding: "3%",
              backgroundColor: "#fff",
              borderColor: "blue",
              borderWidth: 2,
              margin: "3%",
              marginTop: "6%",
              borderRadius: 5,
              elevation: 8,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
              }}
            >
              Tap <Icon name="info" size={22} color="#858585" /> to view
              instructions, and{"  "}
              <Icon name="book" size={19} color="#858585" />
              {"  "}
              to{" "}
              {module === 1 || module === 3 ? (
                <Text>view passage</Text>
              ) : (
                <Text>listen audio</Text>
              )}
              .
            </Text>
          </View>

          <View
            style={{
              padding: "3%",
              backgroundColor: "#fff",
              borderColor: "blue",
              borderWidth: 2,
              margin: "3%",
              marginTop: "6%",
              borderRadius: 5,
              elevation: 8,
            }}
          >
            {module === 4 ? (
              <Text
                style={{
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                }}
              >
                Tap {"  "}
                <Icon name="info" size={22} color="#858585" /> {"  "}to view
                instructions.
              </Text>
            ) : (
              <Text
                style={{
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                }}
              >
                Tap {"  "}
                <Icon name="info" size={22} color="#858585" />
                {"  "} to view instructions, and{"  "}
                <Icon name="book" size={19} color="#858585" />
                {"  "}
                to
                {module === 1 || module === 3 ? (
                  <Text> view passage</Text>
                ) : (
                  <Text>listen to audio</Text>
                )}
                .
              </Text>
            )}
          </View>

          {
            !checkAudio &&
            <ScrollView
              nestedScrollEnabled={true}
              style={{
                padding: "3%",
                backgroundColor: "#fff",
                borderColor: "blue",
                borderWidth: 2,
                margin: "3%",
                marginTop: "6%",
                borderRadius: 5,
                elevation: 8,
                // height: "10%"
              }}
            >
              <Text
               style={{
               
              }}
              >{instructions}</Text>
            </ScrollView>
          }

          <View style={styles.questionsList}>
            <FlatList
              ref={flatListRef}
              data={questions}
              renderItem={listComponent}
              horizontal={true}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              extraData={currentQuestion} // Ensure re-render when currentQuestion changes
            />
          </View>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={showModal && module === 4}
          onRequestClose={() => {
            setShowModal(false);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>Please wait for 5 seconds for the question to load.</Text>
              <Text style={{ marginTop: 10 }}>
                Clicking on any question/answer between that time will result in
                closing the test.
              </Text>
            </View>
          </View>
        </Modal>
        <View style={styles.testContainer}>

          <View style={styles.question}>
            {questions[currentQuestion]?.question.includes(
              ".mp3"
            ) ? (
              <>
                {questions[currentQuestion]?.question && (
                  <AudioPlayer
                    key={audioKey} // Reset Audio component when key changes
                  // source={`https://ielts-iema.iemamerica.com${questions[currentQuestion]?.question}`}
                  />
                )}
              </>
            ) : (
              <Text style={styles.questionText}>
                {questions[currentQuestion]?.question}
              </Text>
            )}
            {/* <Text style={styles.questionText}>
                {questions[currentQuestion]?.question}
              </Text> */}
          </View>


          <ScrollView style={styles.answerContainer}>
            {
              module===3?(
              <><MicrophoneRecorder scoreUpdate={scoreUpdate} setScoreUpdate={setScoreUpdate} setCorrectAnswers={setCorrectAnswers}/></>
            ):

            (<View>
              {questions[currentQuestion]?.options?.map(
                (option, index) => {
                  const id = questions[currentQuestion].id;
                  const isSelected = selectedOption[id] === option.key;

                  return (
                    <Pressable
                      key={index}
                      style={[
                        styles.answers,
                        isSelected && styles.selectedOption,
                      ]}
                      onPress={() => {
                        handleAnswers(id, option.key);
                      }}
                    >
                      {option.value.includes(".mp3") ? (
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Text
                            style={[
                              styles.key,
                              isSelected && styles.selectedKey,
                            ]}
                          >
                            {option.key}
                          </Text>
                          {option.value && (
                            <AudioPlayer
                              key={audioKey} // Reset Audio component when key changes
                              source={`https://ielts-iema.iemamerica.com${option.value}`}
                            />
                          )}
                        </View>
                      ) : (
                        <>
                          <Text
                            style={[
                              styles.key,
                              isSelected && styles.selectedKey,
                            ]}
                          >
                            {option.key}
                          </Text>
                          <Text
                            style={[
                              styles.value,
                              isSelected && styles.selectedValue,
                            ]}
                          >
                            {option.value}
                          </Text>
                        </>
                      )}
                    </Pressable>
                  );
                }
              )}
            </View>)
            }
            <View style={styles.ctaContainer}>
              {questions[currentQuestion]?.id !== 1 && (
                <Pressable
                  style={styles.clearButton}
                  onPress={async () => {
                    setShowModal(true);
                    setCurrentQuestion(currentQuestion - 1);
                    setIsScrolling(true);
                    await flatListRef.current.scrollToIndex({
                      animated: true,
                      index: currentQuestion - 1,
                    });
                    setTimeout(() => {
                      setShowModal(false);
                    }, 3500);
                  }}
                >
                  <Text style={styles.clearButtonText}>Previous</Text>
                </Pressable>
              )}
              <Pressable
                style={[
                  styles.actionButton,
                  questions[currentQuestion]?.id === 1 && { width: "40%" },
                ]}
                onPress={() => {
                  handleClear(questions[currentQuestion]?.id);
                }}
              >
                <Text style={styles.actionButtonText}>Clear</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.clearButton,
                  questions[currentQuestion]?.id === 1 && { width: "40%" },
                ]}
                onPress={() => {
                  if (
                    questions[currentQuestion]?.id !==
                    questions?.length
                  ) {
                    setShowModal(true);
                  }
                  if (isReadyToSubmit) {
                    if(module===3){
                      submitAudioHandler();
                    }
                    submitHandler();
                  } else {
                    setCurrentQuestion(currentQuestion + 1);
                    setAudioKey(currentQuestion + 1);
                    setIsScrolling(true);
                    flatListRef.current.scrollToIndex({
                      animated: true,
                      index: currentQuestion + 1,
                    });
                    if (
                      questions[currentQuestion]?.id !==
                      questions?.length
                    ) {
                      setTimeout(() => {
                        setShowModal(false);
                      }, 3500);
                    }
                  }
                }}
              >
                <Text style={styles.clearButtonText}>
                  {questions[currentQuestion]?.id ===
                    questions?.length
                    ? "Submit"
                    : "Next"}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
};

export default TestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {},
  timerWithHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heading: {},
  headingText: {
    color: "blue",
    fontSize: 20,
    fontWeight: "bold",
  },
  timer: {},
  questionsList: {
    marginTop: "5%",
    paddingLeft: "3%",
  },
  listItem: {
    padding: 16,
    marginHorizontal: 8,
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 16,
    flex: 1 / 8,
    borderColor: "blue",
  },
  testContainer: {
    marginTop: "10%",
    paddingHorizontal: "5%",
    gap: 20,
    flex: 1,
  },
  question: {
    backgroundColor: "white",
    padding: "5%",
    borderColor: "blue",
    borderWidth: 1,
    borderRadius: 8,
  },
  questionText: {
    color: "blue",
    fontWeight: "bold",
  },
  answerContainer: {
    flex: 1,
  },
  answers: {
    flexDirection: "row",
    padding: "5%",
    borderColor: "blue",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
  },
  key: {
    flex: 1 / 4,
    textAlign: "center",
    fontWeight: "600",
    color: "#000",
  },
  value: {
    flex: 3 / 4,
    fontWeight: "600",
  },
  ctaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
  },
  clearButton: {
    padding: "5%",
    borderWidth: 2,
    borderRadius: 25,
    borderColor: "blue",
    width: "30%",
  },
  clearButtonText: {
    textAlign: "center",
    color: "blue",
    fontWeight: "bold",
  },
  actionButton: {
    padding: "5%",
    borderRadius: 25,
    backgroundColor: "blue",
    width: "35%",
  },
  actionButtonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
  selectedOption: {
    backgroundColor: "#DAEDE1", // Light blue background color for selected options
    borderColor: "#005244", // Light blue border color for selected options
  },
  selectedKey: {
    flex: 1 / 4,
    color: "#000", // Change text color for selected options
    textAlign: "center",
    fontWeight: "600",
  },
  selectedValue: {
    flex: 3 / 4,
    color: "#000", // Change text color for selected options
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    paddingVertical: "20%",
    alignItems: "left",
    borderWidth: 2,
    borderColor: "#000",
  },
});
