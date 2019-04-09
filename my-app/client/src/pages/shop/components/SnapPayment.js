import React from 'react';
import { Box } from '@deity/falcon-ui';

class SnapPayment extends React.Component {
  componentDidMount() {
    const snapPayment = window.snap;
    snapPayment.pay(this.props.snaptoken, {
      // Optional
      onSuccess(result) {
        /* You may add your own js here, this is just example */ document.getElementById(
          'result-json'
        ).innerHTML += JSON.stringify(result, null, 2);
      },
      // Optional
      onPending(result) {
        /* You may add your own js here, this is just example */ document.getElementById(
          'result-json'
        ).innerHTML += JSON.stringify(result, null, 2);
      },
      // Optional
      onError(result) {
        /* You may add your own js here, this is just example */ document.getElementById(
          'result-json'
        ).innerHTML += JSON.stringify(result, null, 2);
      },
      onClose() {
        /* You may add your own js here, this is just example */ document.getElementById(
          'result-json'
        ).innerHTML += JSON.stringify('', null, 2);
      }
    });
  }

  render() {
    return <Box />;
  }
}

export default SnapPayment;
