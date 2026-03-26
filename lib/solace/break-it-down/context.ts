export function buildContextLead(input: string): string | null {
  const text = input.toLowerCase();

  const hasMoney =
    /\bmoney\b|\bbudget\b|\bafford\b|\bexpensive\b|\bcheap\b|\bcost\b|\bpay\b/.test(text);

  const hasWork =
    /\bwork\b|\bjob\b|\bcareer\b|\bpressure\b|\bstress\b|\bdeadline\b/.test(text);

  const hasFamily =
    /\bwife\b|\bhusband\b|\bpartner\b|\bfamily\b|\bbaby\b|\bkids\b|\bchildren\b|\bboyfriend\b|\bgirlfriend\b/.test(
      text,
    );

  const hasEmotion =
    /\bhate\b|\bstress\b|\boverwhelm\b|\bworthless\b|\bwhy\b|\bsad\b|\bangry\b|\bhurt\b/.test(
      text,
    );

  const hasPractical =
    /\bbroken\b|\bfix\b|\bcar\b|\bhouse\b|\bproblem\b|\brepair\b|\bphone\b|\bmove\b/.test(text);

  if (hasMoney && hasFamily) {
    return "Money feels tight and things feel strained close to home, so keep this simple and focus on what actually helps right now.";
  }

  if (hasWork && hasMoney) {
    return "Work pressure and money stress are both sitting there, so it helps to narrow this down before it grows bigger.";
  }

  if (hasFamily && hasWork) {
    return "There is pressure from both work and home, which can make even simple things feel heavier.";
  }

  if (hasEmotion && hasWork) {
    return "This is not just practical anymore. It is affecting how the day feels as well.";
  }

  if (hasPractical && hasEmotion) {
    return "There is a practical issue here, but it is clearly weighing on you more than it should.";
  }

  if (hasFamily) {
    return "This connects to people close to you, so it can feel heavier than just another task.";
  }

  if (hasMoney) {
    return "Money is part of this, so keeping it simple matters.";
  }

  if (hasWork) {
    return "Work is part of this, so clarity will help more than rushing.";
  }

  return null;
}