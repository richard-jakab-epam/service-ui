/*
 * Copyright 2017 EPAM Systems
 *
 *
 * This file is part of EPAM Report Portal.
 * https://github.com/reportportal/service-ui
 *
 * Report Portal is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Report Portal is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Report Portal.  If not, see <http://www.gnu.org/licenses/>.
 */

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { host } from 'storybook-host';
import { withReadme } from 'storybook-readme';
import { InputConditional } from './inputConditional';
import README from './README.md';

const conditions = [
  {
    value: 'cnt',
    label: 'contains',
    shortLabel: 'cnt',
  },
  {
    value: '!cnt',
    label: 'not contains',
    shortLabel: '!cnt',
    disabled: true,
  },
  {
    value: 'eq',
    label: 'equals',
    shortLabel: 'eq',
  },
  {
    value: '!eq',
    label: 'not equals',
    shortLabel: '!eq',
  },
];

storiesOf('Components/Inputs/InputConditional', module)
  .addDecorator(
    host({
      title: 'Input conditional component',
      align: 'center middle',
      backdrop: 'rgba(70, 69, 71, 0.2)',
      background: '#ffffff',
      height: 32,
      width: 300,
    }),
  )
  .addDecorator(withReadme(README))
  .add('default state', () => <InputConditional />)
  .add('touched & error state', () => <InputConditional touched error={'error'} />)
  .add('with value & conditions', () => (
    <InputConditional
      conditions={conditions}
      value={{
        condition: '!eq',
        value: 'some entered value',
      }}
    />
  ))
  .add('with placeholder', () => (
    <InputConditional
      conditions={conditions}
      placeholder={'placeholder text'}
      value={{
        condition: '!eq',
        value: '',
      }}
    />
  ))
  .add('disabled state', () => (
    <InputConditional
      disabled
      conditions={conditions}
      value={{
        condition: '!eq',
        value: 'some entered value',
      }}
    />
  ))
  .add('with actions', () => (
    <InputConditional
      conditions={conditions}
      value={{
        condition: '!eq',
        value: 'some entered value',
      }}
      onChange={action('change')}
      onFocus={action('focused')}
      onBlur={action('blur')}
    />
  ));
