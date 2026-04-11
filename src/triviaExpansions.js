const qa = (items) => items.map(([q, a]) => ({ q, a }));
const who = (items) => items.map(([q, a, wiki]) => ({ q, a, wiki }));
const charades = (items, prompt = "Act this out") => items.map((a) => ({ q: prompt, a }));

const QUESTION_EXPANSIONS = {
  general: {
    200: qa([["How many months have 31 days?", "7"], ["How many letters are in the English alphabet?", "26"], ["What is the currency of the United States?", "US dollar"]]),
    400: qa([["What does WWW stand for?", "World Wide Web"], ["How many players are there in a chess game at the start?", "2"], ["What is the freezing point of water in Fahrenheit?", "32°F"]]),
    600: qa([["What is pi rounded to three decimal places?", "3.142"], ["What does CPU stand for?", "Central Processing Unit"], ["What do the initials ATM stand for?", "Automated Teller Machine"]]),
  },
  geography: {
    200: qa([["What is the capital of Thailand?", "Bangkok"], ["What river flows through Paris?", "The Seine"], ["What is the capital of Portugal?", "Lisbon"]]),
    400: qa([["What is the capital of Kenya?", "Nairobi"], ["What is the capital of Norway?", "Oslo"], ["What is the highest waterfall in the world?", "Angel Falls"]]),
    600: qa([["What country has the capital Ulaanbaatar?", "Mongolia"], ["What sea separates Saudi Arabia from northeast Africa?", "The Red Sea"], ["What is the longest river in Asia?", "The Yangtze"]]),
  },
  science: {
    200: qa([["Which planet is famous for its rings?", "Saturn"], ["What is the largest internal organ in the human body?", "The liver"], ["What is the process of a liquid turning into gas called?", "Evaporation"]]),
    400: qa([["What is the basic unit of heredity?", "A gene"], ["What device measures earthquakes?", "A seismograph"], ["What blood cells help your blood clot?", "Platelets"]]),
    600: qa([["What is the SI unit of force?", "The newton"], ["What branch of science studies rocks?", "Geology"], ["What is the bending of light called when it enters a new medium?", "Refraction"]]),
  },
  history: {
    200: qa([["What year did the United States declare independence?", "1776"], ["What ancient city was destroyed by Mount Vesuvius?", "Pompeii"], ["What mission first landed humans on the Moon?", "Apollo 11"]]),
    400: qa([["Who was known as the Iron Lady?", "Margaret Thatcher"], ["What war was fought between the North and South regions of the United States?", "The American Civil War"], ["Which empire ruled Peru before the Spanish conquest?", "The Inca Empire"]]),
    600: qa([["What ship carried the Pilgrims to North America in 1620?", "The Mayflower"], ["Who was the Carthaginian general who crossed the Alps with elephants?", "Hannibal Barca"], ["What Chinese dynasty built much of the Forbidden City?", "The Ming dynasty"]]),
  },
  sports: {
    200: qa([["Which country hosted the 2016 Summer Olympics?", "Brazil"], ["How many players are on the field for one baseball team?", "9"], ["Which sport awards the Stanley Cup?", "Ice hockey"]]),
    400: qa([["Which country won the 2010 FIFA World Cup?", "Spain"], ["What surface is used at Roland-Garros?", "Clay"], ["Which sport includes the pommel horse?", "Gymnastics"]]),
    600: qa([["What is three under par on a golf hole called?", "An albatross"], ["What is the Davis Cup?", "International men's team tennis competition"], ["In cricket, how many runs do you score for hitting the ball over the boundary on the full?", "6"]]),
  },
  music: {
    200: qa([["How many lines are on a standard music staff?", "5"], ["What instrument was Louis Armstrong famous for playing?", "Trumpet"], ["Which band released Wonderwall?", "Oasis"]]),
    400: qa([["What does crescendo mean in music?", "Gradually getting louder"], ["Who composed Swan Lake?", "Tchaikovsky"], ["What does BPM measure in music?", "Tempo"]]),
    600: qa([["What is syncopation?", "Emphasizing off-beats or unexpected beats"], ["What is an arpeggio?", "The notes of a chord played one after another"], ["What is the circle of fifths used for?", "Showing relationships between keys and key signatures"]]),
  },
  movies: {
    200: qa([["What is the name of the blue alien people in Avatar?", "The Na'vi"], ["Who directed Titanic?", "James Cameron"], ["Who is Nemo's father in Finding Nemo?", "Marlin"]]),
    400: qa([["What film features the word Rosebud as a key clue?", "Citizen Kane"], ["What is the name of the hotel in The Shining?", "The Overlook Hotel"], ["What movie introduced Jack Skellington?", "The Nightmare Before Christmas"]]),
    600: qa([["What does ADR stand for in filmmaking?", "Automated Dialogue Replacement"], ["Which Akira Kurosawa film inspired A Fistful of Dollars?", "Yojimbo"], ["What horror film popularized found-footage in 1999?", "The Blair Witch Project"]]),
  },
  country_facts: {
    200: qa([["This country is known as the Land of the Long White Cloud and has capital Wellington", "New Zealand"], ["This country is home to Petra and its capital is Amman", "Jordan"], ["This island nation is famous for volcanoes, geysers, and geothermal energy - capital Reykjavik", "Iceland"]]),
    400: qa([["This is the only African country with Spanish as an official language", "Equatorial Guinea"], ["This country is home to both the Serengeti and Mount Kilimanjaro", "Tanzania"], ["This country has capital Tbilisi and sits between Europe and Asia", "Georgia"]]),
    600: qa([["This Himalayan kingdom measures success with Gross National Happiness", "Bhutan"], ["This country is home to the Okavango Delta and capital Gaborone", "Botswana"], ["This Horn of Africa nation has capital Asmara", "Eritrea"]]),
  },
  songs: {
    200: qa([["A 2008 pop hit by Lady Gaga inviting someone to just dance", "Just Dance by Lady Gaga"], ["A 1999 Britney Spears debut built around Hit Me Baby One More Time", "...Baby One More Time by Britney Spears"], ["A 2000 Coldplay song about yellow stars and devotion", "Yellow by Coldplay"]]),
    400: qa([["A 2003 OutKast song built around infectious hey ya shout-alongs", "Hey Ya! by OutKast"], ["A 1971 Led Zeppelin epic that climbs from acoustic folk to hard rock thunder", "Stairway to Heaven by Led Zeppelin"], ["A 2006 Gnarls Barkley song asking if you think you're crazy", "Crazy by Gnarls Barkley"]]),
    600: qa([["A 1965 Rolling Stones song often shortened to Satisfaction", "(I Can't Get No) Satisfaction by The Rolling Stones"], ["A 1980 Joy Division classic about a relationship tearing itself apart", "Love Will Tear Us Apart by Joy Division"], ["A 2015 Kendrick Lamar track declaring we gon' be alright", "Alright by Kendrick Lamar"]]),
  },
  marvel: {
    200: qa([["What is Peter Quill's alias?", "Star-Lord"], ["Who is Scott Lang?", "Ant-Man"], ["What is Natasha Romanoff's superhero name?", "Black Widow"]]),
    400: qa([["What is the name of Thor's mischievous adopted brother?", "Loki"], ["What is Peter Parker's best friend's name in the MCU?", "Ned Leeds"], ["Who becomes the new Captain America at the end of Endgame?", "Sam Wilson"]]),
    600: qa([["What does TVA stand for in Loki?", "Time Variance Authority"], ["What is the name of the prison in Guardians of the Galaxy where the team first forms?", "The Kyln"], ["What is the comic name of the symbiote god introduced in modern Marvel?", "Knull"]]),
  },
  dc: {
    200: qa([["What city does Wonder Woman come from?", "Themyscira"], ["Who is Superman's cousin?", "Supergirl"], ["What is the name of Batman's company?", "Wayne Enterprises"]]),
    400: qa([["What yellow weakness affects Green Lantern power rings?", "Fear"], ["Who is the main sidekick turned independent hero known as Nightwing?", "Dick Grayson"], ["What is the name of Superman's bottled city from Krypton?", "Kandor"]]),
    600: qa([["What is the antihero team led by Amanda Waller?", "The Suicide Squad / Task Force X"], ["What world does Darkseid rule?", "Apokolips"], ["What is the name of the evil Justice League from Earth-3?", "The Crime Syndicate"]]),
  },
  star_wars: {
    200: qa([["What is the name of Han Solo's Wookiee copilot?", "Chewbacca"], ["What planet is famous for Ewoks?", "Endor"], ["What weapon do Jedi traditionally use?", "Lightsabers"]]),
    400: qa([["What is Anakin Skywalker's apprentice called?", "Ahsoka Tano"], ["What is the capital planet of the Galactic Republic?", "Coruscant"], ["What is the black-bladed saber of Mandalore called?", "The Darksaber"]]),
    600: qa([["Who created the Rule of Two for the Sith?", "Darth Bane"], ["What is the hidden Sith planet in The Rise of Skywalker?", "Exegol"], ["What is the crystal used in lightsabers called?", "Kyber crystal"]]),
  },
  harry_potter: {
    200: qa([["What house is Luna Lovegood in?", "Ravenclaw"], ["What is the name of Hagrid's giant dog?", "Fang"], ["What spell opens locked doors?", "Alohomora"]]),
    400: qa([["Who teaches Potions after Snape moves to Defense Against the Dark Arts?", "Horace Slughorn"], ["What is the violent tree on the Hogwarts grounds called?", "The Whomping Willow"], ["What creature can only be seen by people who have witnessed death?", "Thestrals"]]),
    600: qa([["What magical branch studies predicting the future?", "Divination"], ["What does the spell Sectumsempra do?", "It slashes the target as if by an invisible sword"], ["What is Voldemort's middle name?", "Marvolo"]]),
  },
  breaking_bad: {
    200: qa([["What fast-food chain is Gus Fring the public face of?", "Los Pollos Hermanos"], ["What nickname does Jesse use for Walter?", "Mr. White"], ["What city is Breaking Bad set in?", "Albuquerque"]]),
    400: qa([["What fake company is used to hide the superlab laundry operation?", "Lavanderia Brillante"], ["What poison plant does Walter use on Brock?", "Lily of the Valley"], ["What is Mike Ehrmantraut's granddaughter's name?", "Kaylee"]]),
    600: qa([["What pseudonym does Saul Goodman live under after disappearing?", "Gene Takavic"], ["What German conglomerate is tied to Gus's meth operation?", "Madrigal Electromotive"], ["What title is often considered Breaking Bad's most acclaimed episode?", "Ozymandias"]]),
  },
  game_thrones: {
    200: qa([["What family says Hear Me Roar?", "House Lannister"], ["What is the ancestral Stark sword called?", "Ice"], ["What city is the capital of the Seven Kingdoms?", "King's Landing"]]),
    400: qa([["What is the poison used to kill Joffrey commonly called?", "The Strangler"], ["Who is known as the Onion Knight?", "Davos Seaworth"], ["What is the seat of House Arryn?", "The Eyrie"]]),
    600: qa([["What are the words of House Martell?", "Unbowed, Unbent, Unbroken"], ["What valyrian steel dagger starts many major plotlines?", "The catspaw dagger"], ["What city does Daenerys rule before sailing to Westeros?", "Meereen"]]),
  },
  friends: {
    200: qa([["What instrument does Phoebe often play?", "The guitar"], ["What is Ross's profession?", "Paleontologist"], ["What is the name of the coffee shop the gang hang out in?", "Central Perk"]]),
    400: qa([["What is Chandler's middle name?", "Muriel"], ["What was the name of Joey's stuffed penguin?", "Hugsy"], ["What does Rachel accidentally serve in the Thanksgiving trifle?", "Beef and peas"]]),
    600: qa([["What is the name of Phoebe's half-brother?", "Frank Buffay Jr."], ["What song makes Ross and Rachel's daughter Emma laugh?", "Baby Got Back"], ["What is the name of Monica and Rachel's building superintendent?", "Treeger"]]),
  },
  the_office: {
    200: qa([["What company does The Office take place in?", "Dunder Mifflin"], ["What is Pam's maiden name?", "Beesly"], ["What school is Andy Bernard obsessed with?", "Cornell"]]),
    400: qa([["What is Dwight's family farm called?", "Schrute Farms"], ["What is Kevin's band called?", "Scrantonicity"], ["What company briefly buys Dunder Mifflin?", "Sabre"]]),
    600: qa([["What is Creed Bratton's job title for much of the show?", "Quality assurance"], ["What is Jan's candle company called?", "Serenity by Jan"], ["What disease does Michael claim is spreading during the fun run episode?", "Rabies"]]),
  },
  stranger_things: {
    200: qa([["What town is Stranger Things set in?", "Hawkins"], ["What is Eleven's favorite food?", "Eggo waffles"], ["What game do the boys often play together?", "Dungeons & Dragons"]]),
    400: qa([["What shopping mall becomes a major season 3 setting?", "Starcourt Mall"], ["What is Dustin's pet from the Upside Down called?", "Dart"], ["What song do Dustin and Suzie sing together?", "The NeverEnding Story"]]),
    600: qa([["What was Vecna's original human designation at Hawkins Lab?", "One"], ["What is Eddie Munson's D&D club called?", "Hellfire Club"], ["What is the alternate world full of vines and monsters called?", "The Upside Down"]]),
  },
  disney: {
    200: qa([["What does Cinderella leave behind at the ball?", "A glass slipper"], ["What kind of animal is Dumbo?", "An elephant"], ["What is Ariel's fish friend called?", "Flounder"]]),
    400: qa([["What is the name of the kingdom in Tangled?", "Corona"], ["Who is the villain in The Princess and the Frog?", "Dr. Facilier"], ["What is Mulan's dragon companion called?", "Mushu"]]),
    600: qa([["What is the name of the island where Moana lives?", "Motunui"], ["What is the name of the city in Big Hero 6?", "San Fransokyo"], ["What is the name of Rapunzel's horse?", "Maximus"]]),
  },
  lord_rings: {
    200: qa([["What race is Legolas?", "Elf"], ["What is Gandalf's horse called?", "Shadowfax"], ["What is the home of the hobbits called?", "The Shire"]]),
    400: qa([["What creature attacks Frodo near Cirith Ungol?", "Shelob"], ["What is Aragorn's reforged sword called?", "Anduril"], ["Who is the steward of Gondor during Return of the King?", "Denethor"]]),
    600: qa([["What are the two towers usually understood to be in The Two Towers?", "Orthanc and Barad-dur"], ["What glowing gift does Galadriel give Frodo?", "The Phial of Galadriel"], ["What does the word mithril refer to?", "A rare, incredibly light and strong metal"]]),
  },
  video_games: {
    200: qa([["What company created Mario?", "Nintendo"], ["What princess does Mario often rescue?", "Princess Peach"]]),
    400: qa([["What is the name of Kratos's son in modern God of War?", "Atreus"], ["What game series features the land of Hyrule?", "The Legend of Zelda"], ["What city is Grand Theft Auto V set in?", "Los Santos"]]),
    600: qa([["What survival horror franchise stars Leon Kennedy and Jill Valentine?", "Resident Evil"], ["What game introduced the phrase The cake is a lie?", "Portal"], ["What is Arthur Morgan's gang called in Red Dead Redemption 2?", "The Van der Linde gang"]]),
  },
  anime: {
    200: qa([["What food is Naruto obsessed with?", "Ramen"], ["What pirate crew does Luffy lead?", "The Straw Hat Pirates"]]),
    400: qa([["What are the giant humanoid monsters in Attack on Titan called?", "Titans"], ["What is Tanjiro's sister called in Demon Slayer?", "Nezuko"], ["What school does Deku attend?", "U.A. High School"]]),
    600: qa([["What is Light Yagami's shinigami companion called?", "Ryuk"], ["What are Dragon Ball's wish-granting orbs called?", "The Dragon Balls"], ["What is Edward Elric's famous state alchemist title?", "The Fullmetal Alchemist"]]),
  },
  prison_break: {
    200: qa([["What prison does Michael break Lincoln out of in season 1?", "Fox River"], ["Who is Michael's doctor love interest?", "Sara Tancredi"], ["What is Lincoln Burrows' nickname?", "Linc"]]),
    400: qa([["What secret organization drives much of the conspiracy?", "The Company"], ["What prison is featured in Panama?", "Sona"], ["What is the name of the data system everyone chases in season 4?", "Scylla"]]),
    600: qa([["What is the name of the prison in Yemen in the revival season?", "Ogygia"], ["Who becomes one of Michael's most valuable allies after first hunting him?", "Alexander Mahone"], ["What is Fernando Sucre's girlfriend called?", "Maricruz"]]),
  },
  big_bang_theory: {
    200: qa([["What is Penny's job at the start of the series?", "Waitress"], ["What university do Leonard and Sheldon work at?", "Caltech"], ["What is Howard's profession?", "Engineer"]]),
    400: qa([["What is Bernadette's profession?", "Microbiologist / pharmaceutical scientist"], ["What is Raj unable to do around women in early seasons?", "Speak to them without alcohol"], ["What is Amy Farrah Fowler's field?", "Neurobiology"]]),
    600: qa([["What document controls Leonard and Sheldon's apartment life?", "The Roommate Agreement"], ["What is Howard's mother's first name?", "Debbie"], ["What Nobel-winning theory do Sheldon and Amy develop?", "Super-asymmetry"]]),
  },
  brooklyn_99: {
    200: qa([["What precinct is the show centered on?", "The 99th precinct"], ["What is Jake's favorite movie franchise?", "Die Hard"], ["Who is Jake's eventual wife?", "Amy Santiago"]]),
    400: qa([["What does Holt call his dog?", "Cheddar"], ["What is Terry Jeffords obsessed with drinking?", "Yogurt"], ["What is the squad's annual competition called?", "The Halloween Heist"]]),
    600: qa([["What is Captain Holt's husband's name?", "Kevin Cozner"], ["What witness-protection style alias does Jake use in Florida?", "Larry Sherbert"], ["Who is the Pontiac Bandit?", "Doug Judy"]]),
  },
  pokemon: {
    200: qa([["What type is Pikachu?", "Electric"], ["What item do trainers throw to catch Pokemon?", "A Poke Ball"], ["What type is Squirtle?", "Water"]]),
    400: qa([["What Pokemon evolves into Charizard?", "Charmeleon"], ["What professor lives in Pallet Town?", "Professor Oak"], ["What region was introduced in Gold and Silver?", "Johto"]]),
    600: qa([["What item evolves Eevee into Vaporeon?", "A Water Stone"], ["What legendary trio includes Articuno, Zapdos, and Moltres?", "The Legendary Birds"], ["What Pokemon says its own name and joins Team Rocket in the anime?", "Meowth"]]),
  },
  invincible: {
    200: qa([["What is Invincible's real name?", "Mark Grayson"], ["What species is Omni-Man?", "Viltrumite"], ["Who is Mark's father?", "Omni-Man / Nolan Grayson"]]),
    400: qa([["What superhero team does Mark first idolize?", "The Guardians of the Globe"], ["Who is the demon detective investigating the massacre?", "Damien Darkblood"], ["What is Atom Eve's real first name?", "Samantha"]]),
    600: qa([["What alien species repeatedly invades Earth in time-skipping bursts?", "The Flaxans"], ["What is the name of Nolan's later son?", "Oliver"], ["What agency does Cecil Stedman run?", "The Global Defense Agency"]]),
  },
  the_boys: {
    200: qa([["What is Homelander's corporate superhero team called?", "The Seven"], ["What company manages superheroes in The Boys?", "Vought"], ["What is Starlight's real first name?", "Annie"]]),
    400: qa([["What substance gives supes their powers?", "Compound V"], ["Who is Homelander's son?", "Ryan"], ["What aquatic member of The Seven talks to sea life?", "The Deep"]]),
    600: qa([["What temporary version of Compound V do the Boys experiment with?", "Temp V / V24"], ["Who is the World War II-era supe brought back in season 3?", "Soldier Boy"], ["What speedster kills Robin in episode 1?", "A-Train"]]),
  },
  the_flash: {
    200: qa([["What accident gives Barry Allen his powers?", "A particle accelerator explosion and lightning strike"], ["What is Barry Allen's job before becoming the Flash?", "Forensic scientist"], ["What is Cisco Ramon's hero name?", "Vibe"]]),
    400: qa([["Who is Barry's main season 1 enemy revealed to be a reverse speedster?", "Eobard Thawne / Reverse-Flash"], ["What is Barry's altered timeline event called?", "Flashpoint"], ["What is Caitlin Snow's icy alter ego called?", "Killer Frost"]]),
    600: qa([["What is the name of Barry and Iris's daughter from the future?", "Nora West-Allen"], ["What villain is known as the god of speed?", "Savitar"], ["What speedster title does Wally West use?", "Kid Flash"]]),
  },
  the_walking_dead: {
    200: qa([["What are zombies usually called in the show?", "Walkers"], ["What is Rick Grimes' son's name?", "Carl"], ["What is Daryl Dixon's signature weapon?", "Crossbow"]]),
    400: qa([["What community is ruled by Ezekiel and Shiva?", "The Kingdom"], ["What is Negan's baseball bat called?", "Lucille"], ["What prison becomes a major early home base?", "The prison / West Georgia Correctional Facility"]]),
    600: qa([["Who kills Alpha?", "Negan"], ["What is the fortified community led by Deanna Monroe?", "Alexandria"], ["What skin-wearing group blends in with walkers?", "The Whisperers"]]),
  },
  solo_leveling: {
    200: qa([["What rank is Sung Jin-Woo at the very start of the story?", "E-rank"], ["What shadow soldier was once the Ant King?", "Beru"], ["What are people who fight inside gates called?", "Hunters"]]),
    400: qa([["What island raid nearly collapses South Korea before Jin-Woo intervenes?", "Jeju Island"], ["Who is the chairman of the Korean Hunters Association?", "Go Gun-Hee"], ["What is Jin-Woo's father's name?", "Sung Il-Hwan"]]),
    600: qa([["What monarch's power does Jin-Woo inherit?", "The Shadow Monarch's"], ["Who was the previous Shadow Monarch before Jin-Woo?", "Ashborn"], ["What cosmic factions are at war above humanity?", "The Rulers and the Monarchs"]]),
  },
  suits: {
    200: qa([["What is Donna's last name?", "Paulsen"], ["What elite law school does the firm obsess over?", "Harvard"], ["Who is the managing partner at the start of the series?", "Jessica Pearson"]]),
    400: qa([["What is Louis Litt's famous spa obsession called?", "Mudding"], ["What is the firm originally called?", "Pearson Hardman"], ["Who is Rachel Zane's father?", "Robert Zane"]]),
    600: qa([["Who is Louis Litt's eventual wife?", "Sheila Sazs"], ["What city does Jessica move to after leaving the firm?", "Chicago"], ["What executive role does Donna eventually hold?", "COO"]]),
  },
  dexter: {
    200: qa([["What department does Dexter work for?", "Miami Metro"], ["What does Dexter analyze at crime scenes?", "Blood spatter"], ["What is Dexter's sister's name?", "Debra Morgan"]]),
    400: qa([["What serial killer is responsible for Rita's death?", "The Trinity Killer"], ["What name does the FBI give Dexter's dumping-ground case?", "The Bay Harbor Butcher"], ["Who is Dexter's biological brother?", "Brian Moser"]]),
    600: qa([["What alias does Dexter use in New Blood?", "Jim Lindsay"], ["Who ultimately kills Dexter in New Blood?", "Harrison"], ["What is Dexter's compulsion to kill called by him?", "The Dark Passenger"]]),
  },
  vikings: {
    200: qa([["Who is Ragnar's first wife?", "Lagertha"], ["Who builds Ragnar's revolutionary boats?", "Floki"], ["What English monastery does Ragnar raid first?", "Lindisfarne"]]),
    400: qa([["Who kills Ragnar by throwing him into a pit of snakes?", "King Aelle"], ["What city do the Vikings famously besiege in France?", "Paris"], ["Which son of Ragnar becomes known as the Boneless?", "Ivar"]]),
    600: qa([["What huge invasion of England is launched by Ragnar's sons?", "The Great Heathen Army"], ["What land does Floki eventually settle?", "Iceland"], ["Who becomes the first Duke of Normandy after settling in France?", "Rollo"]]),
  },
  one_piece_show: {
    200: qa([["What fruit gives Luffy his rubber body?", "The Gomu Gomu no Mi"], ["Who is the navigator of the Straw Hats?", "Nami"], ["What is Zoro's dream?", "To become the world's greatest swordsman"]]),
    400: qa([["What power system has Observation, Armament, and Conqueror's forms?", "Haki"], ["What title is given to the world's four most powerful pirates?", "The Yonko / Four Emperors"], ["Who can read the ancient Poneglyphs for the Straw Hats?", "Nico Robin"]]),
    600: qa([["What is the hidden true identity of Luffy's fruit?", "The Hito Hito no Mi, Model: Nika"], ["What is the final island at the end of the Grand Line called?", "Laugh Tale"], ["What erased 100-year period is central to the world's mystery?", "The Void Century"]]),
  },
  dragon_ball: {
    200: qa([["What race are Goku and Vegeta?", "Saiyans"], ["What attack is Goku famous for charging with cupped hands?", "Kamehameha"], ["How many Dragon Balls are needed to summon Shenron?", "7"]]),
    400: qa([["What room lets fighters train for a year in a single day?", "The Hyperbolic Time Chamber"], ["What transformation first appears when Goku fights Frieza?", "Super Saiyan"], ["What android later marries Krillin?", "Android 18"]]),
    600: qa([["What godly state lets Goku move without conscious thought?", "Ultra Instinct"], ["What tournament puts multiple universes at risk of erasure?", "The Tournament of Power"], ["What ruler can erase universes instantly?", "Zeno"]]),
  },
  spider_man: {
    200: qa([["What newspaper does Peter Parker work for?", "The Daily Bugle"], ["Who is Peter Parker's aunt?", "Aunt May"], ["What villain is Norman Osborn?", "The Green Goblin"]]),
    400: qa([["Who is Miles Morales?", "Another Spider-Man from another universe"], ["What team of villains often unites against Spider-Man?", "The Sinister Six"], ["Who becomes Venom?", "Eddie Brock"]]),
    600: qa([["What controversial Spider-Man story erased Peter and MJ's marriage?", "One More Day"], ["Who becomes Superior Spider-Man after taking Peter's body?", "Doctor Octopus / Otto Octavius"], ["What event is often called the end of the Silver Age for Spider-Man?", "The death of Gwen Stacy"]]),
  },
  who_footballer: {
    200: who([["English midfielder, joined Real Madrid from Dortmund and quickly became one of the world's best young stars", "Jude Bellingham", "Jude_Bellingham"], ["English Arsenal winger, left-footed, explosive, and a star for England", "Bukayo Saka", "Bukayo_Saka"], ["Spanish Barcelona midfielder, teenage playmaker, Golden Boy winner", "Pedri", "Pedri"]]),
    400: who([["Brazilian left-back known for thunderous free kicks and outside-of-the-foot crosses", "Roberto Carlos", "Roberto_Carlos"], ["Italian defender and AC Milan legend, one of the greatest defenders ever", "Paolo Maldini", "Paolo_Maldini"], ["Italian deep-lying playmaker known for elegance, long passing, and free kicks", "Andrea Pirlo", "Andrea_Pirlo"]]),
    600: who([["Brazilian magician with a huge smile, won the Ballon d'Or and made street-football flair global", "Ronaldinho", "Ronaldinho"], ["Soviet goalkeeper nicknamed the Black Spider and the only keeper to win the Ballon d'Or", "Lev Yashin", "Lev_Yashin"], ["German legend nicknamed Der Kaiser who dominated as a sweeper", "Franz Beckenbauer", "Franz_Beckenbauer"]]),
  },
  who_tv_character: {
    200: who([["I am the witty single mother at the center of Gilmore Girls, powered by coffee and sarcasm", "Lorelai Gilmore", "Lorelai_Gilmore"], ["I am Lorelai's bookish daughter growing up in Stars Hollow", "Rory Gilmore", "Rory_Gilmore"], ["I am Ted Mosby's giant-hearted best friend and a lawyer from Minnesota", "Marshall Eriksen", "Marshall_Eriksen"]]),
    400: who([["I am the physicist from The Big Bang Theory who lives with Sheldon and dates Penny", "Leonard Hofstadter", "Leonard_Hofstadter"], ["I am the foul-mouthed kid in a red jacket from South Park", "Eric Cartman", "Eric_Cartman"], ["I am the genius drunk scientist who drags my grandson across dimensions", "Rick Sanchez", "Rick_Sanchez"]]),
    600: who([["I am the kingpin of West Baltimore from The Wire, polished and ruthless", "Stringer Bell", "Stringer_Bell"], ["I am the FBI agent obsessed with the paranormal in The X-Files", "Fox Mulder", "Fox_Mulder"], ["I am the vampire slayer from Sunnydale", "Buffy Summers", "Buffy_Summers"]]),
  },
  who_anime_character: {
    200: who([["I travel the world with Pikachu aiming to become a Pokemon Master", "Ash Ketchum", "Ash_Ketchum"], ["I am a silver-haired half-demon with a giant sword searching for jewel shards", "Inuyasha", "Inuyasha_(character)"], ["I fight evil by moonlight and my civilian name is Usagi Tsukino", "Sailor Moon", "Sailor_Moon"]]),
    400: who([["I am the scarred martial artist hero of Fist of the North Star", "Kenshiro", "Kenshiro"], ["I am the red-coated vampire from Hellsing serving Integra", "Alucard", "Alucard_(Hellsing)"], ["I am the spirit detective with a Spirit Gun in Yu Yu Hakusho", "Yusuke Urameshi", "Yusuke_Urameshi"]]),
    600: who([["I am the fire dragon slayer from Fairy Tail", "Natsu Dragneel", "Natsu_Dragneel"], ["I am the laid-back bounty hunter from Cowboy Bebop with amazing hair and even better aim", "Spike Spiegel", "Spike_Spiegel"], ["I am the fiery EVA pilot often called the Second Child", "Asuka Langley Soryu", "Asuka_Langley_Soryu"]]),
  },
  who_movie_character: {
    200: who([["I run across America, love Jenny, and accidentally drift through history", "Forrest Gump", "Forrest_Gump"], ["I am the brightest witch of my age and one of Harry Potter's closest friends", "Hermione Granger", "Hermione_Granger"], ["I am the pirate captain with a compass that points to what I want most", "Captain Jack Sparrow", "Captain_Jack_Sparrow"]]),
    400: who([["I am the revenge-driven bride in a yellow jumpsuit from Kill Bill", "The Bride", "The_Bride_(Kill_Bill)"], ["I am Vincent Vega's unforgettable dance partner in Pulp Fiction", "Mia Wallace", "Mia_Wallace"], ["I am the Roman general who becomes a gladiator seeking vengeance", "Maximus", "Maximus_Decimus_Meridius"]]),
    600: who([["I am the liquid metal assassin from Terminator 2", "T-1000", "T-1000"], ["I am the writer descending into madness in The Shining", "Jack Torrance", "Jack_Torrance"], ["I am the rebel princess of Alderaan fighting the Empire", "Princess Leia", "Princess_Leia"]]),
  },
  charades_general: {
    200: charades(["riding a bicycle", "brushing your teeth", "washing dishes", "taking a selfie", "walking a dog", "doing yoga", "changing a lightbulb", "opening a stubborn jar"]),
    400: charades(["missing the bus", "trying to parallel park", "being stuck in an elevator", "winning the lottery", "stepping on Lego", "arguing with customer service", "ordering at a drive-thru", "surviving a roller coaster"]),
    600: charades(["time traveler landing in the future", "pirate searching for buried treasure", "news anchor during breaking news", "magician whose trick goes wrong", "astronaut doing a spacewalk", "detective solving a murder", "chef in a cooking competition", "spy sneaking through lasers"]),
  },
  charades_movies: {
    200: charades(["The Lion King", "Frozen", "Toy Story", "Finding Nemo", "Shrek", "Spider-Man", "Titanic", "The Avengers"], "Act this movie"),
    400: charades(["The Dark Knight", "Pirates of the Caribbean", "The Hunger Games", "The Matrix", "Harry Potter", "The Incredibles", "Forrest Gump", "Gladiator"], "Act this movie"),
    600: charades(["Inception", "The Wolf of Wall Street", "Mad Max: Fury Road", "The Silence of the Lambs", "No Country for Old Men", "Pulp Fiction", "The Godfather", "Interstellar"], "Act this movie"),
  },
};

export default QUESTION_EXPANSIONS;

