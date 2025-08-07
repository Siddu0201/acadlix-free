import {
  TextField,
  Autocomplete,
  Switch,
  Checkbox,
  Button,
  Box,
  Typography,
  Divider,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  Radio,
  Alert,
  FormLabel,
  RadioGroup,
  Chip,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Tooltip,
  FormHelperText,
  InputLabel,
  InputAdornment,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import React from "react";
import CustomTextField from "@acadlix/components/CustomTextField";
import { Controller } from "react-hook-form";
import GridItem1 from "@acadlix/components/GridItem1";
import CustomSwitch from "@acadlix/components/CustomSwitch";
import CustomTypography from "@acadlix/components/CustomTypography";
import CustomButton from "@acadlix/components/CustomButton";
import PasswordTextField from "@acadlix/components/PasswordTextField";

const COMPONENT_MAP = {
  CustomTextField,
  Divider,
  Select,
  MenuItem,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  Autocomplete,
  Switch,
  Checkbox,
  Button,
  Box,
  Grid,
  // Custom Components
  GridItem1,
  CustomSwitch,
  CustomTypography,
  CustomButton,
  PasswordTextField,
  Typography,
  Alert,
  Chip,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Tooltip,
  FormHelperText,
  InputLabel,
  InputAdornment,
  Fragment: React.Fragment,
};

// export const renderMUIComponent = (field, formContext = {}) => {
//   if (!field || typeof field !== "object") return null;

//   const { name, component, props = {}, value, children = [] } = field;
//   const Component = COMPONENT_MAP[component];
//   if (!Component) return null;

//   const registeredProps =
//     formContext?.register && name ? formContext.register(name) : {};

//   const childElements = Array.isArray(children)
//     ? children.map((child, idx) => (
//         <React.Fragment key={`${name || component}-${idx}`}>
//           {renderMUIComponent(child, formContext)}
//         </React.Fragment>
//       ))
//     : null;

//   return (
//     <Component key={name || component} {...registeredProps} {...props}>
//       {value}
//       {childElements}
//     </Component>
//   );
// };

const resolveComponentInProps = async (propObj, register, name, formProps) => {
  const result = {};

  if (!propObj || typeof propObj !== 'object') return result;

  for (const [key, value] of Object.entries(propObj)) {
    if (typeof value === "object" && value?.component) {
      const Component = COMPONENT_MAP[value.component];
      const resolvedNestedProps = await resolveComponentInProps(value.props, register, name, formProps);
      result[key] = (params) => (
        <Component {...params} {...resolvedNestedProps} />
      );
    } else {
      result[key] = value;
    }
  }

  return result;
};

const handleChangeUniversal = (field) => (...args) => {
  if (args.length === 1) {
    const event = args[0];
    field.onChange(event?.target?.value ?? event);
  } else if (args.length === 2) {
    const [, value] = args;
    field.onChange(value);
  }
};

export const renderMUIComponent = async (item, index, formProps = {}) => {
  const { component, props, children, value, name } = item;
  const Component = COMPONENT_MAP[component];
  if (!Component) return null;

  const rawProps = typeof props === "function" ? await props() : props;
  const resolvedProps = await resolveComponentInProps(rawProps, formProps?.register, name, formProps);

  let childrenElements = null;
  if (children && Array.isArray(children)) {
    childrenElements = await Promise.all(
      children.map((child, idx) =>
        renderMUIComponent(child, idx, formProps)
      )
    );
  }

  // if (name && formProps?.control) {
  //   console.log(resolvedProps);
  //   return (
  //     <Controller
  //       key={index}
  //       name={name}
  //       control={formProps.control}
  //       render={({ field }) => (
  //         <Component
  //           {...resolvedProps}
  //           {...field}
  //           // onChange={handleChangeUniversal(field)}
  //         >
  //           {childrenElements || value}
  //         </Component>
  //       )}
  //     />
  //   );
  // }
  // console.log(resolvedProps);
  return (
    <Component
      key={index}
      {...resolvedProps}
    >
      {childrenElements || value}
    </Component>
  );
};

export const DynamicMUIRenderer = ({ item, index, formProps }) => {
  const [componentEl, setComponentEl] = React.useState(null);

  React.useEffect(() => {
    const renderComponent = async () => {
      const element = await renderMUIComponent(item, index, formProps);
      setComponentEl(element);
    };
    renderComponent();
  }, [item, index, formProps]);

  return componentEl;
};


