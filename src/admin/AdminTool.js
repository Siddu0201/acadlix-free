import React from 'react'
import Provider from '../provider/Provider'
import { Toaster } from 'react-hot-toast'
import AdminLayout from '../layout/AdminLayout'

const AdminTool = () => {
  return (
    <Provider>
      <Toaster position="bottom-right" />
      <AdminLayout>Tool</AdminLayout>
    </Provider>
  )
}

export default AdminTool
