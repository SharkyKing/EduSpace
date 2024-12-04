Pradinio ugdymo pedagogų pamokų integracijos idėjų forumas
Sprendžiamo uždavinio aprašymas
GitHub repozitorija
https://github.com/SharkyKing/STPP_Projektas.git
Sistemos paskirtis
Pradinio ugdymo forumo sistemos paskirtis – dalintis informacija apie idėjas ar būdus, kaip integruoti atitinkamas veiklas įvairiose pamokose pradinio ugdymo klasėse. 
Artimoje aplinkoje, pradinio ugdymo pedagogijos universitetiniuose mokymuose, pastebėta, kad yra skatinamas integracinis mokymas, kurio ankščiau taip neakcentavo nei vieni mokytojai, bei iš patirties to neesu pastebėjas. Taip pat pastebėta, kad tam tikrais atvėjais dažnai pritrūksta idėjų, o jų pasisemti aktyviai naudojamos tokios platformos, kaip „Facebook“. Joje kuriamos atitinkamos grupės ir ten dalinamasi informacija. 
O ką jei egzistuotų toks puslapis, kuriame būtų galima bendrai dalintis visomis idėjomis tarp pradinio ugdymo pedogogų ir jis būtų pasiekiamas bendra nuoroda, nenaršant ir neieškant specifinių grupių? Kita iškylanti problema, tai ne visos tos grupės aktyvios. Kai kurios sukurtos, bet turi maža pasiekiamumą, bei narių skaičių. 
Šia idėja, siekiama išspręsti šią problemą. Sukurti vieningą platformą. 
Platformoje, pedagogai turėtų galimybė pagal atitinkamas kategorijas matyti kuo dalinasi kiti pedagogai. Šie galėtų taip pat dalintis savo idėjomis, kurios jų nuomone pasiteisina, parašyti skatinančias ar kritikuojančias nuomones apie kitų idėjas.  
 
Funkciniai reikalavimai
Rolių aprašymai parašyti pagal paveldimumą. Sveičas -> Pedagogas -> Administratorius
•	Svečio funkciniai reikalavimai
o	Įrašų peržiūra
o	Komentarų peržiūra
o	Įrašų filtravimas pagal kategorijas, klases, dalykus
o	Registracija įrašų skelbimui, komentarų rašymui
•	Pedagogo (Tariamo dažno naudotojo) funkciniai reikalavimai
o	Vieša informacija (Patirtis, Mokymosi įstaiga, Miestas)
o	Registracijos patvirtinimas el. pašto metodu
o	Slaptažodžio priminimo funkcija
o	Įrašų CRUD operacijos
o	Komentarų CRUD operacijos konkretiems įrašams
o	Failų prisegimas prie įrašų
o	Prisijungimas
•	Administarorius
o	Visų įrašų CRUD operacijos
o	Visų komentarų CRUD operacijos
o	Vartotojų blokavimas
o	Turinio blokavimas
Pasirinktų technologijų aprašymas
1.	React
React pasirinktas dėl daugybės šaltinių esančių internete, nesudėtinga rasti pagalbos. Turi komponentais grįsta dizainą, kas padeda nesunkiai pernaudoti pasikartojančius komponentus ir jų savybes.  Pasižymi efektyvumu bei našumu. 
2.	REST API
Šis naudoja http užklausas, kurios pagerina programavimo efektyvumą, bei išplečiamumą.  Nesudėtinga sąsaja su serveriu, lengvai aprašoma. 
3.	Axios
Palengvina HTTP užklausų kūrimo aprašymą. Naudojama asincroniniams HTTP kvietimams į REST. Automatiškai apdorojami JSON objektai. Lengvai aprašomos klaidų išimtys, bei turi papildomų savybių, pavyzdžiui tokių, kaip užklausos atšaukimas. 
4.	Node.js
Naudojama populiari javascript kalba.  Šis palaiko daugybę vartotojų lygiagrečių prisijungimų prie serverio. Dažnai naudojama autentifikacijos apdorojimui, duomenų bazės apdorojimui. 
