const express = require('express');
const router = express.Router();
const Joi = require('joi');
const authorize = require('../_middleware/authorize');
const validateRequest = require('../_middleware/validate-request');
const projectService = require('./project.service');
const Role = require('../_helpers/role');

router.get('/', authorize(Role.Admin), getAll);
router.get('/:id', authorize(), getById);
router.post('/', authorize(Role.Admin), createSchema, create);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function getAll(req, res, next) {
    projectService.getAll()
        .then(projects => res.json(projects))
        .catch(next);
}

function getById(req, res, next) {
    projectService.getById(req.params.id)
        .then(project => project ? res.json(project) : res.sendStatus(404))
        .catch(next);
}

function getByRole(req, res, next) {
    projectService.getByRole(req.params.role)
        .then(owners => owners ? res.json(owners) : res.sendStatus(404))
        .carch(next);
}

function createSchema(req, res, next) {
    const schema = Joi.object({
        projectName: Joi.string().required(),
        projectVersion: Joi.string().required(),
        projectDate: Joi.date().required(),
        projectDescription: Joi.string().required(),
        projectOwner: Joi.string()
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    projectService.create(req.body)
        .then(project => res.json(project))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schemaRules = {
        projectName: Joi.string().empty(''),
        projectVersion: Joi.string().empty(''),
        projectDate: Joi.date().empty(Date.now()),
        projectDescription: Joi.string().empty(''),
        projectNotes: Joi.string().empty('')
    };

    // only admins can update these items
    if (req.user.role === Role.Admin) {
        schemaRules.projectOwner = Joi.object().empty({});
        schemaRules.projectUsers = Joi.object().empty({});
        schemaRules.projectTickets = Joi.object().empty({});
    }

    const schema = Joi.object(schemaRules);
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    projectService.update(req.params.id, req.body)
        .then(project => res.json(project))
        .catch(next);
}

function _delete(req, res, next) {
    projectService.delete(req.params.id)
        .then(() => res.json({ message: 'Project deleted successfully' }))
        .catch(next);
}



