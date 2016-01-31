After running the first migrations and installing the conjugation database, to get things into the django models:

INSERT INTO verbs_infinitive (name, translation) SELECT * FROM infinitive;

INSERT INTO verbs_gerund (infinitive_id, gerund, translation) SELECT id, gerund, gerund_english FROM gerund, verbs_infinitive WHERE gerund.infinitive = verbs_infinitive.name;

INSERT INTO verbs_pastparticiple (infinitive_id, pastparticiple, translation) SELECT id, pastparticiple, pastparticiple_english FROM pastparticiple, verbs_infinitive WHERE pastparticiple.infinitive = verbs_infinitive.spanish_name;

INSERT INTO verbs_tense (tense, translation, mood, mood_translation) 
SELECT A.tense, tense.tense_english, A.mood, mood.mood_english FROM
(SELECT DISTINCT tense, mood FROM verbs) AS A, tense, mood
WHERE A.mood = mood.mood AND A.tense = tense.tense;
		
INSERT INTO verbs_conjugation (irregular, infinitive_id, tense_id, form_1s, form_2s, form_3s, form_1p, form_2p, form_3p) SELECT false, verbs_infinitive.id, verbs_tense.id, form_1s, form_2s, form_3s, form_1p, form_2p, form_3p FROM
verbs, verbs_infinitive, verbs_tense WHERE verbs_infinitive.name = verbs.infinitive AND verbs_tense.mood = verbs.mood AND verbs_tense.tense = verbs.tense;


Duolingo verbs harvested from words page, and applying the following regexs:

^.*(er|ir|ar)\s+Verb.*


^([^\s]*)\s*.*$
