const db = require('./config/db');
const sqlite3 = require('sqlite3');
const path = require('path');
require('dotenv').config();

const modulesData = [
  {
    name: "Introduction to the Language",
    description: "Learn the Spanish alphabet, vowels, pronunciation rules, pronunciation guide, and basic language foundations to build strong speaking and reading skills.",
    category: "Basics",
    duration: "~20 Mins",
    icon: "bi-info-circle",
    subtopics: ["Los alfabetos", "Los vocales", "The rules of pronunciation", "Special pronunciations of consonants C & G with vowels", "La guía de pronunciación", "El Abecedario"],
    note: {
      title: "Spanish Basics & Pronunciation Guide",
      content: `Welcome to Spanish! In this introductory module, we cover the foundations of pronunciation and spelling.

### El Abecedario (The Alphabet)
The Spanish alphabet has 27 letters. The extra letter is **Ñ** (eñe).
- **A** (ah), **B** (beh), **C** (seh/theh), **D** (deh)
- **E** (eh), **F** (eh-feh), **G** (heh), **H** (ah-cheh)
- **I** (ee), **J** (ho-tah), **K** (kah), **L** (eh-leh)
- **M** (eh-meh), **N** (eh-neh), **Ñ** (eh-nyeh), **O** (oh)
- **P** (peh), **Q** (koo), **R** (eh-reh), **S** (eh-seh)
- **T** (teh), **U** (oo), **V** (veh), **W** (doble veh)
- **X** (eh-kees), **Y** (ee gryeh-gah), **Z** (theh-tah/seh-tah)

### Los Vocales (The Vowels)
Vowels in Spanish are short, crisp, and pure:
- **A**: "ah" (like in *father*)
- **E**: "eh" (like in *met*)
- **I**: "ee" (like in *see*)
- **O**: "oh" (like in *more*)
- **U**: "oo" (like in *flute*)

### Pronunciation of C & G
- **C** before **A, O, U** sounds like "K" (*casa*, *coche*, *cuna*).
- **C** before **E, I** sounds like "S" in Latin America or "TH" in Spain (*cero*, *cine*).
- **G** before **A, O, U** is a hard "G" (*gato*, *gota*, *gusano*).
- **G** before **E, I** sounds like English "H" or Spanish "J" (*gente*, *girasol*).`
    },
    quiz: {
      title: "Introduction to Spanish Quiz",
      questions: [
        {
          text: "Which letter is unique to the Spanish alphabet compared to English?",
          a: "Ç", b: "Ñ", c: "X", d: "Z",
          correct: "B"
        },
        {
          text: "How is the letter 'C' pronounced in the word 'coche'?",
          a: "Like 'S'", b: "Like 'CH'", c: "Like 'K'", d: "It is silent",
          correct: "C"
        },
        {
          text: "What is the correct Spanish pronunciation sound for the vowel 'I'?",
          a: "Like English 'eye'", b: "Like English 'ee' in see", c: "Like English 'ih' in bit", d: "Like English 'uh'",
          correct: "B"
        }
      ]
    }
  },
  {
    name: "Numbers",
    description: "Master Spanish cardinal and ordinal numbers, counting systems, and number usage in real-life conversations.",
    category: "Basics",
    duration: "~20 Mins",
    icon: "bi-hash",
    subtopics: ["Los números cardinales (1–100)", "Los números cardinales (1–1000)", "Los números ordinales"],
    note: {
      title: "Spanish Numbers & Counting Systems",
      content: `Mastering numbers is crucial for shopping, dates, telling time, and ordering!

### Cardinal Numbers (Los Números Cardinales)
1. **uno** (one)
2. **dos** (two)
3. **tres** (three)
4. **cuatro** (four)
5. **cinco** (five)
6. **seis** (six)
7. **siete** (seven)
8. **ocho** (eight)
9. **nueve** (nine)
10. **diez** (ten)

### Teens and Twenties (Special Patterns)
- 11 to 15 are unique: **once**, **doce**, **trece**, **catorce**, **quince**.
- 16 to 19: **dieciséis**, **diecisiete**, **dieciocho**, **diecinueve**.
- 20 is **veinte**. 21 to 29 are combined as one word: **veintiuno**, **veintidós**, etc.
- 30 is **treinta**. 31+ uses "y": **treinta y uno**, **treinta y dos**, etc.

### Ordinal Numbers (Los Números Ordinales)
- **primero** (first)
- **segundo** (second)
- **tercero** (third)
- **cuarto** (fourth)
- **quinto** (fifth)`
    },
    quiz: {
      title: "Spanish Numbers Evaluation",
      questions: [
        {
          text: "What is the Spanish word for the number fifteen (15)?",
          a: "diez y cinco", b: "quince", c: "once", d: "veinte",
          correct: "B"
        },
        {
          text: "How do you write 'thirty-two' in Spanish?",
          a: "treintaydós", b: "treinta y dos", c: "veintidós", d: "treinta dos",
          correct: "B"
        },
        {
          text: "What is the ordinal number for 'third' in its masculine singular form?",
          a: "tres", b: "tercero", c: "triple", d: "primero",
          correct: "B"
        }
      ]
    }
  },
  {
    name: "Los artículos",
    description: "Understand definite and indefinite articles, gender rules, and article agreement in Spanish grammar.",
    category: "Grammar",
    duration: "~20 Mins",
    icon: "bi-body-text",
    note: {
      title: "Definite and Indefinite Articles in Spanish",
      content: `Every Spanish noun has a grammatical gender (masculine or feminine) and a grammatical number (singular or plural). The article must agree with both!

### Definite Articles ("The")
Used for specific items.
- **Masculine Singular**: *el* (e.g., *el libro* - the book)
- **Feminine Singular**: *la* (e.g., *la mesa* - the table)
- **Masculine Plural**: *los* (e.g., *los libros* - the books)
- **Feminine Plural**: *las* (e.g., *las mesas* - the tables)

### Indefinite Articles ("A / An / Some")
Used for non-specific items.
- **Masculine Singular**: *un* (e.g., *un coche* - a car)
- **Feminine Singular**: *una* (e.g., *una casa* - a house)
- **Masculine Plural**: *unos* (e.g., *unos coches* - some cars)
- **Feminine Plural**: *unas* (e.g., *unas casas* - some houses)

### Gender Clues
- Nouns ending in **-o** are usually **masculine** (*el viento*).
- Nouns ending in **-a** are usually **feminine** (*la playa*).
- Exceptions exist: *el mapa* (the map - masculine), *la mano* (the hand - feminine).`
    },
    quiz: {
      title: "Articles & Gender Agreement Quiz",
      questions: [
        {
          text: "Which of the following definite articles matches 'libros' (masculine plural)?",
          a: "el", b: "la", c: "los", d: "las",
          correct: "C"
        },
        {
          text: "What is the correct indefinite article for the word 'casa'?",
          a: "un", b: "una", c: "unos", d: "unas",
          correct: "B"
        },
        {
          text: "Which word is a common gender exception that uses 'el' despite ending in '-a'?",
          a: "mesa", b: "puerta", c: "mapa", d: "silla",
          correct: "C"
        }
      ]
    }
  },
  {
    name: "Las cosas de la clase",
    description: "Learn vocabulary related to classroom objects and everyday educational environments.",
    category: "Vocabulary",
    duration: "~20 Mins",
    icon: "bi-backpack",
    note: {
      title: "Classroom Objects Vocabulary",
      content: `Build your vocabulary for school, work, and study spaces.

### Common Classroom Vocabulary
- **El bolígrafo** (The pen)
- **El lápiz** (The pencil)
- **El cuaderno** (The notebook)
- **El libro** (The book)
- **La pizarra** (The whiteboard / blackboard)
- **La silla** (The chair)
- **La mesa** (The table / desk)
- **La mochila** (The backpack)
- **La regla** (The ruler)
- **El profesor / La profesora** (The teacher)

### Useful Classroom Phrases
- *¿Tienen un lápiz?* - Do you have a pencil?
- *Abra el libro en la página diez.* - Open the book to page ten.
- *No entiendo.* - I do not understand.`
    },
    quiz: {
      title: "Classroom Objects Quiz",
      questions: [
        {
          text: "What does 'el lápiz' mean?",
          a: "The notebook", b: "The pen", c: "The pencil", d: "The paper",
          correct: "C"
        },
        {
          text: "How do you say 'backpack' in Spanish?",
          a: "la mochila", b: "la mesa", c: "el libro", d: "la pizarra",
          correct: "A"
        },
        {
          text: "Translate 'the notebook' to Spanish:",
          a: "el libro", b: "el cuaderno", c: "el bolígrafo", d: "la silla",
          correct: "B"
        }
      ]
    }
  },
  {
    name: "Los datos personales",
    description: "Practice introducing yourself and sharing personal information in Spanish.",
    category: "Conversation",
    duration: "~20 Mins",
    icon: "bi-person-badge",
    note: {
      title: "Sharing Personal Information",
      content: `Learn to share details about your name, age, phone number, address, and email.

### Asking and Sharing Names
- *¿Cómo te llamas?* - What is your name? (Informal)
- *Me llamo Carlos.* - My name is Carlos.
- *Mi nombre es Ana.* - My name is Ana.

### Age and Birthdays
In Spanish, you **have** years (using *tener*), you are not "is" years old:
- *¿Cuántos años tienes?* - How old are you?
- *Tengo veinticinco años.* - I am 25 years old.

### Contact Details
- *¿Cuál es tu número de teléfono?* - What is your phone number?
- *Mi número es...* - My number is...
- *¿Dónde vives?* - Where do you live?
- *Vivo en Madrid.* - I live in Madrid.`
    },
    quiz: {
      title: "Personal Details Assessment",
      questions: [
        {
          text: "How do you politely ask someone 'What is your name?' in Spanish?",
          a: "¿Cuántos años tienes?", b: "¿Cómo te llamas?", c: "¿Dónde vives?", d: "¿De dónde eres?",
          correct: "B"
        },
        {
          text: "Which verb is used to express age in Spanish?",
          a: "ser", b: "estar", c: "tener", d: "vivir",
          correct: "C"
        },
        {
          text: "What is the translation of 'Vivo en Madrid'?",
          a: "I live in Madrid.", b: "I am traveling to Madrid.", c: "Madrid is beautiful.", d: "My family is in Madrid.",
          correct: "A"
        }
      ]
    }
  },
  {
    name: "El origen y la nacionalidad",
    description: "Learn countries, nationalities, and how to express origin and identity in Spanish.",
    category: "Conversation",
    duration: "~20 Mins",
    icon: "bi-globe",
    note: {
      title: "Origin, Identity, and Nationalities",
      content: `Expressing where you are from and your nationality is central to conversational introductions.

### Expressing Origin with SER
We use **ser + de + country** to talk about origin:
- *¿De dónde eres?* - Where are you from?
- *Soy de España.* - I am from Spain.
- *Soy de los Estados Unidos.* - I am from the United States.

### Nationalities (Adjectives)
Nationalities are adjectives, so they must match the gender of the person:
- **Español** (Spanish - masculine) / **Española** (Spanish - feminine)
- **Mexicano** (Mexican - masculine) / **Mexicana** (Mexican - feminine)
- **Estadounidense** (American - gender neutral)
- **Francés** (French - masculine) / **Francesa** (French - feminine)`
    },
    quiz: {
      title: "Origin & Nationalities Evaluation",
      questions: [
        {
          text: "How do you translate 'Where are you from?'",
          a: "¿Cómo estás?", b: "¿De dónde eres?", c: "¿Qué hora es?", d: "¿Dónde vives?",
          correct: "B"
        },
        {
          text: "Which combination is grammatically correct for a feminine speaker?",
          a: "Soy de francés", b: "Soy francesa", c: "Soy francés", d: "Soy de mexicana",
          correct: "B"
        },
        {
          text: "What does 'Soy de España' mean?",
          a: "I speak Spanish.", b: "I want to visit Spain.", c: "I am from Spain.", d: "I live in Spain.",
          correct: "C"
        }
      ]
    }
  },
  {
    name: "Saludar y despedirse",
    description: "Master greetings, introductions, polite expressions, and farewell conversations.",
    category: "Conversation",
    duration: "~20 Mins",
    icon: "bi-chat-dots",
    note: {
      title: "Greetings, Farewells & Social Etiquette",
      content: `Master conversational etiquette and polite cues.

### Greetings (Saludos)
- **¡Hola!** - Hello!
- **Buenos días** - Good morning (used until noon)
- **Buenas tardes** - Good afternoon (used from noon to sunset)
- **Buenas noches** - Good evening / Good night

### Asking 'How are you?'
- *¿Cómo estás?* - How are you? (Informal)
- *¿Qué tal?* - What's up? / How's it going?
- *Estoy bien, gracias.* - I am doing well, thank you.

### Farewells (Despedidas)
- **Adiós** - Goodbye
- **Hasta luego** - See you later
- **Hasta mañana** - See you tomorrow
- **Nos vemos** - See you / We'll see each other`
    },
    quiz: {
      title: "Greetings & Farewells Quiz",
      questions: [
        {
          text: "What greeting is appropriate at 3:00 PM?",
          a: "Buenos días", b: "Buenas tardes", c: "Buenas noches", d: "Hasta luego",
          correct: "B"
        },
        {
          text: "How do you say 'See you tomorrow' in Spanish?",
          a: "Hasta luego", b: "Adiós", c: "Hasta mañana", d: "Hola",
          correct: "C"
        },
        {
          text: "What is the meaning of '¿Cómo estás?'?",
          a: "What is your name?", b: "Where are you from?", c: "How are you?", d: "What time is it?",
          correct: "C"
        }
      ]
    }
  },
  {
    name: "El verbo SER en presente de indicativo",
    description: "Learn the present tense conjugation and practical usage of the verb SER.",
    category: "Grammar",
    duration: "~20 Mins",
    icon: "bi-activity",
    note: {
      title: "The Verb SER (To Be)",
      content: `In Spanish, there are two verbs that mean "to be": **SER** and **ESTAR**. In this module, we focus on **SER**, which is used for permanent or inherent characteristics.

### Present Tense Conjugation of SER
- **Yo** *soy* (I am)
- **Tú** *eres* (You are - informal)
- **Él / Ella / Usted** *es* (He / She / You - formal)
- **Nosotros / Nosotras** *somos* (We are)
- **Ellos / Ellas / Ustedes** *son* (They / You all are)

### Key Uses of SER (DOCOPT)
1. **Description**: *Ella es alta.* (She is tall.)
2. **Occupation**: *Somos estudiantes.* (We are students.)
3. **Characteristics**: *El libro es interesante.* (The book is interesting.)
4. **Origin**: *Eres de Argentina.* (You are from Argentina.)
5. **Possession**: *El lápiz es de Juan.* (The pencil is Juan's.)
6. **Time / Date**: *Hoy es lunes.* (Today is Monday.)`
    },
    quiz: {
      title: "Verb SER Conjugation Evaluation",
      questions: [
        {
          text: "Conjugate SER for the subject 'Nosotros':",
          a: "eres", b: "es", c: "somos", d: "son",
          correct: "C"
        },
        {
          text: "Complete: 'Ellas ________ estudiantes de español.'",
          a: "soy", b: "son", c: "es", d: "somos",
          correct: "B"
        },
        {
          text: "Which of the following is a correct usage category of the verb SER?",
          a: "Temporary mood", b: "Physical location", c: "Origin or nationality", d: "Current actions",
          correct: "C"
        }
      ]
    }
  },
  {
    name: "La profesión",
    description: "Explore vocabulary for professions, careers, and occupations.",
    category: "Vocabulary",
    duration: "~20 Mins",
    icon: "bi-briefcase",
    note: {
      title: "Professions and Occupations",
      content: `Learn to talk about jobs, industries, and what you do for a living!

### Common Professions (Las Profesiones)
- **El médico / La médica** (The doctor)
- **El profesor / La profesora** (The teacher)
- **El ingeniero / La ingeniera** (The engineer)
- **El abogado / La abogada** (The lawyer)
- **El enfermero / La enfermera** (The nurse)
- **El estudiante / La estudiante** (The student)
- **El camarero / La camarera** (The waiter / waitress)
- **El cocinero / La cocinera** (The chef / cook)

### Talking About Work
- *¿A qué te dedicas?* - What do you do for a living? (Informal)
- *Soy ingeniero.* - I am an engineer.
  - **Grammar Tip**: Do NOT use the indefinite articles *un/una* when stating your profession, unless it is modified by an adjective (e.g. *Soy un ingeniero talentoso*).`
    },
    quiz: {
      title: "Professions Vocabulary Quiz",
      questions: [
        {
          text: "Translate 'The lawyer' (feminine) into Spanish:",
          a: "el abogado", b: "la abogada", c: "la médica", d: "la profesora",
          correct: "B"
        },
        {
          text: "What does 'camarero' mean?",
          a: "Chef", b: "Nurse", c: "Waiter", d: "Doctor",
          correct: "C"
        },
        {
          text: "Which sentence is grammatically correct for stating 'I am a doctor' (masculine)?",
          a: "Soy un médico.", b: "Soy médico.", c: "Soy el médico.", d: "Tengo médico.",
          correct: "B"
        }
      ]
    }
  },
  {
    name: "Grammar",
    description: "Comprehensive Spanish grammar module covering regular/irregular verbs, adjectives, pronouns, sentence structures, tenses, prepositions, reflexive verbs, and advanced grammar patterns.",
    category: "Grammar",
    duration: "~20 Mins",
    icon: "bi-journal-code",
    subtopics: ["Los verbos (regulares)", "El verbo TENER (irregular)", "Los adjetivos", "Los demostrativos", "Los adjetivos posesivos", "SER vs ESTAR", "Los interrogativos", "Los verbos pronominales", "MUY vs MUCHO", "Los indefinidos", "Las preposicionales", "Los verbos irregulares", "Los verbos que solo cambian en “YO”", "SABER vs CONOCER", "El presente contínuo [Estar + Gerundio]", "Las perífrasis verbales", "Los verbos reflexivos"],
    note: {
      title: "Spanish Grammar Foundations",
      content: `Unlock regular verb conjugations and basic adjective rules in Spanish.

### Conjugating Regular Verbs in Present Tense
Spanish verbs end in **-ar**, **-er**, or **-ir**. Remove this suffix and append:

| Subject | -ar (e.g. Hablar) | -er (e.g. Comer) | -ir (e.g. Vivir) |
|---|---|---|---|
| **Yo** | -o (*hablo*) | -o (*como*) | -o (*vivo*) |
| **Tú** | -as (*hablas*) | -es (*comes*) | -es (*vives*) |
| **Él/Ella/Ud.** | -a (*habla*) | -e (*come*) | -e (*vive*) |
| **Nosotros** | -amos (*hablamos*) | -emos (*comemos*) | -imos (*vivimos*) |
| **Ellos/Uds.** | -an (*hablan*) | -en (*comen*) | -en (*viven*) |

### Adjective Agreement
Adjectives must agree in gender and number with the nouns they modify:
- *El libro rojo* (The red book)
- *La casa roja* (The red house)
- *Los libros rojos* (The red books)
- *Las casas rojas* (The red houses)`
    },
    quiz: {
      title: "Comprehensive Grammar Assessment",
      questions: [
        {
          text: "Conjugate the verb 'vivir' (to live) for 'Nosotros':",
          a: "vivimos", b: "vivemos", c: "viven", d: "vivo",
          correct: "A"
        },
        {
          text: "What is the correct translation of 'the white tables' (tables is 'mesas' - feminine plural)?",
          a: "las mesas blancos", b: "las mesas blancas", c: "los mesas blancos", d: "unas mesas blanco",
          correct: "B"
        },
        {
          text: "How is the verb 'comer' conjugated for 'Tú'?",
          a: "como", b: "comes", c: "comen", d: "come",
          correct: "B"
        }
      ]
    }
  },
  {
    name: "Los días de la semana",
    description: "Learn the days of the week and how to use them naturally in conversation.",
    category: "Vocabulary",
    duration: "~20 Mins",
    icon: "bi-calendar-week",
    note: {
      title: "Days of the Week in Spanish",
      content: `Knowing the days of the week is essential for making appointments and planning trip itineraries!

### The Days of the Week (Los Días de la Semana)
- **lunes** (Monday)
- **martes** (Tuesday)
- **miércoles** (Wednesday)
- **jueves** (Thursday)
- **viernes** (Friday)
- **sábado** (Saturday)
- **domingo** (Sunday)

### Grammar Guidelines:
1. Days of the week are **always masculine** and use *el* (singular) or *los* (plural): *el lunes*, *los sábados*.
2. They are **not capitalized** unless they start a sentence.
3. To say "on Monday", use "el": *Tengo clase el lunes.* (I have class on Monday.)`
    },
    quiz: {
      title: "Days of the Week Quiz",
      questions: [
        {
          text: "What is the Spanish word for Friday?",
          a: "martes", b: "jueves", c: "viernes", d: "domingo",
          correct: "C"
        },
        {
          text: "How do you say 'on Saturdays' in Spanish?",
          a: "en sábados", b: "el sábado", c: "los sábados", d: "de sábados",
          correct: "C"
        },
        {
          text: "Which day comes directly after 'miércoles'?",
          a: "martes", b: "jueves", c: "lunes", d: "viernes",
          correct: "B"
        }
      ]
    }
  },
  {
    name: "Los colores",
    description: "Practice colors, descriptive vocabulary, and visual expression in Spanish.",
    category: "Vocabulary",
    duration: "~20 Mins",
    icon: "bi-palette",
    note: {
      title: "Spanish Colors and Adjectives",
      content: `Let's color your Spanish vocabulary! Colors are adjectives and change form according to gender and number.

### Main Colors (Los Colores)
- **Rojo / Roja** (Red)
- **Amarillo / Amarilla** (Yellow)
- **Blanco / Blanca** (White)
- **Negro / Negra** (Black)
- **Azul** (Blue - plural is *azules*)
- **Verde** (Green - plural is *verdes*)
- **Marrón** (Brown - plural is *marrones*)
- **Gris** (Grey - plural is *grises*)
- **Naranja** (Orange)
- **Rosa** (Pink)`
    },
    quiz: {
      title: "Spanish Colors Quiz",
      questions: [
        {
          text: "What is the feminine plural of 'rojo'?",
          a: "rojos", b: "rojas", c: "roja", d: "rojoes",
          correct: "B"
        },
        {
          text: "What color is 'azul'?",
          a: "Red", b: "Yellow", c: "Blue", d: "Green",
          correct: "C"
        },
        {
          text: "How do you make the color 'gris' plural?",
          a: "grises", b: "gris", c: "griss", d: "griseses",
          correct: "A"
        }
      ]
    }
  },
  {
    name: "Vocabularios de la casa",
    description: "Learn household vocabulary including rooms, furniture, and home-related objects.",
    category: "Vocabulary",
    duration: "~20 Mins",
    icon: "bi-house",
    note: {
      title: "Rooms & Furniture Vocabulary",
      content: `Navigate the home and talk about where you live!

### Rooms of the House (Las Habitaciones)
- **La casa** (The house)
- **La cocina** (The kitchen)
- **El salón / La sala de estar** (The living room)
- **El dormitorio / La habitación** (The bedroom)
- **El cuarto de baño** (The bathroom)
- **El jardín** (The garden / yard)

### Major Furniture (Los Muebles)
- **La cama** (The bed)
- **La mesa** (The table)
- **La silla** (The chair)
- **El sofá** (The sofa)
- **La lámpara** (The lamp)`
    },
    quiz: {
      title: "Household Vocabulary Quiz",
      questions: [
        {
          text: "Where do you cook food in a Spanish home?",
          a: "el dormitorio", b: "la cocina", c: "el baño", d: "el jardín",
          correct: "B"
        },
        {
          text: "What does 'la cama' represent?",
          a: "The table", b: "The chair", c: "The bed", d: "The door",
          correct: "C"
        },
        {
          text: "Translate 'living room' to Spanish:",
          a: "el salón", b: "la cocina", c: "el baño", d: "el jardín",
          correct: "A"
        }
      ]
    }
  },
  {
    name: "Las emociones",
    description: "Express emotions, feelings, moods, and emotional states naturally in Spanish.",
    category: "Vocabulary",
    duration: "~20 Mins",
    icon: "bi-emoji-smile",
    note: {
      title: "Expressing Emotions with ESTAR",
      content: `Emotions and feelings are temporary, so they are expressed using the verb **ESTAR** (to be) instead of **SER**.

### Conjugation of ESTAR (Present)
- **Yo** *estoy*
- **Tú** *estás*
- **Él / Ella / Ud.** *está*
- **Nosotros** *estamos*
- **Ellos / Ellas / Uds.** *están*

### Emotional States (Vocabulary)
Since they are adjectives, they change gender based on who is feeling them!
- **Feliz / Felices** (Happy)
- **Triste / Tristes** (Sad)
- **Cansado / Cansada** (Tired)
- **Enojado / Enojada** or **Enfadado / Enfadada** (Angry)
- **Preocupado / Preocupada** (Worried)
- **Aburrido / Aburrida** (Bored)`
    },
    quiz: {
      title: "Emotions & Feelings Quiz",
      questions: [
        {
          text: "If a girl is tired, what does she say?",
          a: "Estoy cansado.", b: "Estoy cansada.", c: "Soy cansada.", d: "Soy cansado.",
          correct: "B"
        },
        {
          text: "Complete: 'Nosotros ________ preocupados por el examen.'",
          a: "somos", b: "estamos", c: "está", d: "están",
          correct: "B"
        },
        {
          text: "What does 'aburrido' mean?",
          a: "Excited", b: "Bored", c: "Angry", d: "Happy",
          correct: "B"
        }
      ]
    }
  },
  {
    name: "Las direcciones",
    description: "Learn how to ask and give directions, navigate places, and communicate location-based instructions.",
    category: "Conversation",
    duration: "~20 Mins",
    icon: "bi-compass",
    note: {
      title: "Asking for & Giving Directions",
      content: `Navigate travel locations, ask for coordinates, and understand directions.

### Asking for Directions
- *¿Dónde está la estación de tren?* - Where is the train station?
- *¿Cómo llego al hotel?* - How do I get to the hotel?
- *Disculpe, ¿hay un banco cerca?* - Excuse me, is there a bank nearby?

### Giving Instructions
- **Todo recto** - Straight ahead
- **Gira a la derecha** - Turn right
- **Gira a la izquierda** - Turn left
- **Cruza la calle** - Cross the street`
    },
    quiz: {
      title: "Directions & Travel Navigation Quiz",
      questions: [
        {
          text: "What does 'todo recto' mean?",
          a: "Turn left", b: "Straight ahead", c: "Stop here", d: "Turn right",
          correct: "B"
        },
        {
          text: "How do you ask 'Where is the train station?'",
          a: "¿Cómo estás?", b: "¿Dónde está la estación de tren?", c: "Quiero ir al cine", d: "Cruza la calle",
          correct: "B"
        },
        {
          text: "Which word means 'Right' in directional vocabulary?",
          a: "Izquierda", b: "Todo recto", c: "Derecha", d: "Cerca",
          correct: "C"
        }
      ]
    }
  },
  {
    name: "Expresar la hora",
    description: "Master telling time, asking time-related questions, and using time expressions.",
    category: "Conversation",
    duration: "~20 Mins",
    icon: "bi-clock",
    note: {
      title: "Telling Time in Spanish",
      content: `Learn to tell time, schedule events, and ask "What time is it?"

### Asking for Time
- *¿Qué hora es?* - What time is it?

### Telling Time (Rules)
- For 1:00, use **Es la**: *Es la una.* (It is one o'clock.)
- For any other hour, use **Son las**: *Son las dos*, *Son las tres*, etc.
- To add minutes, use "y": *Son las cuatro y diez.* (It is 4:10.)
- For half-hour, use "y media": *Es la una y media.* (It is 1:30.)
- For quarter-hour, use "y cuarto": *Son las tres y cuarto.* (It is 3:15.)
- For subtraction, use "menos": *Son las cinco menos diez.* (It is ten to five / 4:50.)`
    },
    quiz: {
      title: "Telling Time Evaluation",
      questions: [
        {
          text: "How do you say 'It is 1:00' in Spanish?",
          a: "Son las una.", b: "Es la una.", c: "Es las dos.", d: "Son las una y media.",
          correct: "B"
        },
        {
          text: "Translate 'It is 3:30':",
          a: "Son las tres y media.", b: "Es la una y media.", c: "Son las tres menos cuarto.", d: "Son las cuatro y cuarto.",
          correct: "A"
        },
        {
          text: "What does 'Son las cinco menos cuarto' mean?",
          a: "It is 5:15", b: "It is 4:45", c: "It is 5:30", d: "It is 4:15",
          correct: "B"
        }
      ]
    }
  },
  {
    name: "Los meses del año",
    description: "Learn months, dates, seasons, and calendar-related vocabulary.",
    category: "Vocabulary",
    duration: "~20 Mins",
    icon: "bi-calendar2-range",
    note: {
      title: "Months, Dates & Calendars",
      content: `Master dates, years, and months of the year in Spanish.

### Months of the Year (Los Meses del Año)
- **enero** (January)
- **febrero** (February)
- **marzo** (March)
- **abril** (April)
- **mayo** (May)
- **junio** (June)
- **julio** (July)
- **agosto** (August)
- **septiembre** (September)
- **octubre** (October)
- **noviembre** (November)
- **diciembre** (December)

### Stating Dates
We use the pattern: **el + [number] + de + [month]**
- *el cinco de mayo* - May 5th.
- *el primero de enero* - January 1st (For the first of the month, "primero" is preferred).`
    },
    quiz: {
      title: "Months and Dates Assessment",
      questions: [
        {
          text: "Translate 'December' to Spanish:",
          a: "noviembre", b: "enero", c: "diciembre", d: "febrero",
          correct: "C"
        },
        {
          text: "How do you say 'May 5th' in Spanish?",
          a: "el cinco mayo", b: "el cinco de mayo", c: "en cinco de mayo", d: "cinco de mayo",
          correct: "B"
        },
        {
          text: "What is 'January' in Spanish?",
          a: "enero", b: "febrero", c: "marzo", d: "abril",
          correct: "A"
        }
      ]
    }
  },
  {
    name: "Vocabularios de la familia",
    description: "Practice family relationships, family vocabulary, and relationship expressions.",
    category: "Vocabulary",
    duration: "~20 Mins",
    icon: "bi-people",
    note: {
      title: "Family Tree Vocabulary",
      content: `Describe family ties and close relationships.

### Family Members (Los Miembros de la Familia)
- **El padre** (The father) / **La madre** (The mother)
- **El hijo** (The son) / **La hija** (The daughter)
- **El hermano** (The brother) / **La hermana** (The sister)
- **El abuelo** (The grandfather) / **La abuela** (The grandmother)
- **El tío** (The uncle) / **La tía** (The aunt)
- **El primo** (The cousin - male) / **La prima** (The cousin - female)
- **Los padres** (The parents / fathers)
- **Los hermanos** (The siblings / brothers)`
    },
    quiz: {
      title: "Family Relationships Quiz",
      questions: [
        {
          text: "What is your father's sister to you?",
          a: "la abuela", b: "la tía", c: "la hermana", d: "la prima",
          correct: "B"
        },
        {
          text: "What does 'el hermano' mean?",
          a: "The son", b: "The brother", c: "The uncle", d: "The grandfather",
          correct: "B"
        },
        {
          text: "Translate 'daughter' to Spanish:",
          a: "el hijo", b: "la hija", c: "la hermana", d: "la madre",
          correct: "B"
        }
      ]
    }
  },
  {
    name: "El clima y la estación",
    description: "Learn weather vocabulary, climate expressions, and seasons in Spanish.",
    category: "Vocabulary",
    duration: "~20 Mins",
    icon: "bi-cloud-sun",
    note: {
      title: "Seasons & Weather Expressions",
      content: `Talking about weather in Spanish usually uses the verb **HACER** (to make / do) or **HABER** (there is/are) rather than "to be"!

### Weather Expressions with HACER
- **Hace calor** - It is hot.
- **Hace frío** - It is cold.
- **Hace sol** - It is sunny.
- **Hace buen tiempo** - The weather is good.
- **Hace viento** - It is windy.

### Other Weather Expressions
- **Llueve** - It rains.
- **Nieva** - It snows.
- **Hay niebla** - It is foggy.

### The Four Seasons (Las Cuatro Estaciones)
- **La primavera** (Spring)
- **El verano** (Summer)
- **El otoño** (Autumn / Fall)
- **El invierno** (Winter)`
    },
    quiz: {
      title: "Weather & Seasons Quiz",
      questions: [
        {
          text: "How do you say 'It is hot' in Spanish?",
          a: "Hace frío.", b: "Hace calor.", c: "Está sol.", d: "Es calor.",
          correct: "B"
        },
        {
          text: "Which word represents 'Winter'?",
          a: "la primavera", b: "el verano", c: "el invierno", d: "el otoño",
          correct: "C"
        },
        {
          text: "What does 'llueve' mean?",
          a: "It snows", b: "It rains", c: "It is windy", d: "It is sunny",
          correct: "B"
        }
      ]
    }
  },
  {
    name: "Los vocabularios de la geografía",
    description: "Explore geography-related vocabulary including landscapes, directions, and natural features.",
    category: "Vocabulary",
    duration: "~20 Mins",
    icon: "bi-map",
    note: {
      title: "Geography & Nature Vocabulary",
      content: `Describe locations, travel spots, and geographical structures!

### Key Landscapes (La Geografía)
- **La montaña** (The mountain)
- **El río** (The river)
- **El lago** (The lake)
- **El mar** (The sea)
- **La playa** (The beach)
- **El bosque** (The forest)
- **La ciudad** (The city)
- **El campo** (The countryside / field)`
    },
    quiz: {
      title: "Geography Vocabulary Quiz",
      questions: [
        {
          text: "What is 'the beach' in Spanish?",
          a: "la playa", b: "la montaña", c: "el río", d: "el mar",
          correct: "A"
        },
        {
          text: "What geographical feature is 'río'?",
          a: "Lake", b: "Mountain", c: "River", d: "Sea",
          correct: "C"
        },
        {
          text: "How do you translate 'The mountain'?",
          a: "el lago", b: "la montaña", c: "el bosque", d: "la ciudad",
          correct: "B"
        }
      ]
    }
  }
];

