// /**
//  *
//  * @param text
//  * @param max
//  * @returns
//  */

export function textCut(text: string, max: number = 50) {
  if (text.length >= max) return `${text.slice(0, max)}...`;
  return text;
}
