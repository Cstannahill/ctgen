using Models;
using Data.Context;
using Services.Interfaces;

namespace Services.Implementations {
    public class AIModelService : IAIModelService {
        private readonly MyDbContext _context;
        public AIModelService(MyDbContext context) {
            _context = context;
        }
        public IEnumerable<AIModel> GetAll() {
            return _context.AIModels.ToList();
        }
        // Add more methods as needed
    }
}