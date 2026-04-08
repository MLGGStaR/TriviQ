import React, { useState, useEffect, useRef } from "react";
import QUESTION_EXPANSIONS from "./triviaExpansions.js";
import QUESTION_MINIMUMS from "./triviaMinimums.js";
import TRIVIA_MEGA_EXPANSIONS from "./triviaMegaExpansions.js";
import TRIVIA_ULTRA_EXPANSIONS from "./triviaUltraExpansions.js";
import TRIVIA_TIER_BALANCE_EXPANSIONS from "./triviaTierBalanceExpansions.js";
import TRIVIA_TIER_PARITY_EXPANSIONS from "./triviaTierParityExpansions.js";
import TRIVIA_TIER_FINAL_PARITY_EXPANSIONS from "./triviaTierFinalParityExpansions.js";
import TRIVIA_TIER_FINAL_TOPOFF_EXPANSIONS from "./triviaTierFinalTopoffExpansions.js";
import MOVIE_SCENE_BANK from "./movieScenes.js";
import SONG_CLIP_BANK from "./songClips.js";
import SONG_CLIP_ADDITIONS from "./songClipAdditions.js";
import EMOJI_GUESS_CATEGORIES from "./emojiGuessCategories.js";
import NEW_CATEGORIES_BANK from "./newCategoriesBank.js";
import { CHARADES_HARD_OVERRIDES, QUESTION_REFINEMENT_ADDITIONS } from "./questionRefinements.js";
import WHOAMI_IMAGE_MANIFEST from "./whoamiImageManifest.js";
import { appendSharedQuestionUsage, getCachedQuestionUsageSnapshot, loadSharedQuestionUsage, mergeQuestionUsageIds } from "./questionUsage.js";
import { getCachedAccountSession, loadAccountSession, loginAccount, logoutAccount, signupAccount } from "./accountAuth.js";

const FLAG_TIERS = {
  200: [
    ["US", "United States"],
    ["CA", "Canada"],
    ["MX", "Mexico"],
    ["BR", "Brazil"],
    ["AR", "Argentina"],
    ["CL", "Chile"],
    ["CO", "Colombia"],
    ["PE", "Peru"],
    ["VE", "Venezuela"],
    ["CU", "Cuba"],
    ["DO", "Dominican Republic"],
    ["GT", "Guatemala"],
    ["GB", "United Kingdom"],
    ["IE", "Ireland"],
    ["FR", "France"],
    ["DE", "Germany"],
    ["IT", "Italy"],
    ["ES", "Spain"],
    ["PT", "Portugal"],
    ["NL", "Netherlands"],
    ["BE", "Belgium"],
    ["CH", "Switzerland"],
    ["AT", "Austria"],
    ["SE", "Sweden"],
    ["NO", "Norway"],
    ["DK", "Denmark"],
    ["FI", "Finland"],
    ["PL", "Poland"],
    ["CZ", "Czechia"],
    ["GR", "Greece"],
    ["UA", "Ukraine"],
    ["RU", "Russia"],
    ["HU", "Hungary"],
    ["RO", "Romania"],
    ["TR", "Türkiye"],
    ["SA", "Saudi Arabia"],
    ["AE", "United Arab Emirates"],
    ["QA", "Qatar"],
    ["IL", "Israel"],
    ["EG", "Egypt"],
    ["MA", "Morocco"],
    ["DZ", "Algeria"],
    ["ZA", "South Africa"],
    ["NG", "Nigeria"],
    ["KE", "Kenya"],
    ["ET", "Ethiopia"],
    ["GH", "Ghana"],
    ["TN", "Tunisia"],
    ["JP", "Japan"],
    ["CN", "China"],
    ["IN", "India"],
    ["PK", "Pakistan"],
    ["BD", "Bangladesh"],
    ["ID", "Indonesia"],
    ["MY", "Malaysia"],
    ["SG", "Singapore"],
    ["TH", "Thailand"],
    ["VN", "Vietnam"],
    ["PH", "Philippines"],
    ["KR", "South Korea"],
    ["KP", "North Korea"],
    ["IR", "Iran"],
    ["IQ", "Iraq"],
    ["AU", "Australia"],
    ["NZ", "New Zealand"],
  ],
  400: [
    ["AF", "Afghanistan"],
    ["AL", "Albania"],
    ["AD", "Andorra"],
    ["AM", "Armenia"],
    ["AZ", "Azerbaijan"],
    ["BS", "Bahamas"],
    ["BH", "Bahrain"],
    ["BY", "Belarus"],
    ["BZ", "Belize"],
    ["BO", "Bolivia"],
    ["BA", "Bosnia and Herzegovina"],
    ["BG", "Bulgaria"],
    ["KH", "Cambodia"],
    ["CM", "Cameroon"],
    ["CR", "Costa Rica"],
    ["HR", "Croatia"],
    ["CY", "Cyprus"],
    ["EC", "Ecuador"],
    ["SV", "El Salvador"],
    ["EE", "Estonia"],
    ["GE", "Georgia"],
    ["HT", "Haiti"],
    ["HN", "Honduras"],
    ["IS", "Iceland"],
    ["JM", "Jamaica"],
    ["JO", "Jordan"],
    ["KZ", "Kazakhstan"],
    ["KW", "Kuwait"],
    ["KG", "Kyrgyzstan"],
    ["LB", "Lebanon"],
    ["LY", "Libya"],
    ["LT", "Lithuania"],
    ["MG", "Madagascar"],
    ["MV", "Maldives"],
    ["MT", "Malta"],
    ["MD", "Moldova"],
    ["MN", "Mongolia"],
    ["MM", "Myanmar"],
    ["NP", "Nepal"],
    ["NI", "Nicaragua"],
    ["OM", "Oman"],
    ["PA", "Panama"],
    ["PY", "Paraguay"],
    ["RW", "Rwanda"],
    ["RS", "Serbia"],
    ["SK", "Slovakia"],
    ["SI", "Slovenia"],
    ["LK", "Sri Lanka"],
    ["SD", "Sudan"],
    ["SN", "Senegal"],
    ["TZ", "Tanzania"],
    ["UG", "Uganda"],
    ["UY", "Uruguay"],
    ["UZ", "Uzbekistan"],
    ["ZM", "Zambia"],
    ["ZW", "Zimbabwe"],
    ["CI", "Ivory Coast"],
    ["CD", "DR Congo"],
    ["BW", "Botswana"],
    ["NA", "Namibia"],
    ["MU", "Mauritius"],
    ["ME", "Montenegro"],
    ["MK", "North Macedonia"],
    ["BN", "Brunei"],
    ["LA", "Laos"],
  ],
  600: [
    ["AG", "Antigua and Barbuda"],
    ["AO", "Angola"],
    ["BB", "Barbados"],
    ["BF", "Burkina Faso"],
    ["BI", "Burundi"],
    ["BJ", "Benin"],
    ["BT", "Bhutan"],
    ["CF", "Central African Republic"],
    ["CG", "Republic of the Congo"],
    ["CV", "Cape Verde"],
    ["DJ", "Djibouti"],
    ["DM", "Dominica"],
    ["ER", "Eritrea"],
    ["FJ", "Fiji"],
    ["FM", "Micronesia"],
    ["GA", "Gabon"],
    ["GD", "Grenada"],
    ["GM", "Gambia"],
    ["GN", "Guinea"],
    ["GQ", "Equatorial Guinea"],
    ["GW", "Guinea-Bissau"],
    ["GY", "Guyana"],
    ["KI", "Kiribati"],
    ["KM", "Comoros"],
    ["KN", "Saint Kitts and Nevis"],
    ["LC", "Saint Lucia"],
    ["LI", "Liechtenstein"],
    ["LR", "Liberia"],
    ["LS", "Lesotho"],
    ["LU", "Luxembourg"],
    ["LV", "Latvia"],
    ["MC", "Monaco"],
    ["MH", "Marshall Islands"],
    ["ML", "Mali"],
    ["MR", "Mauritania"],
    ["MW", "Malawi"],
    ["MZ", "Mozambique"],
    ["NE", "Niger"],
    ["NR", "Nauru"],
    ["PG", "Papua New Guinea"],
    ["PS", "Palestine"],
    ["PW", "Palau"],
    ["SB", "Solomon Islands"],
    ["SC", "Seychelles"],
    ["SL", "Sierra Leone"],
    ["SM", "San Marino"],
    ["SO", "Somalia"],
    ["SR", "Suriname"],
    ["SS", "South Sudan"],
    ["ST", "São Tomé and Príncipe"],
    ["SY", "Syria"],
    ["SZ", "Eswatini"],
    ["TD", "Chad"],
    ["TG", "Togo"],
    ["TJ", "Tajikistan"],
    ["TL", "Timor-Leste"],
    ["TM", "Turkmenistan"],
    ["TO", "Tonga"],
    ["TT", "Trinidad and Tobago"],
    ["TV", "Tuvalu"],
    ["VA", "Vatican City"],
    ["VC", "Saint Vincent and the Grenadines"],
    ["VU", "Vanuatu"],
    ["WS", "Samoa"],
    ["YE", "Yemen"],
  ],
};

function codeToFlagEmoji(code){
  return code
    .toUpperCase()
    .split("")
    .map(char=>String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("");
}

function buildFlagQuestions(entries){
  return entries.map(([code,name])=>({
    q: codeToFlagEmoji(code),
    a: name,
    code: code.toLowerCase(),
  }));
}

const FLAG_CODES = Object.values(FLAG_TIERS).flat().map(([code])=>code);
if(new Set(FLAG_CODES).size !== FLAG_CODES.length){
  throw new Error("Duplicate flag codes detected in FLAG_TIERS");
}

const FLAG_BANK = Object.fromEntries(
  Object.entries(FLAG_TIERS).map(([pts,entries])=>[pts, buildFlagQuestions(entries)])
);

const COUNTRY_MAP_TIERS = {
  200: [
    ["US", "United States"],
    ["CA", "Canada"],
    ["MX", "Mexico"],
    ["BR", "Brazil"],
    ["AR", "Argentina"],
    ["CL", "Chile"],
    ["GB", "United Kingdom"],
    ["IE", "Ireland"],
    ["FR", "France"],
    ["DE", "Germany"],
    ["IT", "Italy"],
    ["ES", "Spain"],
    ["PT", "Portugal"],
    ["NO", "Norway"],
    ["SE", "Sweden"],
    ["TR", "Turkey"],
    ["EG", "Egypt"],
    ["SA", "Saudi Arabia"],
    ["ZA", "South Africa"],
    ["NG", "Nigeria"],
    ["IN", "India"],
    ["CN", "China"],
    ["JP", "Japan"],
    ["KR", "South Korea"],
    ["ID", "Indonesia"],
    ["TH", "Thailand"],
    ["VN", "Vietnam"],
    ["AU", "Australia"],
    ["NZ", "New Zealand"],
    ["MG", "Madagascar"],
  ],
  400: [
    ["CO", "Colombia"],
    ["PE", "Peru"],
    ["VE", "Venezuela"],
    ["CU", "Cuba"],
    ["PL", "Poland"],
    ["UA", "Ukraine"],
    ["FI", "Finland"],
    ["RO", "Romania"],
    ["HU", "Hungary"],
    ["GR", "Greece"],
    ["KZ", "Kazakhstan"],
    ["MN", "Mongolia"],
    ["IR", "Iran"],
    ["IQ", "Iraq"],
    ["PK", "Pakistan"],
    ["BD", "Bangladesh"],
    ["PH", "Philippines"],
    ["MY", "Malaysia"],
    ["AE", "United Arab Emirates"],
    ["OM", "Oman"],
    ["MA", "Morocco"],
    ["DZ", "Algeria"],
    ["KE", "Kenya"],
    ["ET", "Ethiopia"],
    ["TZ", "Tanzania"],
    ["SD", "Sudan"],
    ["EC", "Ecuador"],
    ["PY", "Paraguay"],
    ["UY", "Uruguay"],
    ["NP", "Nepal"],
  ],
  600: [
    ["AL", "Albania"],
    ["AM", "Armenia"],
    ["AZ", "Azerbaijan"],
    ["BT", "Bhutan"],
    ["LA", "Laos"],
    ["KG", "Kyrgyzstan"],
    ["TJ", "Tajikistan"],
    ["UZ", "Uzbekistan"],
    ["TM", "Turkmenistan"],
    ["GE", "Georgia"],
    ["SK", "Slovakia"],
    ["SI", "Slovenia"],
    ["MD", "Moldova"],
    ["LV", "Latvia"],
    ["LT", "Lithuania"],
    ["LU", "Luxembourg"],
    ["QA", "Qatar"],
    ["KW", "Kuwait"],
    ["BH", "Bahrain"],
    ["BN", "Brunei"],
    ["TL", "Timor-Leste"],
    ["LS", "Lesotho"],
    ["BW", "Botswana"],
    ["NA", "Namibia"],
    ["SR", "Suriname"],
    ["GY", "Guyana"],
    ["BZ", "Belize"],
    ["ME", "Montenegro"],
    ["MK", "North Macedonia"],
    ["RW", "Rwanda"],
  ],
};

function buildCountryMapQuestions(entries){
  return entries.map(([code,name])=>({
    q: "Map",
    a: name,
    code: code.toLowerCase(),
  }));
}

const COUNTRY_MAP_CODES = Object.values(COUNTRY_MAP_TIERS).flat().map(([code])=>code);
if(new Set(COUNTRY_MAP_CODES).size !== COUNTRY_MAP_CODES.length){
  throw new Error("Duplicate country map codes detected in COUNTRY_MAP_TIERS");
}

const COUNTRY_MAP_BANK = Object.fromEntries(
  Object.entries(COUNTRY_MAP_TIERS).map(([pts,entries])=>[pts, buildCountryMapQuestions(entries)])
);

const RAW_BANK = {
  ...EMOJI_GUESS_CATEGORIES,
  ...NEW_CATEGORIES_BANK,
  general:{ label:"General Knowledge",icon:"\u{1F9E0}",color:"#F59E0B",
    200:[
      {q:"What is the capital of France?",a:"Paris"},
      {q:"How many days in a leap year?",a:"366"},
      {q:"Largest ocean on Earth?",a:"Pacific Ocean"},
      {q:"How many sides does a hexagon have?",a:"6"},
      {q:"Chemical symbol for water?",a:"H₂O"},
      {q:"What color do blue and yellow make?",a:"Green"},
      {q:"How many continents are there?",a:"7"},
      {q:"Boiling point of water in Celsius?",a:"100°C"},
      {q:"Capital of the United Kingdom?",a:"London"},
      {q:"How many hours in a week?",a:"168"},
      {q:"Largest planet in our solar system?",a:"Jupiter"},
      {q:"National language of Brazil?",a:"Portuguese"},
      {q:"How many strings does a standard guitar have?",a:"6"},
      {q:"Collective noun for a group of lions?",a:"A pride"},
      {q:"Capital of China?",a:"Beijing"},
      {q:"Largest mammal on Earth?",a:"Blue whale"},
      {q:"Players in a rugby union team?",a:"15"},
      {q:"Year the Eiffel Tower was completed?",a:"1889"},
      {q:"Smallest ocean?",a:"Arctic Ocean"},
      {q:"Chemical symbol for iron?",a:"Fe"},
      {q:"Capital of Argentina?",a:"Buenos Aires"},
      {q:"How many minutes in a day?",a:"1,440"},
      {q:"Closest planet to the Sun?",a:"Mercury"},
      {q:"Most widely eaten grain in the world?",a:"Rice"},
      {q:"How many zeros in one million?",a:"6"},
      {q:"Normal human body temperature?",a:"37°C / 98.6°F"},
      {q:"Capital of Germany?",a:"Berlin"},
      {q:"National animal of Australia?",a:"Kangaroo (and emu)"},
      {q:"How many days in February (non-leap year)?",a:"28"},
      {q:"Tallest animal in the world?",a:"Giraffe"},
      {q:"Color of an emerald?",a:"Green"},
      {q:"How many sides does an octagon have?",a:"8"},
      {q:"Currency of the UK?",a:"Pound sterling (£)"},
      {q:"Capital of Japan?",a:"Tokyo"},
      {q:"How many weeks in a year?",a:"52"},
    ],
    400:[
      {q:"World's most widely spoken language by total speakers?",a:"English"},
      {q:"Hardest natural substance on Earth?",a:"Diamond"},
      {q:"Planet closest in size to Earth?",a:"Venus"},
      {q:"How many bones in the adult human body?",a:"206"},
      {q:"Smallest country in the world by area?",a:"Vatican City"},
      {q:"Square root of 144?",a:"12"},
      {q:"Year the Berlin Wall fell?",a:"1989"},
      {q:"What organ produces insulin?",a:"Pancreas"},
      {q:"Adult human teeth count including wisdom teeth?",a:"32"},
      {q:"Currency of Japan?",a:"Yen"},
      {q:"Longest bone in the human body?",a:"Femur (thigh bone)"},
      {q:"How many time zones on Earth?",a:"24"},
      {q:"Main ingredient in glass?",a:"Sand (silicon dioxide)"},
      {q:"Approximate world population?",a:"About 8 billion"},
      {q:"What is the Pythagorean theorem?",a:"a² + b² = c² — the square of the hypotenuse equals the sum of squares of the other two sides"},
      {q:"How many moons does Mars have?",a:"Two — Phobos and Deimos"},
      {q:"What is a prime number?",a:"A number greater than 1 with no divisors other than 1 and itself"},
      {q:"Approximate distance from Earth to the Sun?",a:"~150 million km (1 Astronomical Unit)"},
      {q:"Study of fungi?",a:"Mycology"},
      {q:"Speed of sound in air at sea level?",a:"~343 m/s"},
      {q:"What is a palindrome?",a:"A word or phrase that reads the same forwards and backwards"},
      {q:"Roman numeral for 1000?",a:"M"},
      {q:"How many chambers does a human heart have?",a:"4"},
      {q:"Powerhouse of the cell?",a:"Mitochondria"},
      {q:"Scientific name for the North Star?",a:"Polaris"},
      {q:"Difference between an atom and a molecule?",a:"An atom is the smallest unit of an element; a molecule is two or more atoms bonded together"},
      {q:"What is the Coriolis effect?",a:"The deflection of objects by Earth's rotation — affects weather patterns"},
      {q:"What does GDP stand for?",a:"Gross Domestic Product — total value of goods and services produced"},
      {q:"What is osmosis?",a:"Movement of water through a semi-permeable membrane from low to high solute concentration"},
      {q:"What is a catalyst?",a:"A substance that speeds up a chemical reaction without being consumed itself"},
    ],
    600:[
      {q:"Half-life of Carbon-14?",a:"~5,730 years"},
      {q:"Element with the highest melting point?",a:"Tungsten (3,422°C)"},
      {q:"Closest star to our solar system?",a:"Proxima Centauri"},
      {q:"Speed of light in km/s?",a:"299,792 km/s"},
      {q:"First 7 numbers of the Fibonacci sequence?",a:"0, 1, 1, 2, 3, 5, 8"},
      {q:"Chemical symbol for potassium?",a:"K (from Latin Kalium)"},
      {q:"What is the Mpemba effect?",a:"The observation that hot water can under some conditions freeze faster than cold water"},
      {q:"Boundary layer between Earth's crust and mantle?",a:"The MohoroviÄiÄ‡ discontinuity (the Moho)"},
      {q:"Approximate age of the universe?",a:"~13.8 billion years"},
      {q:"What is the P vs NP problem?",a:"Unsolved CS problem — whether every problem whose solution can be quickly verified can also be quickly solved"},
      {q:"What is the Riemann hypothesis?",a:"Unsolved conjecture about the distribution of prime numbers and zeros of the Riemann zeta function"},
      {q:"What is Bell's theorem?",a:"Proves no local hidden variable theory can reproduce all predictions of quantum mechanics"},
      {q:"What is Gödel's incompleteness theorem?",a:"Any consistent formal system powerful enough for arithmetic cannot prove all truths about itself"},
      {q:"What is the Drake equation?",a:"A probabilistic argument estimating the number of active extraterrestrial civilizations in the Milky Way"},
      {q:"What is the Schwarzschild radius?",a:"The radius at which an object becomes a black hole — the size of the event horizon"},
      {q:"What is Euler's identity and why is it remarkable?",a:"e^(iπ) + 1 = 0 — connects five fundamental mathematical constants in one equation"},
      {q:"What is the Standard Model in physics?",a:"Theory describing fundamental particles and forces (except gravity) that make up the universe"},
      {q:"What is the Higgs boson?",a:"The particle that gives other particles mass — confirmed in 2012 at CERN's Large Hadron Collider"},
      {q:"What is dark energy?",a:"A mysterious force (~68% of universe) driving its accelerating expansion"},
      {q:"What does the Heisenberg Uncertainty Principle state?",a:"You cannot simultaneously know the exact position and momentum of a particle"},
      {q:"What is quantum tunnelling?",a:"Particles passing through energy barriers that classical physics says they cannot cross"},
      {q:"What is entropy in thermodynamics?",a:"A measure of disorder in a system — always increases in a closed system (Second Law)"},
      {q:"What is the Chandrasekhar limit?",a:"~1.4 solar masses — the maximum mass of a stable white dwarf star"},
      {q:"What is Schrödinger's Cat thought experiment?",a:"Illustrates quantum superposition — a cat is simultaneously alive and dead until observed"},
    ],
  },
  geography:{ label:"Geography",icon:"\u{1F30D}",color:"#10B981",
    200:[
      {q:"Capital of Japan?",a:"Tokyo"},
      {q:"Longest river in the world?",a:"The Nile"},
      {q:"Which continent is Egypt on?",a:"Africa"},
      {q:"Smallest continent?",a:"Australia"},
      {q:"Ocean between the USA and Europe?",a:"Atlantic Ocean"},
      {q:"Capital of Australia?",a:"Canberra"},
      {q:"Country with the largest population?",a:"India"},
      {q:"Tallest mountain in the world?",a:"Mount Everest"},
      {q:"Capital of Italy?",a:"Rome"},
      {q:"Capital of Germany?",a:"Berlin"},
      {q:"Land of the Rising Sun?",a:"Japan"},
      {q:"Capital of Spain?",a:"Madrid"},
      {q:"Largest continent by area?",a:"Asia"},
      {q:"Body of water separating Europe from Africa?",a:"Mediterranean Sea"},
      {q:"Capital of Russia?",a:"Moscow"},
      {q:"Capital of the USA?",a:"Washington D.C."},
      {q:"Largest country in South America?",a:"Brazil"},
      {q:"Capital of Mexico?",a:"Mexico City"},
      {q:"Country with the longest coastline?",a:"Canada"},
      {q:"Capital of India?",a:"New Delhi"},
      {q:"Which continent has the most countries?",a:"Africa (54 countries)"},
      {q:"Capital of Egypt?",a:"Cairo"},
      {q:"Mountain range in Switzerland?",a:"The Alps"},
      {q:"Capital of South Korea?",a:"Seoul"},
      {q:"Largest city in the world by population?",a:"Tokyo"},
      {q:"Which country does the Amazon mostly flow through?",a:"Brazil"},
      {q:"Capital of Turkey?",a:"Ankara"},
      {q:"Body of water between Russia and Alaska?",a:"Bering Strait"},
      {q:"Capital of South Africa?",a:"Pretoria (executive), Cape Town (legislative), Bloemfontein (judicial)"},
      {q:"Capital of Canada?",a:"Ottawa"},
      {q:"Which country is Iceland closest to geographically?",a:"Greenland"},
      {q:"Capital of Saudi Arabia?",a:"Riyadh"},
    ],
    400:[
      {q:"Capital of Brazil?",a:"Brasília"},
      {q:"Largest country in the world by area?",a:"Russia"},
      {q:"Mountain range separating Europe and Asia?",a:"Ural Mountains"},
      {q:"Most populated country in Africa?",a:"Nigeria"},
      {q:"How many countries share a border with China?",a:"14"},
      {q:"Largest desert in the world?",a:"Antarctica (Sahara is largest hot desert)"},
      {q:"Saltiest body of water on Earth?",a:"Dead Sea"},
      {q:"Which river flows through Cairo?",a:"The Nile"},
      {q:"Country with the most islands?",a:"Sweden (over 220,000)"},
      {q:"Largest lake in Africa?",a:"Lake Victoria"},
      {q:"Capital of Pakistan?",a:"Islamabad"},
      {q:"Longest river in Europe?",a:"The Volga"},
      {q:"What is the Ring of Fire?",a:"A path around the Pacific Ocean with 75% of the world's volcanoes"},
      {q:"Capital of Ukraine?",a:"Kyiv"},
      {q:"Approximate size of the Sahara Desert in km²?",a:"~9.2 million km²"},
      {q:"Capital of Philippines?",a:"Manila"},
      {q:"Country with the most volcanoes?",a:"Indonesia (over 130 active)"},
      {q:"What connects the Atlantic Ocean to the Mediterranean?",a:"Strait of Gibraltar"},
      {q:"Which country is home to Machu Picchu?",a:"Peru"},
      {q:"Capital of Ethiopia?",a:"Addis Ababa"},
      {q:"What is the Fertile Crescent?",a:"A region of the Middle East often called the cradle of civilization"},
      {q:"Country with highest altitude capital?",a:"Bolivia — La Paz at ~3,640m"},
      {q:"What makes the Atacama Desert unique?",a:"It's the driest non-polar desert on Earth — some areas have never recorded rain"},
      {q:"Capital of Kazakhstan?",a:"Astana"},
      {q:"What is the Strait of Hormuz?",a:"Connects the Persian Gulf to the Gulf of Oman — critical oil shipping lane"},
      {q:"Deepest lake in the world?",a:"Lake Baikal (Russia) — 1,642 metres deep"},
      {q:"Longest land border between two countries?",a:"USA and Canada (~8,891 km)"},
      {q:"What is the Mariana Trench?",a:"The deepest part of the world's oceans — about 11,000 metres in the Pacific"},
      {q:"Country entirely surrounded by South Africa?",a:"Lesotho"},
      {q:"Capital of Myanmar?",a:"Naypyidaw"},
    ],
    600:[
      {q:"The five Central Asian Stan countries?",a:"Kazakhstan, Uzbekistan, Kyrgyzstan, Tajikistan, Turkmenistan"},
      {q:"Capital of Bhutan?",a:"Thimphu"},
      {q:"What is the Sundarbans?",a:"World's largest mangrove forest in Bangladesh/India — home to Bengal tigers"},
      {q:"What is the Great Rift Valley?",a:"A ~6,000 km geological fault system through East Africa — home to many lakes and early human fossils"},
      {q:"What is the Bosphorus Strait?",a:"Narrow strait in Turkey connecting the Black Sea to the Sea of Marmara — dividing Europe and Asia"},
      {q:"What are the Azores?",a:"A Portuguese archipelago of nine volcanic islands in the mid-Atlantic Ocean"},
      {q:"Approximate population of the UAE?",a:"About 9-10 million (of which ~90% are expatriates)"},
      {q:"Country with the most UNESCO World Heritage Sites?",a:"Italy (58 sites)"},
      {q:"Country with the most natural lakes?",a:"Canada (over 2 million lakes)"},
      {q:"What is the Maghreb region?",a:"Northwest Africa — Morocco, Algeria, Tunisia, Libya and Mauritania"},
      {q:"Capital of Mozambique?",a:"Maputo"},
      {q:"What is a fjord?",a:"A long, narrow sea inlet between tall cliffs — formed by glacial erosion, common in Norway"},
      {q:"Name the Scandinavian countries.",a:"Norway, Sweden, and Denmark"},
      {q:"What is the Serengeti?",a:"A vast ecosystem in Tanzania/Kenya famous for the Great Migration of wildebeest"},
      {q:"Which country has the most freshwater?",a:"Brazil — home to the Amazon basin holding ~20% of Earth's surface freshwater"},
      {q:"What is the Maldives known for geographically?",a:"The world's lowest-lying country — average elevation of 1.5 metres above sea level"},
      {q:"What is the Empty Quarter (Rub' al Khali)?",a:"The world's largest continuous sand desert — spanning Saudi Arabia, Oman, UAE, and Yemen"},
      {q:"What is the significance of the Suez Canal?",a:"An artificial waterway in Egypt connecting the Mediterranean to the Red Sea — opened in 1869"},
      {q:"Capital of Eritrea?",a:"Asmara"},
      {q:"What are the Galapagos Islands known for?",a:"The unique wildlife that inspired Darwin's theory of evolution — part of Ecuador"},
      {q:"What is the Nile's total length?",a:"~6,650 km — flowing through 11 countries"},
      {q:"What is the Strait of Malacca?",a:"A narrow waterway between Malaysia and Indonesia — one of the world's most important shipping lanes"},
      {q:"Capital of Timor-Leste?",a:"Dili — one of Asia's youngest countries, independent since 2002"},
    ],
  },
  science:{ label:"Science",icon:"\u{1F52C}",color:"#3B82F6",
    200:[
      {q:"What planet is known as the Red Planet?",a:"Mars"},
      {q:"Gas plants absorb during photosynthesis?",a:"Carbon dioxide (CO₂)"},
      {q:"How many chambers does the human heart have?",a:"4"},
      {q:"Powerhouse of the cell?",a:"Mitochondria"},
      {q:"Largest planet in our solar system?",a:"Jupiter"},
      {q:"Force that keeps us on the ground?",a:"Gravity"},
      {q:"How many chromosomes do humans normally have?",a:"46"},
      {q:"What does DNA stand for?",a:"Deoxyribonucleic Acid"},
      {q:"Chemical symbol for gold?",a:"Au"},
      {q:"What organ filters blood?",a:"Kidneys"},
      {q:"Boiling point of water in Fahrenheit?",a:"212°F"},
      {q:"Study of living organisms?",a:"Biology"},
      {q:"Chemical symbol for oxygen?",a:"O"},
      {q:"Hardest natural substance?",a:"Diamond"},
      {q:"How many bones in the human hand?",a:"27"},
      {q:"Largest organ in the human body?",a:"Skin"},
      {q:"What causes thunder?",a:"Rapid expansion of air heated by lightning"},
      {q:"Chemical formula for table salt?",a:"NaCl (sodium chloride)"},
      {q:"Gas making up most of the air we breathe?",a:"Nitrogen (78%)"},
      {q:"Unit of measuring electrical current?",a:"Ampere (amp)"},
      {q:"Center of an atom?",a:"The nucleus"},
      {q:"What is a herbivore?",a:"An animal that only eats plants"},
      {q:"Chemical symbol for carbon?",a:"C"},
      {q:"Water turning into steam?",a:"Evaporation (or vaporisation)"},
      {q:"What is photosynthesis?",a:"Process by which plants convert sunlight, CO₂ and water into glucose and oxygen"},
      {q:"How many planets in our solar system?",a:"8"},
      {q:"What is a black hole?",a:"A region of spacetime with gravity so strong nothing — not even light — can escape"},
      {q:"What is the function of red blood cells?",a:"Carrying oxygen from the lungs to the rest of the body"},
      {q:"What are the three states of matter?",a:"Solid, liquid, and gas (plasma is the fourth)"},
      {q:"What is a neutron?",a:"A subatomic particle in the nucleus with no electric charge"},
    ],
    400:[
      {q:"Atomic number of carbon?",a:"6"},
      {q:"Planet with the most moons?",a:"Saturn (146 confirmed)"},
      {q:"What type of wave is light?",a:"Electromagnetic wave"},
      {q:"Most common blood type?",a:"O positive (O+)"},
      {q:"Unit of electric resistance?",a:"Ohm (Î©)"},
      {q:"Who developed general relativity?",a:"Albert Einstein"},
      {q:"Chemical symbol for sodium?",a:"Na (from Latin Natrium)"},
      {q:"Newton's Third Law?",a:"For every action there is an equal and opposite reaction"},
      {q:"pH of pure water?",a:"7 (neutral)"},
      {q:"Absolute zero in Celsius?",a:"−273.15°C"},
      {q:"Atmosphere layer closest to Earth?",a:"Troposphere"},
      {q:"What does E=mc² mean?",a:"Energy equals mass times the speed of light squared — mass and energy are equivalent"},
      {q:"What is the Doppler Effect?",a:"Change in frequency of a wave for an observer moving relative to its source"},
      {q:"Function of the liver?",a:"Filtering toxins, producing bile, metabolizing nutrients — over 500 functions"},
      {q:"Difference between virus and bacterium?",a:"Bacteria are living organisms; viruses are not — they need a host cell to replicate"},
      {q:"What is CRISPR-Cas9?",a:"Gene-editing technology that can precisely cut and modify DNA sequences"},
      {q:"Function of white blood cells?",a:"Fight infection and disease as part of the immune system"},
      {q:"What is nuclear fission?",a:"Splitting of a heavy atomic nucleus into smaller ones, releasing enormous energy"},
      {q:"What is the Goldilocks Zone?",a:"The habitable zone around a star where liquid water can exist on a planet's surface"},
      {q:"What is the carbon cycle?",a:"Process by which carbon moves through Earth's systems — atmosphere, oceans, land, and organisms"},
      {q:"What is the electromagnetic spectrum?",a:"The range of all electromagnetic radiation — from radio waves to gamma rays including visible light"},
      {q:"What is a supernova?",a:"An enormous stellar explosion when a massive star exhausts its fuel and collapses"},
      {q:"What is the continental drift theory?",a:"Continents were once joined as Pangaea and slowly moved apart over millions of years"},
      {q:"Newton's First Law?",a:"An object at rest stays at rest; an object in motion stays in motion unless acted on by an external force"},
      {q:"What is bioluminescence?",a:"Production and emission of light by a living organism through chemical reactions"},
      {q:"What is epigenetics?",a:"Study of heritable changes in gene expression that don't involve changes to the DNA sequence"},
      {q:"What is the wave-particle duality?",a:"Every particle has wave properties and every wave has particle properties"},
      {q:"What is a neutron star?",a:"An incredibly dense stellar remnant — a teaspoon would weigh billions of tonnes"},
      {q:"What is CERN?",a:"European Organization for Nuclear Research — home of the Large Hadron Collider in Geneva"},
      {q:"What is the immune system's role?",a:"Protect the body against pathogens through a network of cells and proteins"},
    ],
    600:[
      {q:"What does the Heisenberg Uncertainty Principle state?",a:"You cannot simultaneously know the exact position and momentum of a particle"},
      {q:"What is the Chandrasekhar limit?",a:"~1.4 solar masses — the maximum mass of a stable white dwarf"},
      {q:"What is quantum tunnelling?",a:"Particles pass through energy barriers that classical physics says they cannot cross"},
      {q:"What is the Standard Model in physics?",a:"Theory describing fundamental particles and forces except gravity"},
      {q:"What is dark matter?",a:"Undetected matter (~27% of universe) that doesn't interact with light"},
      {q:"What is Schrödinger's Cat?",a:"A thought experiment showing quantum superposition — a cat is simultaneously alive and dead until observed"},
      {q:"What is the Pauli Exclusion Principle?",a:"No two identical fermions can occupy the same quantum state simultaneously"},
      {q:"What is the theory of punctuated equilibrium?",a:"Evolution occurs in rapid bursts separated by long periods of stability"},
      {q:"What is the cosmological constant?",a:"Einstein's term added to his equations — now linked to dark energy driving expansion"},
      {q:"What is the Hubble constant?",a:"The rate at which the universe is expanding — approximately 70 km/s per megaparsec"},
      {q:"What is nuclear fusion?",a:"Combining light atomic nuclei to release energy — the process powering stars"},
      {q:"What is Maxwell's demon?",a:"Thought experiment proposing a demon could violate thermodynamics by sorting molecules — information theory resolves it"},
      {q:"What is DNA's double helix?",a:"The spiral structure of DNA — discovered by Watson and Crick using Rosalind Franklin's X-ray data in 1953"},
      {q:"What is the significance of the photoelectric effect?",a:"Einstein's explanation that light comes in discrete packets (photons) — laid the foundation for quantum mechanics"},
      {q:"What is the Higgs boson?",a:"The particle that gives other particles mass — confirmed in 2012 at CERN"},
      {q:"What is the measurement problem in QM?",a:"Why quantum measurements produce definite outcomes when QM describes states as superpositions"},
      {q:"What is Bell's theorem?",a:"Proves no local hidden variable theory can reproduce all quantum mechanical predictions"},
      {q:"What is a quasar?",a:"An extremely luminous active galactic nucleus powered by a supermassive black hole"},
      {q:"What is the Stern-Gerlach experiment?",a:"Proved particles have quantized angular momentum (spin) — key proof of quantum mechanics"},
      {q:"What is the Banach-Tarski paradox?",a:"A mathematical theorem that a sphere can be decomposed and reassembled into two identical spheres"},
      {q:"What is entropy and the Second Law of Thermodynamics?",a:"Entropy (disorder) always increases in a closed system — the universe tends toward disorder"},
      {q:"What is the significance of Proxima Centauri b?",a:"A potentially habitable exoplanet orbiting Proxima Centauri — our nearest stellar neighbor"},
    ],
  },
  history:{ label:"History",icon:"\u{1F4DC}",color:"#8B5CF6",
    200:[
      {q:"First President of the United States?",a:"George Washington"},
      {q:"Year World War II ended?",a:"1945"},
      {q:"Which civilization built the pyramids?",a:"Ancient Egyptians"},
      {q:"Which ship sank in 1912?",a:"The Titanic"},
      {q:"Year Columbus first reached the Americas?",a:"1492"},
      {q:"First man to walk on the Moon?",a:"Neil Armstrong"},
      {q:"What empire did Genghis Khan rule?",a:"The Mongol Empire"},
      {q:"Year World War I began?",a:"1914"},
      {q:"Country that dropped atomic bombs on Japan?",a:"United States"},
      {q:"Ancient structure across northern China?",a:"Great Wall of China"},
      {q:"Who was Cleopatra?",a:"Last active ruler of the Ptolemaic Kingdom of Egypt"},
      {q:"Year WWI ended?",a:"1918"},
      {q:"Who invented the telephone?",a:"Alexander Graham Bell (1876)"},
      {q:"Year the French Revolution began?",a:"1789"},
      {q:"What was apartheid?",a:"System of institutionalised racial segregation in South Africa (1948–1991)"},
      {q:"First Emperor of China?",a:"Qin Shi Huang"},
      {q:"Year Neil Armstrong landed on the Moon?",a:"1969"},
      {q:"Primary author of the Declaration of Independence?",a:"Thomas Jefferson"},
      {q:"Year the Magna Carta was signed?",a:"1215"},
      {q:"Who was Mahatma Gandhi?",a:"Indian lawyer who led India's nonviolent independence movement against British rule"},
      {q:"Year the Soviet Union collapsed?",a:"1991"},
      {q:"First woman to fly solo across the Atlantic?",a:"Amelia Earhart (1932)"},
      {q:"What was the Cold War?",a:"Geopolitical tension between the USA and Soviet Union from 1947 to 1991"},
      {q:"Who built the Colosseum?",a:"The Roman Empire — under Emperor Vespasian, completed 80 AD"},
      {q:"Year the Berlin Wall fell?",a:"1989"},
      {q:"Who was Napoleon Bonaparte?",a:"French military leader and emperor who dominated Europe in the early 19th century"},
      {q:"What is the Renaissance?",a:"European cultural movement from 14th to 17th century meaning 'rebirth'"},
      {q:"Who was Julius Caesar?",a:"Roman general and statesman assassinated on the Ides of March, 44 BC"},
      {q:"Year the Titanic sank?",a:"1912"},
      {q:"What was the first artificial satellite?",a:"Sputnik 1 (1957, Soviet Union)"},
    ],
    400:[
      {q:"Which country was first to give women the vote?",a:"New Zealand (1893)"},
      {q:"Last Pharaoh of ancient Egypt?",a:"Cleopatra VII"},
      {q:"Year India gained independence?",a:"1947"},
      {q:"Which civilization built Machu Picchu?",a:"The Inca Empire"},
      {q:"Who painted the Sistine Chapel ceiling?",a:"Michelangelo"},
      {q:"What was the Manhattan Project?",a:"US-led WWII research project that produced the first nuclear weapons"},
      {q:"What was the Silk Road?",a:"An ancient network of trade routes connecting China to the Mediterranean"},
      {q:"What was the Black Death?",a:"Devastating plague pandemic (1347–1351) killing ~1/3 of Europe's population"},
      {q:"What was the Boston Tea Party?",a:"1773 political protest — American colonists threw British tea into Boston Harbor"},
      {q:"Who was Nelson Mandela?",a:"South Africa's first Black president — spent 27 years in prison fighting apartheid"},
      {q:"What was the Battle of Thermopylae?",a:"480 BC — 300 Spartans held off a massive Persian army for three days"},
      {q:"What was Operation Overlord?",a:"The codename for the D-Day invasion of Normandy, June 6, 1944"},
      {q:"Who built the Taj Mahal?",a:"Mughal Emperor Shah Jahan — built in memory of his wife Mumtaz Mahal"},
      {q:"What was the Scramble for Africa?",a:"Rapid colonisation of Africa by European powers between 1881 and 1914"},
      {q:"Who wrote The Communist Manifesto?",a:"Karl Marx and Friedrich Engels (1848)"},
      {q:"What was the Meiji Restoration?",a:"Japan's rapid industrialisation and modernisation under Emperor Meiji from 1868"},
      {q:"What was the significance of the Battle of Waterloo?",a:"Napoleon's final defeat in 1815 — ending the Napoleonic Wars and his rule"},
      {q:"Who was Simón Bolívar?",a:"South American leader who led independence movements against Spain in the early 1800s"},
      {q:"What was the Cultural Revolution in China?",a:"Mao Zedong's 1966–1976 campaign to purge capitalist and traditional elements from Chinese society"},
      {q:"Who was Alexander the Great?",a:"Macedonian king who conquered one of the largest empires in history by age 30"},
      {q:"What was the Transatlantic Slave Trade?",a:"Transportation of enslaved Africans to the Americas between the 16th and 19th centuries"},
      {q:"What was the Treaty of Versailles?",a:"1919 peace treaty that ended World War I and imposed harsh penalties on Germany"},
      {q:"Who was Joan of Arc?",a:"French heroine who led forces to victory at Orléans (1429) — burned at the stake"},
      {q:"What was the Rwandan Genocide?",a:"1994 mass slaughter of ~800,000 Tutsi people by Hutu-led government in 100 days"},
      {q:"What was the significance of the Battle of Hastings?",a:"1066 — William the Conqueror defeated King Harold II, beginning Norman rule of England"},
      {q:"Who was Genghis Khan?",a:"Founder of the Mongol Empire — the largest contiguous land empire in history"},
      {q:"What was the Haitian Revolution?",a:"1791–1804 slave rebellion making Haiti the first Black republic and first nation to permanently abolish slavery"},
      {q:"What was the significance of the Gutenberg Bible?",a:"First major book printed with movable type (c.1455) — revolutionised the spread of information in Europe"},
      {q:"Who was Suleiman the Magnificent?",a:"Tenth Ottoman Sultan (1520–1566) who presided over the empire's golden age"},
      {q:"What was the Partition of India?",a:"1947 division of British India into two independent nations — India and Pakistan"},
    ],
    600:[
      {q:"Who was the Byzantine Emperor who codified Roman law?",a:"Emperor Justinian I (Corpus Juris Civilis)"},
      {q:"What was the Shogun in Japanese history?",a:"Military dictator who wielded actual power while the Emperor was a ceremonial figurehead"},
      {q:"Who was Genghis Khan's most famous grandson?",a:"Kublai Khan — who founded the Yuan dynasty in China"},
      {q:"What was the Long March?",a:"Mao Zedong's 1934–1935 strategic retreat of Chinese Communist forces — ~6,000 miles"},
      {q:"Who was Nicolaus Copernicus?",a:"Renaissance astronomer who first proposed the Sun, not Earth, is the centre of the solar system"},
      {q:"What was the Thirty Years War?",a:"A devastating Central European war (1618–1648) starting as religious conflict then political"},
      {q:"What was the Sykes-Picot Agreement?",a:"1916 secret agreement between Britain and France dividing the Middle East — its borders still cause conflict"},
      {q:"What was the significance of the Rosetta Stone?",a:"A 196 BC decree in three scripts — it allowed scholars to decode Egyptian hieroglyphics"},
      {q:"What was the Spanish Inquisition?",a:"Tribunal established in 1478 to maintain Catholic orthodoxy — known for torture and persecution"},
      {q:"What was the Opium War?",a:"Two wars (1839–1842, 1856–1860) where Britain and France forced China to open trade and legalise opium"},
      {q:"Who was Ivan the Terrible?",a:"Russia's first Tsar (1547–1584) — modernised Russia but killed his own son in rage"},
      {q:"What was the significance of the Council of Nicaea?",a:"325 AD — first ecumenical Christian council, established the Nicene Creed and standardised doctrine"},
      {q:"What was the Taiping Rebellion?",a:"Massive civil war in China (1850–1864) — 20–30 million deaths, one of history's deadliest conflicts"},
      {q:"What was the significance of the Black Death's long-term impact?",a:"Killed 30–60% of Europe — led to labour shortages, peasant uprisings, decline of feudalism, eventually the Renaissance"},
      {q:"Who was Simon de Montfort?",a:"Earl of Leicester who created England's first Parliament in 1265 — often called father of Parliament"},
      {q:"What was the significance of the Library of Alexandria?",a:"One of the largest libraries of the ancient world — containing scrolls from across the known world"},
      {q:"What was the significance of the 1905 Russian Revolution?",a:"A wave of mass unrest and strikes that forced Tsar Nicholas II to create a constitution and parliament"},
      {q:"What was the Korean War?",a:"A 1950–1953 conflict where North Korea (Chinese-backed) fought South Korea (UN/US-backed) — ended in armistice"},
      {q:"What was Operation Barbarossa?",a:"Nazi Germany's massive invasion of the Soviet Union in June 1941 — the largest military operation in history"},
      {q:"What is the significance of 1453 in history?",a:"The fall of Constantinople to the Ottoman Turks — ending the Byzantine Empire and the Middle Ages"},
      {q:"Who was Cleopatra's relationship with Roman leaders?",a:"She had relationships with Julius Caesar and Mark Antony — strategic alliances to protect Egypt"},
      {q:"What was the significance of the Peace of Westphalia (1648)?",a:"It ended the Thirty Years War and established the modern concept of state sovereignty"},
    ],
  },
  sports:{ label:"Sports",icon:"\u26BD",color:"#EF4444",
    200:[
      {q:"Most FIFA World Cups won?",a:"Brazil (5 times)"},
      {q:"Basketball players on court per team?",a:"5"},
      {q:"What is zero called in tennis?",a:"Love"},
      {q:"Length of a marathon?",a:"42.195 km"},
      {q:"Rings on the Olympic flag?",a:"5"},
      {q:"Sport played at Wimbledon?",a:"Tennis"},
      {q:"Points for a try in rugby union?",a:"5"},
      {q:"Maximum score in a bowling game?",a:"300"},
      {q:"Players on a soccer team?",a:"11"},
      {q:"Sport using a shuttlecock?",a:"Badminton"},
      {q:"Events in a decathlon?",a:"10"},
      {q:"What is a hat-trick in football?",a:"Scoring three goals in a single game"},
      {q:"Length of an Olympic swimming pool?",a:"50 metres"},
      {q:"How many holes in a golf round?",a:"18"},
      {q:"Country that invented basketball?",a:"United States (Dr. James Naismith, 1891)"},
      {q:"Points for a field goal in American football?",a:"3"},
      {q:"National sport of Japan?",a:"Sumo wrestling"},
      {q:"Sport of the Tour de France?",a:"Cycling"},
      {q:"Points for a touchdown in American football?",a:"6"},
      {q:"Players on a volleyball team?",a:"6"},
      {q:"What is a birdie in golf?",a:"One stroke under par on a hole"},
      {q:"What is the offside rule in football?",a:"A player nearer to the opponent's goal than both the ball and the second-to-last opponent when the ball is played to them"},
      {q:"Sport played at the Augusta National?",a:"Golf (the Masters Tournament)"},
      {q:"How many periods in an NHL hockey game?",a:"3 periods of 20 minutes"},
      {q:"What does the yellow jersey mean in Tour de France?",a:"The overall race leader wears it"},
      {q:"What is a grand slam in tennis?",a:"Winning all four major tournaments in one year"},
      {q:"Players on an American football team on field?",a:"11"},
      {q:"What does LBW stand for in cricket?",a:"Leg Before Wicket"},
      {q:"What sport uses a puck?",a:"Ice hockey"},
      {q:"What is a penalty shootout?",a:"Teams alternate penalty kicks to decide a tied match"},
    ],
    400:[
      {q:"Most Olympic gold medals won by one person?",a:"Michael Phelps (23 gold medals)"},
      {q:"How many Grand Slams did Roger Federer win?",a:"20"},
      {q:"Golfer with the most majors?",a:"Jack Nicklaus (18 majors)"},
      {q:"All-time top scorer in the UEFA Champions League?",a:"Cristiano Ronaldo (140+ goals)"},
      {q:"Team with the most Premier League titles?",a:"Manchester United (20 titles)"},
      {q:"Djokovic's Grand Slam title count?",a:"24 (the all-time record as of 2024)"},
      {q:"Most Ballon d'Or awards won?",a:"Lionel Messi (8 times)"},
      {q:"What does DRS stand for in F1?",a:"Drag Reduction System — a movable rear wing to help overtaking"},
      {q:"What is the Fosbury Flop?",a:"High jump technique jumping backwards — Dick Fosbury, 1968 Olympics"},
      {q:"Maximum break in snooker?",a:"147"},
      {q:"Rugby World Cup most wins?",a:"South Africa (4 times as of 2023)"},
      {q:"Sumo wrestling's highest rank?",a:"Yokozuna"},
      {q:"What is the Elo rating system?",a:"A method of calculating relative skill levels — originally developed for chess"},
      {q:"Standard height of a basketball hoop?",a:"10 feet (3.05 metres)"},
      {q:"Most F1 World Championships?",a:"Lewis Hamilton and Michael Schumacher — both with 7 titles"},
      {q:"What is a perfect game in baseball?",a:"Pitcher retires all 27 batters without anyone reaching base"},
      {q:"Origin of the term hat-trick?",a:"From cricket — a bowler given a new hat for three wickets in consecutive balls in the 1800s"},
      {q:"Rugby World Cup first winner?",a:"New Zealand (1987)"},
      {q:"How many sets in a standard tennis match for men?",a:"Best of 5 sets"},
      {q:"What is a hat-trick in cricket?",a:"Taking three wickets in consecutive deliveries"},
      {q:"What is the offside rule in ice hockey?",a:"A player cannot enter the attacking zone before the puck does"},
      {q:"What is a green card in football?",a:"Used in some competitions for a temporary 10-minute sin bin suspension — not widely adopted"},
      {q:"What are the four golf major championships?",a:"The Masters, US Open, The Open Championship, and PGA Championship"},
      {q:"Most capped international rugby player?",a:"Richie McCaw (New Zealand, 148 caps) — has since been surpassed"},
      {q:"Distance of a 400m race?",a:"One full lap of a standard athletics track"},
      {q:"What is the polka dot jersey in Tour de France?",a:"Worn by the best climber / King of the Mountains"},
      {q:"What is the slam dunk in basketball?",a:"Jumping and forcing the ball directly through the basket — worth 2 points"},
      {q:"How many points is a converted try worth in rugby union?",a:"7 (5 for the try + 2 for the conversion kick)"},
      {q:"What is a wild card in sports?",a:"A team that qualifies for a tournament without winning their division or group"},
      {q:"What are the Olympic rings' colors?",a:"Blue, yellow, black, green, and red — representing the five inhabited continents"},
    ],
    600:[
      {q:"Diameter of a basketball hoop in inches?",a:"18 inches"},
      {q:"Year women were first allowed in the Olympics?",a:"1900 (Paris Olympics)"},
      {q:"What is the Queensberry Rules?",a:"The code of rules governing modern boxing, established in 1867"},
      {q:"Match play vs stroke play in golf?",a:"Match play: player wins each hole. Stroke play: fewest total strokes wins the tournament"},
      {q:"Who invented the rules of football (soccer)?",a:"The Football Association in England in 1863"},
      {q:"What is the false 9 position in football?",a:"A striker who drops deep to create space — made famous by Messi under Pep Guardiola"},
      {q:"The three-point line in basketball — when introduced?",a:"In the NBA in the 1979–80 season"},
      {q:"What was the Miracle on Ice?",a:"1980 Winter Olympics — US amateur hockey team defeated the heavily favoured Soviet Union"},
      {q:"What is the Moneyball concept?",a:"Using statistical analysis to find undervalued players — popularised by Oakland Athletics GM Billy Beane"},
      {q:"What makes the Monaco Grand Prix unique?",a:"Runs on public streets through Monte Carlo — extremely narrow, low-speed, and very hard to overtake"},
      {q:"What is the significance of the FA Cup?",a:"The world's oldest football competition — founded in 1871, open to any team in England"},
      {q:"What is a VORP in analytics?",a:"Value Over Replacement Player — how much better a player is than a freely available replacement"},
      {q:"What is the maximum number of clubs allowed in a golf bag?",a:"14 clubs"},
      {q:"What is a perfect score in gymnastics?",a:"10.0 — achieved famously by Nadia Comaneci in 1976 Olympics"},
      {q:"How long is extra time in football?",a:"Two 15-minute halves (30 minutes total)"},
      {q:"What is the Duckworth-Lewis-Stern method?",a:"A mathematical formula used to reset targets in rain-interrupted cricket matches"},
      {q:"Who holds the 100m world record and what is it?",a:"Usain Bolt — 9.58 seconds (2009 World Championships)"},
      {q:"What is the purpose of a pace car in NASCAR?",a:"Controls the speed during caution periods (accidents, debris) — field bunches behind it"},
      {q:"What is the Corinthian spirit?",a:"The amateur ideal of competing for love of the game — named after Corinthian FC"},
      {q:"How many calories does an average marathon runner burn?",a:"~2,500–3,500 calories depending on weight and pace"},
      {q:"What is a technical knockout (TKO) in boxing?",a:"The referee stops the fight due to one fighter being unable to defend themselves — counts as a knockout"},
      {q:"What is the significance of the Ashes in cricket?",a:"A biennial series between England and Australia — the Ashes urn contains (reportedly) the burnt bails from 1882"},
    ],
  },
  music:{ label:"Music",icon:"\u{1F3B5}",color:"#EC4899",
    200:[
      {q:"Band that performed Bohemian Rhapsody?",a:"Queen"},
      {q:"King of Pop?",a:"Michael Jackson"},
      {q:"Best-selling album of all time?",a:"Thriller by Michael Jackson"},
      {q:"Who sang Halo and Single Ladies?",a:"Beyoncé"},
      {q:"Who composed the Four Seasons?",a:"Antonio Vivaldi"},
      {q:"Band behind Hotel California?",a:"Eagles"},
      {q:"Who sang Shape of You?",a:"Ed Sheeran"},
      {q:"Elton John's famous instrument?",a:"Piano"},
      {q:"Which band is Freddie Mercury from?",a:"Queen"},
      {q:"What nationality is Adele?",a:"British (English)"},
      {q:"Who sang Blinding Lights?",a:"The Weeknd"},
      {q:"Taylor Swift's debut album?",a:"Taylor Swift (self-titled, 2006)"},
      {q:"Band behind Smells Like Teen Spirit?",a:"Nirvana"},
      {q:"Queen of Pop?",a:"Madonna"},
      {q:"Who sang Someone Like You?",a:"Adele"},
      {q:"Band behind We Will Rock You?",a:"Queen"},
      {q:"Who sang Hello (2015)?",a:"Adele"},
      {q:"Who sang Uptown Funk?",a:"Bruno Mars (featuring Mark Ronson)"},
      {q:"Instrument with 88 keys?",a:"Piano"},
      {q:"Who sang Bad Guy?",a:"Billie Eilish"},
      {q:"Who sang Stairway to Heaven?",a:"Led Zeppelin"},
      {q:"What does a conductor do?",a:"Leads and coordinates the musicians, interpreting the music"},
      {q:"Who sang Despacito?",a:"Luis Fonsi (featuring Daddy Yankee)"},
      {q:"What is a duet?",a:"A musical performance by two performers"},
      {q:"Who sang Lose Yourself?",a:"Eminem"},
      {q:"Who sang All I Want for Christmas Is You?",a:"Mariah Carey"},
      {q:"What is AC/DC's most famous song?",a:"Back in Black (or Highway to Hell)"},
      {q:"Who sang Thriller?",a:"Michael Jackson"},
      {q:"Country music capital of the world?",a:"Nashville, Tennessee"},
      {q:"What instrument does a violinist play?",a:"The violin"},
    ],
    400:[
      {q:"Band that released Dark Side of the Moon?",a:"Pink Floyd"},
      {q:"Who holds the record for most Grammy wins?",a:"Beyoncé (32 Grammys as of 2024)"},
      {q:"Which Beatle wrote Yesterday?",a:"Paul McCartney"},
      {q:"What does forte mean in music?",a:"Loud (Italian)"},
      {q:"Queen of Soul?",a:"Aretha Franklin"},
      {q:"Yo-Yo Ma's famous instrument?",a:"Cello"},
      {q:"Nationality of Beethoven?",a:"German"},
      {q:"Highest voice type in opera?",a:"Soprano"},
      {q:"What is a metronome?",a:"A device producing a steady beat at a set tempo to help musicians keep time"},
      {q:"Who produced many Michael Jackson albums?",a:"Quincy Jones"},
      {q:"Time signature of a waltz?",a:"3/4 time"},
      {q:"Who wrote the musical Hamilton?",a:"Lin-Manuel Miranda"},
      {q:"What is perfect pitch?",a:"The rare ability to identify or reproduce a musical note without a reference tone"},
      {q:"What is a chord?",a:"Three or more notes played simultaneously"},
      {q:"Father of rock and roll?",a:"Chuck Berry (or Little Richard, debated)"},
      {q:"What is MIDI in music?",a:"Musical Instrument Digital Interface — protocol allowing electronic instruments to communicate"},
      {q:"What is the blues?",a:"American music genre from the Deep South, characterized by blue notes and call-and-response"},
      {q:"What is sampling in music?",a:"Using a portion of a recorded sound as an instrument in a new recording"},
      {q:"Difference between major and minor keys?",a:"Major: generally happy/bright. Minor: generally sad/dark"},
      {q:"What is the bridge in a song?",a:"A contrasting section appearing once — typically between the second chorus and final chorus"},
      {q:"What is a cappella music?",a:"Singing without any instrumental accompaniment"},
      {q:"What is the Cavern Club?",a:"The Liverpool venue where the Beatles first became famous"},
      {q:"Bob Dylan's literary achievement?",a:"He won the 2016 Nobel Prize in Literature for his poetic songwriting"},
      {q:"What is the time signature of most pop songs?",a:"4/4 time (common time)"},
      {q:"What is a key signature in music?",a:"Sharps or flats at the start of a staff indicating the key of the piece"},
      {q:"What is polyphony?",a:"Two or more independent melodic lines played simultaneously"},
      {q:"What is a record label?",a:"A company managing the production, distribution, and promotion of music for artists"},
      {q:"Who is considered the father of classical music?",a:"Johann Sebastian Bach"},
      {q:"What is the highest note a tenor can typically sing?",a:"High C (C5)"},
      {q:"What is a riff in rock music?",a:"A repeated chord progression or refrain used as the basis of a rock piece"},
    ],
    600:[
      {q:"Opera by Puccini where Mimi and Rodolfo fall in love?",a:"La Bohème"},
      {q:"What is a tritone in music theory?",a:"An interval of three whole tones — historically called diabolus in musica"},
      {q:"Who composed The Magic Flute?",a:"Wolfgang Amadeus Mozart"},
      {q:"What does sforzando (sfz) mean?",a:"A sudden, strong accent on a note or chord"},
      {q:"What is the Köchel catalogue?",a:"A chronological catalogue of Mozart's compositions with assigned K. numbers"},
      {q:"Who invented the theremin?",a:"Léon Theremin (1920)"},
      {q:"What is serialism?",a:"A compositional technique using a fixed series of pitches — pioneered by Schoenberg"},
      {q:"What is the Rite of Spring and why was it controversial?",a:"Stravinsky's 1913 ballet — its premiere caused a riot due to dissonant music and primitive themes"},
      {q:"What is musique concrète?",a:"Music made from recorded real-world sounds — pioneered by Pierre Schaeffer in the 1940s"},
      {q:"Who was John Coltrane?",a:"Legendary jazz saxophonist known for A Love Supreme — pushed the boundaries of improvisation"},
      {q:"What is twelve-tone technique?",a:"Schoenberg's method of composing with all 12 chromatic scale notes treated equally"},
      {q:"What is a Castrato?",a:"A male singer castrated before puberty to preserve a high voice — common in Baroque opera"},
      {q:"Difference between a symphony and a concerto?",a:"Symphony: for full orchestra. Concerto: features a solo instrument accompanied by orchestra"},
      {q:"What is the Hungarian Rhapsody?",a:"Piano compositions by Franz Liszt based on Hungarian folk themes — No. 2 is most famous"},
      {q:"Who is Miles Davis and why is he significant?",a:"Jazz trumpeter who led multiple revolutions — from bebop to modal jazz to fusion"},
      {q:"Beethoven's most remarkable symphony achievement?",a:"The 9th Symphony — composed when Beethoven was completely deaf"},
      {q:"What is counterpoint?",a:"The art of combining two or more independent melodic lines — Bach was the master"},
      {q:"Baroque vs Classical vs Romantic periods?",a:"Baroque (1600–1750): ornate, polyphonic. Classical (1750–1820): balanced. Romantic (1820–1900): emotional"},
      {q:"What is the significance of the 432Hz vs 440Hz debate?",a:"440Hz is standard concert pitch; 432Hz proponents claim it sounds more natural — no scientific basis"},
      {q:"What is Impressionist music?",a:"Late 19th century style evoking mood through colour and texture — Debussy and Ravel are key composers"},
      {q:"What is a fugue?",a:"A contrapuntal composition in which a subject is introduced by one voice and imitated by others"},
      {q:"What is the Gamelan?",a:"A traditional ensemble music of Java and Bali — uses metallophones, xylophones, and gongs"},
    ],
  },
  movies:{ label:"Movies",icon:"\u{1F3AC}",color:"#F472B6",
    200:[
      {q:"Director of The Godfather?",a:"Francis Ford Coppola"},
      {q:"Who voiced Woody in Toy Story?",a:"Tom Hanks"},
      {q:"Who played Forrest Gump?",a:"Tom Hanks"},
      {q:"First Disney animated feature film?",a:"Snow White and the Seven Dwarfs (1937)"},
      {q:"Who plays Tony Montana in Scarface?",a:"Al Pacino"},
      {q:"Year the first Star Wars film released?",a:"1977"},
      {q:"Film featuring Katniss Everdeen?",a:"The Hunger Games"},
      {q:"Who played Iron Man in the MCU?",a:"Robert Downey Jr."},
      {q:"Film set on planet Pandora?",a:"Avatar (2009)"},
      {q:"Director of Jurassic Park?",a:"Steven Spielberg"},
      {q:"Film featuring Let It Go?",a:"Frozen (2013)"},
      {q:"Film with the quote Why so serious??",a:"The Dark Knight (2008)"},
      {q:"Who played Hannibal Lecter in Silence of the Lambs?",a:"Anthony Hopkins"},
      {q:"Fictional country in Black Panther?",a:"Wakanda"},
      {q:"Film with the line I see dead people?",a:"The Sixth Sense (1999)"},
      {q:"Who plays Hermione Granger in Harry Potter?",a:"Emma Watson"},
      {q:"Film about a stranded astronaut on Mars?",a:"The Martian (2015)"},
      {q:"Who played Jack in Titanic?",a:"Leonardo DiCaprio"},
      {q:"Film featuring the Parr family?",a:"The Incredibles (2004)"},
      {q:"Who played Neo in The Matrix?",a:"Keanu Reeves"},
      {q:"Film with the quote You had me at hello?",a:"Jerry Maguire (1996)"},
      {q:"Who played the Joker in the 2019 film?",a:"Joaquin Phoenix"},
      {q:"Year Titanic was released?",a:"1997"},
      {q:"Who plays Thor in the MCU?",a:"Chris Hemsworth"},
      {q:"Who directed the Nolan Batman trilogy?",a:"Christopher Nolan"},
      {q:"Animated film featuring the rat chef Remy?",a:"Ratatouille (2007)"},
      {q:"Who played Maximus in Gladiator?",a:"Russell Crowe"},
      {q:"First Pixar film?",a:"Toy Story (1995)"},
      {q:"Film franchise featuring Dominic Toretto?",a:"Fast & Furious"},
      {q:"Who directed Pulp Fiction?",a:"Quentin Tarantino"},
    ],
    400:[
      {q:"Film with joint record for most Oscars (11)?",a:"Ben-Hur (1959), Titanic (1997), Return of the King (2003)"},
      {q:"Who directed Inception and Interstellar?",a:"Christopher Nolan"},
      {q:"First film to earn over $1 billion?",a:"Titanic (1997)"},
      {q:"Highest-grossing film of all time?",a:"Avatar (2009/re-release)"},
      {q:"What film features HAL 9000?",a:"2001: A Space Odyssey (1968)"},
      {q:"Who directed Schindler's List?",a:"Steven Spielberg"},
      {q:"Who plays Clarice in Silence of the Lambs?",a:"Jodie Foster"},
      {q:"What film features the Corleone family?",a:"The Godfather"},
      {q:"Who directed Fight Club?",a:"David Fincher"},
      {q:"Stanley Kubrick film featuring Alex DeLarge?",a:"A Clockwork Orange (1971)"},
      {q:"What won the first Academy Award for Best Picture?",a:"Wings (1927)"},
      {q:"1975 Spielberg film considered the first modern blockbuster?",a:"Jaws"},
      {q:"Who plays Mark Watney in The Martian?",a:"Matt Damon"},
      {q:"What film features I am your father?",a:"Star Wars: The Empire Strikes Back"},
      {q:"Director of The Silence of the Lambs?",a:"Jonathan Demme"},
      {q:"Film featuring Travis Bickle?",a:"Taxi Driver (1976)"},
      {q:"What film featured a revolutionary bullet-dodging scene?",a:"The Matrix (1999)"},
      {q:"1994 film with Tim Robbins as a wrongly imprisoned banker?",a:"The Shawshank Redemption"},
      {q:"Who plays Captain Jack Sparrow?",a:"Johnny Depp"},
      {q:"Who directed The Shining?",a:"Stanley Kubrick"},
      {q:"Animated film with a chef rat named Remy?",a:"Ratatouille (2007)"},
      {q:"Film featuring character Travis Bickle?",a:"Taxi Driver (1976)"},
      {q:"Who plays James Bond in the Craig era?",a:"Daniel Craig"},
      {q:"Director of Parasite?",a:"Bong Joon-ho"},
      {q:"Film where Ethan Hunt leads IMF missions?",a:"Mission: Impossible"},
      {q:"Who played Maximus in Gladiator?",a:"Russell Crowe"},
      {q:"Director of Spirited Away?",a:"Hayao Miyazaki"},
      {q:"Film featuring Forrest Gump's box of chocolates quote?",a:"Forrest Gump (1994)"},
      {q:"Who directed The Godfather?",a:"Francis Ford Coppola"},
      {q:"1922 horror film unauthorised adaptation of Dracula?",a:"Nosferatu (F.W. Murnau)"},
    ],
    600:[
      {q:"Hitchcock film shot in under three weeks on a TV budget?",a:"Psycho (1960)"},
      {q:"Longest runtime Best Picture winner?",a:"Gone with the Wind (1939) at 3h 58m"},
      {q:"What is mise-en-scène?",a:"Arrangement of everything that appears in a shot — actors, lighting, sets, props, costumes"},
      {q:"What is the Kuleshov Effect?",a:"Audience emotion is shaped by the shot preceding an actor's neutral face — a key editing discovery"},
      {q:"What does auteur theory mean?",a:"A film director is the primary creative author, imprinting their personal vision across their work"},
      {q:"What is German Expressionism in film?",a:"A 1920s movement using distorted sets and dramatic lighting — e.g. Nosferatu, The Cabinet of Dr. Caligari"},
      {q:"What film pioneered CGI for organic creatures?",a:"Jurassic Park (1993)"},
      {q:"What is a MacGuffin?",a:"An object motivating characters but ultimately unimportant — a Hitchcock concept"},
      {q:"What is the Bechdel Test?",a:"Two women must talk to each other about something other than a man — a measure of female representation"},
      {q:"Which film did Orson Welles direct at age 25?",a:"Citizen Kane (1941)"},
      {q:"What is French New Wave cinema?",a:"1950s–60s French film movement rejecting traditional conventions — directors include Godard and Truffaut"},
      {q:"What is the 180-degree rule?",a:"Two characters must always have the same left-right relationship — crossing it confuses the audience"},
      {q:"What is Italian Neorealism?",a:"Post-WWII film movement using non-professional actors and real locations — e.g. Bicycle Thieves"},
      {q:"What is a tracking shot?",a:"Camera physically moves through the scene following the subject"},
      {q:"What is Dogme 95?",a:"A filmmaking manifesto by Lars von Trier and Thomas Vinterberg — rejecting special effects, requiring location shooting"},
      {q:"Who invented the close-up shot?",a:"D.W. Griffith is often credited — he popularised it in early silent cinema"},
      {q:"What is Soviet Montage theory?",a:"The collision of images creates new meaning beyond each individual image — developed in 1920s Soviet cinema"},
      {q:"What is the Spielberg face?",a:"A reaction shot where a character looks at something off-screen with wonder, letting audience project emotion"},
      {q:"What is neo-noir?",a:"A genre updating classic noir conventions to modern settings — e.g. Blade Runner, Chinatown, L.A. Confidential"},
      {q:"What is ludonarrative dissonance?",a:"The conflict between a story and gameplay mechanics — popularized in film criticism too"},
      {q:"What is a diegetic sound in film?",a:"Sound that comes from within the film's world — characters can hear it (music from a radio, footsteps)"},
      {q:"Who was Stanley Kubrick?",a:"A perfectionist director known for 2001, Full Metal Jacket, The Shining — known for groundbreaking visual style"},
    ],
  },
  movie_scenes: MOVIE_SCENE_BANK,
  marvel:{ label:"Marvel",icon:"\u26A1",color:"#DC2626",
    200:[
      {q:"Tony Stark's superhero name?",a:"Iron Man"},
      {q:"Thor's hammer name?",a:"Mjolnir"},
      {q:"Real name of the Hulk?",a:"Dr. Bruce Banner"},
      {q:"Who is Peter Parker?",a:"Spider-Man"},
      {q:"Thor's home world?",a:"Asgard"},
      {q:"Villain in the first Avengers movie?",a:"Loki"},
      {q:"Infinity Stone in Vision's forehead?",a:"The Mind Stone"},
      {q:"Who plays Spider-Man in the MCU?",a:"Tom Holland"},
      {q:"Black Panther's country?",a:"Wakanda"},
      {q:"Who plays Nick Fury?",a:"Samuel L. Jackson"},
      {q:"Groot's only phrase?",a:"I am Groot"},
      {q:"What color is Iron Man's suit?",a:"Red and gold"},
      {q:"What is the Infinity Gauntlet?",a:"A glove holding all six Infinity Stones, granting near-omnipotent power"},
      {q:"What is Vibranium?",a:"Fictional metal found in Wakanda — absorbs kinetic energy"},
      {q:"Who is Black Widow?",a:"Natasha Romanoff — former Soviet spy turned Avenger"},
      {q:"What does HYDRA want?",a:"World domination — a villainous organization from within SHIELD"},
      {q:"Who is Hawkeye?",a:"Clint Barton — expert archer and founding Avenger"},
      {q:"What are the Infinity Stones?",a:"Six powerful gems controlling Space, Mind, Reality, Power, Time, and Soul"},
      {q:"Who is Vision?",a:"An android created by Ultron using the Mind Stone, Vibranium, and Tony's JARVIS AI"},
      {q:"What is the Bifrost?",a:"A rainbow bridge in Asgard enabling travel between the Nine Realms"},
      {q:"Who plays Doctor Strange?",a:"Benedict Cumberbatch"},
      {q:"Who is Captain Marvel?",a:"Carol Danvers — former US Air Force pilot with cosmic energy powers"},
      {q:"What is Ant-Man's ability?",a:"He can shrink to microscopic size or grow to enormous size using a special suit"},
      {q:"Who is the raccoon in Guardians of the Galaxy?",a:"Rocket Raccoon"},
      {q:"Who plays Black Panther?",a:"Chadwick Boseman (first three films)"},
      {q:"Who is Thanos?",a:"A powerful cosmic villain who wants to wipe out half of all life in the universe"},
      {q:"What is Captain America's shield made of?",a:"Vibranium"},
      {q:"Name the three Spider-Men in No Way Home.",a:"Tom Holland, Andrew Garfield, and Tobey Maguire"},
      {q:"What is the Quantum Realm?",a:"A subatomic dimension — key to time travel in Endgame"},
      {q:"What is Thor's axe in Infinity War called?",a:"Stormbreaker"},
    ],
    400:[
      {q:"What does S.H.I.E.L.D. stand for?",a:"Strategic Homeland Intervention, Enforcement and Logistics Division"},
      {q:"Tony Stark's AI assistant?",a:"J.A.R.V.I.S. (Just A Rather Very Intelligent System)"},
      {q:"Who trained Black Widow?",a:"The Red Room (Soviet training program)"},
      {q:"Real name of the Scarlet Witch?",a:"Wanda Maximoff"},
      {q:"Who created Ultron in the MCU?",a:"Tony Stark and Bruce Banner using the Mind Stone"},
      {q:"What planet does Thanos come from?",a:"Titan"},
      {q:"What is the Soul Stone's requirement?",a:"You must sacrifice someone you love to obtain it"},
      {q:"Who kills Thanos first in Endgame?",a:"Thor — he decapitates the weakened Thanos in 2023"},
      {q:"Significance of Tony's I am Iron Man in Endgame?",a:"Echoes the first Iron Man film — here he uses all six Stones, sacrificing himself"},
      {q:"Who is Kang the Conqueror?",a:"A time-travelling conqueror — the primary villain of the Multiverse Saga"},
      {q:"What are the Ten Rings?",a:"An ancient organization led by the Mandarin — appears in Iron Man 3 and Shang-Chi"},
      {q:"What is the Sokovia Accords?",a:"A UN agreement requiring enhanced individuals to register under government oversight"},
      {q:"What is the Raft?",a:"A maximum-security underwater prison for superhumans"},
      {q:"Who is Shuri?",a:"T'Challa's sister and Wakanda's genius chief scientist"},
      {q:"What is the Time Stone also called?",a:"The Eye of Agamotto"},
      {q:"Who plays Nebula?",a:"Karen Gillan"},
      {q:"Name of the Guardians' ship?",a:"The Milano"},
      {q:"Who is Moon Knight?",a:"Marc Spector — a mercenary who becomes the avatar of Egyptian moon god Khonshu, with DID"},
      {q:"What is the Multiverse Saga?",a:"MCU Phases 4, 5, 6 — exploring alternate realities with Kang as the primary threat"},
      {q:"Who is Miles Morales?",a:"The second Spider-Man — a Black and Puerto Rican teenager from Brooklyn"},
      {q:"What is the House of M storyline?",a:"Wanda reshapes reality so mutants rule — she ends it saying No more mutants, depowering most X-Men"},
      {q:"What is the Illuminati in Marvel comics?",a:"A secret group including Iron Man, Mr. Fantastic, Professor X, Doctor Strange, Namor, Black Bolt"},
      {q:"What is the Black Order?",a:"Thanos's elite generals: Proxima Midnight, Corvus Glaive, Cull Obsidian, and Ebony Maw"},
      {q:"What is the Kree-Skrull War?",a:"An ancient interstellar war between two alien races — backdrop to Captain Marvel"},
      {q:"Who is Adam Warlock?",a:"A perfect artificial being created by the Sovereign — has a complex comics history with Thanos"},
      {q:"What happened to Steve Rogers at the end of Endgame?",a:"He went back in time to be with Peggy Carter, growing old and returning to give Sam the shield"},
      {q:"What is the Civil War in Marvel comics?",a:"Iron Man supports the Superhuman Registration Act; Cap opposes it — heroes fight each other"},
      {q:"Who is the Beyonder in Marvel Comics?",a:"An incredibly powerful cosmic entity from outside the Marvel universe — responsible for Secret Wars"},
      {q:"What is the Living Tribunal?",a:"A cosmic entity overseeing balance in the Marvel multiverse — above the Infinity Stones in power"},
      {q:"What is the Savage Land?",a:"A tropical environment hidden in Antarctica where dinosaurs and prehistoric creatures survived"},
    ],
    600:[
      {q:"What are all six Infinity Stones?",a:"Space, Mind, Reality, Power, Time, and Soul"},
      {q:"What is the Phoenix Force?",a:"A cosmic entity bonding with a mutant host — most famously Jean Grey — granting near-unlimited power"},
      {q:"Significance of Steve Rogers picking up Mjolnir in Endgame?",a:"He was deemed worthy — Thor suspected this in Age of Ultron when Steve slightly budged it"},
      {q:"What is the Eternals' true mission?",a:"Created by Celestials to allow life to grow and energy to accumulate — for the Emergence: a new Celestial born inside Earth"},
      {q:"Who is Galactus?",a:"The Devourer of Worlds — a cosmic being who consumes planets for sustenance"},
      {q:"What is the Negative Zone?",a:"An anti-matter universe accessible through a portal — first explored by Mr. Fantastic"},
      {q:"Who is the Molecule Man?",a:"Owen Reece — can manipulate matter and energy at a molecular level — lynchpin of the entire multiverse in some storylines"},
      {q:"Significance of the first Iron Man post-credits scene?",a:"Nick Fury tells Tony he's not alone — the first hint of a shared Marvel Cinematic Universe"},
      {q:"What is the Infinity War Decimation?",a:"Thanos snapping with all six Infinity Stones, instantly wiping out 50% of all life in the universe"},
      {q:"What is the concept of a Nexus Being?",a:"A being who is a focal point of the universe's energy — Wanda Maximoff is the Nexus Being of Earth-616"},
      {q:"What is the Multiverse in MCU terms and what opened it?",a:"An infinite set of parallel universes — destabilised by the Infinity War snap and Strange's spell in No Way Home"},
      {q:"What is Secret Invasion?",a:"Skrulls have secretly replaced key figures in the Marvel universe — including heroes and politicians"},
      {q:"What is the Rule of X in the Krakoa era?",a:"The laws established for mutantkind on the sovereign nation Krakoa — from Jonathan Hickman's X-Men run"},
      {q:"Who is Knull the God of Symbiotes?",a:"The progenitor of all symbiotes — the darkness before creation itself — a Donny Cates villain"},
      {q:"What is the Beyonder's Secret Wars?",a:"He transports heroes and villains to Battleworld to fight — one of Marvel's most important crossover events"},
      {q:"What is the significance of the Civil War II in Marvel comics?",a:"The Inhuman Ulysses can predict the future — the debate over whether to act on future crimes splits the heroes again"},
      {q:"Who is the One Above All?",a:"The supreme being of the Marvel multiverse — the equivalent of God, overseeing all existence"},
      {q:"What is the difference between Earth-616 and Earth-199999?",a:"Earth-616 is the main Marvel Comics universe; Earth-199999 is the MCU"},
      {q:"What is the significance of the snap reversal in Endgame?",a:"Hulk used the gauntlet to reverse the snap — then Thanos's army arrived, leading to the final battle"},
      {q:"What is the Celestials' role in Marvel cosmology?",a:"Ancient cosmic beings who seeded life across the universe and return to judge whether planets should be destroyed"},
    ],
  },
  dc:{ label:"DC Universe",icon:"\u{1F987}",color:"#2563EB",
    200:[
      {q:"Batman's real name?",a:"Bruce Wayne"},
      {q:"Superman's weakness?",a:"Kryptonite"},
      {q:"Batman's nemesis?",a:"The Joker"},
      {q:"Superman's home planet?",a:"Krypton"},
      {q:"What does DC stand for?",a:"Detective Comics"},
      {q:"Batman's butler?",a:"Alfred Pennyworth"},
      {q:"Aquaman's real name?",a:"Arthur Curry"},
      {q:"City Superman protects?",a:"Metropolis"},
      {q:"Batman's sidekick?",a:"Robin (Dick Grayson was first)"},
      {q:"The Flash's superpower?",a:"Super speed — fastest man alive"},
      {q:"Who is Lex Luthor?",a:"Superman's arch-nemesis — brilliant but ruthless billionaire"},
      {q:"Green Lantern's power source?",a:"Willpower"},
      {q:"Who plays Batman in the Nolan trilogy?",a:"Christian Bale"},
      {q:"Wonder Woman's weapon?",a:"The Lasso of Truth — and Amazonian sword and shield"},
      {q:"Batman's city?",a:"Gotham City"},
      {q:"What is the Bat-Signal?",a:"A large searchlight in Gotham used to summon Batman"},
      {q:"Who is Darkseid?",a:"The ruler of Apokolips — DC's most powerful villain, seeking the Anti-Life Equation"},
      {q:"Who created Superman?",a:"Jerry Siegel and Joe Shuster — first appeared in Action Comics #1 in 1938"},
      {q:"Who is Cyborg?",a:"Victor Stone — athlete whose body was partially replaced with cybernetic technology"},
      {q:"What is kryptonite?",a:"Radioactive material from Superman's home planet — weakens and can kill him"},
      {q:"Who is Catwoman?",a:"Selina Kyle — a skilled thief with a complicated romantic history with Batman"},
      {q:"What is the Batmobile?",a:"Batman's armoured high-performance vehicle"},
      {q:"Superman's Kryptonian name?",a:"Kal-El"},
      {q:"Who is Nightwing?",a:"Dick Grayson — the original Robin who grew up and became his own hero"},
      {q:"Who is Poison Ivy?",a:"A villain obsessed with plants using pheromones and toxins — often linked with Harley Quinn"},
      {q:"What is the Justice League?",a:"DC's superhero team — Batman, Superman, Wonder Woman, Flash, Aquaman, Cyborg, Green Lantern"},
      {q:"What is the Batcave?",a:"Bruce Wayne's secret underground headquarters beneath Wayne Manor"},
      {q:"Who is Harley Quinn's love interest?",a:"The Joker"},
      {q:"Who is Amanda Waller?",a:"The ruthless government official who runs Task Force X (Suicide Squad)"},
      {q:"Who is Shazam?",a:"Billy Batson — a young boy who transforms into a superhero by saying SHAZAM!"},
    ],
    400:[
      {q:"Who is the main villain in Justice League (2017)?",a:"Steppenwolf"},
      {q:"Flash's real name?",a:"Barry Allen — a forensic scientist"},
      {q:"What is the Phantom Zone?",a:"A dimensional prison used by Kryptonians — created by Jor-El"},
      {q:"Darkseid's goal?",a:"To find the Anti-Life Equation and control all sentient life in the universe"},
      {q:"What is the Green Lantern Corps?",a:"An intergalactic police force created by the Guardians of the Universe on Oa"},
      {q:"What is the Speed Force?",a:"A unique extradimensional energy that all speedsters draw power from"},
      {q:"Who is Brainiac?",a:"An alien villain who miniaturizes and collects cities from across the universe"},
      {q:"Who is the Reverse Flash?",a:"Eobard Thawne — a future villain who killed Barry Allen's mother"},
      {q:"What is the New 52?",a:"A 2011 DC initiative that rebooted the entire DC Universe into a new continuity"},
      {q:"Who is Zatanna?",a:"A powerful sorceress in the Justice League — she speaks spells backwards"},
      {q:"What is Blackest Night?",a:"A DC storyline where dead heroes and villains are reanimated as Black Lanterns who consume emotion"},
      {q:"Who is Deathstroke?",a:"Slade Wilson — one of DC's most formidable assassins, with enhanced abilities and tactical genius"},
      {q:"What is the Injustice storyline?",a:"Superman becomes a dictator after the Joker kills Lois Lane — Batman leads a resistance"},
      {q:"Who is Martian Manhunter?",a:"J'onn J'onzz — a Martian superhero with telepathy, shapeshifting, and strength"},
      {q:"What is the Anti-Life Equation?",a:"A mathematical formula Darkseid seeks that would give him control over all sentient life"},
      {q:"What is Crisis on Infinite Earths?",a:"A 1985 DC storyline collapsing the multiverse — killing the original Supergirl and Barry Allen"},
      {q:"What is the New Gods concept?",a:"Jack Kirby's Fourth World mythology — beings from New Genesis and Apokolips representing good and evil"},
      {q:"Who is Parallax?",a:"An ancient yellow fear entity that can possess Green Lanterns — it possessed Hal Jordan"},
      {q:"What is the significance of Watchmen for DC?",a:"A 1986-87 deconstruction of the superhero genre — set the template for darker superhero stories"},
      {q:"Who is Mister Mxyzptlk?",a:"A fifth-dimensional imp only defeated by tricking him into saying his name backwards — a Superman villain"},
      {q:"What is Black Adam?",a:"An ancient Egyptian anti-hero with powers similar to Shazam — played by Dwayne Johnson in 2022"},
      {q:"What is the significance of the Death of Superman?",a:"Superman is killed by Doomsday in 1992 — a landmark event that became major news"},
      {q:"What is Flashpoint?",a:"Barry goes back to save his mother — creating an alternate timeline that led to the New 52 reboot"},
      {q:"Who is Barbara Gordon?",a:"Commissioner Gordon's daughter — Batgirl, then Oracle after being shot by the Joker"},
      {q:"Who is the Question?",a:"Vic Sage — a faceless detective vigilante who inspired Watchmen's Rorschach"},
      {q:"What is Infinite Crisis?",a:"A 2005 DC storyline involving conflicts between alternate Earths and a rogue Superboy-Prime"},
      {q:"What is Earth-2 in DC?",a:"A parallel universe with older Golden Age versions of DC heroes"},
      {q:"Who is Tim Drake?",a:"The third Robin — often considered the most intelligent, who deduced Batman's identity as a child"},
      {q:"What is the Tower of Babel storyline?",a:"Batman's files are stolen — revealing his contingency plans to defeat every Justice League member"},
      {q:"Who is Perpetua in DC?",a:"The cosmic mother of the multiverse — a villain in Scott Snyder's Justice League run"},
    ],
    600:[
      {q:"What is the Doomsday Clock storyline?",a:"Watchmen characters (especially Dr. Manhattan) cross into the main DC universe — connecting both canons"},
      {q:"Pre-Crisis vs Post-Crisis Superman?",a:"Pre-Crisis: omnipotent, could move planets. Post-Crisis (1985): more human and relatable"},
      {q:"What is the Omega Effect?",a:"Darkseid's signature power — energy beams pursuing their target across dimensions and time"},
      {q:"What is the significance of No Man's Land in Batman?",a:"Gotham is cut off after a massive earthquake — an entire year of Batman comics in a lawless isolated city"},
      {q:"Who is Swamp Thing?",a:"Alec Holland — a scientist reborn as a plant elemental, connected to the Green (force of all plant life)"},
      {q:"What is Grant Morrison's contribution to Batman?",a:"Morrison introduced all Batman stories as canon — including 1950s sci-fi stories — as psychological trauma"},
      {q:"What is the Red Son storyline?",a:"An Elseworlds tale where Superman's rocket lands in Soviet Ukraine instead of Kansas"},
      {q:"What is the Sinestro Corps War?",a:"Sinestro creates his own fear-wielding corps — the first major GL crossover event"},
      {q:"Who is Seagrin in the New Gods?",a:"One of the Forever People — the New Gods' young team who seek adventure on Earth"},
      {q:"What is the significance of The Long Halloween?",a:"A 13-issue Batman story by Jeph Loeb depicting his early career and the rise of Two-Face"},
      {q:"What is the Knightfall storyline?",a:"Bane breaks Batman's back — Jean-Paul Valley (Azrael) takes over as Batman before Bruce recovers"},
      {q:"Who is Geo-Force?",a:"Brion Markov — a prince with earth-manipulation powers, member of the Outsiders"},
      {q:"What is the significance of Final Crisis?",a:"Darkseid achieves the Anti-Life Equation and enslaves the Earth — Batman shoots Darkseid with a god-killing bullet"},
      {q:"Who is Ultra-Man?",a:"The evil Superman of Earth-3 — a member of the Crime Syndicate"},
      {q:"What is the significance of Hypertime?",a:"A DC concept allowing all previously published DC stories to be technically canon in branching realities"},
      {q:"Who is Arion?",a:"An ancient Atlantean sorcerer from 45,000 years ago — one of DC's oldest heroes"},
      {q:"What is the significance of Superman's death and resurrection?",a:"His death in 1992 was unprecedented — it caused media frenzy. His four replacements explored what Superman means"},
      {q:"What is the Nth metal in DC Comics?",a:"A mysterious metal from Thanagar that defies physics — worn by Hawkman in his anti-gravity harness"},
      {q:"Who is Bat-Mite?",a:"A fifth-dimensional imp who idolizes Batman and often causes chaos while trying to help him"},
      {q:"What is the significance of Crisis on Infinite Earths vs Infinite Crisis?",a:"CoIE (1985): destroyed the multiverse, created one universe. IC (2005): the multiverse reasserted itself"},
    ],
  },
  star_wars:{ label:"Star Wars",icon:"\u2694\uFE0F",color:"#CA8A04",
    200:[
      {q:"Luke Skywalker's father?",a:"Darth Vader (Anakin Skywalker)"},
      {q:"Han Solo's ship?",a:"The Millennium Falcon"},
      {q:"Color of Mace Windu's lightsaber?",a:"Purple"},
      {q:"Species of Chewbacca?",a:"Wookiee"},
      {q:"Who says Do or do not, there is no try?",a:"Yoda"},
      {q:"Planet destroyed by the Death Star?",a:"Alderaan"},
      {q:"Baby Yoda's real name?",a:"Grogu"},
      {q:"Who trained Obi-Wan Kenobi?",a:"Qui-Gon Jinn"},
      {q:"What is the Force?",a:"An energy field created by all living things that binds the galaxy together"},
      {q:"Color of Darth Vader's lightsaber?",a:"Red"},
      {q:"Luke's home planet?",a:"Tatooine"},
      {q:"Empire's massive superweapon?",a:"The Death Star"},
      {q:"Who voices Darth Vader?",a:"James Earl Jones"},
      {q:"Who is the Emperor?",a:"Palpatine / Darth Sidious — the Sith Lord ruling the Galactic Empire"},
      {q:"What are X-Wings?",a:"The main starfighter used by the Rebel Alliance"},
      {q:"What is a Jedi?",a:"A Force-sensitive member of the peacekeeping order serving the light side"},
      {q:"What is the Sith?",a:"An ancient order of Force users serving the dark side — fueled by passion and anger"},
      {q:"Who is Jabba the Hutt?",a:"A powerful crime lord on Tatooine"},
      {q:"What is a lightsaber made of?",a:"A plasma blade powered by a kyber crystal"},
      {q:"Who is Yoda?",a:"A legendary Jedi Grand Master — one of the oldest and most powerful Jedi ever"},
      {q:"What is the Rebel Alliance?",a:"The resistance movement fighting against the Galactic Empire"},
      {q:"What built C-3PO?",a:"Anakin Skywalker built him as a child on Tatooine"},
      {q:"Who is Lando Calrissian?",a:"A charming scoundrel, former owner of the Millennium Falcon, general in the Rebel Alliance"},
      {q:"What are Stormtroopers?",a:"The Empire's infantry soldiers in white armour"},
      {q:"What is the Galactic Empire?",a:"The authoritarian government that controls the galaxy after the fall of the Republic"},
      {q:"Who is Princess Leia?",a:"A leader of the Rebel Alliance and later the Resistance — played by Carrie Fisher"},
      {q:"What is Order 66?",a:"A secret command that programmed clone troopers to simultaneously kill all Jedi"},
      {q:"What are the two suns on Tatooine called?",a:"Tatoo I and Tatoo II"},
      {q:"Who is Ahsoka Tano?",a:"Anakin Skywalker's former Padawan — she left the Order and became an independent Force user"},
      {q:"What is the significance of Rogue One?",a:"It shows how the Rebel Alliance stole the Death Star plans — filling the gap before A New Hope"},
    ],
    400:[
      {q:"What is the Kessel Run?",a:"A smuggling route — Han claims to have made it in less than 12 parsecs"},
      {q:"Planet where Yoda hid in exile?",a:"Dagobah"},
      {q:"What are midi-chlorians?",a:"Microscopic life forms that allow Force-sensitive beings to connect to the Force"},
      {q:"What is the Darksaber?",a:"An ancient black-bladed lightsaber — the wielder is rightful ruler of Mandalore"},
      {q:"Darth Sidious's Sith master?",a:"Darth Plagueis"},
      {q:"Planet the Galactic Senate is on?",a:"Coruscant"},
      {q:"Who is the Mandalorian?",a:"Din Djarin — a Mandalorian bounty hunter and guardian of Grogu"},
      {q:"What is the Sith Rule of Two?",a:"There can only ever be two Sith — a master and an apprentice"},
      {q:"Who are the Inquisitors?",a:"Former Jedi turned to the dark side who hunt surviving Jedi for the Empire after Order 66"},
      {q:"What is the World between Worlds?",a:"A mystical plane connecting all time and space — accessible through the Jedi Temple on Lothal"},
      {q:"What is the Clone Wars?",a:"A galaxy-wide war between the Galactic Republic and Separatists, fought by clone armies and Jedi"},
      {q:"Who is Boba Fett?",a:"A Mandalorian bounty hunter — clone of Jango Fett, one of the most feared in the galaxy"},
      {q:"Who is Grand Admiral Thrawn?",a:"A brilliant Chiss Imperial tactician who studies enemy art to predict their behavior"},
      {q:"What is the Prophecy of the Chosen One?",a:"An ancient Jedi prophecy — a being would bring balance to the Force, believed to be Anakin"},
      {q:"Who is Padmé Amidala?",a:"Queen then Senator of Naboo — mother of Luke and Leia, wife of Anakin Skywalker"},
      {q:"What is a kyber crystal?",a:"The focusing crystal at the heart of every lightsaber — Force-sensitive, they choose their Jedi"},
      {q:"What is the significance of Bespin?",a:"A gas giant home to Cloud City — where Han is frozen and Luke loses his hand to Vader"},
      {q:"Who is Count Dooku?",a:"A former Jedi Master who became Darth Tyranus — Darth Sidious's apprentice"},
      {q:"What is the significance of Exegol?",a:"The hidden Sith world where Emperor Palpatine survived and rebuilt his Final Order fleet"},
      {q:"Who is Jyn Erso?",a:"Protagonist of Rogue One — daughter of Galen Erso, leads the mission to steal the Death Star plans"},
      {q:"What is the significance of Anakin's high midi-chlorian count?",a:"Highest ever recorded — believed to be the Chosen One destined to bring balance to the Force"},
      {q:"What is the Galactic Civil War?",a:"The conflict between the Rebel Alliance and the Galactic Empire — central to the original trilogy"},
      {q:"Who is the Bad Batch?",a:"A group of elite clone troopers with unique genetic mutations — the focus of The Bad Batch series"},
      {q:"What is a Force Dyad?",a:"A rare Force bond between two beings who are one in the Force — Rey and Kylo Ren form one"},
      {q:"What is the significance of Mandalorian beskar armour?",a:"Beskar (Mandalorian iron) is nearly indestructible — it can deflect a lightsaber blade"},
      {q:"Who built C-3PO?",a:"Anakin Skywalker built him as a child on Tatooine"},
      {q:"What is the significance of the Tragedy of Darth Plagueis the Wise?",a:"A Sith tale Palpatine tells Anakin — Plagueis learned to prevent death but was killed by his apprentice (Palpatine)"},
      {q:"What are the Whills?",a:"Mysterious beings — the Journal of the Whills frames the entire Star Wars saga"},
      {q:"What is Mortis in The Clone Wars?",a:"A realm strong with the Force where the Father, Son, and Daughter represent the balance of light and dark"},
      {q:"Who is Darth Revan?",a:"An ancient Sith Lord from the Old Republic era — protagonist of Knights of the Old Republic"},
    ],
    600:[
      {q:"Difference between light side and dark side of the Force?",a:"Light side: peace, knowledge, serenity. Dark side: passion, power, strength — fueled by anger and fear"},
      {q:"Who built the flaw into the Death Star?",a:"Galen Erso — he built a thermal exhaust port that Luke destroys the Death Star through"},
      {q:"What is the Rule of Two's origin?",a:"Created by Darth Bane ~1,000 years before the films — to concentrate Sith power and avoid self-destruction"},
      {q:"What is the significance of the Vergence in the Force?",a:"A concentrated point of Force energy — Anakin Skywalker was believed to have been conceived by one"},
      {q:"What is the Hundred-Year Darkness?",a:"A conflict ~7,000 years before the films when a Jedi splinter group first used dark side alchemy — creating the Sith"},
      {q:"Who is Exar Kun?",a:"An ancient Sith Lord who discovered Sith magic and nearly destroyed the Jedi Order 4,000 years before the films"},
      {q:"What is the significance of the High Republic era?",a:"A golden age of the Jedi about 200 years before the prequels — explored in books and comics from 2021"},
      {q:"What is a Force Ghost?",a:"The ability for a deceased Jedi to preserve their consciousness — first achieved by Qui-Gon Jinn"},
      {q:"What is the significance of Obi-Wan's sacrifice in A New Hope?",a:"He allows Vader to strike him down, becoming one with the Force — guiding Luke from beyond death"},
      {q:"What is the Sith's relationship with emotion?",a:"The Sith use emotion as power — the dark side is fueled by fear, anger, hatred, and suffering"},
      {q:"What is the significance of Anakin killing the Tusken Raiders?",a:"His mother's death at their hands is his first major step toward the dark side"},
      {q:"Who is Doctor Aphra?",a:"An amoral archaeologist in the comics — companion to Darth Vader, one of the most popular new EU characters"},
      {q:"What is the significance of R2-D2 throughout the saga?",a:"He holds key information in every trilogy — he contained the complete map to the Jedi temples"},
      {q:"What is the difference between a Jedi Knight and a Jedi Master?",a:"A Knight completes training; a Master shows exceptional skill, wisdom, and usually trains a Padawan"},
      {q:"What is the significance of the Darth Vader NO in Revenge of the Sith?",a:"When Vader learns Padmé is dead, his anguished NO became a famous meme — representing his complete transformation"},
      {q:"What is the Hundred-Year Darkness connection to Sith history?",a:"The creation of the Sith race through dark side alchemy — a group of fallen Jedi were exiled to Moraband"},
      {q:"What is the Force Chosen One prophecy's ultimate fulfillment?",a:"Anakin destroys Darth Sidious (both in Return of the Jedi and The Rise of Skywalker) — bringing balance to the Force"},
      {q:"Who are the Zeffo?",a:"An ancient alien civilization — important in Jedi: Fallen Order — they explored the galaxy seeking connection with the Force"},
      {q:"What is the significance of the World between Worlds in Rebels?",a:"Ezra pulls Ahsoka out of death — suggesting Force-sensitive beings can transcend time and death"},
      {q:"What is the Midi-chlorian controversy?",a:"Many fans disliked The Phantom Menace's explanation that Force sensitivity is biological — contradicting its mystical nature"},
    ],
  },
  harry_potter:{ label:"Harry Potter",icon:"\u{1F9D9}",color:"#7C3AED",
    200:[
      {q:"Harry Potter's Hogwarts house?",a:"Gryffindor"},
      {q:"Name of Harry's owl?",a:"Hedwig"},
      {q:"Spell that disarms an opponent?",a:"Expelliarmus"},
      {q:"What does Lumos do?",a:"Lights up the tip of your wand"},
      {q:"The wizarding prison?",a:"Azkaban"},
      {q:"Harry's Quidditch position?",a:"Seeker"},
      {q:"Harry's godfather?",a:"Sirius Black"},
      {q:"Form of Hermione's Patronus?",a:"An otter"},
      {q:"Harry's best friend?",a:"Ron Weasley"},
      {q:"Dumbledore's role at Hogwarts?",a:"Headmaster"},
      {q:"Train to Hogwarts?",a:"The Hogwarts Express — from Platform 9¾"},
      {q:"Who is Neville Longbottom?",a:"A fellow Gryffindor who kills Nagini with the Sword of Gryffindor"},
      {q:"What is a Horcrux?",a:"An object containing a fragment of a dark wizard's soul"},
      {q:"What is the Golden Snitch?",a:"A small winged ball — catching it ends the Quidditch match and scores 150 points"},
      {q:"What is Diagon Alley?",a:"A hidden wizarding shopping street in London"},
      {q:"What are house elves?",a:"Magical creatures bound to serve wizarding families — Dobby is the most famous"},
      {q:"Who is Voldemort?",a:"The Dark Lord — born Tom Marvolo Riddle — who killed Harry's parents"},
      {q:"What is a Muggle?",a:"A non-magical person"},
      {q:"Levitation spell?",a:"Wingardium Leviosa"},
      {q:"Four Hogwarts houses?",a:"Gryffindor, Slytherin, Ravenclaw, and Hufflepuff"},
      {q:"Who is Rubeus Hagrid?",a:"Keeper of Keys and Grounds at Hogwarts — Harry's first connection to the wizarding world"},
      {q:"What does Accio do?",a:"Summons an object to the caster — a Summoning Charm"},
      {q:"What is butterbeer?",a:"A popular wizarding drink served at the Three Broomsticks — slightly warming"},
      {q:"What is the Sorting Hat?",a:"A magical hat that places new students into their Hogwarts house"},
      {q:"Who is Professor McGonagall?",a:"Deputy Headmistress, Transfiguration teacher, and head of Gryffindor house"},
      {q:"What is the Forbidden Forest?",a:"A dark, dangerous forest on Hogwarts grounds — home to centaurs, unicorns, and giant spiders"},
      {q:"What is Polyjuice Potion?",a:"A potion temporarily transforming the drinker into another person's physical appearance"},
      {q:"What is the Chamber of Secrets?",a:"A hidden chamber in Hogwarts created by Salazar Slytherin — home to the Basilisk"},
      {q:"Ron's rat's real identity?",a:"Peter Pettigrew (Wormtail) — hiding in Animagus form for 12 years"},
      {q:"What does a Boggart transform into?",a:"The viewer's greatest fear"},
    ],
    400:[
      {q:"Three Deathly Hallows?",a:"The Elder Wand, the Resurrection Stone, and the Invisibility Cloak"},
      {q:"Core of Harry's wand?",a:"A phoenix feather from Dumbledore's phoenix Fawkes"},
      {q:"Who is the Half-Blood Prince?",a:"Severus Snape"},
      {q:"Who are the four founders of Hogwarts?",a:"Godric Gryffindor, Salazar Slytherin, Rowena Ravenclaw, Helga Hufflepuff"},
      {q:"What is Parseltongue?",a:"The language of snakes — a rare and dark-associated ability"},
      {q:"Who are the Marauders?",a:"James Potter (Prongs), Sirius Black (Padfoot), Remus Lupin (Moony), Peter Pettigrew (Wormtail)"},
      {q:"Muggle vs Squib difference?",a:"A Muggle has no magic; a Squib is born to a magical family but has no powers"},
      {q:"Who is Bellatrix Lestrange?",a:"Voldemort's most loyal follower — cousin of Sirius Black"},
      {q:"What is the Room of Requirement?",a:"A magical room that appears when needed, providing whatever is required"},
      {q:"Who is Dobby?",a:"A house-elf who becomes fiercely loyal to Harry and is freed"},
      {q:"What is a Pensieve?",a:"A stone basin used to review memories — Dumbledore uses one with Harry"},
      {q:"The three Unforgivable Curses?",a:"Avada Kedavra (death), Crucio (torture), Imperio (mind control)"},
      {q:"What is the Order of the Phoenix?",a:"A secret organisation founded by Dumbledore to fight Voldemort and the Death Eaters"},
      {q:"What is the full prophecy?",a:"Neither can live while the other survives — linking Harry and Voldemort's fates"},
      {q:"Who is Mad-Eye Moody?",a:"Alastor Moody — a retired Auror famous for his magical eye and constant vigilance"},
      {q:"Hogwarts motto?",a:"Draco dormiens nunquam titillandus — Never tickle a sleeping dragon"},
      {q:"What is a Patronus?",a:"A positive force conjured to repel Dementors — takes the shape of an animal"},
      {q:"What is the Sword of Gryffindor?",a:"A goblin-made sword that imbibes what makes it stronger — used to destroy Horcruxes"},
      {q:"Who is Luna Lovegood?",a:"An eccentric Ravenclaw who becomes one of Harry's closest friends"},
      {q:"What is the Marauder's Map?",a:"A magical map of Hogwarts showing every person's location in real time"},
      {q:"What is the Dark Mark?",a:"Voldemort's symbol — a skull with a serpent tongue — cast when Death Eaters kill"},
      {q:"Who is Gilderoy Lockhart?",a:"The fraudulent DADA teacher in Year 2 — takes credit for others' achievements"},
      {q:"Who is Nymphadora Tonks?",a:"A Metamorphmagus Auror and Order of the Phoenix member — she marries Remus Lupin"},
      {q:"What is Arithmancy?",a:"A Hogwarts course studying magical properties of numbers — Hermione's favourite subject"},
      {q:"Who guards Azkaban?",a:"Dementors — soul-sucking creatures that feed on happiness"},
      {q:"Who is Professor Quirrell?",a:"DADA teacher in Year 1 — secretly hosting Voldemort's spirit on the back of his head"},
      {q:"What is the Mirror of Erised?",a:"A mirror showing the viewer's deepest desire — Erised is 'desire' spelled backwards"},
      {q:"Who is Nicolas Flamel?",a:"A real historical alchemist — in HP he created the only known Philosopher's Stone"},
      {q:"What is Occlumency?",a:"Magically defending the mind against external penetration — opposite of Legilimency"},
      {q:"What is the significance of the Elder Wand's allegiance?",a:"The wand's true master is whoever disarmed the previous master — Draco unknowingly became master, then Harry"},
    ],
    600:[
      {q:"List all Horcruxes and how they were destroyed.",a:"Diary: Basilisk fang. Ring: Sword. Locket: Ron/Sword. Cup: Hermione/Basilisk fang. Diadem: Fiendfyre. Nagini: Neville/Sword. Harry: Voldemort's own Killing Curse"},
      {q:"What is the full prophecy linking Harry and Voldemort?",a:"The one with the power to vanquish the Dark Lord approaches... neither can live while the other survives"},
      {q:"Original owner of the Elder Wand before Dumbledore?",a:"Gellert Grindelwald (who took it from Gregorovitch)"},
      {q:"What is the Fidelius Charm?",a:"It conceals a secret inside a person's soul — only the Secret-Keeper can reveal it"},
      {q:"Why is Harry being a Horcrux significant?",a:"Voldemort accidentally made Harry a Horcrux — Harry had to let Voldemort kill him to destroy that soul fragment"},
      {q:"Dumbledore's full name?",a:"Albus Percival Wulfric Brian Dumbledore"},
      {q:"Why did the Sorting Hat consider putting Harry in Slytherin?",a:"He had Slytherin qualities — partly because he carried a piece of Voldemort's soul"},
      {q:"What is the significance of Lily Potter's sacrifice?",a:"Her love-based sacrifice created magical protection that deflected Voldemort's Killing Curse"},
      {q:"What is the Animagus transformation?",a:"A wizard who can transform into an animal — James (stag), Sirius (dog), Peter (rat), McGonagall (cat)"},
      {q:"What is the nature of Voldemort's soul at the end?",a:"So fragmented from creating Horcruxes, his soul becomes a stunted, damaged, baby-like form seen in King's Cross"},
      {q:"Why could Neville Longbottom have been the Chosen One?",a:"The prophecy fit him too — but Voldemort chose Harry, marking him as his equal"},
      {q:"What is the wizarding economy?",a:"Based on Galleons (gold), Sickles (silver), and Knuts (bronze) — Gringotts is the goblins' bank"},
      {q:"Who is Credence Barebone?",a:"An Obscurial in Fantastic Beasts — later controversially revealed as Aurelius Dumbledore"},
      {q:"What is wandlore?",a:"Wands choose the wizard — made from wood and a magical core, each combination creates unique properties"},
      {q:"What is the Triwizard Tournament?",a:"A dangerous competition between Hogwarts, Beauxbatons, and Durmstrang — minimum age 17"},
      {q:"What is the difference between Harry's wand and Voldemort's?",a:"Both have cores from the same phoenix (Fawkes) — causing Priori Incantatem when they duel"},
      {q:"What is the significance of the Time-Turner in Prisoner of Azkaban?",a:"Harry and Hermione use it to go back three hours — saving Buckbeak and Sirius Black"},
      {q:"What is Dumbledore's backstory with Grindelwald?",a:"He was once close friends and shared Grindelwald's vision of wizard supremacy — until Ariana's death changed him"},
      {q:"What is the Deathly Hallows symbol?",a:"A triangle (cloak) enclosing a circle (stone) with a line (wand) — also used by Grindelwald as his mark"},
      {q:"What is the significance of Snape's always?",a:"Snape's Patronus was always a doe — the same as Lily Potter's — revealing his lifelong love for her"},
    ],
  },
  breaking_bad:{ label:"Breaking Bad",icon:"\u{1F9EA}",color:"#16A34A",
    200:[
      {q:"What is Walter White's alias?",a:"Heisenberg"},
      {q:"What subject does Walter White teach?",a:"Chemistry"},
      {q:"What color is their signature meth?",a:"Blue"},
      {q:"What disease does Walter have?",a:"Lung cancer (Stage 3A, inoperable)"},
      {q:"What is Jesse's catchphrase?",a:"Yeah, science! / Yeah, bitch!"},
      {q:"What is Walter's wife's name?",a:"Skyler White"},
      {q:"What is the lawyer's name?",a:"Saul Goodman (real name Jimmy McGill)"},
      {q:"Where does Breaking Bad take place?",a:"Albuquerque, New Mexico"},
      {q:"What is Walter's son's name?",a:"Walter White Jr. — goes by Flynn"},
      {q:"What does Walter cook?",a:"Crystal methamphetamine"},
      {q:"What is Hank's job?",a:"DEA agent"},
      {q:"What is Los Pollos Hermanos?",a:"Gus Fring's fried chicken restaurant chain — a front for his drug empire"},
      {q:"Who plays Walter White?",a:"Bryan Cranston"},
      {q:"Who plays Jesse Pinkman?",a:"Aaron Paul"},
      {q:"What car does Walter buy impulsively after first cook?",a:"A Pontiac Aztek — later a Dodge Challenger"},
      {q:"What is the DEA?",a:"Drug Enforcement Administration — the federal agency Hank works for"},
      {q:"What series prequel spinoff is Breaking Bad known for?",a:"Better Call Saul"},
      {q:"Who does Walter ultimately die trying to save?",a:"Jesse Pinkman — he rescues him from neo-Nazis"},
      {q:"Who is Combo?",a:"One of Jesse's friends who is shot while selling meth"},
      {q:"Who is Badger?",a:"Brandon Mayhew — one of Jesse's goofy friends"},
      {q:"What is Walt's business partner before the show?",a:"Elliot Schwartz — co-founder of Gray Matter Technologies"},
      {q:"What does Breaking Bad mean?",a:"A Southern US expression meaning to go wrong or deviate from the straight and narrow"},
      {q:"Who is Andrea Cantillo?",a:"Jesse's girlfriend who is killed by Todd as a message to Jesse"},
      {q:"Who is Skinny Pete?",a:"One of Jesse's friends — a surprisingly skilled pianist"},
      {q:"Where does Walt bury his money?",a:"In the desert, coordinated using lottery ticket GPS coordinates"},
    ],
    400:[
      {q:"Who is Walter's brother-in-law?",a:"Hank Schrader — a DEA agent who unknowingly hunts his own family"},
      {q:"What is Walter's former business worth billions?",a:"Gray Matter Technologies — he sold his share for $5,000"},
      {q:"How does Gus Fring die?",a:"A pipe bomb rigged under Hector Salamanca's wheelchair"},
      {q:"What acid does Walter use to dissolve bodies?",a:"Hydrofluoric acid (HF)"},
      {q:"Who kills Mike Ehrmantraut?",a:"Walter White — in a fit of rage by the river"},
      {q:"What is the fate of Walter White?",a:"He dies from a gunshot wound after rescuing Jesse and exposing the neo-Nazis"},
      {q:"What is the blue meth's purity?",a:"99.1% pure — almost impossibly high quality"},
      {q:"Who is Gustavo Fring?",a:"A powerful drug kingpin hiding behind his Pollos Hermanos restaurant chain"},
      {q:"What is the significance of the fly episode?",a:"Walter becomes obsessed with a fly — symbolising guilt, contamination, and loss of control"},
      {q:"What did Walter do to Jane?",a:"He watched her choke to death without intervening — one of his most damning acts"},
      {q:"What is Walter's final confession to Skyler?",a:"I did it for me. I liked it. I was good at it. And I was really... I was alive"},
      {q:"Who is Lydia Rodarte-Quayle?",a:"A Madrigal Electromotive executive connecting Gus's operation to an international supply chain"},
      {q:"How does Hank die?",a:"He is shot by Jack Welker in the desert after being captured"},
      {q:"Who is the vacuum cleaner man?",a:"Ed Galbraith — a man who creates new identities and helps people disappear"},
      {q:"What is the Vamonos Pest arc?",a:"Walter and Mike use a pest control company as a front — tenting houses as mobile meth labs"},
      {q:"Who is Tio Salamanca?",a:"Hector Salamanca — a wheelchair-bound former cartel boss who communicates by ringing a bell"},
      {q:"What is the poisoning of Brock about?",a:"Walter uses Lily of the Valley to poison Brock — to manipulate Jesse into helping kill Gus"},
      {q:"Who inherits Walter's money at the end?",a:"Walter Jr. receives it through the Schwartz trust — blood money Walter tries to make right"},
      {q:"What happens to Jesse at the end?",a:"He escapes, driving away screaming — his story continues in El Camino"},
      {q:"Who is the neo-Nazi uncle?",a:"Jack Welker"},
      {q:"What is the significance of the White Supremacist gang?",a:"Jack Welker and Todd take over the cook — imprisoning Jesse as their slave cook"},
      {q:"What is the methylamine used for?",a:"The key precursor chemical for Walter's unique blue meth synthesis"},
      {q:"Who is Saul Goodman really?",a:"Jimmy McGill — later runs a Cinnabon in Omaha as Gene Takavic (Better Call Saul)"},
      {q:"What is the Vamonos Pest front?",a:"A pest control company used as cover — they tent houses and cook meth inside"},
      {q:"Why does Walter's cancer return in Season 5?",a:"His cancer progresses again — giving him little time to live and nothing left to lose"},
    ],
    600:[
      {q:"What chemistry makes their meth blue?",a:"Their P2P reductive amination synthesis produces a racemic mixture — the unique route gives it a blue tint"},
      {q:"What is the Heisenberg name reference?",a:"Werner Heisenberg — quantum physicist famous for the Uncertainty Principle, reflecting Walt's unpredictability"},
      {q:"What is El Camino about?",a:"Jesse gets money from a safe, buys a new identity from Ed the disappearer, and moves to Alaska"},
      {q:"What does Walter's hat symbolise?",a:"The porkpie hat symbolises his transformation from mild teacher to criminal kingpin — the Heisenberg identity"},
      {q:"What is the pink teddy bear's significance in Season 2?",a:"It connects to a Wayfarer airline crash — caused by Jane's grief-stricken father — all consequences of Walter's choices"},
      {q:"How does Walter poison Brock?",a:"Using Lily of the Valley berries — after Huell pickpockets Jesse's ricin cigarette; Walter blames Gus"},
      {q:"What is the full arc of Jesse Pinkman?",a:"From small-time meth cook to enslaved cook to free man — a journey of trauma, guilt, and liberation"},
      {q:"What is the Ozymandias episode about?",a:"The fallout of the desert shootout — Hank's death, Walt's empire collapsing, the family's destruction"},
      {q:"What philosophical concept does Breaking Bad illustrate?",a:"The banality of evil — an ordinary man makes rationalised choices that lead to becoming genuinely evil"},
      {q:"What is the neo-Nazi cook vs Walt's cook?",a:"Todd can cook but can't replicate the blue — his meth is inferior, forcing them to keep Jesse alive"},
      {q:"Who is Huell and what is his most famous moment?",a:"Saul's bodyguard — famous for lying sprawled on Walter's money, grinning contentedly"},
      {q:"What is Gus Fring's backstory?",a:"His partner Max was killed by the Salamancas — his entire drug empire was built around revenge against Don Eladio"},
    ],
  },
  game_thrones:{ label:"Game of Thrones",icon:"\u{1F409}",color:"#CA8A04",
    200:[
      {q:"What is House Stark's motto?",a:"Winter is Coming"},
      {q:"Who killed Joffrey?",a:"Olenna Tyrell — she poisoned the wine at the Purple Wedding"},
      {q:"Name Daenerys's three dragons.",a:"Drogon, Rhaegal, and Viserion"},
      {q:"Who sits on the Iron Throne at the end?",a:"Bran Stark (the Broken)"},
      {q:"What is Arya Stark's sword called?",a:"Needle"},
      {q:"What is Jon Snow's real parentage?",a:"He is Aegon Targaryen — son of Rhaegar Targaryen and Lyanna Stark"},
      {q:"Who kills the Night King?",a:"Arya Stark"},
      {q:"What does Valar Morghulis mean?",a:"All men must die (in High Valyrian)"},
      {q:"Who is the Night King?",a:"The leader of the White Walkers — created by the Children of the Forest"},
      {q:"What is the Iron Throne made of?",a:"Swords of defeated enemies — melted and fused with dragon fire"},
      {q:"Who is Ned Stark?",a:"Lord of Winterfell — beheaded in Season 1 after being accused of treason"},
      {q:"What is the Red Wedding?",a:"A massacre at Walder Frey's castle where Robb Stark and allies are slaughtered"},
      {q:"Who is Hodor?",a:"Bran's gentle giant servant — his entire life leads to the tragic moment of Hold the door"},
      {q:"What is Valyrian steel?",a:"An extremely rare sharp metal — one of the only materials that kills White Walkers"},
      {q:"Who is Tyrion Lannister?",a:"Cersei's younger brother — the imp, known for his intelligence and wit"},
      {q:"What is the Wall?",a:"A massive ice barrier in the North protecting the Seven Kingdoms from what lies beyond"},
      {q:"What is Bran Stark's power?",a:"He is a warg and greenseer — able to see past, present, and future events"},
      {q:"Who is Petyr Baelish?",a:"Littlefinger — a cunning political schemer who orchestrated much of the chaos in Westeros"},
      {q:"Who is Jaime Lannister?",a:"The Kingslayer — who killed the Mad King and is conflicted throughout the series"},
      {q:"What is Sansa Stark's arc?",a:"From naive girl to shrewd political operator — she ends as Queen in the North"},
      {q:"Who is Melisandre?",a:"The Red Priestess who serves the Lord of Light — she resurrects Jon Snow"},
      {q:"What is dragonglass?",a:"Obsidian — one of the only materials that kills White Walkers"},
      {q:"Who is Stannis Baratheon?",a:"Robert's brother who claims the Iron Throne — a rigid leader who burns his own daughter"},
      {q:"Who is Ghost?",a:"Jon Snow's albino direwolf"},
      {q:"What is House Lannister's unofficial motto?",a:"A Lannister always pays his debts"},
    ],
    400:[
      {q:"Who betrayed Robb Stark at the Red Wedding?",a:"Roose Bolton and Walder Frey — orchestrated by Tywin Lannister"},
      {q:"What house motto is We Do Not Sow?",a:"House Greyjoy of the Iron Islands"},
      {q:"Who was the Mad King?",a:"Aerys II Targaryen — killed by Jaime Lannister"},
      {q:"What is the origin of the Night King?",a:"A First Man transformed by the Children of the Forest with a dragonglass dagger"},
      {q:"Who is Cersei's children's real father?",a:"Jaime Lannister — her twin brother"},
      {q:"What is the significance of the Battle of the Bastards?",a:"Jon Snow vs Ramsay Bolton — won by the Knights of the Vale arriving at the last moment"},
      {q:"Who is Ramsay Bolton?",a:"The sadistic son of Roose Bolton — he captures and tortures Theon, and rapes Sansa"},
      {q:"What is the Sept of Baelor explosion?",a:"Cersei uses wildfire to destroy her enemies — killing Margaery, the High Sparrow, and many others"},
      {q:"What is the Three-Eyed Raven?",a:"An ancient being who holds all memories of the world — Bran becomes the new one"},
      {q:"Who is Samwell Tarly?",a:"Jon's best friend — discovers dragonglass kills White Walkers and uncovers Jon's true parentage"},
      {q:"What happened to Daenerys in the final season?",a:"She burns King's Landing — Jon kills her, Drogon destroys the Iron Throne"},
      {q:"Who is Euron Greyjoy?",a:"Cersei's pirate-king ally — he commands the Iron Fleet and kills two of Daenerys's dragons"},
      {q:"What is the significance of the Tower of Joy flashback?",a:"Reveals Jon is not Ned's son — he is the son of Rhaegar Targaryen and Lyanna Stark"},
      {q:"What is Varys's role?",a:"The Spider — spymaster who ultimately tries to betray Daenerys to Jon"},
      {q:"Who is Olenna Tyrell?",a:"The Queen of Thorns — matriarch of House Tyrell known for her wit and cunning"},
      {q:"What happens to the Iron Throne?",a:"Drogon melts it after Jon kills Daenerys — it is destroyed"},
      {q:"Who is Theon Greyjoy's arc?",a:"He betrays Robb Stark, is tortured by Ramsay as Reek, then redeems himself at the Battle of Winterfell"},
      {q:"What is the Loot Train Attack?",a:"Daenerys attacks the Lannister forces with Drogon and the Dothraki — they are devastated"},
      {q:"Who is Jorah Mormont?",a:"Daenerys's loyal protector who loves her — he dies protecting her at Winterfell"},
      {q:"What is the Catspaw dagger?",a:"The Valyrian steel dagger Arya uses to kill the Night King"},
      {q:"What are the Faceless Men?",a:"A guild of assassins from Braavos who serve the Many-Faced God — Arya trains with them"},
      {q:"Who is the Iron Bank of Braavos?",a:"The most powerful financial institution in the world — it backed Stannis and later Cersei"},
      {q:"What is the Lord of Light?",a:"R'hllor — the god worshipped by Melisandre and Thoros, associated with fire and resurrection"},
      {q:"What is the Free Folk?",a:"People who live beyond the Wall, also called Wildlings — Jon brings them south of the Wall"},
      {q:"What is House Targaryen's words?",a:"Fire and Blood"},
    ],
    600:[
      {q:"Name all members of Ned Stark's Small Council in Season 1.",a:"Hand: Ned Stark; Coin: Littlefinger; Whisperers: Varys; Grand Maester: Pycelle; Ships: Stannis; Laws: Renly"},
      {q:"What is the Azor Ahai legend?",a:"Azor Ahai forged Lightbringer by plunging it into his wife's heart — linked to the hero defeating the Long Night"},
      {q:"What prophecy haunts Cersei?",a:"The Valonqar: a younger sibling will wrap hands around her pale white throat and choke the life from her"},
      {q:"What is the significance of Daenerys's Targaryen madness?",a:"The show implies madness runs in Targaryen blood — she shows it by burning King's Landing despite them surrendering"},
      {q:"What is the Long Night?",a:"An ancient winter lasting a generation — the first war against the White Walkers thousands of years ago"},
      {q:"Who is Bloodraven?",a:"Brynden Rivers — a bastard of House Targaryen who became a ranger then the Three-Eyed Raven"},
      {q:"What is the Valyrian Doom?",a:"A cataclysmic event that destroyed the Valyrian Freehold — the Targaryens escaped because they had a prophecy"},
      {q:"What is the meaning of Dracarys?",a:"Dragonfire in High Valyrian — the command Daenerys uses to order her dragons to breathe fire"},
      {q:"What is the Faceless Men's true belief?",a:"All gods are faces of the Many-Faced God of Death — and they serve by giving the gift of death"},
      {q:"What is the Prince That Was Promised prophecy?",a:"A hero born of smoke and salt who will save the world — both Jon and Daenerys are possible candidates"},
      {q:"What is the significance of Cersei destroying the Sept?",a:"She eliminates all her political enemies at once — but loses Tommen (her last child) who jumps from a window in grief"},
      {q:"What is the Night King's ultimate goal?",a:"To destroy the Three-Eyed Raven and erase all human memory, then overwhelm the world with his undead army"},
    ],
  },
  friends:{ label:"Friends",icon:"\u2615",color:"#FB923C",
    200:[
      {q:"What is the coffee shop called?",a:"Central Perk"},
      {q:"Who says How you doin?",a:"Joey Tribbiani"},
      {q:"What is Monica's job?",a:"Chef"},
      {q:"What is Phoebe's most famous song?",a:"Smelly Cat"},
      {q:"Who does Monica marry?",a:"Chandler Bing"},
      {q:"How many times has Ross been divorced?",a:"Three (Carol, Emily, Rachel)"},
      {q:"What is Ross and Rachel's daughter's name?",a:"Emma"},
      {q:"What is Ross's job?",a:"Palaeontologist (professor)"},
      {q:"Which city is Friends set in?",a:"New York City (Manhattan)"},
      {q:"What is Phoebe's twin sister's name?",a:"Ursula Buffay"},
      {q:"Who does Rachel work for at the end?",a:"Louis Vuitton in Paris — but she turns it down to stay with Ross"},
      {q:"What is Ross's monkey's name?",a:"Marcel"},
      {q:"What is Joey's famous acting role?",a:"Dr. Drake Ramoray on Days of Our Lives"},
      {q:"Who is Gunther?",a:"The manager of Central Perk who is hopelessly in love with Rachel"},
      {q:"What does Ross say at his wedding to Emily?",a:"Rachel's name"},
      {q:"Who is Janice?",a:"Chandler's ex-girlfriend with a distinctive nasal laugh — famous for OH MY GOD!"},
      {q:"How many seasons does Friends have?",a:"10 seasons (1994-2004)"},
      {q:"What is Phoebe's alter-ego name?",a:"Regina Phalange"},
      {q:"Who was Monica's famous older boyfriend?",a:"Richard Burke"},
      {q:"What is Chandler's job?",a:"Statistical analysis and data reconfiguration"},
      {q:"What is the apartment number across from Monica's?",a:"Apartment 20 (Monica) — the boys live across the hall"},
      {q:"Who is David?",a:"Phoebe's on-off love interest — a scientist who goes to Minsk"},
      {q:"What does Joey eat in almost every scene?",a:"Food"},
      {q:"Who plays Phoebe Buffay?",a:"Lisa Kudrow"},
      {q:"What is Unagi according to Ross?",a:"He claims it's a state of total awareness — it's actually a type of freshwater eel"},
    ],
    400:[
      {q:"What is the famous trivia episode?",a:"The One with the Embryos"},
      {q:"What are the names of Phoebe's triplets?",a:"Frank Jr. Jr., Leslie, and Chandler"},
      {q:"Who does Joey fall in love with later?",a:"Rachel Green — though it doesn't work out"},
      {q:"What happened to Ross's first wife Carol?",a:"She came out as a lesbian while pregnant with Ben"},
      {q:"What is the Holiday Armadillo?",a:"Ross dresses as an armadillo to teach Ben about Hanukkah"},
      {q:"What does WE WERE ON A BREAK mean?",a:"Ross's defence of sleeping with someone during his and Rachel's brief split"},
      {q:"What happens in the Friends finale?",a:"Rachel gives up the Paris job to stay with Ross — the gang leaves the apartment"},
      {q:"Who is Frank Buffay Jr.?",a:"Phoebe's half-brother — she carries triplets for him as a surrogate"},
      {q:"Who is the last character to speak in the series?",a:"Chandler Bing — Should we get some coffee?"},
      {q:"What is the Pivot scene?",a:"Ross shouts PIVOT! while moving a sofa up the stairs — Season 5"},
      {q:"Who does Mike Hannigan end up with?",a:"Phoebe — played by Paul Rudd"},
      {q:"What is Marcel?",a:"Ross's white-headed capuchin monkey from Season 1"},
      {q:"Who plays Gunther?",a:"James Michael Tyler — the show's unofficial seventh friend"},
      {q:"What is the Ugly Naked Guy?",a:"Their unseen neighbor across the way — a recurring gag throughout the show"},
      {q:"Who is Richard Burke?",a:"Monica's older boyfriend (Tom Selleck) — her first real love who eventually asks her to marry him"},
      {q:"What is Smelly Cat?",a:"Phoebe's self-composed song about a sad, smelly cat — later recorded with a professional music video"},
      {q:"Who is Estelle Leonard?",a:"Joey's theatrical agent — a gravelly-voiced woman who rarely gets him good work"},
      {q:"What is the bet in The One with the Embryos?",a:"The guys correctly guess the girls' secrets — Monica and Rachel lose their apartment"},
      {q:"What year did Friends premiere?",a:"1994 — it ran until 2004"},
      {q:"What is the theme song of Friends?",a:"I'll Be There for You by The Rembrandts"},
    ],
    600:[
      {q:"Name all six characters' full names.",a:"Monica Geller, Rachel Green, Phoebe Buffay, Ross Geller, Chandler Bing, Joey Tribbiani"},
      {q:"What is the origin of Monica and Chandler's relationship?",a:"They hooked up in London at Ross's wedding to Emily in Season 4 — Chandler comforted Monica"},
      {q:"What is Phoebe's tragic backstory?",a:"Her mother killed herself and her father abandoned her — she was briefly homeless and lived on the streets"},
      {q:"What are Chandler's parents' careers?",a:"Father (Charles Bing) is a drag queen performer; mother (Nora Tyler Bing) is a romance novelist"},
      {q:"What is the significance of the Season 3 bottle episode?",a:"The One Where No One Is Ready — real-time chaos in Monica's apartment before a charity event"},
      {q:"What is the deeper theme of Friends?",a:"Family you choose — the six friends create a found family that supports each other through every major life event"},
      {q:"What is the correct order of the main Friends relationships?",a:"Ross-Rachel (ongoing), Chandler-Monica (S4-end), Joey-Rachel (brief S9-10), Phoebe-Mike (S9-end)"},
      {q:"What was the show's most expensive episode?",a:"The One in Vegas (Season 5) — filmed on location"},
      {q:"What is the fountain in the opening credits?",a:"Filmed in Burbank, California — not New York City"},
      {q:"What happened to Matt Perry after Friends?",a:"He appeared in Joey and other projects — he passed away in October 2023"},
    ],
  },
  the_office:{ label:"The Office",icon:"\u{1F4CE}",color:"#64748B",
    200:[
      {q:"What company is The Office set at?",a:"Dunder Mifflin Paper Company"},
      {q:"Who is the regional manager?",a:"Michael Scott"},
      {q:"What is Dwight's actual title?",a:"Assistant TO the Regional Manager"},
      {q:"What is Jim's classic prank on Dwight?",a:"Putting Dwight's belongings in Jell-O"},
      {q:"Who does Jim marry?",a:"Pam Beesly"},
      {q:"What is Michael Scott's catchphrase?",a:"That's what she said"},
      {q:"Where is The Office set?",a:"Scranton, Pennsylvania"},
      {q:"Who plays Michael Scott?",a:"Steve Carell"},
      {q:"What is the Dundies?",a:"Michael's annual awards ceremony at Chili's — he gives out made-up awards"},
      {q:"Who is Kevin Malone?",a:"The lovable accountant famous for his chili and love of food"},
      {q:"What does Ryan Howard start as?",a:"A temp — he becomes VP, goes to jail, and ends up back as a temp"},
      {q:"Who is Dwight Schrute?",a:"The intense, loyal Assistant TO the Regional Manager and beet farmer"},
      {q:"What is Dwight's farm called?",a:"Schrute Farms — a beet farm and bed and breakfast"},
      {q:"Who is Toby Flenderson?",a:"The HR representative — Michael's nemesis despite Toby being completely inoffensive"},
      {q:"Who does Dwight end up with?",a:"Angela Martin — they secretly dated for years"},
      {q:"What paper company did Michael start?",a:"The Michael Scott Paper Company"},
      {q:"Who is Creed Bratton?",a:"The quality assurance rep — says bizarre things and has a mysterious criminal past"},
      {q:"What does Pam want to be?",a:"An artist — she eventually becomes an office administrator and later achieves design work"},
      {q:"Who is David Wallace?",a:"The CFO of Dunder Mifflin — frequently baffled by the Scranton branch's chaos"},
      {q:"What is Bears. Beets. Battlestar Galactica?",a:"Jim impersonating Dwight — Dwight calls it identity theft is not a joke"},
    ],
    400:[
      {q:"What is Kevin's famous dish?",a:"Kevin's Famous Chili — he spills the entire pot on the floor"},
      {q:"What holiday does Dwight celebrate?",a:"Belsnickel Day — a Schrute family tradition"},
      {q:"What is Threat Level Midnight?",a:"Michael Scott's self-directed action film starring himself as agent Michael Scarn"},
      {q:"What is Ryan's startup called?",a:"WUPHF.com — a social media platform that sends messages to every device"},
      {q:"What does Andy Bernard do at the end?",a:"He posts a viral a cappella video and becomes a Cornell graduate advisor"},
      {q:"What is Pretzel Day?",a:"A day when a pretzel cart comes to Dunder Mifflin — Michael calls it the best day of the year"},
      {q:"Who is Darryl Philbin?",a:"The warehouse manager who gets closer to the main group and lands a tech company job"},
      {q:"What is Sabre?",a:"A printer company that acquires Dunder Mifflin — led by Jo Bennett (Kathy Bates)"},
      {q:"What is the significance of Casino Night?",a:"Season 2 finale — Jim confesses his love to Pam and kisses her. She says she can't"},
      {q:"Who is Robert California?",a:"A mysterious man who talks his way into becoming CEO of Sabre — played by James Spader"},
      {q:"What is the Finer Things Club?",a:"Pam, Oscar, and Toby — an exclusive book and culture club that excludes Jim"},
      {q:"Who is Karen Filippelli?",a:"Jim's girlfriend during Season 3 — she transfers from the Stamford branch"},
      {q:"What is the significance of Dwight's character arc?",a:"He goes from obsequious assistant to respected manager who finally marries Angela"},
      {q:"Who is Mose Schrute?",a:"Dwight's cousin who lives and works at Schrute Farms — appears with bizarre behaviour"},
      {q:"What is the Merger arc?",a:"Season 3 — Stamford branch merges into Scranton, bringing Jim, Karen, Andy, and others"},
      {q:"Who plays Jim Halpert?",a:"John Krasinski"},
      {q:"What is the Scranton Strangler?",a:"A serial killer in Scranton — Toby sits on the jury and later doubts he helped convict the right man"},
    ],
    600:[
      {q:"Who is the last character to speak in The Office?",a:"Dwight: I feel like all my kids grew up, and then they married each other. It's every parent's dream"},
      {q:"What is the documentary's final impact?",a:"It airs on PBS — Michael returns for Dwight's wedding, Jim and Pam fix their marriage"},
      {q:"What is The Michael Scott Paper Company arc?",a:"Michael, Pam, and Ryan start a rival company — they sell it back to Dunder Mifflin for jobs"},
      {q:"What is the origin of the US Office?",a:"An adaptation of Ricky Gervais and Stephen Merchant's UK version — Greg Daniels adapted it"},
      {q:"What is the mockumentary's meta-commentary?",a:"The documentary crew witnesses extraordinary moments in ordinary lives — their presence changes how people behave"},
      {q:"What happens to Dunder Mifflin at the end?",a:"David Wallace buys it back and runs it successfully — a rare happy ending for the company"},
      {q:"Who designed the opening sequence?",a:"It uses real footage of the actual Scranton, Pennsylvania — creating authenticity for the mockumentary"},
      {q:"What is the commentary on American work culture?",a:"The show satirises corporate bureaucracy, meaningless work, management incompetence, and strange office intimacy"},
    ],
  },
  stranger_things:{ label:"Stranger Things",icon:"\u{1F4A1}",color:"#E11D48",
    200:[
      {q:"What is the alternate dimension called?",a:"The Upside Down"},
      {q:"Who is the main villain in Season 4?",a:"Vecna (Henry Creel / One)"},
      {q:"What game do the boys play?",a:"Dungeons & Dragons"},
      {q:"What is Eleven's main power?",a:"Telekinesis and telepathy"},
      {q:"Who plays Eleven?",a:"Millie Bobby Brown"},
      {q:"Where does Stranger Things take place?",a:"Hawkins, Indiana"},
      {q:"Who goes missing in Season 1?",a:"Will Byers"},
      {q:"What song is associated with Vecna in Season 4?",a:"Running Up That Hill by Kate Bush"},
      {q:"Who is Eleven's best friend?",a:"Mike Wheeler"},
      {q:"What is the Demogorgon?",a:"A predatory creature from the Upside Down"},
      {q:"What does Eleven call Dr. Brenner?",a:"Papa"},
      {q:"Who is Max Mayfield?",a:"A new girl in Hawkins who becomes part of the group"},
      {q:"What is the Mind Flayer?",a:"A massive psychic entity from the Upside Down that hive-minds creatures"},
      {q:"Who is Steve Harrington?",a:"Originally a popular jock who becomes one of the most beloved group members"},
      {q:"What year is Season 1 set in?",a:"1983"},
      {q:"Who is Joyce Byers?",a:"Will's mother — she is the first to believe Will is communicating through the lights"},
      {q:"Who is Jim Hopper?",a:"Chief of Police in Hawkins — later held captive in Russia"},
      {q:"Who is Eddie Munson?",a:"The leader of the Hellfire Club in Season 4 — he dies heroically distracting the bats"},
      {q:"What is the Hellfire Club?",a:"The Dungeons & Dragons club at Hawkins High School — Eddie Munson's group"},
      {q:"Who is Robin Buckley?",a:"Steve's coworker who is gay — she becomes a core member of the group in Season 3"},
    ],
    400:[
      {q:"What facility experimented on Eleven?",a:"Hawkins National Laboratory"},
      {q:"Who is Eleven's Papa?",a:"Dr. Martin Brenner"},
      {q:"What is Scoops Ahoy?",a:"The ice cream shop where Steve and Robin work in Season 3 at Starcourt Mall"},
      {q:"What is the real name of 001?",a:"Henry Creel — who becomes Vecna"},
      {q:"What happens to Hopper?",a:"Thought dead, transported to Russia — rescued by Joyce and Murray in Season 4"},
      {q:"What is the significance of Running Up That Hill in Season 4?",a:"The song anchors Max to reality as Vecna attacks her — it reached #1 in multiple countries after the episode"},
      {q:"What happened in the Rainbow Room?",a:"Young Henry Creel killed all the other test children — Eleven expelled him into the Upside Down"},
      {q:"What is the Kamchatka prison?",a:"The Russian facility where Hopper is held — the Russians are experimenting with the Upside Down"},
      {q:"What is the significance of the Upside Down's time freeze?",a:"It's frozen at 1983 — the moment Eleven first opened the gate — even though years have passed"},
      {q:"What is Max's fate at end of Season 4?",a:"She is in a coma — Vecna almost killed her, El briefly revives her but she remains unconscious"},
      {q:"What is Vecna's plan?",a:"To kill four victims to create four gates and merge the Upside Down with Hawkins permanently"},
      {q:"How does Eddie Munson die?",a:"He sacrifices himself playing guitar to distract the Upside Down bats for the others to complete the mission"},
      {q:"What is the demobat?",a:"Bat-like creatures from the Upside Down — they serve the Mind Flayer and attack in swarms"},
      {q:"What is the significance of Hawkins cracking in Season 4?",a:"Vecna's four gates merge — Hawkins literally cracks and begins merging with the Upside Down"},
      {q:"Who is the American in the Season 3 post-credits Russia scene?",a:"Hopper — whose survival was teased before being confirmed in Season 4"},
    ],
    600:[
      {q:"How does Vecna select his victims?",a:"He targets people with severe trauma and guilt — their pain allows him to create gates into Hawkins"},
      {q:"What is the MKUltra connection?",a:"Hawkins Lab draws on real CIA experiments — conducting psychic research on children during the Cold War"},
      {q:"What is Vecna's full backstory?",a:"Henry Creel killed his family as a child, became Brenner's test subject 001, was exiled to the Upside Down by Eleven"},
      {q:"What is the biological nature of the hive mind?",a:"The Mind Flayer connects all creatures through shared consciousness — they feel what it feels"},
      {q:"What is the significance of the Nina Project?",a:"Brenner's program to restore Eleven's memories using a sensory deprivation tank to reawaken her powers"},
      {q:"What is the full arc of Steve Harrington?",a:"Season 1: bully/jock. Season 2: protector. Seasons 3-4: fan-favourite dad figure who can't move on from Nancy"},
      {q:"What is the deeper metaphor of the Upside Down?",a:"Depression, trauma, and how darkness invades ordinary life — the shadow world represents unseen psychological threats"},
      {q:"What is the significance of Eleven losing her powers?",a:"She loses them at Season 3's end — in S4 she must relive traumatic memories to reawaken them"},
    ],
  },
  disney:{ label:"Disney & Pixar",icon:"\u{1F3F0}",color:"#1D4ED8",
    200:[
      {q:"What is the name of Simba's father?",a:"Mufasa"},
      {q:"What does Hakuna Matata mean?",a:"No worries (in Swahili)"},
      {q:"Who voices Buzz Lightyear?",a:"Tim Allen"},
      {q:"What type of fish is Nemo?",a:"A clownfish"},
      {q:"Who is the villain in The Little Mermaid?",a:"Ursula"},
      {q:"What is the name of Elsa's kingdom?",a:"Arendelle"},
      {q:"Who is the villain in The Lion King?",a:"Scar"},
      {q:"Who is the toy cowboy in Toy Story?",a:"Woody"},
      {q:"Who is Elsa's sister in Frozen?",a:"Anna"},
      {q:"What is the name of Aladdin's genie?",a:"The Genie — voiced by Robin Williams"},
      {q:"What does Pinocchio want more than anything?",a:"To be a real boy"},
      {q:"What is WALL-E's job?",a:"He is a robot that compacts trash on an abandoned Earth"},
      {q:"What does Mulan do in the film?",a:"She disguises herself as a man to take her father's place in the army"},
      {q:"Who is the villain in Frozen?",a:"Hans — Prince of the Southern Isles, revealed in the twist"},
      {q:"What is Coco about?",a:"A boy named Miguel travels to the Land of the Dead on Día de los Muertos"},
      {q:"Who is Joy in Inside Out?",a:"The lead emotion in Riley's head — she desperately wants Riley to be happy"},
      {q:"What is Moana about?",a:"A young Polynesian chief's daughter who sails to return a stolen relic to the goddess Te Fiti"},
      {q:"Who is the villain in Sleeping Beauty?",a:"Maleficent"},
      {q:"What is the story of Up?",a:"An elderly widower flies his house to South America using thousands of balloons"},
      {q:"What animal is Dumbo?",a:"An elephant who can fly using his large ears"},
    ],
    400:[
      {q:"What is WALL-E an acronym for?",a:"Waste Allocation Load Lifter: Earth-Class"},
      {q:"Who is Miguel's real great-great-grandfather in Coco?",a:"Héctor Rivera"},
      {q:"What was Walt Disney's first synchronized sound cartoon?",a:"Steamboat Willie (1928)"},
      {q:"Who is the villain in Mulan?",a:"Shan Yu — leader of the Hun army"},
      {q:"What is Monsters Inc.'s power source?",a:"Children's screams — later switched to laughter"},
      {q:"What is the Pixar A113 Easter egg?",a:"The CalArts classroom number where many Pixar animators studied — appears in almost every Pixar film"},
      {q:"What is the significance of the opening of Up?",a:"A wordless 4-minute montage of Carl and Ellie's life — considered one of the most emotional film sequences ever"},
      {q:"What is the twist villain in Frozen?",a:"Hans — appears to be the love interest but is revealed as the villain"},
      {q:"What is the significance of Toy Story 3?",a:"The toys nearly face destruction in an incinerator — one of Pixar's most emotional moments"},
      {q:"Who voices the Genie in Aladdin?",a:"Robin Williams — his improvisational performance was groundbreaking"},
      {q:"What is Soul (2020) about?",a:"A jazz musician who nearly dies and travels to the Great Before, exploring what makes life worth living"},
      {q:"What is Encanto about?",a:"A Colombian family with magical gifts — except Mirabel — whose magical house is losing power"},
      {q:"Who is Tamatoa in Moana?",a:"A giant narcissistic crab who collects shiny treasures — voiced by Jemaine Clement"},
      {q:"What is the message of The Incredibles?",a:"The danger of suppressing what makes you special — and mediocrity vs excellence"},
      {q:"What is Turning Red about?",a:"Meilin turns into a giant red panda when emotional — a metaphor for puberty and cultural expectations"},
    ],
    600:[
      {q:"What real psychological theory is the basis for Inside Out?",a:"Paul Ekman's theory of basic universal emotions — developed with psychologist Dacher Keltner"},
      {q:"Who originally designed Mickey Mouse?",a:"Ub Iwerks alongside Walt Disney — originally called Mortimer Mouse"},
      {q:"What is the squash and stretch animation principle?",a:"Objects deform when moving to give a sense of weight and flexibility — one of Disney's 12 principles of animation"},
      {q:"What is the Multiplane Camera?",a:"Walt Disney's invention creating depth in 2D animation by placing artwork on multiple planes at different distances"},
      {q:"What is the deeper message of Zootopia?",a:"A metaphor for racism — fear of the other is manufactured and perpetuated for political control"},
      {q:"What is the significance of Bambi's mother's death?",a:"Unprecedented emotional darkness for a 1942 children's film — the off-screen death traumatised generations"},
      {q:"What is the significance of the ending of Toy Story 4?",a:"Woody chooses to stay with Bo Peep rather than return to Bonnie — a bittersweet goodbye to the franchise"},
      {q:"What is the Pixar Theory?",a:"A fan theory that all Pixar films exist in the same universe in chronological order"},
    ],
  },
  lord_rings:{ label:"Lord of the Rings",icon:"\u{1F48D}",color:"#D97706",
    200:[
      {q:"Who destroys the One Ring?",a:"Gollum — he bites it from Frodo and falls into Mount Doom"},
      {q:"Who is the Dark Lord of Mordor?",a:"Sauron"},
      {q:"What is Frodo's elvish blade?",a:"Sting — it glows blue when Orcs are near"},
      {q:"What creature is Gollum?",a:"A Stoor Hobbit originally named Sméagol"},
      {q:"Who is Gandalf's horse?",a:"Shadowfax"},
      {q:"How many members in the Fellowship?",a:"Nine"},
      {q:"What is Aragorn's heritage?",a:"Heir of Isildur — rightful King of Gondor"},
      {q:"Who is Legolas?",a:"An Elf of Mirkwood — an expert archer and member of the Fellowship"},
      {q:"What is the One Ring's famous inscription?",a:"One Ring to rule them all — in the Black Speech of Mordor"},
      {q:"Who is Samwise Gamgee?",a:"Frodo's loyal gardener and closest friend — he carries Frodo up Mount Doom"},
      {q:"What is the Shire?",a:"The peaceful homeland of Hobbits in northwest Middle-earth"},
      {q:"Who is Boromir?",a:"Son of the Steward of Gondor — he tries to take the Ring but dies protecting Merry and Pippin"},
      {q:"Who is Saruman?",a:"The White Wizard who betrays the order and allies with Sauron"},
      {q:"Who is Éowyn?",a:"The shieldmaiden of Rohan who kills the Witch-King — No living man am I!"},
      {q:"What is Rohan?",a:"The kingdom of horse-lords — allied with Gondor, ruled by King Théoden"},
      {q:"Who is Bilbo Baggins?",a:"Frodo's uncle who found the Ring during The Hobbit — he carries it for 60 years"},
      {q:"What is Mirkwood?",a:"The vast forest kingdom of the Elves under King Thranduil"},
      {q:"Who is Treebeard?",a:"The oldest Ent — he leads the Ents to destroy Isengard"},
      {q:"What is the significance of the Grey Havens?",a:"The port where Elves sail to the Undying Lands — where Frodo departs at the end"},
      {q:"Who is Faramir?",a:"Boromir's younger brother — he shows wisdom by not taking the Ring"},
    ],
    400:[
      {q:"Who is Legolas's father?",a:"Thranduil, King of the Woodland Realm of Mirkwood"},
      {q:"How many Ringwraiths are there?",a:"Nine"},
      {q:"What is Gandalf's sword called?",a:"Glamdring (also called the Foe-hammer)"},
      {q:"What are Ents?",a:"Ancient tree shepherds — Treebeard is the oldest living creature in Middle-earth"},
      {q:"What is Anduril?",a:"The sword reforged from the shards of Narsil — Aragorn's weapon"},
      {q:"How many Rings of Power total?",a:"20: 3 for Elves, 7 for Dwarves, 9 for Men, and the One Ring"},
      {q:"What are the Dead Men of Dunharrow?",a:"An army of oathbreakers — Aragorn commands them to fulfill their oath and destroy Sauron's fleet"},
      {q:"What is Shelob?",a:"An ancient giant spider in Cirith Ungol — she stings Frodo, apparently killing him"},
      {q:"What is the Mines of Moria?",a:"An ancient Dwarf realm — now full of Orcs and the Balrog — the Fellowship passes through"},
      {q:"Who is Denethor?",a:"The Steward of Gondor — he goes mad with grief, ordering Faramir to certain death"},
      {q:"What is the Balrog?",a:"An ancient fire demon from the Elder Days — Gandalf fights it on the Bridge of Khazad-dûm"},
      {q:"What is Rivendell?",a:"The Elvish refuge of Elrond — where the Fellowship is formed"},
      {q:"What are the Palantíri?",a:"Seeing stones allowing distant communication — Sauron corrupted Saruman and Denethor through them"},
      {q:"Who is Galadriel?",a:"The Lady of Lothlórien — one of the most powerful Elves, who resists the temptation of the Ring"},
      {q:"What is the significance of Sam carrying Frodo?",a:"At Mount Doom, Frodo can no longer walk — Sam carries him up in one of literature's greatest acts of friendship"},
      {q:"What is the War of the Last Alliance?",a:"Ancient war shown at the start of Fellowship — Elves and Men united, resulting in Isildur cutting off Sauron's finger"},
      {q:"What is the significance of Boromir's death?",a:"He dies protecting Merry and Pippin — My brother... my captain... my king — a powerful redemption"},
    ],
    600:[
      {q:"Who is Tom Bombadil?",a:"A mysterious ancient being in the Old Forest unaffected by the Ring — his nature is never explained"},
      {q:"What language inspired Tolkien's Quenya Elvish?",a:"Finnish (Quenya); Sindarin was inspired by Welsh"},
      {q:"What is the Silmarillion?",a:"Tolkien's mythological history covering the creation of the world through all ages"},
      {q:"Who are the Valar?",a:"God-like beings who shaped Middle-earth — the highest power below Ilúvatar (the creator)"},
      {q:"What is Morgoth?",a:"The first Dark Lord — Sauron was originally his lieutenant. Morgoth was cast into the Void at the end of the First Age"},
      {q:"What is the significance of Isildur keeping the Ring?",a:"Rather than destroying it as Elrond urges, Isildur keeps it — setting in motion 3,000 years of catastrophe"},
      {q:"What is the Akallabêth?",a:"The tale of the downfall of Númenor — a great island kingdom swallowed by the sea after rebelling against the Valar"},
      {q:"What is the significance of Gandalf being a Maia?",a:"He is an angelic being sent to guide and inspire — not dominate. His restrictions explain why he doesn't simply overpower evil"},
      {q:"What is the One Ring's fundamental nature?",a:"It is an extension of Sauron's will — it seeks to return to its master and corrupts its bearers with desire for power"},
    ],
  },
  video_games:{ label:"Video Games",icon:"\u{1F3AE}",color:"#7C3AED",
    200:[
      {q:"What is the best-selling video game of all time?",a:"Minecraft (238+ million copies)"},
      {q:"Who is the main character in Zelda?",a:"Link (not Zelda — she is the princess)"},
      {q:"What year was Super Mario Bros. released?",a:"1985"},
      {q:"Who makes Fortnite?",a:"Epic Games"},
      {q:"What does NPC stand for?",a:"Non-Player Character"},
      {q:"What is Pac-Man's goal?",a:"To eat all the dots while avoiding ghosts"},
      {q:"Who is Sonic's enemy?",a:"Dr. Eggman (Dr. Robotnik)"},
      {q:"What game franchise features Master Chief?",a:"Halo"},
      {q:"What game features the Creeper enemy?",a:"Minecraft"},
      {q:"Who created Super Mario?",a:"Shigeru Miyamoto"},
      {q:"What is a Battle Royale game?",a:"Many players fight until only one remains — popularized by PUBG and Fortnite"},
      {q:"What gaming company makes PlayStation?",a:"Sony"},
      {q:"Who is Kratos?",a:"The protagonist of God of War — a Spartan warrior who kills Greek and Norse gods"},
      {q:"What is a DLC?",a:"Downloadable Content — additional game content sold separately after release"},
      {q:"What is eSports?",a:"Competitive video gaming at a professional level — with tournaments and prize money"},
      {q:"What does GG mean in gaming?",a:"Good Game"},
      {q:"What is a boss fight?",a:"A climactic battle against a powerful enemy — usually at the end of a level"},
      {q:"What is a sandbox game?",a:"A game with an open world letting players create and explore freely — like Minecraft"},
      {q:"Who is Mario's brother?",a:"Luigi"},
      {q:"What does RPG stand for?",a:"Role-Playing Game"},
    ],
    400:[
      {q:"What game features The cake is a lie?",a:"Portal (2007) by Valve"},
      {q:"What is Nathan Drake's franchise?",a:"Uncharted (by Naughty Dog)"},
      {q:"What is the main currency in Zelda?",a:"Rupees"},
      {q:"What is the Konami Code?",a:"Up, Up, Down, Down, Left, Right, Left, Right, B, A"},
      {q:"What is the villain in the Halo series?",a:"The Covenant — and later the Gravemind and Didact"},
      {q:"What is Dark Souls known for?",a:"Punishing difficulty, deliberate stamina-based combat, and minimal hand-holding"},
      {q:"What is The Last of Us about?",a:"Joel escorts immune girl Ellie across post-apocalyptic USA overrun by a fungal zombie pandemic"},
      {q:"What is a speedrun?",a:"Completing a game as fast as possible — often using glitches and optimized routes"},
      {q:"Who created The Legend of Zelda?",a:"Shigeru Miyamoto and Takashi Tezuka — published by Nintendo in 1986"},
      {q:"What is the story of Half-Life?",a:"A physicist at Black Mesa fights aliens and government soldiers after a failed experiment"},
      {q:"What is a roguelike game?",a:"A game with procedurally generated levels and permadeath — like Hades, Spelunky"},
      {q:"What is the significance of Doom (1993)?",a:"It defined the FPS genre and popularised PC gaming — so popular it was used to test hardware performance"},
      {q:"What is the Witcher series about?",a:"Geralt of Rivia — a monster hunter navigating a morally complex medieval fantasy world"},
      {q:"What is God of War (2018) about?",a:"Kratos moves to Norse mythology — he raises his son Atreus while confronting Norse gods and his past"},
      {q:"What is Elden Ring?",a:"A FromSoftware open-world action RPG created with George R.R. Martin — released 2022"},
      {q:"What is Among Us?",a:"A social deduction game where crewmates must find imposters sabotaging their spaceship"},
      {q:"What is the significance of Tetris?",a:"One of the best-selling games ever — its simple block-stacking gameplay is almost universally understood"},
    ],
    600:[
      {q:"What is emergent gameplay?",a:"Gameplay arising organically from player interaction with systems — not scripted, created by player creativity"},
      {q:"Who invented the first commercially successful home console?",a:"Magnavox Odyssey (1972) — designed by Ralph Baer, the Father of Video Games"},
      {q:"What is soulslike?",a:"A subgenre with punishing difficulty and deliberate combat — originated by Demon's Souls (2009) by FromSoftware"},
      {q:"What is ludonarrative dissonance?",a:"The conflict between a game's story and gameplay — e.g. a caring hero who kills thousands in gameplay"},
      {q:"What is the Video Game Crash of 1983?",a:"The collapse of the North American market due to oversaturation — Nintendo revived the industry with the NES"},
      {q:"What is the concept behind Shadow of the Colossus?",a:"You hunt and kill 16 colossi — the game questions whether you are the hero or the villain"},
      {q:"What was the Video Game crash of 1983 caused by?",a:"Market oversaturation, too many low-quality games, and the collapse of consumer trust in home consoles"},
      {q:"What is the narrative innovation of Undertale?",a:"It remembers your choices even if you reset — manipulating game conventions to create meaning and guilt"},
    ],
  },
  fortnite:{ label:"Fortnite",icon:"\u26CF\uFE0F",color:"#2563EB",
    200:[
      {q:"Who develops Fortnite?",a:"Epic Games"},
      {q:"What is Fortnite's last-player-standing mode called?",a:"Battle Royale"},
      {q:"What vehicle do players jump from at the start of a match?",a:"The Battle Bus"},
      {q:"What is the shrinking deadly zone called?",a:"The Storm"},
      {q:"What tool do you use to harvest materials?",a:"A pickaxe (harvesting tool)"},
      {q:"What currency is used to buy many cosmetics and passes?",a:"V-Bucks"},
      {q:"What phrase appears when you win a match?",a:"Victory Royale"},
      {q:"What mode removes building and adds Overshield?",a:"Zero Build"},
      {q:"What van can bring eliminated teammates back?",a:"A Reboot Van"},
      {q:"What animal-shaped supply container is iconic in Fortnite?",a:"A Loot Llama"},
      {q:"What are the three main building materials?",a:"Wood, stone (brick), and metal"},
      {q:"What does POI stand for?",a:"Point of Interest"},
      {q:"What mode lets players build their own islands and game types?",a:"Creative"},
      {q:"What is Fortnite's original PvE mode called?",a:"Save the World"},
      {q:"What color is Legendary rarity loot?",a:"Gold"},
      {q:"What color is Uncommon rarity loot?",a:"Green"},
      {q:"What big blue bottle restores shield?",a:"A Shield Potion"},
      {q:"What simple white healing item restores health over time?",a:"Bandages"},
      {q:"What are the zombie-like enemies in Save the World called?",a:"Husks"},
      {q:"What is the popular nickname of the default blond male character?",a:"Jonesy"},
    ],
    400:[
      {q:"What mode was Fortnite first released as before Battle Royale exploded in popularity?",a:"Save the World"},
      {q:"What is the maximum normal combined total of health and shield?",a:"200"},
      {q:"What does cracked mean in Fortnite slang?",a:"An enemy's shield has been broken"},
      {q:"What does hitting a harvesting weak point do?",a:"It deals bonus damage and gathers materials more efficiently"},
      {q:"What is a Launch Pad mainly used for?",a:"To send players into the air for fast movement and gliding"},
      {q:"What is a Victory Crown?",a:"A crown won by recent winners that can be carried into the next match"},
      {q:"What must you pick up to reboot an eliminated teammate?",a:"Their Reboot Card"},
      {q:"What happens if a teammate's Reboot Card expires?",a:"They can no longer be rebooted"},
      {q:"What does third partying mean?",a:"Attacking players who are already fighting each other"},
      {q:"What does rotating mean in Fortnite?",a:"Moving and repositioning toward the next safe zone or stronger position"},
      {q:"Which building material has the highest durability?",a:"Metal"},
      {q:"What does Overshield do in Zero Build?",a:"It gives players extra regenerating protection"},
      {q:"What is the Battle Pass?",a:"A seasonal progression track filled with unlockable rewards"},
      {q:"What are NPCs in Fortnite?",a:"Non-player characters that can sell items, give quests, or interact with players"},
      {q:"What does UEFN stand for?",a:"Unreal Editor for Fortnite"},
      {q:"What does editing a build piece allow you to do?",a:"Change its shape or openings for movement, defense, or shots"},
      {q:"What advantage does high ground usually give?",a:"Better angles and vertical control in fights"},
      {q:"What is siphon in Fortnite?",a:"Health or shield gained after getting an elimination in certain modes or rulesets"},
      {q:"What does boxed up mean?",a:"A player is enclosed inside structures for protection"},
      {q:"What is a hot drop?",a:"Landing immediately at a crowded, contested location"},
    ],
    600:[
      {q:"What is the Zero Point in Fortnite lore?",a:"A powerful reality-warping energy nexus tied to the island and the multiverse"},
      {q:"Who is Agent Jones?",a:"An Imagined Order agent, often called Jones, who became central to the island's reality storyline"},
      {q:"What organization secretly controlled the island for years?",a:"The Imagined Order"},
      {q:"Who are The Seven?",a:"A group opposing the Imagined Order and trying to break the Loop"},
      {q:"What is the Loop in Fortnite lore?",a:"A repeating, memory-wiping cycle that traps contestants on the island"},
      {q:"What event connected Chapter 1 and Chapter 2?",a:"The Black Hole event (The End)"},
      {q:"What does piece control mean?",a:"Claiming the builds around an opponent to limit their movement and options"},
      {q:"What is tarping in competitive Fortnite?",a:"Building protective tunnels to rotate safely through crowded zones"},
      {q:"What is box fighting?",a:"Close-range fighting centered around small structures, edits, and tight peeks"},
      {q:"What is Storm Surge?",a:"A competitive mechanic that damages players if lobbies are too stacked and teams have dealt too little damage"},
      {q:"What is a right-hand peek?",a:"Using an angle that exposes less of your body because of camera positioning"},
      {q:"What does deadside mean during a rotation?",a:"The quieter side of zone with fewer opponents nearby"},
      {q:"What is a full box?",a:"Completely surrounding a player with your own structures"},
      {q:"What does taking height mean?",a:"Winning vertical control over an opponent in a fight"},
      {q:"Why are edit resets important?",a:"They let you close your build back up after opening it for a shot or peek"},
      {q:"What is a refresh in late-game Fortnite?",a:"An elimination or pickup that gives you extra mats, heals, or loot to keep surviving"},
      {q:"What does phasing through builds mean?",a:"Moving through structures due to momentum, timing, or collision quirks"},
      {q:"What does tunneling mean in endgame?",a:"Chaining protective builds together while moving through zone"},
      {q:"Why is mats management so important in build modes?",a:"Running out of materials removes your main defense and mobility tool"},
      {q:"What is a surge tag?",a:"Damage dealt mainly to help stay above Storm Surge thresholds"},
    ],
  },
  valorant:{ label:"Valorant",icon:"\u{1F3AF}",color:"#FA4454",
    200:[
      {q:"Who develops VALORANT?",a:"Riot Games"},
      {q:"How many players are on each team in a standard match?",a:"5"},
      {q:"What is the bomb-like objective in VALORANT called?",a:"The Spike"},
      {q:"Which side plants the Spike?",a:"Attackers"},
      {q:"Which side tries to defuse the Spike?",a:"Defenders"},
      {q:"What is the in-match currency called?",a:"Credits"},
      {q:"Which agent is best known for healing allies?",a:"Sage"},
      {q:"Which agent uses a recon bow?",a:"Sova"},
      {q:"Which agent uses fire abilities and Curveball flashes?",a:"Phoenix"},
      {q:"Which agent is known for explosives and satchels?",a:"Raze"},
      {q:"What is the iconic sniper rifle called?",a:"The Operator"},
      {q:"Which pistol do all players start with for free?",a:"The Classic"},
      {q:"What is the practice map called?",a:"The Range"},
      {q:"Which agent teleports and uses dark smokes?",a:"Omen"},
      {q:"Which agent uses poison walls and toxic clouds?",a:"Viper"},
      {q:"Which agent places a turret?",a:"Killjoy"},
      {q:"Which map is famous for having three sites?",a:"Haven"},
      {q:"What is the short pre-round buying period called?",a:"The Buy Phase"},
      {q:"What kind of ability do kills and orbs help charge?",a:"Your ultimate"},
      {q:"What is the attackers' main objective besides getting kills?",a:"Plant and detonate the Spike"},
    ],
    400:[
      {q:"What are the four main agent roles in VALORANT?",a:"Duelist, Initiator, Controller, and Sentinel"},
      {q:"Which map has rotating doors and three sites?",a:"Lotus"},
      {q:"Which map features dangerous death drops off the edges?",a:"Abyss"},
      {q:"Which map is set in an underwater city and has no map gimmicks?",a:"Pearl"},
      {q:"Which map starts attackers on both sides of defenders?",a:"Fracture"},
      {q:"Which agent uses a Spycam and tripwires?",a:"Cypher"},
      {q:"Which agent places Nanoswarm grenades and an Alarmbot?",a:"Killjoy"},
      {q:"Which agent calls smokes from a tactical map and has Orbital Strike?",a:"Brimstone"},
      {q:"Which agent can send out an Owl Drone to tag enemies?",a:"Sova"},
      {q:"Which agent flashes with a hawk and sends Seekers on ultimate?",a:"Skye"},
      {q:"Which agent uses teleport anchors called Rendezvous?",a:"Chamber"},
      {q:"Which agent can dismiss after kills and throw Leer eyes?",a:"Reyna"},
      {q:"Which agent's ultimate equips accurate throwing knives?",a:"Jett"},
      {q:"Which agent can resurrect a teammate?",a:"Sage"},
      {q:"What special feature can defenders close on Ascent?",a:"The mechanical doors"},
      {q:"What does an eco round mean?",a:"A round where the team saves credits by buying very little"},
      {q:"What does a full buy mean?",a:"A round where a team buys rifles, armor, and utility"},
      {q:"What is a default plant?",a:"A safe, common Spike plant meant to support flexible post-plant play"},
      {q:"What do the orbs around the map grant when collected?",a:"One ultimate point"},
      {q:"Which agent can suppress enemies with a knife?",a:"KAY/O"},
    ],
    600:[
      {q:"What is an anti-eco round?",a:"A round where the better-equipped team plays safely against opponents on a weak buy"},
      {q:"What is a bonus round?",a:"Keeping cheaper weapons after winning a round instead of immediately rebuying rifles"},
      {q:"What is trade fragging?",a:"Immediately killing the player who killed your teammate"},
      {q:"What is crosshair placement?",a:"Keeping your aim at likely head level and common angles before enemies appear"},
      {q:"What is a wallbang?",a:"Damaging or killing an enemy through a penetrable surface"},
      {q:"What is lurking?",a:"One player quietly taking map control away from the main group or hit"},
      {q:"What is entrying?",a:"Being the first player to take space and contact on a site hit"},
      {q:"What is post-plant play?",a:"The team setup and utility usage after the Spike has been planted"},
      {q:"What is a retake?",a:"Defenders reclaiming a site after the Spike has been planted"},
      {q:"What is defaulting on attack?",a:"Spreading out to gather information and pressure before committing to a site"},
      {q:"What is a contact play?",a:"Approaching or hitting an area with minimal early utility or noise"},
      {q:"What is utility dumping?",a:"Layering multiple abilities quickly to force enemies off positions"},
      {q:"What is the key difference between the Phantom and the Vandal?",a:"The Phantom is quieter and has damage drop-off, while the Vandal can one-tap heads at any range"},
      {q:"What is first-shot accuracy?",a:"How precise a weapon's initial bullet is before spray inaccuracy takes over"},
      {q:"What is an off-angle?",a:"An unusual holding position that punishes standard crosshair placement"},
      {q:"What is a lineup in VALORANT?",a:"A pre-planned ability trajectory, often used for post-plant denial"},
      {q:"What is Radianite in VALORANT lore?",a:"A powerful resource that fuels the world's technology and conflict"},
      {q:"What is a clutch?",a:"Winning a round alone against multiple opponents"},
      {q:"What is a swing in tactical shooter terms?",a:"A committed peek used to take a duel or trade space"},
      {q:"What is a fake in VALORANT?",a:"Selling pressure on one part of the map before quickly attacking somewhere else"},
    ],
  },
  anime:{ label:"Anime",icon:"\u{1F338}",color:"#DB2777",
    200:[
      {q:"Who is the protagonist in Naruto?",a:"Naruto Uzumaki"},
      {q:"What is the name of the pirate crew in One Piece?",a:"The Straw Hat Pirates"},
      {q:"What are the giant beings that eat humans in Attack on Titan?",a:"Titans"},
      {q:"What is Tanjiro's goal in Demon Slayer?",a:"To cure his sister Nezuko who was turned into a demon"},
      {q:"What is the power system in My Hero Academia called?",a:"Quirks"},
      {q:"What does the Death Note do?",a:"Kills anyone whose name is written in it"},
      {q:"Who created Dragon Ball?",a:"Akira Toriyama"},
      {q:"What transformation does Goku first achieve?",a:"Super Saiyan"},
      {q:"What is the mascot Pokémon?",a:"Pikachu — Ash's electric mouse partner"},
      {q:"Who is Spike Spiegel?",a:"The laid-back bounty hunter protagonist of Cowboy Bebop"},
      {q:"Who is Light Yagami?",a:"A genius student who finds the Death Note and becomes the vigilante Kira"},
      {q:"Who is Edward Elric?",a:"A young State Alchemist in Fullmetal Alchemist who lost his arm and leg"},
      {q:"What is Spirited Away about?",a:"A 10-year-old girl enters the spirit world and must work in a bathhouse to rescue her parents"},
      {q:"What is Shonen anime?",a:"Anime aimed at young male audiences — featuring action, friendship, and self-improvement"},
      {q:"Who is All Might?",a:"The Symbol of Peace in My Hero Academia — he passes his Quirk to Izuku"},
      {q:"What is the premise of Death Note?",a:"A high school student uses a notebook that kills anyone whose name is written in it to become Kira"},
      {q:"What is an OVA?",a:"Original Video Animation — anime released directly on video, not broadcast on TV"},
      {q:"Who is Vegeta?",a:"Goku's rival in Dragon Ball Z — prince of the Saiyan race who becomes an ally"},
      {q:"What is Jujutsu Kaisen about?",a:"A student eats a cursed finger and joins a school of sorcerers who fight Cursed Spirits"},
      {q:"What does tsundere mean?",a:"A character who starts cold toward their love interest but gradually becomes warmer"},
    ],
    400:[
      {q:"What is the power system in Hunter x Hunter?",a:"Nen — manipulating life energy in six types: Enhancement, Emission, Transmutation, Manipulation, Conjuration, Specialization"},
      {q:"What did Luffy eat to get his powers?",a:"The Gomu Gomu no Mi Devil Fruit — making his body rubber"},
      {q:"What is the Law of Equivalent Exchange?",a:"To obtain something, something of equal value must be sacrificed — from Fullmetal Alchemist"},
      {q:"What are the Nine Titans in Attack on Titan?",a:"Nine inheritable Titan powers including the Attack, Armored, Colossal, Beast, and Founding Titans"},
      {q:"What is the Sharingan?",a:"A special eye ability of the Uchiha clan — copies techniques, predicts movement, casts genjutsu"},
      {q:"What is Haki in One Piece?",a:"Spiritual energy — three types: Observation, Armament, and Conqueror's Haki"},
      {q:"What is the Rumbling in Attack on Titan?",a:"Eren unleashes millions of Wall Titans to flatten the world outside Paradis Island"},
      {q:"Who is L in Death Note?",a:"The world's greatest detective hired to catch Kira"},
      {q:"What themes does Neon Genesis Evangelion explore?",a:"Loneliness, existentialism, depression, self-worth — Anno's personal psychological struggles"},
      {q:"Who is Gon Freecss?",a:"A cheerful boy who becomes a Hunter to find his legendary father Ging"},
      {q:"What is the One Piece?",a:"The legendary treasure left by the Pirate King — finding it makes you King of the Pirates"},
      {q:"Who is Killua Zoldyck?",a:"Gon's best friend in HxH — a trained assassin from a family of killers who uses electricity"},
      {q:"What is the significance of the Chimera Ant arc in HxH?",a:"The longest and most complex arc — exploring what it means to be human through an ant who develops emotion"},
      {q:"Who is Itachi Uchiha?",a:"He massacred his clan — but was secretly acting on orders to prevent a coup and protect his brother Sasuke"},
      {q:"What is Isekai?",a:"A genre where a character is transported to another world — Re:Zero, Sword Art Online, Slime"},
      {q:"What are Devil Fruits in One Piece?",a:"Grant powers at the cost of the ability to swim — three types: Paramecia, Zoan, and Logia"},
    ],
    600:[
      {q:"What is the Stands system in JoJo's Bizarre Adventure?",a:"Physical manifestations of life energy — named after tarot cards and musicians, each with unique powers"},
      {q:"What themes does Evangelion explore?",a:"Loneliness, existentialism, depression, self-worth — Anno's personal struggles became the show's core"},
      {q:"Who is the author of Berserk?",a:"Kentaro Miura — one of the most influential manga ever for its art quality and mature themes"},
      {q:"What is the Battle Shonen formula?",a:"Young male protagonist with special power who surpasses limits through friendship and willpower"},
      {q:"What is the significance of Satoshi Kon?",a:"A director who made Perfect Blue, Paprika — psychological anime that influenced Christopher Nolan"},
      {q:"What is the Void Century in One Piece?",a:"A 100-year gap in world history that the World Government erased — the truth is the ultimate secret"},
      {q:"What is the significance of Demon Slayer's animation?",a:"Ufotable's visual style — particularly the Hinokami Kagura sequences — set a new standard for anime animation quality"},
      {q:"What is the philosophical significance of Code Geass?",a:"Lelouch uses absolute power (Geass) to liberate the world — culminating in a controversial self-sacrifice"},
    ],
  },
  charades_general:{ label:"Charades: General",icon:"\u{1F3AD}",color:"#F97316",isCharades:true,
    200:[
      {q:"Act out this word!",a:"Swimming"},{q:"Act out this word!",a:"Sleeping"},{q:"Act out this word!",a:"Cooking"},
      {q:"Act out this word!",a:"Flying"},{q:"Act out this word!",a:"Dancing"},{q:"Act out this word!",a:"Brushing teeth"},
      {q:"Act out this word!",a:"Riding a bicycle"},{q:"Act out this word!",a:"Eating spaghetti"},{q:"Act out this word!",a:"Driving a car"},
      {q:"Act out this word!",a:"Taking a selfie"},{q:"Act out this word!",a:"Playing football"},{q:"Act out this word!",a:"Sneezing"},
      {q:"Act out this word!",a:"Reading a book"},{q:"Act out this word!",a:"Lifting weights"},{q:"Act out this word!",a:"Rowing a boat"},
      {q:"Act out this word!",a:"Baking a cake"},{q:"Act out this word!",a:"Playing guitar"},{q:"Act out this word!",a:"Washing dishes"},
      {q:"Act out this word!",a:"Jumping on a trampoline"},{q:"Act out this word!",a:"Painting a wall"},{q:"Act out this word!",a:"Walking a dog"},
      {q:"Act out this word!",a:"Eating ice cream"},{q:"Act out this word!",a:"Typing on a keyboard"},{q:"Act out this word!",a:"Opening a present"},
      {q:"Act out this word!",a:"Climbing a ladder"},{q:"Act out this word!",a:"Taking a shower"},{q:"Act out this word!",a:"Bowling"},
      {q:"Act out this word!",a:"Playing tennis"},{q:"Act out this word!",a:"Skipping rope"},{q:"Act out this word!",a:"Surfing"},
      {q:"Act out this word!",a:"Yoga"},{q:"Act out this word!",a:"Knitting"},{q:"Act out this word!",a:"Vacuuming"},
      {q:"Act out this word!",a:"Rock climbing"},{q:"Act out this word!",a:"Snorkeling"},{q:"Act out this word!",a:"Ice skating"},
      {q:"Act out this word!",a:"Playing drums"},{q:"Act out this word!",a:"Skateboarding"},{q:"Act out this word!",a:"Doing laundry"},
      {q:"Act out this word!",a:"Gardening"},{q:"Act out this word!",a:"Taking a nap"},
    ],
    400:[
      {q:"Act out this phrase!",a:"Getting struck by lightning"},{q:"Act out this word!",a:"Astronaut"},
      {q:"Act out this word!",a:"Volcano erupting"},{q:"Act out this phrase!",a:"Walking on a tightrope"},
      {q:"Act out this word!",a:"Pickpocket"},{q:"Act out this phrase!",a:"Catching a fish"},
      {q:"Act out this phrase!",a:"Building IKEA furniture"},{q:"Act out this phrase!",a:"Being stuck in quicksand"},
      {q:"Act out this phrase!",a:"Getting a brain freeze"},{q:"Act out this phrase!",a:"Being chased by a swarm of bees"},
      {q:"Act out this phrase!",a:"Conducting an orchestra"},{q:"Act out this word!",a:"Sleepwalker"},
      {q:"Act out this phrase!",a:"Teaching a class"},{q:"Act out this phrase!",a:"Defusing a bomb"},
      {q:"Act out this phrase!",a:"Walking on the moon"},{q:"Act out this phrase!",a:"Giving someone CPR"},
      {q:"Act out this word!",a:"Ventriloquist"},{q:"Act out this phrase!",a:"Getting an injection at the doctor"},
      {q:"Act out this phrase!",a:"Pulling a rabbit from a hat"},{q:"Act out this word!",a:"Sommelier"},
      {q:"Act out this phrase!",a:"Being a traffic cop"},{q:"Act out this phrase!",a:"Cutting hair at a salon"},
      {q:"Act out this phrase!",a:"Taking an X-ray"},{q:"Act out this word!",a:"Puppeteer"},
      {q:"Act out this phrase!",a:"Speed dating"},{q:"Act out this phrase!",a:"Parallel parking"},
      {q:"Act out this phrase!",a:"Opening a very stuck jar"},{q:"Act out this word!",a:"Contortionist"},
      {q:"Act out this phrase!",a:"Being a referee at a match"},{q:"Act out this phrase!",a:"Doing a magic trick"},
      {q:"Act out this word!",a:"Paparazzi"},{q:"Act out this word!",a:"Mime"},
      {q:"Act out this phrase!",a:"Auditioning for a show"},{q:"Act out this phrase!",a:"Negotiating in sign language"},
      {q:"Act out this phrase!",a:"Being a flight attendant"},
    ],
    600:[
      {q:"Act out this phrase!",a:"Explaining something to a baby"},{q:"Act out this phrase!",a:"Being in a slow-motion action scene"},
      {q:"Act out this word!",a:"Democracy"},{q:"Act out this phrase!",a:"Landing on the moon"},
      {q:"Act out this word!",a:"Bureaucracy"},{q:"Act out this phrase!",a:"Getting pulled over by the police"},
      {q:"Act out this word!",a:"Overthinking"},{q:"Act out this phrase!",a:"Presenting a TED Talk"},
      {q:"Act out this word!",a:"Procrastination"},{q:"Act out this phrase!",a:"Winning an Oscar"},
      {q:"Act out this phrase!",a:"Negotiating a hostage situation"},{q:"Act out this phrase!",a:"Being in a silent film"},
      {q:"Act out this word!",a:"Existentialism"},{q:"Act out this phrase!",a:"Running late for something very important"},
      {q:"Act out this phrase!",a:"Being interviewed on live TV"},{q:"Act out this word!",a:"Cryptocurrency"},
      {q:"Act out this phrase!",a:"Operating a submarine"},{q:"Act out this phrase!",a:"Being a royal at a public appearance"},
      {q:"Act out this phrase!",a:"Finding out terrible news in a public place"},{q:"Act out this word!",a:"Algorithm"},
      {q:"Act out this phrase!",a:"Trying to stay awake during a very boring lecture"},{q:"Act out this phrase!",a:"Running a marathon with a blister"},
      {q:"Act out this word!",a:"Gaslighting"},{q:"Act out this phrase!",a:"Teaching a toddler a very difficult concept"},
      {q:"Act out this phrase!",a:"Being stuck in a time loop"},{q:"Act out this word!",a:"Impersonation"},
      {q:"Act out this phrase!",a:"Trying to get WiFi signal in a bad spot"},{q:"Act out this phrase!",a:"Being ignored by everyone"},
      {q:"Act out this phrase!",a:"Explaining the internet to your grandparents"},{q:"Act out this phrase!",a:"Making a very important decision"},
    ],
  },
  charades_movies:{ label:"Charades: Movies & TV",icon:"\u{1F3AC}",color:"#A855F7",isCharades:true,
    200:[
      {q:"Act out this movie or TV show!",a:"Titanic"},{q:"Act out this movie or TV show!",a:"Spider-Man"},
      {q:"Act out this movie or TV show!",a:"The Lion King"},{q:"Act out this movie or TV show!",a:"Frozen"},
      {q:"Act out this movie or TV show!",a:"Harry Potter"},{q:"Act out this movie or TV show!",a:"Jurassic Park"},
      {q:"Act out this movie or TV show!",a:"The Avengers"},{q:"Act out this movie or TV show!",a:"Finding Nemo"},
      {q:"Act out this movie or TV show!",a:"Home Alone"},{q:"Act out this movie or TV show!",a:"Batman"},
      {q:"Act out this movie or TV show!",a:"The Simpsons"},{q:"Act out this movie or TV show!",a:"Toy Story"},
      {q:"Act out this movie or TV show!",a:"Friends"},{q:"Act out this movie or TV show!",a:"Game of Thrones"},
      {q:"Act out this movie or TV show!",a:"Star Wars"},{q:"Act out this movie or TV show!",a:"Aladdin"},
      {q:"Act out this movie or TV show!",a:"Beauty and the Beast"},{q:"Act out this movie or TV show!",a:"Shrek"},
      {q:"Act out this movie or TV show!",a:"The Little Mermaid"},{q:"Act out this movie or TV show!",a:"Cinderella"},
      {q:"Act out this movie or TV show!",a:"Moana"},{q:"Act out this movie or TV show!",a:"The Office"},
      {q:"Act out this movie or TV show!",a:"SpongeBob SquarePants"},{q:"Act out this movie or TV show!",a:"Tom and Jerry"},
      {q:"Act out this movie or TV show!",a:"Madagascar"},{q:"Act out this movie or TV show!",a:"Kung Fu Panda"},
      {q:"Act out this movie or TV show!",a:"Ice Age"},{q:"Act out this movie or TV show!",a:"Despicable Me"},
      {q:"Act out this movie or TV show!",a:"The Incredibles"},{q:"Act out this movie or TV show!",a:"Up"},
      {q:"Act out this movie or TV show!",a:"WALL-E"},{q:"Act out this movie or TV show!",a:"Monsters Inc."},
      {q:"Act out this movie or TV show!",a:"Cars"},{q:"Act out this movie or TV show!",a:"Mulan"},
      {q:"Act out this movie or TV show!",a:"Ratatouille"},{q:"Act out this movie or TV show!",a:"Coco"},
      {q:"Act out this movie or TV show!",a:"Brave"},{q:"Act out this movie or TV show!",a:"Lilo and Stitch"},
      {q:"Act out this movie or TV show!",a:"The Jungle Book"},{q:"Act out this movie or TV show!",a:"Scooby-Doo"},
    ],
    400:[
      {q:"Act out this movie or TV show!",a:"Breaking Bad"},{q:"Act out this movie or TV show!",a:"Stranger Things"},
      {q:"Act out this movie or TV show!",a:"The Dark Knight"},{q:"Act out this movie or TV show!",a:"Interstellar"},
      {q:"Act out this movie or TV show!",a:"Prison Break"},{q:"Act out this movie or TV show!",a:"Pirates of the Caribbean"},
      {q:"Act out this movie or TV show!",a:"Mission Impossible"},{q:"Act out this movie or TV show!",a:"Gladiator"},
      {q:"Act out this movie or TV show!",a:"The Walking Dead"},{q:"Act out this movie or TV show!",a:"Peaky Blinders"},
      {q:"Act out this movie or TV show!",a:"Sherlock"},{q:"Act out this movie or TV show!",a:"Inception"},
      {q:"Act out this movie or TV show!",a:"The Mandalorian"},{q:"Act out this movie or TV show!",a:"Black Mirror"},
      {q:"Act out this movie or TV show!",a:"Squid Game"},{q:"Act out this movie or TV show!",a:"Money Heist"},
      {q:"Act out this movie or TV show!",a:"Narcos"},{q:"Act out this movie or TV show!",a:"The Witcher"},
      {q:"Act out this movie or TV show!",a:"Wednesday"},{q:"Act out this movie or TV show!",a:"Ozark"},
      {q:"Act out this movie or TV show!",a:"The Boys"},{q:"Act out this movie or TV show!",a:"House of the Dragon"},
      {q:"Act out this movie or TV show!",a:"The Last of Us"},{q:"Act out this movie or TV show!",a:"Avatar"},
      {q:"Act out this movie or TV show!",a:"The Matrix"},{q:"Act out this movie or TV show!",a:"John Wick"},
      {q:"Act out this movie or TV show!",a:"Top Gun"},{q:"Act out this movie or TV show!",a:"Indiana Jones"},
      {q:"Act out this movie or TV show!",a:"Back to the Future"},{q:"Act out this movie or TV show!",a:"Forrest Gump"},
      {q:"Act out this movie or TV show!",a:"The Godfather"},{q:"Act out this movie or TV show!",a:"Pulp Fiction"},
      {q:"Act out this movie or TV show!",a:"Yellowstone"},{q:"Act out this movie or TV show!",a:"Mindhunter"},
      {q:"Act out this movie or TV show!",a:"Better Call Saul"},
    ],
    600:[
      {q:"Act out this movie or TV show!",a:"Schindler's List"},{q:"Act out this movie or TV show!",a:"No Country for Old Men"},
      {q:"Act out this movie or TV show!",a:"2001: A Space Odyssey"},{q:"Act out this movie or TV show!",a:"Apocalypse Now"},
      {q:"Act out this movie or TV show!",a:"Parasite"},{q:"Act out this movie or TV show!",a:"A Clockwork Orange"},
      {q:"Act out this movie or TV show!",a:"The Shining"},{q:"Act out this movie or TV show!",a:"Blade Runner"},
      {q:"Act out this movie or TV show!",a:"Lawrence of Arabia"},{q:"Act out this movie or TV show!",a:"The Godfather Part II"},
      {q:"Act out this movie or TV show!",a:"Westworld"},{q:"Act out this movie or TV show!",a:"Succession"},
      {q:"Act out this movie or TV show!",a:"The Wire"},{q:"Act out this movie or TV show!",a:"Mad Men"},
      {q:"Act out this movie or TV show!",a:"Twin Peaks"},{q:"Act out this movie or TV show!",a:"The Sopranos"},
      {q:"Act out this movie or TV show!",a:"Dexter"},{q:"Act out this movie or TV show!",a:"Mr. Robot"},
      {q:"Act out this movie or TV show!",a:"True Detective"},{q:"Act out this movie or TV show!",a:"Fargo"},
      {q:"Act out this movie or TV show!",a:"Taxi Driver"},{q:"Act out this movie or TV show!",a:"Citizen Kane"},
      {q:"Act out this movie or TV show!",a:"There Will Be Blood"},{q:"Act out this movie or TV show!",a:"12 Angry Men"},
      {q:"Act out this movie or TV show!",a:"The Silence of the Lambs"},{q:"Act out this movie or TV show!",a:"Fight Club"},
      {q:"Act out this movie or TV show!",a:"Se7en"},{q:"Act out this movie or TV show!",a:"Requiem for a Dream"},
      {q:"Act out this movie or TV show!",a:"Mulholland Drive"},{q:"Act out this movie or TV show!",a:"Roma"},
    ],
  },

  prison_break:{label:"Prison Break",icon:"\u{1F511}",color:"#374151",
  200:[
    {q:"Who is Michael Scofield?",a:"A structural engineer who tattoos prison blueprints on his body to break his brother out"},
    {q:"What prison is Season 1 set in?",a:"Fox River State Penitentiary in Illinois"},
    {q:"Who plays Michael Scofield?",a:"Wentworth Miller"},
    {q:"What is Lincoln accused of?",a:"Assassinating the Vice President's brother"},
    {q:"Who is T-Bag?",a:"Theodore Bagwell — a dangerous, manipulative criminal who forces his way into the escape"},
    {q:"Who is Sucre?",a:"Michael's cellmate and closest ally in the escape"},
    {q:"What conspiracy frames Lincoln?",a:"The Company — a shadowy organisation controlling the US government"},
    {q:"Who is Sara Tancredi?",a:"The prison doctor who falls in love with Michael"},
    {q:"Who plays Lincoln Burrows?",a:"Dominic Purcell"},
    {q:"What is special about Michael's tattoo?",a:"It contains the full blueprints of Fox River hidden in the design"},
  ],
  400:[
    {q:"Who is Agent Mahone?",a:"An FBI agent hunting the escapees — secretly working for The Company"},
    {q:"What is the Company's main goal?",a:"To maintain control over the US government by eliminating anyone who threatens them"},
    {q:"Who is General Jonathan Krantz?",a:"The head of The Company — the primary villain of later seasons"},
    {q:"What is Scylla?",a:"A data card containing dirt on the Company's leaders — the main MacGuffin of Season 3-4"},
    {q:"Who is Gretchen Morgan?",a:"A ruthless Company operative who becomes a recurring villain"},
    {q:"Where is Season 3 set?",a:"Sona prison in Panama — a lawless prison with no guards inside"},
    {q:"What happens to Sara Tancredi in Season 2?",a:"She is apparently beheaded — though this is later retconned and she returns"},
    {q:"What is GATE?",a:"The company that is a front for The Company's operations"},
    {q:"Who is Paul Kellerman?",a:"A Secret Service agent working for the VP who later helps Michael"},
    {q:"What is the significance of the origami crane?",a:"Michael makes origami cranes — a symbol of his meticulous planning"},
  ],
  600:[
    {q:"What is Michael's medical condition?",a:"Low Latent Inhibition — he perceives and processes far more details than normal people"},
    {q:"What is the meaning of Michael's tattoo removal?",a:"In Season 4 he has it removed — symbolising shedding his identity as the planner/rescuer"},
    {q:"Who is Michael's mother?",a:"Christina Rose Scofield — revealed to be alive and working for The Company"},
    {q:"What is the significance of the number 5?",a:"Michael's shoe size is a clue in many of his encoded messages"},
    {q:"What is GATE's connection to the Vice President?",a:"Caroline Reynolds — the VP — is the face of The Company's political control"},
    {q:"How does Michael die?",a:"He sacrifices himself by overloading a generator to destroy the Company's submarine door — dying of a brain tumour"},
    {q:"What is the final season about?",a:"Michael is alive, working for a black ops group called Poseidon — forced to run elaborate heists"},
    {q:"What is the significance of Ithaca?",a:"Michael's code name in the revival — referencing Odysseus's long journey home"},
    {q:"What is the Rule of Silence in Sona?",a:"In Season 3's Sona prison, speaking the wrong thing to the wrong person means death"},
    {q:"Who kills T-Bag at the end?",a:"Michael stabs T-Bag in the heart during the final confrontation"},
  ],
  },
  big_bang_theory:{label:"The Big Bang Theory",icon:"\u{1F52D}",color:"#3B82F6",
  200:[
    {q:"Who are the four main male scientists?",a:"Sheldon Cooper, Leonard Hofstadter, Howard Wolowitz, and Raj Koothrappali"},
    {q:"What is Sheldon's spot on the couch?",a:"The middle seat on the left — it has the optimal sightlines and he never gives it up"},
    {q:"Who plays Sheldon Cooper?",a:"Jim Parsons"},
    {q:"What is Sheldon's catchphrase?",a:"Bazinga! — his way of saying he was joking"},
    {q:"Who is Penny?",a:"The pretty but not academically inclined neighbour who becomes Leonard's girlfriend and wife"},
    {q:"What does Leonard do for work?",a:"He is an experimental physicist at Caltech"},
    {q:"What is Howard's notable distinction?",a:"He is the only one without a PhD — he has a Masters in Engineering"},
    {q:"What is Sheldon's field?",a:"Theoretical physics — specifically string theory and later super-asymmetry"},
    {q:"Who does Howard marry?",a:"Bernadette Rostenkowski"},
    {q:"Who is Amy Farrah Fowler?",a:"A neurobiologist who becomes Sheldon's girlfriend and eventually wife"},
  ],
  400:[
    {q:"What is Sheldon's roommate agreement?",a:"A document outlining all rules and obligations of living with Sheldon — dozens of clauses"},
    {q:"What is the Caltech?",a:"The California Institute of Technology — where the main characters work"},
    {q:"Who is Stuart?",a:"The comic book store owner who becomes close to the group"},
    {q:"What is Sheldon's IQ?",a:"He claims 187 — though the show never officially confirms it"},
    {q:"What Nobel Prize do Sheldon and Amy win?",a:"The Nobel Prize in Physics — for their discovery of super-asymmetry"},
    {q:"Who is Raj's dog?",a:"Cinnamon — a Yorkshire Terrier he treats as his child"},
    {q:"What is Soft Kitty?",a:"A song Sheldon wants sung to him when he is sick — Warm kitty, soft kitty, little ball of fur"},
    {q:"What is Howard's achievement?",a:"He is the only one of the group to go to space — aboard the International Space Station"},
    {q:"What does Raj's selective mutism prevent him from doing?",a:"Talking to women he is not related to — unless he has alcohol (or thinks he does)"},
    {q:"Who is Wil Wheaton in the show?",a:"A recurring version of himself — initially Sheldon's nemesis, later a friend"},
  ],
  600:[
    {q:"What is the significance of the train set in Sheldon's childhood?",a:"It represents the moment Sheldon's innocence was broken — he walked in on his father cheating"},
    {q:"What is Sheldon's relationship with his faith?",a:"His mother is deeply religious; Sheldon is atheist — a recurring tension in the show"},
    {q:"What is the Young Sheldon connection?",a:"A prequel spin-off showing Sheldon's childhood in Texas — it ran 7 seasons"},
    {q:"What is the Big Bang Theory's most-watched episode?",a:"The finale with 23 million viewers — when Sheldon and Amy win the Nobel Prize"},
    {q:"What is the significance of Sheldon's three knocks?",a:"He always knocks three times and says the person's name three times — a childhood anxiety habit"},
    {q:"Who is Bernadette's dynamic with Howard?",a:"She is the dominant partner — highly educated, assertive, and earns more than Howard"},
    {q:"What is the Dungeons and Dragons dynamic in the show?",a:"They play D&D regularly — it becomes a metaphor for their escapism and friendship"},
    {q:"What is the significance of the elevator being broken?",a:"The elevator is out of service for the entire show — finally fixed in the finale, symbolising change"},
    {q:"What scientific concept does Sheldon explain most famously?",a:"He frequently references string theory, Schrödinger's cat, and the theory of everything"},
    {q:"What is Sheldon's relationship with food?",a:"He has specific food days — Thai food on Mondays, pizza on Fridays — any change distresses him"},
  ],
  },
  brooklyn_99:{label:"Brooklyn Nine-Nine",icon:"\u{1F694}",color:"#1D4ED8",
  200:[
    {q:"Who is Jake Peralta?",a:"An immature but gifted NYPD detective who loves Die Hard"},
    {q:"Who is Raymond Holt?",a:"The new precinct captain — stoic, gay, and dedicated to his job"},
    {q:"What is the Nine-Nine?",a:"The 99th precinct of the NYPD in Brooklyn"},
    {q:"Who does Jake eventually marry?",a:"Amy Santiago"},
    {q:"Who plays Jake Peralta?",a:"Andy Samberg"},
    {q:"Who is Gina Linetti?",a:"The precinct's eccentric civilian administrator — she thinks she is the most important person alive"},
    {q:"What is Charles Boyle known for?",a:"Being Jake's overly enthusiastic best friend and an incredible cook"},
    {q:"Who is Rosa Diaz?",a:"A tough, mysterious detective — one of the few who intimidates everyone"},
    {q:"What is Terry Jeffords known for?",a:"His love of yoghurt and his enormous physique — he often refers to himself in the third person"},
    {q:"What is Scully and Hitchcock known for?",a:"Being the laziest, least effective detectives in the precinct"},
  ],
  400:[
    {q:"What is the Halloween Heist?",a:"An annual competition where precinct members try to steal a championship title belt from Holt"},
    {q:"Who is Madeline Wuntch?",a:"Holt's nemesis and rival — they spend the whole show trading insults"},
    {q:"What is Jake's catchphrase?",a:"NINE-NINE! and Cool cool cool cool cool"},
    {q:"Who is Kevin Cozner?",a:"Captain Holt's husband — a classics professor"},
    {q:"What happens to the Nine-Nine in Season 5?",a:"It gets shut down and everyone is reassigned — but it is eventually restored"},
    {q:"Who is the Pontiac Bandit?",a:"Doug Judy — Jake's frenemy who keeps getting away but is also his best friend"},
    {q:"What does Amy love obsessively?",a:"Binders, organisation, school supplies, and winning"},
    {q:"What is the cold open format of the show?",a:"Each episode opens with a cold open joke — usually a quick bit or game in the precinct"},
    {q:"Who is Pimento?",a:"A wildly unstable undercover detective who dates Rosa — played by Jason Mantzoukas"},
    {q:"Who voices Holt?",a:"Andre Braugher — whose deadpan delivery became iconic"},
  ],
  600:[
    {q:"What is the significance of Holt's backstory?",a:"He was openly gay in the NYPD in the 1980s — discriminated against and held back for decades"},
    {q:"What cultural impact did Brooklyn Nine-Nine have?",a:"It was cancelled by Fox then immediately picked up by NBC after a fan campaign — rare TV history"},
    {q:"What is the Vulture?",a:"Major Crime's Keith Pembroke — steals cases from the Nine-Nine right before they close them"},
    {q:"What is Jake and Amy's relationship arc?",a:"They compete fiercely, Jake confesses feelings in Season 1, she rejects him, they get together in Season 3"},
    {q:"What is the significance of the show's tone on police?",a:"Unlike most cop shows, it's rarely about serious police brutality — though later seasons address race and policing"},
    {q:"Who is Nikolaj?",a:"Charles's adopted son from Latvia — a frequent touchstone for Charles's parenting journey"},
    {q:"What is the significance of Die Hard in the show?",a:"Jake believes Die Hard is the greatest film ever made — the show subverts and plays with this obsession constantly"},
    {q:"What is the show's take on Holt's sexuality?",a:"It is matter-of-fact — he is gay, it's part of who he is, not a punchline or focus of drama"},
    {q:"What is the final season about?",a:"After being relocated to witness protection, the Nine-Nine returns — the show ends with Jake and Amy moving to Boston"},
    {q:"Who is the best recurring villain?",a:"Doug Judy (the Pontiac Bandit) — fan favourite who always escapes but remains Jake's friend"},
  ],
  },
  pokemon:{label:"Pok\u00E9mon",icon:"\u26A1",color:"#EAB308",
  200:[
    {q:"What does Pikachu evolve into?",a:"Raichu — using a Thunder Stone"},
    {q:"What are the three starter types?",a:"Fire, Water, and Grass"},
    {q:"Who is Ash's main rival in the original series?",a:"Gary Oak"},
    {q:"What is the Pokédex?",a:"A device that records information about every Pokémon encountered"},
    {q:"What is Mewtwo?",a:"A genetically engineered Pokémon created from Mew's DNA — one of the most powerful Pokémon"},
    {q:"What does Team Rocket want?",a:"To steal rare Pokémon for their boss Giovanni"},
    {q:"Who are the three legendary birds?",a:"Articuno, Zapdos, and Moltres"},
    {q:"What is the move Thunderbolt?",a:"Pikachu's signature special Electric attack"},
    {q:"Who is Professor Oak?",a:"The Pokémon professor who gives trainers their first Pokémon and Pokédex"},
    {q:"What is an evolution stone?",a:"A special stone that triggers evolution in certain Pokémon — e.g. Fire Stone, Water Stone"},
  ],
  400:[
    {q:"What is the difference between a Pokémon's HP and PP?",a:"HP is health points — when 0, Pokémon faints. PP is the number of times a move can be used"},
    {q:"What are the Elite Four?",a:"Four powerful trainers who must be defeated before challenging the Pokémon League Champion"},
    {q:"Who is Lance?",a:"The Dragon-type trainer — Pokémon League Champion in Gold/Silver"},
    {q:"What is a shiny Pokémon?",a:"An extremely rare colour variant with different palette — odds are 1 in 4096"},
    {q:"What is the significance of the GTS?",a:"Global Trade System — allowing players to trade Pokémon with anyone worldwide"},
    {q:"What is Mega Evolution?",a:"A temporary transformation available in X and Y — powerfully enhancing a Pokémon's stats mid-battle"},
    {q:"What is the mythical Pokémon Mew?",a:"A rare Pokémon said to contain the DNA of every Pokémon — source of Mewtwo's creation"},
    {q:"What is a held item?",a:"An object a Pokémon carries into battle — it can boost stats, restore HP, or affect moves"},
    {q:"What is STAB in Pokémon?",a:"Same Type Attack Bonus — a 50% damage boost when a Pokémon uses a move matching its own type"},
    {q:"What is the significance of Eevee?",a:"It can evolve into eight different Pokémon (Eevolutions) depending on conditions or stones used"},
  ],
  600:[
    {q:"What is EV training?",a:"Effort Value training — defeating specific Pokémon to maximise stats through hidden values"},
    {q:"What is the Pokémon lore behind the creation of the universe?",a:"Arceus created the universe; Dialga (time), Palkia (space), and Giratina (antimatter) were born from it"},
    {q:"What is the significance of Red in the games?",a:"The original protagonist — he appears as the final boss in Gold/Silver, representing the hardest challenge"},
    {q:"What is the Nuzlocke Challenge?",a:"A self-imposed ruleset: only catch the first Pokémon per route, and fainted Pokémon are permanently dead"},
    {q:"What is the difference between Legendary and Mythical Pokémon?",a:"Legendaries can be caught in the game; Mythicals are distributed through events only"},
    {q:"What is the Hidden Ability system?",a:"Each Pokémon species has a rare ability not normally obtainable — only through special events or Ability Patches"},
    {q:"What is the deepest lore of Pokémon's origins?",a:"The anime and games hint at a world that was reshaped by Arceus and nearly destroyed by Groudon, Kyogre, and Rayquaza's conflict"},
    {q:"What is IVs in competitive Pokémon?",a:"Individual Values — hidden stats from 0-31 in each stat category, determining a Pokémon's maximum potential"},
    {q:"What is Pokémon GO's significance?",a:"Released 2016 — it became a global phenomenon with augmented reality catching, breaking download records"},
    {q:"What is the Ultra Beast concept?",a:"Extradimensional Pokémon from Ultra Space introduced in Sun/Moon — they behave like invasive organisms"},
  ],
  },
  invincible:{label:"Invincible",icon:"\u{1F9B8}",color:"#7C2D12",
  200:[
    {q:"Who is Mark Grayson?",a:"The son of Omni-Man who becomes the superhero Invincible"},
    {q:"Who is Omni-Man?",a:"Mark's father — the world's most powerful hero who is secretly a Viltrumite conqueror"},
    {q:"What planet are the Viltrumites from?",a:"Viltrum — a planet of superhumans with a conquering empire"},
    {q:"Who is Atom Eve?",a:"A superhero who can manipulate matter at an atomic level — Mark's love interest"},
    {q:"What is Cecil Stedman?",a:"The morally grey head of the Global Defense Agency"},
    {q:"Who is William?",a:"Mark's best friend who is gay and dates Rick Sheridan"},
    {q:"What show is Invincible based on?",a:"The Image Comics series by Robert Kirkman — creator of The Walking Dead"},
    {q:"What is Nolan Grayson's hero name?",a:"Omni-Man"},
    {q:"Who is Amber?",a:"Mark's high school girlfriend who eventually learns his secret"},
    {q:"What makes Invincible's fight scenes distinctive?",a:"They are incredibly brutal and bloody — characters sustain serious, realistic damage"},
  ],
  400:[
    {q:"What is the Viltrumite conquest plan?",a:"Viltrumites embed themselves on planets, weaken them, then bring in the empire — Omni-Man's mission on Earth"},
    {q:"What is Angstrom Levy?",a:"A villain who can travel between dimensions — he absorbs the memories of alternate Marks"},
    {q:"Who is the Immortal?",a:"A resurrectable superhero who keeps dying and coming back — one of the original Guardians"},
    {q:"What is the Sequids?",a:"An alien hive-mind parasitic species that nearly conquers Earth through Rus Livingston"},
    {q:"Who is Robot?",a:"A genius hero who creates a body for himself — secretly manipulative and eventually villainous"},
    {q:"What is the significance of Omni-Man's fight with Mark?",a:"Nolan beats Mark nearly to death before flying away — the show's most harrowing and emotionally complex scene"},
    {q:"Who is Rex Splode?",a:"An explosive-powered hero who dates Atom Eve — later sacrifices himself heroically"},
    {q:"What is the Multi-Paul situation?",a:"Duplicate Man creates thousands of copies of himself who all have distinct lives — they stage a protest"},
    {q:"What is D.A. Sinclair?",a:"A scientist who turns humans into Reanimen — cybernetic zombie soldiers"},
    {q:"Who is Thragg?",a:"The grand regent of Viltrum — the most powerful Viltrumite and primary later villain"},
  ],
  600:[
    {q:"What is the deeper theme of Omni-Man's arc?",a:"Can love for your family override the ideology you were raised with — Nolan ultimately chooses Mark over Viltrum"},
    {q:"What is the significance of Invincible's brutality vs other superhero media?",a:"It deconstructs the idea that heroes emerge from fights unscathed — consequences are visceral and real"},
    {q:"What is the Viltrumite weakness?",a:"A specific sound frequency — and the Scourge Virus that was nearly extinct from their population"},
    {q:"Who is Allen the Alien?",a:"A Champion Evaluation Officer who becomes Mark's ally — eventually one of the most powerful beings in the universe"},
    {q:"What is the Coalition of Planets?",a:"An alliance of worlds fighting the Viltrumite Empire — Allen becomes their leader"},
    {q:"What is the significance of Omni-Man's monologue Think, Mark?",a:"He lists the spans of human civilisations to show their brevity compared to Viltrumite lifespan — chilling and famous"},
    {q:"What is Battle Beast?",a:"An alien warrior who only wants to fight worthy opponents — one of the most terrifying beings in the universe"},
    {q:"What is the Immortal's political arc in later comics?",a:"He runs for President of the United States — symbolising heroes seeking legitimate power"},
    {q:"Who is Conquest?",a:"An old, battle-scarred Viltrumite general sent to replace Omni-Man — nearly kills Mark and Eve"},
    {q:"What is the significance of Robot's arc?",a:"He becomes a global dictator believing he knows best — Invincible must fight his former ally"},
  ],
  },
  the_boys:{label:"The Boys",icon:"\u{1F4A5}",color:"#991B1B",
  200:[
    {q:"Who is Homelander?",a:"The most powerful and most dangerous supe — the leader of The Seven, a psychopathic narcissist"},
    {q:"Who is Billy Butcher?",a:"The leader of The Boys — motivated by his wife's assault by Homelander"},
    {q:"What is Vought International?",a:"The corporation that creates, manages, and monetises superheroes"},
    {q:"What is Compound V?",a:"The chemical compound that gives people superpowers — secretly administered to babies"},
    {q:"Who is Starlight?",a:"Annie January — a genuine hero who joins The Seven and eventually fights against Vought"},
    {q:"Who plays Homelander?",a:"Antony Starr"},
    {q:"What is The Deep's power?",a:"He can breathe underwater and communicate with sea creatures"},
    {q:"Who is Hughie Campbell?",a:"A regular guy who joins The Boys after his girlfriend is accidentally killed by A-Train"},
    {q:"Who is Black Noir?",a:"A silent, masked member of The Seven — later revealed to be a clone of Homelander"},
    {q:"What does A-Train do to Robin?",a:"He runs through her at full speed — killing her instantly"},
  ],
  400:[
    {q:"What is the V24 compound?",a:"A temporary version of Compound V that gives regular people powers for 24 hours — used by The Boys"},
    {q:"Who is Soldier Boy?",a:"The original superhero of the golden age — Homelander's genetic father — played by Jensen Ackles"},
    {q:"What is the significance of Homelander and Maeve's relationship?",a:"They were a couple — Maeve knows his darkest secrets and eventually helps bring him down"},
    {q:"Who is Stan Edgar?",a:"The cold, calculating CEO of Vought — the only person Homelander fears"},
    {q:"What is The Seven?",a:"Vought's premier superhero team — analogous to the Justice League — mostly corrupt"},
    {q:"What is Temp V?",a:"V24 — a short-acting version of Compound V used by Butcher and Hughie to fight supes"},
    {q:"What is the significance of Noir's face?",a:"He hides horrific burns and scars — in Season 3 it's revealed he is a Homelander clone"},
    {q:"Who is Sister Sage?",a:"The smartest person on Earth — introduced in Season 4 as Homelander's new strategist"},
    {q:"What is Firecracker?",a:"A Infowars-style supe influencer who becomes Homelander's devoted follower in Season 4"},
    {q:"What is the Boys' main weapon against supes?",a:"Compound V antidote and finding leverage — they rarely win in direct combat"},
  ],
  600:[
    {q:"What is the satire target of The Boys?",a:"Corporate superhero culture, American exceptionalism, celebrity worship, and unchecked power"},
    {q:"Who is Stormfront?",a:"A Nazi from WWII kept young by Compound V — Homelander's manipulative love interest in S2"},
    {q:"What is the significance of Homelander's origin?",a:"He was raised in a Vought lab with no human contact — explaining his psychological damage and need for approval"},
    {q:"What is the real meaning of Translucent's death?",a:"Hughie kills him — a nobody killing a powerful supe — establishing that The Boys can fight back"},
    {q:"What is the Supe Terrorist arc?",a:"Vought manufactures supe villains to keep demand for their heroes high — staged terrorism for profit"},
    {q:"What is Queen Maeve's arc?",a:"From genuine hero to jaded cynic to redemptive sacrifice — she fakes her death after destroying Soldier Boy"},
    {q:"What does The Boys say about media and perception?",a:"Vought controls narrative completely — heroes are products, and public perception is more important than reality"},
    {q:"Who is Grace Mallory?",a:"A former CIA operative who founded The Boys — she has history with Butcher and Soldier Boy"},
    {q:"What is the significance of A-Train's arc?",a:"A Black superhero who ignores racial justice to maintain his status — eventually forced to confront his complicity"},
    {q:"What is Ryan Butcher's significance?",a:"Homelander and Becca's son — he has his father's powers. His choices will define the show's endgame"},
  ],
  },
  the_flash:{label:"The Flash",icon:"\u26A1",color:"#DC2626",
  200:[
    {q:"Who is Barry Allen?",a:"A forensic scientist who gains super-speed after being struck by lightning during a particle accelerator explosion"},
    {q:"What is STAR Labs?",a:"The scientific facility where Barry's team helps him fight metahumans"},
    {q:"Who is Iris West?",a:"Barry's love interest and eventual wife — a journalist"},
    {q:"What is the Speed Force?",a:"The energy dimension that powers all speedsters"},
    {q:"Who is the Reverse Flash?",a:"Eobard Thawne — a future villain who killed Barry's mother"},
    {q:"Who plays Barry Allen?",a:"Grant Gustin"},
    {q:"Who is Cisco Ramon?",a:"A STAR Labs engineer who names the metahumans — later revealed to be the meta Vibe"},
    {q:"Who is Caitlin Snow?",a:"A STAR Labs scientist who eventually develops cold powers and becomes Killer Frost"},
    {q:"What city does Barry protect?",a:"Central City"},
    {q:"Who is Harrison Wells?",a:"The identity used by Reverse Flash while secretly mentoring Barry"},
  ],
  400:[
    {q:"What is Flashpoint?",a:"Barry travels back in time to save his mother — creating an alternate timeline with catastrophic consequences"},
    {q:"Who is Zoom?",a:"Hunter Zolomon — a serial killer from Earth-2 who steals Barry's speed"},
    {q:"What is the Multiverse in The Flash?",a:"Multiple parallel Earths — the show heavily uses Earth-2 and other Earths from the beginning"},
    {q:"Who is Savitar?",a:"A time remnant of Barry Allen who becomes evil after being rejected by his team"},
    {q:"What is the significance of the newspaper headline?",a:"A future newspaper predicts the Flash vanishes in a crisis — a recurring plot thread"},
    {q:"Who is Kid Flash?",a:"Wally West — Iris's brother who gains speed powers and becomes Barry's partner"},
    {q:"What is the Crisis on Infinite Earths crossover?",a:"A massive Arrowverse event where Barry apparently sacrifices himself — but survives with a new power level"},
    {q:"Who is Godspeed?",a:"August Heart — a villain speedster who appears in later seasons"},
    {q:"What is the significance of Barry's ring?",a:"The ring contains his compressed Flash suit — a nod to the comics"},
    {q:"Who is Joe West?",a:"Barry's adoptive father and police detective — the emotional anchor of the show"},
  ],
  600:[
    {q:"What is the paradox of Reverse Flash?",a:"Thawne's hatred of Barry creates Barry's motivation to become the Flash — a temporal loop with no beginning"},
    {q:"What is the Black Flash?",a:"The embodiment of death for speedsters — it hunts aberrant speedsters"},
    {q:"What is the Speed Force prison?",a:"A prison made of Speed Force energy — Jay Garrick was trapped there for decades"},
    {q:"What is the significance of Barry dying in the comics Crisis?",a:"In the 1985 comic he runs himself to death destroying the Anti-Monitor's weapon — the definitive hero sacrifice"},
    {q:"What is Negative Speed Force?",a:"An anti-Speed Force created by Thawne — the source of the Negative Reverse Flash's red lightning"},
    {q:"What is the significance of the tachyon device?",a:"It allows Barry to temporarily achieve speeds beyond his normal limits — used to fight Zoom"},
    {q:"Who is the Spectre and what is Barry's role?",a:"In Crisis, Ollie Queen becomes the Spectre — Barry becomes the Paragon of Love"},
    {q:"What is the stillness of the future?",a:"A concept in later seasons — the moment where all speed stops, revealing a fundamental truth about the Speed Force"},
    {q:"What makes The Flash unique in the Arrowverse?",a:"It introduced the Multiverse concept to the Arrowverse — and its tone is the lightest and most optimistic"},
    {q:"Who is the original Flash Jay Garrick?",a:"The Golden Age Flash from Earth-3 — he becomes a mentor to Barry"},
  ],
  },
  the_walking_dead:{label:"The Walking Dead",icon:"\u{1F9DF}",color:"#78716C",
  200:[
    {q:"What are the zombies called in TWD?",a:"Walkers"},
    {q:"Who is Rick Grimes?",a:"A sheriff's deputy who wakes from a coma into the zombie apocalypse"},
    {q:"Who is Daryl Dixon?",a:"A crossbow-wielding survivor who becomes one of the most beloved characters"},
    {q:"What does TWD stand for?",a:"The Walking Dead"},
    {q:"Where does Season 1 begin?",a:"Atlanta, Georgia"},
    {q:"Who is Negan?",a:"The charismatic, brutal leader of the Saviours — he wields a barbed wire baseball bat"},
    {q:"What is Negan's bat called?",a:"Lucille — named after his late wife"},
    {q:"Who is Carol?",a:"A quiet abuse survivor who becomes one of the most capable and ruthless survivors"},
    {q:"Who is the Governor?",a:"The leader of Woodbury — a charming but sadistic antagonist in Seasons 3-4"},
    {q:"What is the prison?",a:"The survivor group's fortified base in Seasons 3-4"},
  ],
  400:[
    {q:"Who does Negan kill in the Season 7 premiere?",a:"Glenn and Abraham — with Lucille after a brutal lineup"},
    {q:"What is the Saviours' system?",a:"Negan's group demands half of all supplies from communities as tribute"},
    {q:"Who is Maggie?",a:"Glenn's wife — she leads the Hilltop community"},
    {q:"What is the significance of We Are The Walking Dead?",a:"Rick says it in the comics — meaning the survivors themselves are as dangerous as the walkers"},
    {q:"What is Alexandria?",a:"A walled community in Virginia that becomes the survivors' longest-lasting home"},
    {q:"Who is Michonne?",a:"A katana-wielding survivor — she becomes a leader and Rick's partner"},
    {q:"Who is Carl Grimes?",a:"Rick's son — his death in Season 8 devastated fans and changed the show's direction"},
    {q:"What is the Whisperers?",a:"A group that wears walker skin to move among the dead — led by Alpha"},
    {q:"Who is Alpha?",a:"The leader of the Whisperers — she murders 10 characters and puts their heads on pikes"},
    {q:"Who is Hershel?",a:"A farmer with strong morals — Rick's moral compass in Seasons 2-4"},
  ],
  600:[
    {q:"What is the deeper theme of TWD?",a:"The real monsters are other humans — the walkers are merely the backdrop for human cruelty and survival"},
    {q:"What is the significance of Rick's disappearance?",a:"He is taken by a CRM helicopter in Season 9 — leading to the Rick Grimes film trilogy"},
    {q:"What is the Commonwealth?",a:"A massive, class-stratified community of thousands in Season 11 — the final major antagonist group"},
    {q:"What is the connection between TWD and its spinoffs?",a:"Fear the Walking Dead, The Walking Dead: World Beyond, Daryl Dixon, Dead City, and The Ones Who Live"},
    {q:"What is Eugene's lie?",a:"He claims to know the cure for the zombie virus — he is lying, but the group follows him to Washington DC"},
    {q:"What is the significance of the tiger Shiva?",a:"Ezekiel's tiger who dies saving Carl — symbolising the loss of the Kingdom's hope"},
    {q:"What is the deeper meaning of the walker mythology?",a:"Walkers are created because everyone is already infected — the virus activates upon death regardless of bite"},
    {q:"Who is Beta?",a:"Alpha's second-in-command — a massive, silent enforcer revealed to be a famous country singer"},
    {q:"What is the significance of Merle Dixon?",a:"Daryl's abusive brother — his death is the moment Daryl truly commits to Rick's group"},
    {q:"What is the Terminus cannibal storyline?",a:"Terminus lures survivors with a fake sanctuary message — the residents are cannibals"},
  ],
  },
  solo_leveling:{label:"Solo Leveling",icon:"\u2694\uFE0F",color:"#6D28D9",
  200:[
    {q:"Who is Sung Jin-Woo?",a:"The weakest E-rank hunter who is reborn as the world's only player — able to level up endlessly"},
    {q:"What is a Hunter in Solo Leveling?",a:"A person who can enter magical dungeons called Gates to fight monsters"},
    {q:"What are Gates?",a:"Dimensional rifts that appear worldwide — hunters must clear them or monsters escape and destroy cities"},
    {q:"What is the Double Dungeon?",a:"The dangerous hidden dungeon where Jin-Woo dies and is reborn as a Player"},
    {q:"Who is Cha Hae-In?",a:"The top S-rank hunter of Korea who later becomes Jin-Woo's love interest"},
    {q:"What rank is Jin-Woo at the start?",a:"E-rank — the absolute weakest level of hunter"},
    {q:"What system does Jin-Woo receive?",a:"The System — a game-like interface that gives him quests and lets him level up his stats"},
    {q:"What are Shadow Soldiers?",a:"Jin-Woo's army of reanimated monster and human corpses under his command"},
    {q:"Who is Igris?",a:"Jin-Woo's first and most loyal shadow soldier — a powerful knight"},
    {q:"What is the webtoon based on?",a:"A Korean web novel by Chugong — adapted into a webtoon, then an anime"},
  ],
  400:[
    {q:"Who is the Monarch of Shadows?",a:"The true form Jin-Woo inherits — one of the most powerful beings in existence"},
    {q:"What is the Rulers vs Monarchs war?",a:"An ancient cosmic conflict between Rulers (angels of light) and Monarchs (kings of darkness)"},
    {q:"Who is the Ant King?",a:"The most powerful monster Jin-Woo defeats — he almost kills Jin-Woo but is ultimately defeated and revived as a shadow"},
    {q:"What is the Jeju Island raid?",a:"A national crisis where Korea's top hunters fail to clear a high-level dungeon — Jin-Woo saves the mission"},
    {q:"Who is Sung Il-Hwan?",a:"Jin-Woo's father — a missing hunter who was actually fighting on another world against monsters"},
    {q:"What is a Double Dungeon?",a:"A trap dungeon hidden inside a regular dungeon — extremely rare and deadly"},
    {q:"What is the Player system's final purpose?",a:"The Absolute Being created it to forge a weapon powerful enough to defeat the Monarchs"},
    {q:"Who is Beru?",a:"The Ant King shadow soldier — becomes one of Jin-Woo's most powerful generals, speaks in old Korean"},
    {q:"What is the S-rank gate that changed Korea?",a:"The Jeju Island A-rank gate that upgraded — the ants from it nearly destroyed Korea"},
    {q:"Who is Go Gun-Hee?",a:"The chairman of the Korean Hunter Association — he recognises Jin-Woo's potential early on"},
  ],
  600:[
    {q:"What is the Absolute Being?",a:"The creator of the System — a god-like entity who manipulated both Rulers and Monarchs"},
    {q:"What is the true nature of Jin-Woo's power?",a:"He is the vessel chosen to inherit the Shadow Monarch's power — Ashborn's successor"},
    {q:"What is the significance of Jin-Woo resetting time?",a:"After winning the final battle, Jin-Woo uses a stone to travel back 10 years — to prevent all suffering"},
    {q:"What is Ashborn?",a:"The Shadow Monarch — a Ruler who defected and became a Monarch, creating the shadow army system"},
    {q:"What is the cosmic significance of the Player System?",a:"The Absolute Being created Jin-Woo specifically as a weapon to end the Ruler-Monarch war permanently"},
    {q:"What are S-rank hunters?",a:"The top tier of hunters — there are only a handful per country. Jin-Woo eventually surpasses all of them"},
    {q:"What is the significance of Sung Jin-Woo's title National Level Hunter?",a:"He is classified beyond national — as a threat or asset equivalent to a nation-state's military"},
    {q:"What is the International Guild Conference?",a:"A gathering showing that Jin-Woo's power is now a global political issue — every major nation wants him"},
    {q:"Who is Thomas Andre?",a:"The strongest American hunter — a National Level hunter who fights Jin-Woo and loses conclusively"},
    {q:"What is the final enemy in Solo Leveling?",a:"The Monarchs collectively invade Earth — Jin-Woo fights all of them"},
  ],
  },
  suits:{label:"Suits",icon:"\u2696\uFE0F",color:"#1E3A5F",
  200:[
    {q:"Who is Harvey Specter?",a:"New York's best closer — a slick, brilliant senior partner at Pearson Hardman"},
    {q:"Who is Mike Ross?",a:"A brilliant college dropout with a photographic memory who pretends to be a Harvard Law grad"},
    {q:"What is Mike's secret?",a:"He never attended Harvard or passed the bar — he is a fraud practising law illegally"},
    {q:"Who is Donna Paulsen?",a:"Harvey's fiercely loyal and intuitive legal secretary"},
    {q:"Who is Louis Litt?",a:"A neurotic but brilliant senior partner — Harvey's rival and frenemy"},
    {q:"What law firm is the show set at?",a:"Pearson Hardman (later Pearson Specter Litt)"},
    {q:"Who is Jessica Pearson?",a:"The managing partner — a powerful, calculating lawyer who runs the firm"},
    {q:"What city is Suits set in?",a:"New York City"},
    {q:"Who plays Harvey Specter?",a:"Gabriel Macht"},
    {q:"Who is Rachel Zane?",a:"A paralegal who wants to be a lawyer — Mike's love interest and eventually wife"},
  ],
  400:[
    {q:"What is the central legal tension of Suits?",a:"Harvey and Jessica know Mike is a fraud — they constantly manage the risk of exposure"},
    {q:"Who is Daniel Hardman?",a:"The firm's co-founder who was pushed out for embezzlement — he returns to reclaim control"},
    {q:"What is Mike's photographic memory called in the show?",a:"Just a photographic memory — he can recall anything he has read perfectly"},
    {q:"Who is Katrina Bennett?",a:"Louis's protégé — she becomes a skilled associate and eventually partner"},
    {q:"What is the significance of Harvey's therapy arc?",a:"He goes to Dr. Agard to deal with abandonment issues — his emotional walls slowly come down"},
    {q:"Who is Robert Zane?",a:"Rachel's father — a rival name partner at a competing firm who eventually joins Pearson Specter Litt"},
    {q:"What happens when Mike's fraud is exposed?",a:"He goes to prison in Season 5 — he pleads guilty to protect everyone at the firm"},
    {q:"What is the Specter Litt Wheeler Williams firm?",a:"The firm after Jessica leaves and the partners change — the final iteration of the main firm"},
    {q:"Who is Samantha Wheeler?",a:"A tough, ruthless female name partner who joins the firm after Jessica leaves"},
    {q:"What is Alex Williams?",a:"A partner Harvey recruits from a rival firm — a skilled deal-maker who becomes a key character"},
  ],
  600:[
    {q:"What is the deeper theme of Suits?",a:"Loyalty vs self-interest — every character faces moments where protecting others conflicts with their own survival"},
    {q:"What is the significance of the Harvard mythology in the show?",a:"Harvard Law is treated as the ultimate qualifier — Mike's lack of it represents how credentials can overshadow talent"},
    {q:"What happens to Harvey and Donna?",a:"They finally get together in the final season — confirming what fans waited years for"},
    {q:"What is the Canadian spinoff?",a:"Suits: Harvey returns to help a Toronto firm — a brief continuation exploring new territory"},
    {q:"What is the legal resolution of Mike's fraud?",a:"After prison, he gets his GED and eventually passes the bar — legitimately becoming a lawyer"},
    {q:"Who is Sheila Sazs?",a:"Louis's on-off girlfriend who works at Harvard — the relationship is a running comedic thread"},
    {q:"What is the CM&A firm?",a:"Rand Kaldor Cahill — a rival firm that repeatedly tries to poach and destroy Pearson Specter Litt"},
    {q:"What is the significance of Gretchen?",a:"Louis's secretary after Norma retires — she is protective and surprisingly intimidating"},
    {q:"What is the Season 7 conflict?",a:"Harvey and Louis fight for control of the firm while managing Robert Zane's entry and Donna's new role as COO"},
    {q:"Who is Benjamin?",a:"The firm's IT specialist and tech genius — Louis recruits him for a side business in tech"},
  ],
  },
  dexter:{label:"Dexter",icon:"\u{1F52A}",color:"#7F1D1D",
  200:[
    {q:"Who is Dexter Morgan?",a:"A blood spatter analyst for Miami Metro Police who is secretly a serial killer — he only kills killers"},
    {q:"What is the Dark Passenger?",a:"Dexter's term for his compulsion to kill"},
    {q:"Who is Dexter's sister?",a:"Debra Morgan — a foul-mouthed but dedicated detective"},
    {q:"Who is the Ice Truck Killer?",a:"Brian Moser — revealed to be Dexter's biological brother"},
    {q:"What city is Dexter set in?",a:"Miami, Florida"},
    {q:"Who is Harry Morgan?",a:"Dexter's adoptive father who taught him the Code — a set of rules for killing only killers"},
    {q:"What is the Code of Harry?",a:"Only kill people who deserve it and who have slipped through the justice system — and never get caught"},
    {q:"Who is Trinity Killer?",a:"Arthur Mitchell — a family man who is secretly a meticulous serial killer — played by John Lithgow"},
    {q:"Who does Dexter marry?",a:"Rita Bennett — a sweet, fragile woman who is murdered by the Trinity Killer"},
    {q:"Who plays Dexter Morgan?",a:"Michael C. Hall"},
  ],
  400:[
    {q:"What is the significance of Dexter's kill room?",a:"He wraps victims in plastic wrap on a kill table, forces them to confront their crimes, then kills and disposes of them"},
    {q:"Who is Lumen Pierce?",a:"A trauma survivor who becomes Dexter's partner in killing her abusers — Season 5"},
    {q:"What is LaGuerta's arc?",a:"She becomes suspicious that Dexter is the Bay Harbour Butcher — she is killed by Debra to protect him"},
    {q:"Who is the Doomsday Killer?",a:"Professor James Gellar and Travis Marshall — religious fanatics recreating apocalyptic tableaus — Season 6"},
    {q:"What is the Debra-Dexter dynamic in later seasons?",a:"Debra discovers Dexter is a serial killer — she chooses to protect him, which destroys her morally"},
    {q:"Who is Rudy Cooper?",a:"Brian Moser — the Ice Truck Killer — Dexter's biological brother whom Dexter ultimately kills"},
    {q:"What is the Season 4 ending?",a:"Trinity kills Rita — Dexter finds Harrison in a pool of blood, mirroring his own childhood trauma"},
    {q:"Who is Detective Quinn?",a:"A morally flexible detective who becomes suspicious of Dexter but is never able to prove anything"},
    {q:"What is Dexter: New Blood?",a:"A 2021 revival set in a small New York town where Dexter has been hiding as Jim Lindsay"},
    {q:"What is the significance of Doakes?",a:"Sergeant Doakes always suspected Dexter — he is framed as the Bay Harbour Butcher and killed"},
  ],
  600:[
    {q:"What is the psychological complexity of the Code?",a:"Dexter channels his psychopathic urges into a moral framework — but the show questions whether this makes him heroic or just a more selective monster"},
    {q:"What is the final fate of Dexter in the original series?",a:"He fakes his death and becomes a lumberjack in Oregon — one of TV's most controversial finales"},
    {q:"What is the significance of Harrison in New Blood?",a:"Dexter's son inherited the Dark Passenger — forcing Dexter to confront what he has passed on"},
    {q:"Who kills Dexter in New Blood?",a:"Harrison — his own son shoots him after Dexter kills Kurt Caldwell and confesses everything"},
    {q:"What is the Bay Harbour Butcher case?",a:"The FBI investigation into a series of dumped bodies in the bay — they are Dexter's victims"},
    {q:"What is the deeper parallel between Dexter and Harry?",a:"Harry trained Dexter to be a weapon against evil — but Harry killed himself when he saw what he had created"},
    {q:"What is the significance of the plastic wrap and kill table?",a:"It is a ritual — precise, controlled, and intimate. It allows Dexter to feel connected to his victims"},
    {q:"Who is Hannah McKay?",a:"A poisoner Dexter falls in love with in Season 7 — she flees with Harrison in the finale"},
    {q:"What is the theme of the show's title sequence?",a:"Dexter's morning routine — shaving, cooking eggs, tying shoelaces — all filmed to look like murder preparation"},
    {q:"What is the Showtime revival's critical reception?",a:"Dexter: New Blood was praised as a redemption after the original finale — Harrison's killing of Dexter was seen as fitting"},
  ],
  },
  vikings:{label:"Vikings",icon:"\u2694\uFE0F",color:"#4B5563",
  200:[
    {q:"Who is Ragnar Lothbrok?",a:"A Norse farmer who rises to become King of Denmark and the most famous Viking raider"},
    {q:"Who is Lagertha?",a:"Ragnar's first wife — a shieldmaiden and eventually an earl and queen"},
    {q:"Who is Floki?",a:"Ragnar's eccentric best friend — a legendary boat builder devoted to the Norse gods"},
    {q:"What is the first place Ragnar raids in the West?",a:"Lindisfarne — a monastery in England — in 793 AD"},
    {q:"Who is Rollo?",a:"Ragnar's brother — a powerful warrior who eventually sides against him"},
    {q:"Who is Bjorn Ironside?",a:"Ragnar's son — who becomes a legendary Viking leader in his own right"},
    {q:"What is the Thing?",a:"The Norse assembly where free men gather to make decisions and settle disputes"},
    {q:"What are berserkers?",a:"Viking warriors who enter a trance-like battle fury — associated with Odin"},
    {q:"Who is Athelstan?",a:"An Anglo-Saxon monk taken captive by Ragnar — they form a complex spiritual friendship"},
    {q:"What is Valhalla?",a:"The Norse afterlife for warriors who die in battle — ruled by Odin"},
  ],
  400:[
    {q:"Who is King Ecbert?",a:"The ambitious King of Wessex — one of the most politically sophisticated characters in the show"},
    {q:"What is Paris and why is it significant?",a:"The Vikings besiege Paris in Seasons 3-4 — a historically based major event"},
    {q:"Who is Aslaug?",a:"Ragnar's second wife — a völva (seer) and princess of legendary descent"},
    {q:"Who is Ivar the Boneless?",a:"Ragnar's most vicious son — he is carried due to a physical condition but becomes the most ruthless leader"},
    {q:"What is the significance of Rollo settling in France?",a:"He becomes the first Duke of Normandy — ancestor of William the Conqueror"},
    {q:"Who is King Aelle?",a:"The King of Northumbria who captures and kills Ragnar via the blood eagle"},
    {q:"What is the blood eagle?",a:"A brutal Norse execution ritual — the ribs are cut from the spine and lungs pulled out to form wings"},
    {q:"Who is Halfdan the Black?",a:"Harald Finehair's wild brother — a fearless raider who explores the world with Bjorn"},
    {q:"Who kills Ragnar Lothbrok?",a:"King Aelle — he throws Ragnar into a pit of snakes"},
    {q:"What is the aftermath of Ragnar's death?",a:"His sons launch the Great Heathen Army to avenge him — invading England"},
  ],
  600:[
    {q:"What is the Great Heathen Army?",a:"A massive Viking invasion of England in 865 AD — led by Ragnar's sons — historically documented"},
    {q:"What is the significance of Floki sailing to Iceland?",a:"He discovers a land he believes is the home of the gods — the Vikings settle Iceland in the later seasons"},
    {q:"What is the connection between Vikings and Vikings: Valhalla?",a:"Valhalla is a Netflix sequel set 100 years later — featuring Leif Eriksson and Harald Sigurdsson"},
    {q:"Who is Harald Finehair?",a:"King of Norway who seeks to unite all Norse kingdoms — an ally and rival to Bjorn"},
    {q:"What is the historical accuracy level of the show?",a:"It uses real historical figures and events but takes significant liberties — it inspired popular interest in Norse history"},
    {q:"Who is Prince Oleg of Novgorod?",a:"A Byzantine-influenced Russian ruler — the primary villain of Seasons 5-6, enemies with Ivar then Bjorn"},
    {q:"What is Hvitserk's arc?",a:"Ragnar's most troubled son — he converts to Christianity and struggles with addiction and guilt"},
    {q:"What is the significance of Ubbe?",a:"He fulfils Ragnar's dream by sailing to North America — settling Vinland"},
    {q:"What is the legacy of Ragnar Lothbrok in real history?",a:"A semi-legendary Norse hero — his sons' Great Heathen Army is historically documented; his existence is debated"},
    {q:"Who is Judith?",a:"Athelstan's lover and Aethelwulf's wife — she plays a major political role in the later seasons"},
  ],
  },
  one_piece_show:{label:"One Piece",icon:"\u2620\uFE0F",color:"#DC2626",
  200:[
    {q:"Who is Monkey D. Luffy?",a:"The captain of the Straw Hat Pirates — his dream is to find the One Piece and become King of the Pirates"},
    {q:"What did Luffy eat?",a:"The Gomu Gomu no Mi — making his body rubber"},
    {q:"Who is Roronoa Zoro?",a:"The swordsman of the crew — he uses three swords and aims to be the world's greatest swordsman"},
    {q:"What is the One Piece?",a:"The legendary treasure left by the Pirate King Gol D. Roger — its true nature is revealed in late arcs"},
    {q:"Who is Nami?",a:"The navigator of the Straw Hat Pirates — she can predict weather and uses a clima-tact"},
    {q:"Who created One Piece?",a:"Eiichiro Oda — one of the best-selling manga authors in history"},
    {q:"What is the Grand Line?",a:"The dangerous ocean where the most powerful pirates operate — where the One Piece is hidden"},
    {q:"Who is Shanks?",a:"A legendary Yonko pirate — he inspired Luffy and gave him his straw hat"},
    {q:"What are Devil Fruits?",a:"Mysterious fruits that grant powers but take away the ability to swim — three types: Paramecia, Zoan, Logia"},
    {q:"Who is Tony Tony Chopper?",a:"The crew's doctor — a reindeer who ate the Human-Human Devil Fruit"},
  ],
  400:[
    {q:"What is Haki?",a:"Spiritual energy all living beings have — three types: Observation, Armament, and Conqueror's"},
    {q:"What is the Will of D?",a:"A mystery connecting people with the initial D in their names — related to the Void Century and the ancient enemy of the World Government"},
    {q:"Who are the Yonko?",a:"The Four Emperors — the most powerful pirates in the world: Shanks, Kaido, Big Mom, and Blackbeard"},
    {q:"What is the Void Century?",a:"A 100-year period erased from world history — its truth would overturn the World Government"},
    {q:"Who is Nico Robin?",a:"The crew's archaeologist — the only person who can read Poneglyphs, the ancient stones holding history"},
    {q:"What is the Straw Hat Crew's ship?",a:"The Thousand Sunny — with a lion figurehead, built by Franky"},
    {q:"What is Marineford?",a:"The Marine headquarters — site of the Paramount War where Ace dies and the world order changes"},
    {q:"Who is Portgas D. Ace?",a:"Luffy's older brother — commander of Whitebeard's second division — he dies at Marineford"},
    {q:"What is the Fishman Island arc about?",a:"The crew arrives at the underwater kingdom — exploring racism, discrimination, and Arlong's legacy"},
    {q:"Who is Dracule Mihawk?",a:"The greatest swordsman in the world — Zoro's ultimate goal is to defeat him"},
  ],
  600:[
    {q:"What is the true nature of the Gomu Gomu no Mi?",a:"It is actually the Hito Hito no Mi: Mythical Zoan, Model: Nika — the Sun God fruit, suppressed by the World Government"},
    {q:"What is the Sun God Nika?",a:"An ancient figure who brought joy and freedom — the one who made people laugh. Luffy embodies this"},
    {q:"What is Joy Boy?",a:"An ancient figure from 800 years ago who promised to return — Luffy is the new Joy Boy"},
    {q:"What is the Poneglyphs' secret?",a:"Ancient stones inscribed with history the World Government wants suppressed — the Road Poneglyphs lead to Laugh Tale"},
    {q:"What is Laugh Tale?",a:"The island at the end of the Grand Line where Gol D. Roger found the One Piece and learned the truth"},
    {q:"What is the significance of Gol D. Roger's execution?",a:"Rather than crushing piracy, his final words about the One Piece sparked the Great Pirate Era"},
    {q:"Who is Im?",a:"The mysterious supreme ruler sitting on the Empty Throne — the true power behind the World Government"},
    {q:"What is the Ancient Weapon Pluton?",a:"A warship capable of destroying an island — its blueprints were given to Franky and he memorised and burned them"},
    {q:"What is the Egghead arc's significance?",a:"Vegapunk reveals the world's true history — and is killed for it, sending his message to the world"},
    {q:"What is the significance of Shanks giving Luffy his hat?",a:"It represents a promise — give it back when you become a great pirate. It defines Luffy's entire journey"},
  ],
  },
  dragon_ball:{label:"Dragon Ball Z",icon:"\u{1F525}",color:"#F97316",
  200:[
    {q:"What are the Dragon Balls?",a:"Seven magic balls — when gathered, they summon a dragon that grants wishes"},
    {q:"Who is Goku?",a:"Earth's greatest hero — a Saiyan raised on Earth who repeatedly saves the universe"},
    {q:"Who is Vegeta?",a:"The prince of the Saiyan race — Goku's rival who becomes an ally"},
    {q:"What is a Saiyan?",a:"A warrior alien race — Goku and Vegeta's species — they grow stronger after near-death"},
    {q:"What is Goku's first transformation?",a:"Super Saiyan — triggered by rage over Krillin's death"},
    {q:"Who is Frieza?",a:"A galactic tyrant who destroyed Planet Vegeta — the primary villain of the Namek arc"},
    {q:"Who is Gohan?",a:"Goku's son — he defeats Cell and briefly becomes the strongest character in DBZ"},
    {q:"What is the Kamehameha?",a:"Goku's signature energy beam attack"},
    {q:"Who are the Z Fighters?",a:"The group of heroes protecting Earth — Goku, Gohan, Vegeta, Krillin, Piccolo, etc."},
    {q:"What is a Spirit Bomb?",a:"Goku's ultimate technique — he gathers energy from all living things into a massive ball"},
  ],
  400:[
    {q:"Who is Cell?",a:"An android created from the DNA of the strongest fighters — he seeks to absorb Androids 17 and 18 to reach his perfect form"},
    {q:"What is the Cell Games?",a:"Cell's tournament where he fights Earth's warriors one by one"},
    {q:"Who is Majin Buu?",a:"An ancient magical being of immense power — initially a pink, childlike creature that becomes increasingly dangerous"},
    {q:"What is the Hyperbolic Time Chamber?",a:"A room where one year passes for every day outside — used for intense training"},
    {q:"Who is Android 18?",a:"One of Dr. Gero's androids — she later marries Krillin"},
    {q:"What is fusion?",a:"Two warriors merging into one — Potara Fusion (earrings) and Fusion Dance (hand technique)"},
    {q:"What is Gohan's Ultimate/Mystic form?",a:"A power-up unlocked by Elder Kai — it gives Gohan his full potential without transforming"},
    {q:"Who is Piccolo?",a:"A Namekian who was initially Goku's enemy — he becomes Gohan's mentor and a Z Fighter"},
    {q:"What killed Goku the first time?",a:"He uses his instant transmission to take Cell to King Kai's planet when Cell is about to explode"},
    {q:"Who is Broly?",a:"A Legendary Super Saiyan of immense power — the movie villain whose power level is incomprehensible"},
  ],
  600:[
    {q:"What is Ultra Instinct?",a:"A godly technique where the body moves automatically without thought — Goku achieves it against Jiren in Super"},
    {q:"What is the Tournament of Power?",a:"A battle royale between the strongest warriors of eight universes — losers' universes are erased"},
    {q:"What is the significance of Vegeta's Saiyan pride?",a:"His pride is his greatest strength and weakness — his arc is learning to fight for others, not just pride"},
    {q:"What is the Zenkai boost?",a:"The Saiyan ability to grow stronger after nearly dying — it explains their exponential power scaling"},
    {q:"Who is Jiren?",a:"The most powerful mortal in the multiverse — he forced Goku to unlock Ultra Instinct"},
    {q:"What is the Grand Priest?",a:"The father of the Angels — the most powerful being below the Omni-Kings"},
    {q:"What is the Omni-King Zeno?",a:"The ruler of all universes — a childlike being of absolute power who erases universes casually"},
    {q:"What is the significance of Gohan's decline in power?",a:"He stopped training after Cell — in Buu saga he has to rush to reclaim his power. A critique of talent wasted by complacency"},
    {q:"What is the legendary significance of the Raditz fight?",a:"It introduced power levels as a concept — changing how audiences understood strength in anime"},
    {q:"What is Dragon Ball GT vs Super controversy?",a:"GT was a non-canon sequel made without Toriyama's involvement; Super is the official continuation but fans debate quality"},
  ],
  },
  spider_man:{label:"Spider-Man",icon:"\u{1F577}\uFE0F",color:"#DC2626",
  200:[
    {q:"What is Spider-Man's real name?",a:"Peter Parker"},
    {q:"How did Peter get his powers?",a:"A radioactive spider bite during a school field trip"},
    {q:"What is Spider-Man's most famous quote?",a:"With great power comes great responsibility — said by Uncle Ben"},
    {q:"Who is Mary Jane Watson?",a:"Peter's most famous love interest — a model and actress"},
    {q:"Who is Gwen Stacy?",a:"Peter's first love — her death is one of the most impactful moments in comics history"},
    {q:"Who is Aunt May?",a:"Peter's guardian who raised him after his parents' death — she doesn't know his secret for years"},
    {q:"Who is the Green Goblin?",a:"Norman Osborn — a scientist who becomes unhinged after taking an experimental formula"},
    {q:"What studio produces Spider-Man films?",a:"Sony owns the rights, but Marvel Studios co-produced the MCU Spider-Man films with Tom Holland"},
    {q:"Who plays Spider-Man in the MCU?",a:"Tom Holland"},
    {q:"What is the Daily Bugle?",a:"The newspaper where Peter works as a photographer — run by J. Jonah Jameson"},
  ],
  400:[
    {q:"Who is Miles Morales?",a:"The second Spider-Man — a Black and Puerto Rican teenager from Brooklyn who was bitten in an alternate universe"},
    {q:"Who is Doctor Octopus?",a:"Otto Octavius — a scientist with mechanical tentacle arms who is one of Spider-Man's greatest foes"},
    {q:"What is the Sinister Six?",a:"A team of six of Spider-Man's deadliest villains working together to destroy him"},
    {q:"What is the black symbiote suit?",a:"An alien symbiote that enhances Peter's powers but increases his aggression — it bonds with Eddie Brock to become Venom"},
    {q:"Who is Venom?",a:"Eddie Brock bonded with the symbiote — one of Spider-Man's most complex enemies"},
    {q:"Who is Mysterio in the MCU?",a:"Quentin Beck — a former Stark employee who creates illusions. He nearly exposes Peter's identity"},
    {q:"What is the significance of No Way Home?",a:"All three live-action Spider-Men unite — Tobey Maguire, Andrew Garfield, and Tom Holland"},
    {q:"Who is the Prowler?",a:"Aaron Davis — Miles Morales's uncle and a villain in the Spider-Verse"},
    {q:"Who is Silk?",a:"Cindy Moon — bitten by the same spider as Peter, she has silk-spinning abilities"},
    {q:"What is the Spider-Verse?",a:"The multiverse concept centred on Spider-People — all versions of Spider-Man across parallel dimensions"},
  ],
  600:[
    {q:"What is the Clone Saga?",a:"A 1990s comics arc where Peter discovers he might be a clone of himself — a controversial but significant storyline"},
    {q:"What is the One More Day controversy?",a:"Peter makes a deal with Mephisto erasing his marriage to MJ — widely considered the worst Spider-Man story ever told"},
    {q:"What is Superior Spider-Man?",a:"Otto Octavius takes over Peter's body — he becomes Spider-Man with a superior but villainous approach"},
    {q:"What is the significance of Gwen Stacy's death?",a:"Often considered the end of the Silver Age of comics — her neck was snapped by the sudden stop of the web catching her"},
    {q:"What is the Kingpin's connection to Spider-Man?",a:"Wilson Fisk controls much of New York's crime — his schemes frequently put Peter's loved ones at risk"},
    {q:"Who is the Spider-Man of 2099?",a:"Miguel O'Hara — a futuristic Spider-Man in a dystopian New York who appears in the Spider-Verse films"},
    {q:"What is Kaine Parker?",a:"A degenerated clone of Peter with a touch of death ability — later becomes the Scarlet Spider"},
    {q:"What is the significance of the Symkarian Spider-Man (Silver Sable)?",a:"She represents how Spider-Man's world intersects with international politics and mercenaries"},
    {q:"What is the Great Web?",a:"In Spider-Verse lore — the metaphysical structure connecting all Spider-Totems across dimensions"},
    {q:"What is the deeper theme of Spider-Man?",a:"Responsibility, sacrifice, and the cost of power — Peter perpetually sacrifices personal happiness for the greater good"},
  ],
  },

  country_map:{label:"Country Map",icon:"\u{1F5FA}\uFE0F",color:"#059669",isCountryMap:true,
  200:COUNTRY_MAP_BANK[200],
  400:COUNTRY_MAP_BANK[400],
  600:COUNTRY_MAP_BANK[600],
  },
  country_facts:{label:"Country Facts",icon:"\u{1F310}",color:"#0891B2",
  200:[
    {q:"This country has the most pyramids in the world — more than Egypt — and its capital is Khartoum",a:"Sudan"},
    {q:"This country is home to the Amazon rainforest, the largest country in South America, and its capital is Brasília",a:"Brazil"},
    {q:"This country invented pizza, pasta, and is famous for the Colosseum and leaning tower in Pisa",a:"Italy"},
    {q:"This is the most visited country in the world — home to the Eiffel Tower and the Louvre museum",a:"France"},
    {q:"This country is the birthplace of the Olympic Games and democracy — capital Athens",a:"Greece"},
    {q:"This country has the world's longest coastline — it also contains more lakes than any other country",a:"Canada"},
    {q:"This tiny country is completely surrounded by Italy — home to the smallest republic in the world",a:"San Marino"},
    {q:"This country's flag features a maple leaf — it spans from the Atlantic to the Pacific and has two official languages",a:"Canada"},
    {q:"This country is both a continent and a country — the only nation to occupy an entire continent",a:"Australia"},
    {q:"This country invented chess, yoga, Buddhism, and Hinduism — capital New Delhi",a:"India"},
    {q:"This is the world's most populous country as of 2023 — overtook China — capital is New Delhi",a:"India"},
    {q:"This country has the highest peak on Earth — Mount Everest — and is between China and India",a:"Nepal"},
    {q:"This country is completely below sea level in significant parts — known for tulips, windmills, and cycling",a:"Netherlands"},
    {q:"This country is where the World Cup was held in 2022 — known for its futuristic skyline and extreme wealth",a:"Qatar"},
    {q:"This country has capital Abu Dhabi and is a federation of seven emirates on the Arabian Peninsula",a:"United Arab Emirates"},
  ],
  400:[
    {q:"This country has the most time zones in the world — 12 including overseas territories — capital Paris",a:"France"},
    {q:"This country is home to the world's largest salt flat — Salar de Uyuni — and is landlocked in South America",a:"Bolivia"},
    {q:"This country is the birthplace of the internet's creator Tim Berners-Lee and home to the Magna Carta",a:"United Kingdom"},
    {q:"This country has the most UNESCO World Heritage Sites in the world — capital Rome",a:"Italy"},
    {q:"This country has never been colonised in modern history and uses its own calendar — Horn of Africa",a:"Ethiopia"},
    {q:"This country has the most billionaires per capita in the world — a city-state in Southeast Asia",a:"Singapore"},
    {q:"This is the only country with two capital cities — one for parliament, one for executive government",a:"South Africa (Cape Town and Pretoria, plus Bloemfontein)"},
    {q:"This is the world's only country whose name begins and ends with the same letter — capital Doha",a:"Qatar"},
    {q:"This country is famous for its fjords and midnight sun, and its capital is Oslo",a:"Norway"},
    {q:"This country is home to CERN, where the World Wide Web was invented, and its capital is Bern",a:"Switzerland"},
    {q:"This is the world's oldest continuously inhabited country — with over 5,000 years of recorded history — capital Beijing",a:"China"},
    {q:"This country has the world's longest high-speed rail network — it also has more pandas than any other country",a:"China"},
    {q:"This small African country is the only one completely surrounded by South Africa — a kingdom in the mountains",a:"Lesotho"},
    {q:"This country produces 40% of the world's chocolate — its capital is Yamoussoukro",a:"Ivory Coast (Côte d'Ivoire)"},
    {q:"This country has the most islands of any nation in the world — over 220,000 — capital Stockholm",a:"Sweden"},
  ],
  600:[
    {q:"This country has the highest average elevation of any independent country and is completely surrounded by South Africa",a:"Lesotho"},
    {q:"This country has 11 official languages and three capital cities — capital for parliament is Cape Town",a:"South Africa"},
    {q:"This tiny island nation in the Pacific was the first country to be almost entirely submerged due to climate change",a:"Tuvalu"},
    {q:"This island nation is famous for Ceylon tea, and its capital is Colombo",a:"Sri Lanka"},
    {q:"This country has the highest percentage of forest cover — over 97% of the land is forested",a:"Suriname"},
    {q:"This island nation in the Indian Ocean is one of the world's oldest democracies — capital Male",a:"Maldives"},
    {q:"This country has the most vending machines per capita in the world — including ones selling hot meals and live crabs",a:"Japan"},
    {q:"This country recently changed its official name from Swaziland to its current name in 2018",a:"Eswatini"},
    {q:"This country has the largest number of active volcanoes in the world — over 130",a:"Indonesia"},
    {q:"This tiny nation completely surrounded by Switzerland and Austria is one of only two doubly landlocked countries",a:"Liechtenstein"},
    {q:"This country is the only sovereign state with a non-rectangular national flag",a:"Nepal"},
    {q:"This country has the highest murder rate in the world and is known as the most dangerous nation not at war",a:"Honduras (varies by year — often El Salvador or Honduras)"},
    {q:"This country introduced the first national park in the world — in 1872",a:"United States (Yellowstone)"},
    {q:"This island nation in East Africa has more species of lemur than anywhere else on Earth — they are found nowhere else",a:"Madagascar"},
    {q:"This independent country is the only one in the world with a dragon on its national flag",a:"Bhutan"},
  ],
  },
  flags:{label:"Flags",icon:"\u{1F6A9}",color:"#DC2626",
  200:FLAG_BANK[200],
  400:FLAG_BANK[400],
  600:FLAG_BANK[600],
  },
  songs:{label:"Songs",icon:"\u{1F3B6}",color:"#7C3AED",
  200:[
    {q:"A 2013 pop song by a young Australian singer about being 22 years old, from the Red era",a:"22 by Taylor Swift"},
    {q:"A 2011 anthem where a singer tells a bully their friend-betrayer he should've known better — someone Like You",a:"Someone Like You by Adele"},
    {q:"The most streamed song of 2019 by The Weeknd featuring post-80s synths and obsessive love",a:"Blinding Lights by The Weeknd"},
    {q:"Eminem's 2002 song about seizing one single opportunity in life — you only get one shot",a:"Lose Yourself by Eminem"},
    {q:"A 2021 song from Encanto that people DO NOT talk about — features a fast-paced ensemble number",a:"We Don't Talk About Bruno by Lin-Manuel Miranda"},
    {q:"Queen's 1975 six-minute rock opera that is completely unlike any other song — operatic sections included",a:"Bohemian Rhapsody by Queen"},
    {q:"A 2013 song about a golden era of youth, dancing all night — Forever Young vibes — by Avicii",a:"Wake Me Up by Avicii"},
    {q:"A 1982 Michael Jackson song about a supernatural thriller — features a famous Vincent Price monologue",a:"Thriller by Michael Jackson"},
    {q:"A 1971 John Lennon song imagining a world with no countries, religions, or possessions",a:"Imagine by John Lennon"},
    {q:"The 2016 hit that opens with 'Hey, I was doing just fine before I met you'",a:"Closer by The Chainsmokers featuring Halsey"},
    {q:"A Drake song from 2016 featuring his famous Hotline Bling dance music video",a:"Hotline Bling by Drake"},
    {q:"A 2013 song by Pharrell Williams used in Despicable Me 2 — the word happy repeated endlessly",a:"Happy by Pharrell Williams"},
    {q:"A 1977 ABBA song about surviving heartbreak after the end of a relationship — The Winner Takes It All era",a:"Dancing Queen by ABBA"},
    {q:"Ed Sheeran's 2017 record-breaking love song featuring the lyric about loving your curves and edges",a:"Shape of You by Ed Sheeran"},
    {q:"A Dua Lipa 2020 song where she outlines new rules for getting over an ex",a:"Don't Start Now by Dua Lipa"},
  ],
  400:[
    {q:"A 2005 Kanye West hit featuring Jamie Foxx and built around a Ray Charles sample",a:"Gold Digger by Kanye West"},
    {q:"A 1994 Notorious B.I.G. track about the dangers of going from nothing to something — hypnotic strings",a:"Juicy by The Notorious B.I.G."},
    {q:"A 1982 song by Toto about Africa and missing someone while being far away — received renewed fame in 2018",a:"Africa by Toto"},
    {q:"A 2012 Gotye song about a failed relationship where both parties reflect — she is now Somebody That I Used to Know",a:"Somebody That I Used to Know by Gotye"},
    {q:"A Kendrick Lamar track from DAMN where he criticises people who are not humble enough",a:"HUMBLE. by Kendrick Lamar"},
    {q:"A 2017 Post Malone song about rockstar lifestyle that made him a household name — featuring 21 Savage",a:"rockstar by Post Malone"},
    {q:"A 2018 song by Billie Eilish recorded in her bedroom at age 13 — about a bad guy she is obsessed with",a:"bad guy by Billie Eilish"},
    {q:"A 1975 song by Queen where Freddie asks Mama if he has just killed a man",a:"Bohemian Rhapsody by Queen — but the lyric is 'Mama, just killed a man' within the song"},
    {q:"A 1965 Bob Dylan song where Mr. Jones is hopelessly out of touch",a:"Ballad of a Thin Man by Bob Dylan"},
    {q:"A Beyoncé song from Lemonade with a country-pop crossover style",a:"Daddy Lessons by Beyoncé"},
    {q:"A Lady Gaga hit about going out, forgetting your worries, and just dancing",a:"Just Dance by Lady Gaga"},
    {q:"A 1991 Nirvana track that became the anthem of Generation X with a baby in a pool on the cover",a:"Smells Like Teen Spirit — but that's the song. The album was Nevermind"},
    {q:"A Childish Gambino 2018 song featuring an intense, violent music video critiquing gun violence and racism in America",a:"This Is America by Childish Gambino"},
    {q:"A 2020 The Weeknd title track about obsession and driving late at night to someone's house",a:"After Hours by The Weeknd"},
    {q:"A 1977 Fleetwood Mac song written during their most turbulent period — references rolling thunder",a:"The Chain by Fleetwood Mac"},
  ],
  600:[
    {q:"A 1979 Talking Heads song about a large domestic house and questioning how one arrived at their life",a:"Once in a Lifetime by Talking Heads"},
    {q:"A 1980 Joy Division song featuring a simple bass line and Ian Curtis's haunting voice — released after his death",a:"Love Will Tear Us Apart by Joy Division"},
    {q:"A 1974 Bob Marley song about standing firm despite adversity — became one of reggae's defining songs",a:"No Woman No Cry by Bob Marley"},
    {q:"A Miles Davis 1959 modal jazz composition that changed the direction of jazz music",a:"So What by Miles Davis"},
    {q:"A 1966 Beach Boys track featuring a bicycle bell, dogs barking, and Brian Wilson's most ambitious production",a:"Good Vibrations by The Beach Boys"},
    {q:"A Radiohead song from OK Computer about a self-satisfied man who doesn't know he's out of touch — Fitter Happier era",a:"Karma Police by Radiohead"},
    {q:"A 1965 The Rolling Stones song featuring Keith Richards's most iconic riff — about not getting what you want",a:"Satisfaction by The Rolling Stones"},
    {q:"A 1993 Smashing Pumpkins single from Siamese Dream that sounds bright but hides bleak lyrics",a:"Today by The Smashing Pumpkins"},
    {q:"A 1987 U2 anthem written about a troubled relationship where Bono's personal life merged with the lyrics",a:"With or Without You by U2"},
    {q:"A 1958 Chuck Berry song that became the blueprint for rock and roll guitar playing",a:"Johnny B. Goode by Chuck Berry"},
    {q:"A Frank Ocean track from Channel Orange about unrequited love for a man — quietly groundbreaking for R&B",a:"Thinkin Bout You by Frank Ocean"},
    {q:"A 2003 Outkast track where one half sings about a former girlfriend and the other raps — completely split in tone",a:"Hey Ya! by OutKast"},
    {q:"A 1969 Led Zeppelin track with an acoustic opening that slowly builds to a thunderous electric climax",a:"Stairway to Heaven by Led Zeppelin"},
    {q:"A 2010 Arcade Fire track that won the Grammy for Album of the Year surprising almost everyone — about suburban ennui",a:"The Suburbs by Arcade Fire (or Ready to Start)"},
    {q:"A 2017 Kendrick Lamar track from DAMN built around pride, aggression, and inherited traits",a:"DNA. by Kendrick Lamar"},
  ],
  },

  who_footballer:{label:"Which Footballer Am I?",icon:"\u26BD",color:"#1D4ED8",isWhoAmI:true,
  200:[
    {q:"Portuguese winger, 5x Ballon d'Or winner, known for his free kicks and physique",a:"Cristiano Ronaldo",wiki:"Cristiano_Ronaldo"},
    {q:"Argentine forward, 8x Ballon d'Or winner, world's greatest dribbler, plays with his left foot",a:"Lionel Messi",wiki:"Lionel_Messi"},
    {q:"French striker, FIFA World Cup winner at 19 in 2018, plays for Real Madrid, lightning fast",a:"Kylian Mbappé",wiki:"Kylian_Mbapp%C3%A9"},
    {q:"Norwegian striker, broke the Premier League scoring record in his first season at Man City",a:"Erling Haaland",wiki:"Erling_Haaland"},
    {q:"Egyptian winger, Liverpool's all-time top scorer, won the Africa Cup of Nations with Egypt",a:"Mohamed Salah",wiki:"Mohamed_Salah"},
    {q:"Belgian midfielder, considered one of the best playmakers ever, plays for Man City",a:"Kevin De Bruyne",wiki:"Kevin_De_Bruyne"},
    {q:"Brazilian striker, played for PSG and Barcelona, known for his skill and flair",a:"Neymar",wiki:"Neymar"},
    {q:"Senegalese winger, won the Premier League and Champions League with Liverpool, moved to Bayern",a:"Sadio Mané",wiki:"Sadio_Man%C3%A9"},
    {q:"French playmaker, won the 1998 and 2006 World Cups, headbutted Materazzi in the final",a:"Zinedine Zidane",wiki:"Zinedine_Zidane"},
    {q:"Brazilian R9, won the World Cup in 2002, scored twice in the final, one of the greatest strikers",a:"Ronaldo (R9)",wiki:"Ronaldo_(Brazilian_footballer)"},
    {q:"Dutch striker, won the 1988 European Championship with Netherlands, AC Milan legend",a:"Marco van Basten",wiki:"Marco_van_Basten"},
    {q:"German keeper, widely considered the best in his generation, won the 2014 World Cup",a:"Manuel Neuer",wiki:"Manuel_Neuer"},
    {q:"French striker, Arsenal legend, won the Treble with Barcelona, nicknamed Va Va Voom",a:"Thierry Henry",wiki:"Thierry_Henry"},
    {q:"Welsh winger, 4x Champions League winner with Real Madrid, known to love golf",a:"Gareth Bale",wiki:"Gareth_Bale"},
    {q:"Liberian striker, won the Ballon d'Or in 1995, later became President of Liberia",a:"George Weah",wiki:"George_Weah"},
  ],
  400:[
    {q:"Swedish striker, known for his bicycle kicks and arrogance, played for Barcelona and Man United",a:"Zlatan Ibrahimovic",wiki:"Zlatan_Ibrahimovi%C4%87"},
    {q:"Argentine striker, Man City legend, scored the famous 93:20 goal against QPR to win the league",a:"Sergio Agüero",wiki:"Sergio_Ag%C3%BCero"},
    {q:"Portuguese midfielder at Man United, known for his long shots and leadership, brother of Bernardo",a:"Bruno Fernandes",wiki:"Bruno_Fernandes"},
    {q:"English midfielder, captained England, married a Spice Girl, known for his pinpoint crossing",a:"David Beckham",wiki:"David_Beckham"},
    {q:"Dutch football philosopher, invented Total Football, won three European Cups with Ajax",a:"Johan Cruyff",wiki:"Johan_Cruyff"},
    {q:"Brazilian fullback, most decorated club footballer ever, played for Barcelona, PSG, Juventus",a:"Dani Alves",wiki:"Dani_Alves"},
    {q:"Italian legend, rarely left Roma despite massive offers, nicknamed Il Gladiatore",a:"Francesco Totti",wiki:"Francesco_Totti"},
    {q:"German striker, nicknamed The Bomber, scored 68 goals for West Germany, 1972 Ballon d'Or",a:"Gerd Müller",wiki:"Gerd_M%C3%BCller"},
    {q:"Spanish goalkeeper, Real Madrid's No. 1 for decades, won the 2010 World Cup",a:"Iker Casillas",wiki:"Iker_Casillas"},
    {q:"English striker at Spurs and Bayern Munich, England's all-time top scorer",a:"Harry Kane",wiki:"Harry_Kane"},
    {q:"Argentine winger, won the 2022 World Cup, scored in major finals, and is nicknamed El Fideo",a:"Angel Di María",wiki:"%C3%81ngel_Di_Mar%C3%ADa"},
    {q:"French defender, won the 2018 World Cup, known as one of the greatest defenders of his era, Juventus and Man United",a:"Raphaël Varane",wiki:"Rapha%C3%ABl_Varane"},
    {q:"Brazilian right-back, played for Barcelona, known for his long throws and attacking runs",a:"Dani Alves",wiki:"Dani_Alves"},
    {q:"Real Madrid's legendary striker, all-time top scorer before Ronaldo, Spanish, nicknamed The White Arrow",a:"Raúl",wiki:"Ra%C3%BAl_(footballer)"},
    {q:"Croatian midfielder, 6x Champions League winner with Real Madrid, won the 2018 Ballon d'Or",a:"Luka Modrić",wiki:"Luka_Modri%C4%87"},
  ],
  600:[
    {q:"Argentine forward, won the World Cup in 1978 and 1986, scored the Hand of God and Goal of the Century in the same match",a:"Diego Maradona",wiki:"Diego_Maradona"},
    {q:"Brazilian legend, won three World Cups, scored over 1,200 goals, known by just one name meaning King",a:"Pelé",wiki:"Pel%C3%A9"},
    {q:"Hungarian striker, scored 84 international goals, was the world record holder for decades",a:"Ferenc Puskás",wiki:"Ferenc_Pusk%C3%A1s"},
    {q:"Dutch defender, Premier League icon, captain of Liverpool who lifted the Champions League",a:"Virgil van Dijk",wiki:"Virgil_van_Dijk"},
    {q:"German striker, won the 1974 World Cup, scored 68 goals for West Germany, Bundesliga legend",a:"Gerd Müller",wiki:"Gerd_M%C3%BCller"},
    {q:"Ivory Coast legend, plays for Chelsea, won Africa Cup of Nations, known for his strength",a:"Didier Drogba",wiki:"Didier_Drogba"},
    {q:"Liberian striker, 1995 Ballon d'Or, scored 22 World Cup qualifying goals for Liberia, later president",a:"George Weah",wiki:"George_Weah"},
    {q:"Iranian striker, held the men's international goals record before Ronaldo, scored 109 goals",a:"Ali Daei",wiki:"Ali_Daei"},
    {q:"Real Madrid legend, Argentine-Spanish, arguably the greatest player before Pelé and Maradona",a:"Alfredo Di Stéfano",wiki:"Alfredo_Di_St%C3%A9fano"},
    {q:"Spanish playmaker, won 4 Champions Leagues with Real Madrid, known for his vision and passing",a:"Xavi Hernández",wiki:"Xavi"},
  ],
  },

  who_tv_character:{label:"Which TV Character Am I?",icon:"\uD83D\uDCFA",color:"#0891B2",isWhoAmI:true,
  200:[
    {q:"I make blue meth, I say I am the danger, I have a porkpie hat, my alias is Heisenberg",a:"Walter White",wiki:"Walter_White_(Breaking_Bad)"},
    {q:"I tattooed prison blueprints on my body to break my innocent brother out of Fox River",a:"Michael Scofield",wiki:"Michael_Scofield"},
    {q:"I have three dragons, my family's words are Fire and Blood, I am the last Targaryen",a:"Daenerys Targaryen",wiki:"Daenerys_Targaryen"},
    {q:"I have a spot on the couch, I say Bazinga when I joke, I am a theoretical physicist",a:"Sheldon Cooper",wiki:"Sheldon_Cooper"},
    {q:"I'm a blood spatter analyst who secretly kills killers following my father's Code",a:"Dexter Morgan",wiki:"Dexter_Morgan"},
    {q:"I'm a Norse farmer who raids England, I navigate by the sun's position, and my wife is Lagertha",a:"Ragnar Lothbrok",wiki:"Ragnar_Lothbrok"},
    {q:"I'm a forensic scientist struck by lightning who later becomes the Flash in Central City",a:"Barry Allen",wiki:"Barry_Allen_(Arrowverse)"},
    {q:"I wake from a coma into a zombie apocalypse, I'm a sheriff's deputy, and I find my family in Atlanta",a:"Rick Grimes",wiki:"Rick_Grimes"},
    {q:"I'm New York's best closer, I wear expensive suits, and Donna is my right hand",a:"Harvey Specter",wiki:"Harvey_Specter"},
    {q:"I run the Walking Dead's most brutal antagonist group, and my weapon is a barbed-wire bat called Lucille",a:"Negan",wiki:"Negan"},
    {q:"I'm a teenage girl raised in a government lab, and I fight monsters from the Upside Down",a:"Eleven",wiki:"Eleven_(Stranger_Things)"},
    {q:"I am the bastard of Winterfell who becomes Lord Commander and later King in the North",a:"Jon Snow",wiki:"Jon_Snow_(character)"},
    {q:"I manage Dunder Mifflin, declare bankruptcy by shouting it, and think I'm the world's best boss",a:"Michael Scott",wiki:"Michael_Scott_(The_Office)"},
    {q:"I farm beets, love bears, and serve as assistant to the regional manager",a:"Dwight Schrute",wiki:"Dwight_Schrute"},
    {q:"I'm a colorful lawyer with a loud wardrobe and an even louder mouth who works for Albuquerque's criminals",a:"Saul Goodman",wiki:"Saul_Goodman"},
  ],
  400:[
    {q:"I'm a chemistry teacher's wife who eventually helps launder drug money, and my husband's secret destroys our family",a:"Skyler White",wiki:"Skyler_White"},
    {q:"I lead the army of the dead, ride an undead dragon, and bring the Long Night to Westeros",a:"The Night King",wiki:"Night_King"},
    {q:"I'm a paralegal turned lawyer from Suits, and I eventually marry Mike Ross",a:"Rachel Zane",wiki:"Rachel_Zane"},
    {q:"I'm an FBI agent hunting escaped convicts, secretly linked to the Company, and I become an uneasy ally",a:"Agent Mahone",wiki:"Alexander_Mahone"},
    {q:"I'm a physicist from Caltech who couldn't talk to women without alcohol for years",a:"Raj Koothrappali",wiki:"Raj_Koothrappali"},
    {q:"I was once One at Hawkins Lab, and now I haunt minds from the Upside Down",a:"Vecna",wiki:"Vecna_(Stranger_Things)"},
    {q:"I run Los Pollos Hermanos, smile politely, and build a ruthless drug empire in secret",a:"Gus Fring",wiki:"Gus_Fring"},
    {q:"I'm the witty youngest Lannister, and I survive by thinking faster than everyone else",a:"Tyrion Lannister",wiki:"Tyrion_Lannister"},
    {q:"I blow up the Sept of Baelor and rule King's Landing with fear and wildfire",a:"Cersei Lannister",wiki:"Cersei_Lannister"},
    {q:"I start as a pawn in royal politics and end as Queen in the North",a:"Sansa Stark",wiki:"Sansa_Stark"},
    {q:"I'm the foul-mouthed antihero of The Boys, and I want Homelander dead more than anything",a:"Billy Butcher",wiki:"Billy_Butcher"},
    {q:"I wield a bat with nails, wear sailor scoops gear, and become one of Hawkins' bravest heroes",a:"Steve Harrington",wiki:"Steve_Harrington"},
    {q:"I wear a trucker cap, love pudding, and survive every nightmare Hawkins throws at me",a:"Dustin Henderson",wiki:"Dustin_Henderson"},
    {q:"I work reception at Dunder Mifflin, paint murals, and marry Jim",a:"Pam Beesly",wiki:"Pam_Beesly"},
    {q:"I stare into the camera, prank Dwight, and somehow charm the entire office",a:"Jim Halpert",wiki:"Jim_Halpert"},
  ],
  600:[
    {q:"I moved from Canada to New York, became a news anchor, and somehow dated two best friends",a:"Robin Scherbatsky",wiki:"Robin_Scherbatsky"},
    {q:"I love waffles, public service, and the city of Pawnee more than almost anyone alive",a:"Leslie Knope",wiki:"Leslie_Knope"},
    {q:"I'm a fixer with a code, a parking booth, and a stare that makes everyone nervous",a:"Mike Ehrmantraut",wiki:"Mike_Ehrmantraut"},
    {q:"I use sarcasm as a survival mechanism, hate Thanksgiving in a box, and once lived in a box",a:"Chandler Bing",wiki:"Chandler_Bing"},
    {q:"I'm obsessively organized, fiercely competitive, and the chef of the Friends group",a:"Monica Geller",wiki:"Monica_Geller"},
    {q:"I'm delightfully weird, sing about smelly cats, and think outside every possible box",a:"Phoebe Buffay",wiki:"Phoebe_Buffay"},
    {q:"I'm a paleontologist who says we were on a break, and I'm the brother in the group",a:"Ross Geller",wiki:"Ross_Geller"},
    {q:"How you doin'? I'm the struggling actor of the group who loves sandwiches and auditioning",a:"Joey Tribbiani",wiki:"Joey_Tribbiani"},
    {q:"I started as the girl across the hall and ended up becoming one of the group's sharpest voices",a:"Penny",wiki:"Penny_(The_Big_Bang_Theory)"},
    {q:"I'm an architect who tells the long story of how I met your mother",a:"Ted Mosby",wiki:"Ted_Mosby"},
  ],
  },

  who_anime_character:{label:"Which Anime Character Am I?",icon:"\uD83C\uDF38",color:"#DB2777",isWhoAmI:true,
  200:[
    {q:"I defeated a monster in one punch and lost all my hair from training too hard - I'm a hero for fun",a:"Saitama",wiki:"Saitama_(One-Punch_Man)"},
    {q:"I'm a ninja who contains a nine-tailed fox, I eat ramen, and I want to be Hokage",a:"Naruto Uzumaki",wiki:"Naruto_Uzumaki"},
    {q:"I'm a student who found a book that kills anyone whose name I write, and I call myself a god of justice",a:"Light Yagami",wiki:"Light_Yagami"},
    {q:"I am the Attack Titan, and my pursuit of freedom turns me into the world's greatest threat",a:"Eren Yeager",wiki:"Eren_Yeager"},
    {q:"I'm humanity's strongest soldier, I clean obsessively, and I never waste words",a:"Levi Ackerman",wiki:"Levi_Ackerman"},
    {q:"I'm a demon slayer with a checkered haori, and my sister became a demon",a:"Tanjiro Kamado",wiki:"Tanjiro_Kamado"},
    {q:"I'm the proud prince of all Saiyans, and my rivalry with Goku defines my life",a:"Vegeta",wiki:"Vegeta_(Dragon_Ball)"},
    {q:"I swallowed a cursed finger and became the vessel of the King of Curses",a:"Yuji Itadori",wiki:"Yuji_Itadori"},
    {q:"I'm the Symbol of Peace, and I pass my power to a quirkless student",a:"All Might",wiki:"All_Might"},
    {q:"I'm a pirate captain with a straw hat, a rubber body, and a dream of becoming Pirate King",a:"Monkey D. Luffy",wiki:"Monkey_D._Luffy"},
    {q:"I'm a substitute Soul Reaper with orange hair and a giant sword",a:"Ichigo Kurosaki",wiki:"Ichigo_Kurosaki"},
    {q:"I'm an assassin from the Zoldyck family, and electricity is one of my favorite ways to fight",a:"Killua Zoldyck",wiki:"Killua_Zoldyck"},
    {q:"I'm a young Hunter searching for my father while finding monsters far worse than him",a:"Gon Freecss",wiki:"Gon_Freecss"},
    {q:"I'm the three-sword style master of the Straw Hats, and I aim to become the world's greatest swordsman",a:"Roronoa Zoro",wiki:"Roronoa_Zoro"},
    {q:"I'm the navigator of the Straw Hats, and weather itself becomes my weapon",a:"Nami",wiki:"Nami_(One_Piece)"},
  ],
  400:[
    {q:"I am the Chimera Ant king who learned humanity through a board game and a blind girl",a:"Meruem",wiki:"Meruem"},
    {q:"I destroyed Konoha to teach the world pain and believed suffering was the path to peace",a:"Pain (Nagato)",wiki:"Nagato_(Naruto)"},
    {q:"I am a god of destruction who sleeps often, eats well, and can erase planets casually",a:"Beerus",wiki:"Beerus"},
    {q:"I am Goku's eldest son, and my hidden potential makes me terrifying when fully unleashed",a:"Gohan",wiki:"Gohan"},
    {q:"I am the Flame Hashira whose final stand aboard the Mugen Train broke everyone's heart",a:"Kyojuro Rengoku",wiki:"Kyojuro_Rengoku"},
    {q:"I'm the strongest jujutsu sorcerer alive, and my blindfold hides the Six Eyes",a:"Satoru Gojo",wiki:"Satoru_Gojo"},
    {q:"I'm a wandering swordsman of the Meiji era who vowed never to kill again",a:"Kenshin Himura",wiki:"Kenshin_Himura"},
    {q:"I am the King of Curses, and even inside another body I dominate every room I enter",a:"Ryomen Sukuna",wiki:"Ryomen_Sukuna"},
    {q:"I am Zero, the exiled prince who gains a power that can command anyone once",a:"Lelouch vi Britannia",wiki:"Lelouch_vi_Britannia"},
    {q:"I am a bio-engineered monster made from the cells of the strongest fighters in Dragon Ball",a:"Cell",wiki:"Cell_(Dragon_Ball)"},
    {q:"I am the gentleman hero of JoJo Part 1, and my battle style channels sunlight through breathing",a:"Jonathan Joestar",wiki:"Jonathan_Joestar"},
    {q:"I lost limbs, armor, and my childhood body because of alchemy, and I search for the Philosopher's Stone",a:"Edward Elric",wiki:"Edward_Elric"},
    {q:"I copy a thousand jutsu, hide one Sharingan under my headband, and read romance novels constantly",a:"Kakashi Hatake",wiki:"Kakashi_Hatake"},
    {q:"I wear a long coat, a cap fused to my hair, and my Stand can stop time",a:"Jotaro Kujo",wiki:"Jotaro_Kujo"},
    {q:"I'm the bloodthirsty devil hunter who loves chaos, cats, and causing exactly the wrong kind of trouble",a:"Power",wiki:"Power_(Chainsaw_Man)"},
  ],
  600:[
    {q:"I am a legendary Pokemon said to have shaped the universe itself",a:"Arceus",wiki:"Arceus"},
    {q:"I came from a cruel family, rejected my humanity, and became JoJo's most infamous vampire",a:"Dio Brando",wiki:"Dio_Brando"},
    {q:"I manipulated the entire shinobi world from the shadows and declared the Infinite Tsukuyomi",a:"Madara Uchiha",wiki:"Madara_Uchiha"},
    {q:"I betrayed Soul Society with perfect calm, and my zanpakuto turns perception itself into a trap",a:"Sosuke Aizen",wiki:"Sosuke_Aizen"},
    {q:"I was once the White Hawk, and my ambition turned me into something monstrous",a:"Griffith",wiki:"Griffith_(Berserk)"},
    {q:"I carry a massive sword, a branded destiny, and more trauma than almost any hero in manga",a:"Guts",wiki:"Guts_(Berserk)"},
    {q:"I fuse with a chainsaw devil and chase the simplest dreams in the bloodiest possible world",a:"Denji",wiki:"Denji_(Chainsaw_Man)"},
    {q:"I am fiercely loyal to Eren, unmatched with ODM gear, and one of humanity's deadliest soldiers",a:"Mikasa Ackerman",wiki:"Mikasa_Ackerman"},
    {q:"I sit crouched, eat sweets, and outthink nearly everyone in Death Note",a:"L",wiki:"L_(Death_Note)"},
    {q:"I carry the curse of the Uchiha clan, seek power through revenge, and eventually fight beside Naruto again",a:"Sasuke Uchiha",wiki:"Sasuke_Uchiha"},
  ],
  },

  who_movie_character:{label:"Which Movie Character Am I?",icon:"\uD83C\uDFAC",color:"#7C3AED",isWhoAmI:true,
  200:[
    {q:"I built the Iron Man suit in a cave, I have an AI named JARVIS, and I said I am Iron Man",a:"Tony Stark",wiki:"Iron_Man_(Marvel_Cinematic_Universe)"},
    {q:"I grew up on a moisture farm on Tatooine, discovered the Force, and learned my father was Darth Vader",a:"Luke Skywalker",wiki:"Luke_Skywalker"},
    {q:"I am a mermaid princess who traded my voice for a chance to live on land",a:"Ariel",wiki:"Ariel_(The_Little_Mermaid)"},
    {q:"I'm the lion prince of the Pride Lands, and I return home to reclaim my kingdom",a:"Simba",wiki:"Simba"},
    {q:"I'm a practically perfect nanny who flies with an umbrella and changes a family's life",a:"Mary Poppins",wiki:"Mary_Poppins_(character)"},
    {q:"I'm a green ogre from a swamp, and I remind everyone that ogres have layers",a:"Shrek",wiki:"Shrek_(character)"},
    {q:"I'm the cowboy toy who feels threatened when Buzz arrives in Andy's room",a:"Woody",wiki:"Woody_(Toy_Story)"},
    {q:"I'm the girl chosen by the ocean to sail across the sea and restore Te Fiti's heart",a:"Moana",wiki:"Moana_(Disney)"},
    {q:"I'm a lonely trash-compacting robot who finds purpose after meeting EVE",a:"WALL-E",wiki:"WALL-E_(character)"},
    {q:"I believe wiping out half the universe is mercy, and I wear the Infinity Gauntlet",a:"Thanos",wiki:"Thanos"},
    {q:"I take the red pill, dodge bullets, and learn I am The One",a:"Neo",wiki:"Neo_(The_Matrix)"},
    {q:"I let it go, build an ice palace, and fear hurting everyone I love",a:"Elsa",wiki:"Elsa_(Frozen)"},
    {q:"I am the wise king of the Pride Lands, and I teach my son about the circle of life",a:"Mufasa",wiki:"Mufasa"},
    {q:"I wear black armor, command the Empire, and reveal one of cinema's most famous family secrets",a:"Darth Vader",wiki:"Darth_Vader"},
    {q:"I'm a teenage superhero balancing school, queens, and neighborhood crime in the MCU",a:"Spider-Man",wiki:"Spider-Man_(Marvel_Cinematic_Universe)"},
  ],
  400:[
    {q:"I'm a terminator sent from the future, and I tell people I'll be back",a:"The Terminator (T-800)",wiki:"Terminator_(character)"},
    {q:"I'm an elite hitman whose retirement ends after my dog is killed",a:"John Wick",wiki:"John_Wick_(character)"},
    {q:"I hide deep in the jungle, talk about napalm in the morning, and become the dark heart of Apocalypse Now",a:"Colonel Kurtz",wiki:"Colonel_Kurtz"},
    {q:"I'm a cannibal psychiatrist whose polite manners hide a terrifying mind",a:"Hannibal Lecter",wiki:"Hannibal_Lecter"},
    {q:"I'm an obsessive fan who traps her favorite writer in a remote house",a:"Annie Wilkes",wiki:"Annie_Wilkes"},
    {q:"I'm a mutant mastermind who can control metal and lead whole nations of followers",a:"Magneto",wiki:"Magneto_(film_series_character)"},
    {q:"I flip coins for fate, use a cattle gun, and walk through No Country for Old Men like death itself",a:"Anton Chigurh",wiki:"Anton_Chigurh"},
    {q:"I created Jurassic Park believing wonder would beat chaos, and I was very wrong",a:"John Hammond",wiki:"John_Hammond_(Jurassic_Park)"},
    {q:"I descend into madness as Gotham embraces me, and the world knows me as Joker",a:"Arthur Fleck (Joker)",wiki:"Joker_(2019_film)"},
    {q:"I carry a fedora, a whip, and a lifelong talent for running from giant disasters",a:"Indiana Jones",wiki:"Indiana_Jones_(character)"},
    {q:"I accept impossible missions, sprint across rooftops, and somehow survive every one of them",a:"Ethan Hunt",wiki:"Ethan_Hunt"},
    {q:"I go from small-time boxer to one of cinema's most iconic underdogs",a:"Rocky Balboa",wiki:"Rocky_Balboa"},
    {q:"I volunteer for my sister, survive the Hunger Games, and become the Mockingjay",a:"Katniss Everdeen",wiki:"Katniss_Everdeen"},
    {q:"I mentor Neo, wear dark glasses, and explain the Matrix to the audience",a:"Morpheus",wiki:"Morpheus_(The_Matrix)"},
    {q:"I split my soul into Horcruxes, fear love itself, and the wizarding world knows me as the Dark Lord",a:"Voldemort",wiki:"Voldemort"},
  ],
  600:[
    {q:"I am the feared patriarch of the Corleone family, and people still come to me on the day of my daughter's wedding",a:"Vito Corleone",wiki:"Vito_Corleone"},
    {q:"I ride a hoverboard, travel through time in a DeLorean, and accidentally wreck history more than once",a:"Marty McFly",wiki:"Marty_McFly"},
    {q:"I survive Judgment Day more than once and raise the future leader of the resistance",a:"Sarah Connor",wiki:"Sarah_Connor_(Terminator)"},
    {q:"In space, no one can hear me scream - I survive the xenomorph by being tougher than everyone else",a:"Ripley",wiki:"Ripley_(Alien)"},
    {q:"I hunt Buffalo Bill with Hannibal Lecter's help and become one of the FBI's most famous agents",a:"Clarice Starling",wiki:"Clarice_Starling"},
    {q:"I pilot the Millennium Falcon, brag about the Kessel Run, and definitely shoot first",a:"Han Solo",wiki:"Han_Solo"},
    {q:"I wield thunder, fly with a hammer, and eventually learn I was never the god of hammers",a:"Thor",wiki:"Thor_(Marvel_Cinematic_Universe)"},
    {q:"I return every 27 years to feed on fear and often wear a clown's smile",a:"Pennywise",wiki:"Pennywise_(character)"},
    {q:"I build an empire out of newspapers, vanity, and one word: Rosebud",a:"Charles Foster Kane",wiki:"Charles_Foster_Kane"},
    {q:"Yippee-ki-yay - I'm the cop who keeps surviving impossible situations in the wrong place at the wrong time",a:"John McClane",wiki:"John_McClane"},
  ],
  },

};

const POINT_VALUES = [200,400,600];
const TILES_PER_TIER = 2;

function normalizeQuestionKeyPart(value){
  return String(value??"")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g,"")
    .replace(/\s+/g," ")
    .trim();
}

const WHO_AM_I_TIER_OVERRIDES = {
  who_tv_character: {
    200: [
      "Walter_White_(Breaking_Bad)",
      "Michael_Scofield",
      "Daenerys_Targaryen",
      "Sheldon_Cooper",
      "Dexter_Morgan",
      "Ragnar_Lothbrok",
      "Barry_Allen_(Arrowverse)",
      "Rick_Grimes",
      "Harvey_Specter",
      "Negan",
      "Eleven_(Stranger_Things)",
      "Jon_Snow_(character)",
      "Michael_Scott_(The_Office)",
      "Dwight_Schrute",
      "Saul_Goodman",
      "Chandler_Bing",
      "Monica_Geller",
      "Phoebe_Buffay",
      "Ross_Geller",
      "Joey_Tribbiani",
      "Ted_Mosby",
      "Penny_(The_Big_Bang_Theory)",
      "Lorelai_Gilmore",
      "Rory_Gilmore",
      "Marshall_Eriksen",
    ],
    400: [
      "Skyler_White",
      "Night_King",
      "Rachel_Zane",
      "Alexander_Mahone",
      "Raj_Koothrappali",
      "Vecna_(Stranger_Things)",
      "Gus_Fring",
      "Tyrion_Lannister",
      "Cersei_Lannister",
      "Sansa_Stark",
      "Billy_Butcher",
      "Steve_Harrington",
      "Dustin_Henderson",
      "Pam_Beesly",
      "Jim_Halpert",
      "Leonard_Hofstadter",
      "Leslie_Knope",
      "Mike_Ehrmantraut",
      "Don_Draper",
      "Tommy_Shelby",
      "Gregory_House",
      "Olivia_Benson",
      "Peggy_Olson",
      "Rick_Sanchez",
    ],
    600: [
      "Stringer_Bell",
      "Fox_Mulder",
      "Buffy_Summers",
      "Adrian_Monk",
      "Veronica_Mars",
      "Blair_Waldorf",
      "Moira_Rose",
      "Omar_Little",
      "Frasier_Crane",
    ],
  },
  who_anime_character: {
    200: [
      "Saitama_(One-Punch_Man)",
      "Naruto_Uzumaki",
      "Light_Yagami",
      "Eren_Yeager",
      "Levi_Ackerman",
      "Tanjiro_Kamado",
      "Vegeta_(Dragon_Ball)",
      "Yuji_Itadori",
      "All_Might",
      "Monkey_D._Luffy",
      "Ichigo_Kurosaki",
      "Killua_Zoldyck",
      "Gon_Freecss",
      "Roronoa_Zoro",
      "Nami_(One_Piece)",
      "Ash_Ketchum",
      "Inuyasha_(character)",
      "Sailor_Moon",
      "Mikasa_Ackerman",
      "L_(Death_Note)",
    ],
    400: [
      "Meruem",
      "Nagato_(Naruto)",
      "Beerus",
      "Gohan",
      "Kyojuro_Rengoku",
      "Satoru_Gojo",
      "Kenshin_Himura",
      "Ryomen_Sukuna",
      "Lelouch_vi_Britannia",
      "Cell_(Dragon_Ball)",
      "Jonathan_Joestar",
      "Edward_Elric",
      "Kakashi_Hatake",
      "Jotaro_Kujo",
      "Power_(Chainsaw_Man)",
      "Vash_the_Stampede",
      "Yugi_Muto",
      "Seto_Kaiba",
      "Bulma",
      "Sanji_(One_Piece)",
      "Rimuru_Tempest",
      "Spike_Spiegel",
      "Sasuke_Uchiha",
      "Sailor_Mars",
    ],
    600: [
      "Arceus",
      "Dio_Brando",
      "Madara_Uchiha",
      "Sosuke_Aizen",
      "Griffith_(Berserk)",
      "Guts_(Berserk)",
      "Denji_(Chainsaw_Man)",
      "Rei_Ayanami",
      "Motoko_Kusanagi",
      "Asuka_Langley_Soryu",
      "Natsu_Dragneel",
      "Kenshiro",
      "Gintoki_Sakata",
    ],
  },
  who_movie_character: {
    200: [
      "Iron_Man_(Marvel_Cinematic_Universe)",
      "Luke_Skywalker",
      "Ariel_(The_Little_Mermaid)",
      "Simba",
      "Mary_Poppins_(character)",
      "Shrek_(character)",
      "Woody_(Toy_Story)",
      "Moana_(Disney)",
      "WALL-E_(character)",
      "Thanos",
      "Neo_(The_Matrix)",
      "Elsa_(Frozen)",
      "Mufasa",
      "Darth_Vader",
      "Spider-Man_(Marvel_Cinematic_Universe)",
      "Forrest_Gump",
      "Hermione_Granger",
      "Captain_Jack_Sparrow",
      "Han_Solo",
      "Princess_Leia",
    ],
    400: [
      "Terminator_(character)",
      "John_Wick_(character)",
      "Indiana_Jones_(character)",
      "Ethan_Hunt",
      "Rocky_Balboa",
      "Katniss_Everdeen",
      "Morpheus_(The_Matrix)",
      "Voldemort",
      "Marty_McFly",
      "Sarah_Connor_(Terminator)",
      "John_McClane",
      "Thor_(Marvel_Cinematic_Universe)",
      "T-1000",
      "The_Bride_(Kill_Bill)",
      "Mia_Wallace",
      "Maximus_Decimus_Meridius",
      "Dorothy_Gale",
      "Willy_Wonka",
      "Tony_Montana",
      "Trinity_(The_Matrix)",
      "Ferris_Bueller",
    ],
    600: [
      "Colonel_Kurtz",
      "Hannibal_Lecter",
      "Annie_Wilkes",
      "Anton_Chigurh",
      "John_Hammond_(Jurassic_Park)",
      "Joker_(2019_film)",
      "Vito_Corleone",
      "Ripley_(Alien)",
      "Clarice_Starling",
      "Pennywise_(character)",
      "Charles_Foster_Kane",
      "Patrick_Bateman",
      "Lisbeth_Salander",
      "Randle_McMurphy",
      "Travis_Bickle",
    ],
  },
};

function applyWhoAmIDifficultyOverrides(bank){
  const rebalanced = Object.fromEntries(
    Object.entries(bank).map(([catId, cat])=>[
      catId,
      {
        ...cat,
        ...(cat[200] ? {200:[...cat[200]]} : {}),
        ...(cat[400] ? {400:[...cat[400]]} : {}),
        ...(cat[600] ? {600:[...cat[600]]} : {}),
      },
    ]),
  );

  const pointValues = [200,400,600];
  const entryId = (entry)=>normalizeQuestionKeyPart(entry?.wiki || entry?.a);

  Object.entries(WHO_AM_I_TIER_OVERRIDES).forEach(([catId, tierMap])=>{
    const cat = rebalanced[catId];
    if(!cat) return;

    const targetSets = Object.fromEntries(
      pointValues.map((pts)=>[
        pts,
        new Set((tierMap[pts] || []).map((id)=>normalizeQuestionKeyPart(id))),
      ]),
    );

    const moved = {200:[],400:[],600:[]};

    pointValues.forEach((pts)=>{
      cat[pts] = (cat[pts] || []).filter((entry)=>{
        const id = entryId(entry);
        const target = pointValues.find((value)=>targetSets[value].has(id));
        if(!target) return true;
        moved[target].push(entry);
        return false;
      });
    });

    pointValues.forEach((pts)=>{
      cat[pts] = [...moved[pts], ...(cat[pts] || [])];
    });
  });

  return rebalanced;
}

function questionPoolEntryKey(entry){
  if(entry?.code) return `code:${normalizeQuestionKeyPart(entry.code)}`;
  if(entry?.wiki) return `wiki:${normalizeQuestionKeyPart(entry.wiki)}`;
  return `qa:${normalizeQuestionKeyPart(entry?.q)}|${normalizeQuestionKeyPart(entry?.a)}`;
}

function mergeQuestionExpansions(rawBank, expansions){
  const merged = Object.fromEntries(Object.entries(rawBank).map(([catId, cat]) => [catId, { ...cat }]));
  Object.entries(expansions).forEach(([catId, catExpansion]) => {
    if (!merged[catId]) return;
    POINT_VALUES.forEach((pts) => {
      const existing = Array.isArray(merged[catId][pts]) ? merged[catId][pts] : [];
      const extra = Array.isArray(catExpansion?.[pts]) ? catExpansion[pts] : [];
      merged[catId][pts] = [...existing, ...extra];
    });
  });
  return merged;
}

const BIO_TRIVIA_CATEGORIES = new Set([
  "general",
  "geography",
  "science",
  "history",
  "sports",
  "music",
  "movies",
  "country_facts",
  "marvel",
  "dc",
  "spider_man",
  "the_flash",
]);

const SCREEN_ONLY_CATEGORIES = new Set([
  "marvel",
  "dc",
  "spider_man",
  "invincible",
  "the_boys",
  "the_flash",
]);

const NON_TRIVIA_STYLE_CATEGORIES = new Set([
  "flags",
  "country_map",
  "movie_scenes",
  "songs",
  "charades_general",
  "charades_movies",
  "movie_show_emoji",
  "country_emoji",
  "general_emoji",
  "who_footballer",
  "who_tv_character",
  "who_anime_character",
  "who_movie_character",
]);

const SCREEN_ONLY_PATTERNS = [
  /\bcomic\b/i,
  /\bcomics\b/i,
  /\bstoryline\b/i,
  /\bhouse of m\b/i,
  /\bliving tribunal\b/i,
  /\bsavage land\b/i,
  /\bphoenix force\b/i,
  /\bmolecule man\b/i,
  /\bbeyonder\b/i,
  /\bone above all\b/i,
  /\bkrakoa\b/i,
  /\brule of x\b/i,
  /\bknull\b/i,
  /\bcivil war ii\b/i,
  /\bearth-199999\b/i,
  /\bclone saga\b/i,
  /\bone more day\b/i,
  /\bgreat web\b/i,
  /\bsilk\b/i,
  /\bsymkarian\b/i,
  /\bsilver age\b/i,
  /\bblackest night\b/i,
  /\binfinite crisis\b/i,
  /\bfinal crisis\b/i,
  /\bdoomsday clock\b/i,
  /\btower of babel\b/i,
  /\bperpetua\b/i,
  /\bhypertime\b/i,
  /\bsinestro corps\b/i,
  /\bknightfall\b/i,
  /\bred son\b/i,
  /\bno man's land\b/i,
  /\bwatchmen\b/i,
  /\blater comics\b/i,
  /\bthe boys comics\b/i,
  /\bnew 52\b/i,
  /\bgrant morrison\b/i,
  /\bnew gods\b/i,
  /\bgeo-force\b/i,
  /\bthe question\b/i,
  /\bgalactus\b/i,
  /\bnegative zone\b/i,
  /\bnexus being\b/i,
  /\bkaine parker\b/i,
  /\bben reilly\b/i,
  /\bsuperior spider-man\b/i,
  /\bclone identity\b/i,
  /\bclone of peter\b/i,
  /\bdeepest lore\b/i,
];
const MANUAL_DUPLICATE_FILTER_KEYS = new Set([
  `geography||${normalizeQuestionKeyPart("Capital of Germany?")}||${normalizeQuestionKeyPart("Berlin")}`,
  `geography||${normalizeQuestionKeyPart("Capital of Japan?")}||${normalizeQuestionKeyPart("Tokyo")}`,
  `science||${normalizeQuestionKeyPart("Powerhouse of the cell?")}||${normalizeQuestionKeyPart("Mitochondria")}`,
  `science||${normalizeQuestionKeyPart("Largest planet in our solar system?")}||${normalizeQuestionKeyPart("Jupiter")}`,
  `science||${normalizeQuestionKeyPart("What does the Heisenberg Uncertainty Principle state?")}||${normalizeQuestionKeyPart("You cannot simultaneously know the exact position and momentum of a particle")}`,
  `history||${normalizeQuestionKeyPart("Year the Berlin Wall fell?")}||${normalizeQuestionKeyPart("1989")}`,
  `marvel||${normalizeQuestionKeyPart("Who plays Spider-Man in the MCU?")}||${normalizeQuestionKeyPart("Tom Holland")}`,
  `general||${normalizeQuestionKeyPart("What is the Higgs boson?")}||${normalizeQuestionKeyPart("The particle that gives other particles mass")}`,
  `general||${normalizeQuestionKeyPart("What is the Chandrasekhar limit?")}||${normalizeQuestionKeyPart("~1.4 solar masses")}`,
  `dc||${normalizeQuestionKeyPart("Who is the Reverse Flash?")}||${normalizeQuestionKeyPart("Eobard Thawne")}`,
]);
const ANSWER_OVERRIDE_BY_QKEY = new Map([
  [normalizeQuestionKeyPart("What is the offside rule in football?"), "An attacker is offside if they are beyond the second-last defender when the ball is played to them."],
  [normalizeQuestionKeyPart("What is the Eternals' true mission?"), "To protect intelligent life until a Celestial can emerge from Earth."],
  [normalizeQuestionKeyPart("What is the power system in Hunter x Hunter?"), "Nen"],
  [normalizeQuestionKeyPart("What is the Will of D?"), "A mystery tied to people with the initial D and the Void Century."],
  [normalizeQuestionKeyPart("What is the Multiverse in MCU terms?"), "An infinite set of parallel universes."],
]);

function isLongExplanationAnswer(answer){
  const normalized = `${answer || ""}`
    .replace(/[—–/(),:;]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const wordCount = normalized ? normalized.split(" ").length : 0;
  if (wordCount <= 4 && !/[—–/(),:;]/.test(answer || "")) return false;
  return /[—–/(),:;]|\bwho\b|\bwhich\b|\bthat\b|\bwith\b|\bfrom\b|\bformer\b|\bleader\b|\bruler\b|\bscientist\b|\blawyer\b|\bcaptain\b|\bking\b|\bqueen\b|\bdetective\b|\bforensic\b|\bmercenary\b|\borganization\b|\bvillain\b|\bhero\b/i.test(answer || "") || wordCount > 5;
}

function answerWordCount(answer){
  const normalized = `${answer || ""}`
    .replace(/[—–/(),:;.!?]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return normalized ? normalized.split(" ").length : 0;
}

function isStraightAnswerCategory(catId){
  return !NON_TRIVIA_STYLE_CATEGORIES.has(catId);
}

function looksLikeEssayQuestion(question){
  return /\bsignificance\b|\bdifference between\b|\bdescribe\b|\bexplain\b|\bdeeper theme\b|\bpsychological\b|\breal meaning\b|\bsatire target\b|\bcontribution\b|\bcontroversy\b|\bcosmology\b|\bdeepest lore\b|\bcritical reception\b|\bhistorical accuracy\b|\baccuracy level\b/i.test(question);
}

function looksLikeMultipartQuestion(question){
  return /\band what\b|\band why\b|\band who\b|\bdifference between\b|\bwhat opened it\b/i.test(question);
}

function normalizeTriviaQuestion(question){
  return `${question || ""}`
    .trim()
    .replace(/\s+and what opened it\?$/i, "?")
    .replace(/\s+and why is it remarkable\?$/i, "?")
    .replace(/\s+and why was it controversial\?$/i, "?")
    .replace(/\s+and why is it important\?$/i, "?")
    .replace(/\s+and what is it\?$/i, "?")
    .replace(/\s+and what are they\?$/i, "?")
    .replace(/\s+and who are they\?$/i, "?");
}

function normalizeTriviaAnswer(answer, question=""){
  let text = `${answer || ""}`.trim();
  if(!text) return text;
  const q = `${question || ""}`.trim();
  text = text
    .replace(/\s+[—-]\s+(played by|portrayed by|voice(?:d)? by|known for|representing|revealing|symboli[sz]ing|filling the gap|becoming|leading to|causing|showing|explaining).*/i, "")
    .replace(/\s+[—-]\s+(confirmed|opened|launched|populari[sz]ed|echoes|illustrates|counts as|used in|spanning|reportedly|debat(?:ed|able)|first hint|key proof|linked to|driving|affecting).*/i, "")
    .replace(/\s+\((?:as of|official|opened|confirmed|reported|approx|approximately|debat(?:ed|able)|in the mcu|in comics)[^)]*\)$/i, "")
    .replace(/\s+\[(?:as of|official)[^\]]*\]$/i, "")
    .trim();
  return text;
}

function normalizeQuestionEntry(entry, catId){
  if(!entry || typeof entry !== "object") return entry;
  if(!isStraightAnswerCategory(catId)) return { ...entry };
  const normalizedQuestion = normalizeTriviaQuestion(entry.q);
  const answerOverride = ANSWER_OVERRIDE_BY_QKEY.get(normalizeQuestionKeyPart(normalizedQuestion));
  return {
    ...entry,
    q: normalizedQuestion,
    a: answerOverride || normalizeTriviaAnswer(entry.a, entry.q),
  };
}

function shouldFilterQuestion(entry, catId){
  const q = `${entry?.q || ""}`.trim();
  const a = `${entry?.a || ""}`.trim();
  if (!q) return false;
  if(MANUAL_DUPLICATE_FILTER_KEYS.has(`${catId}||${normalizeQuestionKeyPart(q)}||${normalizeQuestionKeyPart(a)}`)) return true;
  if (/\bsignificance\b/i.test(q)) return true;
  if (
    isStraightAnswerCategory(catId) &&
    /^(who is|who was|who are|who were)\b/i.test(q) &&
    (isLongExplanationAnswer(a) || answerWordCount(a) > 4)
  ){
    return true;
  }
  if (
    SCREEN_ONLY_CATEGORIES.has(catId) &&
    SCREEN_ONLY_PATTERNS.some((pattern)=>pattern.test(q) || pattern.test(a))
  ){
    return true;
  }
  if (
    isStraightAnswerCategory(catId) &&
    looksLikeEssayQuestion(q) &&
    (isLongExplanationAnswer(a) || answerWordCount(a) > 6)
  ){
    return true;
  }
  if (
    isStraightAnswerCategory(catId) &&
    looksLikeMultipartQuestion(q) &&
    (isLongExplanationAnswer(a) || answerWordCount(a) > 7)
  ){
    return true;
  }
  if (
    isStraightAnswerCategory(catId) &&
    /\bvs\b|\bdifference\b/i.test(q)
  ){
    return true;
  }
  if (
    isStraightAnswerCategory(catId) &&
    /^what happened to\b/i.test(q) &&
    (isLongExplanationAnswer(a) || answerWordCount(a) > 8)
  ){
    return true;
  }
  if (
    isStraightAnswerCategory(catId) &&
    (/^list\b/i.test(q) || /^name all\b/i.test(q))
  ){
    return true;
  }
  if (
    isStraightAnswerCategory(catId) &&
    /\barc\b|\btheme\b|\bmessage\b|\bwhat does .* say about\b/i.test(q) &&
    (isLongExplanationAnswer(a) || answerWordCount(a) > 7)
  ){
    return true;
  }
  return false;
}

function applyQuestionStyleFilters(rawBank){
  const next = Object.fromEntries(Object.entries(rawBank).map(([catId, cat]) => [catId, { ...cat }]));
  Object.entries(next).forEach(([catId, cat]) => {
    POINT_VALUES.forEach((pts) => {
      const pool = Array.isArray(cat[pts]) ? cat[pts] : [];
      cat[pts] = pool
        .map((entry) => normalizeQuestionEntry(entry, catId))
        .filter((entry) => !shouldFilterQuestion(entry, catId));
    });
  });
  return next;
}

function applyHardCharadesOverrides(rawBank){
  const next = Object.fromEntries(Object.entries(rawBank).map(([catId, cat]) => [catId, { ...cat }]));
  Object.entries(CHARADES_HARD_OVERRIDES).forEach(([catId, tierPool]) => {
    if (!next[catId]) return;
    next[catId] = { ...next[catId], 600: Array.isArray(tierPool) ? tierPool : next[catId][600] };
  });
  return next;
}

function sanitizeBank(rawBank){
  return Object.fromEntries(
    Object.entries(rawBank).map(([catId,cat])=>{
      const seenInCategory=new Set();
      const nextCat={...cat};
      POINT_VALUES.forEach(pts=>{
        const pool=Array.isArray(cat[pts])?cat[pts]:[];
        const deduped=[];
        pool.forEach(entry=>{
          const key=questionPoolEntryKey(entry);
          if(seenInCategory.has(key)){
            console.warn(`Removed duplicate question from ${catId} ${pts}: ${entry?.a||entry?.q||key}`);
            return;
          }
          seenInCategory.add(key);
          deduped.push({...entry,_qkey:key,_qid:`${catId}:${pts}:${key}`});
        });
        if(deduped.length<TILES_PER_TIER){
          throw new Error(`Category "${catId}" tier ${pts} must contain at least ${TILES_PER_TIER} unique questions`);
        }
        nextCat[pts]=deduped;
      });
      return [catId,nextCat];
    })
  );
}

function mergeTierLists(baseTier, additionsTier){
  const base = Array.isArray(baseTier) ? baseTier : [];
  const additions = Array.isArray(additionsTier) ? additionsTier : [];
  return [...base, ...additions];
}

function mergeStandaloneCategory(baseCategory, additions){
  if(!baseCategory) return additions || null;
  if(!additions) return baseCategory;
  const next={...baseCategory};
  POINT_VALUES.forEach((pts)=>{
    next[pts]=mergeTierLists(baseCategory?.[pts], additions?.[pts]);
  });
  return next;
}

function applyCategoryOverrides(bank, overrides){
  const next={...bank};
  Object.entries(overrides).forEach(([catId, value])=>{
    next[catId]=value;
  });
  return next;
}

const BANK = sanitizeBank(
  applyWhoAmIDifficultyOverrides(
    applyHardCharadesOverrides(
      applyQuestionStyleFilters(
        applyCategoryOverrides(
          mergeQuestionExpansions(
            mergeQuestionExpansions(
              mergeQuestionExpansions(
                mergeQuestionExpansions(
                  mergeQuestionExpansions(
                    mergeQuestionExpansions(
                      mergeQuestionExpansions(
                        mergeQuestionExpansions(
                          mergeQuestionExpansions(RAW_BANK, QUESTION_EXPANSIONS),
                          QUESTION_MINIMUMS,
                        ),
                        TRIVIA_MEGA_EXPANSIONS,
                      ),
                      TRIVIA_ULTRA_EXPANSIONS,
                    ),
                    TRIVIA_TIER_BALANCE_EXPANSIONS,
                  ),
                  QUESTION_REFINEMENT_ADDITIONS,
                ),
                TRIVIA_TIER_PARITY_EXPANSIONS,
              ),
              TRIVIA_TIER_FINAL_PARITY_EXPANSIONS,
            ),
            TRIVIA_TIER_FINAL_TOPOFF_EXPANSIONS,
          ),
          { songs: mergeStandaloneCategory(SONG_CLIP_BANK, SONG_CLIP_ADDITIONS) },
        ),
      ),
    ),
  ),
);
const CAT_IDS = Object.keys(BANK);

const CAT_GROUPS = [
  { label:"\u{1F9E0} General", ids:["general","geography","science","history","sports","music","movies","pop_culture","technology","movie_scenes","songs","flags","country_facts","country_map"] },
  { label:"\u{1F642} Emoji Guess", ids:["movie_show_emoji","country_emoji","general_emoji"] },
  { label:"\u{1F3AC} Fiction", ids:["friends","the_office","breaking_bad","game_thrones","stranger_things","prison_break","big_bang_theory","brooklyn_99","the_walking_dead","suits","dexter","vikings","the_flash","marvel","dc","star_wars","spider_man","invincible","the_boys","harry_potter","lord_rings","disney","family_guy","himym","modern_family","blacklist","arrow"] },
  { label:"\u{1F338} Anime", ids:["anime","dragon_ball","one_piece_show","solo_leveling","pokemon"] },
  { label:"\u{1F3AE} Gaming", ids:["video_games","fortnite","valorant","ark_survival","minecraft"] },
  { label:"\u{1F5BC}\uFE0F Who Am I?", ids:["who_footballer","who_tv_character","who_anime_character","who_movie_character","who_historic_figure","who_animal"] },
  { label:"\u{1F3AD} Charades", ids:["charades_general","charades_movies","charades_scenarios"] },
];

const CATEGORY_PREVIEWS = {
  movie_show_emoji:{src:"/category-previews/movie_show_emoji.svg",boardSrc:"/board-center-images/movie_show_emoji.png",fit:"cover",boardFit:"cover",boardPosition:"center",boardBg:"#080A10",caption:"Emoji titles"},
  country_emoji:{src:"/category-previews/country_emoji.svg",boardSrc:"/board-center-images/country_emoji.png",fit:"cover",boardFit:"cover",boardPosition:"center",boardBg:"#080A10",caption:"Emoji nations"},
  general_emoji:{src:"/category-previews/general_emoji.svg",boardSrc:"/board-center-images/general_emoji.png",fit:"cover",boardFit:"cover",boardPosition:"center",boardBg:"#080A10",caption:"Emoji puzzles"},
  general:{src:"/category-previews/general.jpg",boardSrc:"/board-center-images/general.png",fit:"cover",boardFit:"cover",boardPosition:"center",boardBg:"#080A10",caption:"Brain teasers"},
  geography:{src:"/category-previews/geography.jpg",boardSrc:"/board-center-images/geography.png",fit:"cover",boardFit:"cover",boardPosition:"center",boardBg:"#080A10",caption:"World clues"},
  science:{src:"/category-previews/science.jpg",boardSrc:"/board-center-images/science.png",fit:"cover",position:"center top",boardFit:"cover",boardPosition:"center",boardBg:"#080A10",caption:"Facts & formulas"},
  history:{src:"/category-previews/history.jpg",boardSrc:"/board-center-images/history.png",fit:"cover",boardFit:"cover",boardPosition:"center",boardBg:"#080A10",caption:"People and events"},
  sports:{src:"/whoami/lionel-messi-4579e864.jpg",fit:"cover",cardPosition:"center top",caption:"Legends & records"},
  music:{src:"/category-previews/music.png",fit:"cover",position:"center top",caption:"Artists & sounds"},
  movies:{src:"/whoami/han-solo-2b971bca.jpg",fit:"cover",position:"center top",caption:"Screen classics"},
  movie_scenes:{src:"/whoami/john-wick-character-755fd66c.jpeg",fit:"cover",position:"center",caption:"Watch and guess"},
  songs:{src:"/category-previews/songs.png",boardSrc:"/board-center-images/songs.png",fit:"contain",cardFit:"cover",cardPosition:"center",boardFit:"cover",boardPosition:"center",boardBg:"#080A10",bg:"#FFFFFF",caption:"Listen and guess"},
  flags:{src:"/flags/jp.svg",fit:"contain",boardFit:"cover",bg:"#FFFFFF",caption:"Spot the flag"},
  country_facts:{src:"/category-previews/country_facts.svg",boardSrc:"/board-center-images/country_facts.png",fit:"cover",boardFit:"cover",boardPosition:"center",boardBg:"#080A10",caption:"Nation clues"},
  country_map:{src:"/country-maps/au.svg",boardSrc:"/board-center-images/country_map.png",fit:"contain",cardFit:"cover",cardPosition:"center",boardFit:"cover",boardPosition:"center",boardBg:"#080A10",bg:"#FFFFFF",caption:"Guess the map"},
  friends:{src:"/whoami/monica-geller-b4be7916.jpg",fit:"cover",cardPosition:"center top",caption:"Sitcom moments"},
  the_office:{src:"/whoami/michael-scott-the-office-e7eb964a.png",fit:"cover",cardPosition:"center top",caption:"Dunder Mifflin"},
  breaking_bad:{src:"/whoami/walter-white-breaking-bad-f9425159.png",fit:"cover",caption:"Blue crystal chaos"},
  game_thrones:{src:"/whoami/jon-snow-character-b50803c7.png",fit:"cover",position:"center top",caption:"Westeros lore"},
  stranger_things:{src:"/whoami/eleven-stranger-things-c843d7fa.png",fit:"cover",caption:"Upside Down"},
  prison_break:{src:"/whoami/michael-scofield-cd88268f.jpeg",boardSrc:"/board-center-images/prison_break.png",fit:"cover",boardFit:"cover",boardPosition:"center",boardBg:"#080A10",caption:"Fox River escape"},
  big_bang_theory:{src:"/whoami/sheldon-cooper-e10500a1.jpg",boardSrc:"/board-center-images/big_bang_theory.png",fit:"cover",boardFit:"cover",boardPosition:"center",boardBg:"#080A10",caption:"Geek comedy"},
  brooklyn_99:{src:"/category-previews/brooklyn_99.jpg",boardSrc:"/board-center-images/brooklyn_99.png",fit:"cover",boardFit:"cover",boardPosition:"center",boardBg:"#080A10",caption:"Cops and chaos"},
  the_walking_dead:{src:"/whoami/rick-grimes-87e8bed9.jpg",fit:"cover",cardPosition:"center top",caption:"Zombie survival"},
  suits:{src:"/whoami/harvey-specter-c7c60178.jpg",fit:"cover",cardPosition:"center top",caption:"Sharp suits"},
  dexter:{src:"/whoami/dexter-morgan-6bc67b63.webp",fit:"cover",cardPosition:"center top",caption:"Dark passenger"},
  vikings:{src:"/whoami/ragnar-lothbrok-bbe3f500.jpg",boardSrc:"/board-center-images/vikings.png",fit:"cover",boardFit:"cover",boardPosition:"center",boardBg:"#080A10",caption:"Raids and kings"},
  the_flash:{src:"/whoami/barry-allen-arrowverse-86ade936.jpg",fit:"cover",cardPosition:"center top",caption:"Speedster stories"},
  marvel:{src:"/whoami/iron-man-marvel-cinematic-universe-b1c7fa37.jpg",fit:"cover",cardPosition:"center top",caption:"Heroes & villains"},
  dc:{src:"/whoami/joker-2019-film-7e27b124.jpg",fit:"cover",boardFit:"cover",boardPosition:"center",caption:"Gotham and beyond"},
  star_wars:{src:"/whoami/darth-vader-e064b5bd.jpg",fit:"cover",cardPosition:"center top",caption:"A galaxy far away"},
  spider_man:{src:"/whoami/spider-man-marvel-cinematic-universe-5aecfc64.jpg",fit:"cover",cardPosition:"center top",caption:"Web-slinger lore"},
  invincible:{src:"/category-previews/invincible.jpg",fit:"cover",caption:"Viltrum and Earth"},
  the_boys:{src:"/whoami/billy-butcher-88ef1818.jpg",fit:"cover",caption:"Supes gone bad"},
  harry_potter:{src:"/whoami/hermione-granger-f6f4b3e2.jpg",fit:"cover",cardPosition:"center top",caption:"Wizarding world"},
  lord_rings:{src:"/category-previews/lord_rings.jpg",fit:"cover",cardPosition:"center top",caption:"Quests and rings"},
  disney:{src:"/whoami/moana-disney-a6cd63fc.png",fit:"cover",cardPosition:"center top",caption:"Animated favorites"},
  anime:{src:"/whoami/naruto-uzumaki-1522810d.png",boardSrc:"/board-center-images/anime.png",fit:"cover",cardPosition:"center top",boardFit:"cover",boardPosition:"center",boardBg:"#080A10",caption:"Anime icons"},
  dragon_ball:{src:"/whoami/vegeta-dragon-ball-16e15e39.jpg",fit:"cover",cardPosition:"center top",caption:"Saiyan battles"},
  one_piece_show:{src:"/whoami/monkey-d-luffy-9f9354e3.png",fit:"cover",cardPosition:"center top",caption:"Pirate adventure"},
  solo_leveling:{src:"/category-previews/solo_leveling.jpg",fit:"cover",cardPosition:"center top",caption:"Dungeons and shadows"},
  pokemon:{src:"/whoami/ash-ketchum-5e3619b0.png",fit:"cover",cardPosition:"center top",caption:"Catch them all"},
  video_games:{src:"/category-previews/video_games.svg",boardSrc:"/board-center-images/video_games.png",fit:"cover",boardFit:"cover",boardPosition:"center",boardBg:"#080A10",caption:"Boss fights"},
  fortnite:{src:"/category-previews/fortnite.svg",boardSrc:"/board-center-images/fortnite.png",fit:"cover",boardFit:"cover",boardPosition:"center",boardBg:"#080A10",caption:"Drops and crowns"},
  valorant:{src:"/category-previews/valorant.png",fit:"contain",bg:"#FFFFFF",caption:"Agents and rounds"},
  who_footballer:{src:"/whoami/cristiano-ronaldo-922d9da8.jpg",fit:"cover",cardPosition:"center top",caption:"Guess the star"},
  who_tv_character:{src:"/whoami/walter-white-breaking-bad-f9425159.png",fit:"cover",caption:"Guess the face"},
  who_anime_character:{src:"/whoami/naruto-uzumaki-1522810d.png",boardSrc:"/board-center-images/who_anime_character.png",fit:"cover",cardPosition:"center top",boardFit:"cover",boardPosition:"center",boardBg:"#080A10",caption:"Anime guess"},
  who_movie_character:{src:"/whoami/han-solo-2b971bca.jpg",fit:"cover",cardPosition:"center top",caption:"Movie guess"},
  charades_general:{src:"/category-previews/charades_general.svg",boardSrc:"/board-center-images/charades_general.png",fit:"cover",boardFit:"cover",boardPosition:"center",boardBg:"#080A10",caption:"Scan and perform"},
  charades_movies:{src:"/whoami/woody-toy-story-f844064a.jpg",boardSrc:"/board-center-images/charades_movies.png",fit:"cover",cardPosition:"center top",boardFit:"cover",boardPosition:"center",boardBg:"#080A10",caption:"Movie charades"},
  pop_culture:{src:"/category-previews/pop_culture.jpg",fit:"cover",cardPosition:"center top",caption:"Trends & icons"},
  technology:{src:"/category-previews/technology.jpg",fit:"cover",cardPosition:"center",caption:"Gadgets & code"},
  family_guy:{src:"/category-previews/family_guy.jpg",fit:"cover",cardPosition:"center top",caption:"Quahog antics"},
  himym:{src:"/whoami/ted-mosby-68b46d7d.jpg",fit:"cover",cardPosition:"center top",caption:"Suit up"},
  modern_family:{src:"/category-previews/modern_family.jpg",fit:"cover",cardPosition:"center",caption:"Three families, one chaos"},
  blacklist:{src:"/category-previews/blacklist.jpg",fit:"cover",cardPosition:"center top",caption:"Criminal bargains"},
  arrow:{src:"/category-previews/arrow.jpg",fit:"cover",cardPosition:"center top",caption:"Hood and bow"},
  ark_survival:{src:"/category-previews/ark_survival.jpg",fit:"cover",cardPosition:"center",caption:"Tame and survive"},
  minecraft:{src:"/category-previews/minecraft.jpg",fit:"cover",cardPosition:"center",caption:"Mine and craft"},
  who_historic_figure:{src:"/category-previews/who_historic_figure.jpg",fit:"cover",cardPosition:"center top",boardFit:"cover",boardPosition:"center",caption:"Guess the legend"},
  who_animal:{src:"/whoami/scar-the-lion-king-3bd03190.png",fit:"cover",cardPosition:"center top",caption:"Guess the creature"},
  charades_scenarios:{src:"/category-previews/charades_general.svg",fit:"cover",caption:"Act out the scene"},
};

const TEAM_COLORS = ["#2563EB","#DC2626"];
const PT_COLORS = {200:"#D97706",400:"#DC2626",600:"#7C3AED"};
const PT_BG = {200:"#FFFBEB",400:"#FFF1F2",600:"#F5F3FF"};

function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function makeBoard(catIds){const b={};catIds.forEach(id=>{b[id]={};POINT_VALUES.forEach(pts=>{b[id][pts]=Array(TILES_PER_TIER).fill(false);});});return b;}
function buildUsedQuestionLookup(ids){
  const lookup=new Set();
  (Array.isArray(ids)?ids:[]).forEach((id)=>{
    if(typeof id!=="string") return;
    const trimmed=id.trim();
    if(!trimmed) return;
    lookup.add(trimmed);
    const legacyMatch=trimmed.match(/^[^:]+:\d+:(.+)$/);
    if(legacyMatch?.[1]) lookup.add(legacyMatch[1]);
  });
  return lookup;
}
function getQuestionUsageKeys(entry){
  return [entry?._qid, entry?._qkey].filter(Boolean);
}
function isQuestionConsumed(entry, usedLookup){
  return getQuestionUsageKeys(entry).some((key)=>usedLookup.has(key));
}
function buildTierPool(catId, pts, usedIdsSet){
  const fullPool = Array.isArray(BANK?.[catId]?.[pts]) ? BANK[catId][pts] : [];
  if(fullPool.length===0) return [];
  const usedLookup=usedIdsSet instanceof Set?usedIdsSet:buildUsedQuestionLookup(usedIdsSet);
  const remainingPool = fullPool.filter((entry)=>!isQuestionConsumed(entry,usedLookup));
  return shuffle(remainingPool.length>0?remainingPool:[...fullPool]);
}
function initPointers(catIds, usedIdsSet=new Set()){const p={};catIds.forEach(id=>{p[id]={};POINT_VALUES.forEach(pts=>{p[id][pts]={pool:buildTierPool(id, pts, usedIdsSet),idx:0};});});return p;}

function flagEmojiToCode(flag){
  if(!flag) return "";
  const chars=[...flag].filter(ch=>{const cp=ch.codePointAt(0);return cp>=0x1F1E6&&cp<=0x1F1FF;});
  if(chars.length!==2) return "";
  return chars.map(ch=>String.fromCharCode(ch.codePointAt(0)-127397)).join("").toLowerCase();
}

function FlagImage({flag,country}){
  const [errored,setErrored]=useState(false);
  const code=/^[a-z]{2}$/i.test(flag||"")?flag.toLowerCase():flagEmojiToCode(flag);
  if(!code||errored){
    return <div style={{fontSize:72,fontWeight:800,color:"#0F172A",letterSpacing:2,lineHeight:1,marginBottom:14}}>{code?code.toUpperCase():"FLAG"}</div>;
  }
  return(
    <img
      src={`/flags/${code}.svg`}
      alt={`${country} flag`}
      onError={()=>setErrored(true)}
      style={{display:"block",width:"min(320px,76vw)",maxHeight:"220px",objectFit:"contain",background:"#fff",padding:14,borderRadius:22,border:"1.5px solid #E2E8F0",boxShadow:"0 18px 40px #0f172a18",margin:"0 auto 18px"}}
    />
  );
}

// Country map via local SVG assets
function CountryMapSVG({code,country}){
  const [errored,setErrored]=useState(false);
  if(!code||errored){
    return <div style={{width:"min(340px,74vw)",height:"min(360px,78vw)",background:"#FFF1F2",borderRadius:20,display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid #FECDD3"}}><div style={{fontSize:16,color:"#E11D48",fontWeight:700}}>Map unavailable</div></div>;
  }
  return(
    <img
      src={`/country-maps/${code}.svg`}
      alt={`${country} highlighted on a world map`}
      onError={()=>setErrored(true)}
      style={{display:"block",width:"min(340px,74vw)",height:"auto",maxHeight:"min(360px,78vw)",objectFit:"contain",borderRadius:20,border:"1.5px solid #E2E8F0",boxShadow:"0 18px 40px #0f172a16",background:"#fff"}}
    />
  );
}

// Character image via local generated asset pack
function CharacterArt({name, wiki}){
  const src = wiki ? WHOAMI_IMAGE_MANIFEST[wiki] : null;
  const frameStyle={display:"block",width:"min(330px,72vw)",height:"min(360px,78vw)",borderRadius:24,border:"1.5px solid #E2E8F0",boxShadow:"0 22px 48px #0f172a16",background:"#fff",overflow:"hidden"};

  if(!src){
    return(
      <div style={{...frameStyle,display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(180deg,#FFFFFF 0%,#F8FAFC 100%)"}}>
        <div style={{textAlign:"center",padding:"0 22px"}}>
          <div style={{fontSize:34,marginBottom:8}}>??</div>
          <div style={{fontSize:12,color:"#64748B",fontWeight:700,marginBottom:4}}>Image unavailable</div>
          <div style={{fontSize:11,color:"#94A3B8",fontWeight:600}}>This character is missing from the local image pack.</div>
        </div>
      </div>
    );
  }

  return(
    <div style={{...frameStyle,display:"flex",alignItems:"center",justifyContent:"center",padding:14,background:"linear-gradient(180deg,#FFFFFF 0%,#F8FAFC 100%)"}}>
      <img src={src} alt={name} style={{width:"100%",height:"100%",objectFit:"contain",objectPosition:"center"}} />
    </div>
  );
}

let youtubeIframeApiPromise = null;
function loadYouTubeIframeApi(){
  if(window.YT?.Player) return Promise.resolve(window.YT);
  if(youtubeIframeApiPromise) return youtubeIframeApiPromise;

  youtubeIframeApiPromise = new Promise((resolve,reject)=>{
    const existing = document.getElementById("youtube-iframe-api");
    const timeoutId = window.setTimeout(()=>{
      reject(new Error("YouTube iframe API timed out"));
    }, 12000);

    const finish = ()=>{
      if(window.YT?.Player){
        window.clearTimeout(timeoutId);
        resolve(window.YT);
      }
    };

    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = ()=>{
      previousReady?.();
      finish();
    };

    if(!existing){
      const script=document.createElement("script");
      script.id="youtube-iframe-api";
      script.src="https://www.youtube.com/iframe_api";
      script.async=true;
      script.onerror=()=>{
        window.clearTimeout(timeoutId);
        reject(new Error("Failed to load YouTube iframe API"));
      };
      document.head.appendChild(script);
    }

    const pollId = window.setInterval(()=>{
      if(window.YT?.Player){
        window.clearInterval(pollId);
        finish();
      }
    },100);
  });

  return youtubeIframeApiPromise;
}

function MovieScenePlayer({tile}){
  const [loaded,setLoaded]=useState(false);
  const [status,setStatus]=useState(tile.videoId?"idle":"error");
  const [playerReady,setPlayerReady]=useState(false);
  const [isPlaying,setIsPlaying]=useState(false);
  const [flashMask,setFlashMask]=useState(false);
  const [flashLabel,setFlashLabel]=useState("▶");
  const [concealPlayer,setConcealPlayer]=useState(false);
  const playerMountRef=useRef(null);
  const playerRef=useRef(null);
  const endPollRef=useRef(null);
  const flashTimeoutRef=useRef(null);
  const concealTimeoutRef=useRef(null);

  useEffect(()=>{
    setLoaded(false);
    setStatus(tile.videoId?"idle":"error");
    setPlayerReady(false);
    setIsPlaying(false);
    setFlashMask(false);
    setConcealPlayer(false);
    if(endPollRef.current){
      window.clearInterval(endPollRef.current);
      endPollRef.current=null;
    }
    if(flashTimeoutRef.current){
      window.clearTimeout(flashTimeoutRef.current);
      flashTimeoutRef.current=null;
    }
    if(concealTimeoutRef.current){
      window.clearTimeout(concealTimeoutRef.current);
      concealTimeoutRef.current=null;
    }
    try{ playerRef.current?.destroy?.(); }catch{}
    playerRef.current=null;
    if(playerMountRef.current) playerMountRef.current.innerHTML="";
  },[tile.videoId, tile.start, tile.end, tile.duration]);

  const pulseMask = (label="▶", duration=560, conceal=false)=>{
    setFlashLabel(label);
    setFlashMask(true);
    if(conceal) setConcealPlayer(true);
    if(flashTimeoutRef.current){
      window.clearTimeout(flashTimeoutRef.current);
    }
    if(concealTimeoutRef.current){
      window.clearTimeout(concealTimeoutRef.current);
      concealTimeoutRef.current=null;
    }
      flashTimeoutRef.current = window.setTimeout(()=>{
        setFlashMask(false);
        flashTimeoutRef.current=null;
      }, duration);
    if(conceal){
      concealTimeoutRef.current = window.setTimeout(()=>{
        setConcealPlayer(false);
        concealTimeoutRef.current=null;
      }, duration);
    }
  };

  useEffect(()=>{
    if(!loaded||!tile.videoId||!playerMountRef.current) return undefined;

    let cancelled=false;
    const start = Number.isFinite(tile.start) ? tile.start : 2;
    const duration = Number.isFinite(tile.duration) ? tile.duration : (tile.pts===200 ? 18 : tile.pts===400 ? 16 : 14);
    const end = tile.end ?? (start + duration);

    setStatus("loading");

    loadYouTubeIframeApi()
      .then(()=>{
        if(cancelled||!playerMountRef.current||!window.YT?.Player) return;

        if(playerMountRef.current) playerMountRef.current.innerHTML="";
        playerRef.current = new window.YT.Player(playerMountRef.current, {
          videoId: tile.videoId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            iv_load_policy: 3,
            disablekb: 1,
            fs: 0,
            cc_load_policy: 0,
            enablejsapi: 1,
            origin: window.location.origin,
            start,
            end,
          },
          events: {
            onReady: (event)=>{
              if(cancelled) return;
              setPlayerReady(true);
              setStatus("ready");
              pulseMask("▶", 900, true);
              event.target.seekTo(start, true);
              event.target.playVideo();
            },
            onStateChange: (event)=>{
              if(cancelled||!window.YT?.PlayerState) return;
              const state = event.data;
              setIsPlaying(state===window.YT.PlayerState.PLAYING);
              if(state===window.YT.PlayerState.ENDED){
                try{
                  event.target.seekTo(start, true);
                  event.target.pauseVideo();
                }catch{}
                setIsPlaying(false);
              }
            },
            onError: ()=>{
              if(cancelled) return;
              setStatus("error");
              setPlayerReady(false);
              setIsPlaying(false);
            },
          },
        });

        endPollRef.current = window.setInterval(()=>{
          const player = playerRef.current;
          if(!player) return;
          try{
            if(player.getPlayerState?.()===window.YT.PlayerState.PLAYING && player.getCurrentTime?.() >= end - 0.15){
              player.pauseVideo();
              player.seekTo(start, true);
              setIsPlaying(false);
            }
          }catch{}
        }, 250);
      })
      .catch(()=>{
        if(cancelled) return;
        setStatus("error");
      });

    return ()=>{
      cancelled=true;
      if(endPollRef.current){
        window.clearInterval(endPollRef.current);
        endPollRef.current=null;
      }
      if(flashTimeoutRef.current){
        window.clearTimeout(flashTimeoutRef.current);
        flashTimeoutRef.current=null;
      }
      if(concealTimeoutRef.current){
        window.clearTimeout(concealTimeoutRef.current);
        concealTimeoutRef.current=null;
      }
      try{ playerRef.current?.destroy?.(); }catch{}
      playerRef.current=null;
      if(playerMountRef.current) playerMountRef.current.innerHTML="";
    };
  },[loaded, tile.videoId, tile.start, tile.end, tile.duration, tile.pts]);

  if(!tile.videoId){
    return(
      <div style={{display:"block",width:"min(520px,96vw)",height:"min(320px,54vw)",minHeight:240,borderRadius:18,border:"1.5px solid #E2E8F0",boxShadow:"0 16px 36px #0f172a14",background:"#fff",overflow:"hidden"}}>
        <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(180deg,#FFFFFF 0%,#F8FAFC 100%)"}}>
          <div style={{textAlign:"center",padding:"0 20px"}}>
            <div style={{fontSize:34,marginBottom:10}}>🎞️</div>
            <div style={{fontSize:12,color:"#64748B",fontWeight:700,marginBottom:4}}>Clip unavailable</div>
            <div style={{fontSize:11,color:"#94A3B8",fontWeight:600}}>This movie scene is missing a playable source.</div>
          </div>
        </div>
      </div>
    );
  }

  const start = Number.isFinite(tile.start) ? tile.start : 2;
  const togglePlayback = ()=>{
    const player = playerRef.current;
    if(!playerReady||!player) return;
    try{
      if(isPlaying){
        pulseMask("❚❚");
        player.pauseVideo();
      }else{
        pulseMask("▶", 1150, true);
        player.playVideo();
      }
    }catch{}
  };
  const replayClip = ()=>{
    const player = playerRef.current;
    if(!playerReady||!player) return;
    try{
      pulseMask("↺", 1250, true);
      player.seekTo(start, true);
      player.playVideo();
      setIsPlaying(true);
    }catch{}
  };

  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,width:"100%",maxWidth:620}}>
      <div style={{position:"relative",width:"100%",aspectRatio:"16 / 9",minHeight:250,borderRadius:24,border:"1.5px solid #E2E8F0",boxShadow:"0 20px 42px #0f172a16",background:"#0F172A",overflow:"hidden"}}>
        {loaded?(
          <>
            <div
              ref={playerMountRef}
              title={`${tile.a} movie scene clip`}
              style={{position:"absolute",top:"-1%",left:"-1.25%",width:"102.5%",height:"102%",pointerEvents:"none",opacity:concealPlayer?0:1,transition:concealPlayer?"none":"opacity .16s ease"}}
            />
            <div style={{position:"absolute",top:0,left:0,right:0,height:22,background:"linear-gradient(180deg,rgba(15,23,42,.86) 0%, rgba(15,23,42,.42) 62%, rgba(15,23,42,0) 100%)",pointerEvents:"none"}}/>
            <div style={{position:"absolute",left:0,right:0,bottom:0,height:18,background:"linear-gradient(0deg,rgba(15,23,42,.82) 0%, rgba(15,23,42,.34) 58%, rgba(15,23,42,0) 100%)",pointerEvents:"none"}}/>
            {flashMask&&(
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:concealPlayer?"#000000":"rgba(15,23,42,.42)",pointerEvents:"none"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",width:72,height:72,borderRadius:"50%",background:concealPlayer?"rgba(255,255,255,.1)":"rgba(15,23,42,.74)",backdropFilter:concealPlayer?"none":"blur(2px)",color:"#fff",fontSize:28,fontWeight:800,boxShadow:concealPlayer?"0 0 0 1px rgba(255,255,255,.08)":"0 10px 24px rgba(15,23,42,.24)"}}>
                  {flashLabel}
                </div>
              </div>
            )}
            {status==="loading"&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}><div style={{padding:"8px 12px",borderRadius:999,background:"#0F172Acc",color:"#fff",fontSize:11,fontWeight:700}}>Loading clip...</div></div>}
            {status==="error"&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}><div style={{padding:"8px 12px",borderRadius:999,background:"#7F1D1Ddd",color:"#fff",fontSize:11,fontWeight:700}}>Clip could not be embedded</div></div>}
          </>
        ):(
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#111827 0%,#1E293B 48%,#0F172A 100%)"}}>
            <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at top left, #ffffff18 0%, transparent 40%), radial-gradient(circle at bottom right, #f9731622 0%, transparent 32%)"}}/>
            <div style={{position:"relative",display:"flex",flexDirection:"column",alignItems:"center",gap:10,textAlign:"center",padding:"0 24px"}}>
              <div style={{fontSize:48,lineHeight:1}}>🎬</div>
              <div style={{fontSize:15,fontWeight:800,letterSpacing:.8,color:"#FDBA74",textTransform:"uppercase"}}>Movie Scene</div>
              <div style={{fontSize:15,color:"#CBD5E1",fontWeight:600,maxWidth:320,lineHeight:1.5}}>Load a short clip and guess the movie before revealing the answer.</div>
              <button className="tap" onClick={()=>setLoaded(true)} style={getGlassButtonStyle({tint:"#F97316",textColor:"#1E293B",fontSize:16,padding:"14px 24px",borderRadius:999})}>Play Clip</button>
            </div>
          </div>
        )}
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"}}>
        {loaded&&<button className="tap" onClick={togglePlayback} disabled={!playerReady||status==="error"} style={getGlassButtonStyle({tint:"#2563EB",textColor:"#1E293B",fontSize:15,padding:"12px 18px",borderRadius:999,disabled:!playerReady||status==="error"})}>{isPlaying?"Pause":"Play"}</button>}
        {loaded&&<button className="tap" onClick={replayClip} disabled={!playerReady||status==="error"} style={getGlassButtonStyle({tint:"#7C3AED",textColor:"#334155",fontWeight:700,fontSize:14,padding:"11px 16px",borderRadius:999,subtle:true,disabled:!playerReady||status==="error"})}>Replay clip</button>}
        {loaded&&status==="error"&&tile.sourceUrl&&<a href={tile.sourceUrl} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",justifyContent:"center",background:"#FFFFFF",color:"#64748B",fontWeight:700,fontSize:14,padding:"11px 16px",borderRadius:999,border:"1.5px solid #E2E8F0",textDecoration:"none"}}>Open clip in browser</a>}
      </div>
    </div>
  );
}

function SongClipPlayer({tile}){
  const audioRef=useRef(null);
  const [loaded,setLoaded]=useState(false);
  const [status,setStatus]=useState(tile.previewUrl?"idle":"error");
  const [isPlaying,setIsPlaying]=useState(false);
  const [progress,setProgress]=useState(0);
  const clipStart=Number.isFinite(tile.clipStart)?tile.clipStart:0;
  const clipDuration=Number.isFinite(tile.duration)?tile.duration:15;

  useEffect(()=>{
    const audio=audioRef.current;
    if(!audio) return;
    audio.volume=0.5;

    const syncProgress=()=>{
      const elapsed=Math.max(0,audio.currentTime-clipStart);
      const nextProgress=Math.max(0,Math.min(1,elapsed/clipDuration));
      setProgress(nextProgress);
      if(audio.currentTime>=clipStart+clipDuration-0.05){
        audio.pause();
        try{audio.currentTime=clipStart;}catch{}
        setIsPlaying(false);
        setProgress(0);
      }
    };

    const onEnded=()=>{
      try{audio.currentTime=clipStart;}catch{}
      setIsPlaying(false);
      setProgress(0);
    };

    const onPause=()=>setIsPlaying(false);
    const onPlay=()=>setIsPlaying(true);
    const onError=()=>setStatus("error");
    const onCanPlay=()=>setStatus("ready");

    audio.addEventListener("timeupdate",syncProgress);
    audio.addEventListener("ended",onEnded);
    audio.addEventListener("pause",onPause);
    audio.addEventListener("play",onPlay);
    audio.addEventListener("error",onError);
    audio.addEventListener("canplay",onCanPlay);

    return ()=>{
      audio.pause();
      audio.removeEventListener("timeupdate",syncProgress);
      audio.removeEventListener("ended",onEnded);
      audio.removeEventListener("pause",onPause);
      audio.removeEventListener("play",onPlay);
      audio.removeEventListener("error",onError);
      audio.removeEventListener("canplay",onCanPlay);
    };
  },[clipDuration,clipStart,tile.previewUrl]);

  useEffect(()=>{
    const audio=audioRef.current;
    if(!audio) return;
    audio.pause();
    audio.volume=0.5;
    setLoaded(false);
    setStatus(tile.previewUrl?"idle":"error");
    setIsPlaying(false);
    setProgress(0);
    try{audio.currentTime=clipStart;}catch{}
  },[tile.previewUrl,clipStart]);

  const startClip=()=>{
    const audio=audioRef.current;
    if(!audio||!tile.previewUrl) return;
    const playNow=()=>{
      try{audio.currentTime=clipStart;}catch{}
      const playPromise=audio.play();
      if(playPromise?.catch){
        playPromise.catch(()=>setStatus("error"));
      }
    };
    setLoaded(true);
    if(audio.readyState>=2){
      setStatus("ready");
      playNow();
      return;
    }
    setStatus("loading");
    const onReady=()=>{
      audio.removeEventListener("canplay",onReady);
      setStatus("ready");
      playNow();
    };
    audio.addEventListener("canplay",onReady);
    audio.load();
  };

  const togglePlayback=()=>{
    const audio=audioRef.current;
    if(!audio||status==="error") return;
    if(isPlaying){
      audio.pause();
      return;
    }
    if(audio.currentTime<clipStart || audio.currentTime>=clipStart+clipDuration){
      try{audio.currentTime=clipStart;}catch{}
    }
    const playPromise=audio.play();
    if(playPromise?.catch){
      playPromise.catch(()=>setStatus("error"));
    }
  };

  const replayClip=()=>{
    const audio=audioRef.current;
    if(!audio||status==="error") return;
    try{audio.currentTime=clipStart;}catch{}
    setProgress(0);
    const playPromise=audio.play();
    if(playPromise?.catch){
      playPromise.catch(()=>setStatus("error"));
    }
  };

  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,width:"100%",maxWidth:620}}>
      <audio ref={audioRef} src={tile.previewUrl||""} preload="auto" />
      <div style={{position:"relative",width:"100%",minHeight:220,borderRadius:24,border:"1.5px solid #E2E8F0",boxShadow:"0 20px 42px #0f172a16",background:"#0F172A",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at top left, #ffffff14 0%, transparent 36%), radial-gradient(circle at bottom right, #7c3aed26 0%, transparent 30%)"}}/>
        <div style={{position:"relative",zIndex:1,width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"30px 24px",gap:18,textAlign:"center"}}>
          <div style={{fontSize:54,lineHeight:1}}>{"\u{1F3B6}"}</div>
          <div style={{fontSize:15,fontWeight:800,letterSpacing:.8,color:"#C4B5FD",textTransform:"uppercase"}}>Song Clip</div>
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"center",gap:6,height:54}}>
            {[0,1,2,3,4,5,6].map(i=>{
              const active=loaded && (isPlaying ? true : progress > (i/7));
              const baseHeights=[18,32,22,40,26,34,20];
              return(
                <div
                  key={i}
                  style={{
                    width:10,
                    height:active?(isPlaying?baseHeights[i]:Math.max(12,baseHeights[i]-8)):10,
                    borderRadius:999,
                    background:active?"#A855F7":"#475569",
                    transition:"height .18s ease, background .18s ease",
                    boxShadow:active?"0 0 0 1px rgba(255,255,255,.05), 0 6px 14px rgba(168,85,247,.24)":"none",
                  }}
                />
              );
            })}
          </div>
          <div style={{width:"100%",maxWidth:420,height:10,borderRadius:999,background:"#1E293B",overflow:"hidden",border:"1px solid rgba(255,255,255,.08)"}}>
            <div style={{width:`${Math.max(0,Math.min(100,progress*100))}%`,height:"100%",background:"linear-gradient(90deg,#A855F7 0%,#C084FC 100%)",transition:"width .15s linear"}}/>
          </div>
          {!loaded&&<button className="tap" onClick={startClip} style={getGlassButtonStyle({tint:"#7C3AED",textColor:"#1E293B",fontSize:16,padding:"14px 24px",borderRadius:999})}>Play Clip</button>}
          {loaded&&status==="loading"&&<div style={{fontSize:14,color:"#CBD5E1",fontWeight:700}}>Loading audio...</div>}
          {loaded&&status==="error"&&<div style={{fontSize:14,color:"#FCA5A5",fontWeight:700}}>Audio clip could not load</div>}
        </div>
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"}}>
        {loaded&&<button className="tap" onClick={togglePlayback} disabled={status==="error"||status==="loading"} style={getGlassButtonStyle({tint:"#2563EB",textColor:"#1E293B",fontSize:15,padding:"12px 18px",borderRadius:999,disabled:status==="error"||status==="loading"})}>{isPlaying?"Pause":"Play"}</button>}
        {loaded&&<button className="tap" onClick={replayClip} disabled={status==="error"||status==="loading"} style={getGlassButtonStyle({tint:"#7C3AED",textColor:"#334155",fontWeight:700,fontSize:14,padding:"11px 16px",borderRadius:999,subtle:true,disabled:status==="error"||status==="loading"})}>Replay clip</button>}
        {loaded&&status==="error"&&tile.sourceUrl&&<a href={tile.sourceUrl} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",justifyContent:"center",background:"#FFFFFF",color:"#64748B",fontWeight:700,fontSize:14,padding:"11px 16px",borderRadius:999,border:"1.5px solid #E2E8F0",textDecoration:"none"}}>Open clip in browser</a>}
      </div>
    </div>
  );
}

function CategoryPreviewVisual({category, preview, badge}){
  const imageWrapStyle={position:"relative",height:88,borderRadius:12,overflow:"hidden",background:preview?.bg||"#F8FAFC",display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid rgba(15,23,42,.38)"};
  if(preview?.src){
    return(
      <div style={imageWrapStyle}>
        <img
          src={preview.src}
          alt=""
          loading="lazy"
          decoding="async"
          style={{width:"100%",height:"100%",objectFit:preview.cardFit||preview.fit||"cover",objectPosition:preview.cardPosition||preview.position||"center"}}
        />
      </div>
    );
  }

  return(
    <div style={{...imageWrapStyle,background:`linear-gradient(135deg, ${category.color} 0%, ${category.color}D9 55%, #0F172A 140%)`}}>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at top left, #ffffff55 0%, transparent 38%), radial-gradient(circle at bottom right, #ffffff22 0%, transparent 34%)"}}/>
      <div style={{position:"absolute",top:6,left:6,display:"inline-flex",alignItems:"center",gap:5,padding:"5px 7px",borderRadius:999,background:"#ffffffd9",color:"#1E293B",fontSize:10,fontWeight:800,boxShadow:"0 5px 12px #0f172a14"}}>
        <span style={{fontSize:12,lineHeight:1}}>{category.icon}</span>
        <span>{category.label}</span>
      </div>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,padding:"0 10px",textAlign:"center"}}>
        <div style={{fontSize:32,filter:"drop-shadow(0 6px 12px rgba(15,23,42,.18))"}}>{category.icon}</div>
        <div style={{padding:"5px 9px",borderRadius:999,background:"#ffffff1a",border:"1px solid #ffffff2f",color:"#fff",fontSize:10,fontWeight:800,letterSpacing:.35}}>
          {preview?.artLabel||"Play"}
        </div>
      </div>
      {badge&&<div style={{position:"absolute",right:6,bottom:6,padding:"4px 7px",borderRadius:999,background:"#ffffff1f",border:"1px solid #ffffff29",color:"#fff",fontSize:9,fontWeight:800,letterSpacing:.35}}>{badge}</div>}
    </div>
  );
}

function CategoryPreviewCard({id, category, selected, onToggle}){
  const preview=CATEGORY_PREVIEWS[id]||{};
  const badge=category.isWhoAmI?"WHO AM I":category.isCharades?"CHARADES":category.isCountryMap?"MAP":category.isMovieScene?"CLIP":category.isSongClip?"AUDIO":null;
  const selectedBorderColor=lightenHex(category.color,0.58);
  const glowColor=lightenHex(category.color,0.72);
  const CATEGORY_CARD_ACCENT_PALETTE=[
    ["#22D3EE","#8B5CF6"],
    ["#F59E0B","#F43F5E"],
    ["#34D399","#3B82F6"],
    ["#FB7185","#A855F7"],
    ["#2DD4BF","#F97316"],
  ];
  const CATEGORY_CARD_TINTS={
    the_office:"#60A5FA",
    prison_break:"#67E8F9",
    the_walking_dead:"#F59E0B",
    suits:"#38BDF8",
    vikings:"#34D399",
    country_map:"#14B8A6",
    country_facts:"#06B6D4",
    flags:"#FB7185",
    songs:"#8B5CF6",
    science:"#60A5FA",
    geography:"#2DD4BF",
    marvel:"#F87171",
    dc:"#3B82F6",
    invincible:"#F97316",
    the_boys:"#EF4444",
    star_wars:"#FBBF24",
  };
  const accentIndex=[...id].reduce((sum,ch)=>sum+ch.charCodeAt(0),0)%CATEGORY_CARD_ACCENT_PALETTE.length;
  const [accentA,accentB]=CATEGORY_CARD_ACCENT_PALETTE[accentIndex];
  const cardTint=CATEGORY_CARD_TINTS[id]||category.color;
  const cardGlow=lightenHex(cardTint,0.54);
  const cardBright=lightenHex(cardTint,0.34);
  const cardSoft=lightenHex(cardTint,0.18);
  const cardDeep=category.color;
  const accentSoftA=lightenHex(accentA,0.14);
  const accentSoftB=lightenHex(accentB,0.14);
  return(
    <button
      className="tap"
      onClick={onToggle}
      style={{
        ...getGlassButtonStyle({
          tint:category.color,
          textColor:"#1E293B",
          borderRadius:16,
          padding:6,
          fontSize:12,
          fontWeight:800,
          subtle:true,
        }),
        backgroundColor:cardTint,
        backgroundBlendMode:"screen, screen, screen, normal",
        background:`linear-gradient(158deg, rgba(255,255,255,.28) 0%, rgba(255,255,255,.08) 20%, rgba(255,255,255,0) 42%),
          radial-gradient(circle at 15% 14%, ${withAlpha(accentSoftA,"FF")} 0%, ${withAlpha(accentA,"C4")} 22%, transparent 48%),
          radial-gradient(circle at 86% 84%, ${withAlpha(accentSoftB,"FF")} 0%, ${withAlpha(accentB,"C0")} 24%, transparent 50%),
          radial-gradient(circle at 84% 16%, ${withAlpha(cardGlow,"F5")} 0%, ${withAlpha(cardBright,"B4")} 22%, transparent 46%),
          linear-gradient(140deg, ${cardSoft} 0%, ${cardBright} 34%, ${cardTint} 66%, ${cardDeep} 100%)`,
        display:"flex",
        flexDirection:"column",
        gap:7,
        width:"100%",
        height:188,
        position:"relative",
        overflow:"hidden",
        isolation:"isolate",
        border:`2px solid ${selected?selectedBorderColor:withAlpha(cardDeep,"A6")}`,
        boxShadow:selected
          ?`0 0 0 5px ${withAlpha(glowColor,"55")}, 0 18px 34px ${withAlpha(glowColor,"88")}, inset 0 1px 0 rgba(255,255,255,.78), inset 0 -1px 0 rgba(255,255,255,.08)`
          :`0 16px 28px rgba(15,23,42,.18), 0 6px 18px ${withAlpha(cardGlow,"40")}, inset 0 1px 0 rgba(255,255,255,.72), inset 0 -1px 0 rgba(255,255,255,.08)`,
        transition:"all .15s",
      }}
    >
      <div style={{position:"absolute",inset:0,pointerEvents:"none"}}>
        <div style={{position:"absolute",top:-20,left:-14,width:"74%",height:62,borderRadius:999,background:"linear-gradient(180deg, rgba(255,255,255,.52) 0%, rgba(255,255,255,0) 100%)",filter:"blur(11px)"}}/>
        <div style={{position:"absolute",left:-26,bottom:18,width:104,height:104,borderRadius:"50%",background:`radial-gradient(circle, ${withAlpha(accentA,"A8")} 0%, ${withAlpha(accentA,"00")} 72%)`,filter:"blur(18px)"}}/>
        <div style={{position:"absolute",right:-22,bottom:18,width:96,height:96,borderRadius:"50%",background:`radial-gradient(circle, ${withAlpha(accentB,"B0")} 0%, ${withAlpha(accentB,"00")} 70%)`,filter:"blur(16px)"}}/>
      </div>
      <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",gap:7,height:"100%"}}>
      <CategoryPreviewVisual category={category} preview={preview} badge={badge}/>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-between",gap:2,padding:"0 4px 2px",textAlign:"center",flex:1}}>
        <div style={{fontSize:12,fontWeight:800,color:"#1E293B",lineHeight:1.12,minHeight:28,display:"flex",alignItems:"center",justifyContent:"center",textWrap:"balance"}}>
          <span style={{display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{category.label}</span>
        </div>
        <div style={{fontSize:9,fontWeight:700,color:"#FFFFFF",textShadow:"0 1px 6px rgba(15,23,42,.38)",letterSpacing:.25,textTransform:"uppercase",minHeight:18,display:"flex",alignItems:"flex-start",justifyContent:"center",textWrap:"balance"}}>
          {preview.caption||"Tap to select"}
        </div>
      </div>
      </div>
    </button>
  );
}

function BoardCategoryArt({id, category, radius}){
  const preview=CATEGORY_PREVIEWS[id]||{};
  const boardSrc = preview.boardSrc || preview.src;
  const frameStyle={
    width:"100%",
    height:"100%",
    borderRadius:radius,
    overflow:"hidden",
    border:"2px solid #0F172A",
    background:preview.boardBg||preview.bg||"#FFFFFF",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
  };

  if(boardSrc){
    return(
      <div style={frameStyle}>
        <img
          src={boardSrc}
          alt=""
          loading="lazy"
          decoding="async"
          style={{width:"100%",height:"100%",objectFit:preview.boardFit||preview.fit||"cover",objectPosition:preview.boardPosition||preview.position||"center"}}
        />
      </div>
    );
  }

  return(
    <div style={{...frameStyle,background:`linear-gradient(135deg, ${category.color} 0%, ${category.color}D9 55%, #0F172A 140%)`}}>
      <div style={{fontSize:32,filter:"drop-shadow(0 6px 12px rgba(15,23,42,.18))"}}>{category.icon}</div>
    </div>
  );
}

// QR Code
function QRCode({text,size=190}){
  const divRef=useRef(null);
  const [status,setStatus]=useState("loading");
  useEffect(()=>{
    let cancelled=false;
    function gen(){
      if(cancelled||!divRef.current) return;
      divRef.current.innerHTML="";
      try{new window.QRCode(divRef.current,{text:text||" ",width:size,height:size,colorDark:"#1E293B",colorLight:"#FFFFFF",correctLevel:window.QRCode.CorrectLevel.M});if(!cancelled)setStatus("done");}
      catch(e){if(!cancelled)setStatus("error");}
    }
    if(window.QRCode){gen();}
    else{
      const ex=document.getElementById("qrcode-script");
      if(ex){ex.addEventListener("load",gen);return()=>{cancelled=true;ex.removeEventListener("load",gen);};}
      const s=document.createElement("script");s.id="qrcode-script";
      s.src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
      s.onload=gen;s.onerror=()=>{if(!cancelled)setStatus("error");};document.head.appendChild(s);
    }
    return()=>{cancelled=true;};
  },[text,size]);
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
      {status==="loading"&&<div style={{width:size,height:size,background:"#F1F5F9",borderRadius:10,border:"2px solid #E2E8F0",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:11,color:"#94A3B8",fontWeight:600}}>Generating...</span></div>}
      {status==="error"&&<div style={{width:size,height:size,background:"#FFF1F2",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:11,color:"#E11D48",fontWeight:600}}>QR error</span></div>}
      <div ref={divRef} style={{display:status==="done"?"block":"none",borderRadius:10,overflow:"hidden",border:"2px solid #E2E8F0"}}/>
      <div style={{fontSize:9,color:"#94A3B8",fontWeight:600,letterSpacing:1}}>SCAN TO SEE YOUR WORD</div>
    </div>
  );
}

const SF_STACK='"SF Pro Display","SF Pro Text",-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,sans-serif';
const THEME_STORAGE_KEY="trivic-theme-mode";
const LANG_STORAGE_KEY="trivic-language";
function getInitialLanguage(){
  if(typeof window==="undefined") return "en";
  try{
    const stored=window.localStorage.getItem(LANG_STORAGE_KEY);
    return stored==="ar"?"ar":"en";
  }catch{return "en";}
}

// English -> Arabic UI translation map. Only short, unambiguous UI strings.
// Trivia question/answer text is NOT translated.
const AR_TRANSLATIONS={
  "TRIVIC":"تريفيك",
  "TEAM TRIVIA":"معلومات الفريق",
  "GAME OVER":"انتهت اللعبة",
  "RESULTS":"النتائج",
  "ANSWER":"الإجابة",
  "AWARD POINTS TO:":"امنح النقاط لـ:",
  "Reveal Answer":"اكشف الإجابة",
  "Back to Board":"العودة إلى اللوحة",
  "New Game":"لعبة جديدة",
  "Pass":"تخطّي",
  "Sign In":"تسجيل الدخول",
  "Sign Out":"تسجيل الخروج",
  "Create Account":"إنشاء حساب",
  "Username":"اسم المستخدم",
  "Password":"كلمة المرور",
  "Login":"تسجيل الدخول",
  "Sign up":"إنشاء حساب",
  "Loading account...":"جارٍ تحميل الحساب...",
  "Loading your account question history...":"جارٍ تحميل سجل أسئلتك...",
  "Loading audio...":"جارٍ تحميل الصوت...",
  "Loading clip...":"جارٍ تحميل المقطع...",
  "Generating...":"جارٍ التوليد...",
  "Play Clip":"تشغيل المقطع",
  "Replay clip":"إعادة المقطع",
  "Open clip in browser":"افتح المقطع في المتصفح",
  "Clip unavailable":"المقطع غير متوفر",
  "Clip could not be embedded":"تعذّر تضمين المقطع",
  "Audio clip could not load":"تعذّر تحميل المقطع الصوتي",
  "Image unavailable":"الصورة غير متوفرة",
  "Map unavailable":"الخريطة غير متوفرة",
  "QR error":"خطأ في رمز QR",
  "Country Map":"خريطة الدولة",
  "Movie Scene":"مشهد فيلم",
  "Song Clip":"مقطع أغنية",
  "Who Am I?":"من أكون؟",
  "Which country is this flag from?":"من أي دولة هذا العلم؟",
  "Guess the character from the image":"خمّن الشخصية من الصورة",
  "Guess the movie from the clip":"خمّن الفيلم من المقطع",
  "Guess the song from the clip":"خمّن الأغنية من المقطع",
  "SELECT CATEGORIES":"اختر الفئات",
  "SELECT CATEGORIES ->":"اختر الفئات ←",
  "WORD (HOST ONLY)":"الكلمة (للمضيف فقط)",
  "SCAN TO SEE YOUR WORD":"امسح لرؤية كلمتك",
  "ACTOR - SCAN QR TO GOOGLE YOUR WORD":"الممثل - امسح QR للبحث عن كلمتك",
  "Seconds":"ثوانٍ",
  "Dark":"داكن",
  "Light":"فاتح",
  "Add all":"أضف الكل",
  "ALL":"الكل",
  "AUDIO":"صوت",
  "🧠 General":"🧠 عام",
  "🙂 Emoji Guess":"🙂 خمّن الإيموجي",
  "🎬 Fiction":"🎬 خيال",
  "🌸 Anime":"🌸 أنمي",
  "🎮 Gaming":"🎮 ألعاب",
  "🖼️ Who Am I?":"🖼️ من أكون؟",
  "🎭 Charades":"🎭 تمثيل صامت",
};

const CSS=`
  :root{
    --site-bg-color:#050505;
    --site-bg-image:url('/site-bg-glossy.png');
    --site-bg-position:center;
    --site-bg-size:cover;
    --site-bg-repeat:no-repeat;
    --header-bg-color:#0A2A52;
    --header-bg-image:linear-gradient(180deg, rgba(255,255,255,.18) 0%, rgba(255,255,255,.04) 16%, rgba(255,255,255,0) 30%), linear-gradient(135deg, #163E76 0%, #0D2E5D 46%, #081F43 100%), radial-gradient(circle at 18% 20%, rgba(120,214,255,.18) 0%, rgba(120,214,255,0) 30%), radial-gradient(circle at 82% 18%, rgba(255,255,255,.10) 0%, rgba(255,255,255,0) 22%), radial-gradient(circle at 50% 100%, rgba(7,18,38,.34) 0%, rgba(7,18,38,0) 44%);
    --header-bg-position:center;
    --header-bg-size:cover;
    --header-bg-repeat:no-repeat;
    --header-box-shadow:inset 0 1px 0 rgba(255,255,255,.36), inset 0 -1px 0 rgba(255,255,255,.08), inset 0 18px 28px rgba(255,255,255,.06), 0 10px 24px rgba(0,0,0,.18);
    --header-backdrop-filter:blur(8px) saturate(118%);
  }
  :root.theme-light{
    --site-bg-color:#F8FBFF;
    --site-bg-image:url('/light-mode-white.jpg');
    --site-bg-position:center;
    --site-bg-size:cover;
    --site-bg-repeat:no-repeat;
    --header-bg-color:#D7F5FF;
    --header-bg-image:linear-gradient(180deg, rgba(255,255,255,.40) 0%, rgba(255,255,255,.14) 28%, rgba(255,255,255,0) 62%), url('/light-mode-blue.jpg');
    --header-bg-position:center;
    --header-bg-size:cover;
    --header-bg-repeat:no-repeat;
    --header-box-shadow:inset 0 1px 0 rgba(255,255,255,.72), inset 0 -1px 0 rgba(255,255,255,.24), 0 10px 24px rgba(15,23,42,.10);
    --header-backdrop-filter:blur(6px) saturate(106%);
  }
  :root.theme-dark{
    --site-bg-color:#050505;
    --site-bg-image:url('/site-bg-glossy.png');
    --site-bg-position:center;
    --site-bg-size:cover;
    --site-bg-repeat:no-repeat;
    --header-bg-color:#0A2A52;
    --header-bg-image:linear-gradient(180deg, rgba(255,255,255,.18) 0%, rgba(255,255,255,.04) 16%, rgba(255,255,255,0) 30%), linear-gradient(135deg, #163E76 0%, #0D2E5D 46%, #081F43 100%), radial-gradient(circle at 18% 20%, rgba(120,214,255,.18) 0%, rgba(120,214,255,0) 30%), radial-gradient(circle at 82% 18%, rgba(255,255,255,.10) 0%, rgba(255,255,255,0) 22%), radial-gradient(circle at 50% 100%, rgba(7,18,38,.34) 0%, rgba(7,18,38,0) 44%);
    --header-bg-position:center;
    --header-bg-size:cover;
    --header-bg-repeat:no-repeat;
    --header-box-shadow:inset 0 1px 0 rgba(255,255,255,.36), inset 0 -1px 0 rgba(255,255,255,.08), inset 0 18px 28px rgba(255,255,255,.06), 0 10px 24px rgba(0,0,0,.18);
    --header-backdrop-filter:blur(8px) saturate(118%);
  }
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body,#root{
    width:100%;
    height:100%;
    max-width:100vw;
    overflow-x:hidden;
    -webkit-text-size-adjust:100%;
    text-size-adjust:100%;
    overscroll-behavior:none;
    background-color:var(--site-bg-color);
    background-image:var(--site-bg-image);
    background-position:var(--site-bg-position);
    background-size:var(--site-bg-size);
    background-repeat:var(--site-bg-repeat);
    font-family:${SF_STACK};
    color:#1E293B;
    text-rendering:optimizeLegibility;
    -webkit-font-smoothing:antialiased;
    -moz-osx-font-smoothing:grayscale;
    font-smooth:always;
  }
  button{font-family:${SF_STACK};cursor:pointer;border:none;}
  input{font-family:${SF_STACK};}
  .tap{transition:transform .12s;}
  .tap:hover{transform:scale(1.03);}
  .tap:active{transform:scale(0.96);}
  .pop{animation:pop .25s cubic-bezier(.34,1.5,.64,1) both;}
  @keyframes pop{from{transform:scale(.85);opacity:0}to{transform:scale(1);opacity:1}}
  .fadein{animation:fadein .3s ease both;}
  @keyframes fadein{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
  ::-webkit-scrollbar{width:4px;height:4px;}
  ::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:4px;}
  /* Touch devices: <html class="touch-device"> is set at runtime by App. */
  html.touch-device,
  html.touch-device body,
  html.touch-device #root{
    height:auto !important;
    min-height:100% !important;
    max-height:none !important;
    overflow-y:auto !important;
    -webkit-overflow-scrolling:touch;
  }
  html.touch-device #root > div{
    /* Allow top-level screens to grow */
    overflow:visible !important;
  }
`;

const SITE_BACKGROUND_STYLE={
  backgroundColor:"var(--site-bg-color)",
  backgroundImage:"var(--site-bg-image)",
  backgroundPosition:"var(--site-bg-position)",
  backgroundSize:"var(--site-bg-size)",
  backgroundRepeat:"var(--site-bg-repeat)",
};

const TOP_HEADER_WATERCOLOR_STYLE={
  backgroundColor:"var(--header-bg-color)",
  backgroundImage:"var(--header-bg-image)",
  backgroundPosition:"var(--header-bg-position)",
  backgroundSize:"var(--header-bg-size)",
  backgroundRepeat:"var(--header-bg-repeat)",
  boxShadow:"var(--header-box-shadow)",
  backdropFilter:"var(--header-backdrop-filter)",
  WebkitBackdropFilter:"var(--header-backdrop-filter)",
};

function getInitialThemeMode(){
  if(typeof window==="undefined") return "dark";
  const stored=window.localStorage.getItem(THEME_STORAGE_KEY);
  return stored==="light"?"light":"dark";
}

export default function App(){
  const initialAccountSession=getCachedAccountSession();
  const initialQuestionUsageSnapshot=getCachedQuestionUsageSnapshot(initialAccountSession?.user?.id);
  const [themeMode,setThemeMode]=useState(getInitialThemeMode);
  const [language,setLanguage]=useState(getInitialLanguage);
  // Mark <html> with touch-device class for reliable mobile-scroll CSS overrides.
  useEffect(()=>{
    if(typeof window==="undefined") return;
    const detect=()=>{
      try{
        if(!window.matchMedia) return false;
        // Desktop/laptop with mouse (even if it also has touch) → non-touch.
        if(window.matchMedia("(hover: hover)").matches) return false;
        if(window.matchMedia("(pointer: fine)").matches) return false;
        if(window.matchMedia("(hover: none) and (pointer: coarse)").matches) return true;
        if(window.matchMedia("(pointer: coarse)").matches) return true;
      }catch{}
      return false;
    };
    const clearForcedStyles=()=>{
      const html=document.documentElement;
      const body=document.body;
      html.style.height="";
      html.style.minHeight="";
      html.style.overflowY="";
      if(body){
        body.style.height="";
        body.style.minHeight="";
        body.style.overflowY="";
        body.style.webkitOverflowScrolling="";
      }
      const root=document.getElementById("root");
      if(root){
        root.style.height="";
        root.style.minHeight="";
        root.style.overflow="";
      }
    };
    const apply=()=>{
      const isTouch=detect();
      const html=document.documentElement;
      const body=document.body;
      if(isTouch){
        html.classList.add("touch-device");
        html.style.height="auto";
        html.style.minHeight="100%";
        html.style.overflowY="auto";
        if(body){
          body.style.height="auto";
          body.style.minHeight="100%";
          body.style.overflowY="auto";
          body.style.webkitOverflowScrolling="touch";
        }
        const root=document.getElementById("root");
        if(root){
          root.style.height="auto";
          root.style.minHeight="100%";
          root.style.overflow="visible";
        }
      }else{
        html.classList.remove("touch-device");
        clearForcedStyles();
      }
    };
    apply();
    window.addEventListener("resize",apply);
    window.addEventListener("orientationchange",apply);
    return()=>{
      window.removeEventListener("resize",apply);
      window.removeEventListener("orientationchange",apply);
    };
  },[]);
  const translationOriginalsRef=useRef(typeof window!=="undefined"?new WeakMap():null);
  useEffect(()=>{
    if(typeof document==="undefined") return;
    const root=document.documentElement;
    root.setAttribute("lang",language);
    root.setAttribute("dir",language==="ar"?"rtl":"ltr");
    try{ window.localStorage.setItem(LANG_STORAGE_KEY,language); }catch{}

    // ----- Translation cache (persisted across reloads) -----
    const CACHE_KEY="trivic-translation-cache-ar";
    let cache={};
    try{
      const raw=window.localStorage.getItem(CACHE_KEY);
      if(raw) cache=JSON.parse(raw)||{};
    }catch{}
    for(const k in AR_TRANSLATIONS){ if(!cache[k]) cache[k]=AR_TRANSLATIONS[k]; }
    let saveTimer=null;
    function persistCache(){
      if(saveTimer) return;
      saveTimer=setTimeout(()=>{
        saveTimer=null;
        try{ window.localStorage.setItem(CACHE_KEY,JSON.stringify(cache)); }catch{}
      },1500);
    }

    // Track nodes we've already touched so we never re-process them.
    // handled is per-language-pass; originals persists across passes via ref.
    const handled=new WeakSet();
    const originals=translationOriginalsRef.current||new WeakMap();
    if(!translationOriginalsRef.current) translationOriginalsRef.current=originals;
    let observer=null;
    let muted=false;

    function shouldSkipElement(el){
      if(!el||el.nodeType!==Node.ELEMENT_NODE) return false;
      const tag=el.tagName;
      if(tag==="SCRIPT"||tag==="STYLE"||tag==="INPUT"||tag==="TEXTAREA"||tag==="NOSCRIPT") return true;
      if(el.getAttribute&&el.getAttribute("data-no-translate")==="1") return true;
      return false;
    }
    function isTranslatable(text){
      if(!text) return false;
      const t=text.trim();
      if(t.length<2) return false;
      if(!/[A-Za-z]/.test(t)) return false;
      return true;
    }

    function writeNode(node,translated){
      const raw=node.nodeValue;
      if(raw==null) return;
      const lead=raw.match(/^\s*/)[0];
      const tail=raw.match(/\s*$/)[0];
      muted=true;
      node.nodeValue=lead+translated+tail;
      // Synchronously drain any pending observer records caused by our write.
      if(observer) observer.takeRecords();
      muted=false;
    }

    // Pending nodes awaiting network translation: key -> Set of nodes
    const pending=new Map();

    function processTextNode(node){
      if(handled.has(node)) return;
      const raw=node.nodeValue;
      if(raw==null) return;
      const key=raw.trim();
      // English revert path: do this BEFORE the translatability check, since
      // current text is likely Arabic (no Latin letters) and we still need to
      // restore it from the originals map.
      if(language==="en"){
        const orig=originals.get(node);
        if(orig!=null && raw!==orig){
          writeNode(node,orig.trim());
        }
        handled.add(node);
        return;
      }
      if(!isTranslatable(key)){ handled.add(node); return; }
      if(!originals.has(node)) originals.set(node,raw);
      if(cache[key]){
        writeNode(node,cache[key]);
        handled.add(node);
        return;
      }
      // queue for network translation (don't mark handled yet — we want to update it later)
      let bucket=pending.get(key);
      if(!bucket){ bucket=new Set(); pending.set(key,bucket); }
      bucket.add(node);
      scheduleFlush();
    }

    // Chunked initial walk so we never block the main thread.
    function walkChunked(rootNode,onDone){
      const stack=[rootNode];
      function step(){
        const start=performance.now();
        while(stack.length>0){
          if(performance.now()-start>12){
            // yield
            (window.requestIdleCallback||window.requestAnimationFrame)(step);
            return;
          }
          const node=stack.pop();
          if(!node) continue;
          if(node.nodeType===Node.TEXT_NODE){ processTextNode(node); continue; }
          if(node.nodeType!==Node.ELEMENT_NODE) continue;
          if(shouldSkipElement(node)) continue;
          const kids=node.childNodes;
          for(let i=kids.length-1;i>=0;i--) stack.push(kids[i]);
        }
        if(onDone) onDone();
      }
      step();
    }

    let flushTimer=null;
    let inFlight=0;
    const MAX_PARALLEL=4;
    const BATCH_SIZE=40;
    function scheduleFlush(){
      if(flushTimer) return;
      flushTimer=setTimeout(flushPending,150);
    }
    async function flushPending(){
      flushTimer=null;
      while(inFlight<MAX_PARALLEL && pending.size>0){
        const entries=Array.from(pending.entries()).slice(0,BATCH_SIZE);
        entries.forEach(([k])=>pending.delete(k));
        runBatch(entries);
      }
    }
    async function runBatch(entries){
      inFlight++;
      const keys=entries.map(([k])=>k);
      try{
        const sep="\n\u241F\n";
        const joined=keys.join(sep);
        const url="https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q="+encodeURIComponent(joined);
        const res=await fetch(url);
        if(res.ok){
          const data=await res.json();
          const chunks=(data[0]||[]).map(c=>c&&c[0]).filter(Boolean).join("");
          const parts=chunks.split(/\s*\u241F\s*/);
          if(parts.length===keys.length){
            for(let i=0;i<keys.length;i++){
              const tr=(parts[i]||"").trim();
              if(!tr) continue;
              cache[keys[i]]=tr;
              if(language==="ar"){
                const nodes=entries[i][1];
                nodes.forEach(n=>{
                  // Only apply if node still holds the same English text
                  const cur=(n.nodeValue||"").trim();
                  if(cur===keys[i]){
                    writeNode(n,tr);
                    handled.add(n);
                  }
                });
              }
            }
            persistCache();
          }
        }
      }catch{}
      inFlight--;
      if(pending.size>0) scheduleFlush();
    }

    if(document.body){
      walkChunked(document.body);
      observer=new MutationObserver((muts)=>{
        if(muted) return;
        for(const m of muts){
          if(m.type==="childList"){
            m.addedNodes.forEach(n=>{
              if(n.nodeType===Node.TEXT_NODE){ processTextNode(n); }
              else if(n.nodeType===Node.ELEMENT_NODE){ walkChunked(n); }
            });
          }else if(m.type==="characterData"){
            // Only re-process if not previously handled
            if(!handled.has(m.target)) processTextNode(m.target);
          }
        }
      });
      observer.observe(document.body,{childList:true,subtree:true,characterData:true});
    }
    return()=>{
      if(observer) observer.disconnect();
      if(flushTimer){ clearTimeout(flushTimer); flushTimer=null; }
      if(saveTimer){
        clearTimeout(saveTimer); saveTimer=null;
        try{ window.localStorage.setItem(CACHE_KEY,JSON.stringify(cache)); }catch{}
      }
    };
  },[language]);
  const [authMode,setAuthMode]=useState("login");
  const [authUsername,setAuthUsername]=useState("");
  const [authPassword,setAuthPassword]=useState("");
  const [authError,setAuthError]=useState("");
  const [authBusy,setAuthBusy]=useState(false);
  const [authReady,setAuthReady]=useState(false);
  const [accountSession,setAccountSession]=useState(initialAccountSession);
  const [screen,setScreen]=useState("setup");
  const [teams,setTeams]=useState(["Team 1","Team 2"]);
  const [scores,setScores]=useState([0,0]);
  const [selCats,setSelCats]=useState([]);
  const [board,setBoard]=useState({});
  const [qPointers,setQPointers]=useState({});
  const [pendingTileQuestions,setPendingTileQuestions]=useState({});
  const [usedQuestionIds,setUsedQuestionIds]=useState(initialQuestionUsageSnapshot.ids);
  const [questionUsageResetToken,setQuestionUsageResetToken]=useState(initialQuestionUsageSnapshot.resetToken);
  const [activeTile,setActiveTile]=useState(null);
  const [showAns,setShowAns]=useState(false);
  const [showWord,setShowWord]=useState(false);
  const [curTeam,setCurTeam]=useState(0);
  const [usageReady,setUsageReady]=useState(false);
  const [isSyncingUsage,setIsSyncingUsage]=useState(false);
  const usedQuestionIdsRef=useRef(usedQuestionIds);
  const questionUsageResetTokenRef=useRef(questionUsageResetToken);

  useEffect(()=>{
    if(typeof document==="undefined") return;
    const root=document.documentElement;
    root.classList.remove("theme-dark","theme-light");
    root.classList.add(themeMode==="light"?"theme-light":"theme-dark");
    try{
      window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    }catch{}
  },[themeMode]);

  useEffect(()=>{
    if(typeof document==="undefined") return;
    const html=document.documentElement;
    const body=document.body;
    const root=document.getElementById("root");
    const prevHtmlOverflow=html.style.overflow;
    const prevHtmlOverflowY=html.style.overflowY;
    const prevBodyOverflow=body.style.overflow;
    const prevBodyOverflowY=body.style.overflowY;
    const prevHtmlHeight=html.style.height;
    const prevBodyHeight=body.style.height;
    const prevRootOverflow=root?.style.overflow ?? "";
    const prevRootHeight=root?.style.height ?? "";
    const shouldScroll=screen==="categories";

    html.style.height="100%";
    body.style.height="100%";
    html.style.overflow=shouldScroll?"auto":"hidden";
    html.style.overflowY=shouldScroll?"auto":"hidden";
    body.style.overflow=shouldScroll?"auto":"hidden";
    body.style.overflowY=shouldScroll?"auto":"hidden";
    if(root){
      root.style.height="100%";
      root.style.overflow=shouldScroll?"auto":"hidden";
    }

    return()=>{
      html.style.overflow=prevHtmlOverflow;
      html.style.overflowY=prevHtmlOverflowY;
      body.style.overflow=prevBodyOverflow;
      body.style.overflowY=prevBodyOverflowY;
      html.style.height=prevHtmlHeight;
      body.style.height=prevBodyHeight;
      if(root){
        root.style.overflow=prevRootOverflow;
        root.style.height=prevRootHeight;
      }
    };
  },[screen]);

  useEffect(()=>{
    usedQuestionIdsRef.current=usedQuestionIds;
  },[usedQuestionIds]);

  useEffect(()=>{
    questionUsageResetTokenRef.current=questionUsageResetToken;
  },[questionUsageResetToken]);

  useEffect(()=>{
    let cancelled=false;
    loadAccountSession().then((session)=>{
      if(cancelled) return;
      setAccountSession(session);
      setAuthReady(true);
    }).catch(()=>{
      if(cancelled) return;
      setAccountSession(null);
      setAuthReady(true);
    });
    return()=>{cancelled=true;};
  },[]);

  useEffect(()=>{
    if(!authReady) return;
    if(!accountSession){
      usedQuestionIdsRef.current=[];
      questionUsageResetTokenRef.current="initial";
      setUsedQuestionIds([]);
      setQuestionUsageResetToken("initial");
      setUsageReady(false);
      return;
    }
    const cachedSnapshot=getCachedQuestionUsageSnapshot(accountSession.user.id);
    usedQuestionIdsRef.current=cachedSnapshot.ids;
    questionUsageResetTokenRef.current=cachedSnapshot.resetToken;
    setUsedQuestionIds(cachedSnapshot.ids);
    setQuestionUsageResetToken(cachedSnapshot.resetToken);
    setUsageReady(false);
    let cancelled=false;
    loadSharedQuestionUsage({
      accountId: accountSession.user.id,
      sessionToken: accountSession.sessionToken,
    }).then((snapshot)=>{
      if(cancelled) return;
      usedQuestionIdsRef.current=snapshot.ids;
      questionUsageResetTokenRef.current=snapshot.resetToken;
      setUsedQuestionIds(snapshot.ids);
      setQuestionUsageResetToken(snapshot.resetToken);
      setUsageReady(true);
    }).catch(()=>{
      if(cancelled) return;
      setUsageReady(true);
    });
    return()=>{cancelled=true;};
  },[accountSession,authReady]);

  async function syncQuestionUsage(){
    if(!accountSession) return [];
    setIsSyncingUsage(true);
    try{
      const snapshot=await loadSharedQuestionUsage({
        accountId: accountSession.user.id,
        sessionToken: accountSession.sessionToken,
      });
      usedQuestionIdsRef.current=snapshot.ids;
      questionUsageResetTokenRef.current=snapshot.resetToken;
      setUsedQuestionIds(snapshot.ids);
      setQuestionUsageResetToken(snapshot.resetToken);
      return snapshot.ids;
    }finally{
      setUsageReady(true);
      setIsSyncingUsage(false);
    }
  }

  function persistQuestionUsage(questionIds){
    const normalizedIds=mergeQuestionUsageIds(Array.isArray(questionIds)?questionIds:[questionIds]);
    if(normalizedIds.length===0) return;
    const currentIds=usedQuestionIdsRef.current;
    const nextIds=mergeQuestionUsageIds(currentIds,normalizedIds);
    if(nextIds.length===currentIds.length) return;
    usedQuestionIdsRef.current=nextIds;
    setUsedQuestionIds(nextIds);
    appendSharedQuestionUsage(currentIds,normalizedIds,questionUsageResetTokenRef.current,{
      accountId: accountSession?.user?.id,
      sessionToken: accountSession?.sessionToken,
    }).then((snapshot)=>{
      usedQuestionIdsRef.current=snapshot.ids;
      questionUsageResetTokenRef.current=snapshot.resetToken;
      setUsedQuestionIds(snapshot.ids);
      setQuestionUsageResetToken(snapshot.resetToken);
    }).catch(()=>{});
  }

  async function handleAuthSubmit(e){
    e?.preventDefault?.();
    setAuthBusy(true);
    setAuthError("");
    try{
      const session=authMode==="signup"
        ? await signupAccount(authUsername,authPassword)
        : await loginAccount(authUsername,authPassword);
      setAccountSession(session);
      setAuthUsername("");
      setAuthPassword("");
      setScreen("setup");
    }catch(error){
      setAuthError(error?.message||"Unable to sign in");
    }finally{
      setAuthBusy(false);
    }
  }

  async function handleLogout(){
    await logoutAccount(accountSession?.sessionToken);
    setAccountSession(null);
    setAuthUsername("");
    setAuthPassword("");
    setAuthError("");
    setScreen("setup");
    setTeams(["Team 1","Team 2"]);
    setScores([0,0]);
    setSelCats([]);
    setBoard({});
    setQPointers({});
    setPendingTileQuestions({});
    setActiveTile(null);
    setShowAns(false);
    setShowWord(false);
    setCurTeam(0);
    usedQuestionIdsRef.current=[];
    questionUsageResetTokenRef.current="initial";
    setUsedQuestionIds([]);
    setQuestionUsageResetToken("initial");
    setUsageReady(false);
  }

  async function startGame(cats){
    const latestIds=await syncQuestionUsage();
    setQPointers(initPointers(cats,buildUsedQuestionLookup(latestIds)));
    setPendingTileQuestions({});
    setBoard(makeBoard(cats));
    setSelCats(cats);
    setScores([0,0]);
    setCurTeam(0);
    setScreen("board");
  }

  function adjustScore(teamIdx, delta){
    setScores(prev=>{
      const next=[...prev];
      next[teamIdx]=Math.max(0,(next[teamIdx]||0)+delta);
      return next;
    });
  }

  function goBackToBoard(){
    setActiveTile(null);
    setShowAns(false);
    setShowWord(false);
    setScreen("board");
  }

  function getTileReservationKey(catId, pts, idx){
    return `${catId}:${pts}:${idx}`;
  }

  function buildReservedQuestionLookup(excludeKey=null){
    const ids=[];
    Object.entries(pendingTileQuestions||{}).forEach(([key,entry])=>{
      if(!entry||key===excludeKey) return;
      ids.push(...getQuestionUsageKeys(entry));
    });
    return buildUsedQuestionLookup(ids);
  }

  async function pickTile(catId,pts,idx){
    const tileKey=getTileReservationKey(catId,pts,idx);
    const reservedQuestion=pendingTileQuestions?.[tileKey];
    if(reservedQuestion){
      setActiveTile({catId,pts,tileIdx:idx,_tileKey:tileKey,...reservedQuestion});
      setShowAns(false);
      setShowWord(false);
      setScreen("question");
      return;
    }
    const latestIds=await syncQuestionUsage();
    const usedIdsSet=buildUsedQuestionLookup(latestIds);
    const reservedLookup=buildReservedQuestionLookup(tileKey);
    const slot=qPointers?.[catId]?.[pts];
    const slotTail=Array.isArray(slot?.pool)?slot.pool.slice(slot.idx||0):[];
    let sourcePool=slotTail.filter((entry)=>!isQuestionConsumed(entry,usedIdsSet)&&!isQuestionConsumed(entry,reservedLookup));
    if(sourcePool.length===0){
      sourcePool=buildTierPool(catId, pts, usedIdsSet).filter((entry)=>!isQuestionConsumed(entry,reservedLookup));
    }
    const q=sourcePool[0];
    if(!q) return;
    setPendingTileQuestions(prev=>({...prev,[tileKey]:q}));
    setActiveTile({catId,pts,tileIdx:idx,_tileKey:tileKey,...q});
    setShowAns(false);
    setShowWord(false);
    setScreen("question");
  }

  function markUsed(){
    setBoard(prev=>{const arr=[...prev[activeTile.catId][activeTile.pts]];arr[activeTile.tileIdx]=true;return{...prev,[activeTile.catId]:{...prev[activeTile.catId],[activeTile.pts]:arr}};});
  }

  function consumeActiveTile(){
    if(!activeTile) return;
    persistQuestionUsage(getQuestionUsageKeys(activeTile));
    markUsed();
    if(activeTile._tileKey){
      setPendingTileQuestions(prev=>{
        if(!prev?.[activeTile._tileKey]) return prev;
        const next={...prev};
        delete next[activeTile._tileKey];
        return next;
      });
    }
  }

  function revealActiveAnswer(){
    consumeActiveTile();
    setShowAns(true);
  }

  function revealActiveWord(){
    consumeActiveTile();
    setShowWord(true);
  }

  function afterQ(winnerIdx,pts){
    consumeActiveTile();
    if(winnerIdx!=null){setScores(prev=>{const s=[...prev];s[winnerIdx]+=pts;return s;});setCurTeam(winnerIdx===0?1:0);}
    setTimeout(()=>setBoard(prev=>{const rem=Object.keys(prev).some(c=>Object.values(prev[c]).some(a=>a.some(u=>!u)));setScreen(rem?"board":"gameover");return prev;}),0);
  }
  function doWrong(){consumeActiveTile();setScores(prev=>{const s=[...prev];s[curTeam]=Math.max(0,s[curTeam]-Math.round(activeTile.pts/2));return s;});setTimeout(()=>setBoard(prev=>{const rem=Object.keys(prev).some(c=>Object.values(prev[c]).some(a=>a.some(u=>!u)));setScreen(rem?"board":"gameover");return prev;}),0);}

  const cat=activeTile&&BANK[activeTile.catId];
  const ttype=cat?(cat.isWhoAmI?"whoami":cat.isCharades?"charades":cat.isCountryMap?"countrymap":cat.isMovieScene?"moviescene":cat.isSongClip?"songclip":"trivia"):null;
  const renderWithGlobalThemeToggle=(content)=>(
    <>
      <div style={{position:"fixed",top:18,left:18,zIndex:5000,display:"flex",gap:10,alignItems:"center"}}>
        <ThemeModeToggle themeMode={themeMode} onChange={setThemeMode}/>
        <LanguageToggle language={language} onChange={setLanguage} themeMode={themeMode}/>
      </div>
      {content}
    </>
  );

  if(!authReady) return renderWithGlobalThemeToggle(
    <div style={{minHeight:"100dvh",...SITE_BACKGROUND_STYLE,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,gap:18}}>
      <style>{CSS}</style>
      <div style={{fontFamily:SF_STACK,fontSize:"clamp(64px,16vw,104px)",fontWeight:900,color:"#1E293B",lineHeight:.9,letterSpacing:2}}>TRIVIC</div>
      <div style={{fontSize:16,color:"#64748B",fontWeight:800,letterSpacing:1.5}}>Loading account...</div>
    </div>
  );
  if(!accountSession) return renderWithGlobalThemeToggle(<AuthScreen mode={authMode} setMode={setAuthMode} username={authUsername} setUsername={setAuthUsername} password={authPassword} setPassword={setAuthPassword} error={authError} isBusy={authBusy} onSubmit={handleAuthSubmit} themeMode={themeMode}/>);
  if(screen==="setup") return renderWithGlobalThemeToggle(<SetupScreen teams={teams} setTeams={setTeams} onNext={()=>setScreen("categories")} accountUser={accountSession.user} onLogout={handleLogout} themeMode={themeMode}/>);
  if(screen==="categories") return renderWithGlobalThemeToggle(<CategoryScreen selCats={selCats} setSelCats={setSelCats} onStart={startGame} onBack={()=>setScreen("setup")} usageReady={usageReady} isSyncingUsage={isSyncingUsage} themeMode={themeMode}/>);
  if(screen==="board") return renderWithGlobalThemeToggle(<BoardScreen teams={teams} scores={scores} curTeam={curTeam} board={board} selCats={selCats} onPick={pickTile} onGameOver={()=>setScreen("gameover")} onAdjustScore={adjustScore} themeMode={themeMode}/>);
  if(screen==="question"){
    const p={tile:activeTile,teams,scores,curTeam,showAns,setShowAns,onRevealAnswer:revealActiveAnswer,onRevealWord:revealActiveWord,onAward:(i,pts)=>afterQ(i,pts),onWrong:doWrong,onPass:()=>afterQ(null,0),onAdjustScore:adjustScore,onBackToBoard:goBackToBoard};
    if(ttype==="whoami") return renderWithGlobalThemeToggle(<WhoAmIScreen {...p}/>);
    if(ttype==="countrymap") return renderWithGlobalThemeToggle(<CountryMapScreen {...p}/>);
    if(ttype==="moviescene") return renderWithGlobalThemeToggle(<MovieSceneScreen {...p}/>);
    if(ttype==="songclip") return renderWithGlobalThemeToggle(<SongClipScreen {...p}/>);
    if(ttype==="charades") return renderWithGlobalThemeToggle(<CharadesScreen {...p} showWord={showWord} setShowWord={setShowWord}/>);
    return renderWithGlobalThemeToggle(<QuestionScreen {...p}/>);
  }
  if(screen==="gameover") return renderWithGlobalThemeToggle(<GameOverScreen teams={teams} scores={scores} onRematch={async()=>{const latestIds=await syncQuestionUsage();setQPointers(initPointers(selCats,new Set(latestIds)));setPendingTileQuestions({});setBoard(makeBoard(selCats));setScores([0,0]);setCurTeam(0);setScreen("board");}} onNewGame={()=>setScreen("setup")}/>);
  return null;
}

function ScoreBar({teams,scores,curTeam,onAdjustScore}){
  const viewport=useViewportSize();
  const isPhone=viewport.width<700;
  const padX=isPhone?8:16;
  const pillFont=isPhone?11:13;
  const pillPad=isPhone?"4px 8px":"6px 14px";
  const pillMinW=isPhone?0:92;
  const btnSize=isPhone?22:28;
  const btnFont=isPhone?14:18;
  const scoreFont=isPhone?20:26;
  const scoreMinW=isPhone?28:40;
  const innerGap=isPhone?5:8;
  return(
    <div style={{...TOP_HEADER_WATERCOLOR_STYLE,display:"flex",alignItems:"center",justifyContent:"space-between",padding:`${isPhone?6:10}px ${padX}px`,borderBottom:"1px solid #D7EAF2",minHeight:isPhone?44:54,maxWidth:"100vw",overflow:"hidden"}}>
      {teams.map((t,i)=>(
        <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",flex:1,minWidth:0,gap:isPhone?4:8}}>
          <div style={{
            fontSize:pillFont,
            fontWeight:900,
            color:i===curTeam?"#fff":TEAM_COLORS[i],
            letterSpacing:isPhone?.6:1.2,
            textTransform:"uppercase",
            background:i===curTeam?TEAM_COLORS[i]:"transparent",
            border:`2px solid ${TEAM_COLORS[i]}`,
            borderRadius:999,
            padding:pillPad,
            boxShadow:i===curTeam?`0 10px 18px ${withAlpha(TEAM_COLORS[i],"30")}`:"none",
            textAlign:"center",
            minWidth:pillMinW,
            maxWidth:"100%",
            whiteSpace:"nowrap",
            overflow:"hidden",
            textOverflow:"ellipsis",
          }}>{t}</div>
          <div style={{display:"flex",alignItems:"center",gap:innerGap}}>
            <button className="tap" onClick={()=>onAdjustScore?.(i,-100)} style={getGlassCircleButtonStyle({tint:TEAM_COLORS[i],size:btnSize,fontSize:btnFont})}><span style={{position:"relative",top:-1}}>-</span></button>
            <div style={{fontSize:scoreFont,fontWeight:900,color:i===curTeam?TEAM_COLORS[i]:"#94A3B8",fontFamily:SF_STACK,minWidth:scoreMinW,textAlign:"center"}}>{scores[i]}</div>
            <button className="tap" onClick={()=>onAdjustScore?.(i,100)} style={getGlassCircleButtonStyle({tint:TEAM_COLORS[i],size:btnSize,fontSize:btnFont})}><span style={{position:"relative",top:-1}}>+</span></button>
          </div>
        </div>
      ))}
      <div style={{fontSize:10,color:"#94A3B8",fontWeight:600,padding:`0 ${isPhone?4:8}px`}}>VS</div>
    </div>
  );
}

function BoardHeader({teams,scores,curTeam,allDone,onGameOver,onAdjustScore,themeMode}){
  const isDark=themeMode==="dark";
  const viewport=useViewportSize();
  const isPhone=viewport.width<700;
  const isNarrow=viewport.width<520;
  const headerPad=isPhone?"10px 10px 8px":"18px 24px 16px";
  const colGap=isPhone?8:20;
  const pillPad=isPhone?"6px 12px":"10px 24px";
  const pillFont=isPhone?(isNarrow?12:13):18;
  const pillMinW=isPhone?0:160;
  const pillLetter=isPhone?1.2:2.2;
  const btnSize=isPhone?28:40;
  const btnFont=isPhone?16:24;
  const scoreFont=isPhone?"clamp(24px,8vw,34px)":"clamp(44px,6vw,66px)";
  const scoreMinW=isPhone?34:58;
  const scoreGap=isPhone?6:14;
  const colGapV=isPhone?6:12;
  const vsFont=isPhone?"clamp(22px,6vw,32px)":"clamp(56px,7vw,88px)";
  const turnFont=isPhone?12:18;
  const centerMinW=isPhone?0:140;
  return(
    <div style={{...TOP_HEADER_WATERCOLOR_STYLE,borderBottom:"1px solid #D7EAF2",padding:headerPad,maxWidth:"100vw",overflow:"hidden"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",alignItems:"start",gap:colGap,minWidth:0}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:colGapV,minWidth:0}}>
          <div style={{
            fontSize:pillFont,
            fontWeight:900,
            color:"#fff",
            letterSpacing:pillLetter,
            textTransform:"uppercase",
            background:TEAM_COLORS[0],
            border:`2px solid ${TEAM_COLORS[0]}`,
            borderRadius:999,
            padding:pillPad,
            boxShadow:`0 12px 22px ${withAlpha(TEAM_COLORS[0],"35")}`,
            textAlign:"center",
            minWidth:pillMinW,
            maxWidth:"100%",
            whiteSpace:"nowrap",
            overflow:"hidden",
            textOverflow:"ellipsis",
          }}>{teams[0]}</div>
          <div style={{display:"flex",alignItems:"center",gap:scoreGap,minWidth:0}}>
            <button className="tap" onClick={()=>onAdjustScore?.(0,-100)} style={getGlassCircleButtonStyle({tint:TEAM_COLORS[0],size:btnSize,fontSize:btnFont})}><span style={{position:"relative",top:-1}}>-</span></button>
            <div style={{fontFamily:SF_STACK,fontWeight:900,fontSize:scoreFont,lineHeight:.9,color:TEAM_COLORS[0],minWidth:scoreMinW,textAlign:"center"}}>{scores[0]}</div>
            <button className="tap" onClick={()=>onAdjustScore?.(0,100)} style={getGlassCircleButtonStyle({tint:TEAM_COLORS[0],size:btnSize,fontSize:btnFont})}><span style={{position:"relative",top:-1}}>+</span></button>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:isPhone?2:6,minWidth:centerMinW}}>
          <div style={{fontFamily:SF_STACK,fontWeight:900,fontSize:vsFont,lineHeight:.82,color:isDark?"#E5E7EB":"#0F172A",letterSpacing:isPhone?1:2}}>VS</div>
          <div style={{fontSize:turnFont,fontWeight:900,color:TEAM_COLORS[curTeam],textAlign:"center",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:isPhone?80:160}}>{teams[curTeam]}'s turn</div>
          {allDone&&<button className="tap" onClick={onGameOver} style={getGlassButtonStyle({tint:"#2563EB",textColor:"#1E293B",fontSize:isPhone?11:13,padding:isPhone?"6px 10px":"8px 14px",borderRadius:999})}>RESULTS</button>}
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:colGapV,minWidth:0}}>
          <div style={{
            fontSize:pillFont,
            fontWeight:900,
            color:"#fff",
            letterSpacing:pillLetter,
            textTransform:"uppercase",
            background:TEAM_COLORS[1],
            border:`2px solid ${TEAM_COLORS[1]}`,
            borderRadius:999,
            padding:pillPad,
            boxShadow:`0 12px 22px ${withAlpha(TEAM_COLORS[1],"35")}`,
            textAlign:"center",
            minWidth:pillMinW,
            maxWidth:"100%",
            whiteSpace:"nowrap",
            overflow:"hidden",
            textOverflow:"ellipsis",
          }}>{teams[1]}</div>
          <div style={{display:"flex",alignItems:"center",gap:scoreGap,minWidth:0}}>
            <button className="tap" onClick={()=>onAdjustScore?.(1,-100)} style={getGlassCircleButtonStyle({tint:TEAM_COLORS[1],size:btnSize,fontSize:btnFont})}><span style={{position:"relative",top:-1}}>-</span></button>
            <div style={{fontFamily:SF_STACK,fontWeight:900,fontSize:scoreFont,lineHeight:.9,color:TEAM_COLORS[1],minWidth:scoreMinW,textAlign:"center"}}>{scores[1]}</div>
            <button className="tap" onClick={()=>onAdjustScore?.(1,100)} style={getGlassCircleButtonStyle({tint:TEAM_COLORS[1],size:btnSize,fontSize:btnFont})}><span style={{position:"relative",top:-1}}>+</span></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ThemeModeToggle({themeMode,onChange}){
  const isLight=themeMode==="light";
  return(
    <div style={{
      display:"inline-flex",
      alignItems:"center",
      gap:10,
      padding:"10px 14px",
      borderRadius:999,
      background:isLight?"rgba(255,255,255,.88)":"rgba(15,23,42,.72)",
      border:`1.5px solid ${isLight?"rgba(15,23,42,.12)":"rgba(255,255,255,.16)"}`,
      boxShadow:isLight?"0 14px 28px rgba(15,23,42,.12)":"0 14px 28px rgba(0,0,0,.28)",
      backdropFilter:"blur(12px) saturate(112%)",
      WebkitBackdropFilter:"blur(12px) saturate(112%)",
    }}>
      <span style={{fontSize:12,fontWeight:800,color:isLight?"#64748B":"#E2E8F0",letterSpacing:.4}}>Dark</span>
      <button
        type="button"
        className="tap"
        aria-label={`Switch to ${isLight?"dark":"light"} mode`}
        aria-pressed={isLight}
        onClick={()=>onChange(isLight?"dark":"light")}
        style={{
          width:58,
          height:32,
          borderRadius:999,
          padding:3,
          background:isLight
            ?"linear-gradient(135deg, #38BDF8 0%, #7DD3FC 44%, #E0F2FE 100%)"
            :"linear-gradient(135deg, #0F172A 0%, #1D4ED8 58%, #38BDF8 100%)",
          boxShadow:isLight
            ?"inset 0 1px 0 rgba(255,255,255,.65), 0 8px 20px rgba(56,189,248,.26)"
            :"inset 0 1px 0 rgba(255,255,255,.18), 0 8px 20px rgba(15,23,42,.35)",
          display:"flex",
          alignItems:"center",
        }}
      >
        <span style={{
          width:26,
          height:26,
          borderRadius:"50%",
          background:isLight
            ?"linear-gradient(180deg, #FFFFFF 0%, #EFF6FF 100%)"
            :"linear-gradient(180deg, #FFFFFF 0%, #DBEAFE 100%)",
          boxShadow:"0 4px 10px rgba(15,23,42,.22)",
          transform:`translateX(${isLight?26:0}px)`,
          transition:"transform .18s ease",
          display:"block",
        }}/>
      </button>
      <span style={{fontSize:12,fontWeight:800,color:isLight?"#0F172A":"#94A3B8",letterSpacing:.4}}>Light</span>
    </div>
  );
}

function LanguageToggle({language,onChange,themeMode}){
  const isLight=themeMode==="light";
  const isAr=language==="ar";
  return(
    <div style={{
      display:"inline-flex",
      alignItems:"center",
      gap:10,
      padding:"10px 14px",
      borderRadius:999,
      background:isLight?"rgba(255,255,255,.88)":"rgba(15,23,42,.72)",
      border:`1.5px solid ${isLight?"rgba(15,23,42,.12)":"rgba(255,255,255,.16)"}`,
      boxShadow:isLight?"0 14px 28px rgba(15,23,42,.12)":"0 14px 28px rgba(0,0,0,.28)",
      backdropFilter:"blur(12px) saturate(112%)",
      WebkitBackdropFilter:"blur(12px) saturate(112%)",
      direction:"ltr",
    }} data-no-translate="1">
      <span style={{fontSize:12,fontWeight:800,color:isLight?(isAr?"#64748B":"#0F172A"):(isAr?"#94A3B8":"#E2E8F0"),letterSpacing:.4}}>EN</span>
      <button
        type="button"
        className="tap"
        aria-label={`Switch language to ${isAr?"English":"Arabic"}`}
        aria-pressed={isAr}
        onClick={()=>onChange(isAr?"en":"ar")}
        style={{
          width:58,
          height:32,
          borderRadius:999,
          padding:3,
          background:isAr
            ?"linear-gradient(135deg, #059669 0%, #10B981 58%, #6EE7B7 100%)"
            :"linear-gradient(135deg, #1E293B 0%, #475569 58%, #94A3B8 100%)",
          boxShadow:isAr
            ?"inset 0 1px 0 rgba(255,255,255,.35), 0 8px 20px rgba(16,185,129,.32)"
            :"inset 0 1px 0 rgba(255,255,255,.18), 0 8px 20px rgba(15,23,42,.35)",
          display:"flex",
          alignItems:"center",
        }}
      >
        <span style={{
          width:26,
          height:26,
          borderRadius:"50%",
          background:"linear-gradient(180deg, #FFFFFF 0%, #E2E8F0 100%)",
          boxShadow:"0 4px 10px rgba(15,23,42,.22)",
          transform:`translateX(${isAr?26:0}px)`,
          transition:"transform .18s ease",
          display:"block",
        }}/>
      </button>
      <span style={{fontSize:12,fontWeight:800,color:isLight?(isAr?"#0F172A":"#64748B"):(isAr?"#E2E8F0":"#94A3B8"),letterSpacing:.4}}>AR</span>
    </div>
  );
}

function AuthScreen({mode,setMode,username,setUsername,password,setPassword,error,isBusy,onSubmit,themeMode}){
  const isSignup=mode==="signup";
  const isDark=themeMode==="dark";
  return(
    <div style={{minHeight:"100dvh",...SITE_BACKGROUND_STYLE,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,gap:28}}>
      <style>{CSS}</style>
      <div style={{textAlign:"center"}}>
        <div style={{fontFamily:SF_STACK,fontSize:"clamp(64px,16vw,104px)",fontWeight:900,color:isDark?"#E5E7EB":"#1E293B",lineHeight:.9,letterSpacing:2}}>TRIVIC</div>
      </div>
      <div style={{width:"100%",maxWidth:500,background:"#FFFFFF",borderRadius:28,border:"3px solid #0F172A",boxShadow:"0 24px 60px #0f172a14",padding:"24px 22px 22px",display:"flex",flexDirection:"column",gap:16}}>
        <div style={{display:"flex",gap:10}}>
          <button className="tap" onClick={()=>setMode("login")} style={{...getGlassButtonStyle({tint:"#2563EB",textColor:"#0F172A",fontSize:15,padding:"12px 0",borderRadius:16,subtle:false,selected:mode==="login",ringColor:withAlpha(lightenHex("#2563EB",0.52),"E6")}),flex:1}}>Sign In</button>
          <button className="tap" onClick={()=>setMode("signup")} style={{...getGlassButtonStyle({tint:"#7C3AED",textColor:"#0F172A",fontSize:15,padding:"12px 0",borderRadius:16,subtle:false,selected:mode==="signup",ringColor:withAlpha(lightenHex("#7C3AED",0.52),"E6")}),flex:1}}>Create Account</button>
        </div>
        <div style={{fontSize:14,color:"#475569",fontWeight:600,lineHeight:1.55,textAlign:"center"}}>
          {isSignup?"Create an account and your question pool starts fresh just for you.":"Sign in once and keep your own saved question pool across refreshes and devices."}
        </div>
        <form onSubmit={onSubmit} style={{display:"flex",flexDirection:"column",gap:14}}>
          <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Username" autoComplete="username"
            style={{width:"100%",padding:"16px 18px",borderRadius:18,border:"2px solid #CBD5E1",fontSize:18,fontWeight:700,background:"#fff",color:"#1E293B",outline:"none",textAlign:"center"}}/>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" autoComplete={isSignup?"new-password":"current-password"}
            style={{width:"100%",padding:"16px 18px",borderRadius:18,border:"2px solid #CBD5E1",fontSize:18,fontWeight:700,background:"#fff",color:"#1E293B",outline:"none",textAlign:"center"}}/>
          {error&&<div style={{fontSize:13,color:"#DC2626",fontWeight:800,textAlign:"center"}}>{error}</div>}
          <button className="tap" disabled={isBusy} style={{...getGlassButtonStyle({tint:isSignup?"#7C3AED":"#2563EB",textColor:"#0F172A",fontSize:19,padding:"16px 20px",borderRadius:18,disabled:isBusy}),marginTop:4,opacity:isBusy?.7:1}}>
            {isBusy?(isSignup?"Creating account...":"Signing in..."):(isSignup?"CREATE ACCOUNT":"SIGN IN")}
          </button>
        </form>
      </div>
    </div>
  );
}

function SetupScreen({teams,setTeams,onNext,accountUser,onLogout,themeMode}){
  const isDark=themeMode==="dark";
  return(
    <div style={{minHeight:"100dvh",...SITE_BACKGROUND_STYLE,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,gap:34}}>
      <style>{CSS}</style>
      <div style={{position:"absolute",top:20,right:20,display:"flex",alignItems:"center",gap:10}}>
        {accountUser&&<div style={{fontSize:13,fontWeight:800,color:"#475569",background:"#FFFFFF",border:"2px solid #CBD5E1",borderRadius:999,padding:"8px 14px"}}>{accountUser.username}</div>}
        <button className="tap" onClick={onLogout} style={getGlassButtonStyle({tint:"#EF4444",textColor:"#1E293B",fontSize:13,padding:"10px 16px",borderRadius:999,subtle:true,borderWidth:2})}>Sign Out</button>
      </div>
      <div style={{textAlign:"center"}}>
        <div style={{fontFamily:SF_STACK,fontSize:"clamp(64px,16vw,104px)",fontWeight:900,color:isDark?"#E5E7EB":"#3A4A67",lineHeight:.9,letterSpacing:2,textShadow:isDark?"0 1px 0 rgba(255,255,255,.04)":"0 1px 0 rgba(255,255,255,.08)"}}>TRIVIC</div>
        <div style={{fontSize:15,color:"#94A3B8",fontWeight:700,letterSpacing:3,marginTop:10}}>TEAM TRIVIA</div>
      </div>
      <div style={{width:"100%",maxWidth:520,display:"flex",flexDirection:"column",gap:18}}>
        {teams.map((t,i)=>(
          <div key={i}>
            <div style={{fontSize:14,fontWeight:800,color:TEAM_COLORS[i],letterSpacing:1.8,marginBottom:8,textTransform:"uppercase",textAlign:"center"}}>Team {i+1}</div>
            <input value={t} onChange={e=>{const n=[...teams];n[i]=e.target.value;setTeams(n);}} placeholder={`Team ${i+1}`}
              style={{
                width:"100%",
                padding:"18px 22px",
                borderRadius:18,
                border:`3px solid ${TEAM_COLORS[i]}`,
                fontSize:21,
                fontWeight:700,
                background:i===0
                  ?"linear-gradient(135deg, rgba(96,165,250,.34) 0%, rgba(191,219,254,.22) 18%, rgba(255,255,255,.96) 54%, rgba(219,234,254,.82) 100%)"
                  :"linear-gradient(135deg, rgba(248,113,113,.34) 0%, rgba(254,202,202,.22) 18%, rgba(255,255,255,.96) 54%, rgba(254,226,226,.84) 100%)",
                boxShadow:i===0
                  ?"inset 0 1px 0 rgba(255,255,255,.92), 0 12px 28px rgba(37,99,235,.16)"
                  :"inset 0 1px 0 rgba(255,255,255,.92), 0 12px 28px rgba(220,38,38,.16)",
                color:"#1E293B",
                outline:"none",
                textAlign:"center"
              }}/>
          </div>
        ))}
      </div>
      <button className="tap" onClick={onNext} style={getGlassButtonStyle({tint:"#2563EB",textColor:"#0F172A",fontSize:22,padding:"18px 56px",borderRadius:18})}>SELECT CATEGORIES -&gt;</button>
    </div>
  );
}

function CategoryScreen({selCats,setSelCats,onStart,onBack,usageReady,isSyncingUsage,themeMode}){
  const viewport=useViewportSize();
  const isDark=themeMode==="dark";
  const previewCardWidth=viewport.width<420?110:viewport.width<768?118:viewport.width<1280?126:132;
  const selectedPreviewHeight=188;
  const selectedToolbarHeight=selectedPreviewHeight+20;
  const toggle=id=>setSelCats(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  return(
    <div style={{minHeight:"100dvh",...SITE_BACKGROUND_STYLE,display:"flex",flexDirection:"column"}}>
      <style>{CSS}</style>
      <div style={{...TOP_HEADER_WATERCOLOR_STYLE,padding:"14px 16px 10px",borderBottom:"1px solid #D7EAF2",display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center"}}>
        <div style={{fontFamily:SF_STACK,fontSize:26,fontWeight:900,color:isDark?"#E5E7EB":"#1E293B",letterSpacing:1}}>SELECT CATEGORIES</div>
        <div style={{fontSize:14,color:isDark?"#CBD5E1":"#334155",fontWeight:700,marginTop:2}}>{selCats.length} selected</div>
        {!usageReady&&<div style={{fontSize:11,color:isDark?"#E2E8F0":"#475569",fontWeight:700,marginTop:4}}>Loading your account question history...</div>}
      </div>
      <div style={{...TOP_HEADER_WATERCOLOR_STYLE,display:"flex",gap:12,padding:"10px 16px",borderBottom:"1px solid #D7EAF2",alignItems:"center",flexWrap:"nowrap",minHeight:selectedToolbarHeight,position:"sticky",top:0,zIndex:28}}>
        <div style={{display:"flex",gap:8,flexWrap:"nowrap",alignItems:"center",flex:"0 0 auto"}}>
          {[["ALL","#1E293B",()=>setSelCats(CAT_IDS.filter(id=>BANK[id]))],["RANDOM MIX","#7C3AED",()=>{const picks=CAT_GROUPS.map(g=>shuffle(g.ids.filter(id=>BANK[id])).slice(0,2));setSelCats([...new Set(picks.flat())]);}],["CLEAR","#EF4444",()=>setSelCats([])]].map(([lbl,col,fn])=>(
            <button key={lbl} className="tap" onClick={fn} style={{...getGlassButtonStyle({tint:col,textColor:"#0F172A",fontSize:15,padding:"12px 20px",borderRadius:12,minHeight:48}),letterSpacing:.25}}>{lbl}</button>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"stretch",gap:8,flex:1,minWidth:"min(100%, 320px)",height:selectedPreviewHeight,overflowX:"auto",overflowY:"hidden",paddingBottom:2}}>
          {selCats.length===0?(
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",minWidth:260,fontSize:11,fontWeight:700,color:"#94A3B8",padding:"10px 12px",borderRadius:12,border:"1.5px dashed #CBD5E1",background:"#F8FAFC",whiteSpace:"nowrap"}}>
              Selected categories appear here
            </div>
          ):selCats.map(id=>{
            const c=BANK[id];
            return(
              <div key={id} style={{width:previewCardWidth,minWidth:previewCardWidth,height:selectedPreviewHeight,flex:"0 0 auto"}}>
                <CategoryPreviewCard
                  id={id}
                  category={c}
                  selected={true}
                  onToggle={()=>toggle(id)}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div style={{overflowY:"auto",flex:1,padding:"12px 0 18px",display:"flex",flexDirection:"column",gap:20,alignItems:"center"}}>
        {CAT_GROUPS.map(group=>{
          const gCats=group.ids.filter(id=>BANK[id]);
          if(!gCats.length) return null;
          const allSel=gCats.every(id=>selCats.includes(id));
          return(
            <div key={group.label} style={{width:"min(100%, 1500px)",padding:"0 16px",display:"flex",flexDirection:"column",alignItems:"center"}}>
              <div style={{width:"100%",minHeight:40,marginBottom:12,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:10,flexWrap:"wrap"}}>
                  <div style={{fontSize:25,fontWeight:900,color:isDark?"#E5E7EB":"#334155",lineHeight:1.1,textAlign:"center"}}>{group.label}</div>
                  <button onClick={()=>allSel?setSelCats(p=>p.filter(x=>!gCats.includes(x))):setSelCats(p=>[...new Set([...p,...gCats])])}
                    style={{...getGlassButtonStyle({tint:allSel?"#EF4444":"#3B82F6",textColor:allSel?"#DC2626":"#2563EB",fontSize:10,padding:"3px 8px",borderRadius:6,subtle:true}),fontWeight:700}}>
                    {allSel?"Remove all":"Add all"}
                  </button>
                </div>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",alignItems:"stretch",gap:10,width:"100%"}}>
                {gCats.map(id=>{const c=BANK[id];const sel=selCats.includes(id);
                  return(
                    <div key={id} style={{width:previewCardWidth,flex:`0 0 ${previewCardWidth}px`}}>
                      <CategoryPreviewCard
                        id={id}
                        category={c}
                        selected={sel}
                        onToggle={()=>toggle(id)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{...TOP_HEADER_WATERCOLOR_STYLE,padding:"12px 16px",borderTop:"1px solid #D7EAF2",display:"flex",gap:10,position:"sticky",bottom:0,zIndex:28}}>
        <button className="tap" onClick={onBack} style={{...getGlassButtonStyle({tint:"#64748B",textColor:"#475569",fontWeight:700,fontSize:14,padding:"13px 0",borderRadius:12,subtle:true,borderWidth:2}),flex:1}}>&lt;- Back</button>
        <button className="tap" onClick={()=>selCats.length>0&&usageReady&&!isSyncingUsage&&onStart(selCats)} style={{
          ...getGlassButtonStyle({tint:"#2563EB",textColor:selCats.length>0&&usageReady&&!isSyncingUsage?"#0F172A":"#C7D2E4",fontSize:14,padding:"13px 0",borderRadius:12,disabled:!(selCats.length>0&&usageReady&&!isSyncingUsage)}),
          flex:3,
          ...(!(selCats.length>0&&usageReady&&!isSyncingUsage)?{
            backgroundColor:"#243347",
            backgroundImage:"linear-gradient(180deg, rgba(255,255,255,.14) 0%, rgba(255,255,255,.03) 22%, rgba(255,255,255,0) 36%), linear-gradient(135deg, #364B66 0%, #2B3E56 48%, #1D2C3F 100%)",
            border:"2px solid rgba(255,255,255,.26)",
            boxShadow:"0 12px 22px rgba(0,0,0,.22), inset 0 1px 0 rgba(255,255,255,.2), inset 0 -1px 0 rgba(255,255,255,.05)",
            color:"#D7E3F3",
          }:{})
        }}>
          {!usageReady?"Loading account pool...":isSyncingUsage?"Syncing question pool...":selCats.length>0?`START (${selCats.length}) ->`:"Select at least 1"}
        </button>
      </div>
    </div>
  );
}

function BoardScreen({teams,scores,curTeam,board,selCats,onPick,onGameOver,onAdjustScore,themeMode}){
  const viewport=useViewportSize();
  const isTouch=useIsTouchDevice();
  const allDone=Object.keys(board).length>0&&Object.keys(board).every(c=>[200,400,600].every(p=>board[c][p].every(Boolean)));
  const isPhone=viewport.width<700;
  const isTablet=viewport.width<1100;
  const maxPerRow=isPhone?2:3;
  const categoryRows=buildBalancedRows(selCats,maxPerRow);
  const rowCount=Math.max(categoryRows.length,1);
  const compactBoard=rowCount>=2 || viewport.height<920;
  const baseCategoryGap=isPhone?6:isTablet?15:21;
  const categoryGapX=Math.round(baseCategoryGap*2);
  const categoryGapY=Math.round(baseCategoryGap*1.5);
  const headerBodyGap=isPhone?6:compactBoard?10:13;
  const innerGap=isPhone?2:compactBoard?3:4;
  const headerFont=isPhone?(viewport.width<420?11:13):compactBoard?17:20;
  const iconSize=isPhone?12:compactBoard?16:18;
  const tileFont=isPhone?13:compactBoard?20:24;
  const tileRadius=isPhone?6:isTablet?8:10;
  const artRadius=isPhone?7:isTablet?9:11;
  const headerHeight=isPhone?34:compactBoard?46:54;
  const bodyPadding=isPhone?6:compactBoard?10:12;
  const boardUsableWidth=Math.max(280,(viewport.width||1280)-(bodyPadding*2));
  const categoryWidth=Math.max(
    isPhone?110:198,
    Math.floor((boardUsableWidth-(categoryGapX*(maxPerRow-1)))/maxPerRow)
  );
  // Art column needs to leave room for the two side button columns.
  // On phones, give buttons at least ~32px each side.
  const minSideColumn=isPhone?32:48;
  const artColumnWidth=isPhone
    ? Math.max(48,Math.min(110,categoryWidth-(minSideColumn*2)))
    : compactBoard?186:222;
  const boardHeaderBg="#DCFCE7";
  const boardHeaderText="#000000";
  const boardPointBg={200:"#FFED29",400:"#FF5B00",600:"#FF000D"};
  const boardPointText={200:"#000000",400:"#000000",600:"#000000"};
  const getRowPixelWidth=(rowLength)=>{
    const contentWidth=(rowLength*categoryWidth)+(Math.max(0,rowLength-1)*categoryGapX);
    return Math.min(boardUsableWidth,contentWidth);
  };
  return(
    <div style={{minHeight:"100dvh",width:"100vw",maxWidth:"100vw",...SITE_BACKGROUND_STYLE,display:"flex",flexDirection:"column",overflow:isTouch?"visible":"hidden",height:isTouch?"auto":undefined}}>
      <style>{CSS}</style>
      <BoardHeader teams={teams} scores={scores} curTeam={curTeam} allDone={allDone} onGameOver={onGameOver} onAdjustScore={onAdjustScore} themeMode={themeMode}/>
      <div style={{flex:isTouch?"0 0 auto":1,minHeight:0,padding:bodyPadding,display:"flex",flexDirection:"column",overflow:isTouch?"visible":"hidden"}}>
        <div style={{height:8,borderTop:"2px solid #DBEAFE",borderRadius:"999px 999px 0 0",margin:"0 6px 10px"}}/>
        <div style={{flex:1,minHeight:0,display:"grid",gridTemplateRows:`repeat(${rowCount}, minmax(0,1fr))`,gap:categoryGapY,alignItems:"stretch"}}>
          {categoryRows.map((row,rowIdx)=>(
            <div key={rowIdx} style={{width:"100%",minHeight:0,display:"flex",justifyContent:"center",alignItems:"stretch"}}>
              <div style={{width:getRowPixelWidth(row.length),maxWidth:"100%",minHeight:0,display:"grid",gridTemplateColumns:`repeat(${row.length}, minmax(0,1fr))`,columnGap:categoryGapX,rowGap:categoryGapY}}>
                {row.map(catId=>{
                  const c=BANK[catId];if(!c)return null;
                  return(
                    <div key={catId} style={{minWidth:0,minHeight:0,height:"100%",display:"grid",gridTemplateRows:`${headerHeight}px minmax(0,1fr)`,gap:headerBodyGap}}>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"4px",background:boardHeaderBg,borderRadius:tileRadius,border:"2.5px solid #0F172A",minWidth:0}}>
                        <div style={{fontSize:iconSize,lineHeight:1,marginBottom:2}}>{c.icon}</div>
                        <div style={{fontSize:headerFont,fontWeight:800,color:boardHeaderText,lineHeight:1.1,wordBreak:"break-word"}}>{c.label}</div>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:`minmax(0,1fr) ${artColumnWidth}px minmax(0,1fr)`,gridTemplateRows:"repeat(3, minmax(0,1fr))",columnGap:0,rowGap:innerGap,minHeight:0}}>
                        <div style={{gridColumn:2,gridRow:"1 / span 3",minWidth:0,minHeight:0}}>
                          <BoardCategoryArt id={catId} category={c} radius={artRadius}/>
                        </div>
                        {[200,400,600].map((pts,rowIndex)=>(
                          (board[catId]?.[pts]||[false,false]).map((used,idx)=>(
                            <button key={`${pts}-${idx}`} className={used?"":"tap"} onClick={()=>!used&&onPick(catId,pts,idx)}
                              style={{gridColumn:idx===0?1:3,gridRow:rowIndex+1,width:"100%",height:"100%",minWidth:0,minHeight:0,padding:"6px 2px",borderRadius:tileRadius,border:"1.5px solid #0F172A",background:used?"linear-gradient(135deg, rgba(255,255,255,.85) 0%, rgba(226,232,240,.92) 100%)":getGlassTileBackground(boardPointBg[pts]),color:used?"#94A3B8":boardPointText[pts],fontFamily:SF_STACK,fontWeight:900,fontSize:tileFont,cursor:used?"default":"pointer",opacity:used?0.8:1,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:used?"0 8px 14px rgba(148,163,184,.12), inset 0 1px 0 rgba(255,255,255,.5)":"0 10px 18px rgba(15,23,42,.1), inset 0 1px 0 rgba(255,255,255,.5)",backdropFilter:"blur(12px) saturate(150%)",WebkitBackdropFilter:"blur(12px) saturate(150%)"}}>
                              {used?"✓":pts}
                            </button>
                          ))
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AwardRow({tile,teams,curTeam,onAward,onWrong,onPass}){
  return(
    <div className="fadein" style={{display:"flex",flexDirection:"column",gap:7,width:"100%",maxWidth:520}}>
      <div style={{fontSize:10,fontWeight:800,color:"#64748B",letterSpacing:1.05,textAlign:"center"}}>AWARD POINTS TO:</div>
      <div style={{display:"flex",gap:7}}>
        {teams.map((t,i)=>(
          <button key={i} className="tap" onClick={()=>onAward(i,tile.pts)} style={{...getGlassButtonStyle({tint:TEAM_COLORS[i],textColor:"#0F172A",fontSize:14,padding:"11px 10px",borderRadius:16}),flex:1,lineHeight:1.24}}>
            {t}<br/><span style={{fontSize:11,opacity:.88}}>+{tile.pts}</span>
          </button>
        ))}
      </div>
      <div style={{display:"flex",gap:7}}>
        <button className="tap" onClick={onWrong} style={{...getGlassButtonStyle({tint:"#EF4444",textColor:"#991B1B",fontWeight:700,fontSize:12,padding:"10px 10px",borderRadius:16,subtle:true}),flex:1}}>Wrong (-{Math.round(tile.pts/2)} from {teams[curTeam]})</button>
        <button className="tap" onClick={onPass} style={{...getGlassButtonStyle({tint:"#64748B",textColor:"#475569",fontWeight:700,fontSize:12,padding:"10px 10px",borderRadius:16,subtle:true}),flex:1}}>Pass</button>
      </div>
    </div>
  );
}

function formatAnswerForDisplay(answer){
  let text = String(answer ?? "").replace(/\s+/g," ").trim();
  if (!text) return text;

  text = text.replace(/\((and [^)]+)\)/gi, " $1");
  text = text.replace(/\s+as of\s+\d{4}.*$/i, "");
  text = text.replace(/\s+featuring\s+.+$/i, "");

  if (
    /^[^.;]+(?:\s*\([^)]+\))?(?:,\s*[^.;]+(?:\s*\([^)]+\))?)+$/.test(text) ||
    /^[^.;]+?\s\([^)]+\)$/.test(text)
  ) {
    text = text.replace(/\s*\((?!and\b)[^)]*\)/gi, "");
  }

  const dashParts = text.split(/\s[—–-]\s/);
  if (dashParts.length === 2) {
    const [head, tail] = dashParts.map((part) => part.trim());
    if (head.length >= 3 && tail.length > 0) {
      text = head;
    }
  }

  if (text.length > 95 && text.includes(". ")) {
    text = text.split(/\. +/)[0].trim();
  }

  if (/\s+or\s+/i.test(text) && !/,/.test(text)) {
    const [head] = text.split(/\s+or\s+/i);
    if (answerWordCount(head) >= 1) {
      text = head.trim();
    }
  }

  return text
    .replace(/\s+,/g, ",")
    .replace(/\s{2,}/g, " ")
    .replace(/\.$/, "")
    .trim();
}

function formatQuestionForDisplay(question){
  let text = String(question ?? "").replace(/\s+/g, " ").trim();
  if (!text) return text;

  text = text
    .replace(/\s+and\s+why\s+is\s+it\s+remarkable\?$/i, "?")
    .replace(/\s+and\s+why\s+was\s+it\s+controversial\?$/i, "?")
    .replace(/\s+and\s+why\s+is\s+he\s+significant\?$/i, "?")
    .replace(/\s+and\s+why\s+is\s+it\s+significant\?$/i, "?")
    .replace(/\s+and\s+what\s+opened\s+it\?$/i, "?")
    .replace(/\s+and\s+what\s+is\s+it\?$/i, "?")
    .replace(/\s+and\s+what\s+is\s+barry's\s+role\?$/i, "?")
    .replace(/\s+and\s+what\s+is\s+his\s+most\s+famous\s+moment\?$/i, "?");

  return text
    .replace(/\s+\?/g, "?")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// Regular trivia - flag emoji shown big if flags category
const QUESTION_HEADER_WRAP_STYLE={
  display:"flex",
  gap:"clamp(8px,2vw,16px)",
  alignItems:"center",
  justifyContent:"center",
  flexWrap:"wrap",
  paddingTop:6,
  maxWidth:"100%",
};

const QUESTION_HEADER_ICON_STYLE={fontSize:"clamp(20px,4vw,34px)",lineHeight:1};

const QUESTION_HEADER_TITLE_STYLE={
  fontFamily:SF_STACK,
  fontWeight:900,
  fontSize:"clamp(20px,5.8vw,58px)",
  color:"#1E293B",
  letterSpacing:1.2,
  lineHeight:1,
  textAlign:"center",
  wordBreak:"break-word",
  maxWidth:"100%",
};

const QUESTION_HEADER_POINTS_STYLE=(pc,pb)=>({
  background:pb,
  color:pc,
  fontFamily:SF_STACK,
  fontWeight:900,
  fontSize:"clamp(18px,4.8vw,44px)",
  lineHeight:1,
  padding:"clamp(8px,1.6vw,12px) clamp(14px,2.6vw,22px)",
  borderRadius:999,
  border:`2px solid ${pc}55`,
  boxShadow:`0 12px 30px ${pc}18`,
  minWidth:"clamp(56px,9vw,94px)",
  textAlign:"center",
});

const QUESTION_SCREEN_STYLE={
  height:"100dvh",
  minHeight:"100dvh",
  maxHeight:"100dvh",
  ...SITE_BACKGROUND_STYLE,
  display:"flex",
  flexDirection:"column",
  position:"relative",
  overflow:"hidden",
};

const QUESTION_BODY_CENTER_STYLE={
  position:"relative",
  flex:1,
  minHeight:0,
  display:"flex",
  flexDirection:"column",
  alignItems:"center",
  justifyContent:"flex-start",
  padding:"0 clamp(14px, 3.2vw, 24px) clamp(18px, 3.2vh, 28px)",
  gap:"clamp(10px, 1.8vw, 16px)",
  overflow:"hidden",
};

const QUESTION_BODY_SCROLL_STYLE={
  position:"relative",
  flex:1,
  minHeight:0,
  display:"flex",
  flexDirection:"column",
  alignItems:"center",
  padding:"0 clamp(14px, 3.2vw, 24px) clamp(18px, 3.2vh, 28px)",
  gap:"clamp(10px, 1.8vw, 16px)",
  overflow:"hidden",
};

const QUESTION_STAGE_STYLE={
  position:"relative",
  width:"100%",
  maxWidth:920,
  display:"flex",
  flexDirection:"column",
  alignItems:"center",
  justifyContent:"flex-start",
  gap:"clamp(8px, 1.5vw, 14px)",
  paddingTop:"clamp(6px, .8vh, 12px)",
  zIndex:1,
};

const QUESTION_TIMER_SLOT_STYLE={
  width:"100%",
  minHeight:"clamp(110px, 18vh, 220px)",
  display:"flex",
  alignItems:"center",
  justifyContent:"center",
  marginBottom:"clamp(8px, 2vh, 26px)",
  flex:"0 0 auto",
};

const QUESTION_HINT_STYLE={
  fontSize:18,
  fontWeight:800,
  color:"#475569",
  letterSpacing:.2,
  textAlign:"center",
};

const QUESTION_PRIMARY_BUTTON_STYLE={
  ...getGlassButtonStyle({
    tint:"#2563EB",
    textColor:"#0F172A",
    fontWeight:900,
    fontSize:18,
    padding:"18px 42px",
    borderRadius:18,
  }),
};

const QUESTION_SECONDARY_BUTTON_STYLE={
  ...getGlassButtonStyle({
    tint:"#7C3AED",
    textColor:"#334155",
    fontWeight:800,
    fontSize:14,
    padding:"14px 24px",
    borderRadius:14,
    subtle:true,
  }),
};

const QUESTION_ACTION_ROW_STYLE={
  display:"flex",
  flexWrap:"wrap",
  alignItems:"center",
  justifyContent:"center",
  gap:14,
};

const QUESTION_BACK_BUTTON_WRAP_STYLE={
  display:"flex",
  justifyContent:"center",
  width:"100%",
  marginTop:14,
};

const TOUCH_SCREEN_STYLE_OVERRIDE={
  height:"auto",
  minHeight:"100dvh",
  maxHeight:"none",
  overflow:"visible",
};
const TOUCH_BODY_STYLE_OVERRIDE={
  overflow:"visible",
  minHeight:0,
  flex:"0 0 auto",
};

const QUESTION_TIMER_SIZE=156;

function useIsTouchDevice(){
  const get=()=>{
    if(typeof window==="undefined") return false;
    if(!window.matchMedia) return false;
    // If the browser reports a fine pointer or hover capability, it's a desktop/laptop
    // (even if it also has a touchscreen). Treat as non-touch.
    if(window.matchMedia("(hover: hover)").matches) return false;
    if(window.matchMedia("(pointer: fine)").matches) return false;
    // Real phone/tablet: no hover, coarse pointer.
    if(window.matchMedia("(hover: none) and (pointer: coarse)").matches) return true;
    if(window.matchMedia("(pointer: coarse)").matches) return true;
    return false;
  };
  const [is,setIs]=useState(get);
  useEffect(()=>{
    setIs(get());
  },[]);
  return is;
}

function useViewportSize(){
  const getSize=()=>({
    width: typeof window!=="undefined" ? window.innerWidth : 1440,
    height: typeof window!=="undefined" ? window.innerHeight : 900,
  });
  const [size,setSize]=useState(getSize);

  useEffect(()=>{
    const update=()=>setSize(getSize());
    window.addEventListener("resize",update);
    window.addEventListener("orientationchange",update);
    return()=>{
      window.removeEventListener("resize",update);
      window.removeEventListener("orientationchange",update);
    };
  },[]);

  return size;
}

function buildBalancedRows(items,maxPerRow){
  const safeItems=Array.isArray(items)?items:[];
  const safeMax=Math.max(1,maxPerRow||1);
  const rowCount=Math.max(1,Math.ceil(Math.max(safeItems.length,1)/safeMax));
  const baseRowSize=Math.floor(Math.max(safeItems.length,1)/rowCount);
  const extraItems=Math.max(safeItems.length,1)%rowCount;
  const rows=[];
  let cursor=0;

  for(let rowIdx=0;rowIdx<rowCount;rowIdx+=1){
    const rowSize=baseRowSize+(rowIdx<extraItems?1:0);
    const row=safeItems.slice(cursor,cursor+rowSize);
    if(row.length) rows.push(row);
    cursor+=rowSize;
  }

  return rows.length>0?rows:[[]];
}

function getQuestionTimerSeconds(tile){
  if(!tile) return 60;
  const cat=BANK?.[tile.catId];
  if(cat?.isCharades){
    if(tile.pts===400) return 75;
    if(tile.pts===600) return 90;
  }
  return 60;
}

function withAlpha(hex, alpha="22"){
  return /^#[0-9A-F]{6}$/i.test(hex||"") ? `${hex}${alpha}` : hex;
}

function lightenHex(hex, amount=0.45){
  if(!/^#[0-9A-F]{6}$/i.test(hex||"")) return hex;
  const safe=Math.max(0,Math.min(1,amount));
  const r=parseInt(hex.slice(1,3),16);
  const g=parseInt(hex.slice(3,5),16);
  const b=parseInt(hex.slice(5,7),16);
  const mix=value=>Math.round(value+(255-value)*safe).toString(16).padStart(2,"0");
  return `#${mix(r)}${mix(g)}${mix(b)}`;
}

function getGlassButtonStyle({
  tint="#7C3AED",
  textColor="#0F172A",
  padding="12px 20px",
  borderRadius=16,
  fontSize=15,
  fontWeight=800,
  minHeight,
  width,
  height,
  subtle=false,
  disabled=false,
  borderWidth=1.5,
  selected=false,
  ringColor,
}={}){
  const glow=lightenHex(tint,0.52);
  const bright=lightenHex(tint,0.34);
  const soft=lightenHex(tint,0.2);
  const deep=lightenHex(tint,0.02);
  return{
    backdropFilter:"none",
    WebkitBackdropFilter:"none",
    backgroundBlendMode:"screen, screen, normal, normal",
    background:disabled
      ?"linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)"
      :subtle
        ?`linear-gradient(155deg, rgba(255,255,255,.68) 0%, rgba(255,255,255,.24) 34%, rgba(255,255,255,.08) 100%),
           radial-gradient(circle at 22% 18%, ${withAlpha(glow,"F0")} 0%, ${withAlpha(glow,"66")} 22%, transparent 48%),
           radial-gradient(circle at 82% 84%, ${withAlpha(deep,"D0")} 0%, ${withAlpha(deep,"54")} 22%, transparent 46%),
           linear-gradient(135deg, ${soft} 0%, ${bright} 52%, ${deep} 100%)`
        :`linear-gradient(155deg, rgba(255,255,255,.78) 0%, rgba(255,255,255,.28) 28%, rgba(255,255,255,.08) 100%),
           radial-gradient(circle at 20% 16%, ${withAlpha(glow,"FF")} 0%, ${withAlpha(glow,"78")} 24%, transparent 50%),
           radial-gradient(circle at 84% 84%, ${withAlpha(deep,"F2")} 0%, ${withAlpha(deep,"5C")} 22%, transparent 48%),
           linear-gradient(135deg, ${soft} 0%, ${bright} 56%, ${deep} 100%)`,
    border:`${borderWidth}px solid ${disabled?"#CBD5E1":"rgba(255,255,255,.92)"}`,
    boxShadow:disabled
      ?"0 10px 20px rgba(15,23,42,.08), inset 0 1px 0 rgba(255,255,255,.8)"
      :`${selected?`0 0 0 3px ${(ringColor||withAlpha(glow,"E8"))}, `:""}0 18px 34px ${withAlpha(deep, subtle?"24":"46")}, 0 8px 18px ${withAlpha(tint, subtle?"24":"3A")}, inset 0 1px 0 rgba(255,255,255,.9), inset 0 -1px 0 rgba(255,255,255,.12), inset 0 -14px 30px rgba(0,0,0,.08)`,
    color:textColor,
    padding,
    borderRadius,
    fontSize,
    fontWeight,
    minHeight,
    width,
    height,
  };
}

function getGlassCircleButtonStyle({tint="#2563EB",size=34,fontSize=22,textColor="#0F172A"}={}){
  return{
    ...getGlassButtonStyle({
      tint,
      textColor,
      padding:0,
      borderRadius:999,
      fontSize,
      fontWeight:900,
      width:size,
      height:size,
      subtle:true,
      borderWidth:2,
    }),
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    lineHeight:1,
  };
}

function getGlassTileBackground(baseHex){
  const glow=lightenHex(baseHex,0.44);
  const bright=lightenHex(baseHex,0.26);
  const soft=lightenHex(baseHex,0.14);
  const deep=lightenHex(baseHex,0.02);
  return `linear-gradient(155deg, rgba(255,255,255,.76) 0%, rgba(255,255,255,.26) 30%, rgba(255,255,255,.06) 100%),
    radial-gradient(circle at 20% 16%, ${withAlpha(glow,"F6")} 0%, ${withAlpha(glow,"72")} 24%, transparent 48%),
    radial-gradient(circle at 84% 84%, ${withAlpha(deep,"EC")} 0%, ${withAlpha(deep,"54")} 22%, transparent 46%),
    linear-gradient(135deg, ${soft} 0%, ${bright} 56%, ${deep} 100%)`;
}

function QuestionDecor({accent="#A855F7"}){
  return(
    <>
      <div style={{position:"absolute",top:-70,left:-100,width:320,height:320,borderRadius:"50%",background:`radial-gradient(circle, ${withAlpha(accent,"28")} 0%, ${withAlpha(accent,"18")} 28%, transparent 70%)`,filter:"blur(10px)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:120,right:-80,width:260,height:260,borderRadius:"50%",background:"radial-gradient(circle, rgba(59,130,246,.16) 0%, rgba(59,130,246,.08) 28%, transparent 72%)",filter:"blur(8px)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:-90,left:"18%",width:360,height:240,borderRadius:"50%",background:"radial-gradient(circle, rgba(251,191,36,.16) 0%, rgba(251,191,36,.08) 26%, transparent 72%)",filter:"blur(12px)",pointerEvents:"none"}}/>
    </>
  );
}

const QUESTION_TIMER_START_BUTTON_STYLE={
  ...getGlassButtonStyle({
    tint:"#2563EB",
    textColor:"#0F172A",
    padding:"4px 11px",
    borderRadius:999,
    fontSize:10,
    fontWeight:900,
    subtle:false,
  }),
  minHeight:24,
  lineHeight:1,
  textTransform:"uppercase",
  letterSpacing:.7,
};

const QUESTION_TIMER_RESET_BUTTON_STYLE={
  ...getGlassButtonStyle({
    tint:"#14B8A6",
    textColor:"#0F172A",
    padding:"3px 10px",
    borderRadius:999,
    fontSize:9,
    fontWeight:900,
    subtle:false,
  }),
  minHeight:20,
  lineHeight:1,
  textTransform:"uppercase",
  letterSpacing:.7,
};

function QuestionTimer({tile,paused=false,manualStart=false}){
  const totalSeconds=getQuestionTimerSeconds(tile);
  const totalMs=totalSeconds*1000;
  const [remainingMs,setRemainingMs]=useState(totalMs);
  const [started,setStarted]=useState(!manualStart);
  const [overrideRunning,setOverrideRunning]=useState(false);
  const timerKey=`${tile?.catId||"q"}:${tile?.pts||0}:${tile?._qkey||tile?.q||""}`;
  const displaySeconds=Math.max(0,Math.ceil(remainingMs/1000));
  const progress=totalMs>0?Math.max(0,Math.min(1,remainingMs/totalMs)):0;
  const size=QUESTION_TIMER_SIZE;
  const stroke=14;
  const radius=(size-stroke)/2;
  const circumference=2*Math.PI*radius;
  const dashOffset=circumference*(1-progress);
  const gradientId=`timerGrad-${String(timerKey).replace(/[^a-z0-9_-]/gi,"")}`;
  const isStoppedByParent=paused && !overrideRunning;

  useEffect(()=>{
    setRemainingMs(totalMs);
    setStarted(!manualStart);
    setOverrideRunning(false);
  },[totalMs,timerKey,manualStart]);

  useEffect(()=>{
    if(!started||isStoppedByParent||remainingMs<=0) return;
    const id=setInterval(()=>{
      setRemainingMs(prev=>Math.max(0,prev-100));
    },100);
    return()=>clearInterval(id);
  },[started,isStoppedByParent,remainingMs,timerKey]);

  useEffect(()=>{
    if(remainingMs<=0) setOverrideRunning(false);
  },[remainingMs]);

  const handleReset=()=>{
    setRemainingMs(totalMs);
    if(manualStart){
      setStarted(false);
      setOverrideRunning(false);
      return;
    }
    setStarted(true);
    setOverrideRunning(true);
  };

  const handleStart=()=>{
    setStarted(true);
    setOverrideRunning(true);
  };

  return(
    <div style={{position:"relative",zIndex:6,pointerEvents:"auto"}}>
      <div style={{position:"relative",width:size,height:size,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,.92)",boxShadow:"0 16px 36px rgba(15,23,42,.14)",backdropFilter:"blur(2px)"}}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{position:"absolute",inset:0,transform:"rotate(-90deg)",pointerEvents:"none"}}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2DD4BF"/>
              <stop offset="100%" stopColor="#2563EB"/>
            </linearGradient>
          </defs>
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(148,163,184,.28)" strokeWidth={stroke}/>
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={`url(#${gradientId})`} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset}/>
        </svg>
        <button
          type="button"
          className="tap"
          onClick={handleReset}
          style={{...QUESTION_TIMER_RESET_BUTTON_STYLE,position:"absolute",top:18,left:"50%",transform:"translateX(-50%)",zIndex:2}}
        >
          Reset
        </button>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,textAlign:"center",pointerEvents:"none"}}>
          <div style={{height:24}}/>
          <div style={{fontFamily:SF_STACK,fontWeight:900,fontSize:42,lineHeight:1,color:"#0F172A"}}>{displaySeconds}</div>
          <div style={{fontSize:11,fontWeight:800,letterSpacing:1.1,color:"#64748B",textTransform:"uppercase"}}>Seconds</div>
          <div style={{height:24}}/>
        </div>
        {manualStart && !started && remainingMs>0 && (
          <button
            type="button"
            className="tap"
            onClick={handleStart}
            style={{...QUESTION_TIMER_START_BUTTON_STYLE,position:"absolute",bottom:16,left:"50%",transform:"translateX(-50%)",zIndex:2}}
          >
            Start
          </button>
        )}
      </div>
    </div>
  );
}

function QuestionPanel({children,maxWidth=760,padding="clamp(20px,4vw,42px) clamp(16px,3.6vw,36px)",style={},className=""}){
  return(
    <div
      className={className}
      style={{
        position:"relative",
        width:"100%",
        maxWidth,
        padding,
        borderRadius:30,
        background:"linear-gradient(180deg,rgba(255,255,255,.98) 0%, rgba(255,255,255,.93) 100%)",
        border:"1.5px solid rgba(255,255,255,.92)",
        boxShadow:"0 24px 60px rgba(15,23,42,.14)",
        textAlign:"center",
        overflow:"hidden",
        ...style,
      }}
    >
      <div style={{position:"absolute",top:0,left:0,right:0,height:7,background:"linear-gradient(90deg,#A855F7 0%, #F59E0B 48%, #3B82F6 100%)",opacity:.8}}/>
      <div style={{position:"absolute",top:-36,right:-26,width:140,height:140,borderRadius:"50%",background:"radial-gradient(circle, rgba(168,85,247,.16) 0%, transparent 70%)"}}/>
      <div style={{position:"absolute",bottom:-42,left:-28,width:120,height:120,borderRadius:"50%",background:"radial-gradient(circle, rgba(59,130,246,.1) 0%, transparent 70%)"}}/>
      <div style={{position:"relative",zIndex:1}}>{children}</div>
    </div>
  );
}

function QuestionScreen({tile,teams,scores,curTeam,showAns,onRevealAnswer,onAward,onWrong,onPass,onAdjustScore,onBackToBoard}){
  const isTouch=useIsTouchDevice();
  const pc=PT_COLORS[tile.pts];const pb=PT_BG[tile.pts];
  const isFlag = tile.catId === "flags";
  const isEmojiGuess = Boolean(BANK[tile.catId]?.isEmojiGuess);
  const displayQuestion = formatQuestionForDisplay(tile.q);
  const displayAnswer = formatAnswerForDisplay(tile.a);
  return(
    <div style={isTouch?{...QUESTION_SCREEN_STYLE,...TOUCH_SCREEN_STYLE_OVERRIDE}:QUESTION_SCREEN_STYLE}>
      <style>{CSS}</style>
      <ScoreBar teams={teams} scores={scores} curTeam={curTeam} onAdjustScore={onAdjustScore}/>
      <div style={isTouch?{...QUESTION_BODY_CENTER_STYLE,...TOUCH_BODY_STYLE_OVERRIDE}:QUESTION_BODY_CENTER_STYLE}>
        <QuestionDecor accent={pc}/>
        <div style={QUESTION_STAGE_STYLE}>
          <div style={QUESTION_TIMER_SLOT_STYLE}>
            <QuestionTimer tile={tile} paused={showAns}/>
          </div>
          <div style={QUESTION_HEADER_WRAP_STYLE}>
            <span style={QUESTION_HEADER_ICON_STYLE}>{BANK[tile.catId].icon}</span>
            <div style={QUESTION_HEADER_TITLE_STYLE}>{BANK[tile.catId].label}</div>
            <div style={QUESTION_HEADER_POINTS_STYLE(pc,pb)}>{tile.pts}</div>
          </div>
          <QuestionPanel className="pop fadein" maxWidth={820} padding={isFlag||isEmojiGuess?"34px 28px 36px":"46px 40px"}>
            {isFlag ? (
              <>
                <FlagImage flag={tile.code || tile.q} country={tile.a}/>
                <div style={{fontSize:18,fontWeight:700,color:"#64748B"}}>Which country is this flag from?</div>
              </>
            ) : isEmojiGuess ? (
              <>
                <div style={{fontSize:"clamp(56px,12vw,96px)",lineHeight:1.15,letterSpacing:2,marginBottom:18,wordBreak:"break-word"}}>{tile.q}</div>
                <div style={{fontSize:18,fontWeight:700,color:"#64748B"}}>{BANK[tile.catId]?.emojiPrompt || "Guess from the emoji clue"}</div>
              </>
            ) : (
              <div style={{fontSize:"clamp(24px,4.6vw,38px)",fontWeight:800,color:"#1E293B",lineHeight:1.35}}>{displayQuestion}</div>
            )}
          </QuestionPanel>
          {showAns?(
            <QuestionPanel className="pop" maxWidth={760} padding="22px 26px" style={{background:`linear-gradient(180deg,${pb} 0%,#ffffff 180%)`,border:`2px solid ${pc}44`}}>
              <div style={{fontSize:12,fontWeight:800,color:pc,letterSpacing:1.1,marginBottom:8}}>ANSWER</div>
              <div style={{fontSize:"clamp(24px,4.2vw,34px)",fontWeight:800,color:"#1E293B",lineHeight:1.35}}>{displayAnswer}</div>
            </QuestionPanel>
          ):(
            <button className="tap" onClick={onRevealAnswer} style={QUESTION_PRIMARY_BUTTON_STYLE}>Reveal Answer</button>
          )}
          <div style={QUESTION_BACK_BUTTON_WRAP_STYLE}>
            <button className="tap" onClick={onBackToBoard} style={QUESTION_SECONDARY_BUTTON_STYLE}>Back to Board</button>
          </div>
          {showAns&&<AwardRow tile={tile} teams={teams} curTeam={curTeam} onAward={onAward} onWrong={onWrong} onPass={onPass}/>}
        </div>
      </div>
    </div>
  );
}

// Who Am I - image-based character prompt
function WhoAmIScreen({tile,teams,scores,curTeam,showAns,onRevealAnswer,onAward,onWrong,onPass,onAdjustScore,onBackToBoard}){
  const isTouch=useIsTouchDevice();
  const pc=PT_COLORS[tile.pts];const pb=PT_BG[tile.pts];
  const catLabel=BANK[tile.catId].label;
  const displayAnswer = formatAnswerForDisplay(tile.a);
  return(
    <div style={isTouch?{...QUESTION_SCREEN_STYLE,...TOUCH_SCREEN_STYLE_OVERRIDE}:QUESTION_SCREEN_STYLE}>
      <style>{CSS}</style>
      <ScoreBar teams={teams} scores={scores} curTeam={curTeam} onAdjustScore={onAdjustScore}/>
      <div style={isTouch?{...QUESTION_BODY_SCROLL_STYLE,...TOUCH_BODY_STYLE_OVERRIDE}:QUESTION_BODY_SCROLL_STYLE}>
        <QuestionDecor accent={pc}/>
        <div style={QUESTION_STAGE_STYLE}>
          <div style={QUESTION_TIMER_SLOT_STYLE}>
            <QuestionTimer tile={tile} paused={showAns}/>
          </div>
          <div style={QUESTION_HEADER_WRAP_STYLE}>
            <span style={QUESTION_HEADER_ICON_STYLE}>{BANK[tile.catId].icon}</span>
            <div style={QUESTION_HEADER_TITLE_STYLE}>{catLabel}</div>
            <div style={QUESTION_HEADER_POINTS_STYLE(pc,pb)}>{tile.pts}</div>
          </div>
          <div style={{fontSize:15,fontWeight:800,color:"#64748B",letterSpacing:1.2,textTransform:"uppercase"}}>Who Am I?</div>
          <CharacterArt name={tile.a} wiki={tile.wiki}/>
          <div style={QUESTION_HINT_STYLE}>Guess the character from the image</div>
          {showAns?(
            <QuestionPanel className="pop" maxWidth={620} padding="22px 26px" style={{background:`linear-gradient(180deg,${pb} 0%,#ffffff 180%)`,border:`2px solid ${pc}44`}}>
              <div style={{fontSize:12,fontWeight:800,color:pc,letterSpacing:1.1,marginBottom:8}}>ANSWER</div>
              <div style={{fontSize:"clamp(24px,4.2vw,34px)",fontWeight:800,color:"#1E293B"}}>{displayAnswer}</div>
            </QuestionPanel>
          ):(
            <button className="tap" onClick={onRevealAnswer} style={QUESTION_PRIMARY_BUTTON_STYLE}>Reveal Answer</button>
          )}
          <div style={QUESTION_BACK_BUTTON_WRAP_STYLE}>
            <button className="tap" onClick={onBackToBoard} style={QUESTION_SECONDARY_BUTTON_STYLE}>Back to Board</button>
          </div>
          {showAns&&<AwardRow tile={tile} teams={teams} curTeam={curTeam} onAward={onAward} onWrong={onWrong} onPass={onPass}/>}
        </div>
      </div>
    </div>
  );
}

// Country Map - local world-map SVG asset
function CountryMapScreen({tile,teams,scores,curTeam,showAns,onRevealAnswer,onAward,onWrong,onPass,onAdjustScore,onBackToBoard}){
  const isTouch=useIsTouchDevice();
  const pc=PT_COLORS[tile.pts];const pb=PT_BG[tile.pts];
  const displayAnswer = formatAnswerForDisplay(tile.a);
  return(
    <div style={isTouch?{...QUESTION_SCREEN_STYLE,...TOUCH_SCREEN_STYLE_OVERRIDE}:QUESTION_SCREEN_STYLE}>
      <style>{CSS}</style>
      <ScoreBar teams={teams} scores={scores} curTeam={curTeam} onAdjustScore={onAdjustScore}/>
      <div style={isTouch?{...QUESTION_BODY_SCROLL_STYLE,...TOUCH_BODY_STYLE_OVERRIDE}:QUESTION_BODY_SCROLL_STYLE}>
        <QuestionDecor accent={pc}/>
        <div style={QUESTION_STAGE_STYLE}>
          <div style={QUESTION_TIMER_SLOT_STYLE}>
            <QuestionTimer tile={tile} paused={showAns}/>
          </div>
          <div style={QUESTION_HEADER_WRAP_STYLE}>
            <span style={QUESTION_HEADER_ICON_STYLE}>{"\u{1F5FA}\uFE0F"}</span>
            <div style={QUESTION_HEADER_TITLE_STYLE}>Country Map</div>
            <div style={QUESTION_HEADER_POINTS_STYLE(pc,pb)}>{tile.pts}</div>
          </div>
          <CountryMapSVG code={tile.code} country={tile.a}/>
          <div style={QUESTION_HINT_STYLE}>{"\u{1F30D} Which country is highlighted in red?"}</div>
          {showAns?(
            <QuestionPanel className="pop" maxWidth={620} padding="22px 26px" style={{background:`linear-gradient(180deg,${pb} 0%,#ffffff 180%)`,border:`2px solid ${pc}44`}}>
              <div style={{fontSize:12,fontWeight:800,color:pc,letterSpacing:1.1,marginBottom:8}}>ANSWER</div>
              <div style={{fontSize:"clamp(24px,4.2vw,36px)",fontWeight:800,color:"#1E293B"}}>{displayAnswer}</div>
            </QuestionPanel>
          ):(
            <button className="tap" onClick={onRevealAnswer} style={QUESTION_PRIMARY_BUTTON_STYLE}>Reveal Answer</button>
          )}
          <div style={QUESTION_BACK_BUTTON_WRAP_STYLE}>
            <button className="tap" onClick={onBackToBoard} style={QUESTION_SECONDARY_BUTTON_STYLE}>Back to Board</button>
          </div>
          {showAns&&<AwardRow tile={tile} teams={teams} curTeam={curTeam} onAward={onAward} onWrong={onWrong} onPass={onPass}/>}
        </div>
      </div>
    </div>
  );
}

function MovieSceneScreen({tile,teams,scores,curTeam,showAns,onRevealAnswer,onAward,onWrong,onPass,onAdjustScore,onBackToBoard}){
  const isTouch=useIsTouchDevice();
  const pc=PT_COLORS[tile.pts];const pb=PT_BG[tile.pts];
  const displayAnswer = formatAnswerForDisplay(tile.a);
  return(
    <div style={isTouch?{...QUESTION_SCREEN_STYLE,...TOUCH_SCREEN_STYLE_OVERRIDE}:QUESTION_SCREEN_STYLE}>
      <style>{CSS}</style>
      <ScoreBar teams={teams} scores={scores} curTeam={curTeam} onAdjustScore={onAdjustScore}/>
      <div style={isTouch?{...QUESTION_BODY_SCROLL_STYLE,...TOUCH_BODY_STYLE_OVERRIDE}:QUESTION_BODY_SCROLL_STYLE}>
        <QuestionDecor accent={pc}/>
        <div style={QUESTION_STAGE_STYLE}>
          <div style={QUESTION_TIMER_SLOT_STYLE}>
            <QuestionTimer tile={tile} paused={showAns}/>
          </div>
          <div style={QUESTION_HEADER_WRAP_STYLE}>
            <span style={QUESTION_HEADER_ICON_STYLE}>{BANK[tile.catId].icon}</span>
            <div style={QUESTION_HEADER_TITLE_STYLE}>{BANK[tile.catId].label}</div>
            <div style={QUESTION_HEADER_POINTS_STYLE(pc,pb)}>{tile.pts}</div>
          </div>
          <MovieScenePlayer tile={tile}/>
          <div style={QUESTION_HINT_STYLE}>Guess the movie from the clip</div>
          {showAns?(
            <QuestionPanel className="pop" maxWidth={680} padding="22px 26px" style={{background:`linear-gradient(180deg,${pb} 0%,#ffffff 180%)`,border:`2px solid ${pc}44`}}>
              <div style={{fontSize:12,fontWeight:800,color:pc,letterSpacing:1.1,marginBottom:8}}>ANSWER</div>
              <div style={{fontSize:"clamp(24px,4.2vw,34px)",fontWeight:800,color:"#1E293B"}}>{displayAnswer}</div>
            </QuestionPanel>
          ):(
            <button className="tap" onClick={onRevealAnswer} style={QUESTION_PRIMARY_BUTTON_STYLE}>Reveal Answer</button>
          )}
          <div style={QUESTION_BACK_BUTTON_WRAP_STYLE}>
            <button className="tap" onClick={onBackToBoard} style={QUESTION_SECONDARY_BUTTON_STYLE}>Back to Board</button>
          </div>
          {showAns&&<AwardRow tile={tile} teams={teams} curTeam={curTeam} onAward={onAward} onWrong={onWrong} onPass={onPass}/>}
        </div>
      </div>
    </div>
  );
}

function SongClipScreen({tile,teams,scores,curTeam,showAns,onRevealAnswer,onAward,onWrong,onPass,onAdjustScore,onBackToBoard}){
  const isTouch=useIsTouchDevice();
  const pc=PT_COLORS[tile.pts];const pb=PT_BG[tile.pts];
  const displayAnswer = formatAnswerForDisplay(tile.a);
  return(
    <div style={isTouch?{...QUESTION_SCREEN_STYLE,...TOUCH_SCREEN_STYLE_OVERRIDE}:QUESTION_SCREEN_STYLE}>
      <style>{CSS}</style>
      <ScoreBar teams={teams} scores={scores} curTeam={curTeam} onAdjustScore={onAdjustScore}/>
      <div style={isTouch?{...QUESTION_BODY_SCROLL_STYLE,...TOUCH_BODY_STYLE_OVERRIDE}:QUESTION_BODY_SCROLL_STYLE}>
        <QuestionDecor accent={pc}/>
        <div style={QUESTION_STAGE_STYLE}>
          <div style={QUESTION_TIMER_SLOT_STYLE}>
            <QuestionTimer tile={tile} paused={showAns}/>
          </div>
          <div style={QUESTION_HEADER_WRAP_STYLE}>
            <span style={QUESTION_HEADER_ICON_STYLE}>{BANK[tile.catId].icon}</span>
            <div style={QUESTION_HEADER_TITLE_STYLE}>{BANK[tile.catId].label}</div>
            <div style={QUESTION_HEADER_POINTS_STYLE(pc,pb)}>{tile.pts}</div>
          </div>
          <SongClipPlayer tile={tile}/>
          <div style={QUESTION_HINT_STYLE}>Guess the song from the clip</div>
          {showAns?(
            <QuestionPanel className="pop" maxWidth={680} padding="22px 26px" style={{background:`linear-gradient(180deg,${pb} 0%,#ffffff 180%)`,border:`2px solid ${pc}44`}}>
              <div style={{fontSize:12,fontWeight:800,color:pc,letterSpacing:1.1,marginBottom:8}}>ANSWER</div>
              <div style={{fontSize:"clamp(24px,4.2vw,34px)",fontWeight:800,color:"#1E293B"}}>{displayAnswer}</div>
              {tile.artist&&<div style={{fontSize:16,fontWeight:700,color:"#64748B",marginTop:10}}>{tile.artist}</div>}
            </QuestionPanel>
          ):(
            <button className="tap" onClick={onRevealAnswer} style={QUESTION_PRIMARY_BUTTON_STYLE}>Reveal Answer</button>
          )}
          <div style={QUESTION_BACK_BUTTON_WRAP_STYLE}>
            <button className="tap" onClick={onBackToBoard} style={QUESTION_SECONDARY_BUTTON_STYLE}>Back to Board</button>
          </div>
          {showAns&&<AwardRow tile={tile} teams={teams} curTeam={curTeam} onAward={onAward} onWrong={onWrong} onPass={onPass}/>}
        </div>
      </div>
    </div>
  );
}

function CharadesScreen({tile,teams,scores,curTeam,showWord,onRevealWord,onAward,onWrong,onPass,onAdjustScore,onBackToBoard}){
  const isTouch=useIsTouchDevice();
  const pc=PT_COLORS[tile.pts];const pb=PT_BG[tile.pts];
  const qrSearchUrl=`https://www.google.com/search?q=${encodeURIComponent(tile.a)}`;
  return(
    <div style={isTouch?{...QUESTION_SCREEN_STYLE,...TOUCH_SCREEN_STYLE_OVERRIDE}:QUESTION_SCREEN_STYLE}>
      <style>{CSS}</style>
      <ScoreBar teams={teams} scores={scores} curTeam={curTeam} onAdjustScore={onAdjustScore}/>
      <div style={isTouch?{...QUESTION_BODY_CENTER_STYLE,...TOUCH_BODY_STYLE_OVERRIDE}:QUESTION_BODY_CENTER_STYLE}>
        <QuestionDecor accent={pc}/>
        <div style={QUESTION_STAGE_STYLE}>
          <div style={QUESTION_TIMER_SLOT_STYLE}>
            <QuestionTimer tile={tile} paused={false} manualStart/>
          </div>
          <div style={QUESTION_HEADER_WRAP_STYLE}>
            <span style={QUESTION_HEADER_ICON_STYLE}>{BANK[tile.catId].icon}</span>
            <div style={QUESTION_HEADER_TITLE_STYLE}>{BANK[tile.catId].label}</div>
            <div style={QUESTION_HEADER_POINTS_STYLE(pc,pb)}>{tile.pts}</div>
          </div>
          <QuestionPanel maxWidth={470} padding="22px 22px 24px">
            <div style={{fontSize:12,fontWeight:800,color:"#64748B",letterSpacing:1.1,marginBottom:12}}>ACTOR - SCAN QR TO GOOGLE YOUR WORD</div>
            <QRCode text={qrSearchUrl} size={180}/>
          </QuestionPanel>
          {showWord?(
            <QuestionPanel className="pop" maxWidth={620} padding="22px 26px" style={{background:`linear-gradient(180deg,${pb} 0%,#ffffff 180%)`,border:`2px solid ${pc}44`}}>
              <div style={{fontSize:12,fontWeight:800,color:pc,letterSpacing:1.1,marginBottom:8}}>WORD (HOST ONLY)</div>
              <div style={{fontSize:"clamp(24px,4.2vw,34px)",fontWeight:800,color:"#1E293B"}}>{tile.a}</div>
            </QuestionPanel>
          ):(
            <button className="tap" onClick={onRevealWord} style={QUESTION_SECONDARY_BUTTON_STYLE}>{"\u{1F441}\uFE0F Show Word (Host Only)"}</button>
          )}
          <div style={QUESTION_BACK_BUTTON_WRAP_STYLE}>
            <button className="tap" onClick={onBackToBoard} style={QUESTION_SECONDARY_BUTTON_STYLE}>Back to Board</button>
          </div>
          <AwardRow tile={tile} teams={teams} curTeam={curTeam} onAward={onAward} onWrong={onWrong} onPass={onPass}/>
        </div>
      </div>
    </div>
  );
}

function GameOverScreen({teams,scores,onRematch,onNewGame}){
  const w=scores[0]>scores[1]?0:scores[1]>scores[0]?1:-1;
  return(
    <div style={{minHeight:"100dvh",...SITE_BACKGROUND_STYLE,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,gap:20}}>
      <style>{CSS}</style>
      <div style={{fontFamily:SF_STACK,fontSize:"clamp(36px,10vw,58px)",fontWeight:900,color:"#1E293B",letterSpacing:1}}>GAME OVER</div>
      {w!==-1&&(
        <div className="pop" style={{textAlign:"center",background:"#fff",borderRadius:18,padding:"20px 32px",boxShadow:"0 4px 24px #0000000d",border:`3px solid ${TEAM_COLORS[w]}44`}}>
          <div style={{fontSize:26}}>{w===0?"\u{1F535}":"\u{1F534}"}</div>
          <div style={{fontFamily:SF_STACK,fontSize:28,fontWeight:900,color:TEAM_COLORS[w]}}>{teams[w]}</div>
          <div style={{fontSize:12,color:"#64748B",fontWeight:600}}>{"WINS! \u{1F389}"}</div>
        </div>
      )}
      {w===-1&&<div style={{fontSize:22,fontWeight:700}}>{"\u{1F91D} It's a Tie!"}</div>}
      <div style={{width:"100%",maxWidth:320,display:"flex",flexDirection:"column",gap:9}}>
        {teams.map((t,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"#fff",borderRadius:12,padding:"12px 18px",border:`1.5px solid ${TEAM_COLORS[i]}33`}}>
            <div style={{fontWeight:700,color:TEAM_COLORS[i],fontSize:14}}>{t}</div>
            <div style={{fontFamily:SF_STACK,fontSize:28,fontWeight:900,color:i===w?TEAM_COLORS[i]:"#94A3B8"}}>{scores[i]}</div>
          </div>
        ))}
      </div>
      <div style={{width:"100%",maxWidth:320,display:"flex",flexDirection:"column",gap:9}}>
        <button className="tap" onClick={onRematch} style={getGlassButtonStyle({tint:"#2563EB",textColor:"#0F172A",fontSize:15,padding:"13px",borderRadius:12})}>{"\u{1F504} REMATCH"}</button>
        <button className="tap" onClick={onNewGame} style={getGlassButtonStyle({tint:"#7C3AED",textColor:"#1E293B",fontWeight:700,fontSize:14,padding:"13px",borderRadius:12,subtle:true,borderWidth:2})}>New Game</button>
      </div>
    </div>
  );
}


