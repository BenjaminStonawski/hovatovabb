using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HovaTovabbCsharp
{
    class Program
    {
        static void Main(string[] args)
        {
            var diak = new Kedvezmeny { Id = 1, Nev = "Diák", Szazalek = 50 };

            var benjike = new Felhasznalo
            {
                Felhasznalonev = "benjike",
                Jelszo = "tesztelek",
                TeljesNev = "Stonawski Benjamin",
                Email = "bendzsike6@gmail.com",
                Kedvezmeny = diak
            };

            var busz = new Jarmu { Id = 1, Tipus = "Busz" };
            var vonat = new Jarmu { Id = 2, Tipus = "Vonat" };

            var j1 = new Jarat
            {
                Id = 1,
                IndAllomas = "Mátészalka",
                ErkAllomas = "Nyíregyháza",
                IndIdo = new DateTime(2025, 11, 5, 7, 30, 0),
                ErkIdo = new DateTime(2025, 11, 5, 9, 0, 0),
                Jegyar = 560,
                Jarmu = busz
            };

            var j2 = new Jarat
            {
                Id = 2,
                IndAllomas = "Nyíregyháza",
                ErkAllomas = "Budapest-Nyugati",
                IndIdo = new DateTime(2025, 11, 5, 9, 45, 0),
                ErkIdo = new DateTime(2025, 11, 5, 13, 0, 0),
                Jegyar = 2500,
                Jarmu = vonat
            };

            var terv1 = new Terv
            {
                Id = 1,
                Felhasznalo = benjike,
                Jaratok = new List<TervJarat>
                {
                    new TervJarat { Sorrend = 1, Jarat = j1 },
                    new TervJarat { Sorrend = 2, Jarat = j2 }
                }
            };

            var j3 = new Jarat
            {
                Id = 3,
                IndAllomas = "Mátészalka",
                ErkAllomas = "Fehérgyarmat",
                IndIdo = new DateTime(2025, 11, 10, 8, 0, 0),
                ErkIdo = new DateTime(2025, 11, 10, 8, 45, 0),
                Jegyar = 420,
                Jarmu = busz
            };

            var j4 = new Jarat
            {
                Id = 4,
                IndAllomas = "Fehérgyarmat",
                ErkAllomas = "Csenger",
                IndIdo = new DateTime(2025, 11, 10, 9, 0, 0),
                ErkIdo = new DateTime(2025, 11, 10, 9, 35, 0),
                Jegyar = 560,
                Jarmu = busz
            };

            var terv2 = new Terv
            {
                Id = 2,
                Felhasznalo = benjike,
                Jaratok = new List<TervJarat>
                {
                    new TervJarat { Sorrend = 1, Jarat = j3 },
                    new TervJarat { Sorrend = 2, Jarat = j4 }
                }
            };

            var felhasznalok = new List<Felhasznalo> { benjike };
            var tervek = new List<Terv> { terv1, terv2 };

            Console.WriteLine("--- Bejelentkezés ---");
            Console.Write("Felhasználónév: ");
            string fn = Console.ReadLine();
            Console.Write("Jelszó: ");
            string pw = Console.ReadLine();

            var bejelentkezett = felhasznalok.FirstOrDefault(f => f.Felhasznalonev == fn && f.Jelszo == pw);

            if (bejelentkezett == null)
            {
                Console.WriteLine("\nHibás felhasználónév vagy jelszó!");
                return;
            }

            Console.WriteLine($"\nÜdvözöllek, {bejelentkezett.TeljesNev}!");
            Console.WriteLine($"Email: {bejelentkezett.Email}");
            Console.WriteLine($"Kedvezmény: {bejelentkezett.Kedvezmeny.Nev} ({bejelentkezett.Kedvezmeny.Szazalek}%)\n");

            var sajatTervek = tervek.Where(t => t.Felhasznalo == bejelentkezett).ToList();

            if (!sajatTervek.Any())
            {
                Console.WriteLine("Nincs elérhető terved!");
                return;
            }

            foreach (var terv in sajatTervek)
            {
                Console.WriteLine($"--- Terv #{terv.Id} ---");
                foreach (var tj in terv.Jaratok.OrderBy(x => x.Sorrend))
                {
                    var j = tj.Jarat;
                    Console.WriteLine($"{tj.Sorrend}. {j.IndAllomas} → {j.ErkAllomas}");
                    Console.WriteLine($"   Indulás: {j.IndIdo:yyyy.MM.dd. HH:mm}, Érkezés: {j.ErkIdo:HH:mm}");
                    Console.WriteLine($"   Jármű: {j.Jarmu.Tipus}, Jegyár: {j.Jegyar} Ft\n");
                }
            }

            Console.ReadKey();
        }
    }
}