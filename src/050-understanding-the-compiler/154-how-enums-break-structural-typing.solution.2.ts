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

function printImportant(key: "DEBUG" | "WARN" | "ERROR") {}

printImportant(LogLevel2.DEBUG);
