"""Öğretmen branş testi · Ortaokul Türkçe (5–8)."""
from _lib import build

PAR = ("Kitap okumak yalnızca bilgi edinmek değildir. Okuyan kişi başka hayatlara konuk olur, farklı düşünceleri tanır ve kendi bakış "
       "açısını genişletir. Bu yüzden okuma alışkanlığı, insanın dünyayı anlama biçimini de değiştirir.")
FLOW = ("(I) Arılar, çiçekten çiçeğe konarak bitkilerin tozlaşmasını sağlar. (II) Bu sayede pek çok meyve ve sebzenin üretimi mümkün olur. "
        "(III) Bal, insanlık tarihinin en eski tatlandırıcılarından biridir. (IV) Arı nüfusundaki azalma bu nedenle tarım için ciddi bir tehdittir.")

Q = [
    ("Yazım kuralları", "temel", "Aşağıdaki cümlelerin hangisinde yazım yanlışı vardır?",
     ["Herkez toplantıya zamanında geldi.", "Yarın akşam size uğrayacağız.", "Bu konuyu birçok kez konuştuk.", "Hiçbir şey eskisi gibi değil."]),
    ("Noktalama · kesme işareti", "temel", "Aşağıdaki cümlelerin hangisinde kesme işaretinin kullanımı yanlıştır?",
     ["Toplantı Salı'ya ertelendi.", "Ankara'ya yarın gidiyoruz.", "Ayşe'nin kitabı masada kaldı.", "1923'te Cumhuriyet ilan edildi."]),
    ("Eş anlamlı sözcükler", "temel", "“Yüce” sözcüğünün eş anlamlısı aşağıdakilerden hangisidir?", ["Ulu", "Alçak", "Geniş", "Derin"]),
    ("Zıt anlamlı sözcükler", "temel", "Aşağıdakilerin hangisinde zıt anlamlı sözcükler bir arada verilmiştir?",
     ["cimri – cömert", "kırmızı – al", "yanıt – cevap", "okul – mektep"]),
    ("Deyimler", "temel", "“Etekleri zil çalmak” deyiminin anlamı aşağıdakilerden hangisidir?", ["Çok sevinmek", "Çok korkmak", "Telaşla koşmak", "Çok yorulmak"]),
    ("Cümlede anlam", "temel", "Aşağıdaki cümlelerin hangisinde neden-sonuç ilişkisi vardır?",
     ["Yağmur yağdığı için maç ertelendi.", "Maçı izlemek amacıyla erken çıktık.", "Yağmur yağarsa maç ertelenir.", "Maç ertelendi ama kimse üzülmedi."]),
    ("Fiilimsiler", "temel", "Aşağıdaki cümlelerin hangisinde isim-fiil vardır?",
     ["Kitap okumayı çok severim.", "Koşarak eve geldi.", "Okunan kitapları rafa diz.", "Sabah erkenden yola çıktık."]),
    ("Cümlenin ögeleri", "temel", "“Dün akşam annem bize kek yaptı.” cümlesinin öznesi hangisidir?", ["annem", "Dün akşam", "bize", "kek"]),
    ("Kök ve ek", "temel", "“Gözlükçü” sözcüğünün kökü hangisidir?", ["göz", "gözlük", "gözlü", "gözlükçü"]),
    ("Fiilde çatı", "temel", "Aşağıdaki cümlelerin hangisinde edilgen çatılı bir fiil vardır?",
     ["Mektup dün postaya verildi.", "Annem bana bir kazak ördü.", "Kardeşim bahçede top oynadı.", "Sabah erkenden yola çıktık."]),
    ("Paragrafta ana düşünce", "temel", f"<i>{PAR}</i><br>Bu paragrafın ana düşüncesi aşağıdakilerden hangisidir?",
     ["Okumak, bakış açısını genişleterek insanın dünyayı anlama biçimini değiştirir.", "Kitap okumak en kolay bilgi edinme yoludur.",
      "Herkes her gün kitap okumalıdır.", "Başka hayatları tanımak için seyahat etmek gerekir."]),
    ("Söz sanatları", "temel", "“Rüzgâr pencereye vurup ağlıyordu.” cümlesinde hangi söz sanatı vardır?",
     ["Kişileştirme", "Benzetme", "Abartma", "Karşıtlık"]),
    ("Büyük harflerin kullanımı", "temel", "Aşağıdaki cümlelerin hangisinde büyük harflerin kullanımıyla ilgili bir yanlışlık vardır?",
     ["Yarın Annemle birlikte pazara gideceğiz.", "Bu yaz Karadeniz'e gittik.", "Atatürk'ün Nutuk adlı eserini okudum.", "Ankara, Türkiye'nin başkentidir."]),
    ("Metin türleri", "temel", "Bir kişinin kendi hayatını baştan sona, kronolojik olarak anlattığı yazı türü hangisidir?",
     ["Otobiyografi", "Biyografi", "Anı", "Günlük"]),
    ("“de” bağlacı · öğrenci hatası", "temel",
     "Bir öğrenci “Sen de mi geliyorsun?” cümlesini “Sende mi geliyorsun?” biçiminde yazmıştır. Öğrencinin hatasını fark etmesi için en uygun yönlendirme hangisidir?",
     ["“de” çıkarıldığında cümle anlamlı kalıyorsa bağlaçtır ve ayrı yazılır.", "Soru cümlelerinde “de” her zaman bitişik yazılır.",
      "“de” kendinden önceki sözcüğe uyduğu için bitişik yazılır.", "Kişi zamirlerinden sonra gelen “de” her zaman bitişik yazılır."]),
    ("Paragrafın akışı", "ileri", f"<i>{FLOW}</i><br>Bu paragrafta numaralanmış cümlelerden hangisi düşüncenin akışını bozmaktadır?",
     ["III", "I", "II", "IV"]),
    ("Fiilimsiler", "ileri", "Aşağıdaki cümlelerin hangisinde birden fazla fiilimsi vardır?",
     ["Okulda öğrendiklerini anlatırken gözleri parlıyordu.", "Yarın erkenden yola çıkacağız.", "Gülerek odaya girdi.", "Kitap okumayı çok sever."]),
    ("Cümle türleri", "ileri", "Aşağıdakilerden hangisi yapısına göre birleşik cümledir?",
     ["Hava kararınca eve döndük.", "Kardeşim her sabah süt içer.", "Akşam oldu ve herkes evine döndü.", "Kitabı aldım, hemen okudum."]),
    ("Gerçek ve mecaz anlam", "ileri", "Aşağıdaki cümlelerin hangisinde “ağır” sözcüğü mecaz anlamda kullanılmıştır?",
     ["Bu konuda bana çok ağır sözler söyledi.", "Bu valiz taşıyamayacağım kadar ağır.", "Ağır yükü merdivenden çıkardılar.", "Tartıda en ağır gelen kutuydu."]),
    ("Anlatım bozukluğu", "ileri", "Aşağıdaki cümlelerin hangisinde anlatım bozukluğu vardır?",
     ["Kesinlikle belki yarın gelirim.", "Yarın büyük olasılıkla yağmur yağacak.", "Sınavdan önce konuları bir kez daha gözden geçirdim.", "Annem akşam yemeğine misafir çağırdı."]),
]

if __name__ == "__main__":
    print(build("ortaokul_turkce", "Ortaokul Türkçe · 5.–8. sınıf", 8, "Türkçe", Q, seed=58002))
