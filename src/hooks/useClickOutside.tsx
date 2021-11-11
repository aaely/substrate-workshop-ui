import { useCallback, RefObject } from 'react';

import { useEventListener } from './useEventListener';
import { getRefElement } from '../utils/getRefElement';

export const useClickOutside = (
  element: RefObject<Element> | null,
  callback: (event: MouseEvent) => void
): void => {
  const handleClick = useCallback(
    (event) => {
      if (!getRefElement(element)?.contains(event.target)) {
        callback(event);
      }
    },
    [callback, element]
  );

  useEventListener({
    type: 'click',
    listener: handleClick
  });
};