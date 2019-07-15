# @deity/falcon-logger
Utility tool used for logging in Falcon packages.

By default it uses just `console.log()` for all types of logs. Setting `global.__SERVER__ = true` before loading `@deity/falcon-logger` will load full logger that uses [winston](https://github.com/winstonjs/winston) package.

If you would like to find more information please check out the official documentation website [https://falcon.deity.io/docs/advanced/falcon-logger](https://falcon.deity.io/docs/advanced/falcon-logger)
