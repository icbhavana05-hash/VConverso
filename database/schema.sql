-- Language Learning Management System Schema
-- Designed for MySQL

CREATE DATABASE IF NOT EXISTS language_learning_db;
USE language_learning_db;

-- 1. User Table
CREATE TABLE IF NOT EXISTS User (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Language Table
CREATE TABLE IF NOT EXISTS Language (
    language_id INT PRIMARY KEY AUTO_INCREMENT,
    language_name VARCHAR(100) NOT NULL,
    language_image VARCHAR(255) NOT NULL,
    description TEXT
);

-- 3. Topics Table
CREATE TABLE IF NOT EXISTS Topics (
    topic_id INT PRIMARY KEY AUTO_INCREMENT,
    language_id INT NOT NULL,
    topic_name VARCHAR(100) NOT NULL,
    topic_description TEXT,
    FOREIGN KEY (language_id) REFERENCES Language(language_id) ON DELETE CASCADE
);

-- 4. Notes Table
CREATE TABLE IF NOT EXISTS Notes (
    note_id INT PRIMARY KEY AUTO_INCREMENT,
    topic_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (topic_id) REFERENCES Topics(topic_id) ON DELETE CASCADE
);

-- 5. Quizzes Table
CREATE TABLE IF NOT EXISTS Quizzes (
    quiz_id INT PRIMARY KEY AUTO_INCREMENT,
    topic_id INT NOT NULL,
    quiz_title VARCHAR(255) NOT NULL,
    total_marks INT NOT NULL,
    FOREIGN KEY (topic_id) REFERENCES Topics(topic_id) ON DELETE CASCADE
);

-- 6. Questions (Qs) Table
CREATE TABLE IF NOT EXISTS Qs (
    question_id INT PRIMARY KEY AUTO_INCREMENT,
    quiz_id INT NOT NULL,
    question_text TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_answer VARCHAR(10) NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES Quizzes(quiz_id) ON DELETE CASCADE
);

-- 7. Answers Table
CREATE TABLE IF NOT EXISTS Answers (
    answer_id INT PRIMARY KEY AUTO_INCREMENT,
    question_id INT NOT NULL,
    user_id INT NOT NULL,
    selected_answer VARCHAR(10) NOT NULL,
    FOREIGN KEY (question_id) REFERENCES Qs(question_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- 8. Attempts Table
CREATE TABLE IF NOT EXISTS Attempts (
    attempt_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    quiz_id INT NOT NULL,
    attempt_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    score INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES Quizzes(quiz_id) ON DELETE CASCADE
);

-- 9. Scores Table
CREATE TABLE IF NOT EXISTS Scores (
    score_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    language_id INT NOT NULL,
    total_score INT DEFAULT 0,
    progress_percentage FLOAT DEFAULT 0.0,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (language_id) REFERENCES Language(language_id) ON DELETE CASCADE,
    UNIQUE KEY user_language (user_id, language_id)
);

-- --------------------------------------------------------
-- SAMPLE DATA INSERTION
-- --------------------------------------------------------

-- Inserting Languages
INSERT INTO Language (language_id, language_name, language_image, description) VALUES
(1, 'English', 'english.jpg', 'Master English grammar, common idioms, conversational skills, and formal business communication tools.'),
(2, 'French', 'french.jpg', 'Discover the romantic language of French. Learn key pronunciations, basic tenses, and fluent daily greetings.'),
(3, 'German', 'german.jpg', 'Explore the structured beauty of the German language. Study cases, word order, gender patterns, and vocabulary.'),
(4, 'Spanish', 'spanish.jpg', 'Immerse yourself in Spanish. Master essential present/past tense verb conjugations, and everyday travel expressions.');

-- Inserting Topics for English (Language 1)
INSERT INTO Topics (topic_id, language_id, topic_name, topic_description) VALUES
(1, 1, 'Tenses & Verb Aspects', 'Understand Past, Present, and Future tenses, including simple, continuous, perfect, and perfect continuous forms.'),
(2, 1, 'Conversational English', 'Learn vital idioms, polite requests, active listening cues, and casual phrases for daily dialogue.');

-- Notes for English Topics
INSERT INTO Notes (note_id, topic_id, title, content) VALUES
(1, 1, 'Introduction to English Tenses', 'English tenses are split into three main timelines: Past, Present, and Future. Each timeline has four aspects: Simple, Continuous (Progressive), Perfect, and Perfect Continuous. Understating these is crucial for accurate sentence construction.\n\n1. **Present Simple**: Used for habits, facts, and routines. \n   *Example*: "She teaches English daily."\n\n2. **Present Continuous**: Used for actions happening right now.\n   *Example*: "He is writing a letter."\n\n3. **Present Perfect**: Connects past actions to the present. Uses "has/have" + third form of the verb.\n   *Example*: "I have finished my lessons."\n\n4. **Past Simple**: Completed actions in the past.\n   *Example*: "We visited Paris last summer."'),
(2, 2, 'Polite Expressions and Idioms', 'Politeness is a cornerstone of conversational English. Standard modal verbs like "could", "would", and "may" soften requests.\n\n* **Making Requests**:\n  - Instead of "Give me that water," say: "Could you please pass the water?" or "Would you mind passing the water?"\n  - Instead of "I want a coffee," say: "I would like to order a coffee, please."\n\n* **Essential Idioms**:\n  - **"Bite the bullet"**: To face a difficult situation with courage.\n  - **"Break a leg"**: A friendly way to wish someone good luck before a performance.\n  - **"Under the weather"**: Feeling slightly sick or tired.');

-- Quizzes for English Topics
INSERT INTO Quizzes (quiz_id, topic_id, quiz_title, total_marks) VALUES
(1, 1, 'English Verb Tenses Quiz', 3),
(2, 2, 'Polite Expressions & Idioms Quiz', 3);

-- Questions for English Quizzes
INSERT INTO Qs (question_id, quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES
(1, 1, 'Which sentence is in the Present Perfect tense?', 'I went to the store.', 'I have gone to the store.', 'I am going to the store.', 'I will go to the store.', 'B'),
(2, 1, 'Identify the correct form: "By this time tomorrow, she ______ her exam."', 'will finish', 'has finished', 'will have finished', 'finishes', 'C'),
(3, 1, 'What tense is used in: "She walks to school every morning"?', 'Present Simple', 'Present Continuous', 'Past Simple', 'Future Simple', 'A'),
(4, 2, 'What does the idiom "under the weather" mean?', 'Enjoying a sunny day', 'Feeling sick or unwell', 'Experiencing heavy rain', 'Being angry at someone', 'B'),
(5, 2, 'Which of the following is the most polite way to request a glass of water?', 'Give me water.', 'I want water now.', 'Could you please pass a glass of water?', 'Water, please.', 'C'),
(6, 2, 'What is the meaning of "bite the bullet"?', 'To eat something hard', 'To face a difficult situation courageously', 'To make a bad decision', 'To start an argument', 'B');


-- Inserting Topics for French (Language 2)
INSERT INTO Topics (topic_id, language_id, topic_name, topic_description) VALUES
(3, 2, 'Nouns & Articles', 'Understand French gender classification (masculine/feminine) and definite, indefinite, and partitive articles.'),
(4, 2, 'Basic Greetings & Everyday Vocabulary', 'Master essential phrases to greet, thank, and communicate politely in social settings.');

-- Notes for French Topics
INSERT INTO Notes (note_id, topic_id, title, content) VALUES
(3, 3, 'French Nouns, Genders, and Articles', 'Every noun in French is either **masculine** or **feminine**. There are no neutral nouns. The article you use must match the gender and number of the noun.\n\n### Indefinite Articles (A / An / Some)\n- **un**: used for masculine singular nouns (e.g., *un livre* - a book)\n- **une**: used for feminine singular nouns (e.g., *une table* - a table)\n- **des**: used for plural nouns, regardless of gender (e.g., *des livres* - some books, *des tables* - some tables)\n\n### Definite Articles (The)\n- **le**: masculine singular (e.g., *le stylo* - the pen)\n- **la**: feminine singular (e.g., *la chaise* - the chair)\n- **l''**: used before singular nouns starting with a vowel or silent ''h'' (e.g., *l''école* - the school, *l''homme* - the man)\n- **les**: plural (e.g., *les stylos*, *les chaises*)'),
(4, 4, 'Essential Greetings and Polite Expressions', 'Greetings are highly valued in French culture. Entering a shop or meeting someone requires a friendly greeting.\n\n### Primary Greetings\n- **Bonjour**: Good morning / Hello (Standard, polite)\n- **Salut**: Hi / Bye (Informal, used with friends)\n- **Bonsoir**: Good evening\n- **Au revoir**: Goodbye\n\n### Politeness & Questions\n- **S''il vous plaît**: Please (polite/formal)\n- **S''il te plaît**: Please (informal)\n- **Merci**: Thank you\n- **De rien**: You''re welcome\n- **Comment ça va?** or **Ça va?**: How is it going?\n  - *Response*: **Ça va bien, merci !** (It is going well, thank you!)');

-- Quizzes for French Topics
INSERT INTO Quizzes (quiz_id, topic_id, quiz_title, total_marks) VALUES
(3, 3, 'French Articles & Nouns Quiz', 3),
(4, 4, 'French Greetings & Vocab Quiz', 3);

-- Questions for French Quizzes
INSERT INTO Qs (question_id, quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES
(7, 3, 'Which indefinite article matches a feminine singular noun?', 'un', 'une', 'des', 'le', 'B'),
(8, 3, 'What is the correct definite article for "école" (school, feminine singular)?', 'le', 'la', 'l''', 'les', 'C'),
(9, 3, 'Translate "the books" (livres is masculine plural) into French:', 'le livre', 'la livre', 'les livres', 'des livres', 'C'),
(10, 4, 'How do you say "Thank you very much" in French?', 'S''il vous plaît', 'De rien', 'Merci beaucoup', 'Bonjour', 'C'),
(11, 4, 'What is the standard, polite way to say "Please" in French?', 'Salut', 'S''il te plaît', 'S''il vous plaît', 'Au revoir', 'C'),
(12, 4, 'Which phrase means "How is it going?" or "How are you?" in French?', 'Ça va ?', 'Bonsoir', 'De rien', 'Merci', 'A');


-- Inserting Topics for German (Language 3)
INSERT INTO Topics (topic_id, language_id, topic_name, topic_description) VALUES
(5, 3, 'German Genders & Cases', 'Learn the three German grammatical genders (masculine, feminine, neuter) and the nominative and accusative cases.'),
(6, 3, 'Survival German Phrases', 'Key phrases for ordering food, finding directions, and meeting locals in Germany.');

-- Notes for German Topics
INSERT INTO Notes (note_id, topic_id, title, content) VALUES
(5, 5, 'German Genders (der, die, das) & Accusative Case', 'Unlike English, German has three grammatical genders: Masculine, Feminine, and Neuter. Additionally, articles change based on their role in the sentence (called **cases**).\n\n### Grammatical Genders (Nominative Case - Subject)\n1. **der**: Masculine (e.g., *der Mann* - the man)\n2. **die**: Feminine (e.g., *die Frau* - the woman)\n3. **das**: Neuter (e.g., *das Kind* - the child)\n4. **die**: Plural (e.g., *die Kinder* - the children)\n\n### The Accusative Case (Direct Object)\nWhen a noun acts as the direct object of a verb, its article changes, but **only if it is masculine**!\n- **der** becomes **den** (e.g., *Ich habe **den** Apfel* - I have the apple)\n- **die** remains **die**\n- **das** remains **das**\n- **die** (plural) remains **die**'),
(6, 6, 'Survival Expressions in German', 'Heading to Germany, Austria, or Switzerland? Here are the absolute essential phrases you need to navigate shops, restaurants, and transit.\n\n### Social Basics\n- **Hallo**: Hello\n- **Guten Tag**: Good day / Hello\n- **Bitte**: Please / You''re welcome (highly versatile!)\n- **Danke**: Thanks\n- **Vielen Dank**: Thank you very much\n- **Entschuldigung**: Excuse me / Sorry\n\n### Dining & Ordering\n- **Ich möchte...**: I would like...\n- **Die Rechnung, bitte**: The bill, please.\n- **Sprechen Sie Englisch?**: Do you speak English? (Formal)\n- **Wo ist die Toilette?**: Where is the restroom?');

-- Quizzes for German Topics
INSERT INTO Quizzes (quiz_id, topic_id, quiz_title, total_marks) VALUES
(5, 5, 'German Cases & Genders Quiz', 3),
(6, 6, 'German Survival Phrases Quiz', 3);

-- Questions for German Quizzes
INSERT INTO Qs (question_id, quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES
(13, 5, 'What is the neuter definite article in German?', 'der', 'die', 'das', 'den', 'C'),
(14, 5, 'In the accusative case, what does the masculine article "der" change to?', 'die', 'das', 'den', 'dem', 'C'),
(15, 5, 'Identify the correct sentence: "I have the dog (Hund is masculine, der Hund)."', 'Ich habe der Hund.', 'Ich habe das Hund.', 'Ich habe den Hund.', 'Ich habe die Hund.', 'C'),
(16, 6, 'How do you politely ask "Where is the restroom?" in German?', 'Wo ist die Toilette?', 'Ich möchte Toilette.', 'Bitte die Toilette.', 'Entschuldigung Toilette.', 'A'),
(17, 6, 'What is the German word for "Please"?', 'Danke', 'Bitte', 'Hallo', 'Tschüss', 'B'),
(18, 6, 'What does "Die Rechnung, bitte" mean?', 'Where is the station?', 'The bill, please', 'I would like a drink', 'Good morning', 'B');


