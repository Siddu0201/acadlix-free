import { DialogContent, DialogTitle, IconButton } from '@mui/material'
import React from 'react'
import { IoClose } from '@acadlix/helpers/icons'
import { __ } from '@wordpress/i18n'

const SectionModal = (props) => {
  return (
    <>
      <DialogTitle id="alert-section-title" sx={{ m: 0, p: 2 }}>
        {__("Add Section", "acadlix")}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={props?.handleSectionClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <IoClose />
      </IconButton>
      <DialogContent
        sx={{
          padding: "1rem !important",
        }}
      >{__("Add/ edit", "acadlix")}</DialogContent>
    </>
  )
}

export default SectionModal
