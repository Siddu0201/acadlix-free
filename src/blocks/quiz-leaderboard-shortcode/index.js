import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import Save from './save';
import { __ } from '@wordpress/i18n';


registerBlockType('acadlix/quiz-leaderboard-shortcode', {
  apiVersion: 3,
  title: __('Acadlix Quiz Leaderboard Shortcode', 'acadlix'),
  icon: 'editor-code',
  category: 'text',
  attributes: {
    shortcodeId: {
      type: 'number',
      default: 0,
    },
  },
  edit: Edit,
  save: Save,
});