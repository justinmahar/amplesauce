import seedrandom from 'seedrandom';

export enum Rarity {
  COMMON = 'Common',
  UNCOMMON = 'Uncommon',
  RARE = 'Rare',
  EPIC = 'Epic',
  LEGENDARY = 'Legendary',
}

export interface RarityInfo {
  name: Rarity;
  weight: number;
  eggImage: string;
  monsterChance: {
    // Defines chances for monster rarities within this egg rarity
    [key in Rarity]?: number;
  };
}

export const RARITIES: Record<Rarity, RarityInfo> = {
  [Rarity.COMMON]: {
    name: Rarity.COMMON,
    weight: 60,
    eggImage: '/media/assets/egg-1.png',
    monsterChance: {
      [Rarity.COMMON]: 80,
      [Rarity.UNCOMMON]: 15,
      [Rarity.RARE]: 5,
    },
  },
  [Rarity.UNCOMMON]: {
    name: Rarity.UNCOMMON,
    weight: 25,
    eggImage: '/media/assets/egg-2.png',
    monsterChance: {
      [Rarity.COMMON]: 40,
      [Rarity.UNCOMMON]: 40,
      [Rarity.RARE]: 15,
      [Rarity.EPIC]: 5,
    },
  },
  [Rarity.RARE]: {
    name: Rarity.RARE,
    weight: 10,
    eggImage: '/media/assets/egg-3.png',
    monsterChance: {
      [Rarity.UNCOMMON]: 40,
      [Rarity.RARE]: 40,
      [Rarity.EPIC]: 15,
      [Rarity.LEGENDARY]: 5,
    },
  },
  [Rarity.EPIC]: {
    name: Rarity.EPIC,
    weight: 4,
    eggImage: '/media/assets/egg-4.png',
    monsterChance: {
      [Rarity.RARE]: 50,
      [Rarity.EPIC]: 40,
      [Rarity.LEGENDARY]: 10,
    },
  },
  [Rarity.LEGENDARY]: {
    name: Rarity.LEGENDARY,
    weight: 1,
    eggImage: '/media/assets/egg-5.png',
    monsterChance: {
      [Rarity.EPIC]: 60,
      [Rarity.LEGENDARY]: 40,
    },
  },
};

const weightedChoose = (rng: () => number, choices: { weight: number; value: any }[]): any => {
  const totalWeight = choices.reduce((sum, choice) => sum + choice.weight, 0);
  const randomValue = rng() * totalWeight;

  let cumulativeWeight = 0;
  for (const choice of choices) {
    cumulativeWeight += choice.weight;
    if (randomValue <= cumulativeWeight) {
      return choice.value;
    }
  }
  // Fallback, should not be reached if weights are positive
  return choices[choices.length - 1].value;
};

export const getRarityForVideo = (videoId: string): RarityInfo => {
  const rng = seedrandom(videoId);
  const rarityChoices = Object.values(RARITIES).map((rarity) => ({
    weight: rarity.weight,
    value: rarity,
  }));
  return weightedChoose(rng, rarityChoices);
};
