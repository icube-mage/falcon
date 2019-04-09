import React from 'react';
import { Box } from '@deity/falcon-ui';
import axios from 'axios';

class SnapPayment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: this.props.orderid
    };
  }

  componentDidMount() {
    const snapPayment = window.snap;
    const { orderId } = this.state;
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
        axios
          .get(
            `http://localhost:4000/graphql?query={
          failSnap(order_id: ${orderId}) {
            redirect
            quote_id
          }
        }`
          )
          .then(res => {
            console.log(res.data);
          });
      }
    });
  }

  render() {
    return <Box />;
  }
}

export default SnapPayment;
