using System;
using System.IO.Ports;
using MvcEx;
using HttpServer.commet;

namespace WebPlotter
{
    public class ArduinoController : ControllerBase
    {
        public new DataManager DataManager
        {
            get
            {
                return base.DataManager as DataManager;
            }
        }

        public JsonResult WriteToComPort(string msg)
        {
            ResponseBase response = null;
            try
            {
                this.DataManager.SerialPort.Write(msg);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                response = new ErrorResponse() { Message = ex.ToString() };
            }
            return Json(response);
        }

        public JsonResult MoveX(int offset)
        {
            //this.DataManager.SerialPort.Write("2");

            HttpCommetManager.Inst().SendToAll("success");
           return Json(true);
        }

        public JsonResult MoveY(int offset)
        {
            //this.DataManager.SerialPort.Write("2");

            HttpCommetManager.Inst().SendToAll("success");
            return Json(true);
        }

        public JsonResult MoveZ(int offset)
        {
            //this.DataManager.SerialPort.Write("2");

            HttpCommetManager.Inst().SendToAll("success");
            return Json(true);
        }

        public JsonResult Delay(int miliseconds)
        {
            System.Threading.Thread.Sleep(miliseconds);
            return Json(true);
        }

        
    }
}
