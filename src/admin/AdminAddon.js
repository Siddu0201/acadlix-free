import React from 'react'
import './AdminAddon.css';
import Provider from '@acadlix/provider/Provider';
import { Toaster } from 'react-hot-toast';
import AdminLayout from '@acadlix/layout/AdminLayout';
import Addon from './views/addon/Addon';

const AdminAddon = () => {
  return (
    <Provider>
        <Toaster position="bottom-right" />
        <AdminLayout>
            <Addon />
        </AdminLayout>
    </Provider>
  )
}

export default AdminAddon