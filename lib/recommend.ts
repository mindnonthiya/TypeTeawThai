export type Profile = {
  nature: number;
  cafe: number;
  adventure: number;
  culture: number;
  sea: number;
};

export type OptionScore = Profile;

export type ProvinceScores = {
  nature_score: number;
  cafe_score: number;
  adventure_score: number;
  culture_score: number;
  sea_score: number;
};

export function computeProfile(optionScores: OptionScore[]): Profile {
  const base = optionScores.reduce<Profile>(
    (acc, o) => {
      acc.nature += o.nature || 0;
      acc.cafe += o.cafe || 0;
      acc.adventure += o.adventure || 0;
      acc.culture += o.culture || 0;
      acc.sea += o.sea || 0;
      return acc;
    },
    { nature: 0, cafe: 0, adventure: 0, culture: 0, sea: 0 }
  );

  const total =
    base.nature +
    base.cafe +
    base.adventure +
    base.culture +
    base.sea;

  if (total === 0) return base;

  return {
    nature: base.nature / total,
    cafe: base.cafe / total,
    adventure: base.adventure / total,
    culture: base.culture / total,
    sea: base.sea / total,
  };
}

export function provinceMatchScore(profile: Profile, p: ProvinceScores): number {
  const provinceTotal =
    (p.nature_score || 0) +
    (p.cafe_score || 0) +
    (p.adventure_score || 0) +
    (p.culture_score || 0) +
    (p.sea_score || 0);

  if (provinceTotal === 0) return 0;

  const normalizedProvince = {
    nature: (p.nature_score || 0) / provinceTotal,
    cafe: (p.cafe_score || 0) / provinceTotal,
    adventure: (p.adventure_score || 0) / provinceTotal,
    culture: (p.culture_score || 0) / provinceTotal,
    sea: (p.sea_score || 0) / provinceTotal,
  };

  return (
    normalizedProvince.nature * profile.nature +
    normalizedProvince.cafe * profile.cafe +
    normalizedProvince.adventure * profile.adventure +
    normalizedProvince.culture * profile.culture +
    normalizedProvince.sea * profile.sea
  );
}

export function topTraits(profile: Profile): Array<keyof Profile> {
  const entries = Object.entries(profile) as Array<[keyof Profile, number]>;
  return entries.sort((a, b) => b[1] - a[1]).map((x) => x[0]);
}

export type Attraction = {
  id: number;
  province_id: number
  name_th: string;
  name_en: string;
  description: string | null;
  categories: string[] | null;
};

export function pickAttractions(profile: Profile, all: Attraction[], limit = 3): Attraction[] {
  const traits = topTraits(profile);
  const scoreOne = (a: Attraction) => {
    const cats = (a.categories || []).map((s) => String(s).toLowerCase());
    let s = 0;

    for (const t of traits.slice(0, 3)) {
      if (cats.includes(String(t))) {
        s += profile[t]; // ใช้น้ำหนักจริง
      }
    }

    return s;
  };
  return [...all].sort((a, b) => scoreOne(b) - scoreOne(a)).slice(0, limit);
}


export function provinceAttractionAffinity(profile: Profile, all: Attraction[]): number {
  if (!all.length) return 0;

  const weights: Record<keyof Profile, number> = {
    nature: profile.nature,
    cafe: profile.cafe,
    adventure: profile.adventure,
    culture: profile.culture,
    sea: profile.sea,
  };

  const hitRate = {
    nature: 0,
    cafe: 0,
    adventure: 0,
    culture: 0,
    sea: 0,
  } satisfies Record<keyof Profile, number>;

  for (const attraction of all) {
    const cats = new Set((attraction.categories || []).map((c) => String(c).toLowerCase()));
    (Object.keys(hitRate) as Array<keyof Profile>).forEach((trait) => {
      if (cats.has(trait)) hitRate[trait] += 1;
    });
  }

  const normalized = (Object.keys(hitRate) as Array<keyof Profile>).reduce((acc, trait) => {
    acc[trait] = hitRate[trait] / all.length;
    return acc;
  }, { nature: 0, cafe: 0, adventure: 0, culture: 0, sea: 0 } as Record<keyof Profile, number>);

  return (Object.keys(weights) as Array<keyof Profile>).reduce(
    (sum, trait) => sum + normalized[trait] * weights[trait],
    0
  );
}
