/**
 * src/lib/kgbUtils.ts
 * Centralized logic for Salary Table (PP No. 5 2024) and KGB calculations.
 */

export const SALARY_DATA: Record<string, Record<number, number>> = {
  "iiia": { 0: 2785700, 2: 2873500, 4: 2964000, 6: 3057300, 8: 3153600, 10: 3252900, 12: 3355400, 14: 3461100, 16: 3570100, 18: 3682500, 20: 3798500, 22: 3918100, 24: 4041500, 26: 4168800, 28: 4300100, 30: 4435500, 32: 4575200 },
  "iiib": { 0: 2903600, 2: 2995000, 4: 3089300, 6: 3186600, 8: 3287000, 10: 3390500, 12: 3497300, 14: 3607500, 16: 3721100, 18: 3838300, 20: 3959200, 22: 4083900, 24: 4212500, 26: 4345100, 28: 4482000, 30: 4623200, 32: 4768800 },
  "iiic": { 0: 3026400, 2: 3121700, 4: 3220000, 6: 3321400, 8: 3426000, 10: 3533900, 12: 3645200, 14: 3760100, 16: 3878500, 18: 4000600, 20: 4126600, 22: 4256600, 24: 4390700, 26: 4528900, 28: 4671600, 30: 4818700, 32: 4970500 },
  "iiid": { 0: 3154400, 2: 3253700, 4: 3356200, 6: 3461900, 8: 3571000, 10: 3683400, 12: 3799400, 14: 3919100, 16: 4042500, 18: 4169900, 20: 4301200, 22: 4436700, 24: 4576400, 26: 4720500, 28: 4869200, 30: 5022500, 32: 5180700 },
  "iva": { 0: 3287800, 2: 3391400, 4: 3498200, 6: 3608400, 8: 3722000, 10: 3839200, 12: 3960200, 14: 4084900, 16: 4213500, 18: 4346200, 20: 4483100, 22: 4624300, 24: 4770000, 26: 4920200, 28: 5075200, 30: 5235000, 32: 5399900 },
  "ivb": { 0: 3426900, 2: 3534800, 4: 3646200, 6: 3761000, 8: 3879500, 10: 4001600, 12: 4127700, 14: 4257700, 16: 4391800, 18: 4530100, 20: 4672800, 22: 4819900, 24: 4971700, 26: 5128300, 28: 5289800, 30: 5456400, 32: 5628300 },
  "ivc": { 0: 3571900, 2: 3684400, 4: 3800400, 6: 3920100, 8: 4043600, 10: 4170900, 12: 4302300, 14: 4437800, 16: 4577500, 18: 4721700, 20: 4870400, 22: 5023800, 24: 5182000, 26: 5345200, 28: 5513600, 30: 5687200, 32: 5866400 },
  "ivd": { 0: 3723000, 2: 3840200, 4: 3961200, 6: 4085900, 8: 4214600, 10: 4347300, 12: 4484300, 14: 4625500, 16: 4771200, 18: 4921400, 20: 5076400, 22: 5236300, 24: 5401200, 26: 5571400, 28: 5746800, 30: 5927800, 32: 6114500 },
  "ive": { 0: 3880400, 2: 4002700, 4: 4128700, 6: 4258700, 8: 4392900, 10: 4531200, 12: 4673900, 14: 4821100, 16: 4973000, 18: 5129600, 20: 5291200, 22: 5457800, 24: 5629700, 26: 5807000, 28: 5989900, 30: 6178600, 32: 6373200 },
  "ia": { 0: 1685700, 1: 1738800, 2: 1793500, 3: 1850000, 4: 1908300, 5: 1968400, 6: 2030400, 7: 2094300, 8: 2160300, 9: 2228300, 10: 2298500, 11: 2370900, 12: 2445500, 13: 2522600, 14: 2602000, 15: 2683900, 16: 2768500, 17: 2855700, 18: 2945600, 19: 3038400, 20: 3134100, 21: 3232900, 22: 3334900, 23: 3440000, 24: 3548400, 25: 3660200, 26: 3775500, 27: 3894300 },
  "ib": { 3: 1840800, 5: 1898800, 7: 1958600, 9: 2020300, 11: 2083900, 13: 2149600, 15: 2217300, 17: 2287100, 19: 2359100, 21: 2433400, 23: 2510100, 25: 2589100, 27: 2670700 },
  "ic": { 3: 1918700, 5: 1979100, 7: 2041500, 9: 2105800, 11: 2172100, 13: 2240500, 15: 2311100, 17: 2383900, 19: 2458900, 21: 2536400, 23: 2616300, 25: 2698700, 27: 2783700 },
  "id": { 3: 1999900, 5: 2062900, 7: 2127800, 9: 2194800, 11: 2264000, 13: 2335300, 15: 2408800, 17: 2484700, 19: 2562900, 21: 2643700, 23: 2726900, 25: 2812800, 27: 2901400 },
  "iia": { 0: 2184000, 1: 2218400, 3: 2288200, 5: 2360300, 7: 2434600, 9: 2511300, 11: 2590400, 13: 2672000, 15: 2756200, 17: 2843000, 19: 2932500, 21: 3024900, 23: 3120100, 25: 3218400, 27: 3319800, 29: 3424300, 31: 3532200, 33: 3643400 },
  "iib": { 3: 2385000, 5: 2460100, 7: 2537600, 9: 2617500, 11: 2700000, 13: 2785000, 15: 2872700, 17: 2963200, 19: 3056500, 21: 3152800, 23: 3252100, 25: 3354500, 27: 3460200, 29: 3569200, 31: 3681600, 33: 3797500 },
  "iic": { 3: 2485900, 5: 2564200, 7: 2645000, 9: 2728300, 11: 2814200, 13: 2902800, 15: 2994300, 17: 3088600, 19: 3185800, 21: 3286200, 23: 3389700, 25: 3496400, 27: 3606500, 29: 3720100, 31: 3837300, 33: 3958200 },
  "iid": { 3: 2591100, 5: 2672700, 7: 2756800, 9: 2843700, 11: 2933200, 13: 3025600, 15: 3120900, 17: 3219200, 19: 3320600, 21: 3425200, 23: 3533100, 25: 3644300, 27: 3759100, 29: 3877500, 31: 3999600, 33: 4125600 },
};

