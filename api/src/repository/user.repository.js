
async function create(name, mail, password) {
    const user = await prisma.users.create({
        data: {
            name: name,
            mail: mail,
            password: password,
        },
    })
}