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
      },
      // Optional
      onError(result) {
        axios
          .get(
            `${SERVER_HTTP.linkUrl}?query={
          createCart {
            quoteId
          }
        }`
          )
          .then(res => {
            console.log(result.message);
            console.log(res.data.data.createCart.quoteId);
            axios
              .get(
                `${SERVER_HTTP.linkUrl}?query={
          failSnap(order_id: ${orderId}, quote_id: "${res.data.data.createCart.quoteId}") {
            redirect
            quote_id
          }
        }`
              )
              .then(response => {
                console.log(response.data);
              });
          });
      },
      onClose() {
        axios
          .get(
            `${SERVER_HTTP.linkUrl}?query={
          createCart {
            quoteId
          }
        }`
          )
          .then(res => {
            console.log(res.data.data.createCart.quoteId);
            axios
              .get(
                `${SERVER_HTTP.linkUrl}?query={
          failSnap(order_id: ${orderId}, quote_id: "${res.data.data.createCart.quoteId}") {
            redirect
            quote_id
          }
        }`
              )
              .then(response => {
                console.log(response.data);
              });
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
