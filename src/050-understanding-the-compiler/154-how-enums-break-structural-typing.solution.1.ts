enum LogLevel {
  DEBUG = "DEBUG",
  WARN = "WARN",
  ERROR = "ERROR",
}

enum LogLevel2 {
  DEBUG = "DEBUG",
  WARN = "WARN",
  ERROR = "ERROR",
}

function printImportant(key: LogLevel | LogLevel2) {}

printImportant(LogLevel2.DEBUG);
