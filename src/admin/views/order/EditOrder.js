import React from 'react'
import OrderContent from './OrderContent'
import { useParams } from 'react-router-dom';
import Loader from '../../../components/Loader';
import { GetOrderById } from '../../../requests/admin/AdminOrderRequest';

const EditOrder = () => {
  const { order_id } = useParams();
  const { data, isFetching } = GetOrderById(order_id);

  if (isFetching) {
    return <Loader />;
  }

  return (
    <>
      <OrderContent
        order_id={order_id}
        create={false}
        order={data?.data?.order}
        isFetching={isFetching}
      />
    </>
  )
}

export default EditOrder
