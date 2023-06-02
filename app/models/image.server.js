import { prisma } from "~/db.server";

export function addImage(url, girlId) {
    return prisma.image.create({
        data: {
            url,
            girlId,
        }
    });
}

export function deleteImage(id) {
    return prisma.image.delete({
        where: {
            id
        }
    });
}