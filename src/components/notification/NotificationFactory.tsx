import React from 'react';
import { get } from 'lodash';
import Notification from './Notification';
import { NoticeProps } from './Notice';
import ReactDOM from 'react-dom';

type placementType = 
  'right-top' |
  'left-top' |
  'right-bottom' |
  'left-bottom' |
  'center-top';

export interface NotificationOptions {
  message: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  top?: number;
  bottom?: number;
  duration?: number | null;
  onClose?: (e: any) => void;
  placement?: placementType;
}

type messageType = 'info' | 'error' | 'succes' | 'warning';

interface MessageOptions extends NotificationOptions {
  type: messageType;
}

export interface NotificationInstanceProps extends NotificationOptions{
  container: HTMLElement;
}

export interface NotificationInstanceCallbackReturn {
  notice: (noticeProps: NoticeProps) => void,
  removeNotice: (key: string) => void,
  destroy: () => void,
  component: Notification,
  container: HTMLElement
}

class NotificationFactory {
  notifications: { [key: string]: { notification: Notification, div: HTMLDivElement } };
  defaultPlacement = 'right-top';
  constructor() {
    this.notifications = {};
  }
  
  private genClassName = (placement: placementType) => `pb-notifcation-${placement}`;

  private getContainer = (placement: placementType) => {
    if (get(this.notifications, [placement, 'div'], '')) {
      return this.notifications[placement].div;
    }
    const container = document.createElement('div');
    container.className = this.genClassName(placement);
    return container;
  };

  private genNotificationProps = (options: NotificationOptions) => {
    let props: any = {};
    const content = get(options, 'message', '');
    const duration = get(options, 'duration', null);
    props.content = content;
    if (duration) props.duration = duration;
    return props;
  }

  private genMessageProps = (options: MessageOptions) => {
    let props: any = {};
    const content = get(options, 'message', '');
    const duration = get(options, 'duration', 3000);
    const type = get(options, 'type', 'info');
    props.content = content;
    props.duration = duration;
    props.className = `pb-message pb-message-${type}`;
    props.disableIcon = true;
    return props;
  }

  getNotificationInstance = (
    props: NotificationInstanceProps,
    callback: (n: NotificationInstanceCallbackReturn) => void
  ) => {
    const div = props.container || document.createElement('div');
    document.body.appendChild(div);
    let called = false;
    function ref(notification: Notification) {
      if (called) {
        return;
      }
      called = true;
      callback({
        notice: (noticeProps: NoticeProps) => notification.addNotice(noticeProps),
        removeNotice: (key: string) => notification.removeNotice(key),
        component: notification,
        destroy: () => {
          ReactDOM.unmountComponentAtNode(div);
          div.parentNode && div.parentNode.removeChild(div);
        },
        container: div
      });
    }
    ReactDOM.render(<Notification {...props} ref={ref} />, div);
  };

  notice = (options: NotificationOptions) => {
    const placement = get(options, 'placement', this.defaultPlacement) as placementType;
    const div = this.getContainer(placement);
    this.getNotificationInstance({
      container: div,
      ...options
    }, (n: NotificationInstanceCallbackReturn) => {
      this.notifications[placement] = {
        notification: n.component,
        div: div
      }
      n.notice(this.genNotificationProps(options));
    });
  }

  message = (options: MessageOptions) => {
    const messagePlacement = 'center-top';
    const div = this.getContainer(messagePlacement);
    this.getNotificationInstance({
      container: div,
      ...options
    }, (n: NotificationInstanceCallbackReturn) => {
      this.notifications[messagePlacement] = {
        notification: n.component,
        div: n.container as HTMLDivElement
      }
      n.notice(this.genMessageProps(options));
    });
  }
}

export default NotificationFactory;