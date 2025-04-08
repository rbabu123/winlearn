// import React, { useState } from "react";
// import { Button, Card, Typography, Checkbox, message, Result } from "antd";
// import { ArrowLeftOutlined, ReloadOutlined } from "@ant-design/icons";
// import { useParams, useNavigate } from "react-router-dom";
// import { useEvaluateAnswers, useFetchQuestions } from "../../api/learner";
// import { useAuth } from "../../contexts/userContext";
// import { Option, Question } from "../types";
// import { LoadingIndicator } from "../../global/loadingIndicator";

// const { Text } = Typography;

// export const Assessment: React.FC = () => {
//   const { courseId } = useParams<{ courseId: string }>();
//   const { userID } = useAuth();
//   const navigate = useNavigate();

//   const { data: questionsData, isLoading } = useFetchQuestions(Number(courseId));
//   const questions = questionsData?.data?.Assessment || [];

//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
//   const [evaluationData, setEvaluationData] = useState<any>(null);
//   const { mutate: submitAnswers, isPending } = useEvaluateAnswers();

//   if (isLoading) return <LoadingIndicator type="page" />;

//   const question = questions[currentQuestionIndex];

//   const handleAnswerChange = (optionId: number) => {
//     setSelectedAnswers((prev) => ({
//       ...prev,
//       [question.Question_ID]: optionId,
//     }));
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex((prev) => prev + 1);
//     }
//   };

//   const handlePrev = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex((prev) => prev - 1);
//     }
//   };

//   const handleSubmit = () => {
//     const allAnswered = questions.every((q: Question) => selectedAnswers[q.Question_ID] !== undefined);

//     if (!allAnswered) {
//       message.error("Please select at least one option for each question before submitting.");
//       return;
//     }

//     const submission = {
//       User_ID: userID,
//       Course_ID: Number(courseId),
//       Answers: Object.entries(selectedAnswers).map(([questionId, optionId]) => ({
//         Question_ID: parseInt(questionId),
//         Selected_Option_ID: Number(optionId),
//       })),
//     };

//     submitAnswers(submission, {
//       onSuccess: (responseData) => {
//         setEvaluationData(responseData.data);
//         message.success("Answers submitted successfully!");
//       },
//       onError: () => {
//         message.error("Submission failed. Please try again.");
//       },
//     });
//   };

//   const handleRetakeQuiz = () => {
//     setSelectedAnswers({});
//     setEvaluationData(null);
//     setCurrentQuestionIndex(0);
//   };

//   return (
//     <div style={{ marginLeft: "15rem", padding: "20px" }}>

//       <Card
//         title={`Question ${currentQuestionIndex + 1} of ${questions.length}`}
//         style={{ maxWidth: 600, margin: "auto", marginTop: 20 }}
//       >
//         <Text strong>{question.Question_Text}</Text>
//         {question.Options.map((option: Option) => {
//           let optionColor = "";
//           const isSelected = selectedAnswers[question.Question_ID] === option.Option_ID;
//           const evaluation = evaluationData?.Answers?.find(
//             (ans: Question) => ans.Question_ID === question.Question_ID
//           );

//           if (evaluation) {
//             if (option.Option_ID === evaluation.Correct_Option_ID) {
//               optionColor = "green";
//             } else if (isSelected) {
//               optionColor = "red";
//             }
//           }

//           return (
//             <div key={option.Option_ID} style={{ marginTop: 10 }}>
//               <Checkbox
//                 checked={isSelected}
//                 onChange={() => handleAnswerChange(option.Option_ID)}
//                 style={{ color: optionColor }}
//               >
//                 {option.Option_Text}
//               </Checkbox>
//             </div>
//           );
//         })}

//         <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
//           {currentQuestionIndex > 0 && (
//             <Button type="default" onClick={handlePrev}>
//               Prev
//             </Button>
//           )}

//           {currentQuestionIndex < questions.length - 1 ? (
//             <Button type="primary" onClick={handleNext}>
//               Next
//             </Button>
//           ) : (
//             <Button type="primary" onClick={handleSubmit} disabled={isPending} loading={isPending}>
//                 Submit Answers
//             </Button>
//           )}
//         </div>
//       </Card>

//       {/* Results Card */}
//       {evaluationData && (

