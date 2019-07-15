declare namespace Logger {
  function setLogLevel(level: string): void;
  function log(...args: any[]): void;
  function debug(...args: any[]): void;
  function warn(...args: any[]): void;
  function info(...args: any[]): void;
  function error(...args: any[]): void;
  function verbose(...args: any[]): void;
}

export = Logger;
