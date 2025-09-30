export const scrollToTopTimeout = () => {
  let scrollStart = Number.NEGATIVE_INFINITY;
  setTimeout(() => {
    scrollStart = window.scrollY;
  }, 200);
  setTimeout(() => {
    const scrollEnd = window.scrollY;
    if (scrollStart === scrollEnd && scrollEnd > 0) {
      // If no scrolling has happened, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, 300);
};
