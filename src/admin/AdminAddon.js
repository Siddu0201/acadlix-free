import React from 'react'
import './AdminAddon.css';
import Provider from '@acadlix/provider/Provider';
import { Toaster } from 'react-hot-toast';
import AdminLayout from '@acadlix/layout/AdminLayout';

const AdminAddon = () => {
  return (
    <Provider>
        <Toaster position="bottom-right" />
        <AdminLayout>
            Hello
        </AdminLayout>
    </Provider>
  )
}

export default AdminAddon