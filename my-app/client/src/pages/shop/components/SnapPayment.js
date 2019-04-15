import React from 'react';
import axios from 'axios';
import { Box } from '@deity/falcon-ui';
import { Redirect } from 'react-router-dom';

const SERVER_HTTP = {
  linkUrl: 'http://localhost:4000/graphql'
};

class SnapPayment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: this.props.orderid,
      quoteId: this.props.quoteId,
      redirect: ''
    };
  }

  componentWillMount() {
    const snapPayment = window.snap;
    const { orderId, quoteId } = this.state;
    const snapPaymentOb = this;
    snapPayment.pay(this.props.snaptoken, {
      // Optional
      onSuccess(result) {
        if (result.va_numbers != null) {
          axios
            .get(
              `${SERVER_HTTP.linkUrl}?query={
          vacodeSnap(va: ${result.va_numbers[0].va_number}, oid : ${result.order_id}) {
            success
          }
        }`
            )
            .then(res => {
              if (res.data) {
                snapPaymentOb.setState({
                  redirect: 'confirmation'
                });
              }
            });
        }
        snapPaymentOb.setState({
          redirect: 'confirmation'
        });
        axios
          .get(
            `${SERVER_HTTP.linkUrl}?query={
          removeCart {
            success
          } 
        }`
          )
          .then(res => {
            if (res.data) {
              console.log(res.data);
            }
          });
      },
      // Optional
      onPending(result) {
        if (result.va_numbers != null) {
          axios
            .get(
              `${SERVER_HTTP.linkUrl}?query={
          vacodeSnap(va: ${result.va_numbers[0].va_number}, oid : ${result.order_id}) {
            success
          }
        }`
            )
            .then(res => {
              if (res.data) {
                snapPaymentOb.setState({
                  redirect: 'confirmation'
                });
              }
            });
        }
        snapPaymentOb.setState({
          redirect: 'confirmation'
        });
        axios
          .get(
            `${SERVER_HTTP.linkUrl}?query={
          removeCart {
            success
          } 
        }`
          )
          .then(res => {
            if (res.data) {
              console.log(res.data);
            }
          });
      },
      // Optional
      onError(result) {
        axios
          .get(
            `${SERVER_HTTP.linkUrl}?query={
          failSnap(order_id: ${orderId}, quote_id: "${quoteId}") {
            redirect
            quote_id
          }
        }`
          )
          .then(response => {
            console.log(result.message);
            console.log(response.data);
            snapPaymentOb.setState({
              redirect: 'cart'
            });
          });
      },
      onClose() {
        axios
          .get(
            `${SERVER_HTTP.linkUrl}?query={
          failSnap(order_id: ${orderId}, quote_id: "${quoteId}") {
            redirect
            quote_id
          }
        }`
          )
          .then(response => {
            console.log(response.data);
            snapPaymentOb.setState({
              redirect: 'cart'
            });
          });
      }
    });
  }

  render() {
    if (this.state.redirect === 'confirmation') {
      return <Redirect to="/checkout/confirmation" />;
    }
    if (this.state.redirect === 'cart') {
      return (
        <Redirect
          to={{
            pathname: '/cart',
            state: { id: 'snap', order_id: this.state.orderId }
          }}
        />
      );
    }
    return <Box />;
  }
}

export default SnapPayment;
