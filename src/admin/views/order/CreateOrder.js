import React from 'react'
import OrderContent from './OrderContent'
import { GetCreateOrder } from '@acadlix/requests/admin/AdminOrderRequest';
import Loader from '@acadlix/components/Loader';

const CreateOrder = () => {
  const {data, isFetching} = GetCreateOrder();

  if (isFetching) {
    return <Loader />;
  }

  return (
    <>
     <OrderContent 
        order_id={null}
        create={true}
        order={null}
        isFetching={isFetching}
        users={data?.data?.users || []}
     /> 
    </>
  )
}

export default CreateOrder
