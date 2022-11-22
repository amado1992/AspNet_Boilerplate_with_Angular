using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.Dtos
{
    public class UploadDto
    {
        public int EntertainerId { get; set; }
        public List<IFormFile> Files { get; set; }
    }
}
