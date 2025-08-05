import DesignTypography from '@acadlix/modules/theme/DesignTypography'
import Palette from '@acadlix/modules/theme/Palette'
import React from 'react'

const DesignSections = (props) => {
  return (
    <>
        {
            props?.selected === 'palette' && <Palette free={true} {...props} />
        }
        {
          props?.selected === 'typography' && <DesignTypography free={true} {...props} />
        }
    </>
  )
}

export default DesignSections