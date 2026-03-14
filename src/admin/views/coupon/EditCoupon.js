import Loader from '@acadlix/components/Loader';
import { GetCouponById } from '@acadlix/requests/admin/AdminCouponRequest';
import React from 'react'
import { useParams } from 'react-router-dom';
import CouponContent from './CouponContent';

const EditCoupon = () => {
  const { coupon_id } = useParams();
  const { isFetching, data } = GetCouponById(coupon_id);

  if (isFetching) {
    return <Loader />;
  }

  return (
    <>
      <CouponContent
        coupon_id={coupon_id}
        create={false}
        coupon={data?.data?.coupon}
        isFetching={isFetching}
      />
    </>
  )
}

export default EditCoupon