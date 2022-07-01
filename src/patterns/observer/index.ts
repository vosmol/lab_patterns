export type Observer<Event> = (event: Event) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createSubject<Event = any>() {
  return new Subject<Event>();
}

export class Subject<Event> {
  protected observers: Array<Observer<Event>> = [];

  subscribe = (Obs: Observer<Event>) => {
    this.observers.push(Obs);
    return () => this.unsubscribe(Obs);
  };

  unsubscribe = (Obs: Observer<Event>) => {
    // https://www.measurethat.net/Benchmarks/Show/814/0/remove-by-splice-vs-copywithin-vs-filter#latest_results_block
    const index = this.observers.indexOf(Obs);
    if (index > -1) this.observers.splice(index, 1);
  };

  unsubscribeAll = () => {
    this.observers.length = 0;
  };

  notifyObservers = (event: Event) => {
    this.observers.forEach((o) => o(event));
  };

  get observerCount() {
    return this.observers.length;
  }
}

// TODO: Implement observable state, add tests
export class ValueSubject<Value> extends Subject<Value> {
  protected subjectValue: Value;

  constructor(initialValue: Value) {
    super();

    this.subjectValue = initialValue;
  }

  set value(newValue: Value) {
    const valueDidNotChange = this.subjectValue === newValue;
    if (valueDidNotChange) return;

    this.subjectValue = newValue;
    this.notifyObservers(newValue);
  }
}
