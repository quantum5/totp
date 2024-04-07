import React from 'react';

type HTMLAnchorProps = Omit<React.HTMLProps<HTMLAnchorElement>, 'href' | 'onClick'>;

export default function ActionLink({onClick, className, ...props}: HTMLAnchorProps & { onClick: () => void }) {
  const handleClick = React.useCallback((e: React.SyntheticEvent) => {
    e.preventDefault();
    onClick();
  }, [onClick]);

  return <a className={`totp-action-link ${className}`} onClick={handleClick} {...props} />;
}
