import React from 'react';
import {Collapse} from 'bootstrap';
import classNames from 'classnames';

export interface CollapsibleHandle {
  show: () => void;
  hide: () => void;
  toggle: () => void;
}

export default function Collapsible({children, show}: { children: React.ReactNode; show: boolean }) {
  const collapse = React.useRef<Collapse>();

  const onLoad = React.useCallback((element: HTMLDivElement) => {
    collapse.current = new Collapse(element, {toggle: show});
  }, []);

  React.useEffect(() => {
    if (show)
      collapse.current?.show();
    else
      collapse.current?.hide();
  }, [show]);

  return <div ref={onLoad} className={classNames('collapse', {show})}>
    {children}
  </div>;
}
