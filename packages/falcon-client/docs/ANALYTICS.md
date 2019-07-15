# Falcon - Google Analytics integration

Falcon provides a simple Google Analytics integration using `withPageview` Higher-Order
Component to wrap your `App` component and send basic "pageview" analytics data
to the provided Google Analytics account.

> This component uses https://github.com/lukeed/ganalytics/ package
> under the hood.

## Installation

In your `src/App.js` file - you need to import `withPageview` component and attach it to your `App` component:

```diff
// other imports
+ import withPageview from '@deity/falcon-client/src/components/withPageview';

const App = () => {
  { /* other components */ }
  <Switch>
    { /* other routes */ }
  </Switch>
  ...
}

- export default isOnline()(App);
+ export default isOnline()(withPageview(App));
```

You configuration source must provide the following data:

```json
{
  "googleAnalytics": {
    "trackerID": "UA-xxxxx"
  }
}
```

> `ga` will be available on the client-side only.

You can also use Google Analytics as a part of your routing (put a new `Route` component
right before `<Switch></Switch>`):

```diff
// other imports
import { Route } from 'react-router-dom';
+ import trackPageView from '@deity/falcon-client/src/components/trackPageView';

const App = () => {
  { /* other components */ }
+  <Route path="/" component={trackPageView} />
  <Switch>
    { /* other routes */ }
  </Switch>
  ...
}

export default App;
```

You have a full control over this `trackPageView` component by setting `path` with
a required pattern (you may want to exclude some of your paths for examples).

## Advanced usage

Falcon exposes `withAnalytics` HOC in order to send custom analytics data to Google Analytics.
This component delivers `ga` property into your component:

```js
import React from 'react';
import withAnalytics from '@deity/falcon-client/src/components/withAnalytics';

class Custom extends React.Component {
  handleClick(e) {
    // "ga" provided by "withAnalytics" HOC
    const { ga } = this.props;
    ga.send('event', {
      ec: 'My event category',
      ea: 'My event action',
      el: 'My event label',
      ev: 'My event value'
    });
  }

  render() {
    return <button onClick={() => this.handleClick()}>Click me!</button>;
  }
}

export default withAnalytics(Custom);
```

> Please refer to a complete list of hit types [here](https://github.com/lukeed/ganalytics/#gasendtype-params).
