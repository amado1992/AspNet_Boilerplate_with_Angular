using Abp.Application.Services;
using Abp.Authorization;
using Abp.Domain.Repositories;
using kiosco.Authorization;
using kiosco.Dtos;
using kiosco.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Abp.Application.Services.Dto;

namespace kiosco.AppServices
{
    [AbpAuthorize(PermissionNames.Pages_Documents)]
    public class DocumentAppService : AsyncCrudAppService<Document, DocumentDto, int, PagedSortedAndFilteredResultRequestDto>
    {
        private IWebHostEnvironment Environment;
        FileStreamResult fileStreaResult;
        public DocumentAppService(IRepository<Document, int> repository, IWebHostEnvironment _environment) : base(repository)
        {
            Environment = _environment;
        }

        protected override IQueryable<Document> CreateFilteredQuery(PagedSortedAndFilteredResultRequestDto input)
        {
            return Repository.GetAllIncluding()
            .Where(x => x.Name.Contains(input.Filter ?? ""));
        }

        public void PostFileTest(List<IFormFile> files)
        {
            //string paths = @"d:\archives\";
            //Path.Combine("ROOT PATH FOR THE FILES", "uploads");
            //var uploadsPath = Path.Combine(Environment.ContentRootPath, "uploads");
            //var uploadsPath = Path.Combine(paths, "uploads");
            var uploadsPath = Path.Combine(@"C:\Pictures\", "SavedPictures");

            if (files.Count > 0)
            {
                foreach (var file in files)
                {
                    var filePath = Path.Combine(uploadsPath, file.FileName);

                    try
                    {
                        using (var stream = new FileStream(filePath, FileMode.OpenOrCreate, FileAccess.ReadWrite))
                        {
                            file.CopyTo(stream);
                        }

                    }
                    catch (Exception ex) { }
                }
            }
        }

        public void PostFileTwo(UploadDto uploadDto)
        {
            //string paths = @"d:\archives\";
            //var uploadsPath = Path.Combine(Environment.ContentRootPath, "uploads");
            //var uploadsPath = Path.Combine(paths, "uploads");
            var uploadsPath = Path.Combine(@"C:\Pictures\", "SavedPictures");
            var document = new Document();

            if (uploadDto.Files.Count > 0)
            {
                foreach (var file in uploadDto.Files)
                {
                    var filePath = Path.Combine(uploadsPath, file.FileName);

                    try
                    {
                        using (var stream = new FileStream(filePath, FileMode.OpenOrCreate, FileAccess.ReadWrite))
                        {
                            file.CopyTo(stream);
                        }

                        document.EntertainerId = uploadDto.EntertainerId;
                        document.Name = file.Name;
                        document.Url = filePath;
                        Repository.Insert(document);

                    }
                    catch (Exception ex) { }
                }
            }
        }

        public void PostFile(List<IFormFile> files, int entertainerId)
        {
            //string paths = @"d:\archives\";
            //var uploadsPath = Path.Combine(Environment.ContentRootPath, "uploads");
            //var uploadsPath = Path.Combine(paths, "uploads");
            var uploadsPath = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot", "uploads");

            //var uploadsPath = Path.Combine(@"C:\Pictures\", "SavedPictures");

            if (files.Count > 0)
            {
                foreach (var file in files)
                {
                    var filePath = Path.Combine(uploadsPath, file.FileName);
                    var document = new Document();

                    try
                    {
                        using (var stream = new FileStream(filePath, FileMode.OpenOrCreate, FileAccess.ReadWrite))
                        {
                            file.CopyTo(stream);
                        }

                        document.EntertainerId = entertainerId;
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
            if (query != null) { 
                filePath = query.Url;

            stream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read);

            fileStreaResult = new FileStreamResult(stream, "*/*");

            fileStreaResult.FileDownloadName = query.Name;

            }

            return fileStreaResult;

        }

        public async Task<ListResultDto<DocumentDto>> GetDocumentsById(PagedSortedAndFilteredResultRequestDto input)
        {

            var query = Repository.GetAllIncluding(x => x.Entertainer)
            .Where(x => x.EntertainerId == input.FilterForId);

            var totalCount = await AsyncQueryableExecuter.CountAsync(query);

            //Paging
           /* if (input is IPagedResultRequest pagedInput)
            {
                query = query.PageBy(pagedInput);
            }
            if (input is ILimitedResultRequest limitedInput)//Try to limit query result if available
            {
                query = query.Take(limitedInput.MaxResultCount);
            }*/


            var entities = await AsyncQueryableExecuter.ToListAsync(query);

            List<DocumentDto> list = new List<DocumentDto>(ObjectMapper.Map<List<DocumentDto>>(entities));

            return new PagedResultDto<DocumentDto>(
                totalCount,
                list
            );

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
