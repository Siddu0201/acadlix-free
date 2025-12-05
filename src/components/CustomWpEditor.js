import React from 'react';
import PropTypes from 'prop-types';

/**
 * CustomWpEditor - Reusable controlled WP editor component
 *
 * Props:
 *   id: unique editor id (required)
 *   name: field name (optional)
 *   value: content value (controlled)
 *   onChange: function(newValue) (required)
 *   options: WP editor options (optional)
 *   style: textarea style (optional)
 */
const CustomWpEditor = ({
    id,
    value = '',
    onChange,
    options = {},
    style = {},
    ...rest
}) => {
    const textareaRef = React.useRef();
    const editorRef = React.useRef();

    // Default editor options
    const defaultOptions = React.useMemo(() => ({
        tinymce: {
            wpautop: true,
            plugins:
                'charmap colorpicker hr lists paste tabfocus textcolor fullscreen wordpress wpautoresize wpeditimage wpemoji wpgallery wplink wptextpattern wpview',
            toolbar1:
                'formatselect,bold,italic,bullist,numlist,blockquote,alignleft,aligncenter,alignright,link,wp_more,spellchecker,wp_adv,listbuttons',
            toolbar2:
                'styleselect,strikethrough,hr,forecolor,pastetext,removeformat,charmap,outdent,indent,undo,redo,wp_help',
            textarea_rows: 8,
        },
        quicktags: true,
        mediaButtons: true,
        ...options,
    }), [options]);

    // Initialize editor
    React.useEffect(() => {
        if (!window.wp?.editor || !textareaRef.current) return;
        window.wp.editor.initialize(id, {
            ...defaultOptions,
            tinymce: {
                ...defaultOptions.tinymce,
                setup: function (editor) {
                    editorRef.current = editor;
                    editor.on('input change', function () {
                        const content = window.wp.editor.getContent(id);
                        if (typeof onChange === 'function') {
                            onChange(content);
                        }
                    });
                },
            },
        });
        return () => {
            if (window.wp?.editor) {
                window.wp.editor.remove(id);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Sync value from React to editor (only for tinymce, not textarea)
    // React.useEffect(() => {
    //     if (window.tinymce && window.tinymce.get(id)) {
    //         const editor = window.tinymce.get(id);
    //         if (editor && editor.getContent() !== value) {
    //             editor.setContent(value || '');
    //         }
    //     }
    // }, [id, value]);

    return (
        <textarea
            id={id}
            ref={textareaRef}
            value={value}
            onChange={(e) => {
                let inputValue = e?.target?.value;
                if (window.tinymce) {
                    const editor = window.tinymce.get(id);
                    if (editor) {
                        editor.setContent(inputValue || "");
                    }
                }
                if (typeof onChange === 'function') {
                    onChange(value);
                }
            }}
            style={{ width: '100%', minHeight: 120, ...style }}
            {...rest}
        />
    );
};

CustomWpEditor.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.object,
    style: PropTypes.object,
};

export default CustomWpEditor;