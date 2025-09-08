import * as React from 'react';

// https://github.com/vercel-labs/ai-chatbot/blob/614963271bf6f588e4d35b747aeacad395876f31/lib/hooks/use-at-bottom.tsx

export function useAtBottom(offset = 0, containerRef?: React.RefObject<HTMLElement | null>) {
  const [isAtBottom, setIsAtBottom] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (containerRef?.current) {
        // For specific element scrolling
        const container = containerRef.current;
        const isAtBottom = container.scrollTop + container.clientHeight >= 
          container.scrollHeight - offset;
        setIsAtBottom(isAtBottom);
      } else {
        // Fallback to window scrolling
        setIsAtBottom(
          window.innerHeight + window.scrollY >=
            document.body.offsetHeight - offset
        );
      }
    };

    const element = containerRef?.current;
    
    if (element) {
      element.addEventListener('scroll', handleScroll, { passive: true });
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    handleScroll();

    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [offset, containerRef]);

  return isAtBottom;
}
