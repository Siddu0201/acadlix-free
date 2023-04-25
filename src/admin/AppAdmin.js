import React from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'

const AppAdmin = () => {
  return (
    <HashRouter>
      <div>
        <Routes>
          <Route path="/" element={<div>Hello buddy how are you?</div>} />
          <Route path="/quiz" element={<div>Quiz</div>} />
        </Routes>
      </div>
    </HashRouter>
  )
}

export default AppAdmin
