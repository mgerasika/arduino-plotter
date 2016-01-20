using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.IO;

namespace TestApp
{
    class Program
    {
        static void Main(string[] args)
        {
            //MakeGet("http://127.0.0.1:8082/Test.mvc/GetA");
        }

        public static void MakeGet(string url)
        {
            HttpWebRequest httpRequest = HttpWebRequest.Create(url) as HttpWebRequest;
            HttpWebResponse response = httpRequest.GetResponse() as HttpWebResponse;
            string responseData = "";
            using (StreamReader sr = new StreamReader(response.GetResponseStream()))
            {
                responseData = sr.ReadToEnd();
            }
            Console.WriteLine(String.Format("{0} {1}",url,responseData));
        }
    }
}
