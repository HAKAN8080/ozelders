"""Öğretmen branş testi · Ortaokul İngilizce (5–8)."""
from _lib import build

Q = [
    ("Present simple", "temel", "She ___ to school every day.", ["goes", "go", "going", "is go"]),
    ("There is / there are", "temel", "There ___ two apples on the table.", ["are", "is", "be", "am"]),
    ("Past simple", "temel", "I ___ a film last night.", ["watched", "watch", "have watch", "watches"]),
    ("Prepositions of time", "temel", "My birthday is ___ May.", ["in", "on", "at", "to"]),
    ("Vocabulary · food", "temel", "Which one is a fruit?", ["banana", "carrot", "potato", "onion"]),
    ("Requests", "temel", "Can you ___ me the salt, please?", ["pass", "passing", "passed", "to pass"]),
    ("Articles", "temel", "This is ___ umbrella.", ["an", "a", "some", "any"]),
    ("Comparatives", "temel", "Tom is taller ___ his brother.", ["than", "then", "that", "as"]),
    ("Telling the time", "temel", "“It's half past seven.” What time is it?", ["7:30", "6:30", "7:15", "8:30"]),
    ("Future plans", "temel", "I'm ___ to the cinema tomorrow.", ["going", "go", "went", "goes"]),
    ("Present perfect", "temel", "We haven't seen him ___ Monday.", ["since", "for", "ago", "from"]),
    ("First conditional", "temel", "If it rains tomorrow, we ___ at home.", ["will stay", "stayed", "staying", "stays"]),
    ("Prepositions", "temel", "She is good ___ playing the piano.", ["at", "in", "on", "for"]),
    ("Dialogue completion", "temel", "A: Would you like to come to my party on Saturday?<br>B: ___ I have to visit my grandparents.",
     ["I'm sorry, I can't.", "Yes, of course I'll come.", "Sure, what time?", "No, I don't like you."]),
    ("Error correction · öğrenci hatası", "temel", "A student writes: “He don't like coffee.” Which option gives the best correction and reason?",
     ["He doesn't like coffee — third person singular takes “does”.", "He didn't liked coffee — the past tense is needed.",
      "He don't likes coffee — the main verb takes -s.", "He not like coffee — “do” is unnecessary."]),
    ("Past perfect", "ileri", "By the time we arrived, the film ___.", ["had already started", "has already started", "already starts", "was already start"]),
    ("Passive · present perfect", "ileri", "The book ___ by millions of people since it was published.", ["has been read", "was read", "is reading", "read"]),
    ("Wish clauses", "ileri", "I wish I ___ more free time.", ["had", "have", "will have", "am having"]),
    ("Reported questions", "ileri", "She asked me where I ___.", ["lived", "did I live", "do I live", "am living"]),
    ("Vocabulary · opposites", "ileri", "The opposite of “generous” is ___.", ["mean", "kind", "brave", "honest"]),
]

if __name__ == "__main__":
    print(build("ortaokul_ingilizce", "Ortaokul İngilizce · 5.–8. sınıf", 8, "İngilizce", Q, seed=58003))
