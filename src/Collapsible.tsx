import React from 'react';
import {Collapse} from 'bootstrap';

export default function Collapsible({children, show}: { children: React.ReactNode; show: boolean }) {
  const id = React.useId();

  React.useEffect(() => {
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
