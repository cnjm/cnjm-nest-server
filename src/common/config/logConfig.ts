import * as path from "path";
const baseLogPath = path.resolve(__dirname, "../../logs"); // 日志根目录，视情况而定，这里将于项目同级

// development 时控制台打印
const appenders =
  process.env.NODE_ENV === "development"
    ? ["console", "app", "errors"]
    : ["app", "errors"];

const log4jsConfig = {
  appenders: {
    console: {
      type: "console",
    },
    access: {
      type: "dateFile", // 写入按日期分类文件
      filename: `${baseLogPath}/access/access.log`, // 日志名称，会加上pattern格式的日期
      alwaysIncludePattern: true,
      pattern: "yyyy-MM-dd",
      daysToKeep: 7, //保存天数
      numBackups: 3, // 日志文件
      category: "http", //category 类型
      keepFileExt: true, // 文件后缀
      compress: true, // 压缩
    },
    app: {
      type: "dateFile",
      filename: `${baseLogPath}/apps/app.log`,
      alwaysIncludePattern: true,
      layout: {
        type: "pattern",
        pattern:
          '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}',
      },
      maxLogSize: 10485760,
      pattern: "yyyy-MM-dd",
      daysToKeep: 7,
      numBackups: 3,
      keepFileExt: true,
    },
    errorFile: {
      type: "dateFile",
      filename: `${baseLogPath}/errors/error.log`,
      alwaysIncludePattern: true,
      layout: {
        type: "pattern",
        pattern:
          '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}',
      },
      pattern: "yyyy-MM-dd",
      daysToKeep: 7,
      numBackups: 3,
      keepFileExt: true,
    },
    errors: {
      type: "logLevelFilter",
      level: "ERROR",
      appender: "errorFile",
    },
  },
  categories: {
    default: {
      appenders,
      level: "DEBUG",
    },
    info: { appenders, level: "info" },
    access: { appenders, level: "info" },
    http: { appenders: ["access"], level: "DEBUG" },
  },
  pm2: true, // pm2时
  pm2InstanceVar: "INSTANCE_ID", // 根据pm2 id分配
};

export default log4jsConfig;
