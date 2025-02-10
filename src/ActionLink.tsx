import {HTMLProps, SyntheticEvent, useCallback} from 'react';

type HTMLAnchorProps = Omit<HTMLProps<HTMLAnchorElement>, 'href' | 'onClick'>;

export default function ActionLink({onClick, className, ...props}: HTMLAnchorProps & { onClick: () => void }) {
  const handleClick = useCallback((e: SyntheticEvent) => {
    e.preventDefault();
    onClick();
  }, [onClick]);

  return <a className={`totp-action-link ${className}`} onClick={handleClick} {...props} />;
}
