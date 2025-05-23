import React from 'react'
import Header from './assets/Components/Header/Header'
import Footer from './assets/Components/Footer/Footer'
import { Outlet } from 'react-router-dom'
import Home from './assets/Components/Home/Home'

function Layout() {
  return (
    <>
    <Header/>
    
    <Outlet/>
    <Footer />
    </>
  )
}

export default Layout