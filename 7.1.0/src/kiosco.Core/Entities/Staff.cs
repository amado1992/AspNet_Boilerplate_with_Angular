
namespace kiosco.Entities
{
    public class Staff : Person
    {
        public int JobId { get; set; }
        public Job Job { get; set; }
    }
}
