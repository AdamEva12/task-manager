function createTaskRepo(prisma) {
    const getAll = (userId) => {
        return prisma.task.findMany({
            where: { userId },
            orderBy: { id: "asc" }
        });
    };

    const createInProject = (title, prioridity, projectId, userId) => {
        return prisma.task.create({
            data: {
                title,
                prioridity,
                projectId,
                userId,
            }
        })
    };

    const deleteById = (id, userId) => {
        return prisma.task.deleteMany({
            where: { id, userId },
        })
    }
    const updateById = (id, title, userId) => {
        return prisma.task.updateMany({
            where: { id, userId },
            data: { title },
        })
    }
    const findByProject = (projectId, userId) => {
        return prisma.task.findMany({
            where: { projectId, userId },
            orderBy: { id: "asc" }
        });
    };

    const findById = (id, userId) => {
        return prisma.task.findFirst({
            where: { id, userId },
        });
    };

    return {
        getAll,
        createInProject,
        deleteById,
        updateById,
        findByProject,
        findById
    };
}

module.exports = { createTaskRepo };