//         <Card
//         title="Assessment Result"
//         style={{ maxWidth: 600, margin: "auto", marginTop: 10, textAlign: "center" }}
//         >
//         <Result
//         status={evaluationData.Score_Percentage >= 70 ? "success" : "warning"}
//         title={`You Scored ${evaluationData.Score_Percentage}%`}
//         subTitle={`You got ${evaluationData.Score} out of ${evaluationData.Total_Questions} questions correct.`}
//         extra={[
//             <Button type="link" key="dashboard"  icon={<ArrowLeftOutlined />} onClick={() => navigate("/learner/dashboard/learning-paths")}>
//             Back to Dashboard
//             </Button>,
//             <Button key="retake" icon={<ReloadOutlined />} onClick={handleRetakeQuiz} type="default">
//             Retake Quiz
//             </Button>,
//         ]}
//         />
//         </Card>
//       )}
//     </div>
//   );
// };



// import  { useState } from "react";
// import { Button, Card, Typography, Checkbox, message, Result, Alert } from "antd";
// import { useParams, useNavigate } from "react-router-dom";
// import { useEvaluateAnswers, useFetchQuestions } from "../../api/learner";
// import { useAuth } from "../../contexts/userContext";
// import { Option, Question } from "../types";
// import { LoadingIndicator } from "../../global/loadingIndicator";

// const { Text } = Typography;

// export const Assessment = () => {
//   const { courseId } = useParams<{ courseId: string }>(); // Get course ID from URL
//   const { userID } = useAuth();
//   const navigate = useNavigate();

//   const { data: questionsData, isLoading } = useFetchQuestions(Number(courseId));
//   const questions = questionsData?.data?.Assessment || [];

//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
//   const [evaluationData, setEvaluationData] = useState<any>(null); // Store evaluation response
//   const { mutate: submitAnswers, isPending } = useEvaluateAnswers();

//   if (isLoading) return <LoadingIndicator type="page" />;

//   const question = questions[currentQuestionIndex];

// //   const handleAnswerChange = (optionId: number) => {
// //     setSelectedAnswers((prev) => ({
// //       ...prev,
// //       [question.Question_ID]: optionId, // Store as a single number
// //     }));
// //   };

// //   const handleNext = () => {
// //     if (currentQuestionIndex < questions.length - 1) {
// //       setCurrentQuestionIndex((prev) => prev + 1);
// //     }
// //   };

// const handleAnswerChange = (optionId: number) => {
//     setSelectedAnswers((prev) => {
//       const updatedAnswers = {
//         ...prev,
//         [question.Question_ID]: optionId,
//       };
  
//       // Directly update state, ensuring the component re-renders with the new value.
//       setSelectedAnswers(updatedAnswers);
//       // Find all unanswered question indices
//         let allAnswered = true;
//         questions.forEach((q: Question) => {
//             if (updatedAnswers[q.Question_ID] === undefined) {
//                 allAnswered = false;
//             }
//         });

//         if (allAnswered) {
//             // All questions are answered, move to the last question
//             setCurrentQuestionIndex(questions.length - 1);
//         }  
//       return updatedAnswers;
//     });
//   };
  
// const handleNext = () => {
//     const unansweredIndices = questions
//       .map((q: Question, index: number) => (selectedAnswers[q.Question_ID] === undefined ? index : -1))
//       .filter((index: number) => index !== -1);
  
//     if (unansweredIndices.length > 0) {
//       // Find the next unanswered question index that is greater than currentQuestionIndex
//       const nextUnanswered = unansweredIndices.find((index: number) => index > currentQuestionIndex);
  
//       if (nextUnanswered !== undefined) {
//         setCurrentQuestionIndex(nextUnanswered);
//         return;
//       }
//     }
  
//     // If no unanswered questions left, move sequentially to the next question
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(prev => prev + 1);
//     }
//   };
  

//   const handlePrev = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex((prev) => prev - 1);
//     }
//   };

// //   const handleSubmit = () => {
// //     const allAnswered = questions.every((q: Question) => selectedAnswers[q.Question_ID] !== undefined);

// //     if (!allAnswered) {
// //       message.error("Please select at least one option for each question before submitting.");
// //       return;
// //     }

// //     const submission = {
// //       User_ID: userID,
// //       Course_ID: Number(courseId),
// //       Answers: Object.entries(selectedAnswers).map(([questionId, optionId]) => ({
// //         Question_ID: parseInt(questionId),
// //         Selected_Option_ID: Number(optionId),
// //       })),
// //     };

// //     submitAnswers(submission, {
// //       onSuccess: (responseData) => {
// //         console.log("Evaluation Response:", responseData);
// //         setEvaluationData(responseData.data); // Store response
// //       },
// //       onError: () => {
// //         message.error("Submission failed. Please try again.");
// //       },
// //     });
// //   };


