import { Router } from 'express';
import auth from './routes/userRoute';
import user from './routes/userRoute';
import role from './routes/roleRoute';
import percurso from './routes/percursoRoute';
import camiao from './routes/camiaoRoute';
import planeamentoRoute from './routes/planeamentoRoute';
import utilizadorRoute from './routes/utilizadorRoute';

export default () => {
	const app = Router();

	auth(app);
	user(app);
	role(app);
	percurso(app);
	camiao(app);
	planeamentoRoute(app);
	utilizadorRoute(app);
		
	return app
}