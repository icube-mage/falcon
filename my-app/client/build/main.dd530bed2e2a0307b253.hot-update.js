exports.id = "main";
exports.modules = {

/***/ "./src/pages/shop/Checkout/CustomerSelector.js":
/*!*****************************************************!*\
  !*** ./src/pages/shop/Checkout/CustomerSelector.js ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/objectSpread */ "./node_modules/@babel/runtime/helpers/objectSpread.js");
/* harmony import */ var _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var formik__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! formik */ "./node_modules/formik/dist/formik.esm.js");
/* harmony import */ var react_apollo__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-apollo */ "./node_modules/react-apollo/react-apollo.esm.js");
/* harmony import */ var _deity_falcon_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @deity/falcon-ui */ "./node_modules/@deity/falcon-ui/dist/index.js");
/* harmony import */ var _deity_falcon_ecommerce_uikit__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @deity/falcon-ecommerce-uikit */ "./node_modules/@deity/falcon-ecommerce-uikit/dist/index.js");
/* harmony import */ var _CheckoutSectionHeader__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./CheckoutSectionHeader */ "./src/pages/shop/Checkout/CheckoutSectionHeader.js");

var _jsxFileName = "/var/www/falcon_icube/my-app/client/src/pages/shop/Checkout/CustomerSelector.js";







const customerEmailFormLayout = {
  customerEmailFormLayout: {
    display: 'grid',
    my: 'xs',
    gridGap: 'sm',
    // prettier-ignore
    gridTemplate: {
      xs: Object(_deity_falcon_ecommerce_uikit__WEBPACK_IMPORTED_MODULE_6__["toGridTemplate"])([['1fr'], ['input'], ['button']]),
      md: Object(_deity_falcon_ecommerce_uikit__WEBPACK_IMPORTED_MODULE_6__["toGridTemplate"])([['2fr', '1fr'], ['input', 'button']])
    }
  }
};
const emailRx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const divStyle = {
  fontSize: '16px'
};

const EmailForm = ({
  email = '',
  setEmail
}) => react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(formik__WEBPACK_IMPORTED_MODULE_3__["Formik"], {
  onSubmit: values => setEmail(values.email),
  initialValues: {
    email
  },
  validate: values => {
    if (!emailRx.test(values.email.toLowerCase())) {
      return {
        email: 'Invalid email address'
      };
    }
  },
  __source: {
    fileName: _jsxFileName,
    lineNumber: 36
  }
}, ({
  values,
  errors,
  handleChange
}) => react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(formik__WEBPACK_IMPORTED_MODULE_3__["Form"], {
  __source: {
    fileName: _jsxFileName,
    lineNumber: 48
  }
}, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_deity_falcon_ui__WEBPACK_IMPORTED_MODULE_5__["Text"], {
  __source: {
    fileName: _jsxFileName,
    lineNumber: 49
  }
}, "Type your email and continue as guest:"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_deity_falcon_ui__WEBPACK_IMPORTED_MODULE_5__["Box"], {
  defaultTheme: customerEmailFormLayout,
  __source: {
    fileName: _jsxFileName,
    lineNumber: 50
  }
}, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_deity_falcon_ui__WEBPACK_IMPORTED_MODULE_5__["Box"], {
  gridArea: "input",
  __source: {
    fileName: _jsxFileName,
    lineNumber: 51
  }
}, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_deity_falcon_ui__WEBPACK_IMPORTED_MODULE_5__["Input"], {
  style: divStyle,
  type: "text",
  name: "email",
  value: values.email,
  onChange: handleChange,
  __source: {
    fileName: _jsxFileName,
    lineNumber: 52
  }
}), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(formik__WEBPACK_IMPORTED_MODULE_3__["ErrorMessage"], {
  name: "email",
  render: msg => react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_deity_falcon_ui__WEBPACK_IMPORTED_MODULE_5__["Text"], {
    color: "error",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 53
    }
  }, msg),
  __source: {
    fileName: _jsxFileName,
    lineNumber: 53
  }
})), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_deity_falcon_ui__WEBPACK_IMPORTED_MODULE_5__["Button"], {
  gridArea: "button",
  disabled: errors.email,
  type: "submit",
  __source: {
    fileName: _jsxFileName,
    lineNumber: 55
  }
}, "continue as guest"))));

EmailForm.propTypes = {
  setEmail: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.func.isRequired,
  email: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.string
};

