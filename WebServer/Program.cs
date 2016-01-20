using System;
using HttpServer.tcpclient;
using MvcEx;
using HttpServer;
using HttpServer.httplistener;
using HttpServer.socket;
using System.Threading;
using CoreEx;

namespace WebPlotter
{
    public class AbstractFactory : AbstractFactoryBase
    {
        static DataManager dm = null;
        public override DataManagerBase CreateDataManager()
        {
            if (null == dm)
            {
                dm = new DataManager();
            }
            return dm;
        }

        
    }
    class Program
    {
        static void Main(string[] args)
        {
            Factory.Inst().RegisterFactory(new AbstractFactory());

            HttpListenerServer server = new HttpListenerServer();
            server.Start();

           
        }

      
    }
}
