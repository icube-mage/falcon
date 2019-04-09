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
        console.log(result);
      },
      onClose() {
        console.log('close');
      }
    });
  }

  render() {
    return <Box />;
  }
}

export default SnapPayment;
