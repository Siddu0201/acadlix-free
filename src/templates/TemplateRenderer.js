import React from 'react'
import { templateRegistry } from './templateRegistery';
import PropTypes from 'prop-types';

const TemplateRenderer = ({
  type = "certificates",
  subtype = "course",
  template = "modern-landscape",
  ...props
}) => {
  let Component;

  if (subtype) {
    Component = templateRegistry[type]?.[subtype]?.[template];
  } else {
    Component = templateRegistry[type]?.[template];
  }

  if (!Component) {
    return <div>Template not found</div>;
  }

  return <Component {...props} />;
}

export default TemplateRenderer

TemplateRenderer.propTypes = {
    type: PropTypes.string.isRequired,
    subtype: PropTypes.string,
    template: PropTypes.string.isRequired,
};