async function run() {
  try {
    console.log("Connecting database to seed Spanish curriculum...");
    await db.initDb();
    console.log("Database initialized. System:", db.getDbType());

    // 1. First, clear all topics for Spanish (language_id = 4)
    // We already ran a manual clean, but let's make sure it's fully clean.
    console.log("Clearing existing Spanish topics...");
    await db.query("DELETE FROM Topics WHERE language_id = 4");

    // 2. Loop through our 20 modules and insert them cleanly
    for (let i = 0; i < modulesData.length; i++) {
      const m = modulesData[i];
      console.log(`[Seed] Inserting Spanish Topic ${i+1}/20: "${m.name}"...`);

      // A. Insert Topic
      const [topicRes] = await db.query(
        "INSERT INTO Topics (language_id, topic_name, topic_description) VALUES (?, ?, ?)",
        [4, m.name, m.description]
      );
      const topicId = topicRes.insertId;

      // B. Insert Notes
      if (m.note) {
        await db.query(
          "INSERT INTO Notes (topic_id, title, content) VALUES (?, ?, ?)",
          [topicId, m.note.title, m.note.content]
        );
      }

      // C. Insert Quiz
      if (m.quiz) {
        const [quizRes] = await db.query(
          "INSERT INTO Quizzes (topic_id, quiz_title, total_marks) VALUES (?, ?, ?)",
          [topicId, m.quiz.title, m.quiz.questions.length]
        );
        const quizId = quizRes.insertId;

        // D. Insert Questions
        for (const q of m.quiz.questions) {
          await db.query(
            "INSERT INTO Qs (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [quizId, q.text, q.a, q.b, q.c, q.d, q.correct]
          );
        }
      }
    }

    console.log("=============================================================");
    console.log("  Successfully seeded 20 Spanish curriculum modules!        ");
    console.log("  Added Topics, detailed study Notes, Quizzes, & Questions. ");
    console.log("=============================================================");
    
    // Explicit SQLite syncing check - if MySQL is not active, SQLite direct seeding will also run.
    const dbPath = path.join(__dirname, 'database.sqlite');
    console.log("Attempting direct SQLite sync if database.sqlite is present...");
    await new Promise((resolve) => {
      try {
        const sqliteDb = new sqlite3.Database(dbPath, (err) => {
          if (err) {
            console.log("SQLite DB close/skip error:", err.message);
            return resolve();
          }
        });
        sqliteDb.run('PRAGMA foreign_keys = ON;');
        sqliteDb.serialize(() => {
          // Clear SQLite Spanish entries directly to keep it in sync
          sqliteDb.run("DELETE FROM Topics WHERE language_id = 4", [], (err) => {
            if (err) {
              console.log("SQLite clear skip.");
              sqliteDb.close();
              return resolve();
            }
            
            let pendingTopics = modulesData.length;
            if (pendingTopics === 0) {
              sqliteDb.close();
              return resolve();
            }

            // Seed SQLite Spanish entries
            modulesData.forEach((m) => {
              sqliteDb.run("INSERT INTO Topics (language_id, topic_name, topic_description) VALUES (?, ?, ?)", [4, m.name, m.description], function(err) {
                if (err) {
                  pendingTopics--;
                  if (pendingTopics === 0) {
                    sqliteDb.close();
                    resolve();
                  }
                  return;
                }
                const topicId = this.lastID;
                
                // Track remaining queries to serialize closing the db
                let queriesCount = 0;
                if (m.note) queriesCount++;
                if (m.quiz) queriesCount++;

                const checkDone = () => {
                  queriesCount--;
                  if (queriesCount <= 0) {
                    pendingTopics--;
                    if (pendingTopics === 0) {
                      console.log("Direct SQLite sync seed complete.");
                      sqliteDb.close();
                      resolve();
                    }
                  }
                };

                if (queriesCount === 0) {
                  pendingTopics--;
                  if (pendingTopics === 0) {
                    console.log("Direct SQLite sync seed complete.");
                    sqliteDb.close();
                    resolve();
                  }
                  return;
                }

                if (m.note) {
                  sqliteDb.run("INSERT INTO Notes (topic_id, title, content) VALUES (?, ?, ?)", [topicId, m.note.title, m.note.content], () => {
                    checkDone();
                  });
                }
                
                if (m.quiz) {
                  sqliteDb.run("INSERT INTO Quizzes (topic_id, quiz_title, total_marks) VALUES (?, ?, ?)", [topicId, m.quiz.title, m.quiz.questions.length], function(err) {
                    if (err) {
                      checkDone();
                      return;
                    }
                    const quizId = this.lastID;
                    let pendingQs = m.quiz.questions.length;
                    
                    if (pendingQs === 0) {
                      checkDone();
                      return;
                    }

                    m.quiz.questions.forEach((q) => {
                      sqliteDb.run("INSERT INTO Qs (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES (?, ?, ?, ?, ?, ?, ?)",
                        [quizId, q.text, q.a, q.b, q.c, q.d, q.correct], () => {
                          pendingQs--;
                          if (pendingQs === 0) {
                            checkDone();
                          }
                        });
                    });
                  });
                }
              });
            });
          });
        });
      } catch (e) {
        console.log("Direct SQLite skip (not running locally or file absent):", e.message);
        resolve();
      }
    });

    process.exit(0);
  } catch (error) {
    console.error("Database seeding failure:", error);
    process.exit(1);
  }
}

run();
