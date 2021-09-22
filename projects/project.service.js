const db = require('../_helpers/db');

module.exports = {
    getAll,
    getById,
    getByAccount,
    getProject,
    create,
    delete: _delete
};

async function getAll() { return await db.Project.find(); }

async function getById(id) { return await getProject(id); }

async function getByAccount(aid) {
    if (!db.isValidId(aid)) throw 'Account not found';
    const projects = await db.Project.find();
    const project = projects.filter(x => { });
    if (!project) throw 'Project not found';
    return project;
}

async function getProject(id) {
    if (!db.isValidId(id)) throw 'Project not found';
    const project = await db.Project.findById(id);
    if (!project) throw 'Project not found';
    return project;
}

async function create(params) {

    const project = new db.Project(params);

    // save account
    await project.save();

    return project;
}

async function _delete(id) {
    const project = await getProject(id);
    return await project.remove();
}



