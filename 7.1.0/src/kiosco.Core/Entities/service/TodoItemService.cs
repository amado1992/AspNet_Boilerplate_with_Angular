using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.Entities.service
{
    public class ResultDateDto
    {
        public DateTime referenceDateStart;
        public DateTime referenceDateEnd;
    }
    public class TodoItemService
    {
        public ResultDateDto ComunCode(TimeOnly start, TimeOnly end, TimeOnly currentTimeOnly, DateTime today, DateTime tomorrow)
        {
            ResultDateDto result = new ResultDateDto();

            var referenceDateStart = today;
            var referenceDateEnd = today;
            referenceDateStart += start.ToTimeSpan();
            referenceDateEnd += end.ToTimeSpan();

            //se esta haciendo esta llamada en el dia
            if (currentTimeOnly.Hour >= 12 && currentTimeOnly.Hour < 19 || currentTimeOnly.Hour >= 19 && currentTimeOnly.Hour <= 23)
            {

                //opcional caso: turno de la noche start = 19:00pm hasta end = 02:00am
                if (start.Hour >= 0 && start.Hour < 2)
                {//turno que comienza en la madrugada del otro dia start >= 00:00 am hasta start <= 2:00am
                    referenceDateStart = tomorrow;
                    referenceDateStart += start.ToTimeSpan();
                }

                //obligatorio caso: turno de la noche start = 19:00pm hasta end = 02:00am
                if (end.Hour >= 0 && end.Hour < 2)
                {//turno que comienza en la madrugada del otro dia end >= 00:00 am hasta end <= 2:00 am, termina a las 02:00am

                    referenceDateEnd = tomorrow;
                    referenceDateEnd += end.ToTimeSpan();
                }
            }

            //se esta haciendo esta llamada en el dia no pertenece a ningun turno
            if (currentTimeOnly.Hour >= 2 && currentTimeOnly.Hour < 12)
            {
                //horario del dia
                if (start.Hour >= 12 && start.Hour <= 23)
                {
                    referenceDateStart = today.AddDays(-1);

                }

                if (end.Hour >= 12 && end.Hour < 24)
                {
                    referenceDateEnd = today.AddDays(-1);
                }

                //horario de la noche

                if (start.Hour >= 0 && start.Hour < 2)
                {
                    referenceDateStart = today;

                }

                if (end.Hour >= 0 && end.Hour < 2)
                {
                    referenceDateEnd = today;
                }
                //fin horario de la noche

                referenceDateStart += start.ToTimeSpan();
                referenceDateEnd += end.ToTimeSpan();
            }

            //se esta haciendo esta llamada en la noche
            if (currentTimeOnly.Hour >= 0 && currentTimeOnly.Hour < 2)
            {
                if (start.Hour >= 12 && start.Hour <= 23)
                {//turno que comienza en el dia a la 12pm, start >= 12 dia o start >= 19 noche

                    referenceDateStart = today.AddDays(-1);
                    referenceDateStart += start.ToTimeSpan();
                }
                if (end.Hour >= 12 && end.Hour <= 23)
                {//turno que termina en el dia a la 19pm

                    referenceDateEnd = today.AddDays(-1);
                    referenceDateEnd += end.ToTimeSpan();
                }
            }
            result.referenceDateStart = referenceDateStart;
            result.referenceDateEnd = referenceDateEnd;
            return result;
        }
    }
}
