import React from 'react'
import Provider from '@acadlix/provider/Provider'
import { Toaster } from 'react-hot-toast'
import AdminLayout from '@acadlix/layout/AdminLayout'
import Setting from './views/setting/Setting'
import "./AdminSetting.css";

const AdminSetting = () => {
  return (
    <Provider>
      <Toaster position="bottom-right" />
      <AdminLayout><Setting /></AdminLayout>
    </Provider>
  )
}

export default AdminSetting
