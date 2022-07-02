import { createSubject } from './index';

const subject = createSubject();
const observerCb = jest.fn();
const noop = () => {
  // supress eslint empty fn
};

describe('Subject', () => {
  beforeEach(() => {
    expect(subject.observerCount).toBe(0);
  });

  it('should return unsubscribe callback when subscribed', () => {
    const unsub = subject.subscribe(observerCb);
    expect(typeof unsub).toBe('function');

    unsub();
  });

  it('should notify observers and with correct event data', () => {
    const unsub = subject.subscribe(observerCb);

    const v1 = 'hello';
    subject.notifyObservers(v1);
    expect(observerCb).toBeCalledWith(v1);

    const v2 = { data: 'world' };
    subject.notifyObservers(v2);
    expect(observerCb).toBeCalledWith(v2);

    expect(observerCb).toBeCalledTimes(2);

    unsub();
  });

  it('should unsubscribe observers without leaking', () => {
    // sub and immediately unsub
    subject.subscribe(noop)();
    subject.subscribe(noop)();

    const unsub = subject.subscribe(noop);
    // check if no err thrown with multiple calls
    unsub();
    unsub();

    expect(subject.observerCount).toBe(0);
  });

  describe('When unsubscribeAll() is called', () => {
    it('should unsubscribe all observers', () => {
      subject.subscribe(noop);
      subject.subscribe(noop);
      subject.subscribe(noop);
      subject.unsubscribeAll();
      expect(subject.observerCount).toBe(0);
    });
  });
});
