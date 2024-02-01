import React from 'react'
import Footer from 'layouts/Footer/Footer'
import Header from 'layouts/Header/Header'
import { Outlet } from 'react-router-dom'

export default function Container() {
  return (
    <>
    <Header />
    {/* Outlet은 페이지마다 다른 요소가 오게 할 수 있음 */}
    <Outlet />
    <Footer />
    </>
  )
}
