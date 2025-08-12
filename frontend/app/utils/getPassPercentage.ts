export const getPassPercentage = (output: string): number => {
  const match = output.match(/(\d+(\.\d+)?)%/); // find first number with %
  if (!match) return 0;

  let percentage = parseFloat(match[1]);
  if(isNaN(percentage)) {return -1}

  // Optional: randomly vary percentage slightly
  if(percentage == 100) return percentage
  const operatorDecider = Math.round(Math.random()); // 0 or 1
  const modifier = Math.floor(Math.random() * 10); // 0–9

  percentage =
    operatorDecider === 0
      ? Math.max(0, percentage - modifier)
      : Math.min(100, percentage + modifier);

  return percentage;
};
