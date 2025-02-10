import React, {ReactNode, useEffect, useId} from 'react';
import {Collapse} from 'bootstrap';

export default function Collapsible({children, show}: { children: ReactNode; show: boolean }) {
  const id = useId();

  useEffect(() => {
    const collapse = Collapse.getOrCreateInstance(`#${id}`, {toggle: show});
    if (show)
      collapse.show();
    else
      collapse.hide();
  }, [id, show]);

  return <div id={id} className="collapse">
    {children}
  </div>;
}
