using MvcEx;

namespace WebPlotter
{
    public class MathCommetController : ControllerBase
    {
        public JsonResult Sum(int x,int y)
        {
            return Json(x + y);
        }
    }
}
