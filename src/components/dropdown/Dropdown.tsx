import React, { Component, HTMLAttributes } from 'react';
import Trigger from './Trigger';
import { CommonComponentProps } from '../../common/Interface';

import './style/index.scss';

interface DropdownProps extends CommonComponentProps {
  trigger: ['click', 'hover', 'custom'];
  overlay: React.ReactElement | HTMLElement;
  visiable?: boolean;
  onClick?: Function;
  onVisibleChange?: Function;
}

class Dropdown extends Component<DropdownProps> {
  constructor(props: DropdownProps) {
    super(props);
  }

  componentWillMount() {
    const { trigger, visiable } = this.props;
    if (trigger.indexOf('custom') > -1 && visiable === undefined) {
      console.error('if use custom as trigger then should use visiable too');
    }
  }

  render() {
    const {
      overlay,
      ...other
    } = this.props;
    return (
      <Trigger
        popup={overlay}
        {...other}
      />
    );
  }
}

export default Dropdown;
