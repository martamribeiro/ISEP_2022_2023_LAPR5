import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port
   */
  port: parseInt(process.env.PORT, 10) || 3000,

  /**
   * That long string from mlab
   */
  databaseURL: process.env.MONGODB_URI || "mongodb://mongoadmin:cd4dc39b0b7f6234f5d28ab6@vsgate-s1.dei.isep.ipp.pt:10697/?authMechanism=DEFAULT",

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET || "my sakdfho2390asjod$%jl)!sdjas0i secret",

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },

  controllers: {
    role: {
      name: "RoleController",
      path: "../controllers/roleController"
    },
    percurso: {
      name: "PercursoController",
      path: "../controllers/percursoController"
    },
    camiao: {
      name: "CamiaoController",
      path: "../controllers/camiaoController"
    },
    planeamento: {
      name: "PlaneamentoController",
      path: "../controllers/planeamentoController"
    },
    utilizador: {
      name: "UtilizadorController",
      path: "../controllers/utilizadorController"
    }
  },

  repos: {
    role: {
      name: "RoleRepo",
      path: "../repos/roleRepo"
    },
    user: {
      name: "UserRepo",
      path: "../repos/userRepo"
    },
    percurso: {
      name: "PercursoRepo",
      path: "../repos/percursoRepo"
    },
    camiao: {
      name: "CamiaoRepo",
      path: "../repos/camiaoRepo"
    },
    armazem: {
      name: "ArmazemRepo",
      path: "../repos/armazemRepo"
    },
    planeamento: {
      name: "PlaneamentoRepo",
      path: "../repos/planeamentoRepo"
    },
    utilizador: {
      name: "UtilizadorRepo",
      path: "../repos/utilizadorRepo"
    }
  },

  services: {
    role: {
      name: "RoleService",
      path: "../services/roleService"
    },
    percurso: {
      name: "PercursoService",
      path: "../services/percursoService"
    },
    camiao: {
      name: "CamiaoService",
      path: "../services/camiaoService"
    },
    planeamento: {
      name: "PlaneamentoService",
      path: "../services/planeamentoService"
    },
    utilizador: {
      name: "UtilizadorService",
      path: "../services/utilizadorService"
    }
  },
};
