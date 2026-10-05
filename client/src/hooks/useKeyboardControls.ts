import { useEffect, useState } from 'react';

interface KeyboardState {
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
  space: boolean;
  shift: boolean;
}

export function useKeyboardControls() {
  const [keys, setKeys] = useState<KeyboardState>({
    w: false,
    a: false,
    s: false,
    d: false,
    space: false,
    shift: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'w') setKeys((k) => ({ ...k, w: true }));
      if (key === 'a') setKeys((k) => ({ ...k, a: true }));
      if (key === 's') setKeys((k) => ({ ...k, s: true }));
      if (key === 'd') setKeys((k) => ({ ...k, d: true }));
      if (e.code === 'Space') setKeys((k) => ({ ...k, space: true }));
      if (e.shiftKey) setKeys((k) => ({ ...k, shift: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'w') setKeys((k) => ({ ...k, w: false }));
      if (key === 'a') setKeys((k) => ({ ...k, a: false }));
      if (key === 's') setKeys((k) => ({ ...k, s: false }));
      if (key === 'd') setKeys((k) => ({ ...k, d: false }));
      if (e.code === 'Space') setKeys((k) => ({ ...k, space: false }));
      if (!e.shiftKey) setKeys((k) => ({ ...k, shift: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
}
