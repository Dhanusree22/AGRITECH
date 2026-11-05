// Comprehensive Agricultural Knowledge Base for AGRITECH AI Agent
// Verified agronomic guidance based on ICAR, State Agricultural Universities, and Mandi Board standards.

export interface CropAgronomyGuide {
  crop: string;
  category: string;
  scientificName: string;
  seasonPeak: string;
  soilRequirements: string;
  irrigationSchedule: string;
  fertilizerNPK: {
    basal: string;
    topDressing: string;
    micronutrients: string;
  };
  yieldImprovementTips: string[];
  majorDiseases: Array<{
    name: string;
    symptoms: string;
    treatment: string;
    preventiveAction: string;
  }>;
  majorPests: Array<{
    name: string;
    symptoms: string;
    treatment: string;
  }>;
  harvestingAndStorage: {
    maturitySigns: string;
    optimalHarvestTime: string;
    curingAndPostHarvest: string;
    safeStorageConditions: string;
    shelfLifeDays: number;
  };
}

export const AGRONOMIC_KNOWLEDGE: Record<string, CropAgronomyGuide> = {
  'Tomato': {
    crop: 'Tomato',
    category: 'Vegetables',
    scientificName: 'Solanum lycopersicum',
    seasonPeak: 'Kharif Late & Rabi (Aug-Feb)',
    soilRequirements: 'Well-drained sandy loam to clay loam with pH 6.0 - 7.0. Deep ploughing with 20-25 tons of well-rotted Farmyard Manure (FYM) per hectare.',
    irrigationSchedule: 'Drip irrigation at 4-6 day intervals. Avoid overhead watering during flowering and fruit setting to prevent fungal blossom drop.',
    fertilizerNPK: {
      basal: 'Apply 120 kg Nitrogen, 80 kg Phosphorus (P2O5), and 80 kg Potassium (K2O) per hectare. Apply full P & K with 1/3 N at transplanting.',
      topDressing: 'Remaining Nitrogen in 2 split doses at 30 and 45 days after transplanting (DAT). Drip fertigation with 19:19:19 water-soluble grade during active vegetative growth.',
      micronutrients: 'Foliar spray of Boron (0.2%) and Zinc Sulfate (0.5%) at flowering stage prevents flower drop and fruit cracking.',
    },
    yieldImprovementTips: [
      'Install bamboo trellis or wire staking to keep fruit off moist ground and boost Grade-A yield by 25-35%.',
      'Use 25-micron silver-black plastic mulch to conserve root zone moisture, suppress weed competition, and reduce viral thrips vectors.',
      'Regular side-shoot pruning (leaving 2 primary stems) encourages larger, uniform fruit size meeting supermarket export standards.',
      'Apply Trichoderma viride enriched compost at 5 kg/hectare during final bed preparation to guard against soil-borne root rot.',
    ],
    majorDiseases: [
      {
        name: 'Early Blight (Alternaria solani)',
        symptoms: 'Concentric dark brown circular rings on lower leaves resembling target boards, progressing upward into yellowing and defoliation.',
        treatment: 'Spray Mancozeb 75% WP @ 2.5 g/L or Azoxystrobin 23% SC @ 1 ml/L at first appearance of target spots.',
        preventiveAction: 'Maintain adequate plant spacing (60 x 45 cm) for air circulation and avoid overhead sprinkler splash.',
      },
      {
        name: 'Tomato Leaf Curl Virus (TLCV)',
        symptoms: 'Upward curling and crinkling of leaves, stunted bushy growth, and failure to set marketable fruit.',
        treatment: 'Transmit by whitefly (Bemisia tabaci). Spray Thiamethoxam 25% WG @ 0.3 g/L or Imidacloprid 17.8% SL @ 0.5 ml/L to control vector insects.',
        preventiveAction: 'Install yellow sticky traps (15-20 traps/acre) and grow 2-3 barrier rows of border maize.',
      },
      {
        name: 'Bacterial Wilt (Ralstonia solanacearum)',
        symptoms: 'Sudden daytime wilting of green foliage without prior yellowing; vascular browning visible when stem is cut.',
        treatment: 'Drench soil root zone with Copper Oxychloride (3 g/L) + Streptocycline (1 g in 10 L water).',
        preventiveAction: 'Crop rotation with non-solanaceous crops (maize, marigold, paddy) and use of resistant rootstocks.',
      },
    ],
    majorPests: [
      {
        name: 'Fruit Borer (Helicoverpa armigera)',
        symptoms: 'Circular holes bored into green and ripe fruits with caterpillar feeding inside; rot sets in around entrance holes.',
        treatment: 'Spray Chlorantraniliprole 18.5% SC @ 0.3 ml/L or Emamectin Benzoate 5% SG @ 0.4 g/L. Hang 4-5 pheromone traps per acre.',
      },
      {
        name: 'Thrips and Leaf Miners',
        symptoms: 'Silvery sheen and curling on underside of leaves; winding white trails mined inside leaves.',
        treatment: 'Spray Neem oil 10,000 ppm @ 3 ml/L or Spinosad 45% SC @ 0.35 ml/L.',
      },
    ],
    harvestingAndStorage: {
      maturitySigns: 'Harvest at breaker or pink blush stage for long-distance mandi transit, and full red-ripe stage for local terminal distribution.',
      optimalHarvestTime: 'Early morning hours (06:00 - 09:30 AM) before field ambient temperature rises above 28°C.',
      curingAndPostHarvest: 'Graded into Grade-A (blemish-free, uniform shape), Grade-B (slight shape variation), and packed in ventilated 10 kg plastic crates.',
      safeStorageConditions: 'Cool, shaded transit or ventilated packhouse at 12-14°C and 85-90% relative humidity. Never store below 10°C to avoid chilling injury.',
      shelfLifeDays: 7,
    },
  },

  'Red Onion': {
    crop: 'Red Onion',
    category: 'Vegetables',
    scientificName: 'Allium cepa',
    seasonPeak: 'Late Kharif & Rabi (Oct-May)',
    soilRequirements: 'Friable, loose sandy loam rich in organic humus with pH 6.5 - 7.5. Good internal drainage is essential to avoid bulb neck rot.',
    irrigationSchedule: 'Light, frequent watering every 6-8 days. Completely stop irrigation 12-15 days before harvesting to allow bulb necks to soften and mature.',
    fertilizerNPK: {
      basal: '100 kg N, 50 kg P2O5, 60 kg K2O, plus 30 kg elemental Sulfur per hectare (Sulfur is crucial for pungency, firmness, and storage life).',
      topDressing: 'Apply half Nitrogen at 30 days and remaining half at 45 days after transplanting. Avoid late Nitrogen application after 60 days to prevent thick necks.',
      micronutrients: 'Zinc Sulfate @ 15 kg/ha basal. Foliar spray of Potassium Nitrate (13:0:45) @ 1% at 65-75 days boosts bulb enlargement.',
    },
    yieldImprovementTips: [
      'Transplant 6-7 week old sturdy seedlings on raised broad beds (BBF) to prevent waterlogging and increase bulb weight by 20%.',
      'Apply Sulfur (Bentonite Sulfur 90%) @ 25 kg/ha; it enhances pyruvic acid content, bulb skin thickness, and prevents storage rot.',
      'Maintain strict 15 x 10 cm seedling spacing. Overcrowding leads to undersized, deformed twin bulbs.',
      'Stop irrigation 2 weeks before harvest when 50% of plant tops fall naturally (neck fall stage).',
    ],
    majorDiseases: [
      {
        name: 'Purple Blotch (Alternaria porri)',
        symptoms: 'Small, sunken water-soaked spots on leaves with purplish-brown centers surrounded by yellow margins; leaves break at lesion site.',
        treatment: 'Spray Difenoconazole 25% EC @ 1 ml/L or Tebuconazole 25.9% EC @ 1 ml/L mixed with sticking agent (sticker 0.5 ml/L).',
        preventiveAction: 'Seed treatment with Thiram @ 3 g/kg and avoid dense sprinkler irrigation late in the evening.',
      },
      {
        name: 'Basal Rot (Fusarium oxysporum f.sp. cepae)',
        symptoms: 'Yellowing and dieback of leaves starting from the tips, roots rot and turn pinkish-brown, bulb base becomes soft.',
        treatment: 'Drench nursery and field beds with Carbendazim 50% WP @ 2 g/L.',
        preventiveAction: 'Dip roots in Trichoderma viride suspension (10 g/L) for 20 minutes before field transplanting.',
      },
    ],
    majorPests: [
      {
        name: 'Onion Thrips (Thrips tabaci)',
        symptoms: 'Silvery-white patches on foliage due to sap feeding, leaf tips turn brown and curl upwards.',
        treatment: 'Spray Fipronil 5% SC @ 1.5 ml/L or Spinetoram 11.7% SC @ 0.8 ml/L. Use blue sticky traps (10-12 per acre).',
      },
    ],
    harvestingAndStorage: {
      maturitySigns: 'Harvest when 50-70% of crop shows natural neck fall (tops lodge over) and bulb outer scales dry into bright red color.',
      optimalHarvestTime: 'Dry sunny weather. Lift bulbs carefully without damaging the basal plate.',
      curingAndPostHarvest: 'Field windrow curing for 3-5 days under light shade, followed by neck trimming leaving 2.5 cm stem attached. Shade curing for 10-12 days.',
      safeStorageConditions: 'Well-ventilated traditional Kanda Chawl or cold store at ambient 25-30°C with 65-70% relative humidity. Ensure cross-ventilation.',
      shelfLifeDays: 45,
    },
  },

  'Potato': {
    crop: 'Potato',
    category: 'Vegetables',
    scientificName: 'Solanum tuberosum',
    seasonPeak: 'Rabi Harvest (Jan-April)',
    soilRequirements: 'Loose, friable sandy loam rich in organic matter with pH 5.2 - 6.5. Free of clods and stones to allow uninhibited tuber expansion.',
    irrigationSchedule: 'First light irrigation immediately after planting. Irrigate every 8-10 days. Avoid flooding ridge crests to prevent tuber greening and rot.',
    fertilizerNPK: {
      basal: 'Apply 150 kg N, 100 kg P2O5, 120 kg K2O per hectare. Use Sulfate of Potash (SOP) instead of Muriate of Potash (MOP) for higher starch and processing grade.',
      topDressing: 'Half Nitrogen at earthing up (30-35 days after planting).',
      micronutrients: 'Foliar spray of Zinc Sulfate (0.2%) + Ferrous Sulfate (0.2%) at 40 days.',
    },
    yieldImprovementTips: [
      'Earthing up at 30-35 days when plants are 15-20 cm high is essential to prevent exposed tubers from turning toxic green (solanine accumulation).',
      'Plant certified disease-free sprouted seed tubers of 40-50 gram weight at 60 x 20 cm spacing.',
      'Perform dehaulming (cutting off vegetative tops) 10-12 days before harvest to allow tuber skins to harden and resist transit bruises.',
    ],
    majorDiseases: [
      {
        name: 'Late Blight (Phytophthora infestans)',
        symptoms: 'Water-soaked irregular dark lesions on leaf tips and margins; white cottony fungal growth on lower leaf surface in humid foggy weather.',
        treatment: 'Spray Cymoxanil 8% + Mancozeb 64% WP @ 2.5 g/L or Dimethomorph 50% WP @ 1 g/L as curative.',
        preventiveAction: 'Preventive spray of Mancozeb 75% WP @ 2.5 g/L before onset of cloudy, humid winter weather.',
      },
    ],
    majorPests: [
      {
        name: 'Potato Tuber Moth (Phthorimaea operculella)',
        symptoms: 'Larvae mine leaves and bore into tubers, leaving dark frass near the eyes.',
        treatment: 'Ensure proper earthing up to cover all tubers. Spray Bacillus thuringiensis (Bt) @ 2 g/L in field and dusting with sand layer in storage.',
      },
    ],
    harvestingAndStorage: {
      maturitySigns: 'Tops turn yellow and dry 10-15 days after dehaulming; tuber skin resists peeling under moderate thumb pressure.',
      optimalHarvestTime: 'Bright sunny days when soil has optimum moisture to prevent cuts.',
      curingAndPostHarvest: 'Cure tubers in dark heaps covered with dry paddy straw for 10-15 days at 15-20°C to heal surface wounds and set skin.',
      safeStorageConditions: 'Cold storage at 8-10°C with 85-90% RH for table potatoes, or 10-12°C for chips/processing varieties to prevent sugar accumulation.',
      shelfLifeDays: 60,
    },
  },

  'Paddy / Sona Masoori Rice': {
    crop: 'Paddy / Sona Masoori Rice',
    category: 'Grains & Cereals',
    scientificName: 'Oryza sativa',
    seasonPeak: 'Kharif Harvest (Nov-Jan) & Rabi (April-May)',
    soilRequirements: 'Clay loam or heavy clay soils with good water-holding capacity and pH 6.0 - 7.5.',
    irrigationSchedule: 'Maintain 2-5 cm shallow standing water from tillering to grain filling. Drain water 10-12 days before anticipated harvesting.',
    fertilizerNPK: {
      basal: '120 kg N, 60 kg P2O5, 40 kg K2O, plus 25 kg Zinc Sulfate per hectare. Zinc deficiency (Khaira disease) is very common in submerged soils.',
      topDressing: 'Nitrogen in 3 equal splits: 1/3 basal, 1/3 at maximum tillering (25-30 DAT), 1/3 at panicle initiation (45-50 DAT).',
      micronutrients: 'Zinc Sulfate 25 kg/ha soil application. In standing crop showing rusty brown spots, spray Zinc Sulfate @ 5 g/L with 2.5 g lime.',
    },
    yieldImprovementTips: [
      'Adopt SRI (System of Rice Intensification) or alternate wetting and drying (AWD) to cut water usage by 30% and boost productive tillers.',
      'Maintain 20 x 15 cm hill spacing with 2 seedlings per hill instead of dense clumps.',
      'Foliar spray of Potassium Schoenite or 0:0:50 @ 10 g/L at 50% flowering to enhance grain filling and reduce chaffy grains.',
    ],
    majorDiseases: [
      {
        name: 'Blast Disease (Magnaporthe oryzae)',
        symptoms: 'Spindle-shaped eye spots with ash-colored centers on leaves; blackening and rotting of neck node (neck blast) causing panicle breakage.',
        treatment: 'Spray Tricyclazole 75% WP @ 0.6 g/L or Isoprothiolane 40% EC @ 1.5 ml/L at first spot appearance.',
        preventiveAction: 'Avoid excess nitrogen fertilizer application during cloudy weather and treat seed with Carbendazim @ 2 g/kg.',
      },
      {
        name: 'Sheath Blight (Rhizoctonia solani)',
        symptoms: 'Oval snake-skin like greenish-grey lesions on leaf sheaths near water line, spreading upward.',
        treatment: 'Spray Hexaconazole 5% SC @ 2 ml/L or Validamycin 3% L @ 2.5 ml/L.',
        preventiveAction: 'Keep bunds clean of grassy weed hosts and avoid over-dense planting.',
      },
    ],
    majorPests: [
      {
        name: 'Brown Plant Hopper (BPH - Nilaparvata lugens)',
        symptoms: 'Hoppers suck sap at stem base causing circular patches of drying called "hopper burn" in dense canopy.',
        treatment: 'Spray Pymetrozine 50% WG @ 0.6 g/L or Triflumezopyrim 10% SC @ 0.5 ml/L. Direct spray to the base of the plant.',
      },
    ],
    harvestingAndStorage: {
      maturitySigns: '80-85% of panicles turn golden yellow and grain moisture drops to 20-22%.',
      optimalHarvestTime: 'Harvest promptly to prevent shattering losses and sun-cracking of milled grains.',
      curingAndPostHarvest: 'Thresh and dry paddy on clean tarpaulins until moisture content drops to 12-14% for long-term grain storage.',
      safeStorageConditions: 'Store in dry metal bins or hermetic bags in moisture-free godowns with pallets off the floor.',
      shelfLifeDays: 365,
    },
  },

  'Green Chilli': {
    crop: 'Green Chilli',
    category: 'Spices',
    scientificName: 'Capsicum annuum',
    seasonPeak: 'Rabi & Winter Flush (Dec-April)',
    soilRequirements: 'Rich, light, well-aerated sandy loam with pH 6.5 - 7.5.',
    irrigationSchedule: 'Irrigate every 5-7 days. Stagnant water causes collar rot and flower shedding.',
    fertilizerNPK: {
      basal: '100 kg N, 50 kg P2O5, 50 kg K2O per hectare with 25 tons FYM.',
      topDressing: 'Nitrogen in 3 splits at 30, 60, and 90 DAT. Potassium nitrate foliar spray at peak fruiting flushes.',
      micronutrients: 'Magnesium Sulfate @ 10 kg/ha and Boron spray (0.15%) at flowering.',
    },
    yieldImprovementTips: [
      'Nipping / topping of terminal shoots at 30-35 DAT encourages profuse secondary branching and doubles fruit-bearing nodes.',
      'Spray Planofix (NAA) @ 4 ml per 15 L water at flowering to control flower and young fruit shedding.',
      'Install yellow and blue sticky traps (15 each per acre) to control whitefly and thrips vectors of leaf curl murda disease.',
    ],
    majorDiseases: [
      {
        name: 'Chilli Leaf Curl (Murda Complex)',
        symptoms: 'Severe upward curling of leaves, boat-shaped puckering, stunted bushy plant growth, caused by thrips, mites, and geminivirus.',
        treatment: 'Spray Diafenthiuron 50% WP @ 1.25 g/L or Fipronil 5% SC @ 1.5 ml/L for thrips and Spiromesifen 22.9% SC @ 1 ml/L for mites.',
        preventiveAction: 'Eradicate infected plants early and maintain weed-free bunds.',
      },
      {
        name: 'Anthracnose / Fruit Rot (Colletotrichum capsici)',
        symptoms: 'Circular sunken dark lesions with concentric rings of black dots on ripening chillies, causing premature fruit drop and rot.',
        treatment: 'Spray Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1 ml/L or Copper Oxychloride @ 2.5 g/L.',
        preventiveAction: 'Seed treatment with Thiram @ 3 g/kg and avoid sprinkler irrigation.',
      },
    ],
    majorPests: [
      {
        name: 'Chilli Thrips (Scirtothrips dorsalis)',
        symptoms: 'Upward curling of leaf margins, brownish streaks on lower surface, and corky scarring on fruits.',
        treatment: 'Spray Spinosad 45% SC @ 0.35 ml/L or Acetamiprid 20% SP @ 0.4 g/L.',
      },
    ],
    harvestingAndStorage: {
      maturitySigns: 'Harvest green chillies when fully grown, firm, and glossy dark green before color turning.',
      optimalHarvestTime: 'Harvest in morning sessions at 7-10 day intervals across multiple flushes.',
      curingAndPostHarvest: 'Sort into Grade-A (long, uniform, unblemished) and pack in aerated mesh bags or ventilated 10 kg crates.',
      safeStorageConditions: 'Cool storage at 8-10°C with 90-95% RH preserves crispness for up to 12-14 days.',
      shelfLifeDays: 12,
    },
  },

  'Cotton': {
    crop: 'Cotton',
    category: 'Cash Crops',
    scientificName: 'Gossypium hirsutum',
    seasonPeak: 'Kharif Harvest (Oct-Jan)',
    soilRequirements: 'Deep black cotton soils (Vertisols) with high clay content and water retention capacity with pH 7.0 - 8.5.',
    irrigationSchedule: 'Crucial irrigation at square formation, flowering, and boll development stages. Withhold water when bolls begin to open.',
    fertilizerNPK: {
      basal: '120 kg N, 60 kg P2O5, 60 kg K2O per hectare. Magnesium Sulfate @ 25 kg/ha to avoid red leaf disease.',
      topDressing: 'Split Nitrogen at square formation and boll development. Foliar spray of 2% Urea + 2% DAP at peak boll development.',
      micronutrients: 'Foliar spray of 0.15% Boron + 1% Potassium Nitrate (13:0:45) at flowering stage enhances boll size and fiber strength.',
    },
    yieldImprovementTips: [
      'Square drop management: Spray Planofix @ 1 ml per 4.5 L water during peak flowering to prevent premature square and young boll shedding.',
      'Detopping (nipping the main stem terminal) at 85-90 days after sowing prevents vegetative overgrowth and directs photoassimilates into boll maturation.',
      'Intercrop with blackgram or greengram (1:2 ratio) to boost nitrogen fixation and suppress weed growth.',
    ],
    majorDiseases: [
      {
        name: 'Bacterial Blight / Angular Leaf Spot (Xanthomonas citri pv. malvacearum)',
        symptoms: 'Angular water-soaked spots on leaves bounded by veins; black lesions on petioles and stems (black arm) and circular water-soaked spots on bolls.',
        treatment: 'Spray Copper Oxychloride 50% WP @ 2.5 g/L + Streptocycline @ 1 g in 10 L water.',
        preventiveAction: 'Acid delinting of seeds with commercial sulfuric acid (100 ml/kg seed).',
      },
    ],
    majorPests: [
      {
        name: 'Pink Bollworm (Pectinophora gossypiella)',
        symptoms: 'Rosetted flowers that fail to open properly; larvae bore into young bolls, damaging fiber and seeds with stained lint.',
        treatment: 'Install pheromone traps (5/acre for monitoring, 15/acre for mass trapping). Spray Chlorantraniliprole 18.5% SC @ 0.3 ml/L or Emamectin Benzoate 5% SG @ 0.4 g/L.',
      },
    ],
    harvestingAndStorage: {
      maturitySigns: 'Harvest when bolls fully burst open and cotton fiber is clean, fluffy, and dry.',
      optimalHarvestTime: 'Bright sunny days after dew has completely evaporated (10:00 AM onwards). Never pick wet or dew-soaked cotton.',
      curingAndPostHarvest: 'Sort and dry on clean cement floors or tarpaulins. Keep free from bracts, dry leaves, and dirt to obtain premium MSP price.',
      safeStorageConditions: 'Store in dry godowns with moisture content under 8-9% to prevent microbial discoloration and spontaneous heating.',
      shelfLifeDays: 365,
    },
  },

  'Turmeric': {
    crop: 'Turmeric',
    category: 'Spices',
    scientificName: 'Curcuma longa',
    seasonPeak: 'Post-Harvest (Feb-May)',
    soilRequirements: 'Deep, loose, fertile sandy or clay loam with high organic humus and pH 5.5 - 7.5. Raised beds are mandatory.',
    irrigationSchedule: 'Irrigate every 7-10 days depending on soil moisture. Ensure perfect drainage to prevent rhizome rot.',
    fertilizerNPK: {
      basal: '60 kg N, 50 kg P2O5, 120 kg K2O with 30 tons FYM per hectare. Turmeric is a heavy potassium feeder.',
      topDressing: 'Nitrogen in 3 splits at 30, 60, and 90 days after planting along with earthing up.',
      micronutrients: 'Zinc Sulfate @ 15 kg/ha and Ferrous Sulfate @ 25 kg/ha applied at planting.',
    },
    yieldImprovementTips: [
      'Multi-tier mulching with green leaves (15 tons/ha at planting, 7.5 tons at 45 and 90 days) suppresses weeds and adds organic matter.',
      'Plant mother rhizomes or primary fingers of 35-45 g weight treated with Trichoderma viride.',
      'Earthing up at 45 and 90 days provides loose soil for prolific finger expansion.',
    ],
    majorDiseases: [
      {
        name: 'Rhizome Rot (Pythium aphanidermatum)',
        symptoms: 'Lower leaves turn yellow and dry from edges inward; collar region becomes soft and water-soaked, decaying into foul odor.',
        treatment: 'Drench root zone with Metalaxyl 8% + Mancozeb 64% WP @ 2.5 g/L or Copper Oxychloride @ 3 g/L.',
        preventiveAction: 'Seed rhizome dip in Ridomil MZ (2.5 g/L) for 30 minutes before planting and ensure raised bed drainage.',
      },
    ],
    majorPests: [
      {
        name: 'Shoot Borer (Conogethes punctiferalis)',
        symptoms: 'Larvae bore into pseudostems feeding on internal tissues; central leaf shoot wilts and dries up (dead heart).',
        treatment: 'Spray Chlorantraniliprole 18.5% SC @ 0.3 ml/L or Flubendiamide 39.35% SC @ 0.25 ml/L.',
      },
    ],
    harvestingAndStorage: {
      maturitySigns: 'Leaves turn yellow, dry completely, and lodge over at 7-9 months after planting.',
      optimalHarvestTime: 'February to April when soil is dry.',
      curingAndPostHarvest: 'Boil freshly harvested clean rhizomes in water for 45-60 minutes until soft, followed by sun-drying for 10-15 days and mechanical polishing.',
      safeStorageConditions: 'Polished dried turmeric fingers stored in clean gunny bags in dark, dry, moisture-free godowns at 8-10% moisture.',
      shelfLifeDays: 365,
    },
  },
};