export const parseGaji = (gajiStr: any) => {
  if (!gajiStr) return 0;
  return parseInt(String(gajiStr).replace(/[^0-9]/g, '')) || 0;
};

export const parseMKG = (mkgStr: string) => {
  const match = String(mkgStr).match(/\d+/);
  return match ? parseInt(match[0]) : 0;
};

export const formatGolKey = (golStr: string) => {
  if (!golStr) return "";
  return golStr.replace(/[\/\s]/g, '').toLowerCase();
};

export const calculateKGB = (emp: any) => {
  const currentMKG = parseMKG(emp.mkg);
  const newMKG = currentMKG + 2;
  const golKey = formatGolKey(emp.golongan);
  
  const actualOldGaji = parseGaji(emp.gaji);
  const tableData = SALARY_DATA[golKey];
  
  let finalNewGaji = 0;
  let stepIncrease = 0;
  
  // LOGIC: Direct Lookup (Absolute)
  // If the new MKG exists in the official table, use that exact value
  if (tableData && tableData[newMKG] !== undefined) {
    finalNewGaji = tableData[newMKG];
    stepIncrease = finalNewGaji - actualOldGaji;
  } else {
    // Fallback if MKG is not in table (e.g. above 32 years)
    // Add 3% or minimum 120k
    stepIncrease = Math.max(120000, Math.floor(actualOldGaji * 0.03));
    finalNewGaji = actualOldGaji + stepIncrease;
  }
  
  return { 
    oldGaji: actualOldGaji, 
    newGaji: finalNewGaji, 
    increase: stepIncrease, 
    currentMKG, 
    newMKG 
  };
};

export const formatIDRCurrency = (num: number) => {
  return new Intl.NumberFormat('id-ID').format(num);
};

export const isKGBDueSoon = (dateString: string) => {
  if (!dateString) return false;
  const targetDate = new Date(dateString);
  const now = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(now.getDate() + 30);

  // Consider it due if it's within the next 30 days and not in the past
  return targetDate <= thirtyDaysFromNow && targetDate >= now;
};

export const getDaysRemaining = (dateString: string) => {
  if (!dateString) return 0;
  const targetDate = new Date(dateString);
  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
