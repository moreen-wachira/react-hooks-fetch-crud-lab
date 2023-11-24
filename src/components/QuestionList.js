import React, { useState, useEffect } from "react";
import QuestionForm from "./QuestionForm"; 
import QuestionItem from "./QuestionItem"; // Assuming you have this component

function QuestionList() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch questions when the component mounts
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    fetch("http://localhost:4000/questions")
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        setLoading(false);
      });
  };

  const handleDelete = (questionId) => {
    // Delete the question on the server
    fetch(`http://localhost:4000/questions/${questionId}`, {
      method: "DELETE",
    })
      .then(() => {
        // Update state to remove the deleted question
        setQuestions((prevQuestions) =>
          prevQuestions.filter((q) => q.id !== questionId)
        );
      })
      .catch((error) => console.error("Error deleting question:", error));
  };

  const handleDropdownChange = (questionId, newCorrectIndex) => {
    // Update the question on the server
    fetch(`http://localhost:4000/questions/${questionId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correctIndex: newCorrectIndex }),
    })
      .then(() => {
        // Update state to reflect the updated correctIndex
        setQuestions((prevQuestions) =>
          prevQuestions.map((q) =>
            q.id === questionId ? { ...q, correctIndex: newCorrectIndex } : q
          )
        );
      })
      .catch((error) => console.error("Error updating question:", error));
  };

  const handleFormSubmit = (formData) => {
    // Send a new question to the server
    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((newQuestion) => {
        // Update state to include the new question
        setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
      })
      .catch((error) => console.error("Error creating question:", error));
  };

  return (
    <section>
      <h1>Quiz Questions</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ul>
            {questions.map((question) => (
              <QuestionItem
                key={question.id}
                question={question}
                onDelete={handleDelete}
                onDropdownChange={handleDropdownChange}
              />
            ))}
          </ul>
          <QuestionForm onFormSubmit={handleFormSubmit} />
        </>
      )}
    </section>
  );
}

export default QuestionList;