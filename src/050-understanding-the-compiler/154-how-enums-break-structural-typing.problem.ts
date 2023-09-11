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

function printImportant(key: LogLevel) {}

printImportant(LogLevel2.DEBUG);
