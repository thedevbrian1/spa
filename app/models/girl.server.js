import { prisma } from "~/db.server";

export function getGirls() {
    return prisma.girls.findMany({
        // include: {
        //     user: true
        // }
    });
}

export function createGirl(name, phone, userId) {
    return prisma.girl.create({
        data: {
            name,
            phone,
            userId,
        }
    });
}

export function updateProfile(id, name, phone) {
    return prisma.girl.update({
        where: {
            id,
        },
        data: {
            name,
            phone
        }
    });
}

