using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.IO.Ports;
using System.Text;
using ImageConverter;
using MvcEx;
using HttpServer.commet;
using HttpServer;

namespace WebPlotter
{
    public class TestController : ControllerBase
    {
        public JsonResult GetA()
        {
            return Json("A");
        }
    }
}
