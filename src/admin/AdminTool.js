import React from 'react'
import Provider from '@acadlix/provider/Provider'
import { Toaster } from 'react-hot-toast'
import AdminLayout from '@acadlix/layout/AdminLayout'

const AdminTool = () => {
  return (
    <Provider>
      <Toaster position="bottom-right" />
      <AdminLayout>Tool</AdminLayout>
    </Provider>
  )
}

export default AdminTool
