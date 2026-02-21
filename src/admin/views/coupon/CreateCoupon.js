import React from 'react'
import CouponContent from './CouponContent'

const CreateCoupon = () => {
  return (
    <>
      <CouponContent
        coupon_id={null}
        create={true}
        coupon={null}
        isFetching={false}
      />
    </>
  )
}

export default CreateCoupon