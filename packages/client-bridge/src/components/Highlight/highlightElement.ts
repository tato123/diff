import _ from 'lodash-es';
import { fromEvent, of, Observable, race } from 'rxjs';
import {
  takeUntil,
  debounceTime,
  distinctUntilChanged,
  last,
  catchError,
  filter,
  tap,
  map
} from 'rxjs/operators';

import { injectGlobal } from 'styled-components';
import Inspector from './hoverinspect';

const SELECTION_CLASS: string = 'diff-selected';
const HIGHLIGHT_CLASS: string = 'diff-highlight';

injectGlobal`
  .diff-selected {
    outline: 2px dashed #000 !important;
  }
`;

interface HTMLEvent extends MouseEvent {
  target: HTMLElement;
  key?: string;
}

// common selector attribute
const SELECTABLE_ATTR: string = 'data-diff-selectable';
const inspector = new Inspector();

/**
 * The target has to specifically opt-in to turn off selectability,
 * we want to maximize the number of elements that can be selected
 * (basically everything on the page)
 */
const isNotSelectableElement = (evt: HTMLEvent): boolean =>
  evt.target.hasAttribute(SELECTABLE_ATTR) &&
  evt.target.getAttribute(SELECTABLE_ATTR) === 'false';

/**
 * Since we are using an opt-out strategy, by default everything is
 * selectable, we want to make sure that if the attribute hasn't been
 * set we default to selectable
 */
const isSelectableElement = (evt: HTMLEvent): boolean => {
  if (!evt.target.hasAttribute(SELECTABLE_ATTR)) {
    return true;
  }

  return (
    evt.target.hasAttribute(SELECTABLE_ATTR) &&
    evt.target.getAttribute(SELECTABLE_ATTR) === 'true'
  );
};

const clearStyles = (): void => {
  document.querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach(node => {
    node.classList.remove(HIGHLIGHT_CLASS);
  });

  document.querySelectorAll(`.${SELECTION_CLASS}`).forEach(node => {
    node.classList.remove(SELECTION_CLASS);
  });
};

const inspect = (): Observable<HTMLElement> => {
  clearStyles();
  inspector.activate();

  const clicks: Observable<Event> = fromEvent(window, 'click', {
    capture: true
  }).pipe(
    filter(evt => {
      const typedEvent = evt as HTMLEvent;

      evt.stopImmediatePropagation();
      if (isSelectableElement(typedEvent)) {
        return true;
      }
      if (isNotSelectableElement(typedEvent)) {
        return false;
      }

      if (!typedEvent.target.hasAttribute(SELECTABLE_ATTR)) {
        return true;
      }

      return false;
    })
  );

  const escape: Observable<Event> = fromEvent(window, 'keyup', {
    capture: true
  }).pipe(
    filter(evt => {
      const typedEvent = evt as HTMLEvent;

      if (typedEvent.key === 'Escape') {
        // throw new Error('Interrupt');
        return true;
      }
      return false;
    }),
    map(e => null)
  );

  const move = fromEvent(document.body, 'mousemove');

  const stopAndClear = () => {
    clearStyles();
    inspector.deactivate();
  };

  const move$ = move.pipe(
    takeUntil(clicks),
    distinctUntilChanged(
      (oldValue, newValue): boolean => {
        if (oldValue == null) {
          return true;
        }

        const val = oldValue.target.isSameNode(newValue.target);

        // value is not the same, remove the highlighting
        // from the previous value
        if (!val) {
          oldValue.target.classList.remove(HIGHLIGHT_CLASS);
        }

        return val;
      }
    ),
    map((evt: HTMLEvent) => {
      if (isSelectableElement(evt)) {
        evt.target.classList.add(HIGHLIGHT_CLASS);
        return evt.target;
      }
      return null;
    }),
    last(),
    catchError(err => {
      if (err.name !== 'EmptyError') {
        // ignore this error, while it's never good to raise
        // errors as a valid state, it is raised on a special condition where
        // the user closes the launcher without ever hovering over an element
        console.error(err.message);
      } else if (err.message === 'Interrupt') {
        // an interrupt was registered and we shouldn't allow the observable
        // to pass through
        return of(null);
      }

      return of(null);
    }),
    tap((e: HTMLElement | null) => {
      stopAndClear();

      if (e) {
        e.classList.add(SELECTION_CLASS);
      }
    })
  );

  const interrupts = race(move$, escape);

  interrupts.forceStop = stopAndClear;

  return interrupts;
};

export default inspect;