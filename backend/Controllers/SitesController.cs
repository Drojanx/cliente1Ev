using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [Route("[controller]")]
    [ApiController]

    public class SitesController : ControllerBase
    {
        private readonly DataContext _context;

        public SitesController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Site>> Get()
        {
            return Ok(_context.Sites);
        }

        [HttpGet]
        [Route("{siteId}")]
        public ActionResult<IEnumerable<Site>> Get(int siteId)
        {
            Site site = _context.Sites.Find(siteId);
            return site == null ? NotFound("Site not found") : Ok(site);
        }

        [HttpPost]
        public ActionResult Post(Site site)
        {
            var existingSite = _context.Sites.Find(site.Id);
            if (existingSite!=null) {
                return Conflict("This Id is already being used.");
            } else {
                var existingCategory =_context.Categories.Find(site.CategoryId);
                if (existingCategory==null) {
                    return Conflict("This category doesn't exist");
                } else {
                    site.CreationDate = DateTime.UtcNow.ToString("MM-dd-yyyy");
                    _context.Sites.Add(site);
                    _context.SaveChanges();
                    var resourceUrl = Request.Path.ToString() + "/" + site.Id;
                    return Created(resourceUrl, site);
                }
            }
        }

        [HttpPut]
        [Route("{siteId}")]
        public ActionResult Put(Site site, int siteId) {
            Site existingSite = _context.Sites.Find(siteId);
            if (existingSite==null) {
                return Conflict("There is no site with this Id");
            }
            existingSite.Name = site.Name;
            existingSite.Url = site.Url;
            existingSite.Username = site.Username;
            existingSite.Password = site.Password;
            existingSite.Description = site.Description;
            existingSite.CategoryId = site.CategoryId;
            _context.SaveChanges();
            var resourceUrl = Request.Path.ToString() + "/" + siteId;
            return Ok();
        }

        [HttpDelete]
        [Route("{siteId}")]
        public ActionResult Delete(int siteId) {
            Site existingSite = _context.Sites.Find(siteId);
            if (existingSite==null) {
                return Conflict("There is no site with this Id");
            } else {
                _context.Sites.Remove(existingSite);
                _context.SaveChangesAsync();
                return NoContent();
            }
        }
    }
}