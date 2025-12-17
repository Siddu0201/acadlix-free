import UserAuth from '@acadlix/modules/user-auth/UserAuth'
import React from 'react'
import { useForm } from 'react-hook-form';

const FrontLogin = () => {
    const methods = useForm({
        defaultValues: {
            login_modal: true,
        }
    });
    return (
        <>
            <UserAuth
                isModal={false}
                login_modal={methods?.watch("login_modal")}
                users_can_register={Boolean(Number(acadlixOptions?.users_can_register))}
                ajax_url={acadlixOptions?.ajax_url}
                nonce={acadlixOptions?.nonces?.auth || ""}
                handleClose={() => methods?.setValue("login_modal", false)}
            />
        </>
    )
}

export default FrontLogin