import { Operation } from './Operation';

export class OperationResult<T> {
  public value?: T;
  public operation: Operation;
  constructor(name: string, success = false) {
    this.value = undefined;
    this.operation = {
      name,
      success,
      subOps: [],
    };
  }

  public addSubOp(op: Operation): void {
    this.operation.subOps.push(op);
  }
}
