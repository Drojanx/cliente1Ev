using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [Route("[controller]")]
    [ApiController]

    public class CategoriesController : ControllerBase
    {
        private readonly DataContext _context;

        public CategoriesController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Category>> Get()
        {
            return Ok(_context.Categories);
        }

        [HttpGet]
        [Route("{categoryId}")]
        public ActionResult<IEnumerable<Category>> Get(int categoryId)
        {
            Category category = _context.Categories.Find(categoryId);
            return category == null ? NotFound("Category not found") : Ok(category);
        }
        
        [HttpPost]
        public ActionResult Post(Category category)
        {
            foreach(Category cat in _context.Categories) {
                if (cat.Name.Equals(category.Name)) {
                    return Conflict("This Name is already being used.");
                }
            }
            
            var existingCategory = _context.Categories.Find(category.Id);
            if (existingCategory!=null) {
                return Conflict("This Id is already being used.");
            } else {
            _context.Categories.Add(category);
            _context.SaveChanges();
            var resourceUrl = Request.Path.ToString() + "/" + category.Id;
            return Created(resourceUrl, category);
            }
        }
        
        [HttpPut]
        [Route("{categoryId}")]
        public ActionResult Put(Category category, int categoryId) {
            Category existingCategory = _context.Categories.Find(categoryId);
            if (existingCategory==null) {
                return Conflict("There is no category with this Id");
            }
            existingCategory.Name = category.Name;
            _context.SaveChanges();
            var resourceUrl = Request.Path.ToString() + "/" + categoryId;
            return Ok();
        }
        
        [HttpDelete]
        [Route("{categoryId}")]
        public ActionResult Delete(int categoryId) {
            Category existingCategory = _context.Categories.Find(categoryId);
            if (existingCategory==null) {
                return Conflict("There is no category with this Id");
            } else {
                _context.Categories.Remove(existingCategory);
                foreach (Site siteToDelete in _context.Sites) {
                    if (siteToDelete.CategoryId == existingCategory.Id) {
                        _context.Sites.Remove(siteToDelete);
                    }
                }
                _context.SaveChangesAsync();
                return NoContent();
            }
        }
    }
}