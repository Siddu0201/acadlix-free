import React, {useEffect} from "react";
import {
  CardHeader,
  CardContent,
  Button,
  Card,
  Grid,
  Typography,
} from "@mui/material";
import GridItem1 from "../../../../components/GridItem1";

function MatrixSortingChoice() {
  return (
    <Card>
      <CardHeader title="Matrix Sorting Choice"
      titleTypographyProps={{
        variant: 'h6'
      }}
      ></CardHeader>
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={12}>
            <Option title="Option1" criteria="crt1" element="elm1" />
          </Grid>
          <Grid item xs={12} lg={12}>
            <Option title="Option2" criteria="crt2" element="elm2" />
          </Grid>
          <Grid item xs={12} lg={12}>
            <Button variant="contained" color="success">
              Add More
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

const Option = ({ title, criteria, element }) => {
  const loadEditor = (key, name = '') => {
    window.wp.editor.initialize(key,{
        tinymce: {
            wpautop: true,
            plugins : 'charmap colorpicker hr lists paste tabfocus textcolor fullscreen wordpress wpautoresize wpeditimage wpemoji wpgallery wplink wptextpattern',
            toolbar1: 'formatselect,bold,italic,bullist,numlist,blockquote,alignleft,aligncenter,alignright,link,wp_more,spellchecker,fullscreen,wp_adv,listbuttons',
            toolbar2: 'styleselect,strikethrough,hr,forecolor,pastetext,removeformat,charmap,outdent,indent,undo,redo,wp_help',
            textarea_rows : 15,
            setup: function(editor){
                editor.on('input change', function(){
                    // console.log(editor.getContent());
                })
            }
        },
        quicktags: true,
        mediaButtons: true
    });
  }

  const removeEditor = (key) => {
      window.wp.editor.remove(key);
  }

  const loadData = () => {
    loadEditor(criteria);
    loadEditor(element);
  }

  useEffect(() => {
    loadData();
    window.addEventListener('load', loadData);
    
    return () => {
      removeEditor(criteria);
      removeEditor(element);
      window.removeEventListener('load', loadData);
    }
  },[]);
  return (
    <Card>
      <CardHeader title={title}
      titleTypographyProps={{
        variant: 'h6'
      }}></CardHeader>
      <CardContent sx={{
        paddingTop: 1
      }}>
        <Grid container spacing={2}>
          <Grid item xs={6} lg={6}>
            <Typography variant="body1" sx={{
              fontWeight: 500,
              marginY: 2
            }}>
              Criteria
            </Typography>
            <textarea 
              id={criteria} 
              style={{
                width: '100%'
              }}
            />
          </Grid>
          <Grid item xs={6} lg={6}>
            <Typography variant="body1" sx={{
              fontWeight: 500,
              marginY: 2
            }}>
              Sort Element
            </Typography>
            <textarea 
              id={element} 
              style={{
                width: '100%'
              }}
            />
          </Grid>
          <GridItem1 lg={12} xs={12}>
            <Button variant="contained" color="error">
              Delete
            </Button>
          </GridItem1>
        </Grid>
      </CardContent>
    </Card>
  );
};
export default MatrixSortingChoice;
