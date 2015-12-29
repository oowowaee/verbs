After running the first migrations and installing the translation database:

INSERT INTO verbs_infinitive (spanish_name, english_name) SELECT * FROM infinitive;
