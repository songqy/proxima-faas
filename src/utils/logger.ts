import { MODE } from './constants';

export default class Logger {
  _mode: MODE;
  constructor(mode: MODE) {
    this._mode = mode;
  }

  log(...args: any[]) {
    console.log('INFO', this._mode, ...args);
  }

  warn(...args: any[]) {
    console.warn('WARN', this._mode, ...args);
  }
}
