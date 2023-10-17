enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

function log(opts: {
  globalLogLevel: LogLevel;
  level: LogLevel;
  message: string;
}) {
  if (opts.level >= opts.globalLogLevel) {
    console.log(opts.message);
  }
}
