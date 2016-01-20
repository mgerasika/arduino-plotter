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
using MvcEx.httpclient;

namespace WebPlotter
{
    public class AppController : ControllerBase
    {
        public new DataManager DataManager
        {
            get
            {
                return base.DataManager as DataManager;
            }
        }

        
        public JsonResult Upload()
        {
            IHttpRequestEx request = this.HttpContext.Request;

            byte[] data = new byte[request.ContentLength];
            request.InputStream.Read(data, 0, data.Length);
            string str = Encoding.ASCII.GetString(data);
            int idx = str.IndexOf("\r\n\r\n")+4;
            
            DirectoryInfo dir = new DirectoryInfo(Directory.GetCurrentDirectory());//Debug
            dir = dir.Parent;//bin
            dir = dir.Parent;//WebServer
            dir = new DirectoryInfo(dir.FullName + "\\web\\upload\\");
            FileStream fileStream = System.IO.File.Create(dir.FullName + "out.bmp");
            fileStream.Write(data, idx, data.Length - idx);
            

            Bitmap source = Bitmap.FromStream(fileStream) as Bitmap;

            var obj = new
            {
                Src = "upload/out.bmp",
                width = source.Width,
                height = source.Height
            };
            fileStream.Close();

            return Json(obj);
        }

        public JsonResult ResizeImage(string src)
        {
            DirectoryInfo dir = new DirectoryInfo(Directory.GetCurrentDirectory());//Debug
            dir = dir.Parent;//bin
            dir = dir.Parent;//WebServer
            dir = new DirectoryInfo(dir.FullName + "\\web\\");

            string url = dir.FullName + src;
            StreamReader streamReader = new StreamReader(url);
            Bitmap source = Bitmap.FromStream(streamReader.BaseStream) as Bitmap;
            Bitmap resizedImage = ImageUtils.ResizeImage(source, 260, 240);
            resizedImage.Save(dir.FullName + "upload\\out2.bmp", ImageFormat.Bmp);

            var obj = new
            {
                Src = "upload/out2.bmp",
                width = resizedImage.Width,
                height = resizedImage.Height,
            };
            streamReader.Close();

            return Json(obj);

        }

        public JsonResult ConvertToBlack(string src)
        {
            DirectoryInfo dir = new DirectoryInfo(Directory.GetCurrentDirectory());//Debug
            dir = dir.Parent;//bin
            dir = dir.Parent;//WebServer
            dir = new DirectoryInfo(dir.FullName + "\\web\\");

            string url = dir.FullName + src;
            IList items = null;
            StreamReader streamReader = new StreamReader(url);
            Bitmap source = Bitmap.FromStream(streamReader.BaseStream) as Bitmap;
            Bitmap resultImage = ImageUtils.ConvertBlackAndWhite(source);
            resultImage.Save(dir.FullName + "upload\\out3.bmp", ImageFormat.Bmp);
            items = ImageUtils.BitmapToJson(resultImage);

            var obj = new
            {
                Src = "upload//out3.bmp",
                width = resultImage.Width,
                height = resultImage.Height,
                Items = items,
                Length = items.Count
            };
            streamReader.Close();

            return Json(obj);

        }

        public JsonResult GetSample()
        {
            return Json(true);
        }

        public JsonResult PostSample(String msg)
        {
            return Json(true);
        }

        public JsonResult Sleep()
        {
            System.Threading.Thread.Sleep(1000);
            return Json(true);
        }

        public JsonResult CompleteCommet()
        {
            ResponseBase lResponse = new SuccessResponse();
            HttpCommetManager.Inst().SendToAll(null);
            return Json(true);
        }

        public static bool CompareContext(IHttpContextEx curr, IHttpContextEx target)
        {
            return curr.SessionID == target.SessionID;
        }
        public JsonResult Delay(int miliseconds)
        {
            System.Threading.Thread.Sleep(miliseconds);
            return Json(true);
        }

        
    }
}
