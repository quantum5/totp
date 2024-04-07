import React from 'react';
import Copy from './copy.svg?react';
import {Popover} from 'bootstrap';

export default function CopyButton({text}: { text: string }) {
  const id = React.useId();
  const [popover, setPopover] = React.useState(false);

  React.useEffect(() => {
    if (!popover) return;
    const instance = Popover.getOrCreateInstance(`#${id}`, {
      trigger: 'manual',
      placement: 'right',
    });
    instance.show();

    setTimeout(() => {
      instance.hide();
      setPopover(false);
    }, 1000);
  }, [id, popover]);

  const onCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setPopover(true);
    } catch (error) {
      alert((error as Error).message);
    }
  }, [text]);

  return <span id={id} className="copy-button" data-bs-content="Copied!">
    <a onClick={onCopy}><Copy/></a>
  </span>;
}
