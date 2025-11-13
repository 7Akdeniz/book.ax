// Points of Interest for major cities
export const berlinPOIs = [
  {
    city_name: 'Berlin',
    type: 'AIRPORT',
    name: 'Berlin Brandenburg Airport',
    latitude: 52.3667,
    longitude: 13.5033,
    iata_code: 'BER',
    description_short: 'Main international airport serving Berlin',
  },
  {
    city_name: 'Berlin',
    type: 'LANDMARK',
    name: 'Brandenburg Gate',
    latitude: 52.5163,
    longitude: 13.3777,
    description_short: '18th-century neoclassical monument and iconic Berlin landmark',
  },
  {
    city_name: 'Berlin',
    type: 'MUSEUM',
    name: 'Museum Island',
    latitude: 52.5211,
    longitude: 13.3994,
    description_short: 'UNESCO World Heritage site with five world-renowned museums',
  },
  {
    city_name: 'Berlin',
    type: 'MONUMENT',
    name: 'Reichstag Building',
    latitude: 52.5186,
    longitude: 13.3761,
    description_short: 'Historic parliament building with glass dome',
  },
  {
    city_name: 'Berlin',
    type: 'TRAIN_STATION',
    name: 'Berlin Hauptbahnhof',
    latitude: 52.5250,
    longitude: 13.3694,
    description_short: 'Main railway station of Berlin',
  },
];

export const municPOIs = [
  {
    city_name: 'Munich',
    type: 'AIRPORT',
    name: 'Munich Airport',
    latitude: 48.3538,
    longitude: 11.7750,
    iata_code: 'MUC',
    description_short: 'Major international airport serving Munich and Bavaria',
  },
  {
    city_name: 'Munich',
    type: 'LANDMARK',
    name: 'Marienplatz',
    latitude: 48.1374,
    longitude: 11.5755,
    description_short: 'Central square with New Town Hall and Glockenspiel',
  },
  {
    city_name: 'Munich',
    type: 'PARK',
    name: 'English Garden',
    latitude: 48.1642,
    longitude: 11.6056,
    description_short: 'Large public park with beer gardens and surfing wave',
  },
];

export const parisPOIs = [
  {
    city_name: 'Paris',
    type: 'AIRPORT',
    name: 'Charles de Gaulle Airport',
    latitude: 49.0097,
    longitude: 2.5479,
    iata_code: 'CDG',
    description_short: 'Largest international airport in France',
  },
  {
    city_name: 'Paris',
    type: 'LANDMARK',
    name: 'Eiffel Tower',
    latitude: 48.8584,
    longitude: 2.2945,
    description_short: 'Iconic iron lattice tower and symbol of Paris',
  },
  {
    city_name: 'Paris',
    type: 'MUSEUM',
    name: 'Louvre Museum',
    latitude: 48.8606,
    longitude: 2.3376,
    description_short: 'World\'s largest art museum and historic monument',
  },
  {
    city_name: 'Paris',
    type: 'CHURCH',
    name: 'Notre-Dame Cathedral',
    latitude: 48.8530,
    longitude: 2.3499,
    description_short: 'Medieval Catholic cathedral and Gothic architecture masterpiece',
  },
];

export const dubaiPOIs = [
  {
    city_name: 'Dubai',
    type: 'AIRPORT',
    name: 'Dubai International Airport',
    latitude: 25.2532,
    longitude: 55.3657,
    iata_code: 'DXB',
    description_short: 'Busiest international airport in the world by passenger traffic',
  },
  {
    city_name: 'Dubai',
    type: 'LANDMARK',
    name: 'Burj Khalifa',
    latitude: 25.1972,
    longitude: 55.2744,
    description_short: 'Tallest building in the world at 828 meters',
  },
  {
    city_name: 'Dubai',
    type: 'SHOPPING',
    name: 'Dubai Mall',
    latitude: 25.1972,
    longitude: 55.2796,
    description_short: 'One of the world\'s largest shopping malls',
  },
  {
    city_name: 'Dubai',
    type: 'BEACH',
    name: 'Jumeirah Beach',
    latitude: 25.2048,
    longitude: 55.2708,
    description_short: 'Popular white sand beach with view of Burj Al Arab',
  },
];

export const newYorkPOIs = [
  {
    city_name: 'New York',
    type: 'AIRPORT',
    name: 'John F. Kennedy International Airport',
    latitude: 40.6413,
    longitude: -73.7781,
    iata_code: 'JFK',
    description_short: 'Major international airport serving New York City',
  },
  {
    city_name: 'New York',
    type: 'LANDMARK',
    name: 'Statue of Liberty',
    latitude: 40.6892,
    longitude: -74.0445,
    description_short: 'Iconic copper statue and symbol of freedom',
  },
  {
    city_name: 'New York',
    type: 'PARK',
    name: 'Central Park',
    latitude: 40.7829,
    longitude: -73.9654,
    description_short: 'Urban park in Manhattan with 843 acres',
  },
  {
    city_name: 'New York',
    type: 'LANDMARK',
    name: 'Times Square',
    latitude: 40.7580,
    longitude: -73.9855,
    description_short: 'Major commercial intersection and tourist destination',
  },
];

export const istanbulPOIs = [
  {
    city_name: 'Istanbul',
    type: 'AIRPORT',
    name: 'Istanbul Airport',
    latitude: 41.2753,
    longitude: 28.7519,
    iata_code: 'IST',
    description_short: 'Main international airport serving Istanbul',
  },
  {
    city_name: 'Istanbul',
    type: 'MOSQUE',
    name: 'Hagia Sophia',
    latitude: 41.0086,
    longitude: 28.9802,
    description_short: 'Historic mosque and former Byzantine cathedral',
  },
  {
    city_name: 'Istanbul',
    type: 'MOSQUE',
    name: 'Blue Mosque',
    latitude: 41.0054,
    longitude: 28.9768,
    description_short: 'Historic mosque with six minarets and blue tiles',
  },
  {
    city_name: 'Istanbul',
    type: 'MARKET',
    name: 'Grand Bazaar',
    latitude: 41.0108,
    longitude: 28.9680,
    description_short: 'One of the largest and oldest covered markets in the world',
  },
];

export const allPOIs = [
  ...berlinPOIs,
  ...municPOIs,
  ...parisPOIs,
  ...dubaiPOIs,
  ...newYorkPOIs,
  ...istanbulPOIs,
];
