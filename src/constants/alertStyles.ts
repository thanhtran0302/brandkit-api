interface AlertStyle {
  'border-radius': string;
  background: string;
  border: string;
  color: string;
}

const commonStyle = {
  'border-radius': '3px'
};

const primaryStyle: AlertStyle = {
  ...commonStyle,
  background: '#B7DBD3',
  border: `1px solid #3CD3AB`,
  color: '#1DD1A1'
};

const secondaryStyle: AlertStyle = {
  ...commonStyle,
  background: '#BACCDF',
  border: '1px solid #4A94DE',
  color: '#2E86DE'
};

export default {
  name: 'Alert',
  description: 'Alert component for feedback.',
  primaryStyle,
  secondaryStyle
};
