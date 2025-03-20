import React from 'react'
import OrderContent from './OrderContent'

const CreateOrder = () => {

  return (
    <>
     <OrderContent 
        order_id={null}
        create={true}
        order={null}
        isFetching={false}
     /> 
    </>
  )
}

export default CreateOrder
