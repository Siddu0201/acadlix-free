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
  CardMedia,
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
  CircularProgress,
  CardActions,
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
import { iconMap } from "@acadlix/helpers/icons";
import { RawHTML } from "@wordpress/element";

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
  Typography,
  Alert,
  Chip,
  Card,
  CardMedia,
  CardContent,
  CardHeader,
  CardActions,
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
  // Custom Components
  GridItem1,
  CustomSwitch,
  CustomTypography,
  CustomButton,
  CircularProgress,
  PasswordTextField,
  RawHTML,
  Fragment: React.Fragment,
};

const FUNCTION_PROPS = ["renderInput", "renderOption", "renderValue"];

const resolveComponentInProps = async (propObj, register, name, formProps) => {
  const result = {};

  if (!propObj || typeof propObj !== 'object') return result;

  for (const [key, value] of Object.entries(propObj)) {
    if (typeof value === "object" && value?.component) {
      const Component = COMPONENT_MAP[value.component];
      const resolvedNestedProps = await resolveComponentInProps(value.props, register, name, formProps);
      // result[key] = (params) => (
      //   <Component {...params} {...resolvedNestedProps} />
      // );
      if (FUNCTION_PROPS.includes(key)) {
        // ✅ For function-style props (Autocomplete etc.)
        result[key] = (params) => (
          <Component {...params} {...resolvedNestedProps} />
        );
      } else {
        // ✅ For element-style props (control, endAdornment, icon etc.)
        result[key] = <Component {...resolvedNestedProps} />;
      }
    } else if (typeof value === "function") {
      // 🔑 pass formProps into functions
      result[key] = (...args) => value(...args, formProps);
    } else {
      result[key] = value;
    }
  }

  return result;
};


export const renderMUIComponent = async (item, index, formProps = {}) => {
  const { component, props, children, value, name } = item;
  const Component = COMPONENT_MAP[component];
  // ✅ If not found, check iconMap
  if (!Component && iconMap[component]) {
    return React.cloneElement(iconMap[component], { key: index, ...(props || {}) });
  }
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
      if (item.component_name) {
        formProps.refs = formProps.refs || {};
        formProps.refs[item.component_name] = element;
      }
      setComponentEl(element);
    };
    renderComponent();
  }, [item, index, formProps]);

  return componentEl;
};

export const modifyComponentTree = (tree, name, action, payload, index = null) => {
  if (!tree) return tree;

  if (tree.component_name === name) {
    if (action === "updateProps") {
      return { ...tree, props: payload(tree.props) };
    }
    if (action === "updateValue") {
      return { ...tree, value: payload(tree.value) };
    }
    if (action === "addChild") {
      let newChildren = [...(tree.children || [])];
      if (index !== null && index >= 0 && index <= newChildren.length) {
        newChildren.splice(index, 0, payload); // insert at given index
      } else {
        newChildren.push(payload); // fallback to push
      }
      return { ...tree, children: newChildren };
    }
    if (action === "removeProp") {
      const { [payload]: _, ...rest } = tree.props;
      return { ...tree, props: rest };
    }
    if (action === "removeNode") {
      return null; // mark for deletion
    }
  }

  if (Array.isArray(tree.children)) {
    return {
      ...tree,
      children: tree.children
        .map(child => modifyComponentTree(child, name, action, payload))
        .filter(Boolean) // remove nulls
    };
  }

  return tree;
}