// const handleSubmit = () => {
//     const unansweredIndices = questions
//       .map((q: Question, index: number) => (selectedAnswers[q.Question_ID] === undefined ? index : -1))
//       .filter((index: number) => index !== -1);
  
//     if (unansweredIndices.length > 0) {
//       setCurrentQuestionIndex(unansweredIndices[0]); // Move to the first unanswered question
//       message.error("Please answer all questions before submitting.");
//       return;
//     }
  
//     // If no unanswered questions, proceed with submission
//     const submission = {
//       User_ID: userID,
//       Course_ID: Number(courseId),
//       Answers: Object.entries(selectedAnswers).map(([questionId, optionId]) => ({
//         Question_ID: parseInt(questionId),
//         Selected_Option_ID: Number(optionId),
//       })),
//     };
  
//     submitAnswers(submission, {
//       onSuccess: (responseData) => {
//         console.log("Evaluation Response:", responseData);
//         setEvaluationData(responseData.data);
//       },
//       onError: () => {
//         message.error("Submission failed. Please try again.");
//       },
//     });
//   };
  
//   const handleRetake = () => {
//     setEvaluationData(null); // Reset results
//     setSelectedAnswers({}); // Clear previous answers
//     setCurrentQuestionIndex(0); // Reset to first question
//   };

//   return (
//     <div style={{ padding: "60px", marginTop: "20px" }}>
//         {/* Show warning message before submitting the assessment */}
//     {!evaluationData && (
//       <Alert
//         message="Caution: Once you start this assessment, you must complete it before leaving. You cannot navigate back until you submit your answers."
//         type="warning"
//         showIcon
//         style={{ maxWidth: 600, margin: "auto" }}
//       />
//     )}
//       {evaluationData ? (
//         // Show Results
//         <Card
//           title="Assessment Result"
//           style={{ maxWidth: 600, margin: "auto", marginTop: 10, textAlign: "center" }}
//         >
//           <Result
//             status={evaluationData.Score_Percentage >= 70 ? "success" : "warning"}
//             title={`You Scored ${evaluationData.Score_Percentage}%`}
//             subTitle={`You got ${evaluationData.Score} out of ${evaluationData.Total_Questions} questions correct.`}
//             extra={[
//               <Button type="primary" key="dashboard" onClick={() => navigate("/learner/dashboard/learning-paths")}>
//                 Back to Dashboard
//               </Button>,
//               <Button key="retake" onClick={handleRetake} type="default">
//                 Retake Quiz
//               </Button>,
//             ]}
//           />
//         </Card>
//       ) : (
//         // Show Assessment Questions
//         <Card
//           title={`Question ${currentQuestionIndex + 1} of ${questions.length}`}
//           style={{ maxWidth: 600, margin: "auto", marginTop: 50 }}
//         >
//           <Text strong>{question.Question_Text}</Text>
//           {question.Options.map((option: Option) => {
//             const isSelected = selectedAnswers[question.Question_ID] === option.Option_ID;

//             return (
//               <div key={option.Option_ID} style={{ marginTop: 10 }}>
//                 <Checkbox
//                   checked={isSelected}
//                   onChange={() => handleAnswerChange(option.Option_ID)}
//                   disabled={isPending} // Disable during submission
//                 >
//                   {option.Option_Text}
//                 </Checkbox>
//               </div>
//             );
//           })}

//           <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
//             {currentQuestionIndex > 0 && (
//               <Button type="default" onClick={handlePrev} disabled={isPending}>
//                 Prev
//               </Button>
//             )}

//             {currentQuestionIndex < questions.length - 1 ? (
//               <Button type="primary" onClick={handleNext} disabled={isPending}>
//                 Next
//               </Button>
//             ) : (
//               <>
//                 {/* <Button
//                   type="primary"
//                   htmlType="submit"
//                   onClick={handleSubmit}
//                   disabled={isPending}
//                 >
//                   Submit Answers
//                 </Button>
//                 {isPending && <LoadingIndicator type="inline" />} */}
//                 <Button type="primary" htmlType="submit" onClick={handleSubmit} disabled={isPending} loading={isPending}>
//                     Submit Answers
//                 </Button>
//               </>
//             )}
//           </div>
//         </Card>
//       )}
//     </div>
//   );
// };


import React, { useState } from "react";
import { Button, Card, Typography, Checkbox, message, Result, Divider } from "antd";
import { ArrowLeftOutlined, ReloadOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useEvaluateAnswers, useFetchQuestions } from "../../api/learner";
import { useAuth } from "../../contexts/userContext";
import { Option, Question } from "../types";
import { LoadingIndicator } from "../../global/loadingIndicator";

