import chalk from "chalk";

export class Logger {
  /** Name prefix for log messages */
  private prefix: string;
  private isVerbose: boolean;
  private printPrefix: boolean;

  constructor({
    name,
    isVerbose = false,
    printPrefix = true,
  }: {
    name: string;
    isVerbose?: boolean;
    printPrefix?: boolean;
  }) {
    this.prefix = chalk.bold.blue(`${name}`);
    this.isVerbose = isVerbose;
    this.printPrefix = printPrefix;
  }

  /** Format message with icon and prefix */
  private formatMessage(message: string, icon: string = ""): string {
    const prefixStr = this.printPrefix ? this.prefix : "";
    return `${prefixStr}${icon ? " " + icon : ""} ${message}`;
  }

  /** Log a generic message */
  log(message: string): void {
    console.log(this.formatMessage(message));
  }

  /** Log an informational message */
  info(message: string): void {
    console.log(this.formatMessage(message, chalk.blue("•")));
  }

  /** Log a success message */
  success(message: string): void {
    console.log(this.formatMessage(message, chalk.green("✓")));
  }

  /** Log a warning message */
  warn(message: string): void {
    console.log(this.formatMessage(message, chalk.yellow("⚠")));
  }

  /** Log an error message */
  error(message: string): void {
    console.error(this.formatMessage(message, chalk.red("✗")));
  }

  /** Log a detail message (indented, for supplementary info) */
  detail(message: string): void {
    console.log(this.formatMessage(message, "  " + chalk.gray("→")));
  }

  /** Log a verbose message - only shown when verbose is enabled */
  verbose(message: string): void {
    if (this.isVerbose) {
      console.log(this.formatMessage(chalk.gray(message), chalk.gray("•")));
    }
  }

  /** Set verbose mode */
  setVerbose(isVerbose: boolean): void {
    this.isVerbose = isVerbose;
  }

  /** Set prefix display */
  setPrintPrefix(printPrefix: boolean): void {
    this.printPrefix = printPrefix;
  }
}
