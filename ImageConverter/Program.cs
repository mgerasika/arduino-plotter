using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Text;

namespace ImageConverter
{
    class Program
    {
        static void Main(string[] args)
        {
            using (StreamReader streamReader = new StreamReader("1.jpg"))
            {
                Bitmap source = Bitmap.FromStream(streamReader.BaseStream) as Bitmap;
                Bitmap newImage1 = ImageUtils.ConvertBlackAndWhite(source);
                newImage1.Save("1.bmp",ImageFormat.Bmp);
                IList res = ImageUtils.BitmapToJson(newImage1);
            }
        }
    }
}
