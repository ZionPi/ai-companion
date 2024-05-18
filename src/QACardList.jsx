import React from 'react';
import QACard from "./QuestionAnswerCard";

const QACardList = ({ qaPairs }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {qaPairs.map((pair, index) => (
        <QACard 
          key={index} 
          question={pair.question} 
          answer={pair.answer} 
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg" 
        />
      ))}
    </div>
  );
};

export default QACardList;