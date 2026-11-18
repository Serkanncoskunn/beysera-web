import { useEffect, useState } from 'react';

// Ekrana girince yumuşakça belirir. "Azaltılmış hareket" tercihinde CSS hemen gösterir.
// IntersectionObserver olmayan eski tarayıcılarda içerik baştan görünür.
export default function Reveal({ as = 'div', delay = 0, className = '', style, children, ...rest }) {
  const Tag = as;
  const [node, setNode] = useState(null);
  const [shown, setShown] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    if (!node || shown) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [node, shown]);

  return (
    <Tag
      ref={setNode}
      data-reveal={shown ? 'in' : 'out'}
      style={{ ...style, '--reveal-delay': `${delay}ms` }}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
}
