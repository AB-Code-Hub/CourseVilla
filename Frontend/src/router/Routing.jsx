import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/About'
import Course from '../pages/course'
import Contact from '../pages/Contact'
import Certificate from '../pages/certificate'
import Login from '../auth/Login'
import Signup from '../auth/Signup'
import Logout from '../auth/Logout'
import AuthPage from '../auth/AuthPage'

const Routing = () => {
  return (
   <BrowserRouter>
   
        <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/logout' element={<Logout />} />
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/course" element={<Course />} />
            <Route path="/contact" element={<Contact />} />
            <Route path= "/certificate" element={<Certificate />} />
        </Routes>

   </BrowserRouter>
  )
}

export default Routing