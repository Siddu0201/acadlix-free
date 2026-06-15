import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import Save from './save';
import { __ } from '@wordpress/i18n';


registerBlockType('acadlix/quiz-shortcode', {
  apiVersion: 3,
  title: __('Acadlix Quiz Shortcode', 'acadlix'),
  icon: 'editor-code',
  category: 'text',
  attributes: {
    shortcodeId: {
      type: 'number',
      default: 0,
    },
    template: {
      type: 'string',
      default: '',
    },
    fields: {
      type: 'string',
      default: '',
    },
  },
  edit: Edit,
  save: Save,
});