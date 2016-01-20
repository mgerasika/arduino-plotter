using System;
using System.IO.Ports;
using MvcEx;
using HttpServer.commet;

namespace WebPlotter
{
    public class ArduinoCommetController : ControllerBase
    {
        public new DataManager DataManager
        {
            get
            {
                return base.DataManager as DataManager;
            }
        }

        public JsonResult Delay(int miliseconds)
        {
            System.Threading.Thread.Sleep(miliseconds);
            return Json(true);
        }

        public JsonResult ReceiveData()
        {
            object obj = this.HttpContext.GetFromSession("TempData");
            return Json(Convert.ToString(obj));
        }

        
    }
}
