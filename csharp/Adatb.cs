using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HovaTovabbCsharp
{
    public class Felhasznalo
    {
        public string Felhasznalonev { get; set; }
        public string Jelszo { get; set; }
        public string TeljesNev { get; set; }
        public string Email { get; set; }
        public Kedvezmeny Kedvezmeny { get; set; }

        public override string ToString() => $"{TeljesNev} ({Felhasznalonev})";
    }

    public class Kedvezmeny
    {
        public int Id { get; set; }
        public string Nev { get; set; }
        public int Szazalek { get; set; }
    }

    public class Jarmu
    {
        public int Id { get; set; }
        public string Tipus { get; set; }
    }

    public class Jarat
    {
        public int Id { get; set; }
        public string IndAllomas { get; set; }
        public string ErkAllomas { get; set; }
        public DateTime IndIdo { get; set; }
        public DateTime ErkIdo { get; set; }
        public decimal Jegyar { get; set; }
        public Jarmu Jarmu { get; set; }
    }
    public class TervJarat
    {
        public int Sorrend { get; set; }
        public Jarat Jarat { get; set; }
    }

    public class Terv
    {
        public int Id { get; set; }
        public Felhasznalo Felhasznalo { get; set; }
        public List<TervJarat> Jaratok { get; set; } = new List<TervJarat>();
    }

    public class Admin
    {
        public string Felhasznalonev { get; set; }
        public string Jelszo { get; set; }
    }
}
