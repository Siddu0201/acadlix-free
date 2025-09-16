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

export const modifyComponentTree = (tree, name, action, payload) => {
  if (!tree) return tree;

  if (tree.props?.component_name === name) {
    if (action === "updateProps") {
      return { ...tree, props: payload(tree.props) };
    }
    if (action === "addChild") {
      return { ...tree, children: [...(tree.children || []), payload] };
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



