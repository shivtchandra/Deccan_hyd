export const ENCOUNTERS = [
  {
    id: 'chai', number: '01', name: 'One more cup', place: 'The chai counter', object: 'A little warmth',
    x: 173, y: 526, camera: { x: 300, y: 570 }, color: '#CDA45E',
    invitation: 'There is always room for one more at the counter.',
    line: 'The kettle tips. Cups draw closer. For a moment, nobody is in a hurry.',
    action: 'Stay for a chai', caption: 'A thin stream of chai. A little steam. The evening can wait.',
    memory: 'A cup held between both hands, and an evening allowed to take its time.',
    next: 'A few steps away, someone is choosing a colour for her bangles.',
    icon: 'cup',
  },
  {
    id: 'bangles', number: '02', name: 'A colour to keep', place: 'The bangle counter', object: 'A circle of colour',
    x: 595, y: 736, camera: { x: 630, y: 720 }, color: '#C7796C',
    invitation: 'Red, green, or the colour that catches your eye?',
    line: 'A bangle turns in the lamplight. The conversation is as much a part of the purchase as the colour.',
    action: 'Choose a bangle', caption: 'Glass catches the light. A small, bright sound at the counter.',
    memory: 'A flash of red in the lamplight. Something small to carry home.',
    next: 'Across the lane, tiny glass bottles hold another kind of memory.',
    icon: 'bangle',
  },
  {
    id: 'attar', number: '03', name: 'An evening, bottled', place: 'The attar shop', object: 'A trace of fragrance',
    x: 1370, y: 590, camera: { x: 1310, y: 580 }, color: '#97A58A',
    invitation: 'Some memories arrive before you have words for them.',
    line: 'The perfumer lifts a tiny bottle from the shelf. You lean closer, away from the bustle of the lane.',
    action: 'Try a little attar', caption: 'The stopper lifts. Imagine rose, warm wood, and the earth after rain.',
    memory: 'An amber bottle, a patient shopkeeper, a fragrance imagined long after leaving.',
    next: 'There is no last stop. Wander back to whatever caught your eye.',
    icon: 'bottle',
  },
];

export const MEMORY_KEY = 'dhm_charminar_evening_v1';
