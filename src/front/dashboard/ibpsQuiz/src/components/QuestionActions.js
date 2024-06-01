import React from 'react'

const QuestionActions = () => {
  return (
    <div className='flex justify-between border-black border-2 p-1'>
      <div>
      <button className='border-gray-500 border-2 rounded-sm p-1 m-1'>Mark for Review and Next</button>
      <button className='border-gray-500 border-2 rounded-sm p-1 m-1'>Clear Response</button>
      </div>
      <button className='bg-blue-400 text-white px-2 py-1'>Save and Next</button>
    </div>
  )
}

export default QuestionActions;
