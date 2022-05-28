
namespace backend.Models
{
    public class Site
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Url { get; set; }

        public string Username { get; set; }

        public string Password { get; set; }        

        public string Description { get; set; }

        public string CreationDate { get; set; }

        public int CategoryId { get; set; }
    }
}