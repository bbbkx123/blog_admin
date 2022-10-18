import { PageContainer } from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Alert, Card, Typography, message } from 'antd';
import React from 'react';
import styles from './Welcome.less';
import { isNil } from 'lodash';
import {
  history,
  // Link
} from '@umijs/max';

// const CodePreview: React.FC = ({ children }) => (
//   <pre className={styles.pre}>
//     <code>
//       <Typography.Text copyable>{children}</Typography.Text>
//     </code>
//   </pre>
// );

const Welcome: React.FC = () => {
  // const intl = useIntl();

  React.useEffect(() => {
    const user: any = JSON.parse(localStorage.getItem('user') as string);
    if (isNil(user)) {
      message.warning('请登录OvO');
      history.push('/user/login');
    }
  }, []);

  return (
    <PageContainer>
      <Card>
        <Alert
          // message={intl.formatMessage({
          //   id: 'pages.welcome.alertMessage',
          //   defaultMessage: 'Faster and stronger heavy-duty components have been released.',
          // })}
          message="欢迎使用"
          type="success"
          showIcon
          banner
          style={{
            margin: -12,
            marginBottom: 24,
          }}
        />
        <Typography.Text strong>
          <a
            href="https://procomponents.ant.design/components/table"
            rel="noopener noreferrer"
            target="__blank"
          >
            {/* <FormattedMessage id="pages.welcome.link" defaultMessage="Welcome" /> */}
            kkkiana-admin power by antd pro
          </a>
        </Typography.Text>
        {/* <CodePreview>yarn add @ant-design/pro-components</CodePreview> */}
      </Card>
    </PageContainer>
  );
};

export default Welcome;
