import React, {useEffect } from 'react'
import { MediaUpload } from '@wordpress/media-utils'
import { Button } from '@mui/material'

const Testing = () => {

    const loadEditor = (key) => {
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
        setTimeout(() =>{
            loadEditor('texteditor');
        },0);

        return () => {
           clearTimeout();
           removeEditor('texteditor');
        }
    },[]);


  return (
    <div>
        <MediaUpload
            onSelect={(media) => console.log(media)}
            render={({open}) => (
                <Button variant='outlined' onClick={ open }>Open Media Library</Button>
            )}
        />
            <textarea id='texteditor' />


      <div onClick={removeEditor}>
       <button>Remove</button>

      </div>

       
    </div>
  )
}

export default Testing
