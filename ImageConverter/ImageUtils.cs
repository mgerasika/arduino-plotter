using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Drawing.Imaging;
using System.Net.Mime;

namespace ImageConverter
{
    public class ImageUtils
    {
        public static Bitmap ConvertBlackAndWhite(Bitmap source)
        {
            Bitmap newImage = new Bitmap(source.Width, source.Height);
            newImage.MakeTransparent();
            for (int y = 0; y < newImage.Height; y++)
            {
                for (int x = 0; x < newImage.Width; x++)
                {
                    Color clr = source.GetPixel(x, y);
                    Color newClr = Color.White;
                    if (clr.G < 200 && clr.B < 200 && clr.R < 200)
                    {
                        newClr = Color.Black;
                    }
                    newImage.SetPixel(x,y,newClr);
                }
            }
            return newImage;
        }

        public static IList BitmapToJson(Bitmap source)
        {
            IList res = new ArrayList();
            for (int y = 0; y < source.Height; y++)
            {
                for (int x = 0; x < source.Width; x++)
                {
                    Color clr = source.GetPixel(x, y);
                    if (ImageUtils.EqualsColor(clr,Color.Black))
                    {
                        var obj = new
                        {
                            x = x,
                            y = y,
                            color = 1
                        };
                        res.Add(obj);
                    }
                }
            }
            return res;
        }

        private static bool EqualsColor(Color clr, Color color)
        {
            return (clr.R == color.R) && (clr.B == color.B) && (color.G == clr.G);
        }


        public static Bitmap ResizeImage(Bitmap source, int maxWidth, int maxHeight)
        {
            float diff = source.Width/(float)maxWidth;
            int height = (int)(source.Height/(float)diff);
            height = Math.Min(maxHeight, height);

            Bitmap result = new Bitmap(maxWidth,height);
            Graphics gr = Graphics.FromImage(result);


            Rectangle expansionRectangle = new Rectangle(0, 0,
               result.Width, result.Height);

            gr.DrawImage(source, expansionRectangle);
            gr.Save();

            return result;
        }
    }



}