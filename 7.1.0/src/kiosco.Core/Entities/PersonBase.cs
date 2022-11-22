using Abp.Domain.Entities;

namespace kiosco.Entities
{
    public abstract class PersonBase : Entity
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
