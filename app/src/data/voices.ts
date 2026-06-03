// Patient voices shown on the homepage. In the full migration these can move
// to a content collection or stay as data — they're short and static.
export interface Voice {
  text: string;
  author: string;
  feature?: boolean;
}

export const voices: Voice[] = [
  {
    text: "I never thought I'd live to see the day that describing visual and other sensory disturbances could be discussed openly and without shame.",
    author: 'I. R. — 2004',
    feature: true,
  },
  { text: "The stories you've shared almost reduced me to tears. I see myself in their words.", author: 'I. S. — 2006' },
  { text: "Your website helped me understand my daughter's frightening first aura — she thought she saw a ghost.", author: 'The H. Family — 2005' },
  { text: "It makes you feel less alone — I don't know anyone else who suffers from similar symptoms.", author: 'K. L. — 2002' },
  { text: 'It is comforting to see that the symptoms I experience are also described by other affected individuals.', author: 'E. S. — 2002' },
  { text: 'I decided to embrace my migraine and base my art practice on it.', author: 'T. H. — 2004' },
];