// General Agronomic Wisdom & Troubleshooting Search
export function queryAgronomicKnowledge(cropQuery?: string, topicQuery?: string): {
  found: boolean;
  cropName: string;
  summary: string;
  details: string[];
} {
  const normCrop = (cropQuery || '').toLowerCase();
  const normTopic = (topicQuery || '').toLowerCase();

  const matchedKey = Object.keys(AGRONOMIC_KNOWLEDGE).find(
    (k) => k.toLowerCase().includes(normCrop) || normCrop.includes(k.toLowerCase())
  ) || 'Tomato';

  const guide = AGRONOMIC_KNOWLEDGE[matchedKey];
  if (!guide) {
    return {
      found: false,
      cropName: cropQuery || 'Crop',
      summary: 'General agricultural best management practices apply.',
      details: [
        'Maintain well-drained fertile soil with balanced organic manure and soil testing.',
        'Adopt integrated pest management (IPM) combining sticky traps, bio-pesticides, and approved remedies.',
        'Verify local APMC mandi modal rates before organizing field harvest and logistics.',
      ],
    };
  }

  // Topic specific responses
  if (normTopic.includes('disease') || normTopic.includes('pest') || normTopic.includes('medicine') || normTopic.includes('rot') || normTopic.includes('blight')) {
    const dis = guide.majorDiseases[0];
    const pest = guide.majorPests[0];
    return {
      found: true,
      cropName: guide.crop,
      summary: `Primary disease for ${guide.crop} is ${dis.name}. Recommended remedy: ${dis.treatment}`,
      details: [
        `Disease: ${dis.name} - ${dis.symptoms}`,
        `Treatment: ${dis.treatment}`,
        `Prevention: ${dis.preventiveAction}`,
        pest ? `Pest Control (${pest.name}): ${pest.treatment}` : 'Use neem oil 10,000 ppm preventive spray.',
      ],
    };
  }

  if (normTopic.includes('fertilizer') || normTopic.includes('soil') || normTopic.includes('npk') || normTopic.includes('manure')) {
    return {
      found: true,
      cropName: guide.crop,
      summary: `Fertilizer schedule for ${guide.crop}: ${guide.fertilizerNPK.basal}`,
      details: [
        `Soil Preparation: ${guide.soilRequirements}`,
        `Basal Dose: ${guide.fertilizerNPK.basal}`,
        `Top Dressing: ${guide.fertilizerNPK.topDressing}`,
        `Micronutrients: ${guide.fertilizerNPK.micronutrients}`,
      ],
    };
  }

  if (normTopic.includes('yield') || normTopic.includes('produce') || normTopic.includes('production') || normTopic.includes('increase')) {
    return {
      found: true,
      cropName: guide.crop,
      summary: `Top yield boosting techniques for ${guide.crop}: ${guide.yieldImprovementTips[0]}`,
      details: guide.yieldImprovementTips,
    };
  }

  if (normTopic.includes('harvest') || normTopic.includes('storage') || normTopic.includes('shelf') || normTopic.includes('cure')) {
    return {
      found: true,
      cropName: guide.crop,
      summary: `Harvest signs for ${guide.crop}: ${guide.harvestingAndStorage.maturitySigns}`,
      details: [
        `Maturity: ${guide.harvestingAndStorage.maturitySigns}`,
        `Optimal Time: ${guide.harvestingAndStorage.optimalHarvestTime}`,
        `Post-Harvest: ${guide.harvestingAndStorage.curingAndPostHarvest}`,
        `Storage Conditions: ${guide.harvestingAndStorage.safeStorageConditions} (Shelf life: ${guide.harvestingAndStorage.shelfLifeDays} days)`,
      ],
    };
  }

  // General overview
  return {
    found: true,
    cropName: guide.crop,
    summary: `${guide.crop} (${guide.scientificName}) - ${guide.seasonPeak}. Soil: ${guide.soilRequirements}`,
    details: [
      `Key Season: ${guide.seasonPeak}`,
      `Irrigation: ${guide.irrigationSchedule}`,
      `Top Yield Factor: ${guide.yieldImprovementTips[0]}`,
      `Shelf Life: ${guide.harvestingAndStorage.shelfLifeDays} days in ventilated crates`,
    ],
  };
}
