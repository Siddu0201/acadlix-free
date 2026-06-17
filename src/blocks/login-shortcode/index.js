import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import Save from './save';
import { __ } from '@wordpress/i18n';


registerBlockType('acadlix/login-shortcode', {
  apiVersion: 3,
  title: __('Acadlix Login', 'acadlix'),
  icon: 'editor-code',
  category: 'text',
  attributes: {
    redirectUrl: {
      type: 'string',
      default: '',
    },
     redirectId: {
      type: 'number',
      default: 0,
    },
  },
  edit: Edit,
  save: Save,
});