import React from 'react'
import '@wordpress/shortcode'
import '@wordpress/core-data'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'


const AppFront = (props) => {
  return (
    <BrowserRouter basename={window.location.pathname}>
      <Routes>
        <Route path='/' element={<div>
      Hello buddy <Link to='/hee'>hee</Link>
    </div>} />
    <Route path="/hee" element={<div>ddsdf</div>} />
      </Routes>
    </BrowserRouter>
    
  )
}

export default AppFront
