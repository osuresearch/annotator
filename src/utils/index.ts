export function isInViewport(window: Window, rect: Rect) {
  if (!window || !document) {
    return false;
  }

  return (
    rect.y >= window.scrollY &&
    rect.x >= window.scrollX &&
    rect.y + rect.height <= window.scrollY + window.innerHeight &&
    rect.x + rect.width <= window.scrollX + window.innerWidth
  );
}
