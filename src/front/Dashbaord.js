import React from 'react'
import { HashRouter, Link, Route, Routes } from 'react-router-dom'

const Dashbaord = () => {
  return (
    <HashRouter>
        <Routes>
            <Route index element={<Link to="/quiz">Quiz</Link>} />
            <Route path="/quiz" element={<Link to="/">Dashboard</Link>} />
        </Routes>
    </HashRouter>
  )
}

export default Dashbaord
