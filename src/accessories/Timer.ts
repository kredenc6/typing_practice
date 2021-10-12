type DecimalCount = 0 | 1 | 2 | 3;

export default class Timer {
  private decimalCount: DecimalCount;
  private time: number;
  isRunning: boolean;
  startTime: number;
  
  constructor(decimalCount = 0 as DecimalCount) {
    this.isRunning = false;
    this.decimalCount = decimalCount;
    this.startTime = 0;
    this.time = 0;
  }

  reset() {
    this.isRunning = false;
    this.startTime = 0;
    this.time = 0;
  }

  start(continueFromTime?: number) {
    if(continueFromTime !== undefined) {
      this.time = continueFromTime;
    }

    this.startTime = new Date().getTime();
    this.isRunning = true;
  }
  
  stop() {
    if(!this.isRunning) return;
    
    const endTime = new Date().getTime();
    const dividend = endTime - this.startTime;
    const divisor = 1000 / Math.pow(10, this.decimalCount);
    const decimalPoint = 1000 / divisor;
    
    this.time += Math.round(dividend / divisor) / decimalPoint;
    this.isRunning = false;
  }

  getTime() {
    if(this.isRunning) {
      console.warn("The time counter is still running. Make sure it's stopped before asking for the value.");
      return 0;
    }

    return this.time;
  }
}