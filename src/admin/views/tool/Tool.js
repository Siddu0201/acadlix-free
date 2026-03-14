import React from 'react'
import ToolContent from './ToolContent'

const Tool = ({
  selected = 'import_export',
  filteredToolRoutes = []
}) => {
  return (
    <ToolContent
      selected={selected}
      filteredToolRoutes={filteredToolRoutes}
    />
  )
}

export default Tool