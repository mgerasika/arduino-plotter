using System.Diagnostics;
using System.IO.Ports;
using CoreEx;
using HttpServer.commet;
using MvcEx;

namespace WebPlotter
{
    public class DataManager : DataManagerBase
    {
        public const string COMPORT = "COM10";
        public SerialPort SerialPort;
        public DataManager()
        {
            InitComPort();
        }
        public void InitComPort()
        {
            /*
            SerialPort = new SerialPort(COMPORT,9600, Parity.None, 8, StopBits.One);
            SerialPort.DataReceived += new SerialDataReceivedEventHandler(DataReceivedHandler);
            SerialPort.BaudRate = 9600;
            SerialPort.Open();
             * */
        }

        private static void DataReceivedHandler(object sender, SerialDataReceivedEventArgs e)
        {
            SerialPort sp = (SerialPort)sender;
            string indata = sp.ReadExisting();
            Debug.Print("Data Received:");
            Debug.Print(indata);
            HttpCommetManager.Inst().SendToAll(indata);
        }
    }
}