export enum Rank {
  F = 'F',
  E = 'E',
  D = 'D',
  C = 'C',
  B = 'B',
  A = 'A',
  S = 'S',
  SS = 'SS',
  SSS = 'SSS',
  OMEGA = 'Ω',
}

export interface RankData {
  rank: Rank;
  views: {
    min: number;
    max: number | null;
  };
  hatchable: boolean;
}

export const RANKS: Record<Rank, RankData> = {
  [Rank.F]: {
    rank: Rank.F,
    views: { min: 0, max: 9 },
    hatchable: false,
  },
  [Rank.E]: {
    rank: Rank.E,
    views: { min: 10, max: 99 },
    hatchable: false,
  },
  [Rank.D]: {
    rank: Rank.D,
    views: { min: 100, max: 999 },
    hatchable: true,
  },
  [Rank.C]: {
    rank: Rank.C,
    views: { min: 1000, max: 9999 },
    hatchable: true,
  },
  [Rank.B]: {
    rank: Rank.B,
    views: { min: 10000, max: 99999 },
    hatchable: true,
  },
  [Rank.A]: {
    rank: Rank.A,
    views: { min: 100000, max: 999999 },
    hatchable: true,
  },
  [Rank.S]: {
    rank: Rank.S,
    views: { min: 1000000, max: 9999999 },
    hatchable: true,
  },
  [Rank.SS]: {
    rank: Rank.SS,
    views: { min: 10000000, max: 99999999 },
    hatchable: true,
  },
  [Rank.SSS]: {
    rank: Rank.SSS,
    views: { min: 100000000, max: 999999999 },
    hatchable: true,
  },
  [Rank.OMEGA]: {
    rank: Rank.OMEGA,
    views: { min: 1000000000, max: null },
    hatchable: true,
  },
};

export const getRankForViews = (views: number): RankData => {
  const rarities = Object.values(RANKS);
  // Iterate in reverse to find the highest qualifying rank first
  for (let i = rarities.length - 1; i >= 0; i--) {
    const rarity = rarities[i];
    const { min, max } = rarity.views;
    if (views >= min && (max === null || views <= max)) {
      return rarity;
    }
  }
  // Fallback to the lowest rank if no match is found (shouldn't happen with rank F)
  return RANKS[Rank.F];
};
