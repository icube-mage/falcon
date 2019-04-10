import React from 'react';
import axios from 'axios';
import { Box } from '@deity/falcon-ui';
import { Redirect } from 'react-router-dom';

class SnapPayment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: this.props.orderid,
      redirect: ''
    };
  }

  componentDidMount() {
    const snapPayment = window.snap;
    const { orderId } = this.state;
    const snapPaymentOb = this;
    snapPayment.pay(this.props.snaptoken, {
      // Optional
      onSuccess(result) {
        if (result.va_numbers != null) {
          snapPaymentOb.setState({
            redirect: 'confirmation'
          });
        }
        snapPaymentOb.setState({
          redirect: 'confirmation'
        });
      },
      // Optional
      onPending(result) {
        if (result.va_numbers != null) {
          snapPaymentOb.setState({
            redirect: 'confirmation'
          });
        }
        snapPaymentOb.setState({
          redirect: 'confirmation'
        });
      },
      // Optional
      onError(result) {
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
            console.log(result.status_message);
            console.log(res.data);
          });
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
    if (this.state.redirect === 'confirmation') {
      return <Redirect to="/checkout/confirmation" />;
    }
    return <Box />;
  }
}

export default SnapPayment;
