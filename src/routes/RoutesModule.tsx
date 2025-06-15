/*
* Copyright (c) 2025 Paul Le Gall. All Rights Reserved.
* Licensed See LICENSE file in the project root for details.
*/

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import About from '@screens/About'
import Contact from '@screens/Contact'
import Home from '@screens/Home'
import NotFound from '@screens/NotFound' 
import Settings from '@screens/Settings'


const RoutesModule = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default RoutesModule;

