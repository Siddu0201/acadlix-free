import React, {useEffect} from "react";
import {
  CardHeader,
  CardContent,
  FormControlLabel,
  Button,
  Checkbox,
  Card,
  Grid,
} from "@mui/material";

function MultipleChoice() {
  return (
    <Card>
      <CardHeader title="Multiple Choice"
      titleTypographyProps={{
        variant: 'h6'
      }}
      ></CardHeader>
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={12}>
            <Option title="Option1" id="opt1" />
          </Grid>
          <Grid item xs={12} lg={12}>
            <Option title="Option2" id="opt2" />
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
const Option = ({ title, id }) => {
  const loadEditor = (key, name = '') => {
    window.wp.editor.initialize(key,{
        tinymce: {
            wpautop: true,
            plugins : 'charmap colorpicker hr lists paste tabfocus textcolor fullscreen wordpress wpautoresize wpeditimage wpemoji wpgallery wplink wptextpattern',
            toolbar1: 'formatselect,bold,italic,bullist,numlist,blockquote,alignleft,aligncenter,alignright,link,wp_more,spellchecker,fullscreen,wp_adv,listbuttons',
            toolbar2: 'styleselect,strikethrough,hr,forecolor,pastetext,removeformat,charmap,outdent,indent,undo,redo,wp_help',
            textarea_rows : 20,
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

  useEffect(() => {
    loadEditor(id);
    window.addEventListener('load', loadEditor.bind(this, id));
    
    return () => {
      removeEditor(id);
      window.removeEventListener('load', loadEditor.bind(this, id));
    }
  },[]);

  return (
    <Card>
      <CardHeader title={title}
      titleTypographyProps={{
        variant: 'h6'
      }}
      ></CardHeader>
      <CardContent sx={{
        paddingTop: 1
      }}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={2}>
            <FormControlLabel control={<Checkbox />} label="Correct" />
            <Button variant="contained" color="error">
              Delete
            </Button>
          </Grid>
          <Grid item xs={12} lg={10}>
            <textarea 
              id={id} 
              style={{
                width: '100%'
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
export default MultipleChoice;
