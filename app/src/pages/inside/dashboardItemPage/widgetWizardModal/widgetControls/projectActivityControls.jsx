import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getFormValues, initialize } from 'redux-form';
import { FieldProvider } from 'components/fields/fieldProvider';
import { injectIntl, defineMessages, intlShape } from 'react-intl';
import { URLS } from 'common/urls';
import { arrayRemoveDoubles, validate } from 'common/utils';
import { GROUP_TO_ACTION_MAP, ACTION_TO_GROUP_MAP } from 'common/constants/actionTypes';
import { activeProjectSelector } from 'controllers/user';
import { getWidgetCriteriaOptions } from './utils/getWidgetCriteriaOptions';
import { USER_ACTIONS_OPTIONS, ITEMS_INPUT_WIDTH, CONTENT_FIELDS } from './constants';
import { DropdownControl, InputControl, TagsControl } from './controls';
import { WIDGET_WIZARD_FORM } from '../widgetWizardContent/wizardControlsSection/constants';

const DEFAULT_ITEMS_COUNT = '50';
const messages = defineMessages({
  CriteriaFieldLabel: {
    id: 'ProjectActivityControls.CriteriaFieldLabel',
    defaultMessage: 'Criteria for widget',
  },
  ItemsFieldLabel: {
    id: 'ProjectActivityControls.ItemsFieldLabel',
    defaultMessage: 'Items',
  },
  UsernameControlText: {
    id: 'ProjectActivityControls.UsernameControlText',
    defaultMessage: 'User name',
  },
  UsersPlaceholder: {
    id: 'ProjectActivityControls.UsersPlaceholder',
    defaultMessage: 'Enter user name',
  },
  UsersFocusPlaceholder: {
    id: 'ProjectActivityControls.UsersFocusPlaceholder',
    defaultMessage: 'At least 3 symbols required.',
  },
  UsersNoMatches: {
    id: 'ProjectActivityControls.UsersNoMatches',
    defaultMessage: 'No matches found.',
  },
  ItemsValidationError: {
    id: 'ProjectActivityControls.ItemsValidationError',
    defaultMessage: 'Items count should have value from 1 to 150',
  },
  ActionTypesValidationError: {
    id: 'ProjectActivityControls.ActionTypesValidationError',
    defaultMessage: 'You must select at least one item',
  },
});
const validators = {
  items: (formatMessage) => (value) =>
    (!value || !validate.widgetItems(value, 1, 150)) &&
    formatMessage(messages.ItemsValidationError),
  actionType: (formatMessage) => (value) =>
    (!value || !value.length) && formatMessage(messages.ActionTypesValidationError),
};

@injectIntl
@connect(
  (state) => ({
    widgetSettings: getFormValues(WIDGET_WIZARD_FORM)(state),
    usernamesSearchUrl: URLS.projectUsernamesSearch(activeProjectSelector(state)),
  }),
  {
    initializeWizardSecondStepForm: (data) =>
      initialize(WIDGET_WIZARD_FORM, data, true, { keepValues: true }),
  },
)
export class ProjectActivityControls extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    widgetSettings: PropTypes.object.isRequired,
    usernamesSearchUrl: PropTypes.string.isRequired,
    initializeWizardSecondStepForm: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const { intl, widgetSettings, initializeWizardSecondStepForm } = props;
    this.criteria = getWidgetCriteriaOptions([USER_ACTIONS_OPTIONS], intl.formatMessage);
    initializeWizardSecondStepForm({
      actionType: this.parseActionTypes(widgetSettings.actionType || this.criteria),
      itemsCount: widgetSettings.itemsCount || DEFAULT_ITEMS_COUNT,
      userRef: widgetSettings.userRef || [],
      content_fields: [
        CONTENT_FIELDS.NAME,
        CONTENT_FIELDS.USER_REF,
        CONTENT_FIELDS.LAST_MODIFIED,
        CONTENT_FIELDS.ACTION_TYPE,
        CONTENT_FIELDS.OBJECT_TYPE,
        CONTENT_FIELDS.PROJECT_REF,
        CONTENT_FIELDS.LOGGED_OBJECT_REF,
        CONTENT_FIELDS.HISTORY,
      ],
      filter_id: '',
    });
  }

  formatActionTypes = (criteries) =>
    arrayRemoveDoubles(criteries.map((criteria) => ACTION_TO_GROUP_MAP[criteria] || criteria));
  parseActionTypes = (criteries) => {
    if (!criteries) {
      return this.props.widgetSettings.actionType;
    }
    return criteries
      .map((criteria) => {
        const value = criteria.value || criteria;
        return GROUP_TO_ACTION_MAP[value] || value;
      })
      .reduce((acc, val) => acc.concat(val), []);
  };

  parseItems = (value) => (value.length < 4 ? value : this.props.widgetSettings.itemsCount);

  formatUsernames = (values) => values.map((value) => ({ value, label: value }));
  parseUsernames = (values) => values.map((value) => value.value);

  render() {
    const { intl, usernamesSearchUrl } = this.props;
    return (
      <Fragment>
        <FieldProvider
          name="actionType"
          format={this.formatActionTypes}
          parse={this.parseActionTypes}
          validate={validators.actionType(intl.formatMessage)}
        >
          <DropdownControl
            fieldLabel={intl.formatMessage(messages.CriteriaFieldLabel)}
            multiple
            selectAll
            options={this.criteria}
          />
        </FieldProvider>
        <FieldProvider
          name="itemsCount"
          validate={validators.items(intl.formatMessage)}
          parse={this.parseItems}
        >
          <InputControl
            fieldLabel={intl.formatMessage(messages.ItemsFieldLabel)}
            inputWidth={ITEMS_INPUT_WIDTH}
            type="number"
          />
        </FieldProvider>
        <FieldProvider name="userRef" format={this.formatUsernames} parse={this.parseUsernames}>
          <TagsControl
            fieldLabel={intl.formatMessage(messages.UsernameControlText)}
            placeholder={intl.formatMessage(messages.UsersPlaceholder)}
            focusPlaceholder={intl.formatMessage(messages.UsersFocusPlaceholder)}
            nothingFound={intl.formatMessage(messages.UsersNoMatches)}
            minLength={3}
            async
            uri={usernamesSearchUrl}
            makeOptions={this.formatUsernames}
            multi
            removeSelected
          />
        </FieldProvider>
      </Fragment>
    );
  }
}
