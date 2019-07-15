/**
 * Register Service Worker
 * @param {string} swPath public path to service worker
 * @returns {void}
 */
export function register(swPath = '/sw.js') {
  const isHttps = window.location.protocol === 'https:';
  const isLocalHost = window.location.host.match(/(localhost|127.0.0.1)/);

  if (!('serviceWorker' in navigator) || (!isHttps && !isLocalHost)) {
    return;
  }

  const registerSw = () => {
    const scope = '/';

    navigator.serviceWorker
      .register(swPath, { scope })
      .then(registration => {
        if (isLocalHost) {
          console.log(`SW registered for '${scope}'.`, registration);
        }
      })
      .catch(registrationError => {
        console.warn(`SW registration for '${scope}' failed.`, registrationError);
      });
  };

  // if 'load' event has already been called then document.readyState is set to 'complete'
  // in that case we register SW immediately, otherwise we delay it until 'load' event is fired
  if (document.readyState === 'complete') {
    registerSw();
  } else {
    window.addEventListener('load', registerSw);
  }
}

/**
 * Unregister all registered service workers
 * @returns {void}
 */
export function unregisterAll() {
  navigator.serviceWorker.getRegistrations().then(swRegistrations => {
    swRegistrations.forEach(registration =>
      registration
        .unregister()
        .then(console.log(`SW unregistered for '${registration.scope}'.`))
        .catch(x => console.warn(`SW unregistration for '${registration.scope}' failed.`, x))
    );
  });
}

export function configureServiceWorker() {
  if (process.env.NODE_ENV === 'production') {
    register('/sw.js');
  } else {
    unregisterAll();
  }
}
