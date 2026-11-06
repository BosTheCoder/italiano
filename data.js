const UNITS = [{"name": "Essentials", "icon": "👋"}, {"name": "Food & cafés", "icon": "🍝"}, {"name": "Getting around", "icon": "🗺️"}, {"name": "Making friends", "icon": "🤝"}, {"name": "Flirting & dating", "icon": "😍"}, {"name": "Nightlife", "icon": "🎶"}, {"name": "Shops & hotel", "icon": "🛍️"}, {"name": "Problems", "icon": "🆘"}, {"name": "What they say back", "icon": "👂"}];
const CARDS = [
{
"id": "5f915f47",
"it": "Ciao!",
"en": "Hi! / Bye! (informal)",
"pic": "👋",
"pron": "CHOW",
"star": 1,
"unit": 0
},
{
"id": "b7548e90",
"it": "Buongiorno",
"en": "Good morning / Good day",
"pic": "🌅",
"pron": "bwon-JOR-noh",
"star": 1,
"unit": 0
},
{
"id": "92032fab",
"it": "Buonasera",
"en": "Good evening",
"pic": "🌆",
"pron": "bwoh-nah-SEH-rah",
"star": 1,
"unit": 0
},
{
"id": "b2386a82",
"it": "Grazie",
"en": "Thank you",
"pic": "🙏",
"pron": "GRAHT-see-eh",
"star": 1,
"unit": 0
},
{
"id": "43a359af",
"it": "Grazie mille",
"en": "Thank you very much",
"pic": "🙏🙏",
"pron": "GRAHT-see-eh MEEL-leh",
"star": 0,
"unit": 0
},
{
"id": "ca455b08",
"it": "Per favore",
"en": "Please",
"pic": "🥺",
"pron": "pehr fah-VOH-reh",
"star": 1,
"unit": 0
},
{
"id": "8096fa76",
"it": "Scusi",
"en": "Excuse me (polite)",
"pic": "🙋",
"pron": "SKOO-zee",
"star": 1,
"unit": 0
},
{
"id": "149250c1",
"it": "Scusa",
"en": "Excuse me / Sorry (informal)",
"pic": "😅",
"pron": "SKOO-zah",
"star": 0,
"unit": 0
},
{
"id": "aca8c458",
"it": "Mi dispiace",
"en": "I'm sorry",
"pic": "😔",
"pron": "mee dee-SPYAH-cheh",
"star": 0,
"unit": 0
},
{
"id": "becbaaf4",
"it": "Sì / No",
"en": "Yes / No",
"pic": "✅",
"pron": "SEE / NOH",
"star": 1,
"unit": 0
},
{
"id": "811d9d0f",
"it": "Va bene",
"en": "Okay / That's fine",
"pic": "👌",
"pron": "vah BEH-neh",
"star": 1,
"unit": 0
},
{
"id": "bd514ee7",
"it": "Perfetto!",
"en": "Perfect!",
"pic": "💯",
"pron": "pehr-FEHT-toh",
"star": 0,
"unit": 0
},
{
"id": "1eea0954",
"it": "Prego",
"en": "You're welcome / Go ahead",
"pic": "😊",
"pron": "PREH-goh",
"star": 0,
"unit": 0
},
{
"id": "98f3cebf",
"it": "Parli inglese?",
"en": "Do you speak English?",
"pic": "🇬🇧",
"pron": "PAHR-lee een-GLEH-zeh",
"star": 1,
"unit": 0
},
{
"id": "7c4db520",
"it": "Parlo solo un po' di italiano",
"en": "I only speak a little Italian",
"pic": "🤏",
"pron": "PAHR-loh SOH-loh oon POH dee ee-tah-LYAH-noh",
"star": 0,
"unit": 0
},
{
"id": "0f1cc1fb",
"it": "Non capisco",
"en": "I don't understand",
"pic": "🤷",
"pron": "nohn kah-PEES-koh",
"star": 1,
"unit": 0
},
{
"id": "b8e2cc1b",
"it": "Può ripetere, per favore?",
"en": "Could you repeat that, please?",
"pic": "🔁",
"pron": "PWOH ree-PEH-teh-reh, pehr fah-VOH-reh",
"star": 0,
"unit": 0
},
{
"id": "657966b4",
"it": "Più lentamente, per favore",
"en": "More slowly, please",
"pic": "🐢",
"pron": "PYOO lehn-tah-MEHN-teh, pehr fah-VOH-reh",
"star": 0,
"unit": 0
},
{
"id": "b9560278",
"it": "Come si dice ... in italiano?",
"en": "How do you say ... in Italian?",
"pic": "💬",
"pron": "KOH-meh see DEE-cheh ... een ee-tah-LYAH-noh",
"star": 0,
"unit": 0
},
{
"id": "80ef171f",
"it": "Vorrei...",
"en": "I would like...",
"pic": "🙌",
"pron": "vohr-RAY",
"star": 1,
"unit": 1
},
{
"id": "6f29ead0",
"it": "Prendo...",
"en": "I'll have...",
"pic": "👉",
"pron": "PREHN-doh",
"star": 1,
"unit": 1
},
{
"id": "d7dc249f",
"it": "Un tavolo per due, per favore",
"en": "A table for two, please",
"pic": "🍽️",
"pron": "oon TAH-voh-loh pehr DOO-eh, pehr fah-VOH-reh",
"star": 0,
"unit": 1
},
{
"id": "7b0ce5ae",
"it": "Avete un tavolo libero?",
"en": "Do you have a free table?",
"pic": "🪑",
"pron": "ah-VEH-teh oon TAH-voh-loh LEE-beh-roh",
"star": 0,
"unit": 1
},
{
"id": "3afe2c40",
"it": "Posso vedere il menù?",
"en": "Can I see the menu?",
"pic": "📜",
"pron": "POHS-soh veh-DEH-reh eel meh-NOO",
"star": 0,
"unit": 1
},
{
"id": "856c7852",
"it": "Cosa mi consiglia?",
"en": "What do you recommend?",
"pic": "🤔",
"pron": "KOH-zah mee kohn-SEE-lyah",
"star": 1,
"unit": 1
},
{
"id": "52a1f978",
"it": "Qual è la specialità della casa?",
"en": "What's the house speciality?",
"pic": "⭐",
"pron": "kwah-LEH lah speh-chah-lee-TAH DEHL-lah KAH-zah",
"star": 0,
"unit": 1
},
{
"id": "21124554",
"it": "Per me questo, per favore",
"en": "This one for me, please",
"pic": "☝️",
"pron": "pehr MEH KWEH-stoh, pehr fah-VOH-reh",
"star": 0,
"unit": 1
},
{
"id": "3a06d03e",
"it": "Un'acqua naturale, per favore",
"en": "Still water, please",
"pic": "💧",
"pron": "oo-NAH-kwah nah-too-RAH-leh, pehr fah-VOH-reh",
"star": 1,
"unit": 1
},
{
"id": "23f6e5cf",
"it": "Un'acqua frizzante",
"en": "Sparkling water",
"pic": "🫧",
"pron": "oo-NAH-kwah freet-TSAHN-teh",
"star": 0,
"unit": 1
},
{
"id": "992f2761",
"it": "Un cappuccino, per favore",
"en": "A cappuccino, please",
"pic": "☕",
"pron": "oon kahp-poo-CHEE-noh, pehr fah-VOH-reh",
"star": 0,
"unit": 1
},
{
"id": "89068583",
"it": "Un altro, per favore",
"en": "Another one, please",
"pic": "➕",
"pron": "oo-NAHL-troh, pehr fah-VOH-reh",
"star": 0,
"unit": 1
},
{
"id": "de044062",
"it": "Senza..., per favore",
"en": "Without..., please",
"pic": "🚫",
"pron": "SEHN-tsah, pehr fah-VOH-reh",
"star": 0,
"unit": 1
},
{
"id": "385f34ea",
"it": "È piccante?",
"en": "Is it spicy?",
"pic": "🌶️",
"pron": "EH peek-KAHN-teh",
"star": 0,
"unit": 1
},
{
"id": "532ebae0",
"it": "C'è carne in questo piatto?",
"en": "Is there meat in this dish?",
"pic": "🥩",
"pron": "CHEH KAHR-neh een KWEH-stoh PYAHT-toh",
"star": 0,
"unit": 1
},
{
"id": "bd052282",
"it": "Sono vegetariano",
"en": "I'm vegetarian (male speaker)",
"pic": "🥗",
"pron": "SOH-noh veh-jeh-tah-RYAH-noh",
"star": 0,
"unit": 1
},
{
"id": "93cdf75f",
"it": "Mangio pesce, ma non carne",
"en": "I eat fish, but not meat",
"pic": "🐟",
"pron": "MAHN-joh PEH-sheh, mah nohn KAHR-neh",
"star": 0,
"unit": 1
},
{
"id": "6c16677b",
"it": "È buonissimo!",
"en": "It's delicious!",
"pic": "😋",
"pron": "EH bwoh-NEES-see-moh",
"star": 1,
"unit": 1
},
{
"id": "e3a0e04f",
"it": "Il conto, per favore",
"en": "The bill, please",
"pic": "🧾",
"pron": "eel KOHN-toh pehr fah-VOH-reh",
"star": 1,
"unit": 1
},
{
"id": "724c2091",
"it": "Posso pagare con la carta?",
"en": "Can I pay by card?",
"pic": "💳",
"pron": "POHS-soh pah-GAH-reh kohn lah KAHR-tah",
"star": 1,
"unit": 1
},
{
"id": "f3ff09a0",
"it": "Conti separati, per favore",
"en": "Separate bills, please",
"pic": "✂️",
"pron": "KOHN-tee seh-pah-RAH-tee, pehr fah-VOH-reh",
"star": 0,
"unit": 1
},
{
"id": "2508b934",
"it": "Dov'è...?",
"en": "Where is...?",
"pic": "📍",
"pron": "doh-VEH",
"star": 1,
"unit": 2
},
{
"id": "0014562d",
"it": "Dov'è il bagno?",
"en": "Where is the toilet?",
"pic": "🚻",
"pron": "doh-VEH eel BAH-nyoh",
"star": 1,
"unit": 2
},
{
"id": "a909c8bc",
"it": "Come arrivo a...?",
"en": "How do I get to...?",
"pic": "🧭",
"pron": "KOH-meh ahr-REE-voh ah",
"star": 0,
"unit": 2
},
{
"id": "fbfe90f0",
"it": "È lontano?",
"en": "Is it far?",
"pic": "🔭",
"pron": "EH lohn-TAH-noh",
"star": 0,
"unit": 2
},
{
"id": "7c08512a",
"it": "Posso andare a piedi?",
"en": "Can I walk there?",
"pic": "🚶",
"pron": "POHS-soh ahn-DAH-reh ah PYEH-dee",
"star": 0,
"unit": 2
},
{
"id": "84843b30",
"it": "Quanto costa?",
"en": "How much does it cost?",
"pic": "💶",
"pron": "KWAHN-toh KOH-stah",
"star": 1,
"unit": 2
},
{
"id": "86a78f2e",
"it": "Un biglietto, per favore",
"en": "One ticket, please",
"pic": "🎟️",
"pron": "oon bee-LYEHT-toh, pehr fah-VOH-reh",
"star": 0,
"unit": 2
},
{
"id": "0487c044",
"it": "È questa la strada giusta?",
"en": "Is this the right way?",
"pic": "🛣️",
"pron": "EH KWEH-stah lah STRAH-dah JOO-stah",
"star": 0,
"unit": 2
},
{
"id": "a0eaf152",
"it": "A destra / A sinistra",
"en": "Right / Left",
"pic": "↔️",
"pron": "ah DEH-strah / ah see-NEE-strah",
"star": 0,
"unit": 2
},
{
"id": "06687330",
"it": "Sempre dritto",
"en": "Straight ahead",
"pic": "⬆️",
"pron": "SEHM-preh DREET-toh",
"star": 0,
"unit": 2
},
{
"id": "8ac6d874",
"it": "Qui / Là",
"en": "Here / There",
"pic": "👇",
"pron": "KWEE / LAH",
"star": 0,
"unit": 2
},
{
"id": "56d7fcad",
"it": "Mi può portare a...?",
"en": "Can you take me to...? (taxi)",
"pic": "🚕",
"pron": "mee PWOH pohr-TAH-reh ah",
"star": 0,
"unit": 2
},
{
"id": "e0d31163",
"it": "Si fermi qui, per favore",
"en": "Stop here, please",
"pic": "🛑",
"pron": "see FEHR-mee KWEE, pehr fah-VOH-reh",
"star": 0,
"unit": 2
},
{
"id": "13bd241b",
"it": "A che ora parte?",
"en": "What time does it leave?",
"pic": "🚆",
"pron": "ah keh OH-rah PAHR-teh",
"star": 0,
"unit": 2
},
{
"id": "72987e8e",
"it": "Posso fare una foto?",
"en": "Can I take a photo?",
"pic": "📷",
"pron": "POHS-soh FAH-reh OO-nah FOH-toh",
"star": 0,
"unit": 2
},
{
"id": "2056bf79",
"it": "Può farmi una foto?",
"en": "Can you take a photo of me?",
"pic": "🤳",
"pron": "PWOH FAHR-mee OO-nah FOH-toh",
"star": 0,
"unit": 2
},
{
"id": "ac6909ab",
"it": "Come ti chiami?",
"en": "What's your name?",
"pic": "🏷️",
"pron": "KOH-meh tee KYAH-mee",
"star": 1,
"unit": 3
},
{
"id": "e62e1840",
"it": "Mi chiamo...",
"en": "My name is...",
"pic": "🙋‍♂️",
"pron": "mee KYAH-moh",
"star": 1,
"unit": 3
},
{
"id": "ef2e0ea6",
"it": "Piacere!",
"en": "Nice to meet you!",
"pic": "🤝",
"pron": "pyah-CHEH-reh",
"star": 1,
"unit": 3
},
{
"id": "218043d5",
"it": "Come stai?",
"en": "How are you?",
"pic": "🙂",
"pron": "KOH-meh STAI",
"star": 1,
"unit": 3
},
{
"id": "8e7d3c08",
"it": "Bene, grazie. E tu?",
"en": "Good, thanks. And you?",
"pic": "😄",
"pron": "BEH-neh, GRAHT-see-eh. eh TOO",
"star": 0,
"unit": 3
},
{
"id": "6c8a390d",
"it": "Di dove sei?",
"en": "Where are you from?",
"pic": "🌍",
"pron": "dee DOH-veh SAY",
"star": 1,
"unit": 3
},
{
"id": "056b6fc5",
"it": "Sono di Londra",
"en": "I'm from London",
"pic": "🇬🇧",
"pron": "SOH-noh dee LOHN-drah",
"star": 0,
"unit": 3
},
{
"id": "2cfc5feb",
"it": "Sei di qui?",
"en": "Are you from around here?",
"pic": "🏘️",
"pron": "SAY dee KWEE",
"star": 0,
"unit": 3
},
{
"id": "d22db9c6",
"it": "Sono qui in vacanza",
"en": "I'm here on holiday",
"pic": "🏖️",
"pron": "SOH-noh KWEE een vah-KAHN-tsah",
"star": 1,
"unit": 3
},
{
"id": "155028d0",
"it": "Rimango qui una settimana",
"en": "I'm staying for a week",
"pic": "📅",
"pron": "ree-MAHN-goh KWEE OO-nah seht-tee-MAH-nah",
"star": 0,
"unit": 3
},
{
"id": "91d535ae",
"it": "È la mia prima volta in Italia",
"en": "It's my first time in Italy",
"pic": "🇮🇹",
"pron": "EH lah MEE-ah PREE-mah VOHL-tah een ee-TAH-lyah",
"star": 0,
"unit": 3
},
{
"id": "0c5d5b6a",
"it": "Cosa fai nella vita?",
"en": "What do you do?",
"pic": "💼",
"pron": "KOH-zah FAI NEHL-lah VEE-tah",
"star": 0,
"unit": 3
},
{
"id": "2e76130e",
"it": "Che fai stasera?",
"en": "What are you doing tonight?",
"pic": "🌙",
"pron": "keh FAI stah-SEH-rah",
"star": 1,
"unit": 3
},
{
"id": "a53de260",
"it": "Conosci qualche bel posto qui vicino?",
"en": "Know any good spots nearby?",
"pic": "📌",
"pron": "koh-NOH-shee KWAHL-keh behl POH-stoh KWEE vee-CHEE-noh",
"star": 0,
"unit": 3
},
{
"id": "b788f8ba",
"it": "Andiamo!",
"en": "Let's go!",
"pic": "🏃",
"pron": "ahn-DYAH-moh",
"star": 1,
"unit": 3
},
{
"id": "fd5c15c3",
"it": "Ci vediamo dopo!",
"en": "See you later!",
"pic": "👋",
"pron": "chee veh-DYAH-moh DOH-poh",
"star": 0,
"unit": 3
},
{
"id": "12177eba",
"it": "Mi sto divertendo un sacco!",
"en": "I'm having a great time!",
"pic": "🥳",
"pron": "mee stoh dee-vehr-TEHN-doh oon SAHK-koh",
"star": 0,
"unit": 3
},
{
"id": "0ebd2c48",
"it": "Ciao, come ti chiami?",
"en": "Hey, what's your name?",
"pic": "😏",
"pron": "CHOW, KOH-meh tee KYAH-mee",
"star": 0,
"unit": 4
},
{
"id": "5914871f",
"it": "Posso sedermi qui?",
"en": "Can I sit here?",
"pic": "🪑",
"pron": "POHS-soh seh-DEHR-mee KWEE",
"star": 0,
"unit": 4
},
{
"id": "8c6c6a4d",
"it": "Sei qui con amici?",
"en": "Are you here with friends?",
"pic": "👯",
"pron": "SAY KWEE kohn ah-MEE-chee",
"star": 0,
"unit": 4
},
{
"id": "4aea0ed0",
"it": "Vieni spesso qui?",
"en": "Do you come here often?",
"pic": "🔄",
"pron": "VYEH-nee SPEHS-soh KWEE",
"star": 0,
"unit": 4
},
{
"id": "f93ecc2c",
"it": "Hai un bel sorriso",
"en": "You have a beautiful smile",
"pic": "😁",
"pron": "AI oon behl sohr-REE-zoh",
"star": 0,
"unit": 4
},
{
"id": "1eddbf64",
"it": "Mi piace il tuo stile",
"en": "I like your style",
"pic": "🕶️",
"pron": "mee PYAH-cheh eel TOO-oh STEE-leh",
"star": 0,
"unit": 4
},
{
"id": "f48f27cd",
"it": "Sei molto carina",
"en": "You're really cute (to a woman)",
"pic": "🥰",
"pron": "SAY MOHL-toh kah-REE-nah",
"star": 0,
"unit": 4
},
{
"id": "3244d246",
"it": "Sei bellissima",
"en": "You're gorgeous (to a woman)",
"pic": "😍",
"pron": "say behl-LEES-see-mah",
"star": 0,
"unit": 4
},
{
"id": "e0616f48",
"it": "Posso offrirti da bere?",
"en": "Can I buy you a drink?",
"pic": "🍹",
"pron": "POHS-soh ohf-FREER-tee dah BEH-reh",
"star": 0,
"unit": 4
},
{
"id": "8702c235",
"it": "Ti va di ballare?",
"en": "Do you want to dance?",
"pic": "💃",
"pron": "tee vah dee bahl-LAH-reh",
"star": 0,
"unit": 4
},
{
"id": "d5ec2e77",
"it": "Ti va di fare due passi?",
"en": "Fancy going for a walk?",
"pic": "🚶‍♀️",
"pron": "tee vah dee FAH-reh DOO-eh PAHS-see",
"star": 0,
"unit": 4
},
{
"id": "0f152ddb",
"it": "Ti va di prendere un caffè?",
"en": "Fancy getting a coffee?",
"pic": "☕",
"pron": "tee vah dee PREHN-deh-reh oon kahf-FEH",
"star": 0,
"unit": 4
},
{
"id": "97ce81b8",
"it": "Hai programmi per domani?",
"en": "Do you have plans tomorrow?",
"pic": "🗓️",
"pron": "AI proh-GRAHM-mee pehr doh-MAH-nee",
"star": 0,
"unit": 4
},
{
"id": "8ed96ae3",
"it": "Mi piacerebbe rivederti",
"en": "I'd like to see you again",
"pic": "🔜",
"pron": "mee pyah-cheh-REHB-beh ree-veh-DEHR-tee",
"star": 0,
"unit": 4
},
{
"id": "d0d8776c",
"it": "Hai Instagram?",
"en": "Do you have Instagram?",
"pic": "📸",
"pron": "AI EEN-stah-grahm",
"star": 0,
"unit": 4
},
{
"id": "688dabce",
"it": "Posso avere il tuo numero?",
"en": "Can I have your number?",
"pic": "📱",
"pron": "POHS-soh ah-VEH-reh eel TOO-oh NOO-meh-roh",
"star": 0,
"unit": 4
},
{
"id": "7a0541ea",
"it": "Mi piace parlare con te",
"en": "I like talking to you",
"pic": "🗣️",
"pron": "mee PYAH-cheh pahr-LAH-reh kohn TEH",
"star": 0,
"unit": 4
},
{
"id": "62af57aa",
"it": "Mi piaci",
"en": "I like you (romantically)",
"pic": "❤️",
"pron": "mee PYAH-chee",
"star": 0,
"unit": 4
},
{
"id": "e7595102",
"it": "Posso baciarti?",
"en": "Can I kiss you?",
"pic": "💋",
"pron": "POHS-soh bah-CHAHR-tee",
"star": 0,
"unit": 4
},
{
"id": "c690059e",
"it": "Scrivimi!",
"en": "Message me!",
"pic": "💬",
"pron": "SKREE-vee-mee",
"star": 0,
"unit": 4
},
{
"id": "27666c75",
"it": "Buonanotte, bella",
"en": "Goodnight, beautiful",
"pic": "🌙",
"pron": "bwoh-nah-NOHT-teh, BEHL-lah",
"star": 0,
"unit": 4
},
{
"id": "588a8377",
"it": "Dove si esce stasera?",
"en": "Where are people going out tonight?",
"pic": "🌃",
"pron": "DOH-veh see EH-sheh stah-SEH-rah",
"star": 1,
"unit": 5
},
{
"id": "5ab781bd",
"it": "Dove si può ballare?",
"en": "Where can we go dancing?",
"pic": "🕺",
"pron": "DOH-veh see PWOH bahl-LAH-reh",
"star": 0,
"unit": 5
},
{
"id": "24c37245",
"it": "C'è qualcosa di bello stasera?",
"en": "Anything good happening tonight?",
"pic": "✨",
"pron": "CHEH kwahl-KOH-zah dee BEHL-loh stah-SEH-rah",
"star": 1,
"unit": 5
},
{
"id": "dca0967c",
"it": "Com'è questo locale?",
"en": "What's this place like?",
"pic": "🏛️",
"pron": "koh-MEH KWEH-stoh loh-KAH-leh",
"star": 0,
"unit": 5
},
{
"id": "a48c216b",
"it": "È troppo affollato",
"en": "It's too crowded",
"pic": "👥",
"pron": "EH TROHP-poh ahf-fohl-LAH-toh",
"star": 0,
"unit": 5
},
{
"id": "28cd9f3b",
"it": "Che bella atmosfera!",
"en": "Such a great atmosphere!",
"pic": "🔥",
"pron": "keh BEHL-lah aht-moh-SFEH-rah",
"star": 1,
"unit": 5
},
{
"id": "05689f66",
"it": "Metti della musica hip-hop?",
"en": "Can you put on some hip-hop?",
"pic": "🎧",
"pron": "MEHT-tee DEHL-lah MOO-zee-kah eep-OHP",
"star": 0,
"unit": 5
},
{
"id": "4dc6800f",
"it": "Cin cin!",
"en": "Cheers!",
"pic": "🥂",
"pron": "cheen CHEEN",
"star": 1,
"unit": 5
},
{
"id": "b07f6e40",
"it": "Salute!",
"en": "Cheers!",
"pic": "🍻",
"pron": "sah-LOO-teh",
"star": 1,
"unit": 5
},
{
"id": "4c800a26",
"it": "Un analcolico, per favore",
"en": "A non-alcoholic drink, please",
"pic": "🧃",
"pron": "oo-nah-nahl-KOH-lee-koh, pehr fah-VOH-reh",
"star": 0,
"unit": 5
},
{
"id": "fe9ef49c",
"it": "Andiamo da un'altra parte?",
"en": "Shall we go somewhere else?",
"pic": "↪️",
"pron": "ahn-DYAH-moh dah oo-NAHL-trah PAHR-teh",
"star": 0,
"unit": 5
},
{
"id": "57ee6bb2",
"it": "Ancora cinque minuti!",
"en": "Five more minutes!",
"pic": "⏳",
"pron": "ahn-KOH-rah CHEEN-kweh mee-NOO-tee",
"star": 0,
"unit": 5
},
{
"id": "07470a1a",
"it": "Sto solo guardando, grazie",
"en": "I'm just looking, thanks",
"pic": "👀",
"pron": "stoh SOH-loh gwahr-DAHN-doh, GRAHT-see-eh",
"star": 1,
"unit": 6
},
{
"id": "89b14168",
"it": "Posso provarlo?",
"en": "Can I try it on?",
"pic": "👕",
"pron": "POHS-soh proh-VAHR-loh",
"star": 0,
"unit": 6
},
{
"id": "2c9b0905",
"it": "Avete una taglia più grande?",
"en": "Have you got a larger size?",
"pic": "📏",
"pron": "ah-VEH-teh OO-nah TAH-lyah PYOO GRAHN-deh",
"star": 0,
"unit": 6
},
{
"id": "fe246e2b",
"it": "È troppo caro",
"en": "It's too expensive",
"pic": "💸",
"pron": "EH TROHP-poh KAH-roh",
"star": 0,
"unit": 6
},
{
"id": "035f8cdb",
"it": "Ho una prenotazione",
"en": "I have a reservation",
"pic": "🏨",
"pron": "oh OO-nah preh-noh-taht-SYOH-neh",
"star": 0,
"unit": 6
},
{
"id": "a3b2833a",
"it": "A che ora è il check-out?",
"en": "What time is checkout?",
"pic": "🕚",
"pron": "ah keh OH-rah EH eel cheh-KAOUT",
"star": 0,
"unit": 6
},
{
"id": "e27519dc",
"it": "Posso lasciare qui i bagagli?",
"en": "Can I leave my luggage here?",
"pic": "🧳",
"pron": "POHS-soh lah-SHAH-reh KWEE ee bah-GAH-lyee",
"star": 0,
"unit": 6
},
{
"id": "73c7d4f7",
"it": "Qual è la password del Wi-Fi?",
"en": "What's the Wi-Fi password?",
"pic": "📶",
"pron": "kwah-LEH lah PAHS-wohrd dehl WAI-fai",
"star": 1,
"unit": 6
},
{
"id": "c0f74874",
"it": "Non funziona",
"en": "It doesn't work",
"pic": "🔧",
"pron": "nohn foon-TSYOH-nah",
"star": 0,
"unit": 6
},
{
"id": "ad3a4d49",
"it": "Posso caricare il telefono qui?",
"en": "Can I charge my phone here?",
"pic": "🔋",
"pron": "POHS-soh kah-ree-KAH-reh eel teh-LEH-foh-noh KWEE",
"star": 0,
"unit": 6
},
{
"id": "26397d86",
"it": "Aiuto!",
"en": "Help!",
"pic": "🆘",
"pron": "ai-YOO-toh",
"star": 1,
"unit": 7
},
{
"id": "3e3e3c4c",
"it": "Ho bisogno di aiuto",
"en": "I need help",
"pic": "🙏",
"pron": "oh bee-ZOH-nyoh dee ai-YOO-toh",
"star": 1,
"unit": 7
},
{
"id": "3d732a17",
"it": "Mi sono perso",
"en": "I'm lost (male speaker)",
"pic": "😵‍💫",
"pron": "mee SOH-noh PEHR-soh",
"star": 0,
"unit": 7
},
{
"id": "54c841ce",
"it": "Ho perso il telefono",
"en": "I've lost my phone",
"pic": "📵",
"pron": "oh PEHR-soh eel teh-LEH-foh-noh",
"star": 0,
"unit": 7
},
{
"id": "c308df72",
"it": "Mi hanno rubato il portafoglio",
"en": "My wallet has been stolen",
"pic": "👛",
"pron": "mee AHN-noh roo-BAH-toh eel pohr-tah-FOH-lyoh",
"star": 0,
"unit": 7
},
{
"id": "f6a98e69",
"it": "Non mi sento bene",
"en": "I don't feel well",
"pic": "🤒",
"pron": "nohn mee SEHN-toh BEH-neh",
"star": 0,
"unit": 7
},
{
"id": "73cefc6d",
"it": "Ho bisogno di un medico",
"en": "I need a doctor",
"pic": "🩺",
"pron": "oh bee-ZOH-nyoh dee oon MEH-dee-koh",
"star": 1,
"unit": 7
},
{
"id": "99cf2605",
"it": "Dov'è la farmacia?",
"en": "Where is the pharmacy?",
"pic": "💊",
"pron": "doh-VEH lah fahr-mah-CHEE-ah",
"star": 0,
"unit": 7
},
{
"id": "50984f6f",
"it": "Chiami un'ambulanza!",
"en": "Call an ambulance!",
"pic": "🚑",
"pron": "KYAH-mee oo-nahm-boo-LAHN-tsah",
"star": 0,
"unit": 7
},
{
"id": "7e1b0c4d",
"it": "Lasciami in pace",
"en": "Leave me alone",
"pic": "✋",
"pron": "LAH-shah-mee een PAH-cheh",
"star": 0,
"unit": 7
},
{
"id": "811db720",
"it": "Certo!",
"en": "Of course!",
"pic": "👍",
"pron": "CHEHR-toh",
"star": 0,
"unit": 8
},
{
"id": "cb7640fc",
"it": "Subito!",
"en": "Right away!",
"pic": "⚡",
"pron": "SOO-bee-toh",
"star": 0,
"unit": 8
},
{
"id": "49b9eeb7",
"it": "Un attimo",
"en": "One moment",
"pic": "☝️",
"pron": "oo-NAHT-tee-moh",
"star": 0,
"unit": 8
},
{
"id": "30ef1286",
"it": "Aspetta",
"en": "Wait",
"pic": "✋",
"pron": "ah-SPEHT-tah",
"star": 0,
"unit": 8
},
{
"id": "0e4be29c",
"it": "Non lo so",
"en": "I don't know",
"pic": "🤷‍♂️",
"pron": "nohn loh SOH",
"star": 0,
"unit": 8
},
{
"id": "eb26a195",
"it": "Dipende",
"en": "It depends",
"pic": "⚖️",
"pron": "dee-PEHN-deh",
"star": 0,
"unit": 8
},
{
"id": "485aa3ca",
"it": "Magari!",
"en": "I'd love to! / If only!",
"pic": "🤞",
"pron": "mah-GAH-ree",
"star": 0,
"unit": 8
},
{
"id": "d18441fb",
"it": "Davvero?",
"en": "Really?",
"pic": "😮",
"pron": "dahv-VEH-roh",
"star": 0,
"unit": 8
},
{
"id": "b434b3ef",
"it": "Che bello!",
"en": "How nice! / That's great!",
"pic": "🤩",
"pron": "keh BEHL-loh",
"star": 0,
"unit": 8
},
{
"id": "bd617a22",
"it": "Tranquillo",
"en": "Don't worry / Relax (to a man)",
"pic": "😌",
"pron": "trahn-KWEEL-loh",
"star": 0,
"unit": 8
},
{
"id": "ff550b10",
"it": "Tutto a posto?",
"en": "Everything okay?",
"pic": "🆗",
"pron": "TOOT-toh ah POH-stoh",
"star": 0,
"unit": 8
},
{
"id": "81c4b2c2",
"it": "Basta così?",
"en": "Is that all?",
"pic": "🏁",
"pron": "BAH-stah koh-ZEE",
"star": 0,
"unit": 8
},
{
"id": "0a0579c1",
"it": "Prego?",
"en": "Yes? / Sorry? (depending on context)",
"pic": "❓",
"pron": "PREH-goh",
"star": 0,
"unit": 8
}
];
