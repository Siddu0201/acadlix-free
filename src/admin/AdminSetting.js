import React from 'react'
import Provider from '@acadlix/provider/Provider'
import { Toaster } from 'react-hot-toast'
import AdminLayout from '@acadlix/layout/AdminLayout'
import Setting from './views/setting/Setting'
import "./AdminSetting.css";
import { hasCapability } from "@acadlix/helpers/util";

const AdminSetting = () => {
  return (
    <Provider>
      <Toaster position="bottom-right" />
      <AdminLayout>
        {
            hasCapability("acadlix_show_setting") &&
            <Setting />
        }
      </AdminLayout>
    </Provider>
  )
}

export default AdminSetting
