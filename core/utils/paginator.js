const paginator = {}

paginator.fromQuery = (query) => {
    const limit = query.$limit && query.$limit > 0 ? Number(query.$limit) : 10
    const skip = query.$page && query.$page > 0 ? Number((query.$page - 1) * limit) : 0

    delete query.$limit
    delete query.$page
    return {
        skip,
        limit
    }
}

export default paginator