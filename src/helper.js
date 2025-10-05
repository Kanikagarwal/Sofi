export function checkHeading(str) {
  return /^\*{1,3}[^*].*?\*{1,3}$/.test(str.trim());
}


export function replaceHeadingStars(str) {
  return str.replace(/^\*{1,3}|\*{1,3}$/g, '').trim();
}
