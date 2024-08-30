import React from 'react'
import Provider from '../provider/Provider'
import { Toaster } from 'react-hot-toast'
import AdminLayout from '../layout/AdminLayout'

const AdminSetting = () => {
  return (
    <Provider>
      <Toaster position="bottom-right" />
      <AdminLayout>Setting</AdminLayout>
    </Provider>
  )
}

export default AdminSetting