class EmailSection extends react__WEBPACK_IMPORTED_MODULE_1___default.a.Component {
  constructor(props) {
    super(props);
    let email = props.email || '';

    if (props.data && props.data.customer) {
      ({
        email
      } = props.data.customer);
      props.setEmail(email);
    }

    this.state = {
      email: props.email,
      getPrevProps: () => this.props
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      data: {
        customer: prevCustomer
      }
    } = prevState.getPrevProps();
    const {
      data: {
        customer: nextCustomer
      }
    } = nextProps;
    const {
      email: prevCustomerEmail
    } = prevCustomer || {};
    const {
      email: nextCustomerEmail
    } = nextCustomer || {};

    if (prevCustomerEmail !== nextCustomerEmail) {
      // user has signed in or out so we have to trigger setEmail() with the new value
      nextProps.setEmail(nextCustomerEmail); // if there's no email in nextProps then customer just signed out - in that case we trigger
      // edit process so wizard switches to correct section

      if (!nextCustomerEmail) {
        nextProps.onEditRequested();
      }

      return _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0___default()({}, prevState, {
        email: nextCustomerEmail || ''
      });
    }

    if (nextProps.email && nextProps.email !== prevState.email) {
      return _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0___default()({}, prevState, {
        email: nextProps.email
      });
    }

    return null;
  }

  render() {
    let header;
    const {
      open,
      data,
      onEditRequested
    } = this.props;
    const isSignedIn = !!data.customer;

    if (!open) {
      header = react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_deity_falcon_ecommerce_uikit__WEBPACK_IMPORTED_MODULE_6__["SignOutMutation"], {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 130
        }
      }, signOut => react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_CheckoutSectionHeader__WEBPACK_IMPORTED_MODULE_7__["default"], {
        title: "Customer",
        editLabel: isSignedIn ? 'Sign out' : 'Edit',
        onActionClick: isSignedIn ? signOut : onEditRequested,
        complete: true,
        summary: react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_deity_falcon_ui__WEBPACK_IMPORTED_MODULE_5__["Text"], {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 137
          }
        }, this.state.email),
        __source: {
          fileName: _jsxFileName,
          lineNumber: 132
        }
      }));
    } else {
      header = react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_CheckoutSectionHeader__WEBPACK_IMPORTED_MODULE_7__["default"], {
        title: "Customer",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 143
        }
      });
    }

    const content = react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_deity_falcon_ecommerce_uikit__WEBPACK_IMPORTED_MODULE_6__["OpenSidebarMutation"], {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 147
      }
    }, openSidebar => react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_deity_falcon_ui__WEBPACK_IMPORTED_MODULE_5__["Box"], {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 149
      }
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(EmailForm, {
      email: this.state.email,
      setEmail: this.props.setEmail,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 150
      }
    }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_deity_falcon_ui__WEBPACK_IMPORTED_MODULE_5__["Text"], {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 151
      }
    }, "or", react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_deity_falcon_ui__WEBPACK_IMPORTED_MODULE_5__["Link"], {
      mx: "xs",
      color: "primary",
      onClick: () => openSidebar({
        variables: {
          contentType: 'account'
        }
      }),
      __source: {
        fileName: _jsxFileName,
        lineNumber: 153
      }
    }, "sign in with your account"), "if you are already registered")));
    return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_deity_falcon_ui__WEBPACK_IMPORTED_MODULE_5__["Details"], {
      open: open,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 174
      }
    }, header, content ? react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_deity_falcon_ui__WEBPACK_IMPORTED_MODULE_5__["DetailsContent"], {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 176
      }
    }, content) : null);
  }

}

EmailSection.propTypes = {
  // data form GET_CUSTOMER query
  data: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.shape({}),
  // currently selected email
  email: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.string,
  // callback that sets email
  setEmail: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.func.isRequired,
  // callback that should be called when user requests edit of this particular section
  onEditRequested: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.func,
  // flag that indicates if the section is currently open
  open: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.bool
};
EmailSection.defaultProps = {
  email: ''
};
/* harmony default export */ __webpack_exports__["default"] = (Object(react_apollo__WEBPACK_IMPORTED_MODULE_4__["graphql"])(_deity_falcon_ecommerce_uikit__WEBPACK_IMPORTED_MODULE_6__["GET_CUSTOMER"])(EmailSection));

/***/ })

};
//# sourceMappingURL=main.dd530bed2e2a0307b253.hot-update.js.map