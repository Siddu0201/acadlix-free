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
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import React from "react";
import CustomTextField from "@acadlix/components/CustomTextField";
import GridItem1 from "@acadlix/components/GridItem1";
import CustomSwitch from "@acadlix/components/CustomSwitch";
import CustomTypography from "@acadlix/components/CustomTypography";
import CustomButton from "@acadlix/components/CustomButton";
import PasswordTextField from "@acadlix/components/PasswordTextField";
import { iconMap } from "@acadlix/helpers/icons";
import { RawHTML } from "@wordpress/element";
import CustomCopyableText from "@acadlix/components/CustomCopyableText";
import { DataGrid } from "@mui/x-data-grid";
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from "@mui/lab";

const HTML_COMPONENTS = [
  "form",
  "div",
  "button",
  "input",
  "select",
  "option",
  "label",
  "span",
  "b",
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "li",
  "table",
  "thead",
  "tbody",
  "tr",
  "td",
  "th",
  "svg",
  "path",
  "img"
];

const COMPONENT_MAP = {
  ...Object.fromEntries(HTML_COMPONENTS.map(tag => [tag, tag])),
  CustomTextField,
  Divider,
  DataGrid,
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
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  // Custom Components
  GridItem1,
  CustomSwitch,
  CustomTypography,
  CustomButton,
  CircularProgress,
  PasswordTextField,
  CustomCopyableText,
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

  // 🟢 NEW — if component is already a valid React element (like <RazorPay />)
  if (React.isValidElement(component)) {
    // clone it to inject props (like {...props})
    const cloned = React.cloneElement(component, { key: index, ...(props || {}) });
    return cloned;
  }

  // 🟢 Otherwise, fallback to your COMPONENT_MAP logic
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
  // return (
  //   <Component
  //     key={index}
  //     {...resolvedProps}
  //   >
  //     {childrenElements || value}
  //   </Component>
  // );
  return (
    <Component
      key={index}
      {...resolvedProps}
    >
      {Array.isArray(childrenElements)
        ? <>{childrenElements}</> // 👈 Wrap array children in Fragment
        : childrenElements || value}
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
    switch (action) {
      case "updateProps":
        return { ...tree, props: payload(tree.props) };

      case "updateValue":
        return { ...tree, value: payload(tree.value) };

      case "addChild": {
        const newChildren = [...(tree.children || [])];
        if (index !== null && index >= 0 && index <= newChildren.length) {
          newChildren.splice(index, 0, payload);
        } else {
          newChildren.push(payload);
        }
        return { ...tree, children: newChildren };
      }

      case "removeProp": {
        const { [payload]: _, ...rest } = tree.props;
        return { ...tree, props: rest };
      }

      case "removeValue":
        return { ...tree, value: undefined };

      case "removeNode":
        return null;

      case "changeComponent":
        return { ...tree, component: payload };

      case "updateChildren":
        return { ...tree, children: payload };

      case "replaceNode":
        return payload;

      case "updateStyle": {
        const sx = { ...(tree.props?.sx || {}), ...(payload || {}) };
        return { ...tree, props: { ...tree.props, sx } };
      }

      case "renameNode":
        return { ...tree, component_name: payload };

      case "duplicateNode": {
        if (!parent) return tree;
        const cloned = JSON.parse(JSON.stringify(tree));
        const idx = parent.children.findIndex(c => c.component_name === name);
        const newChildren = [...parent.children];
        newChildren.splice(idx + 1, 0, cloned);
        return { ...parent, children: newChildren };
      }

      case "wrapNode":
        return {
          component: payload.component || "Box",
          props: payload.props || {},
          children: [tree],
        };

      case "unwrapNode":
        return tree.children && tree.children.length === 1 ? tree.children[0] : tree;
    }
  }

  if (Array.isArray(tree.children)) {
    return {
      ...tree,
      children: tree.children
        .map(child => modifyComponentTree(child, name, action, payload, index))
        .filter(Boolean) // remove nulls
    };
  }

  return tree;
}



