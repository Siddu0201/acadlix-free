import React from 'react'
import { Outlet } from 'react-router-dom'

const AdminHeader = () => {
  return (
    <div>
      This is Admin Header
      <Outlet />
    </div>
  )
}

export default AdminHeader
