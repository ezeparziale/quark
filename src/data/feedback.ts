import "server-only"

import prismadb from "@/lib/prismadb"

export const getFeedbacksSSR = async (
  offset: number,
  limit: number,
  orderBy: {
    [x: string]: string
  }[],
  search?: string,
) => {
  try {
    // Get data
    const data = await prismadb.feedback.findMany({
      where: { feedback: { contains: search, mode: "insensitive" } },
      skip: offset,
      take: limit,
      orderBy,
    })

    // Get total rows
    const rowCount: number = await prismadb.feedback.count({
      where: { feedback: { contains: search } },
    })

    // Get page count
    const pageCount: number = Math.ceil(rowCount / limit)

    return { data, rowCount, pageCount }
  } catch {
    return { data: [], rowCount: 0, pageCount: 1 }
  }
}
