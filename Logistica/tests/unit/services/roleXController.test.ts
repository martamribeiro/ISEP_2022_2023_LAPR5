import 'reflect-metadata';

import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import { Result } from '../../../src/core/logic/Result';
import IRoleService from "../../../src/services/IServices/IRoleService";
import RoleController from "../../../src/controllers/roleController";
import IRoleDTO from '../../../src/dto/IRoleDTO';

describe('role controller', function () {
	beforeEach(function() {
    });

    it('returns json with id+name values when createRole', async function () {
        let body = { "name":'role12' };
        let req: Partial<Request> = {};
		req.body = body;

        let res: Partial<Response> = {
			json: sinon.spy()
        };
		let next: Partial<NextFunction> = () => {};


		let roleSchemaInstance = require("../src/persistence/schemas/roleSchema").default;
		Container.set("roleSchema", roleSchemaInstance);

		let roleRepoClass = require("../src/repos/roleRepo").default;
		let roleRepoInstance = Container.get(roleRepoClass);
		Container.set("RoleRepo", roleRepoInstance);

		let roleServiceClass = require("../src/services/roleService").default;
		let roleServiceInstance = Container.get(roleServiceClass);
		Container.set("RoleService", roleServiceInstance);

		roleServiceInstance = Container.get("RoleService");
		sinon.stub(roleServiceInstance, "createRole").returns( Result.ok<IRoleDTO>( {"id":"123", "name": req.body.name} ));

		const ctrl = new RoleController(roleServiceInstance as IRoleService);

		await ctrl.createRole(<Request>req, <Response>res, <NextFunction>next);

		sinon.assert.calledOnce(res.json);
		sinon.assert.calledWith(res.json, sinon.match({ "id": "123","name": req.body.name}));
	});
});


