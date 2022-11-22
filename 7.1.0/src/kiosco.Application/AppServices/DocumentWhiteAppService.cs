using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using kiosco.Authorization;
using kiosco.Dtos;
using kiosco.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.AppServices
{
    [AbpAuthorize(PermissionNames.Pages_DocumentsWhite)]
    public class DocumentWhiteAppService : AsyncCrudAppService<DocumentWhite, DocumentWhiteDto, int, PagedSortedAndFilteredResultRequestDto>
    {
        private IWebHostEnvironment Environment;
        FileStreamResult fileStreaResult;
        public DocumentWhiteAppService(IRepository<DocumentWhite, int> repository, IWebHostEnvironment _environment) : base(repository)
        {
            Environment = _environment;
        }

        protected override IQueryable<DocumentWhite> CreateFilteredQuery(PagedSortedAndFilteredResultRequestDto input)
        {
            return Repository.GetAllIncluding()
            .Where(x => x.Name.Contains(input.Filter ?? ""));
        }

        public void PostFile(List<IFormFile> files)
        {
            var uploadsPath = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot", "documentWhite");

            if (files.Count > 0)
            {
                foreach (var file in files)
                {
                    var filePath = Path.Combine(uploadsPath, file.FileName);
                    var document = new DocumentWhite();

                    try
                    {
                        using (var stream = new FileStream(filePath, FileMode.OpenOrCreate, FileAccess.ReadWrite))
                        {
                            file.CopyTo(stream);
                        }

                        document.Name = file.FileName;
                        document.Url = filePath;
                        Repository.Insert(document);

                    }
                    catch (Exception ex) { }
                }
            }
        }

        public async Task<FileStreamResult> GetFile(int idFile)
        {
            Stream stream = null;
            var filePath = "";
            var query = Repository.FirstOrDefault(val => val.Id == idFile);
            if (query != null)
            {
                filePath = query.Url;

                stream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read);

                fileStreaResult = new FileStreamResult(stream, "*/*");

                fileStreaResult.FileDownloadName = query.Name;

            }

            return fileStreaResult;

        }

        public override Task DeleteAsync(EntityDto<int> input)
        {
            var query = Repository.FirstOrDefault(val => val.Id == input.Id);
            if (query != null)
            {
                var filePath = query.Url;
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }
            return base.DeleteAsync(input);
        }
    }
}
