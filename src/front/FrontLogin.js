import UserAuth from '@acadlix/modules/user-auth/UserAuth'
import React from 'react'
import { useForm } from 'react-hook-form';

const FrontLogin = ({
  redirect_url,
  type = "shortcode", // shortcode
}) => {
  const methods = useForm({
    defaultValues: {
      login_modal: true,
    }
  });

  const onSuccessLogin = () => {
    if (type === "shortcode") {
      if (redirect_url) {
        window.location.href = redirect_url;
      } else {
        window.location.reload();
      }
    }
  }

  const onSuccessRegister = () => {
    if (type === "shortcode") {
      if (redirect_url) {
        window.location.href = redirect_url;
      } else {
        window.location.reload();
      }
    }
  }

  const onSuccessForgotPassword = () => {
    if (type === "shortcode") {
      if (redirect_url) {
        window.location.href = redirect_url;
      } else {
        window.location.reload();
      }
    }
  }

  return (
    <>
      <UserAuth
        isModal={false}
        login_modal={methods?.watch("login_modal")}
        users_can_register={Boolean(Number(acadlixOptions?.users_can_register))}
        ajax_url={acadlixOptions?.ajax_url}
        nonce={acadlixOptions?.nonces?.auth || ""}
        handleClose={() => methods?.setValue("login_modal", false)}
        onSuccessLogin={onSuccessLogin}
        onSuccessRegister={onSuccessRegister}
        onSuccessForgotPassword={onSuccessForgotPassword}
      />
    </>
  )
}

export default FrontLogin