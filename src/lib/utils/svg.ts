export function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = (angle - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function describeArc(
  cx: number, cy: number, r: number,
  startAngle: number, endAngle: number
) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end   = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = (endAngle - startAngle) <= 180 ? 0 : 1;
  return [
    `M ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`,
    `L ${cx} ${cy}`, `Z`
  ].join(' ');
}
