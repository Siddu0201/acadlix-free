import Loader from '@acadlix/components/Loader';
import { GetUpdateSetting } from '@acadlix/requests/admin/AdminSettingRequest';
import React from 'react'
import SettingContent from './SettingContent';

const Setting = ({ selected = 'general' }) => {
  const {isFetching, data} = GetUpdateSetting();

  if(isFetching)
  {
    return <Loader />
  }

  return (
    <SettingContent
      options={data?.data?.options}
      all_pages={data?.data?.all_pages}
      currencies_with_symbol={data?.data?.currencies_with_symbol}
      selected={selected}
    />
  )
}

export default Setting