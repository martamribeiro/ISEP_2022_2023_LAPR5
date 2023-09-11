import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';

import config from '../../config';

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

  const userSchema = {
    // compare with the approach followed in repos and services
    name: 'userSchema',
    schema: '../persistence/schemas/userSchema',
  };

  const roleSchema = {
    // compare with the approach followed in repos and services
    name: 'roleSchema',
    schema: '../persistence/schemas/roleSchema',
  };

  const percursoSchema = {
    // compare with the approach followed in repos and services
    name: 'percursoSchema',
    schema: '../persistence/schemas/percursoSchema',
  };

  const camiaoSchema = {
    name: 'camiaoSchema',
    schema: '../persistence/schemas/camiaoSchema',
  };

  const viagemSchema = {
    // compare with the approach followed in repos and services
    name: 'viagemSchema',
    schema: '../persistence/schemas/viagemSchema',
  };

  const utilizadorSchema = {
    name: 'utilizadorSchema',
    schema: '../persistence/schemas/utilizadorSchema',
  }

  const roleController = {
    name: config.controllers.role.name,
    path: config.controllers.role.path
  }

  const percursoController = {
    name: config.controllers.percurso.name,
    path: config.controllers.percurso.path
  }

  const camiaoController = {
    name: config.controllers.camiao.name,
    path: config.controllers.camiao.path
  }

  const planeamentoController = {
    name: config.controllers.planeamento.name,
    path: config.controllers.planeamento.path
  }

  const utilizadorController = {
    name: config.controllers.utilizador.name,
    path: config.controllers.utilizador.path
  }

  const roleRepo = {
    name: config.repos.role.name,
    path: config.repos.role.path
  }

  const userRepo = {
    name: config.repos.user.name,
    path: config.repos.user.path
  }

  const percursoRepo = {
    name: config.repos.percurso.name,
    path: config.repos.percurso.path
  }

  const camiaoRepo = {
    name: config.repos.camiao.name,
    path: config.repos.camiao.path
  }

  const armazemRepo = {
    name: config.repos.armazem.name,
    path: config.repos.armazem.path
  }

  const planeamentoRepo = {
    name: config.repos.planeamento.name,
    path: config.repos.planeamento.path
  }

  const utilizadorRepo = {
    name: config.repos.utilizador.name,
    path: config.repos.utilizador.path
  }

  const roleService = {
    name: config.services.role.name,
    path: config.services.role.path
  }

  const percursoService = {
    name: config.services.percurso.name,
    path: config.services.percurso.path
  }

  const camiaoService = {
    name: config.services.camiao.name,
    path: config.services.camiao.path
  }

  const planeamentoService = {
    name: config.services.planeamento.name,
    path: config.services.planeamento.path
  }

  const utilizadorService = {
    name: config.services.utilizador.name,
    path: config.services.utilizador.path
  }

  await dependencyInjectorLoader({
    mongoConnection,
    schemas: [
      userSchema,
      roleSchema,
      percursoSchema,
      camiaoSchema,
      viagemSchema,
      utilizadorSchema
    ],
    controllers: [
      roleController,
      percursoController,
      camiaoController,
      planeamentoController,
      utilizadorController
    ],
    repos: [
      roleRepo,
      userRepo,
      percursoRepo,
      camiaoRepo,
      armazemRepo,
      planeamentoRepo,
      utilizadorRepo
    ],
    services: [
      roleService,
      percursoService,
      camiaoService,
      planeamentoService,
      utilizadorService
    ]
  });
  Logger.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