const { Text } = Typography;

export const Assessment: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { userID } = useAuth();
  const navigate = useNavigate();

  const { data: questionsData, isLoading } = useFetchQuestions(Number(courseId));
  const questions = questionsData?.data?.Assessment || [];

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [evaluationData, setEvaluationData] = useState<any>(null);
  const [unansweredQuestions, setUnansweredQuestions] = useState<number[]>([]);
  const { mutate: submitAnswers, isPending } = useEvaluateAnswers();

  if (isLoading) return <LoadingIndicator type="page" />;

  const handleAnswerChange = (questionId: number, optionId: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
     // Remove from unansweredQuestions if an option is selected
     setUnansweredQuestions((prev) => prev.filter((id) => id !== questionId));
  };

  const handleSubmit = () => {
    const missingQuestions = questions
      .filter((q: Question) => selectedAnswers[q.Question_ID] === undefined)
      .map((q: Question) => q.Question_ID);

    if (missingQuestions.length > 0) {
      setUnansweredQuestions(missingQuestions);
      message.error("Please answer all questions before submitting.");
      return;
    }

    const submission = {
      User_ID: userID,
      Course_ID: Number(courseId),
      Answers: Object.entries(selectedAnswers).map(([questionId, optionId]) => ({
        Question_ID: parseInt(questionId),
        Selected_Option_ID: Number(optionId),
      })),
    };

    submitAnswers(submission, {
      onSuccess: (responseData) => {
        setEvaluationData(responseData.data);
      },
      onError: () => {
        message.error("Submission failed. Please try again.");
      },
    });
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setEvaluationData(null);
    setUnansweredQuestions([]);
  };

  return (
    <div style={{ marginLeft: "10rem", padding: "20px" }}>
      <Card title="Assessment" style={{ maxWidth: 700, margin: "auto", marginTop: 10, marginBottom: 20 }}>
        {questions.map((question: Question, index: number) => {
          const isUnanswered = unansweredQuestions.includes(question.Question_ID);
          return (
            <div key={question.Question_ID} style={{ marginBottom: 20 }}>
              <Text strong style={{ color: isUnanswered ? "red" : "black" }}>
              {index + 1}. {question.Question_Text}
              </Text>
              {question.Options.map((option: Option) => {
                let optionColor = "";
                const isSelected = selectedAnswers[question.Question_ID] === option.Option_ID;
                const evaluation = evaluationData?.Answers?.find(
                  (ans: Question) => ans.Question_ID === question.Question_ID
                );

                if (evaluation) {
                  if (option.Option_ID === evaluation.Correct_Option_ID) {
                    optionColor = "green";
                  } else if (isSelected) {
                    optionColor = "red";
                  }
                }

                return (
                  <div key={option.Option_ID} style={{ marginTop: 10 }}>
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleAnswerChange(question.Question_ID, option.Option_ID)}
                      style={{ color: optionColor }}
                      // disabled={!!evaluationData && !isSelected && option.Option_ID !== evaluation?.Correct_Option_ID} // Disable all except selected or correct one
                      disabled={isPending || (!!evaluationData && !isSelected && option.Option_ID !== evaluation?.Correct_Option_ID)} 
                    >
                      {option.Option_Text}
                    </Checkbox>
                  </div>
                );
              })}
            </div>
          );
        })}
        <Divider />
        {!evaluationData && ( // Hide submit button after submission
          <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
            <Button type="primary" onClick={handleSubmit} disabled={isPending} loading={isPending}>
              Submit Answers
            </Button>
          </div>
        )}
      </Card>

      {/* Results Card */}
      {evaluationData && (
        <Card
          title="Assessment Result"
          style={{ maxWidth: 600, margin: "auto", marginTop: 20, textAlign: "center" }}
        >
          <Result
            status={evaluationData.Score_Percentage >= 70 ? "success" : "warning"}
            title={`You Scored ${evaluationData.Score_Percentage}%`}
            subTitle={`You got ${evaluationData.Score} out of ${evaluationData.Total_Questions} questions correct.`}
            extra={[
              <Button
                type="link"
                key="dashboard"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/learner/dashboard/learning-paths")}
              >
                Back to Dashboard
              </Button>,
              evaluationData.Score_Percentage < 100 && ( // Hide retake button if score is 100%
                <Button key="retake" icon={<ReloadOutlined />} onClick={handleRetakeQuiz} type="default">
                  Retake Quiz
                </Button> )
            ]}
          />
        </Card>
      )}
    </div>
  );
};
